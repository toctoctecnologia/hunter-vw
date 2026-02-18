'use client';
import { useState } from 'react';

interface VacancyMonth {
  mes: string;
  vendeu: boolean;
  vendasQtd: number;
}

interface Props {
  data?: VacancyMonth[];
  loading?: boolean;
}

const defaultData: VacancyMonth[] = [
  { mes: '2024-11', vendeu: false, vendasQtd: 0 },
  { mes: '2024-12', vendeu: true, vendasQtd: 2 },
  { mes: '2025-01', vendeu: true, vendasQtd: 1 },
  { mes: '2025-02', vendeu: false, vendasQtd: 0 },
  { mes: '2025-03', vendeu: true, vendasQtd: 3 },
  { mes: '2025-04', vendeu: true, vendasQtd: 1 },
  { mes: '2025-05', vendeu: false, vendasQtd: 0 }
];

export default function UserVacancyHeat({ data = defaultData, loading }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex !== null ? data[activeIndex] : null;

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm animate-fade-in">
        <div className="mb-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 w-14 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const formatMonthName = (mes: string) => {
    return new Date(mes + '-01').toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Vacância Mensal</h3>
          <p className="text-sm text-muted-foreground">Clique para detalhes</p>
        </div>
      </div>
      
      {activeItem && (
        <div className="mb-6 rounded-xl bg-muted/30 border border-border/20 p-4 animate-fade-in">
          <div className="font-medium text-foreground capitalize">
            {formatMonthName(activeItem.mes)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {activeItem.vendeu ? (
              <span className="text-emerald-600 font-medium">
                ✅ Vendeu • {activeItem.vendasQtd} imóvel{activeItem.vendasQtd !== 1 ? 'is' : ''}
              </span>
            ) : (
              <span className="text-red-600 font-medium">
                ❌ Não vendeu
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        {data.map((month, index) => (
          <button
            key={month.mes}
            onClick={() => setActiveIndex(index === activeIndex ? null : index)}
            className={`
              h-10 w-14 rounded-xl border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20
              ${month.vendeu 
                ? 'bg-emerald-500/90 border-emerald-600 text-white shadow-emerald-500/20' 
                : 'bg-red-500/90 border-red-600 text-white shadow-red-500/20'
              }
              ${activeIndex === index ? 'ring-2 ring-foreground/20 scale-105' : ''}
              shadow-lg hover:shadow-xl
            `}
            title={`${formatMonthName(month.mes)} - ${month.vendeu ? 'Vendeu' : 'Não vendeu'}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
          <span>Vendeu</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500 shadow-sm" />
          <span>Não vendeu</span>
        </div>
      </div>
    </div>
  );
}