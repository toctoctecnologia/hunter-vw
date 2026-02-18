import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TabItem {
  label: string;
  path: string;
  matchPaths?: string[];
}

const tabs: TabItem[] = [
  {
    label: 'Dashboard',
    path: '/gestao-vendas',
    matchPaths: ['/gestao-vendas'],
  },
  {
    label: 'Contratos de venda',
    path: '/gestao-vendas/contratos',
    matchPaths: ['/gestao-vendas/contratos'],
  },
  {
    label: 'Comissões',
    path: '/gestao-vendas/comissoes',
    matchPaths: ['/gestao-vendas/comissoes', '/gestao-vendas/recebimentos'],
  },
  {
    label: 'Transferências',
    path: '/gestao-vendas/transferencias',
    matchPaths: ['/gestao-vendas/transferencias'],
  },
  {
    label: 'Agenda da venda',
    path: '/gestao-vendas/agenda',
    matchPaths: ['/gestao-vendas/agenda'],
  },
  {
    label: 'Documentos',
    path: '/gestao-vendas/documentos',
    matchPaths: ['/gestao-vendas/documentos'],
  },
];

export const VendasNavigationTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isTabActive = (tab: TabItem) => {
    if (tab.path === '/gestao-vendas' && location.pathname === '/gestao-vendas') {
      return true;
    }
    if (tab.matchPaths) {
      return tab.matchPaths.some((matchPath) => {
        if (matchPath === '/gestao-vendas') return false;
        return location.pathname.startsWith(matchPath);
      });
    }
    return location.pathname.startsWith(tab.path);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-1 bg-[hsl(var(--bgCard))] rounded-2xl border border-[hsl(var(--borderSubtle))]">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex-1 min-w-[8.5rem] px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background',
                isActive
                  ? 'bg-background text-foreground shadow-sm border border-[hsl(var(--accent)/0.4)]'
                  : 'text-[hsl(var(--textSecondary))] hover:text-foreground hover:bg-background/70'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VendasNavigationTabs;
