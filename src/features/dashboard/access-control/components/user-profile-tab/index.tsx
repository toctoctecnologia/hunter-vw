import { useQuery } from '@tanstack/react-query';
import { UserX } from 'lucide-react';
import { useState } from 'react';

import { useIsMobile } from '@/shared/hooks/use-mobile';
import { hasFeature } from '@/shared/lib/permissions';
import { useAuth } from '@/shared/hooks/use-auth';

import { formatDate, formatValue, getUserNameInitials } from '@/shared/lib/utils';

import { PropertyDetail } from '@/shared/types';

import { getUserDetail } from '@/features/dashboard/access-control/api/user';

import { DeactivateUserModal } from '@/features/dashboard/access-control/components/modal/deactivate-user-modal';
import { MonthlyVacancy } from '@/features/dashboard/access-control/components/user-profile-tab/monthly-vacancy';
import { FunnelChart } from '@/features/dashboard/access-control/components/user-profile-tab/funnel-chart';
import { PropertyHighlightCard } from '@/features/dashboard/components/property-highlight-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { NoContentCard } from '@/shared/components/no-content-card';
import { useSidebar } from '@/shared/components/ui/sidebar';
import { ErrorCard } from '@/shared/components/error-card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Badge } from '@/shared/components/ui/badge';

interface UserProfileTabProps {
  userUuid: string;
}

export function UserProfileTab({ userUuid }: UserProfileTabProps) {
  const { user } = useAuth();
  const { open } = useSidebar();
  const isMobile = useIsMobile();
  const maxWidth = isMobile ? '100%' : open ? 'calc(100vw - 23.8rem)' : 'calc(100vw - 8.5rem)';

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user', userUuid],
    queryFn: () => getUserDetail(userUuid),
    enabled: !!userUuid,
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar usuário" />;
  if (!data) return <NoContentCard title="Usuário não encontrado" />;

  return (
    <>
      <DeactivateUserModal open={isDeactivateModalOpen} onClose={() => setIsDeactivateModalOpen(false)} userUuid={userUuid} />

      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="size-20 hidden md:flex">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getUserNameInitials(data.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">{data.name}</h2>
                  <Badge variant={data.active ? 'default' : 'outline'}>{data.active ? 'Ativo' : 'Inativo'}</Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{data.email}</p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Início na plataforma:</span>
                    <p className="font-medium">{formatDate(data.createdAt)}</p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Perfil vinculado:</span>
                    <p className="font-medium">{data.profileName}</p>
                  </div>

                  {data.active && hasFeature(user?.userInfo.profile.permissions, '1401') && (
                    <div>
                      <Button variant="destructive" size="sm" onClick={() => setIsDeactivateModalOpen(true)}>
                        <UserX className="size-4" />
                        Desativar Usuário
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 2: Métricas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Imóveis vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.propertiesSold}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Valor vendido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatValue(data.totalValueSold)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Ticket médio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatValue(data.propertyValueAverage)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Taxa de follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.followUpRate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Seção 3: Últimas Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentSales.map((sale) => (
                <div key={sale.code} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium">{sale.code}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(sale.saledAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatValue(sale.commission)}</p>
                    <p className="text-xs text-muted-foreground">Comissão</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seção 4: Funil de Conversão */}
        <FunnelChart funnel={data.funnel} />

        {/* Seção 5: Vacância Mensal */}
        <MonthlyVacancy yearlySales={data.yearlySales} />

        {/* Seção 6: Imóveis Vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Imóveis Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap rounded-md" style={{ maxWidth }}>
              <div className="flex gap-4 pb-4 w-max">
                {data.recentSales.map((property) => (
                  <PropertyHighlightCard key={property.uuid} property={property as PropertyDetail} />
                ))}
              </div>

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
