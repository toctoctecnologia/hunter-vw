import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isPrimary?: boolean;
  matchPaths?: string[];
}

const tabs: TabItem[] = [
  {
    id: 'novo-contrato',
    label: 'Novo contrato',
    href: '/gestao-vendas/contratos',
    icon: Plus,
    isPrimary: true,
    matchPaths: ['/gestao-vendas/contratos'],
  },
  {
    id: 'padroes',
    label: 'Padrão de contrato',
    href: '/gestao-vendas/padroes-contrato',
    icon: FileText,
    matchPaths: ['/gestao-vendas/padroes-contrato'],
  },
  {
    id: 'imoveis',
    label: 'Imóvel',
    href: '/imoveis',
    icon: Building2,
    matchPaths: ['/imoveis'],
  },
];

export function VendasTopTabs() {
  const location = useLocation();
  const pathname = location.pathname;

  const isTabActive = (tab: TabItem) => {
    if (tab.matchPaths) {
      return tab.matchPaths.some((path) => pathname.startsWith(path));
    }
    return pathname.startsWith(tab.href);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => {
        const isActive = isTabActive(tab);
        const Icon = tab.icon;

        if (tab.isPrimary) {
          return (
            <Link key={tab.id} to={tab.href}>
              <Button
                className={cn(
                  'rounded-xl h-11 px-5 transition-all',
                  'bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]',
                  'shadow-lg shadow-[var(--brand-focus)]',
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            </Link>
          );
        }

        return (
          <Link key={tab.id} to={tab.href}>
            <Button
              variant="outline"
              className={cn(
                'rounded-xl h-11 px-5 transition-all border',
                isActive
                  ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/8 text-[hsl(var(--accent))] font-medium shadow-sm'
                  : 'border-[var(--ui-stroke)] bg-[var(--ui-card)] hover:bg-[var(--ui-stroke)]/50 text-[var(--ui-text)]',
              )}
            >
              <Icon className={cn('w-4 h-4 mr-2', isActive ? 'text-[hsl(var(--accent))]' : '')} />
              {tab.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}

export default VendasTopTabs;
