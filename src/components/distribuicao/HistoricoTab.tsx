import { useState, type ComponentType } from 'react';
import { ArrowLeftRight, CircleDot, Share2, Undo2, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import useDistributionHistory, {
  type DistHistoryFilters,
  type DistHistoryItem,
} from './useDistributionHistory';

const ACTION_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  assign: Share2,
  move: ArrowLeftRight,
  return: Undo2,
};

function iconForAction(action: string) {
  return ACTION_ICONS[action] || CircleDot;
}

function labelFromAction(item: DistHistoryItem) {
  switch (item.action) {
    case 'assign':
      return `Distribuiu lead #${item.lead}`;
    case 'move':
      return `Moveu lead #${item.lead}`;
    case 'return':
      return `Devolveu lead #${item.lead}`;
    default:
      return item.action;
  }
}

function getIconBgColor(action: string) {
  switch (action) {
    case 'assign':
      return 'bg-blue-100';
    case 'move':
      return 'bg-green-100';
    case 'return':
      return 'bg-purple-100';
    default:
      return 'bg-gray-100';
  }
}

function getIconColor(action: string) {
  switch (action) {
    case 'assign':
      return 'text-blue-600';
    case 'move':
      return 'text-green-600';
    case 'return':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
}

export default function HistoricoTab() {
  const [filters, setFilters] = useState<DistHistoryFilters>({});
  const { items, loading } = useDistributionHistory(filters);

  const handleChange = (field: keyof DistHistoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Filtros inline no topo */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          id="tipo"
          className="h-10 rounded-lg border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none min-w-[140px]"
          value={filters.action ?? 'all'}
          onChange={(e) => handleChange('action', e.target.value === 'all' ? '' : e.target.value)}
        >
          <option value="all">Tipo de ação</option>
          <option value="assign">Distribuição</option>
          <option value="move">Movimentação</option>
          <option value="return">Devolução</option>
        </select>

        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="usuario"
            placeholder="Usuário"
            value={filters.user ?? ''}
            onChange={(e) => handleChange('user', e.target.value)}
            className="pl-9 h-10 min-w-[150px] focus-visible:ring-primary/25"
          />
        </div>

        <Input
          id="queue"
          placeholder="Time/Fila"
          value={filters.queue ?? ''}
          onChange={(e) => handleChange('queue', e.target.value)}
          className="h-10 min-w-[120px] focus-visible:ring-primary/25"
        />

        <Input
          type="date"
          placeholder="Data início"
          value={filters.start ?? ''}
          onChange={(e) => handleChange('start', e.target.value)}
          className="h-10 min-w-[140px] focus-visible:ring-primary/25"
        />

        <Input
          type="date"
          placeholder="Data fim"
          value={filters.end ?? ''}
          onChange={(e) => handleChange('end', e.target.value)}
          className="h-10 min-w-[140px] focus-visible:ring-primary/25"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Histórico de Atividades</h2>

        <div className="space-y-3">
          {items.map((item) => {
            const Icon = iconForAction(item.action);
            const bgColor = getIconBgColor(item.action);
            const iconColor = getIconColor(item.action);

            return (
              <div key={item.id} className="flex gap-4 rounded-xl border bg-card/60 p-4 shadow-sm">
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center ring-4 ring-inset ring-background`}
                >
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{labelFromAction(item)}</h3>
                      <p className="text-sm text-muted-foreground">{item.details || labelFromAction(item)}</p>
                    </div>
                    {item.action === 'assign' && item.details?.includes('sensível') && (
                      <Badge variant="destructive" className="text-xs">
                        Dado sensível
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{new Date(item.ts).toLocaleString('pt-BR')}</span>
                    {item.user && <span>IP: 192.168.xxx.xxx</span>}
                    {item.lead && <span>ID: {item.lead}</span>}
                  </div>
                </div>
              </div>
            );
          })}
          
          {!loading && items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum histórico encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

