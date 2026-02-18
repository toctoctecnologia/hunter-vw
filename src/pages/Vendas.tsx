
import React from 'react';
import { debugLog } from '@/utils/debug';
import { VendasTab } from '@/components/vendas/VendasTab';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VendasErrorBoundary } from './vendas/VendasErrorBoundary';

export default function Vendas() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
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
    debugLog('Add clicked from Vendas');
  };

  const tabParam = searchParams.get('tab');
  const validTabs = ['roletao', 'funil', 'kanban', 'lista', 'gestao'] as const;
  const initialView =
    tabParam && (validTabs as readonly string[]).includes(tabParam)
      ? (tabParam as typeof validTabs[number])
      : location.hash
        ? 'gestao'
        : 'roletao';

  return (
    <ResponsiveLayout
      activeTab="vendas"
      setActiveTab={handleTabChange}
      onAddClick={handleAddClick}
    >
      <VendasErrorBoundary
        fallback={({ reset }) => (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p>Ocorreu um erro ao carregar a página de vendas.</p>
            <Button onClick={reset} className="mt-2">
              Recarregar
            </Button>
          </div>
        )}
      >
        <VendasTab initialView={initialView} />
      </VendasErrorBoundary>
    </ResponsiveLayout>
  );
}
