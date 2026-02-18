import { Link } from 'react-router-dom';
import { ComponentType } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  NAV_BASE,
  NAV_ACTIVE,
  NAV_ACTIVE_ICON,
  NAV_INACTIVE,
  NAV_INACTIVE_ICON
} from './navStyles';

interface NavItemProps {
  to: string;
  label: string;
  icon: ComponentType<any>;
  isActive?: boolean;
  onNavigate?: () => void;
  collapsed?: boolean;
}

export const NavItem = ({ to, label, icon: Icon, isActive, onNavigate, collapsed = false }: NavItemProps) => {
  const base = `${NAV_BASE} ${collapsed ? 'justify-center px-3 h-14 gap-2' : ''} ${
    isActive ? NAV_ACTIVE : NAV_INACTIVE
  }`;
  const iconClass = `${isActive ? NAV_ACTIVE_ICON : NAV_INACTIVE_ICON} ${collapsed ? 'h-7 w-7' : ''}`;

  const link = (
    <Link
      to={to}
      onClick={onNavigate}
      className={base}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
    >
      <Icon className={iconClass} strokeWidth={isActive ? 2.5 : 2} />
      {!collapsed && <span>{label}</span>}
      {collapsed && <span className="sr-only">{label}</span>}
    </Link>
  );

  if (!collapsed) {
    return link;
  }

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NavItem;
