import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, PanelLeftClose, PanelLeftOpen, Search, Sun, Moon, Monitor, LogOut, User, Settings } from 'lucide-react';
import { SidebarNav } from '@/components/shell/SidebarNav';
import { useTheme, type ThemePreference } from '@/hooks/useTheme';
import AppLauncher from '@/components/header/AppLauncher';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GlobalSearchModal from '@/components/search/GlobalSearchModal';
import { flattenNavigationItems, getNavigationItems } from '@/config/navigation';
import { getCurrentUser, canAccessBilling } from '@/utils/auth';

interface AppLayoutProps {
  children: ReactNode;
  initialActiveTab?: string;
}

const SIDEBAR_STORAGE_KEY = 'sidebarCollapsed';
const NOTIFICATION_BADGE_COUNT = 2;

const themeOptions: Array<{ value: ThemePreference; label: string; icon: typeof Sun }> = [
  { value: 'claro', label: 'Claro', icon: Sun },
  { value: 'escuro', label: 'Escuro', icon: Moon },
  { value: 'sistema', label: 'Automático', icon: Monitor },
];

export const AppLayout = ({ children, initialActiveTab = 'home' }: AppLayoutProps) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { preference, setTheme } = useTheme();
  const currentUser = getCurrentUser();
  const navItems = useMemo(
    () => getNavigationItems({ canAccessBilling: canAccessBilling(currentUser) }),
    [currentUser],
  );
  const pageTitle = useMemo(() => {
    const flattened = flattenNavigationItems(navItems);
    const match = flattened
      .filter(item => item.path === location.pathname || location.pathname.startsWith(`${item.path}/`))
      .sort((a, b) => b.path.length - a.path.length)[0];
    return match?.label ?? 'Home';
  }, [location.pathname, navItems]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth?tab=login');
  };

  const handleNotificationClick = () => {
    navigate('/notificacoes');
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => !prev);
    }
  };

  const isSidebarCondensed = isSidebarCollapsed || !sidebarOpen;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === 'true') {
      setIsSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const currentThemeOption = themeOptions.find(opt => opt.value === preference) ?? themeOptions[0];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {isMobile && sidebarOpen ? (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - seguindo print de referência */}
        <header className="h-14 bg-card flex items-center justify-between px-4 border-b border-border flex-shrink-0">
          {/* Esquerda: toggle sidebar + título da página */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              aria-label={isSidebarCondensed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {isSidebarCondensed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-base font-medium text-foreground">{pageTitle}</h1>
          </div>

          {/* Direita: lupa, tema, sino, apps, avatar */}
          <div className="flex items-center gap-1">
            {/* Pesquisa global */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Pesquisa global (Ctrl+K)"
              className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Seletor de tema */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Selecionar tema"
                  className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <currentThemeOption.icon size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {themeOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setTheme(option.value)}
                      className={preference === option.value ? 'bg-muted' : ''}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {option.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notificações */}
            <button
              onClick={handleNotificationClick}
              aria-label="Notificações"
              className="relative h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Bell size={20} />
              {NOTIFICATION_BADGE_COUNT > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 min-w-[1rem] rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground flex items-center justify-center">
                  {NOTIFICATION_BADGE_COUNT}
                </span>
              )}
            </button>

            {/* App Launcher (grid de 9 pontos) */}
            <AppLauncher />

            {/* Avatar / Menu de perfil */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="ml-1 w-9 h-9 bg-primary rounded-full flex items-center justify-center overflow-hidden border-2 border-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  aria-label="Menu de perfil"
                >
                  <img
                    src="/uploads/6af569d2-dc3a-4668-8d4f-843a7c62507d.png"
                    alt="Perfil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = 'DC';
                    }}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onSelect={() => navigate('/perfil')}>
                  <User className="mr-2 h-4 w-4" />
                  Meu perfil
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/configuracoes')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
      <GlobalSearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  );
};

export default AppLayout;
