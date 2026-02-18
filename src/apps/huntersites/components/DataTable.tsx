import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface Column<T> {
  id: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  empty?: ReactNode;
}

export function DataTable<T>({ columns, data, empty }: DataTableProps<T>) {
  if (data.length === 0) {
    if (!empty) return null;
    return <>{empty}</>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--hs-border-subtle)] bg-[var(--hs-card)] shadow-[var(--hs-shadow-sm)]">
      <Table>
        <TableHeader className="bg-[var(--hs-surface)]">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={`text-xs font-semibold uppercase tracking-wide text-[var(--hs-text-muted)] ${
                  column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                } ${column.width ?? ''}`.trim()}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={(row as unknown as { id?: string }).id ?? index} className="border-t border-[var(--hs-border-subtle)]">
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={`text-sm text-[var(--hs-text-primary)] ${
                    column.align === 'right'
                      ? 'text-right'
                      : column.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
