import { SurfaceCard } from '../components/SurfaceCard';
import { financeContractsHighlights } from '../data/navigation';

export default function ContratosFinanceirosPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Contratos financeiros conectados"
        description="Contratos de locação e venda com reajustes e impacto automático."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {financeContractsHighlights.map((item) => (
            <div key={item} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Reajustes e aditivos" description="Controle de IGPM, IPCA e aditivos contratuais.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--text))]">Reajuste automático</p>
            <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">
              Calendário de reajustes sincronizado com contratos ativos.
            </p>
          </div>
          <div className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--text))]">Rescisões e aditivos</p>
            <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">
              Impacto financeiro recalculado em tempo real.
            </p>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
