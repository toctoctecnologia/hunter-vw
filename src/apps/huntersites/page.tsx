import { useOutletContext } from 'react-router-dom';
import { hunterSitesDemoData, HunterSitesOutletContext } from './data/demo';
import { StatCard } from './components/StatCard';
import { SiteCard } from './components/SiteCard';
import { EmptyState } from './components/EmptyState';

export function HunterSitesDashboardPage() {
  const context = useOutletContext<HunterSitesOutletContext>();
  const data = context?.data ?? hunterSitesDemoData;

  return (
    <div className="space-y-8">
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--hs-text-primary)]">Sites ativos</h2>
            <span className="text-sm text-[var(--hs-text-muted)]">{data.sites.length} experiências publicadas</span>
          </div>
          <div className="space-y-4">
            {data.sites.slice(0, 2).map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </div>
        <aside className="space-y-4 rounded-2xl border border-[var(--hs-border-subtle)] bg-[var(--hs-card)] p-6 shadow-[var(--hs-shadow-sm)]">
          <h3 className="text-lg font-semibold text-[var(--hs-text-primary)]">Destaques</h3>
          <ul className="space-y-3 text-sm text-[var(--hs-text-muted)]">
            {data.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--hs-accent)]" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-[var(--hs-gradient)] px-4 py-5 text-[var(--hs-text-inverse)] shadow-[var(--hs-shadow-md)]">
            <p className="text-sm font-medium uppercase tracking-wide text-white/80">Próximo passo</p>
            <p className="mt-2 text-lg font-semibold">Ative o editor global HunterSites</p>
            <p className="mt-2 text-sm text-white/80">
              Conecte seu domínio e permita que a equipe faça ajustes em tempo real.
            </p>
          </div>
        </aside>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--hs-text-primary)]">Landing pages em destaque</h2>
        {data.landings.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.landings.map((landing) => (
              <div
                key={landing.id}
                className="rounded-2xl border border-[var(--hs-border-subtle)] bg-[var(--hs-card)] p-5 shadow-[var(--hs-shadow-sm)]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--hs-text-muted)]">{landing.performance}</p>
                <h3 className="mt-2 text-xl font-semibold text-[var(--hs-text-primary)]">{landing.name}</h3>
                <p className="mt-2 text-sm text-[var(--hs-text-muted)]">{landing.focus}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma landing page configurada"
            description="Comece com um template HunterSites e publique sua primeira campanha em poucos minutos."
            actionLabel="Criar landing"
          />
        )}
      </section>
    </div>
  );
}

export default HunterSitesDashboardPage;
