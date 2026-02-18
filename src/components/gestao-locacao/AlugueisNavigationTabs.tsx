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
    path: '/gestao-locacao',
    matchPaths: ['/gestao-locacao']
  },
  { 
    label: 'Contratos de aluguel', 
    path: '/gestao-locacao/contratos',
    matchPaths: ['/gestao-locacao/contratos', '/gestao-locacao/padroes-contrato', '/gestao-locacao/reajustes', '/gestao-locacao/dimob', '/gestao-locacao/seguros']
  },
  { 
    label: 'Boletos', 
    path: '/gestao-locacao/faturas',
    matchPaths: ['/gestao-locacao/faturas']
  },
  { 
    label: 'Transferências', 
    path: '/gestao-locacao/repasses',
    matchPaths: ['/gestao-locacao/repasses']
  },
  { 
    label: 'Dados de aluguel', 
    path: '/gestao-locacao/analises',
    matchPaths: ['/gestao-locacao/analises']
  },
  { 
    label: 'Agenda de cobrança', 
    path: '/gestao-locacao/regua-cobranca',
    matchPaths: ['/gestao-locacao/regua-cobranca']
  }
];

export const AlugueisNavigationTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isTabActive = (tab: TabItem) => {
    // Exact match for dashboard
    if (tab.path === '/gestao-locacao' && location.pathname === '/gestao-locacao') {
      return true;
    }
    
    // For other tabs, check if pathname starts with any of the match paths
    if (tab.matchPaths) {
      return tab.matchPaths.some(matchPath => {
        if (matchPath === '/gestao-locacao') return false; // Skip dashboard for other tabs
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
                "flex-1 min-w-[8.5rem] px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background",
                isActive
                  ? "bg-background text-foreground shadow-sm border border-[hsl(var(--accent)/0.4)]"
                  : "text-[hsl(var(--textSecondary))] hover:text-foreground hover:bg-background/70"
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

export default AlugueisNavigationTabs;
