import { useOutletContext } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { hunterSitesDemoData, HunterSitesOutletContext } from '../data/demo';
import { EmptyState } from '../components/EmptyState';

export function HunterSitesSettingsPage() {
  const context = useOutletContext<HunterSitesOutletContext>();
  const data = context?.data ?? hunterSitesDemoData;

  if (!data.team.length) {
    return (
      <EmptyState
        title="Nenhum membro cadastrado"
        description="Convide sua equipe para acessar o editor global e gerenciar sites Hunter."
        actionLabel="Convidar membro"
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-[var(--hs-border-subtle)] bg-[var(--hs-card)] p-6 shadow-[var(--hs-shadow-sm)]">
        <h2 className="text-lg font-semibold text-[var(--hs-text-primary)]">Equipe HunterSites</h2>
        <p className="mt-1 text-sm text-[var(--hs-text-muted)]">Controle quem pode editar e publicar experiências.</p>
        <ul className="mt-6 space-y-4">
          {data.team.map((member) => (
            <li key={member.id} className="flex items-center justify-between gap-4 rounded-xl border border-[var(--hs-border-subtle)] px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{member.avatarFallback}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-[var(--hs-text-primary)]">{member.name}</p>
                  <p className="text-xs text-[var(--hs-text-muted)]">{member.role}</p>
                </div>
              </div>
              <Switch defaultChecked aria-label={`Permitir publicação para ${member.name}`} />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--hs-border-subtle)] bg-[var(--hs-card)] p-6 shadow-[var(--hs-shadow-sm)]">
        <h2 className="text-lg font-semibold text-[var(--hs-text-primary)]">Integrações ativas</h2>
        <div className="mt-4 space-y-4">
          <IntegrationToggle label="CRM Hunter" description="Sincronização bidirecional de leads" defaultChecked />
          <IntegrationToggle label="Meta Pixel" description="Eventos de conversão e remarketing" defaultChecked />
          <IntegrationToggle label="Google Tag Manager" description="Gestão de tags de parceiros" />
        </div>
      </section>
    </div>
  );
}

interface IntegrationToggleProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function IntegrationToggle({ label, description, defaultChecked }: IntegrationToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--hs-border-subtle)] px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-[var(--hs-text-primary)]">{label}</p>
        <p className="text-xs text-[var(--hs-text-muted)]">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} aria-label={`Ativar ${label}`} />
    </div>
  );
}

export default HunterSitesSettingsPage;
