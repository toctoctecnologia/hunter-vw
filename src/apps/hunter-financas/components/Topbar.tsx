import { useLocation } from 'react-router-dom';
import { financeQuickActions, financeRouteMeta } from '../data/navigation';

export function Topbar() {
  const location = useLocation();
  const meta = financeRouteMeta[location.pathname] ?? financeRouteMeta['/apps/financas'];

  return (
    <div className="border-b border-border bg-card/80 px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Hunter Finanças
          </p>
          <h1 className="mt-1 text-xl font-semibold text-foreground">{meta.title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{meta.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {financeQuickActions.map((action) => {
            const baseClass =
              action.tone === 'primary'
                ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
                : action.tone === 'secondary'
                  ? 'bg-secondary text-secondary-foreground border border-border hover:bg-muted'
                  : 'text-muted-foreground hover:bg-muted';
            return (
              <button
                key={action.label}
                type="button"
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${baseClass}`}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
