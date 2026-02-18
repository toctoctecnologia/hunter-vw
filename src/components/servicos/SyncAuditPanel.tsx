import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SyncAuditRecord, Ticket } from '@/types/service-management';
import { listSyncAudit, reprocessSync } from '@/services/serviceTickets';
import { toast } from '@/hooks/use-toast';

interface SyncAuditPanelProps {
  tickets: Ticket[];
  onReprocess?: () => void;
}

export const SyncAuditPanel = ({ tickets, onReprocess }: SyncAuditPanelProps) => {
  const [audit, setAudit] = useState<SyncAuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAudit = async () => {
    setLoading(true);
    try {
      const data = await listSyncAudit();
      setAudit(data);
    } catch (err) {
      toast({
        title: 'Erro ao carregar auditoria',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, []);

  const summary = useMemo(() => {
    return audit.reduce(
      (acc, record) => {
        acc.total += 1;
        acc[record.status] += 1;
        return acc;
      },
      { total: 0, success: 0, error: 0 }
    );
  }, [audit]);

  const handleReprocess = async (ticketId: string) => {
    try {
      await reprocessSync(ticketId);
      toast({
        title: 'Sincronização reprocessada',
        description: 'Os vínculos foram atualizados com sucesso.'
      });
      loadAudit();
      onReprocess?.();
    } catch (err) {
      toast({
        title: 'Erro ao reprocessar',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Sincronizações registradas</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{summary.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Sucesso</p>
          <p className="mt-2 text-2xl font-semibold text-success">{summary.success}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Erros</p>
          <p className="mt-2 text-2xl font-semibold text-danger">{summary.error}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Últimas sincronizações</h3>
            <p className="text-xs text-muted-foreground">Eventos recentes entre Serviços, Tarefas e Agenda.</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadAudit} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="h-24 animate-pulse rounded-xl border border-border bg-muted" />
          ) : audit.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum registro de sincronização ainda.</p>
          ) : (
            audit.map(record => {
              const ticket = tickets.find(item => item.id === record.ticketId);
              return (
                <div key={record.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {record.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-danger" />
                      )}
                      <p className="text-sm font-semibold">{ticket?.code ?? record.ticketId}</p>
                      <Badge variant="secondary">{record.type === 'task' ? 'Tarefa' : 'Agenda'}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{record.message}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(record.createdAt).toLocaleString('pt-BR')}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReprocess(record.ticketId)}
                    >
                      Reprocessar
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};
