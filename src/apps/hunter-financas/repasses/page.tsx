import { SurfaceCard } from '../components/SurfaceCard';
import { financeRepassesHighlights } from '../data/navigation';

export default function RepassesPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Repasses automáticos"
        description="Split de pagamento com retenções e extratos para proprietários."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {financeRepassesHighlights.map((item) => (
            <div key={item} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Extrato do proprietário" description="Histórico completo e retenções detalhadas.">
        <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-6 text-center text-sm text-[hsl(var(--textMuted))]">
          Visualização de extratos e repasses por proprietário.
        </div>
      </SurfaceCard>
    </div>
  );
}
