import { Menu, Search, Bell, CircleUser } from 'lucide-react';

interface MobileAppBarProps {
  title?: string;
  onOpenMenu: () => void;
}

export const MobileAppBar = ({ title, onOpenMenu }: MobileAppBarProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:hidden border-b border-gray-100">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          aria-label="Abrir menu"
          className="p-2 -ml-2"
        >
          <Menu className="w-6 h-6" />
        </button>
        {title && <span className="text-base font-semibold">{title}</span>}
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Buscar" className="p-2">
          <Search className="w-6 h-6" />
        </button>
        <button aria-label="Notificações" className="p-2">
          <Bell className="w-6 h-6" />
        </button>
        <button aria-label="Perfil" className="p-1">
          <CircleUser className="w-8 h-8" />
        </button>
      </div>
    </header>
  );
};

export default MobileAppBar;
