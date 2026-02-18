
import React from 'react';
import { debugLog } from '@/utils/debug';
import { ServicosTab } from '@/components/agenda/ServicosTab';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { useNavigate } from 'react-router-dom';

export default function Servicos() {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
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
      default:
        break;
    }
  };

  const handleAddClick = () => {
    debugLog('Add clicked from Servicos');
  };

  return (
    <ResponsiveLayout
      activeTab="gerenciamentodeservicos"
      setActiveTab={handleTabChange}
      onAddClick={handleAddClick}
      showTopBar={false}
    >
      <ServicosTab />
    </ResponsiveLayout>
  );
}
