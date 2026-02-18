
import { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { HomeTab } from '@/components/home/HomeTab';
import { ActionModal } from '@/components/common/ActionModal';
import AgendarServicosPage from './AgendarServicosPage';
import AgendarAgendaPage from './agenda/AgendarAgendaPage';
import AgendarAniversarioPage from './AgendarAniversarioPage';
import AddLeadPage from './leads/AddLeadPage';
import AddImovelPage from './imoveis/AddImovelPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showActionModal, setShowActionModal] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToTab = (tab: string, filter?: any) => {
    switch (tab) {
      case 'vendas':
        navigate('/vendas');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'servicos':
        navigate('/servicos');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      case 'gestao':
        navigate('/indicadores');
        break;
      default:
        setActiveTab(tab);
        break;
    }
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'vendas':
        navigate('/vendas');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'servicos':
        navigate('/servicos');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      default:
        setActiveTab(tab);
        break;
    }
  };

  const handleAddClick = () => {
    setShowActionModal(true);
  };

  return (
    <Routes>
      <Route path="agendar-servicos" element={<AgendarServicosPage />} />
      <Route path="agenda/agendar" element={<AgendarAgendaPage />} />
      <Route path="agendar-aniversario" element={<AgendarAniversarioPage />} />
      <Route path="add-lead" element={<AddLeadPage />} />
      <Route path="add-imovel" element={<AddImovelPage />} />
      <Route index element={
        <ResponsiveLayout
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onAddClick={handleAddClick}
        >
          <HomeTab onNavigateToTab={handleNavigateToTab} />

          {showActionModal && (
            <ActionModal
              isOpen={showActionModal}
              onClose={() => setShowActionModal(false)}
            />
          )}
        </ResponsiveLayout>
      } />
    </Routes>
  );
};

export default Index;
