import { ServiceManagementPage } from '@/components/servicos/ServiceManagementPage';
import { mockUsers } from '@/data/serviceTickets';

const ServicosPage = () => {
  return <ServiceManagementPage users={mockUsers} />;
};

export default ServicosPage;
