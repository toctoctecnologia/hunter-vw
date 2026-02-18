import { ArrowUpRight, Bell, CalendarClock, CreditCard, LineChart, ShieldCheck } from 'lucide-react';
import {
  financeAlerts,
  financeCashflowSeries,
  financeDashMetrics,
  financeDreSummary,
  financeHighlights,
} from './data/navigation';
import { SurfaceCard } from './components/SurfaceCard';

const actionBadges = [
  { label: 'Saldo consolidado', icon: ShieldCheck },
  { label: 'Auditoria ativa', icon: Bell },
  { label: 'Previsão 90 dias', icon: CalendarClock },
];

export default function HunterFinancasDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[hsl(var(--border))] bg-[radial-gradient(circle_at_top,_hsl(var(--brandPrimary))_0%,_transparent_55%)] p-8 text-[hsl(var(--text))]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--textMuted))]">
              Motor financeiro completo
            </p>
            <h2 className="text-3xl font-semibold">ERP financeiro imobiliário nativo do Hunter</h2>
            <p className="text-sm text-[hsl(var(--textMuted))]">
              Tudo o que é crítico para receita, cobrança, repasse e análise financeira, sem sair do ecossistema
              Hunter. Integração total com CRM, Locação e Contratos.
            </p>
            <div className="flex flex-wrap gap-3">
              {actionBadges.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface2))] px-3 py-1 text-xs font-semibold"
                >
                  <Icon className="h-3 w-3 text-[hsl(var(--brandPrimary))]" />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--surface2))] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[hsl(var(--brandPrimary))]/10 p-3">
                <LineChart className="h-5 w-5 text-[hsl(var(--brandPrimary))]" />
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--textMuted))]">Resultado operacional</p>
                <p className="text-xl font-semibold">R$ 1.090.000</p>
              </div>
            </div>
            <div className="rounded-2xl bg-[hsl(var(--surface3))] px-4 py-3 text-xs text-[hsl(var(--textMuted))]">
              DRE resumido atualizado há 2 horas.
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-between rounded-full bg-[hsl(var(--brandPrimary))] px-4 py-2 text-xs font-semibold text-white"
            >
              Acessar DRE completo
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <SurfaceCard title="Visão geral" description="Indicadores críticos para gestão financeira diária.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {financeDashMetrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
              <p className="text-xs font-semibold uppercase text-[hsl(var(--textMuted))]">{metric.label}</p>
              <p className="mt-2 text-xl font-semibold text-[hsl(var(--text))]">{metric.value}</p>
              <p className="mt-1 text-xs text-[hsl(var(--textMuted))]">{metric.trend}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <SurfaceCard title="Fluxo de caixa consolidado" description="Comparativo entre entradas e saídas previstas.">
          <div className="flex flex-wrap items-center gap-3">
            {financeCashflowSeries.map((item) => (
              <div
                key={item.label}
                className="flex-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] px-4 py-3"
              >
                <p className="text-xs text-[hsl(var(--textMuted))]">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-[hsl(var(--text))]">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-6 text-center text-sm text-[hsl(var(--textMuted))]">
            Gráfico comparativo real x previsto (em desenvolvimento).
          </div>
        </SurfaceCard>

        <SurfaceCard title="Alertas financeiros" description="Ações prioritárias para mitigar riscos.">
          <div className="space-y-3">
            {financeAlerts.map((alert) => (
              <div
                key={alert.title}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[hsl(var(--text))]">{alert.title}</p>
                  <span className="rounded-full bg-[hsl(var(--brandPrimary))]/10 px-2 py-1 text-xs font-semibold text-[hsl(var(--brandPrimary))]">
                    {alert.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">{alert.detail}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <SurfaceCard title="DRE resumido" description="Resumo por linhas de resultado do mês.">
          <div className="space-y-3">
            {financeDreSummary.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-[hsl(var(--surface3))] px-4 py-3">
                <p className="text-sm text-[hsl(var(--textMuted))]">{item.label}</p>
                <p className="text-sm font-semibold text-[hsl(var(--text))]">{item.value}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Fundamentos do Hunter Finanças" description="O que torna o app financeiro profundo.">
          <div className="space-y-4">
            {financeHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] px-4 py-3">
                <p className="text-sm font-semibold text-[hsl(var(--text))]">{item.title}</p>
                <p className="mt-1 text-xs text-[hsl(var(--textMuted))]">{item.description}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard
        title="Ações rápidas"
        description="Fluxo direto para operações recorrentes do time financeiro."
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-3 py-2 text-xs font-semibold text-[hsl(var(--text))]"
          >
            <CreditCard className="h-4 w-4 text-[hsl(var(--brandPrimary))]" />
            Nova conciliação
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Cobrança automática',
              description: 'Dispare régua de cobrança para contratos inadimplentes.',
            },
            {
              title: 'Repasse ao proprietário',
              description: 'Gere repasses com split e retenções configuradas.',
            },
            {
              title: 'Atualizar índices',
              description: 'Sincronize IGPM/IPCA e reajustes de contratos.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item.title}</p>
              <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">{item.description}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
