'use client';
import { useMemo, useState } from 'react';
import { AuditEvent, AuditEventType, PeriodKey } from '../types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserAuditTableProps {
  data: AuditEvent[] | null;
  loading?: boolean;
  error?: string | null;
}

export default function UserAuditTable({ data, loading, error }: UserAuditTableProps) {
  const [q, setQ] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [period, setPeriod] = useState<PeriodKey>('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const filtered = useMemo(() => {
    const now = new Date();
    const { startDate, endDate } = (() => {
      if (period === 'today') {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return { startDate: d, endDate: now };
      }
      if (period === 'custom') {
        const start = customStart ? new Date(customStart) : new Date(0);
        start.setHours(0, 0, 0, 0);
        const end = customEnd ? new Date(customEnd) : now;
        end.setHours(23, 59, 59, 999);
        return { startDate: start, endDate: end };
      }
      const days = parseInt(period, 10);
      return {
        startDate: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
        endDate: now,
      };
    })();

    const events = data ?? [];
    return events
      .filter((e) => {
        const eventDate = new Date(e.ts);
        const inPeriod = eventDate >= startDate && eventDate <= endDate;
        const matchQ = q
          ? e.label?.toLowerCase().includes(q.toLowerCase()) ||
            e.targetId?.includes(q) ||
            e.type.toLowerCase().includes(q.toLowerCase())
          : true;
        const matchT = selectedType === 'all' || selectedType === e.type;
        return matchQ && matchT && inPeriod;
      })
      .sort((a, b) => b.ts.localeCompare(a.ts));
  }, [data, q, selectedType, period, customStart, customEnd]);

  const maskIp = (ip?: string) =>
    ip ? ip.replace(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/, '***.***.***.$4') : '';

  const getEventBadge = (type: AuditEventType) => {
    const variants: Record<AuditEventType, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      login: 'default',
      view_property: 'secondary',
      view_owner_phone: 'outline',
      download_photos: 'secondary',
      lead_update: 'default',
      schedule_visit: 'default',
      upload_photos: 'secondary',
      share_listing: 'outline',
      export_csv: 'outline',
      custom: 'outline',
      user_status_change: 'secondary',
      roletao_toggle: 'secondary',
      health_snapshot_recomputed: 'secondary',
      checkpoint_update: 'default',
      temporary_suspension_set: 'destructive',
      temporary_suspension_cleared: 'default',
    };
    return variants[type] || 'default';
  };

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Filtros */}
      <div className="rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar evento, tipo ou ID"
              className="h-10 rounded-lg border-border/40 bg-background/50"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="view_property">Ver imóvel</SelectItem>
                <SelectItem value="view_owner_phone">Ver telefone</SelectItem>
                <SelectItem value="download_photos">Download fotos</SelectItem>
                <SelectItem value="lead_update">Atualizar lead</SelectItem>
                <SelectItem value="schedule_visit">Agendar visita</SelectItem>
                <SelectItem value="upload_photos">Upload fotos</SelectItem>
                <SelectItem value="share_listing">Compartilhar</SelectItem>
                <SelectItem value="export_csv">Exportar CSV</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={period} onValueChange={(value: string) => setPeriod(value as PeriodKey)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="15d">15 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            {period === 'custom' && (
              <>
                <Input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-[150px]"
                />
                <Input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-[150px]"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabela de Auditoria */}
      <div className="rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-border/20 bg-muted/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Detalhe
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Alvo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Metadados
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-2xl">🔍</div>
                      <div className="text-muted-foreground font-medium">Nenhum evento encontrado</div>
                      <div className="text-sm text-muted-foreground">Tente ajustar os filtros de pesquisa</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((e: AuditEvent) => (
                  <tr key={e.id} className="group hover:bg-muted/20 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap font-mono">
                      {new Date(e.ts).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <Badge 
                        variant={getEventBadge(e.type)}
                        className="font-medium shadow-sm"
                      >
                        {e.type.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {e.label || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {e.targetId || '-'}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground max-w-xs truncate font-mono bg-muted/20 rounded px-2 py-1">
                      {e.meta ? JSON.stringify(e.meta) : '-'}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                      {maskIp(e.ip) || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
