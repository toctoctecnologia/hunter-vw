import { SurfaceCard } from '../components/SurfaceCard';
import { financeCommissionHighlights } from '../data/navigation';

export default function ComissoesFinanceirasPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Comissões automatizadas"
        description="Cálculo automático por corretor, negociação e locação."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {financeCommissionHighlights.map((item) => (
            <div key={item} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Status de comissões" description="Previstas, em aberto e pagas em tempo real.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--text))]">Gestão por corretor</p>
            <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">
              Controle de metas, pagamentos e histórico de comissões.
            </p>
          </div>
          <div className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--text))]">Simulação futura</p>
            <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">
              Previsão de comissões para negociações em andamento.
            </p>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
