'use client';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';

import { getPlans } from '@/features/sadm-dashboard/access-control/api/get-plans';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty';
import { Plans } from '@/features/sadm-dashboard/access-control/components/plans';
import { Coupons } from '@/features/sadm-dashboard/access-control/components/coupons';
import { Loading } from '@/shared/components/loading';

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['sadm-saas-plans'],
    queryFn: () => getPlans(),
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="px-2 sm:px-4">
          <CardTitle className="text-xl sm:text-2xl">Planos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="h-full px-0 border-t">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {data && data.length > 0 ? (
                <Plans plans={data} />
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <User />
                    </EmptyMedia>
                    <EmptyTitle>Sem Planos</EmptyTitle>
                    <EmptyDescription>Ainda não existem planos cadastrados</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Coupons />
    </div>
  );
}
