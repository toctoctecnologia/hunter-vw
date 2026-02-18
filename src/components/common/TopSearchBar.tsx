import { Filter, Search } from 'lucide-react';
import type { ChangeEventHandler } from 'react';
import { cn } from '@/lib/utils';

interface TopSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onOpenFilter?: () => void;
  filtersCount?: number;
  className?: string;
}

export const TopSearchBar = ({
  placeholder = 'Buscar',
  value,
  onChange,
  onOpenFilter,
  filtersCount = 0,
  className
}: TopSearchBarProps) => {
  const hasFilters = filtersCount > 0;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          aria-label="Buscar usuários"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
        />
      </div>
      <button
        onClick={onOpenFilter}
        aria-label="Abrir filtros"
        type="button"
        className={cn(
          'relative inline-flex h-12 w-12 items-center justify-center rounded-xl border text-gray-600 transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          hasFilters
            ? 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
            : 'bg-gray-100 border-transparent hover:bg-gray-200',
          !onOpenFilter && 'cursor-default'
        )}
      >
        <Filter className={cn('w-5 h-5', hasFilters ? 'text-orange-600' : 'text-gray-600')} />
        {filtersCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[11px] font-semibold leading-none w-5 h-5 rounded-full flex items-center justify-center">
            {filtersCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default TopSearchBar;
