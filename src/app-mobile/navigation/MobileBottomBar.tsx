import { NavLink } from 'react-router-dom';
import { House, TrendingUp, Calendar, Building } from 'lucide-react';

export const MobileBottomBar = () => {
  const navItems = [
    { to: '/', label: 'Home', Icon: House },
  { to: '/vendas', label: 'Negociações', Icon: TrendingUp },
    { to: '/agenda', label: 'Agenda', Icon: Calendar },
    { to: '/imoveis', label: 'Imóveis', Icon: Building }
  ];

  return (
    <nav className="h-20 px-2 bg-white border-t border-gray-100 rounded-t-3xl shadow-lg safe-area-pb md:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className="flex-1">
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center justify-center space-y-1 py-2 px-1 transition-all duration-150 ${
                  isActive ? 'text-[hsl(var(--accent))]' : 'text-gray-400'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-150 ${isActive ? 'bg-orange-50' : ''}`}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span
                  className={`text-xs font-medium leading-none transition-all duration-150 ${
                    isActive ? 'font-semibold' : 'font-normal'
                  }`}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomBar;
