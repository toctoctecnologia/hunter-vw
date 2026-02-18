import { useMemo, useState } from 'react';

export interface ModuleFilterConfig<T> {
  key: keyof T;
  label: string;
  format?: (value: T[keyof T]) => string;
}

export const useModuleFilters = <T extends Record<string, string>>(
  initialFilters: T,
  config: ModuleFilterConfig<T>[]
) => {
  const [filters, setFilters] = useState<T>(initialFilters);

  const activeFilters = useMemo(
    () =>
      config
        .filter((item) => filters[item.key])
        .map((item) => ({
          label: item.label,
          value: item.format ? item.format(filters[item.key]) : filters[item.key],
        })),
    [config, filters]
  );

  const count = activeFilters.length;
  const hasActiveFilters = count > 0;

  const clearFilters = () => setFilters(initialFilters);

  const updateFilter = (key: keyof T, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return {
    filters,
    setFilters,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
    updateFilter,
  };
};

export default useModuleFilters;
