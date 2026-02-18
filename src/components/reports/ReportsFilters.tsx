import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { DatePickerInput } from '@/components/ui/DatePickerInput'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RefreshCw, Search } from 'lucide-react'
import type { ReportPeriodPreset } from '@/types/reports'

export interface ReportFilters {
  search: string
  startDate: Date | null
  endDate: Date | null
  filial: string
  usuario: string
  status: string
  origem: string
  codigo: string
  titulo: string
  utm: string
  tipo: string
  teamId: string
  storeId: string
  ownerId: string
  periodPreset: ReportPeriodPreset
  customPeriod: {
    start: Date | null
    end: Date | null
  }
  [key: string]: any
}

interface ReportsFiltersProps {
  filters: ReportFilters
  onChange: (filters: ReportFilters) => void
  onApply: () => void
  onClear: () => void
  onRefresh: () => void
  extraFilters?: ReactNode
}

export function ReportsFilters({
  filters,
  onChange,
  onApply,
  onClear,
  onRefresh,
  extraFilters,
}: ReportsFiltersProps) {
  const setFilter = (key: string, value: any) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') onApply()
            }}
            className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <DatePickerInput
          value={filters.startDate}
          onChange={d => setFilter('startDate', d)}
          className="w-40 h-10"
        />
        <DatePickerInput
          value={filters.endDate}
          onChange={d => setFilter('endDate', d)}
          className="w-40 h-10"
        />
        <Select value={filters.filial} onValueChange={v => setFilter('filial', v)}>
          <SelectTrigger className="w-40 h-10 border-gray-300">
            <SelectValue placeholder="Filial" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="filial1">Filial 1</SelectItem>
            <SelectItem value="filial2">Filial 2</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.usuario} onValueChange={v => setFilter('usuario', v)}>
          <SelectTrigger className="w-40 h-10 border-gray-300">
            <SelectValue placeholder="Usuário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="user1">Usuário 1</SelectItem>
            <SelectItem value="user2">Usuário 2</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={v => setFilter('status', v)}>
          <SelectTrigger className="w-40 h-10 border-gray-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="open">Aberto</SelectItem>
            <SelectItem value="closed">Fechado</SelectItem>
          </SelectContent>
        </Select>
        {extraFilters}
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button onClick={onApply} className="bg-blue-600 hover:bg-blue-700 text-white">
          Aplicar Filtros
        </Button>
        <Button variant="ghost" onClick={onClear} className="text-gray-600 hover:text-gray-900">
          Limpar
        </Button>
        <Button variant="outline" onClick={onRefresh} className="border-gray-300">
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>
    </div>
  )
}

export default ReportsFilters
