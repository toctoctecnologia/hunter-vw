import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TocTocFilters } from '../api';

interface TocTocFiltersProps {
  filters: TocTocFilters;
  onChange: (next: TocTocFilters) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const TocTocFiltersForm = ({ filters, onChange, onSubmit, isLoading }: TocTocFiltersProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const updateField = (key: keyof TocTocFilters, value: string | number | undefined) => {
    onChange({
      ...filters,
      [key]: value,
      offset: key === 'limit' ? 0 : filters.offset ?? 0,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 items-end"
    >
      <div className="space-y-2">
        <Label htmlFor="filter-city">Cidade</Label>
        <Input
          id="filter-city"
          placeholder="Ex.: São Paulo"
          value={filters.city ?? ''}
          onChange={event => updateField('city', event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-state">Estado</Label>
        <Input
          id="filter-state"
          placeholder="Ex.: SP"
          value={filters.state ?? ''}
          onChange={event => updateField('state', event.target.value)}
          maxLength={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-type">Tipo</Label>
        <Input
          id="filter-type"
          placeholder="Apartamento, Casa..."
          value={filters.type_property ?? ''}
          onChange={event => updateField('type_property', event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-limit">Qtd. por página (máx. 100)</Label>
        <Input
          id="filter-limit"
          type="number"
          min={1}
          max={100}
          value={filters.limit ?? 12}
          onChange={event => updateField('limit', Number(event.target.value))}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="h-10 md:mt-6">
        {isLoading ? 'Buscando...' : 'Buscar imóveis'}
      </Button>
    </form>
  );
};

export default TocTocFiltersForm;
