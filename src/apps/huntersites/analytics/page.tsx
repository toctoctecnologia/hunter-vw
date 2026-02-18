import { useOutletContext } from 'react-router-dom';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { hunterSitesDemoData, HunterSitesOutletContext, HunterAnalyticsRow } from '../data/demo';
import { DataTable, Column } from '../components/DataTable';
import { EmptyState } from '../components/EmptyState';

const columns: Column<HunterAnalyticsRow>[] = [
  {
    id: 'source',
    header: 'Origem',
    render: (row) => <span className="font-medium text-[var(--hs-text-primary)]">{row.source}</span>,
  },
  {
    id: 'visitors',
    header: 'Visitantes',
    render: (row) => row.visitors.toLocaleString('pt-BR'),
    align: 'right',
  },
  {
    id: 'leads',
    header: 'Leads',
    render: (row) => row.leads.toLocaleString('pt-BR'),
    align: 'right',
  },
  {
    id: 'conversion',
    header: 'Conversão',
    render: (row) => `${row.conversion.toFixed(1)}%`,
    align: 'right',
  },
  {
    id: 'trend',
    header: 'Tendência',
    render: (row) => (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
          row.trend === 'up'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
            : row.trend === 'down'
            ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200'
            : 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200'
        }`}
      >
        {row.trend === 'up' && <TrendingUp className="h-4 w-4" />}
        {row.trend === 'down' && <TrendingDown className="h-4 w-4" />}
        {row.trend === 'neutral' && 'Estável'}
        {row.trend === 'up' && 'Em alta'}
        {row.trend === 'down' && 'Em baixa'}
      </span>
    ),
    align: 'right',
  },
];

export function HunterSitesAnalyticsPage() {
  const context = useOutletContext<HunterSitesOutletContext>();
  const data = context?.data ?? hunterSitesDemoData;

  if (!data.analytics.length) {
    return (
      <EmptyState
        title="Sem dados de analytics ainda"
        description="Conecte seus pixels e integrações para acompanhar a performance em tempo real."
      />
    );
  }

  return <DataTable columns={columns} data={data.analytics} />;
}

export default HunterSitesAnalyticsPage;
