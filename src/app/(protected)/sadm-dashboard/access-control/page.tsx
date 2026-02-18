'use client';
import { useQuery } from '@tanstack/react-query';
import { Crown, Shield, Users, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { formatValue } from '@/shared/lib/utils';

import { getPermissions } from '@/features/sadm-dashboard/access-control/api/get-permissions';
import { getPlans } from '@/features/sadm-dashboard/access-control/api/get-plans';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Permissions } from '@/features/dashboard/access-control/components/permissions';
import { NoContentCard } from '@/shared/components/no-content-card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Loading } from '@/shared/components/loading';
import { Badge } from '@/shared/components/ui/badge';

export default function Page() {
  const [activeTab, setActiveTab] = useState('');

  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['sadm-saas-plans'],
    queryFn: () => getPlans(),
  });

  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['sadm-saas-permissions'],
    queryFn: () => getPermissions(),
  });

  const getFilteredPermissions = (tier: number) => {
    console.log(permissions, 'tier', tier);
    return permissions?.filter((permission) => permission.tier <= tier) || [];
  };

  useEffect(() => {
    if (plans && plans.length > 0) {
      setActiveTab(plans[0].uuid);
    }
  }, [plans]);

  if (isLoadingPlans) return <Loading />;
  if (!plans || plans.length === 0) return <NoContentCard title="Nenhum plano encontrado" />;

  const sortedPlans = [...plans].sort((a, b) => a.tier - b.tier);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <Select value={activeTab} onValueChange={setActiveTab}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um relatório" />
        </SelectTrigger>
        <SelectContent>
          {sortedPlans.map((plan) => (
            <SelectItem key={plan.uuid} value={plan.uuid}>
              {plan.name} | Tier {plan.tier}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {sortedPlans.map((plan) => (
        <TabsContent key={plan.uuid} value={plan.uuid} className="mt-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Tier</span>
                    </div>
                    <Badge variant="secondary">{plan.tier}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Usuários Ativos</span>
                    </div>
                    <Badge variant="secondary">{plan.activeUsersAmount}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Imóveis Ativos</span>
                    </div>
                    <Badge variant="secondary">{plan.activePropertiesAmount}</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Preço Mensal</span>
                    <span className="font-semibold">{formatValue(plan.monthlyPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Preço Anual</span>
                    <span className="font-semibold">{formatValue(plan.annualPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Permissões Incluídas</CardTitle>
                    <CardDescription>Funcionalidades disponíveis no plano {plan.name}</CardDescription>
                  </div>
                  <Badge variant="outline">{getFilteredPermissions(plan.tier).length} permissões</Badge>
                </div>
              </CardHeader>
              <CardContent className="border-t pt-0">
                {isLoadingPermissions ? (
                  <div className="flex items-center justify-center min-h-75">
                    <Loading />
                  </div>
                ) : (
                  <Permissions data={getFilteredPermissions(plan.tier)} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
