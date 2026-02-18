'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FunnelData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data?: FunnelData[];
  loading?: boolean;
}

const defaultData: FunnelData[] = [
  { name: 'Leads', value: 180, color: 'hsl(var(--primary))' },
  { name: 'Visitas', value: 72, color: 'hsl(var(--primary))' },
  { name: 'Propostas', value: 18, color: 'hsl(var(--primary))' },
  { name: 'Vendas', value: 5, color: 'hsl(var(--primary))' }
];

export default function UserFunnelChart({ data = defaultData, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm animate-fade-in">
        <div className="mb-4">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-64 bg-muted/30 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Funil de Conversão</h3>
        <p className="text-sm text-muted-foreground mt-1">Jornada do lead até a venda</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '14px'
              }}
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}