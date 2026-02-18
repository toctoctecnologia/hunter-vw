
import React, { useState, useEffect } from 'react';
import { ImoveisTab } from '@/components/imoveis/ImoveisTab';
import { HeaderImoveis } from '@/components/imoveis/HeaderImoveis';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { scrollToHash } from '@/lib/scroll-to-hash';

export default function Imoveis() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [activeImoveisTab, setActiveImoveisTab] = useState('imoveis');
  const hideBack = searchParams.get('source') === 'fab';

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'gestao' || tabParam === 'imoveis' || tabParam === 'novo') {
      setActiveImoveisTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => scrollToHash(location.hash));
    }
  }, [activeImoveisTab, location.hash]);

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/', { replace: false });
        break;
      case 'vendas':
        navigate('/vendas', { replace: false });
        break;
      case 'servicos':
        navigate('/servicos', { replace: false });
        break;
      case 'agenda':
        navigate('/agenda', { replace: false });
        break;
      default:
        break;
    }
  };

  const handleImoveisTabChange = (tab: string) => {
    setActiveImoveisTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
        hash: location.hash,
      },
      { replace: false }
    );
  };

  const handleAddClick = () => {
    handleImoveisTabChange('novo');
  };

  return (
    <ResponsiveLayout
      activeTab="imoveis"
      setActiveTab={handleTabChange}
      onAddClick={handleAddClick}
    >
      <HeaderImoveis hideBack={hideBack} />
      <ImoveisTab
        activeTab={activeImoveisTab}
        onTabChange={handleImoveisTabChange}
      />
    </ResponsiveLayout>
  );
}
