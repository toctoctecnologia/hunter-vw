import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  rows: T[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  className?: string;
}

export const DataTable = <T extends { id: string }>({
  columns,
  rows,
  searchPlaceholder = 'Buscar',
  emptyMessage = 'Nenhum registro encontrado.',
  loading = false,
  onRowClick,
  className,
}: DataTableProps<T>) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const pageSize = 6;

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(normalized)
      )
    );
  }, [query, rows]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];
      if (valueA === valueB) return 0;
      const direction = sortDir === 'asc' ? 1 : -1;
      return String(valueA).localeCompare(String(valueB)) * direction;
    });
  }, [filteredRows, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const pagedRows = sortedRows.slice((page - 1) * pageSize, page * pageSize);

  const toggleAll = () => {
    if (selected.length === pagedRows.length) {
      setSelected([]);
    } else {
      setSelected(pagedRows.map((row) => row.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder={searchPlaceholder}
          className="h-10 max-w-xs rounded-xl border-[var(--ui-stroke)]"
        />
        <div className="text-xs text-[var(--ui-text-subtle)]">
          {selected.length > 0 ? `${selected.length} selecionado(s)` : `${filteredRows.length} registros`}
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[var(--ui-stroke)]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[var(--ui-stroke)]/30 text-xs font-medium uppercase text-[var(--ui-text-subtle)]">
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={selected.length === pagedRows.length && pagedRows.length > 0}
                  onCheckedChange={toggleAll}
                  className="rounded"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn('px-4 py-3 text-left', column.align === 'center' && 'text-center', column.align === 'right' && 'text-right')}
                >
                  <button
                    type="button"
                    className={cn('inline-flex items-center gap-1', column.sortable && 'cursor-pointer')}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    {column.label}
                    {sortKey === column.key && (
                      <span className="text-[10px]">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ui-stroke)]">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-[var(--ui-text-subtle)]">
                  Carregando dados...
                </td>
              </tr>
            ) : pagedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-[var(--ui-text-subtle)]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pagedRows.map((row) => (
                <tr
                  key={row.id}
                  className={cn('transition hover:bg-[var(--ui-stroke)]/30', onRowClick && 'cursor-pointer')}
                  onClick={() => onRowClick?.(row)}
                >
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onCheckedChange={() => toggleRow(row.id)}
                      className="rounded"
                    />
                  </td>
                  {columns.map((column) => (
                    <td
                      key={`${row.id}-${String(column.key)}`}
                      className={cn(
                        'px-4 py-3 text-[var(--ui-text)]',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {String(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--ui-text-subtle)]">
        <span>Página {page} de {totalPages}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-[var(--ui-stroke)]"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-[var(--ui-stroke)]"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
