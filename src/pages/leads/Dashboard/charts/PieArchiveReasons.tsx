import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface PieArchiveReasonsProps {
  data: Record<string, number>;
}

export default function PieArchiveReasons({ data }: PieArchiveReasonsProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const COLORS = ['#A020F0', '#FF6666', '#8dd1e1', '#d0ed57', '#ffc658'];
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
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80} label>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ChartContainer>
      <figcaption className="sr-only">
        Gráfico de pizza mostrando motivos de arquivamento de leads
      </figcaption>
    </figure>
  );
}

