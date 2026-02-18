'use client';
import { TrendingUp, Users, DollarSign, Target, Eye } from 'lucide-react';

import { useGoogleAds } from '@/features/dashboard/manage-api/hooks/use-google-ads';
import { useMetaLeads } from '@/features/dashboard/manage-api/hooks/use-meta-leads';

import { formatValue } from '@/shared/lib/utils';
import { isMetaLeadsConnected } from '@/shared/lib/meta-oauth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { NoContentCard } from '@/shared/components/no-content-card';
import { ErrorCard } from '@/shared/components/error-card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
};

function MetricCard({ title, value, icon, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

function GoogleAdsMetrics() {
  const { data, isLoading, error, refetch } = useGoogleAds();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <Loading />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <ErrorCard error={error} title="Erro ao carregar métricas do Google Ads" />
          <div className="mt-4 flex justify-center">
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return <NoContentCard title="Configure sua conta do Google Ads para visualizar as métricas" />;
  }

  const { metrics } = data;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Google Ads - Últimos 30 dias</CardTitle>
          <CardDescription>
            Métricas agregadas de {data.campaigns} {data.campaigns === 1 ? 'campanha' : 'campanhas'}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Leads"
          value={metrics.leads}
          icon={<Users className="h-4 w-4" />}
          description={`${metrics.conversions} conversões`}
        />

        <MetricCard
          title="Conversão (%)"
          value={`${metrics.conversionRate}%`}
          icon={<Target className="h-4 w-4" />}
          description={`${metrics.clicks} cliques`}
        />

        <MetricCard
          title="CPL (Custo Por Lead)"
          value={formatValue(metrics.cpl)}
          icon={<DollarSign className="h-4 w-4" />}
          description={`Custo total: ${formatValue(metrics.totalCost)}`}
        />

        <MetricCard
          title="ROI"
          value={`${metrics.roi > 0 ? '+' : ''}${metrics.roi}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          description={`Valor: ${formatValue(metrics.totalConversionsValue)}`}
        />
      </div>
    </div>
  );
}

function MetaLeadsMetrics() {
  const { data, isLoading, error, refetch } = useMetaLeads();
  const isConnected = isMetaLeadsConnected();

  if (!isConnected) {
    return <NoContentCard title="Configure sua conta do Meta (Facebook/Instagram) para visualizar as métricas" />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <Loading />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <ErrorCard error={error} title="Erro ao carregar métricas do Meta Leads" />
          <div className="mt-4 flex justify-center">
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return <NoContentCard title="Nenhuma métrica disponível do Meta Leads" />;
  }

  const { metrics } = data;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Meta Leads - Últimos 30 dias</CardTitle>
          <CardDescription>
            Métricas agregadas de {data.campaigns} {data.campaigns === 1 ? 'campanha ativa' : 'campanhas ativas'}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Leads"
          value={metrics.leads}
          icon={<Users className="h-4 w-4" />}
          description={`${metrics.conversions} conversões`}
        />

        <MetricCard
          title="Conversão (%)"
          value={`${metrics.conversionRate}%`}
          icon={<Target className="h-4 w-4" />}
          description={`${metrics.clicks} cliques`}
        />

        <MetricCard
          title="CPL (Custo Por Lead)"
          value={formatValue(metrics.cpl)}
          icon={<DollarSign className="h-4 w-4" />}
          description={`Custo total: ${formatValue(metrics.totalCost)}`}
        />

        <MetricCard
          title="ROI"
          value={`${metrics.roi > 0 ? '+' : ''}${metrics.roi}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          description={`Valor: ${formatValue(metrics.totalConversionsValue)}`}
        />

        <MetricCard
          title="Impressões"
          value={metrics.impressions.toLocaleString('pt-BR')}
          icon={<Eye className="h-4 w-4" />}
          description={`${metrics.clicks} cliques`}
        />
      </div>
    </div>
  );
}

export function AdsMetricsCard() {
  return (
    <div className="space-y-8">
      <GoogleAdsMetrics />
      <MetaLeadsMetrics />
    </div>
  );
}
