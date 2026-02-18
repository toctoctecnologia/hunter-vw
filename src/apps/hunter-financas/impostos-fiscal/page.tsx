import { SurfaceCard } from '../components/SurfaceCard';
import { financeTaxHighlights } from '../data/navigation';

export default function ImpostosFiscalPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Impostos e fiscal"
        description="DIMOB, DIRF, NFSe e retenções integradas à contabilidade."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {financeTaxHighlights.map((item) => (
            <div key={item} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Calendário fiscal" description="Alertas e obrigações fiscais programadas.">
        <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-6 text-center text-sm text-[hsl(var(--textMuted))]">
          Calendário fiscal com envios e prazos críticos.
        </div>
      </SurfaceCard>
    </div>
  );
}
