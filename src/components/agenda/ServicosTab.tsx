import { ServiceManagementPage } from '@/components/servicos/ServiceManagementPage';
import { mockUsers } from '@/data/serviceTickets';

interface ServicosTabProps {
  onClose?: () => void;
  onNavigateToTab?: (tab: string, filter?: any) => void;
}

export const ServicosTab = (_props: ServicosTabProps) => {
  return <ServiceManagementPage users={mockUsers} />;
};
