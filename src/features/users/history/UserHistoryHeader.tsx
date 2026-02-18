'use client';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface ActivityData {
  dia: string;
  eventos: number;
}

interface Props {
  activityData?: ActivityData[];
  loading?: boolean;
}

const defaultActivityData: ActivityData[] = [
  { dia: '01', eventos: 12 },
  { dia: '02', eventos: 8 },
  { dia: '03', eventos: 15 },
  { dia: '04', eventos: 6 },
  { dia: '05', eventos: 18 },
  { dia: '06', eventos: 14 },
  { dia: '07', eventos: 9 }
];

const summaryCards = [
  { label: 'Logins 30d', value: '24', icon: '🔐' },
  { label: 'Leads atualizados', value: '156', icon: '📝' },
  { label: 'Imóveis visualizados', value: '89', icon: '👁️' },
  { label: 'Arquivos baixados', value: '42', icon: '📁' }
];

export default function UserHistoryHeader({ activityData = defaultActivityData, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm">
              <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
              <div className="h-8 w-12 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm">
          <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4" />
          <div className="h-32 bg-muted/30 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div 
            key={index}
            className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
              </div>
              <div className="text-2xl opacity-60">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Atividade diária</h3>
          <p className="text-sm text-muted-foreground mt-1">Eventos registrados nos últimos 7 dias</p>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="eventos" 
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#activityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}