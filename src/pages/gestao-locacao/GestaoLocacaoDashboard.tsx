import { AlugueisLayout } from '@/layouts/AlugueisLayout';
import DashboardModular from '@/components/dashboard-modular/DashboardModular';
import { HOME_ALUGUEIS_UNIFIED_WIDGETS } from '@/components/dashboard-modular/widgets';

export const GestaoLocacaoDashboard = () => {
  return (
    <AlugueisLayout>
      <DashboardModular
        context="alugueis"
        title="Home de Gestão de Aluguéis"
        widgets={HOME_ALUGUEIS_UNIFIED_WIDGETS}
      />
    </AlugueisLayout>
  );
};

export default GestaoLocacaoDashboard;
