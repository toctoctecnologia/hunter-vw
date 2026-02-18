import DashboardModular from '@/components/dashboard-modular/DashboardModular';
import { VENDAS_WIDGETS } from '@/components/dashboard-modular/widgets';
import { VendasLayout } from '@/layouts/VendasLayout';

export const GestaoVendasDashboard = () => {
  return (
    <VendasLayout>
      <DashboardModular
        context="vendas"
        title="Dashboard de Gestão de Vendas"
        widgets={VENDAS_WIDGETS}
      />
    </VendasLayout>
  );
};

export default GestaoVendasDashboard;
