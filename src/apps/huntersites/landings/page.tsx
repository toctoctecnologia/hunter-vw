import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { hunterSitesDemoData, HunterSitesOutletContext } from '../data/demo';
import { EmptyState } from '../components/EmptyState';

export function HunterSitesLandingsPage() {
  const context = useOutletContext<HunterSitesOutletContext>();
  const data = context?.data ?? hunterSitesDemoData;

  if (!data.landings.length) {
    return (
      <EmptyState
        title="Sem campanhas ativas"
        description="Publique uma landing page personalizada para iniciar suas próximas ações."
        actionLabel="Criar landing"
      />
    );
  }

  return (
    <div className="space-y-4">
      {data.landings.map((landing) => (
        <div
          key={landing.id}
          className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--hs-border-subtle)] bg-[var(--hs-card)] p-6 shadow-[var(--hs-shadow-sm)] md:flex-row md:items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--hs-text-muted)]">{landing.performance}</p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--hs-text-primary)]">{landing.name}</h3>
            <p className="mt-2 text-sm text-[var(--hs-text-muted)]">{landing.focus}</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-[var(--hs-accent)] text-[var(--hs-accent)] hover:bg-[var(--hs-accent-soft)]"
          >
            <a href={landing.previewUrl} target="_blank" rel="noreferrer">
              Visualizar página
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
}

export default HunterSitesLandingsPage;
