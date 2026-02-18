import { ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ArrowUpDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (row: any) => ReactNode
}

interface ReportsTableProps {
  data: any[]
  columns: Column[]
  sortKey: string
  sortDir: 'asc' | 'desc'
  onSort: (key: string) => void
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  selectedRows: any[]
  onSelectRow: (row: any, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
}

export function ReportsTable({
  data,
  columns,
  sortKey,
  sortDir,
  onSort,
  page,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  selectedRows,
  onSelectRow,
  onSelectAll,
}: ReportsTableProps) {
  const pageCount = Math.ceil(total / pageSize)
  const allSelected = data.length > 0 && selectedRows.length === data.length
  const someSelected = selectedRows.length > 0

  return (
    <div className="space-y-4">
      <div className="hidden md:block rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              {columns.map(col => (
                <TableHead
                  key={col.key}
                  className={`text-gray-700 font-medium ${col.sortable ? 'cursor-pointer select-none hover:text-gray-900' : ''}`}
                  onClick={col.sortable ? () => onSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => {
              const isSelected = selectedRows.some(selected => selected.id === row.id)
              return (
                <TableRow 
                  key={row.id || i} 
                  className={`border-b border-gray-100 hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => onSelectRow(row, !!checked)}
                      aria-label={`Selecionar linha ${i + 1}`}
                    />
                  </TableCell>
                  {columns.map(col => (
                    <TableCell key={col.key} className="text-gray-900">
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden space-y-3">
        {data.map((row, i) => {
          const isSelected = selectedRows.some(selected => selected.id === row.id)
          return (
            <div key={row.id || i} className={`border rounded-lg p-4 space-y-3 ${isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelectRow(row, !!checked)}
                  aria-label={`Selecionar item ${i + 1}`}
                />
                <span className="text-sm text-gray-500">#{row.id}</span>
              </div>
              {columns.map(col => (
                <div key={col.key} className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{col.label}</span>
                  <span className="text-gray-900">{col.render ? col.render(row) : row[col.key]}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-between bg-white border-t border-gray-200 px-4 py-3 rounded-b-lg">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            Total: <span className="font-medium">{total}</span> registros
          </span>
          {someSelected && (
            <span className="text-sm text-blue-600">
              {selectedRows.length} selecionado{selectedRows.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Registros por página:</span>
            <Select value={String(pageSize)} onValueChange={v => onPageSizeChange(Number(v))}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[25, 50, 100].map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {pageCount > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
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

export default ReportsTable
