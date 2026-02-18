import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { User2 } from 'lucide-react';

import { NegotiationFilters } from '@/shared/types';

import { getLeads } from '@/features/dashboard/sales/api/lead';

import { LeadCard } from '@/features/dashboard/sales/components/lead-card';
import { NoContentCard } from '@/shared/components/no-content-card';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';

interface LeadListProps {
  filters: NegotiationFilters | null;
  searchTerm: string;
}

export function LeadList({ filters, searchTerm }: LeadListProps) {
  const router = useRouter();

  const pagination = { pageIndex: 0, pageSize: 999 };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['leads', filters, searchTerm],
    queryFn: () => getLeads({ filters: { ...filters, afterDistribution: false }, searchTerm, pagination }),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar leads" />;
  if (!data?.content.length) return <NoContentCard title="Nenhum lead encontrado" icon={User2} />;

  return (
    <div className="space-y-4">
      {data.content.map((lead) => (
        <LeadCard
          key={lead.uuid}
          data={lead}
          hideActions
          onPress={() => router.push(`/dashboard/sales/${lead.uuid}/details`)}
        />
      ))}
    </div>
  );
}
