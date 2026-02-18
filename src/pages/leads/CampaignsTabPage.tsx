import LeadsPage from './LeadsPage';
import { getCurrentUser, hasPermission } from '@/data/accessControl';
import { Default403State } from '@/components/ui/Default403State';

export function CampaignsTabPage() {
  const currentUser = getCurrentUser();
  const canAccessCampaigns =
    hasPermission(currentUser, 'leads.read') ||
    hasPermission(currentUser, 'analytics.campaigns.read');

  if (!canAccessCampaigns) {
    return (
      <Default403State
        description={(
          <>
            Você precisa da permissão <strong>leads.read</strong> ou
            {' '}
            <strong>analytics.campaigns.read</strong> para acessar as campanhas.
          </>
        )}
      />
    );
  }

  return <LeadsPage defaultTab="campanhas" />;
}

export default CampaignsTabPage;
