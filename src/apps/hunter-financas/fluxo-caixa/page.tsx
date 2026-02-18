import { SurfaceCard } from '../components/SurfaceCard';
import { financeCashflowFilters, financeCashflowSeries } from '../data/navigation';

export default function FluxoCaixaPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Fluxo de caixa real e previsto"
        description="Visualize entradas e saídas com comparativo e alertas inteligentes."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {financeCashflowSeries.map((item) => (
            <div key={item.label} className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
              <p className="text-xs font-semibold uppercase text-[hsl(var(--textMuted))]">{item.label}</p>
              <p className="mt-2 text-xl font-semibold text-[hsl(var(--text))]">{item.value}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Filtros avançados" description="Personalize a leitura por períodos e centros de custo.">
        <div className="flex flex-wrap gap-3">
          {financeCashflowFilters.map((filter) => (
            <span
              key={filter}
              className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] px-4 py-2 text-xs font-semibold text-[hsl(var(--text))]"
            >
              {filter}
            </span>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Alertas de saldo" description="Antecipe riscos com simulações por projeto e imóvel.">
        <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-6 text-center text-sm text-[hsl(var(--textMuted))]">
          Gráfico de projeção de saldo (real x previsto) será exibido aqui.
        </div>
      </SurfaceCard>
    </div>
  );
}
