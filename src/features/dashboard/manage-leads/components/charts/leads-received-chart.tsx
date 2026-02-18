'use client';

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { LeadByItem } from '@/shared/types';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const chartConfig = {
  count: { label: 'Leads', color: '#FF6600' },
} satisfies ChartConfig;

interface LeadsBySourceChartProps {
  data: LeadByItem[];
}

function LeadsBySourceChart({ data }: LeadsBySourceChartProps) {
  const chartData = data.map((item) => ({
    label: item.label,
    count: item.count,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-75 w-full">
      <BarChart data={chartData} margin={{ bottom: 80 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis type="number" tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="block">
                  {value} {Number(value) > 1 ? 'leads' : 'lead'}
                </span>
              )}
            />
          }
        />
        <Bar dataKey="count" fill={chartConfig.count.color} radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

interface LeadsBySellerChartProps {
  data: LeadByItem[];
}

function LeadsBySellerChart({ data }: LeadsBySellerChartProps) {
  const chartData = data.map((item) => ({
    label: item.label,
    count: item.count,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-75 w-full">
      <LineChart data={chartData} margin={{ bottom: 80 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis type="number" tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="block">
                  {value} {Number(value) > 1 ? 'leads' : 'lead'}
                </span>
              )}
            />
          }
        />
        <Line
          dataKey="count"
          stroke={chartConfig.count.color}
          strokeWidth={2}
          dot={{ fill: chartConfig.count.color }}
        />
      </LineChart>
    </ChartContainer>
  );
}

interface LeadsByDayChartProps {
  data: LeadByItem[];
}

function LeadsByDayChart({ data }: LeadsByDayChartProps) {
  const chartData = data.map((item) => ({
    label: item.label,
    count: item.count,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-75 w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis type="number" tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="block">
                  {value} {Number(value) > 1 ? 'leads' : 'lead'}
                </span>
              )}
            />
          }
        />
        <Bar dataKey="count" fill={chartConfig.count.color} radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

interface LeadsReceivedChartProps {
  bySource: LeadByItem[];
  bySeller: LeadByItem[];
  byDay: LeadByItem[];
}

export function LeadsReceivedChart({ bySource, bySeller, byDay }: LeadsReceivedChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Recebidos</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="source">
          <TabsList>
            <TabsTrigger value="source">Por fonte</TabsTrigger>
            <TabsTrigger value="seller">Por vendedor</TabsTrigger>
            <TabsTrigger value="day">Por dia</TabsTrigger>
          </TabsList>

          <TabsContent value="source" className="mt-4">
            <LeadsBySourceChart data={bySource} />
          </TabsContent>

          <TabsContent value="seller" className="mt-4">
            <LeadsBySellerChart data={bySeller} />
          </TabsContent>

          <TabsContent value="day" className="mt-4">
            <LeadsByDayChart data={byDay} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
