import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TopSearchBar } from '@/components/common/TopSearchBar';
import type { BusinessRuleCategory, BusinessRuleCategoryId, BusinessModuleType } from '@/types/businessRules';

interface BusinessRulesSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  categoryFilter: BusinessRuleCategoryId | 'all';
  onCategoryFilterChange: (value: BusinessRuleCategoryId | 'all') => void;
  typeFilter: BusinessModuleType | 'all';
  onTypeFilterChange: (value: BusinessModuleType | 'all') => void;
  editableFilter: 'all' | 'editable' | 'readonly';
  onEditableFilterChange: (value: 'all' | 'editable' | 'readonly') => void;
  categories: BusinessRuleCategory[];
  className?: string;
}

export function BusinessRulesSearchBar({
  value,
  onChange,
  categoryFilter,
  onCategoryFilterChange,
  typeFilter,
  onTypeFilterChange,
  editableFilter,
  onEditableFilterChange,
  categories,
  className,
}: BusinessRulesSearchBarProps) {
  const activeFilters =
    (categoryFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0) + (editableFilter !== 'all' ? 1 : 0);

  return (
    <div className={cn('space-y-3', className)}>
      <TopSearchBar
        placeholder="Buscar regras, módulos, campos, tabelas, etapas do funil"
        value={value}
        onChange={event => onChange(event.target.value)}
        onOpenFilter={() => {}}
        filtersCount={activeFilters}
        className="w-full"
      />

      <div className="flex flex-wrap gap-2">
        <Select value={categoryFilter} onValueChange={value => onCategoryFilterChange(value as BusinessRuleCategoryId | 'all')}>
          <SelectTrigger className="w-full md:w-52">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center justify-between gap-2">
                <span>Todas as categorias</span>
                <Badge variant="secondary" className="text-xs">{categories.length}</Badge>
              </div>
            </SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center justify-between gap-2">
                  <span>{category.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={value => onTypeFilterChange(value as BusinessModuleType | 'all')}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="Configuração">Configuração</SelectItem>
            <SelectItem value="Lista">Lista</SelectItem>
            <SelectItem value="Intervalo">Intervalo</SelectItem>
            <SelectItem value="Toggle">Toggle</SelectItem>
            <SelectItem value="Pontuação">Pontuação</SelectItem>
            <SelectItem value="Integração">Integração</SelectItem>
          </SelectContent>
        </Select>

        <Select value={editableFilter} onValueChange={value => onEditableFilterChange(value as 'all' | 'editable' | 'readonly')}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Editável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="editable">Editáveis</SelectItem>
            <SelectItem value="readonly">Somente leitura</SelectItem>
          </SelectContent>
        </Select>

        <div className="hidden md:flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filtros no mesmo padrão de Negociações
        </div>
      </div>
    </div>
  );
}

export default BusinessRulesSearchBar;
