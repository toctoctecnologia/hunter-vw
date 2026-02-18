import { SurfaceCard } from '../components/SurfaceCard';
import { financeCollectionsHighlights } from '../data/navigation';

export default function BoletosCobrancaPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Emissão de boletos e cobrança"
        description="CNAB, PIX e régua de cobrança integrada ao CRM e locações."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {financeCollectionsHighlights.map((item) => (
            <div key={item} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Agenda de cobrança" description="Configurações de juros, multas e segunda via automática.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--text))]">Disparo inteligente</p>
            <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">
              Envio automático por WhatsApp e e-mail com disparos escalonados.
            </p>
          </div>
          <div className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--text))]">Segunda via automática</p>
            <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">
              Atualização de boleto sem intervenção manual do time financeiro.
            </p>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
