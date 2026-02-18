import { X, RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePickerInput } from '@/components/ui/DatePickerInput'
import type { ReportFilters } from '@/components/reports/ReportsFilters'

interface FilterBarProps {
  filters: ReportFilters
  onChange: (filters: ReportFilters) => void
  onApply: () => void
  onClear: () => void
  onRefresh: () => void
}

const PERIOD_OPTIONS = [
  { value: 'last7', label: 'Últimos 7 dias' },
  { value: 'last15', label: 'Últimos 15 dias' },
  { value: 'last30', label: 'Últimos 30 dias' },
  { value: 'last90', label: 'Últimos 90 dias' },
  { value: 'currentMonth', label: 'Mês atual' },
  { value: 'custom', label: 'Período personalizado' },
]

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'vendido', label: 'Vendido' },
]

const TYPE_OPTIONS = [
  { value: 'todos', label: 'Todos os tipos' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'rural', label: 'Rural' },
]

const OWNER_OPTIONS = [
  { value: 'todos', label: 'Todos os responsáveis' },
  { value: 'owner-1', label: 'Ana Ribeiro' },
  { value: 'owner-2', label: 'Carlos Mendes' },
  { value: 'owner-3', label: 'Fernanda Alves' },
]

const TEAM_OPTIONS = [
  { value: 'todas', label: 'Todas as equipes' },
  { value: 'team-a', label: 'Equipe A' },
  { value: 'team-b', label: 'Equipe B' },
]

const STORE_OPTIONS = [
  { value: 'todas', label: 'Todas as lojas' },
  { value: 'store-1', label: 'Loja Centro' },
  { value: 'store-2', label: 'Loja Zona Sul' },
]

const OPTION_LABELS = {
  status: Object.fromEntries(STATUS_OPTIONS.map(option => [option.value, option.label])),
  tipo: Object.fromEntries(TYPE_OPTIONS.map(option => [option.value, option.label])),
  ownerId: Object.fromEntries(OWNER_OPTIONS.map(option => [option.value, option.label])),
  teamId: Object.fromEntries(TEAM_OPTIONS.map(option => [option.value, option.label])),
  storeId: Object.fromEntries(STORE_OPTIONS.map(option => [option.value, option.label])),
}

const DEFAULT_PERIOD_PRESET: ReportFilters['periodPreset'] = 'last30'

function formatDate(date: Date | null) {
  if (!date) return ''
  return date.toLocaleDateString('pt-BR')
}

function getPeriodLabel(preset: ReportFilters['periodPreset']) {
  return PERIOD_OPTIONS.find(option => option.value === preset)?.label ?? ''
}

function getPeriodChip(filters: ReportFilters) {
  if (filters.periodPreset === 'custom') {
    const start = formatDate(filters.customPeriod.start)
    const end = formatDate(filters.customPeriod.end)
    if (start && end) {
      return `Período: ${start} - ${end}`
    }
    return null
  }
  if (filters.periodPreset !== DEFAULT_PERIOD_PRESET) {
    return `Período: ${getPeriodLabel(filters.periodPreset)}`
  }
  return null
}

export default function FilterBar({
  filters,
  onChange,
  onApply,
  onClear,
  onRefresh,
}: FilterBarProps) {
  const setFilter = (key: string, value: any) => {
    onChange({ ...filters, [key]: value })
  }

  const handleSearchChange = (value: string) => {
    onChange({
      ...filters,
      search: value,
      codigo: value,
      titulo: value,
      utm: value,
    })
  }

  const handleCustomPeriodChange = (key: 'start' | 'end', value: Date | null) => {
    onChange({
      ...filters,
      customPeriod: {
        ...filters.customPeriod,
        [key]: value,
      },
    })
  }

  const removeFilter = (key: string) => {
    if (key === 'search') {
      onChange({
        ...filters,
        search: '',
        codigo: '',
        titulo: '',
        utm: '',
      })
      return
    }

    if (key === 'status' || key === 'ownerId') {
      setFilter(key, 'todos')
      return
    }

    if (key === 'tipo') {
      setFilter(key, 'todos')
      return
    }

    if (key === 'teamId' || key === 'storeId') {
      setFilter(key, 'todas')
      return
    }

    if (key === 'period') {
      onChange({
        ...filters,
        periodPreset: DEFAULT_PERIOD_PRESET,
        customPeriod: { start: null, end: null },
      })
    }
  }

  const activeFilters = [] as { key: string; label: string }[]

  const searchValue = filters.search?.trim()
  if (searchValue) {
    activeFilters.push({ key: 'search', label: `Busca: ${searchValue}` })
  }

  if (filters.status && filters.status !== 'todos') {
    activeFilters.push({
      key: 'status',
      label: `Status: ${OPTION_LABELS.status[filters.status] ?? filters.status}`,
    })
  }

  if (filters.tipo && filters.tipo !== 'todos') {
    activeFilters.push({
      key: 'tipo',
      label: `Tipo: ${OPTION_LABELS.tipo[filters.tipo] ?? filters.tipo}`,
    })
  }

  if (filters.ownerId && filters.ownerId !== 'todos') {
    activeFilters.push({
      key: 'ownerId',
      label: `Responsável: ${OPTION_LABELS.ownerId[filters.ownerId] ?? filters.ownerId}`,
    })
  }

  if (filters.teamId && filters.teamId !== 'todas') {
    activeFilters.push({
      key: 'teamId',
      label: `Equipe: ${OPTION_LABELS.teamId[filters.teamId] ?? filters.teamId}`,
    })
  }

  if (filters.storeId && filters.storeId !== 'todas') {
    activeFilters.push({
      key: 'storeId',
      label: `Loja: ${OPTION_LABELS.storeId[filters.storeId] ?? filters.storeId}`,
    })
  }

  const periodChip = getPeriodChip(filters)
  if (periodChip) {
    activeFilters.push({ key: 'period', label: periodChip })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[260px]">
          <label htmlFor="report-search" className="sr-only">
            Buscar por código, título ou UTM
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="report-search"
              placeholder="Buscar por código, título ou UTM"
              value={filters.search}
              onChange={e => handleSearchChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') onApply()
              }}
              className="pl-10 rounded-xl border-gray-200 focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Use um termo para localizar um imóvel pelo código, título ou parâmetro UTM.
          </p>
        </div>

        <div className="min-w-[180px]">
          <label htmlFor="status-filter" className="sr-only">
            Filtrar por status
          </label>
          <Select value={filters.status} onValueChange={value => setFilter('status', value)}>
            <SelectTrigger
              id="status-filter"
              className="rounded-xl border-gray-200 focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[180px]">
          <label htmlFor="type-filter" className="sr-only">
            Filtrar por tipo
          </label>
          <Select value={filters.tipo} onValueChange={value => setFilter('tipo', value)}>
            <SelectTrigger
              id="type-filter"
              className="rounded-xl border-gray-200 focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20"
            >
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[200px]">
          <label htmlFor="owner-filter" className="sr-only">
            Filtrar por responsável
          </label>
          <Select value={filters.ownerId} onValueChange={value => setFilter('ownerId', value)}>
            <SelectTrigger
              id="owner-filter"
              className="rounded-xl border-gray-200 focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20"
            >
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              {OWNER_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[200px]">
          <label htmlFor="team-filter" className="sr-only">
            Filtrar por equipe
          </label>
          <Select value={filters.teamId} onValueChange={value => setFilter('teamId', value)}>
            <SelectTrigger
              id="team-filter"
              className="rounded-xl border-gray-200 focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20"
            >
              <SelectValue placeholder="Equipe" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[200px]">
          <label htmlFor="store-filter" className="sr-only">
            Filtrar por loja
          </label>
          <Select value={filters.storeId} onValueChange={value => setFilter('storeId', value)}>
            <SelectTrigger
              id="store-filter"
              className="rounded-xl border-gray-200 focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20"
            >
              <SelectValue placeholder="Loja" />
            </SelectTrigger>
            <SelectContent>
              {STORE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div className="min-w-[200px]">
          <label htmlFor="period-filter" className="sr-only">
            Selecionar período
          </label>
          <Select
            value={filters.periodPreset}
            onValueChange={value => setFilter('periodPreset', value)}
          >
            <SelectTrigger
              id="period-filter"
              className="rounded-xl border-gray-200 focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20"
            >
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filters.periodPreset === 'custom' && (
          <>
            <DatePickerInput
              value={filters.customPeriod.start}
              onChange={date => handleCustomPeriodChange('start', date)}
              placeholder="Início"
              className="w-40 rounded-xl border-gray-200 focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20"
            />
            <DatePickerInput
              value={filters.customPeriod.end}
              onChange={date => handleCustomPeriodChange('end', date)}
              placeholder="Fim"
              className="w-40 rounded-xl border-gray-200 focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20"
            />
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onApply}
          aria-label="Aplicar filtros"
          className="rounded-xl bg-orange-600 text-white hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
        >
          Aplicar filtros
        </Button>
        <Button
          variant="ghost"
          onClick={onClear}
          className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
          aria-label="Limpar filtros"
        >
          Limpar
        </Button>
        <Button
          variant="ghost"
          onClick={onRefresh}
          className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
          aria-label="Atualizar dados"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(({ key, label }) => (
            <span
              key={key}
              className="flex items-center gap-1 rounded-full bg-orange-50 text-orange-700 px-3 h-7 text-xs"
            >
              {label}
              <button
                onClick={() => removeFilter(key)}
                className="ml-1 p-0.5 hover:text-orange-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded"
                aria-label={`Remover filtro ${key}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

