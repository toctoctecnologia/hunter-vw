import { LineChart, Line, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface LineReceivedBySellerProps {
  data: Record<string, number>;
}

export default function LineReceivedBySeller({ data }: LineReceivedBySellerProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  return (
    <figure>
      <ChartContainer
        config={{ value: { label: 'Leads', color: 'hsl(var(--primary))' } }}
        className="h-64"
        aria-hidden="true"
      >
        <LineChart data={chartData} margin={{ top: 16, left: 12, right: 12 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot />
          <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: 'var(--border)' }} />
        </LineChart>
      </ChartContainer>
      <figcaption className="sr-only">
        Gráfico de linhas mostrando leads recebidos por vendedor
      </figcaption>
    </figure>
  );
}

