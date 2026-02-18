import { SurfaceCard } from '../components/SurfaceCard';
import { financeReceivablesFilters, financeReceivablesInsights } from '../data/navigation';

export default function ContasReceberPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Receitas e cobranças"
        description="Controle de aluguéis, vendas, parcelas e boletos emitidos dentro do ciclo financeiro."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {financeReceivablesInsights.map((insight) => (
            <div key={insight.title} className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
              <p className="text-xs font-semibold uppercase text-[hsl(var(--textMuted))]">{insight.title}</p>
              <p className="mt-2 text-xl font-semibold text-[hsl(var(--text))]">{insight.value}</p>
              <p className="mt-1 text-xs text-[hsl(var(--textMuted))]">{insight.detail}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Filtros inteligentes" description="Visão rápida por imóvel, cliente, contrato e corretor.">
        <div className="flex flex-wrap gap-3">
          {financeReceivablesFilters.map((filter) => (
            <span
              key={filter}
              className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] px-4 py-2 text-xs font-semibold text-[hsl(var(--text))]"
            >
              {filter}
            </span>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Status de cobrança" description="Monitoramento diário de inadimplência e régua de cobrança.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--text))]">Em atraso</p>
            <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">
              Contratos vencidos, juros, multas e segunda via automática.
            </p>
          </div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--text))]">Ações rápidas</p>
            <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">
              Envio por WhatsApp, e-mail e régua inteligente por segmento.
            </p>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
