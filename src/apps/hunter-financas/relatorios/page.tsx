import { SurfaceCard } from '../components/SurfaceCard';
import { financeReportExports, financeReports } from '../data/navigation';

export default function RelatoriosFinanceirosPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Relatórios estratégicos"
        description="DRE completo, fluxo de caixa e inadimplência detalhada."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {financeReports.map((item) => (
            <div key={item} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Exportações" description="Relatórios prontos para conselho e auditorias.">
        <div className="grid gap-4 md:grid-cols-2">
          {financeReportExports.map((item) => (
            <div key={item.label} className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item.label}</p>
              <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">{item.detail}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
