'use client';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HistoryEvent {
  id: string;
  tipo: 'lead_recebido' | 'visita_agendada' | 'proposta_enviada' | 'venda_concluida' | 'indicacao_cadastrada' | 'feedback_recebido';
  data: string;
  descricao: string;
  imovel?: string;
  valor?: number;
  status?: string;
}

interface Props {
  events?: HistoryEvent[];
  loading?: boolean;
}

const defaultEvents: HistoryEvent[] = [
  {
    id: '1',
    tipo: 'venda_concluida',
    data: '2025-01-15T10:30:00Z',
    descricao: 'Venda finalizada',
    imovel: 'Apto Jardins, 120m²',
    valor: 890000,
    status: 'Concluída'
  },
  {
    id: '2',
    tipo: 'proposta_enviada',
    data: '2025-01-14T15:45:00Z',
    descricao: 'Proposta enviada para cliente',
    imovel: 'Casa Alphaville',
    valor: 1200000,
    status: 'Aguardando'
  },
  {
    id: '3',
    tipo: 'visita_agendada',
    data: '2025-01-13T09:15:00Z',
    descricao: 'Visita agendada',
    imovel: 'Cobertura Premium',
    status: 'Confirmada'
  },
  {
    id: '4',
    tipo: 'lead_recebido',
    data: '2025-01-12T14:20:00Z',
    descricao: 'Novo lead recebido',
    imovel: 'Apto Centro',
    status: 'Em contato'
  },
  {
    id: '5',
    tipo: 'indicacao_cadastrada',
    data: '2025-01-11T11:00:00Z',
    descricao: 'Indicação de Helena Almeida',
    status: 'Cadastrada'
  },
  {
    id: '6',
    tipo: 'feedback_recebido',
    data: '2025-01-10T16:30:00Z',
    descricao: 'Feedback positivo de João Silva',
    imovel: 'Torre Premium',
    status: '5 estrelas'
  }
];

export default function UserHistoryTimeline({ events = defaultEvents, loading }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [period, setPeriod] = useState('30d');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = searchQuery === '' || 
        event.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.imovel?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || event.tipo === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, selectedType]);

  const getEventIcon = (tipo: HistoryEvent['tipo']) => {
    const icons = {
      venda_concluida: '✅',
      proposta_enviada: '📋',
      visita_agendada: '📅',
      lead_recebido: '👤',
      indicacao_cadastrada: '🤝',
      feedback_recebido: '⭐'
    };
    return icons[tipo] || '📝';
  };

  const getEventBadgeVariant = (tipo: HistoryEvent['tipo']) => {
    const variants = {
      venda_concluida: 'default' as const,
      proposta_enviada: 'secondary' as const,
      visita_agendada: 'outline' as const,
      lead_recebido: 'secondary' as const,
      indicacao_cadastrada: 'outline' as const,
      feedback_recebido: 'default' as const
    };
    return variants[tipo] || 'secondary' as const;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm">
          <div className="h-6 w-40 bg-muted animate-pulse rounded mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted/30 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filtros */}
      <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por evento, imóvel ou descrição"
              className="h-10 rounded-lg border-border/40 bg-background/50"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os eventos</SelectItem>
                <SelectItem value="venda_concluida">Vendas</SelectItem>
                <SelectItem value="proposta_enviada">Propostas</SelectItem>
                <SelectItem value="visita_agendada">Visitas</SelectItem>
                <SelectItem value="lead_recebido">Leads</SelectItem>
                <SelectItem value="indicacao_cadastrada">Indicações</SelectItem>
                <SelectItem value="feedback_recebido">Feedbacks</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Histórico comercial</h3>
          <p className="text-sm text-muted-foreground mt-1">Cronologia das atividades comerciais</p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-muted-foreground font-medium">Nenhum evento encontrado</div>
            <div className="text-sm text-muted-foreground mt-1">Tente ajustar os filtros de pesquisa</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id}
                className="relative flex items-start space-x-4 p-4 rounded-xl border border-border/20 bg-background/30 hover:bg-background/50 transition-colors duration-200"
              >
                {/* Timeline line */}
                {index !== filteredEvents.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-border/30" />
                )}
                
                {/* Icon */}
                <div className="flex-shrink-0 w-8 h-8 bg-background border border-border/40 rounded-full flex items-center justify-center text-sm shadow-sm">
                  {getEventIcon(event.tipo)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Badge variant={getEventBadgeVariant(event.tipo)} className="font-medium">
                        {event.tipo.replace(/_/g, ' ')}
                      </Badge>
                      <time className="text-sm text-muted-foreground font-mono">
                        {new Date(event.data).toLocaleString('pt-BR')}
                      </time>
                    </div>
                    {event.valor && (
                      <div className="text-lg font-semibold text-foreground">
                        {formatCurrency(event.valor)}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-foreground font-medium mb-1">
                    {event.descricao}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {event.imovel && (
                      <span className="flex items-center space-x-1">
                        <span>🏠</span>
                        <span>{event.imovel}</span>
                      </span>
                    )}
                    {event.status && (
                      <span className="flex items-center space-x-1">
                        <span>📋</span>
                        <span>{event.status}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}