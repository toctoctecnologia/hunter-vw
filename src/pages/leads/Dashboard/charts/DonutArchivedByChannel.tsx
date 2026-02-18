import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface DonutArchivedByChannelProps {
  data: Record<string, number>;
}

export default function DonutArchivedByChannel({ data }: DonutArchivedByChannelProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0'];
  const config = chartData.reduce(
    (acc, curr, idx) => ({
      ...acc,
      [curr.name]: { label: curr.name, color: COLORS[idx % COLORS.length] },
    }),
    {}
  );

  return (
    <figure>
      <ChartContainer config={config} className="h-64" aria-hidden="true">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ChartContainer>
      <figcaption className="sr-only">
        Gráfico de rosca mostrando leads arquivados por canal
      </figcaption>
    </figure>
  );
}

