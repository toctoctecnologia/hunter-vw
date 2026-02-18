import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, FileText, DollarSign, Edit, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EventoHistorico {
  id: string;
  tipo: 'criacao' | 'status' | 'pagamento' | 'edicao' | 'observacao';
  descricao: string;
  autor: string;
  data: string;
  hora: string;
}

interface RepasseHistoricoCardProps {
  eventos: EventoHistorico[];
}

const iconMap = {
  criacao: FileText,
  status: Clock,
  pagamento: DollarSign,
  edicao: Edit,
  observacao: User,
};

const colorMap = {
  criacao: 'bg-[hsl(var(--accent)/0.16)] text-[hsl(var(--accent))]',
  status: 'bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]',
  pagamento: 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
  edicao: 'bg-[hsl(var(--accent)/0.16)] text-[hsl(var(--accent))]',
  observacao: 'bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)]',
};

export function RepasseHistoricoCard({ eventos }: RepasseHistoricoCardProps) {
  return (
    <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
          <History className="w-4 h-4" />
          Histórico
        </CardTitle>
      </CardHeader>
      <CardContent>
        {eventos.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-8 h-8 mx-auto text-[var(--ui-text-subtle)] opacity-50 mb-2" />
            <p className="text-sm text-[var(--ui-text-subtle)]">Nenhum evento registrado</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-2 bottom-2 w-px bg-[var(--ui-stroke)]" />

            <div className="space-y-4">
              {eventos.map((evento, index) => {
                const Icon = iconMap[evento.tipo];
                return (
                  <div key={evento.id} className="relative flex gap-4 pl-2">
                    {/* Icon */}
                    <div
                      className={cn(
                        'relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        colorMap[evento.tipo]
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <p className="text-sm text-[var(--ui-text)]">{evento.descricao}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[var(--ui-text-subtle)]">
                        <span>{evento.autor}</span>
                        <span>•</span>
                        <span>{evento.data}</span>
                        <span>às</span>
                        <span>{evento.hora}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RepasseHistoricoCard;
