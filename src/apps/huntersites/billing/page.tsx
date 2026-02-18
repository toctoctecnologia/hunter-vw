import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { hunterSitesDemoData, HunterSitesOutletContext, HunterBillingRow } from '../data/demo';
import { DataTable, Column } from '../components/DataTable';
import { EmptyState } from '../components/EmptyState';

const statusBadge: Record<HunterBillingRow['status'], { tone: string; label: string }> = {
  paid: {
    tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    label: 'Pago',
  },
  pending: {
    tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
    label: 'Pendente',
  },
  overdue: {
    tone: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200',
    label: 'Em atraso',
  },
};

const columns: Column<HunterBillingRow>[] = [
  {
    id: 'reference',
    header: 'Referência',
    render: (row) => row.reference,
  },
  {
    id: 'issuedAt',
    header: 'Emissão',
    render: (row) => row.issuedAt,
  },
  {
    id: 'amount',
    header: 'Valor',
    render: (row) => row.amount,
    align: 'right',
  },
  {
    id: 'status',
    header: 'Status',
    render: (row) => (
      <Badge className={`${statusBadge[row.status].tone} border-none`}>{statusBadge[row.status].label}</Badge>
    ),
  },
  {
    id: 'actions',
    header: '',
    render: () => (
      <Button variant="ghost" size="sm" className="text-[var(--hs-accent)]">
        Baixar PDF
      </Button>
    ),
    align: 'right',
  },
];

export function HunterSitesBillingPage() {
  const context = useOutletContext<HunterSitesOutletContext>();
  const data = context?.data ?? hunterSitesDemoData;

  if (!data.billing.length) {
    return (
      <EmptyState
        title="Nenhuma fatura gerada"
        description="As cobranças aparecerão aqui assim que o plano HunterSites for ativado."
      />
    );
  }

  return <DataTable columns={columns} data={data.billing} />;
}

export default HunterSitesBillingPage;
