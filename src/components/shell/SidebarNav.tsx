import {
  X,
  Settings as GearIcon,
  LogOut as LogoutIcon,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavItem } from '@/ui/sidebar/NavItem';
import { getCurrentUser, canAccessBilling } from '@/utils/auth';
import { cn } from '@/lib/utils';
import { getNavigationItems, type NavigationItem } from '@/config/navigation';
import { LogoMark } from '@/components/brand/LogoMark';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddClick?: () => void;
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export const SidebarNav = ({
  activeTab,
  setActiveTab,
  isOpen,
  isCollapsed,
  onClose,
  onLogout = () => {}
}: SidebarNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();
  const [expandedItems, setExpandedItems] = useState<string[]>(['gestao-locacao', 'gestao-vendas']);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const canSeePagamentos = canAccessBilling(currentUser);
  const navItems = getNavigationItems({ canAccessBilling: canSeePagamentos });

  const getCurrentActiveTab = () => {
    const currentPath = location.pathname;
    if (currentPath === '/') return activeTab;
    if (currentPath === '/vendas') return 'vendas';
    if (currentPath === '/servicos') return 'gerenciamentodeservicos';
    if (currentPath === '/indicadores') return 'indicadores';
    if (currentPath === '/imoveis') return 'imoveis';
    if (currentPath === '/gestao-imoveis') return 'gestao-imoveis';
    if (currentPath.startsWith('/gestao-locacao')) return 'gestao-locacao';
    if (currentPath.startsWith('/gestao-vendas')) return 'gestao-vendas';
    if (currentPath.startsWith('/leads')) return 'gestao-leads';
    if (currentPath === '/auth') return 'login';
    if (currentPath.startsWith('/onboarding/cadastro')) return 'create-account';
    if (currentPath.startsWith('/usuarios')) return 'usuarios';
    if (currentPath === '/distribuicao') return 'distribuicao';
    if (currentPath === '/gestao-api') return 'gestao-api';
    if (currentPath === '/gestao-roletao') return 'gestao-roletao';
    if (currentPath === '/gestao-relatorios') return 'gestao-relatorios';
    if (currentPath === '/automacoes') return 'automacoes';
    if (
      currentPath === '/regras-de-negocio' ||
      currentPath === '/business-rules' ||
      currentPath === '/regrasdenegocios'
    ) {
      return 'business-rules';
    }
    if (currentPath === '/gestao-acessos') return 'gestao-acessos';
    if (currentPath === '/pagamentos' || currentPath === '/billing') return 'pagamentos';
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem?.id || activeTab;
  };

  const currentActiveTab = getCurrentActiveTab();

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isChildActive = (children?: NavigationItem[]) => {
    if (!children) return false;
    return children.some(child => location.pathname === child.path);
  };

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        'fixed top-0 left-0 h-full bg-card rounded-tl-3xl rounded-bl-3xl shadow-lg flex flex-col py-4 transform transition-all duration-300 md:relative md:translate-x-0 overflow-y-auto',
        isCollapsed ? 'md:w-16 w-64' : 'md:w-56 w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      <div className={cn('sidebar-header flex justify-center items-center py-4 relative', isCollapsed ? 'px-2' : 'px-4')}>
        <Link to="/" className={cn('flex items-center w-full', isCollapsed ? 'justify-center' : 'justify-start gap-3')}>
          <LogoMark className={cn('transition-all duration-300', isCollapsed ? 'h-10 w-10' : 'h-7 w-7')} />
          {!isCollapsed && <span className="text-lg font-semibold text-[hsl(var(--accent))]">Hunter</span>}
        </Link>
        <button
          onClick={onClose}
          aria-label="Fechar menu"
          className="absolute top-2 right-2 p-2 rounded hover:bg-muted md:hidden"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className={cn('space-y-1 flex-1', isCollapsed ? 'px-2' : '')}>
        {navItems.map(item => {
          const isActive = currentActiveTab === item.id;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.id);
          const childActive = isChildActive(item.children);
          const iconSize = isCollapsed ? 'h-7 w-7' : 'h-5 w-5';
          const activeStyles =
            'bg-[hsl(var(--accentSoft))]/15 text-[hsl(var(--accent))] ring-1 ring-inset ring-[hsl(var(--accent))]/25 dark:bg-[hsl(var(--bgSubtle))] dark:border dark:border-[hsl(var(--accent))]/40';
          const inactiveStyles = 'text-foreground/80 hover:bg-muted hover:text-foreground';

          if (hasChildren) {
            const buttonContent = (
              <button
                onClick={() => {
                  setActiveTab(item.id);
                  if (location.pathname !== item.path) {
                    navigate(item.path);
                  }
                  if (!isCollapsed) {
                    toggleExpanded(item.id);
                  }
                }}
                title={item.label}
                aria-label={isCollapsed ? item.label : undefined}
                className={cn(
                  'w-full flex items-center text-sm transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))]/40',
                  isCollapsed ? 'justify-center px-3 h-14' : 'justify-between px-4 h-11',
                  isActive || childActive ? activeStyles : inactiveStyles
                )}
              >
                <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center' : '')}>
                  <item.icon className={iconSize} />
                  {!isCollapsed && <span>{item.label}</span>}
                  {isCollapsed && <span className="sr-only">{item.label}</span>}
                </div>
                {!isCollapsed && (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
              </button>
            );

            return (
              <div key={item.id}>
                {isCollapsed ? (
                  <TooltipProvider delayDuration={120}>
                    <Tooltip>
                      <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                      <TooltipContent side="right" className="p-2">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">{item.label}</div>
                        <div className="flex flex-col gap-1">
                          {item.children?.map(child => (
                            <Link
                              key={child.id}
                              to={child.path}
                              className={cn(
                                'rounded px-2 py-1 text-sm text-foreground/80 hover:bg-muted hover:text-foreground',
                                location.pathname === child.path && 'bg-muted text-foreground'
                              )}
                              onClick={() => setActiveTab(child.id)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  buttonContent
                )}
                {isExpanded && !isCollapsed && (
                  <div className="ml-4 border-l border-border">
                    {item.children?.map(child => (
                      <NavItem
                        key={child.id}
                        to={child.path}
                        icon={child.icon}
                        label={child.label}
                        isActive={location.pathname === child.path}
                        onNavigate={() => setActiveTab(child.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavItem
              key={item.id}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isActive={isActive}
              collapsed={isCollapsed}
              onNavigate={() => setActiveTab(item.id)}
            />
          );
        })}
      </div>
      <div className={cn('sidebar-footer flex items-center gap-4 border-t border-border px-4 py-3', isCollapsed ? 'flex-col px-2 gap-2' : '')}>
        <Link to="/perfil">
          <button className={cn('p-2 rounded hover:bg-muted', isCollapsed ? 'w-full flex justify-center h-12' : '')}>
            <GearIcon size={isCollapsed ? 26 : 24} className="text-muted-foreground" />
          </button>
        </Link>
        <button
          onClick={onLogout}
          className={cn('p-2 rounded hover:bg-muted text-destructive', isCollapsed ? 'w-full flex justify-center h-12' : '')}
        >
          <LogoutIcon size={isCollapsed ? 26 : 24} />
        </button>
      </div>
    </aside>
  );
};

export default SidebarNav;
