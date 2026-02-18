'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CloseTimeData {
  mes: string;
  dias: number;
}

interface Props {
  data?: CloseTimeData[];
  loading?: boolean;
}

const defaultData: CloseTimeData[] = [
  { mes: 'Jan', dias: 42 },
  { mes: 'Fev', dias: 38 },
  { mes: 'Mar', dias: 33 },
  { mes: 'Abr', dias: 41 },
  { mes: 'Mai', dias: 29 },
  { mes: 'Jun', dias: 36 }
];

export default function UserCloseTimeChart({ data = defaultData, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm animate-fade-in">
        <div className="mb-4">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-56 bg-muted/30 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Tempo médio de fechamento</h3>
        <p className="text-sm text-muted-foreground mt-1">Evolução em dias por mês</p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="closeTimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="mes" 
              tickLine={false} 
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '14px'
              }}
              formatter={(value: number) => [`${value} dias`, 'Tempo médio']}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area 
              type="monotone" 
              dataKey="dias" 
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#closeTimeGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}