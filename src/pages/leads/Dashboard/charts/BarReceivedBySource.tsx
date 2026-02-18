import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface BarReceivedBySourceProps {
  data: Record<string, number>;
}

export default function BarReceivedBySource({ data }: BarReceivedBySourceProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  return (
    <figure>
      <ChartContainer
        config={{ value: { label: 'Leads', color: 'hsl(var(--primary))' } }}
        className="h-64"
        aria-hidden="true"
      >
        <BarChart data={chartData}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
          <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'transparent' }} />
        </BarChart>
      </ChartContainer>
      <figcaption className="sr-only">
        Gráfico de barras exibindo leads recebidos por origem
      </figcaption>
    </figure>
  );
}

