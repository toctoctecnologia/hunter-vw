import { ReactNode, useMemo } from 'react'
import type { KeyboardEvent } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { SortDirection, SortState } from '@/types/reports'

export interface Column {
  key: string
  label: string
  render?: (row: any) => ReactNode
  sortable?: boolean
  sortKey?: string
}

interface ReportTableProps {
  data: any[]
  columns: Column[]
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  selectedRows: any[]
  onSelectRow: (row: any, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  sortState?: SortState | null
  onSort?: (column: string, direction: SortDirection) => void
  onRowClick?: (row: any) => void
  activeRowId?: string | number | null
  rowClickLabel?: string
  onConfigureColumns?: () => void
}

export default function ReportTable({
  data,
  columns,
  page,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  selectedRows,
  onSelectRow,
  onSelectAll,
  sortState,
  onSort,
  onRowClick,
  activeRowId,
  rowClickLabel,
  onConfigureColumns,
}: ReportTableProps) {
  const pageCount = Math.ceil(total / pageSize)
  const allSelected = data.length > 0 && selectedRows.length === data.length
  const someSelected = selectedRows.length > 0
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = total === 0 ? 0 : Math.min(total, page * pageSize)
  const handleSort = (column: Column) => {
    if (!onSort || !column.sortable) return
    const sortKey = column.sortKey ?? column.key
    const isSameColumn = sortState?.column === sortKey
    const nextDirection: SortDirection = isSameColumn && sortState?.direction === 'asc' ? 'desc' : 'asc'
    onSort(sortKey, nextDirection)
  }

  const tableHeaders = useMemo(
    () =>
      columns.map(col => {
        const sortKey = col.sortKey ?? col.key
        const isSorted = sortState?.column === sortKey
        const ariaSort = isSorted
          ? sortState?.direction === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
        const sortButtonLabel = (() => {
          if (!col.sortable) return undefined
          if (!onSort) return col.label
          if (isSorted) {
            const nextDirection = sortState?.direction === 'asc' ? 'decrescente' : 'crescente'
            return `Ordenar em ordem ${nextDirection} por ${col.label}`
          }
          return `Ordenar em ordem crescente por ${col.label}`
        })()

        const indicator = col.sortable ? (
          <span className="flex flex-col leading-none">
            <ChevronUp
              aria-hidden="true"
              className={`h-3 w-3 ${isSorted && sortState?.direction === 'asc' ? 'text-orange-600' : 'text-gray-300'}`}
            />
            <ChevronDown
              aria-hidden="true"
              className={`-mt-1 h-3 w-3 ${isSorted && sortState?.direction === 'desc' ? 'text-orange-600' : 'text-gray-300'}`}
            />
          </span>
        ) : null

        return (
          <TableHead
            key={col.key}
            className="text-gray-700"
            aria-sort={col.sortable ? ariaSort : undefined}
          >
            {col.sortable && onSort ? (
              <button
                type="button"
                onClick={() => handleSort(col)}
                className="flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-left transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                aria-label={sortButtonLabel}
              >
                <span className="flex-1 truncate">{col.label}</span>
                {indicator}
              </button>
            ) : (
              <span className="flex items-center justify-between gap-2">
                <span className="truncate">{col.label}</span>
                {indicator}
              </span>
            )}
          </TableHead>
        )
      }),
    [columns, onSort, sortState],
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 h-12 border-b border-gray-200 bg-gray-50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={checked => onSelectAll(!!checked)}
                  aria-label="Selecionar todos"
                  className="focus-visible:ring-orange-600/20 data-[state=checked]:border-orange-600 data-[state=checked]:bg-orange-600"
                />
              </TableHead>
              {tableHeaders}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => {
              const isSelected = selectedRows.some(selected => selected.id === row.id)
              const isActiveRow =
                activeRowId !== undefined && activeRowId !== null && String(row.id) === String(activeRowId)
              const baseBg = i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              const rowBg = isSelected || isActiveRow ? 'bg-orange-50' : baseBg
              const handleRowActivation = () => {
                if (onRowClick) {
                  onRowClick(row)
                }
              }
              const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
                if (!onRowClick) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onRowClick(row)
                }
              }
              return (
                <TableRow
                  key={row.id || i}
                  className={cn(
                    rowBg,
                    onRowClick && 'cursor-pointer hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600/60',
                    isActiveRow && 'ring-1 ring-orange-500/50',
                  )}
                  onClick={handleRowActivation}
                  onKeyDown={handleRowKeyDown}
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? 'button' : undefined}
                  aria-label={onRowClick ? rowClickLabel ?? 'Visualizar detalhes' : undefined}
                >
                  <TableCell
                    onClick={event => event.stopPropagation()}
                    onKeyDown={event => event.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={checked => onSelectRow(row, !!checked)}
                      aria-label={`Selecionar linha ${i + 1}`}
                      className="focus-visible:ring-orange-600/20 data-[state=checked]:border-orange-600 data-[state=checked]:bg-orange-600"
                    />
                  </TableCell>
                  {columns.map(col => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        'text-gray-900',
                        col.key === 'titulo' && onRowClick ? 'font-semibold text-orange-600' : undefined,
                      )}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 text-sm text-gray-700 sm:flex-row sm:items-center sm:gap-4">
          <span>
            Exibindo{' '}
            <span className="font-medium">{rangeStart}</span>
            {'–'}
            <span className="font-medium">{rangeEnd}</span>
            {' '}
            de <span className="font-medium">{total}</span> resultados
          </span>
          <span
            aria-live="polite"
            className={`text-sm ${someSelected ? 'text-orange-600' : 'sr-only'}`}
          >
            {someSelected
              ? `${selectedRows.length} selecionado${selectedRows.length > 1 ? 's' : ''}`
              : ''}
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex flex-wrap items-center justify-end gap-3">
            {onConfigureColumns && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onConfigureColumns}
                className="h-8 border-gray-300 text-gray-700"
              >
                Configurar colunas
              </Button>
            )}
            {onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Registros por página:</span>
                <Select value={String(pageSize)} onValueChange={v => onPageSizeChange(Number(v))}>
                  <SelectTrigger className="h-8 w-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[25, 50, 100, 200].map(size => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {pageCount > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                    onClick={e => {
                      e.preventDefault()
                      onPageChange(Math.max(1, page - 1))
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: pageCount }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href="#"
                      isActive={page === idx + 1}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                      aria-label={`Ir para página ${idx + 1}`}
                      onClick={e => {
                        e.preventDefault()
                        onPageChange(idx + 1)
                      }}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                    onClick={e => {
                      e.preventDefault()
                      onPageChange(Math.min(pageCount, page + 1))
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}

