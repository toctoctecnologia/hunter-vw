import React from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { DesktopLayout } from '@/components/shell/DesktopLayout';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { GestaoLeadsTab } from '@/components/gestao-leads/GestaoLeadsTab';
import { useNavigate } from 'react-router-dom';

interface LeadsPageProps {
  defaultTab?: 'dashboard' | 'lista' | 'campanhas';
}

export function LeadsPage({ defaultTab = 'dashboard' }: LeadsPageProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleRootTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'gestao-leads':
        navigate('/leads');
        break;
      default:
        break;
    }
  };

  const handleAddClick = () => {
    navigate('/add-lead');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'campanhas' && isMobile) {
      navigate('/', { replace: true });
      return;
    }

    navigate(`/leads/${tab}`);
  };

  const content = (
    <GestaoLeadsTab defaultTab={defaultTab} onTabChange={handleTabChange} />
  );

  if (!isMobile) {
    return <DesktopLayout activeTab="gestao-leads">{content}</DesktopLayout>;
  }

  return (
    <ResponsiveLayout
      activeTab="gestao-leads"
      setActiveTab={handleRootTabChange}
      onAddClick={handleAddClick}
    >
      {content}
    </ResponsiveLayout>
  );
}

export const LeadsDashboard = () => <LeadsPage defaultTab="dashboard" />;
export const LeadsListPage = () => <LeadsPage defaultTab="lista" />;

export default LeadsPage;
