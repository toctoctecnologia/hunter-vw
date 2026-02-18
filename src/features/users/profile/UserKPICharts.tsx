'use client';
import { KpiDetalhado } from '../types';
import UserFunnelChart from './UserFunnelChart';
import UserVacancyHeat from './UserVacancyHeat';
import UserCloseTimeChart from './UserCloseTimeChart';
import UserResponseTimeChart from './UserResponseTimeChart';

interface UserKPIChartsProps {
  data: KpiDetalhado | null;
  loading?: boolean;
  error?: string | null;
}

export default function UserKPICharts({ data, loading, error }: UserKPIChartsProps) {
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-6">
            <UserFunnelChart loading={loading} />
            <UserCloseTimeChart loading={loading} />
          </div>
          <div className="xl:col-span-5 space-y-6">
            <UserVacancyHeat loading={loading} />
            <UserResponseTimeChart loading={loading} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const funnelData = data ? [
    { name: 'Leads', value: data.funilConversao.leads, color: 'hsl(var(--primary))' },
    { name: 'Visitas', value: data.funilConversao.visitas, color: 'hsl(var(--primary))' },
    { name: 'Propostas', value: data.funilConversao.propostas, color: 'hsl(var(--primary))' },
    { name: 'Vendas', value: data.funilConversao.vendas, color: 'hsl(var(--primary))' }
  ] : undefined;

  const vacancyData = data?.vacancia?.map(v => ({
    mes: v.mes,
    vendeu: v.vendeu,
    vendasQtd: v.vendasQtd
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <UserFunnelChart data={funnelData} />
          <UserCloseTimeChart />
        </div>
        <div className="xl:col-span-5 space-y-6">
          <UserVacancyHeat data={vacancyData} />
          <UserResponseTimeChart />
        </div>
      </div>
    </div>
  );
}
