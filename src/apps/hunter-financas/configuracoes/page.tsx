import { SurfaceCard } from '../components/SurfaceCard';
import {
  financeConfigurations,
  financePermissions,
  financeSettingsGroups,
} from '../data/navigation';

export default function ConfiguracoesFinanceirasPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Configurações financeiras"
        description="Plano de contas, centros de custo e modelos de cobrança."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {financeConfigurations.map((item) => (
            <div key={item} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Estrutura e modelos" description="Organize as bases de cobrança e repasses.">
        <div className="grid gap-4 md:grid-cols-3">
          {financeSettingsGroups.map((group) => (
            <div key={group.title} className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{group.title}</p>
              <ul className="mt-3 space-y-2 text-xs text-[hsl(var(--textMuted))]">
                {group.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Perfis e permissões" description="Controle fino de acesso financeiro por papel.">
        <div className="grid gap-4 md:grid-cols-2">
          {financePermissions.map((item) => (
            <div key={item.role} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface3))] p-4">
              <p className="text-sm font-semibold text-[hsl(var(--text))]">{item.role}</p>
              <p className="mt-2 text-xs text-[hsl(var(--textMuted))]">{item.access}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
