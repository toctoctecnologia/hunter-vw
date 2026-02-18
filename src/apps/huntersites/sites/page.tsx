import { useOutletContext } from 'react-router-dom';
import { hunterSitesDemoData, HunterSitesOutletContext } from '../data/demo';
import { SiteCard } from '../components/SiteCard';
import { EmptyState } from '../components/EmptyState';

export function HunterSitesListPage() {
  const context = useOutletContext<HunterSitesOutletContext>();
  const data = context?.data ?? hunterSitesDemoData;

  if (!data.sites.length) {
    return (
      <EmptyState
        title="Nenhum site publicado ainda"
        description="Publique seu primeiro site Hunter em minutos utilizando um template pré-configurado."
        actionLabel="Criar site"
      />
    );
  }

  return (
    <div className="space-y-4">
      {data.sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}

export default HunterSitesListPage;
