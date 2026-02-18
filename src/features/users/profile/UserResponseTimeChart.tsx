'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResponseTimeData {
  semana: string;
  minutos: number;
}

interface Props {
  data?: ResponseTimeData[];
  loading?: boolean;
}

const defaultData: ResponseTimeData[] = [
  { semana: 'S1', minutos: 18 },
  { semana: 'S2', minutos: 15 },
  { semana: 'S3', minutos: 12 },
  { semana: 'S4', minutos: 14 },
  { semana: 'S5', minutos: 16 },
  { semana: 'S6', minutos: 11 }
];

export default function UserResponseTimeChart({ data = defaultData, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm animate-fade-in">
        <div className="mb-4">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-48 bg-muted/30 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Tempo médio de resposta</h3>
        <p className="text-sm text-muted-foreground mt-1">Por semana em minutos</p>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="semana" 
              tickLine={false} 
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '14px'
              }}
              formatter={(value: number) => [`${value} min`, 'Tempo médio']}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line 
              type="monotone" 
              dataKey="minutos" 
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 6 }}
              activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}