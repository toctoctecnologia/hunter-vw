import type { ComponentType } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe2, Blocks, PanelsTopLeft, BarChart3, Settings, CreditCard } from 'lucide-react';

export interface SidebarNavItem {
  label: string;
  description: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
}

interface SidebarProps {
  items: SidebarNavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="hidden w-72 flex-col border-r border-[var(--hs-border-subtle)] bg-[var(--hs-sidebar)] text-[var(--hs-sidebar-text)] lg:flex">
      <div className="flex items-center gap-3 px-8 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--hs-accent)] text-[var(--hs-text-inverse)] shadow-[var(--hs-shadow-sm)]">
          HS
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--hs-sidebar-text)]/80">Hunter Apps</p>
          <p className="text-lg font-semibold text-[var(--hs-text-inverse)]">HunterSites</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-start gap-3 rounded-xl px-4 py-3 transition-colors duration-150 ${
                isActive
                  ? 'bg-[var(--hs-accent-soft)] text-[var(--hs-text-inverse)]'
                  : 'text-[var(--hs-sidebar-text)] hover:bg-white/5 hover:text-[var(--hs-text-inverse)]'
              }`
            }
            end={item.to === '/apps/huntersites'}
          >
            <item.icon className="mt-0.5 h-5 w-5" />
            <span className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">{item.label}</span>
              <span className="text-xs text-[var(--hs-sidebar-text)]/80">{item.description}</span>
            </span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/5 px-8 py-6 text-xs text-[var(--hs-sidebar-text)]/70">
        <p>Precisa de ajuda?</p>
        <p className="font-medium text-[var(--hs-text-inverse)]">support@huntercrm.com.br</p>
      </div>
    </aside>
  );
}

export const defaultSidebarItems: SidebarNavItem[] = [
  {
    label: 'Visão geral',
    description: 'Resultados e destaques',
    to: '/apps/huntersites',
    icon: LayoutDashboard,
  },
  {
    label: 'Meus sites',
    description: 'Gerencie seus domínios',
    to: '/apps/huntersites/sites',
    icon: Globe2,
  },
  {
    label: 'Templates',
    description: 'Biblioteca HunterSites',
    to: '/apps/huntersites/templates',
    icon: Blocks,
  },
  {
    label: 'Landing pages',
    description: 'Campanhas personalizadas',
    to: '/apps/huntersites/landings',
    icon: PanelsTopLeft,
  },
  {
    label: 'Analytics',
    description: 'Fontes e conversões',
    to: '/apps/huntersites/analytics',
    icon: BarChart3,
  },
  {
    label: 'Configurações',
    description: 'Equipe e integrações',
    to: '/apps/huntersites/settings',
    icon: Settings,
  },
  {
    label: 'Pagamentos',
    description: 'Faturas e plano',
    to: '/apps/huntersites/billing',
    icon: CreditCard,
  },
];
