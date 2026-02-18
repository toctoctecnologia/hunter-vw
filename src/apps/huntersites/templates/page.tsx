import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { hunterSitesDemoData, HunterSitesOutletContext } from '../data/demo';
import { EmptyState } from '../components/EmptyState';

export function HunterSitesTemplatesPage() {
  const context = useOutletContext<HunterSitesOutletContext>();
  const data = context?.data ?? hunterSitesDemoData;

  if (!data.templates.length) {
    return (
      <EmptyState
        title="Sua biblioteca está vazia"
        description="Ative a integração com o editor global para importar todos os templates disponíveis."
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {data.templates.map((template) => (
        <div
          key={template.id}
          className="flex flex-col justify-between rounded-2xl border border-[var(--hs-border-subtle)] bg-[var(--hs-card)] p-6 shadow-[var(--hs-shadow-sm)]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--hs-text-muted)]">{template.category}</p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--hs-text-primary)]">{template.name}</h3>
            <p className="mt-3 text-sm text-[var(--hs-text-muted)]">{template.description}</p>
          </div>
          <Button
            asChild
            className="mt-6 w-full bg-[var(--hs-accent)] text-[var(--hs-text-inverse)] hover:bg-[var(--hs-accent)]/90"
          >
            <a href={template.previewUrl} target="_blank" rel="noreferrer">
              Visualizar template
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
}

export default HunterSitesTemplatesPage;
