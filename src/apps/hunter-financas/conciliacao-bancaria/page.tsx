import { SurfaceCard } from '../components/SurfaceCard';
import { financeReconciliationHighlights } from '../data/navigation';

export default function ConciliacaoBancariaPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Conciliação bancária inteligente"
        description="Integrações bancárias com importação automática OFX/CNAB."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {financeReconciliationHighlights.map((item) => (
            <div key={item} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Status de divergência" description="Alertas e revisão rápida por time financeiro.">
        <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-6 text-center text-sm text-[hsl(var(--textMuted))]">
          Painel de divergências e reconciliações pendentes.
        </div>
      </SurfaceCard>
    </div>
  );
}
