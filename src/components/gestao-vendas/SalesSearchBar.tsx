import { Filter, Search } from 'lucide-react';
import { useState, type ChangeEventHandler, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface SalesSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  filtersCount?: number;
  className?: string;
  filtersTitle?: string;
  filtersDescription?: string;
  filtersContent?: ReactNode;
  hasActiveFilters?: boolean;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
}

export const SalesSearchBar = ({
  placeholder = 'Buscar na Gestão de Vendas por contrato, comprador, vendedor ou imóvel',
  value,
  onChange,
  filtersCount = 0,
  className,
  filtersTitle = 'Filtros de Gestão de Vendas',
  filtersDescription = 'Refine sua busca usando os filtros abaixo',
  filtersContent,
  hasActiveFilters = false,
  onApplyFilters,
  onClearFilters,
}: SalesSearchBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApply = () => {
    onApplyFilters?.();
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    onClearFilters?.();
    setIsFilterOpen(false);
  };

  const filterIsActive = hasActiveFilters || filtersCount > 0;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[hsl(var(--icon))] w-5 h-5" />
        <input
          type="text"
          aria-label="Buscar na gestão de vendas"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFilterOpen(true)}
          onClick={() => setIsFilterOpen(true)}
          className="w-full pl-12 pr-4 py-3 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-[hsl(var(--bgCard))] text-foreground placeholder:text-[hsl(var(--textMuted))] transition-all"
        />
      </div>

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Abrir filtros"
            className={cn(
              'relative p-3 rounded-xl active:scale-95 transition-transform border',
              filterIsActive
                ? 'bg-[hsl(var(--accent)/0.12)] border-[hsl(var(--accent))] text-[hsl(var(--accent))]'
                : 'bg-muted hover:bg-muted/80 border-border'
            )}
          >
            <Filter
              className={cn(
                'w-5 h-5',
                filterIsActive ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--icon))]'
              )}
            />
            {filtersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {filtersCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{filtersTitle}</SheetTitle>
            <SheetDescription>{filtersDescription}</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {filtersContent ?? (
              <p className="text-sm text-muted-foreground">
                Adicione os filtros específicos desta aba para começar.
              </p>
            )}

            <div className="pt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleClear}>
                Limpar
              </Button>
              <Button className="flex-1" onClick={handleApply}>
                Aplicar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SalesSearchBar;
