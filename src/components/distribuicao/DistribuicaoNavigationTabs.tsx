import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Filas', to: '/distribuicao', matchPaths: ['/distribuicao'] },
  { label: 'Cadência', to: '/distribuicao/cadencia', matchPaths: ['/distribuicao/cadencia'] },
  { label: 'Histórico', to: '/distribuicao/auditoria', matchPaths: ['/distribuicao/auditoria'] },
  { label: 'Captações', to: '/distribuicao/captacoes', matchPaths: ['/distribuicao/captacoes'] },
  { label: 'Ação de Vendas', to: '/distribuicao/acoes', matchPaths: ['/distribuicao/acoes'] },
  { label: 'Redistribuição', to: '/distribuicao/redistribuicao', matchPaths: ['/distribuicao/redistribuicao'] },
];

export default function DistribuicaoNavigationTabs() {
  const location = useLocation();

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.to === '/distribuicao') {
      return location.pathname === '/distribuicao' || location.pathname === '/distribuicao/';
    }
    return tab.matchPaths.some(path => location.pathname.startsWith(path));
  };

  return (
    <div className="w-full rounded-full bg-muted/60 p-1.5 flex">
      {tabs.map((tab) => {
        const active = isActive(tab);
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/distribuicao'}
            className={cn(
              'flex-1 text-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200',
              active
                ? 'bg-card text-primary shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </NavLink>
        );
      })}
    </div>
  );
}
