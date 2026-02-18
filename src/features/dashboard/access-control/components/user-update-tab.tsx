'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart } from 'recharts';
import { Users, Building } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  getUserLeadQualificationTimeMetrics,
  getUserPropertyQualificationTimeMetrics,
} from '@/features/dashboard/access-control/api/user-management';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Filters } from '@/features/dashboard/sales/components/manage-tab/filters';
import { LoadingFull } from '@/shared/components/loading-full';
import { ErrorCard } from '@/shared/components/error-card';

import type { UserLeadQualificationMetricItem, UserPropertyQualificationMetricItem } from '@/shared/types';

interface QualificationData {
  category: string;
  count: number;
  color: string;
  description: string;
}

const qualificationLabels: Record<string, string> = {
  RECENT: 'Recente',
  ATTENTION: 'Atenção',
  URGENT: 'Urgente',
};

const qualificationColors: Record<string, string> = {
  RECENT: '#22c55e',
  ATTENTION: '#eab308',
  URGENT: '#ef4444',
};

const leadQualificationDescriptions: Record<string, string> = {
  RECENT: 'Até 25 dias de contato',
  ATTENTION: '26 a 30 dias de contato',
  URGENT: 'Acima de 30 dias de contato',
};

const propertyQualificationDescriptions: Record<string, string> = {
  RECENT: 'Até 25 dias de atualização',
  ATTENTION: '26 a 30 dias de atualização',
  URGENT: 'Acima de 30 dias de atualização',
};

interface QualificationChartProps {
  title: string;
  icon: React.ReactNode;
  qualifications: QualificationData[];
}

function QualificationChart({ title, icon, qualifications }: QualificationChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const totalCount = qualifications.reduce((sum, qual) => sum + qual.count, 0);

  if (qualifications.length === 0 || totalCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig: ChartConfig = qualifications.reduce(
    (acc, qual, index) => ({
      ...acc,
      [index]: { label: qual.category },
    }),
    {} as ChartConfig,
  );

  const chartData =
    selectedIndex !== null
      ? [
          {
            type: selectedIndex.toString(),
            value: qualifications[selectedIndex].count,
            color: qualifications[selectedIndex].color,
          },
        ]
      : qualifications.map((qual, index) => ({
          type: index.toString(),
          value: qual.count,
          color: qual.color,
        }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Gráfico */}
          <div className="flex items-center justify-center">
            <ChartContainer config={chartConfig} className="aspect-square w-full max-h-[250px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div>
                          <span className="block">{qualifications[Number(name)].category}</span>
                          <small>
                            {value} {(value as number) > 1 ? 'itens' : 'item'}
                          </small>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="type"
                  innerRadius={60}
                  paddingAngle={selectedIndex === null ? 4 : 0}
                  onClick={(_, index) => {
                    if (selectedIndex === null) {
                      setSelectedIndex(index);
                    }
                  }}
                >
                  {chartData.map(({ color }, index) => (
                    <Cell key={index} fill={color} className="cursor-pointer hover:opacity-80" />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          {/* Dados */}
          <div className="flex flex-col justify-center space-y-4">
            {/* Total no período */}
            <button
              onClick={() => setSelectedIndex(null)}
              className={`rounded-lg border p-4 text-left transition-all hover:bg-muted/50 ${
                selectedIndex === null ? 'border-primary bg-muted/50' : 'border-border'
              }`}
            >
              <p className="text-sm font-medium text-muted-foreground">Total no período</p>
              <p className="text-3xl font-bold">{totalCount}</p>
            </button>

            {/* Categorias */}
            {qualifications.map((qual, index) => {
              const isSelected = selectedIndex === index;
              const percentage = ((qual.count / totalCount) * 100).toFixed(1);

              return (
                <button
                  key={qual.category}
                  onClick={() => setSelectedIndex(isSelected ? null : index)}
                  className={`rounded-lg border p-4 text-left transition-all hover:bg-muted/50 ${
                    isSelected ? 'border-primary bg-muted/50' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: qual.color }} />
                      <div>
                        <p className="text-sm font-semibold">{qual.category}</p>
                        <p className="text-xs text-muted-foreground">{qual.description}</p>
                      </div>
                    </div>
                    <div className="text-right ml-1">
                      <p className="text-xl font-bold">{qual.count}</p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Data de atualização */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Atualizado em {format(new Date(), "dd 'de' MMM. 'de' yyyy, HH:mm", { locale: ptBR })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface UserUpdateTabProps {
  userUuid: string;
}

export function UserUpdateTab({ userUuid }: UserUpdateTabProps) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  const month = parseInt(selectedMonth, 10);
  const year = parseInt(selectedYear, 10);

  const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd');
  const endDate = format(new Date(year, month, 0), 'yyyy-MM-dd');

  const {
    data: leadMetrics,
    isLoading: isLoadingLeads,
    error: leadError,
  } = useQuery({
    queryKey: ['user-lead-qualification-metrics', userUuid, month, year],
    queryFn: () => getUserLeadQualificationTimeMetrics(userUuid, month, year),
    enabled: !!userUuid,
  });

  const {
    data: propertyMetrics,
    isLoading: isLoadingProperties,
    error: propertyError,
  } = useQuery({
    queryKey: ['user-property-qualification-metrics', userUuid, startDate, endDate],
    queryFn: () => getUserPropertyQualificationTimeMetrics(userUuid, startDate, endDate),
    enabled: !!userUuid,
  });

  const isLoading = isLoadingLeads || isLoadingProperties;
  const error = leadError || propertyError;

  if (isLoading) return <LoadingFull title="Carregando métricas de atualização..." />;
  if (error) return <ErrorCard error={error} title="Erro ao carregar métricas de atualização" />;

  const leadQualifications: QualificationData[] =
    leadMetrics?.map((metric: UserLeadQualificationMetricItem) => ({
      category: qualificationLabels[metric.leadQualification] || metric.leadQualification,
      count: metric.totalLeads,
      color: qualificationColors[metric.leadQualification] || '#000',
      description: leadQualificationDescriptions[metric.leadQualification] || '',
    })) || [];

  const propertyQualifications: QualificationData[] =
    propertyMetrics?.map((metric: UserPropertyQualificationMetricItem) => ({
      category: qualificationLabels[metric.propertyQualification] || metric.propertyQualification,
      count: metric.totalProperties,
      color: qualificationColors[metric.propertyQualification] || '#000',
      description: propertyQualificationDescriptions[metric.propertyQualification] || '',
    })) || [];

  return (
    <div className="space-y-4">
      <Filters
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <QualificationChart
          title="Gestão de Clientes"
          icon={<Users className="h-5 w-5" />}
          qualifications={leadQualifications}
        />

        <QualificationChart
          title="Gestão de Imóveis"
          icon={<Building className="h-5 w-5" />}
          qualifications={propertyQualifications}
        />
      </div>
    </div>
  );
}
