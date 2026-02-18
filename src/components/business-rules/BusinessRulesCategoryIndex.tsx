import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { BusinessRuleCategoryId } from '@/types/businessRules';

export interface CategorySummary {
  id: BusinessRuleCategoryId;
  title: string;
  description: string;
  modulesCount: number;
  rulesCount: number;
}

interface BusinessRulesCategoryIndexProps {
  categories: CategorySummary[];
  activeCategoryId: BusinessRuleCategoryId;
  onSelect: (categoryId: BusinessRuleCategoryId) => void;
}

export function BusinessRulesCategoryIndex({ categories, activeCategoryId, onSelect }: BusinessRulesCategoryIndexProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {categories.map(category => {
        const isActive = category.id === activeCategoryId;
        const empty = category.modulesCount === 0;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className="text-left"
            aria-pressed={isActive}
          >
            <Card
              className={cn(
                'h-full w-full transition border bg-card hover:border-primary/50',
                isActive && 'border-primary shadow-md ring-1 ring-primary/30',
                empty && 'opacity-70'
              )}
            >
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold leading-tight">{category.title}</p>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                  <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs">
                    {category.modulesCount} módulo{category.modulesCount === 1 ? '' : 's'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                    {category.rulesCount} regras
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px]">
                    Camada 2 · Índice
                  </span>
                </div>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}

export default BusinessRulesCategoryIndex;
