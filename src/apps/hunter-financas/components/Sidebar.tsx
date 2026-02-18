import { NavLink } from 'react-router-dom';
import { financeNavItems } from '../data/navigation';

export function Sidebar() {
  return (
    <aside className="flex w-72 flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--surface2))]">
      <div className="flex h-16 items-center gap-3 border-b border-[hsl(var(--border))] px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsl(var(--brandPrimary))] text-white shadow-[var(--shadow-sm)]">
          <span className="text-lg font-semibold">HF</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[hsl(var(--text))]">Hunter Finanças</p>
          <p className="text-xs text-[hsl(var(--textMuted))]">ERP financeiro interno</p>
        </div>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
        {financeNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/apps/financas'}
              className={({ isActive }) =>
                `group flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                  isActive
                    ? 'border-[hsl(var(--brandPrimary))] bg-[hsl(var(--brandPrimary))]/10 text-[hsl(var(--brandPrimary))]'
                    : 'border-transparent text-[hsl(var(--text))] hover:border-[hsl(var(--border))] hover:bg-[hsl(var(--surface3))]'
                }`
              }
            >
              <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-semibold leading-none">{item.label}</p>
                <p className="mt-1 text-xs text-[hsl(var(--textMuted))] group-hover:text-[hsl(var(--text))]">
                  {item.description}
                </p>
              </div>
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-[hsl(var(--border))] px-6 py-4">
        <div className="rounded-2xl bg-[hsl(var(--surface3))] p-4">
          <p className="text-xs font-semibold uppercase text-[hsl(var(--textMuted))]">Motor financeiro</p>
          <p className="mt-2 text-sm text-[hsl(var(--text))]">
            Conectado ao CRM e Locação, sem duplicar informações críticas.
          </p>
        </div>
      </div>
    </aside>
  );
}
