import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  House,
  TrendingUp,
  Calendar,
  Building,
  Camera,
  Users,
  LogIn as LoginIcon,
  Share2,
  Shuffle,
  Plug as Plugs,
  FileDown,
  Bot,
  CreditCard,
  UserPlus,
  type LucideIcon
} from 'lucide-react';
import { getCurrentUser, canAccessBilling } from '@/utils/auth';
import { hasPermission } from '@/data/accessControl';
import {
  Drawer,
  DrawerContent
} from '@/components/ui/drawer';
import { shouldShowCreateAccountMenu, shouldShowLoginMenu } from '@/utils/env';

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  requiredPermission?: string;
  requiresBillingAccess?: boolean;
}

// Only extra items that are NOT in bottom bar (Home, Vendas, Agenda, Imóveis)
const loginNavItem = {
  id: 'login',
  label: 'Login',
  icon: LoginIcon,
  path: '/auth?tab=login'
} satisfies NavItem;

const createAccountNavItem = {
  id: 'create-account',
  label: 'Criar Cadastro',
  icon: UserPlus,
  path: '/onboarding/cadastro'
} satisfies NavItem;

const extraNavItems: NavItem[] = [
  ...(shouldShowCreateAccountMenu() ? [createAccountNavItem] : []),
  ...(shouldShowLoginMenu() ? [loginNavItem] : []),
  { id: 'usuarios', label: 'Usuários', icon: Users, path: '/usuarios' },
  { id: 'distribuicao', label: 'Distribuição', icon: Share2, path: '/distribuicao' },
  { id: 'gestao-api', label: 'Gestão API', icon: Plugs, path: '/gestao-api' },
  { id: 'gestao-roletao', label: 'Gestão Roletão', icon: Shuffle, path: '/gestao-roletao' },
  { id: 'gestao-relatorios', label: 'Relatórios', icon: FileDown, path: '/gestao-relatorios' },
  { id: 'automacoes', label: 'Automações', icon: Bot, path: '/automacoes' },
  { id: 'gestao-acessos', label: 'Gestão de acessos', icon: Users, path: '/gestao-acessos' },
  { id: 'gerenciamentodeservicos', label: 'Gerenciamento de serviços', icon: Camera, path: '/servicos' },
  { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard, path: '/pagamentos', requiresBillingAccess: true },
];

export const MobileDrawer = ({ open, onOpenChange }: MobileDrawerProps) => {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    }
  }, [open]);

  const handleNavigate = () => {
    onOpenChange(false);
  };

  const currentUser = getCurrentUser();
  const visibleNavItems = extraNavItems.filter(item => {
    if (item.requiresBillingAccess) {
      return canAccessBilling(currentUser);
    }
    return !item.requiredPermission || hasPermission(currentUser, item.requiredPermission);
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-4">
        <nav>
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase text-gray-500">
              Menu
            </h2>
            <ul className="space-y-1">
              {visibleNavItems.map((item, index) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={handleNavigate}
                    ref={index === 0 ? firstLinkRef : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                        isActive 
                          ? 'bg-orange-50 text-orange-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
