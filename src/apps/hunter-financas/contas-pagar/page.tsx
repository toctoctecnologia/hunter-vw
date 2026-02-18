import { SurfaceCard } from '../components/SurfaceCard';
import { financePayablesFilters, financePayablesInsights } from '../data/navigation';

export default function ContasPagarPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Despesas e obrigações"
        description="Despesas operacionais, fornecedores, impostos e comissões centralizados."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {financePayablesInsights.map((insight) => (
            <div key={insight.title} className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
              <p className="text-xs font-semibold uppercase text-[hsl(var(--textMuted))]">{insight.title}</p>
              <p className="mt-2 text-xl font-semibold text-[hsl(var(--text))]">{insight.value}</p>
              <p className="mt-1 text-xs text-[hsl(var(--textMuted))]">{insight.detail}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Calendário de pagamentos" description="Controle do fluxo por imóvel, imposto e fornecedor.">
        <div className="flex flex-wrap gap-3">
          {financePayablesFilters.map((filter) => (
            <span
              key={filter}
              className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] px-4 py-2 text-xs font-semibold text-[hsl(var(--text))]"
            >
              {filter}
            </span>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Aprovações e compliance" description="Registre aprovações com auditoria e trilha de decisão.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--text))]">Regras por centro de custo</p>
            <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">
              Limites e responsáveis por aprovação financeira.
            </p>
          </div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--text))]">Controle de imposto</p>
            <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">
              Alertas automáticos para vencimentos fiscais críticos.
            </p>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
