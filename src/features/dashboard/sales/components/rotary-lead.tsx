import { useQuery } from '@tanstack/react-query';
import { Shuffle, Users } from 'lucide-react';

import { getDistributionPendingOffers, getRoulettePendingOffers } from '@/features/dashboard/sales/api/lead';

import { LeadCard } from '@/features/dashboard/sales/components/lead-card';
import { NoContentCard } from '@/shared/components/no-content-card';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';

export function RotaryLead() {
  const {
    data: distributionData,
    isLoading: isLoadingDistribution,
    isError: isErrorDistribution,
    error: errorDistribution,
  } = useQuery({
    queryKey: ['distribution-pending-offers'],
    queryFn: () => getDistributionPendingOffers(),
    refetchInterval: 5000,
  });

  const {
    data: rouletteData,
    isLoading: isLoadingRoulette,
    isError: isErrorRoulette,
    error: errorRoulette,
  } = useQuery({
    queryKey: ['roulette-pending-offers'],
    queryFn: () => getRoulettePendingOffers(),
    refetchInterval: 5000,
  });

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shuffle className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Roletão</h2>
        </div>

        {isLoadingRoulette ? (
          <Loading />
        ) : isErrorRoulette ? (
          <ErrorCard error={errorRoulette} title="Erro ao carregar leads da roleta" />
        ) : !rouletteData || rouletteData.length === 0 ? (
          <NoContentCard title="Nenhum lead disponível na roleta" />
        ) : (
          <div className="space-y-4">
            {rouletteData.map((lead) => (
              <LeadCard key={lead.uuid} data={lead} queueType="roulette" />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Distribuição</h2>
        </div>

        {isLoadingDistribution ? (
          <Loading />
        ) : isErrorDistribution ? (
          <ErrorCard error={errorDistribution} title="Erro ao carregar leads de distribuição" />
        ) : !distributionData || distributionData.length === 0 ? (
          <NoContentCard title="Nenhum lead disponível na distribuição" />
        ) : (
          <div className="space-y-4">
            {distributionData.map((lead) => (
              <LeadCard key={lead.uuid} data={lead} queueType="distribution" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
