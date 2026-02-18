import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import DistribuicaoSearchBar from '@/components/distribuicao/DistribuicaoSearchBar';
import DistribuicaoNavigationTabs from '@/components/distribuicao/DistribuicaoNavigationTabs';
import FilasListTab from '@/components/distribuicao/FilasListTab';
import HistoricoTab from '@/components/distribuicao/HistoricoTab';
import CaptacoesTab from '@/components/distribuicao/CaptacoesTab';
import CheckinTab from '@/components/distribuicao/CheckinTab';
import RedistribuicaoTab from '@/components/distribuicao/RedistribuicaoTab';
import CadenciaTab from '@/components/distribuicao/CadenciaTab';
import type { CadenciaFiltro } from '@/types/cadencia';

export default function Distribuicao() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [cadenciaFilters, setCadenciaFilters] = useState<CadenciaFiltro>({});

  const handleMainTabChange = (tab: string) => {
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
      case 'usuarios':
        navigate('/usuarios');
        break;
      case 'distribuicao':
        navigate('/distribuicao');
        break;
      default:
        break;
    }
  };

  const activeTab = (() => {
    if (location.pathname.startsWith('/distribuicao/cadencia')) return 'cadencia';
    if (location.pathname.startsWith('/distribuicao/redistribuicao')) return 'redistribuicao';
    if (location.pathname.startsWith('/distribuicao/auditoria')) return 'auditoria';
    if (location.pathname.startsWith('/distribuicao/captacoes')) return 'captacoes';
    if (location.pathname.startsWith('/distribuicao/acoes')) return 'acoes';
    return 'filas';
  })();

  const renderContent = () => {
    switch (activeTab) {
      case 'auditoria':
        return <HistoricoTab />;
      case 'captacoes':
        return <CaptacoesTab />;
      case 'acoes':
        return <CheckinTab />;
      case 'redistribuicao':
        return <RedistribuicaoTab />;
      case 'cadencia':
        return <CadenciaTab searchValue={searchValue} filters={cadenciaFilters} />;
      default:
        return <FilasListTab searchValue={searchValue} />;
    }
  };

  return (
    <ResponsiveLayout activeTab="distribuicao" setActiveTab={handleMainTabChange}>
      <div className="flex flex-col h-full bg-background">
        {/* Fixed Header Area */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="px-6 py-4 space-y-4">
            {/* Search Bar */}
            <DistribuicaoSearchBar 
              value={searchValue}
              onChange={setSearchValue}
              placeholder={
                activeTab === 'cadencia'
                  ? 'Buscar cadências por nome, evento, equipe ou regra'
                  : 'Buscar filas por nome, equipe, regra ou usuário...'
              }
              filterPreset={activeTab === 'cadencia' ? 'cadencias' : 'filas'}
              filters={activeTab === 'cadencia' ? cadenciaFilters as Record<string, string | undefined> : undefined}
              onFiltersChange={activeTab === 'cadencia' ? (f) => setCadenciaFilters(f as CadenciaFiltro) : undefined}
            />
            
            {/* Navigation Tabs */}
            <DistribuicaoNavigationTabs />
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
