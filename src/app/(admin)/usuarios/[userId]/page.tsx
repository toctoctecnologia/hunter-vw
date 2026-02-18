'use client';
import { useState, useEffect, useCallback } from 'react';
import UserDetailHeader from '@/features/users/components/UserDetailHeader';
import UserTabs from '@/features/users/components/UserTabs';
import UserKPIs from '@/features/users/profile/UserKPIs';
import UserKPICharts from '@/features/users/profile/UserKPICharts';
import UserProfileLists from '@/features/users/profile/UserProfileLists';
import UserLastSales from '@/features/users/profile/UserLastSales';
import UserProfileHeader from '@/features/users/profile/UserProfileHeader';
import UserHistoryContent from '@/features/users/history/UserHistoryContent';
import { getCurrentUser } from '@/utils/auth';
import {
  getUserDetail,
  getUserMetrics,
  getUserAudit,
  getUserHealthSnapshot,
  type User,
} from '@/services/users';
import type {
  KpiDetalhado,
  AuditEvent,
  PropertySaleSummary,
  UserHealthSnapshot,
} from '@/features/users/types';
import type { PropertySummary } from '@/features/properties/types';
import { mockUserSaleDetails } from '@/features/users/mocks/userLastSales.mock';
import UserUpdatesContent from '@/features/users/updates/UserUpdatesContent';

interface PageProps {
  params: { userId: string };
}

export default function UserDetailPage({ params }: PageProps) {
  const [tab, setTab] = useState<'perfil' | 'historico' | 'atualizacoes'>('perfil');
  const [user, setUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<KpiDetalhado | null>(null);
  const [audit, setAudit] = useState<AuditEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [healthSnapshot, setHealthSnapshot] = useState<UserHealthSnapshot | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);
  const currentUser = getCurrentUser();
  const role = currentUser?.role;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setHealthSnapshot(null);
      setHealthError(null);
      try {
        const [userRes, metricsRes] = await Promise.all([
          getUserDetail(params.userId),
          getUserMetrics(params.userId),
        ]);
        setUser(userRes);
        setMetrics(metricsRes);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? 'Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.userId]);

  const loadAudit = useCallback(async () => {
    setAuditLoading(true);
    setAuditError(null);
    try {
      const data = await getUserAudit(params.userId);
      setAudit(data);
    } catch (err: any) {
      console.error(err);
      setAuditError(err?.message ?? 'Erro ao carregar auditoria');
    } finally {
      setAuditLoading(false);
    }
  }, [params.userId]);

  const loadHealth = useCallback(async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const data = await getUserHealthSnapshot(params.userId, { reason: 'manual', force: true });
      setHealthSnapshot(data);
    } catch (err: any) {
      console.error(err);
      setHealthError(err?.message ?? 'Erro ao carregar a saúde do usuário');
    } finally {
      setHealthLoading(false);
    }
  }, [params.userId]);

  const handleTabChange = (value: 'perfil' | 'historico' | 'atualizacoes') => {
    setTab(value);
    if (value === 'historico' && !audit && !auditLoading) {
      void loadAudit();
    }
    if (value === 'atualizacoes' && !healthSnapshot && !healthLoading) {
      void loadHealth();
    }
  };

  const lastSales: PropertySaleSummary[] =
    metrics?.ultimasVendas?.map(venda => {
      const detail = mockUserSaleDetails[venda.propertyId];
      return detail
        ? {
            ...detail,
            salePrice: venda.soldPrice,
            saleDate: venda.soldAt,
            saleId: venda.saleId,
          }
        : undefined;
    }).filter(Boolean) as PropertySaleSummary[];

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!user) return <div className="p-4">Usuário não encontrado</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        <UserDetailHeader user={user} metrics={metrics} />
        
        <div className="space-y-6">
          <UserTabs value={tab} onValueChange={handleTabChange} role={role} />
          
          <div className="min-h-[500px]">
            {tab === 'perfil' ? (
              <div className="space-y-8">
                <UserProfileHeader user={user} />
                <UserKPIs data={metrics} loading={loading} error={error} />
                <UserKPICharts data={metrics} loading={loading} error={error} />
                <UserLastSales sales={lastSales} />
                <UserProfileLists data={metrics} loading={loading} error={error} />
              </div>
            ) : tab === 'historico' ? (
              <div className="space-y-8">
                <UserHistoryContent data={audit} loading={auditLoading} error={auditError} />
              </div>
            ) : (
              <div className="space-y-8">
                <UserUpdatesContent
                  data={healthSnapshot}
                  userId={params.userId}
                  loading={healthLoading}
                  error={healthError}
                  onRetry={loadHealth}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
