import { SurfaceCard } from '../components/SurfaceCard';
import { financeIntegrationTypes, financeIntegrations } from '../data/navigation';

export default function IntegracoesFinanceirasPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Integrações financeiras"
        description="Bancos, gateways de pagamento, contabilidade e ERPs externos."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {financeIntegrations.map((item) => (
            <div key={item} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Tipos de integração" description="Integrações nativas e APIs externas.">
        <div className="grid gap-4 md:grid-cols-2">
          {financeIntegrationTypes.map((item) => (
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
