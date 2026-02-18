import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout'
import PageContainer from '@/components/ui/page-container'
import { ExportModalProvider, ExportModalTrigger } from './components/ExportModal'
import FilterBar from './components/FilterBar'
import ReportTable, { Column } from './components/ReportTable'
import EmptyState from './components/EmptyState'
import LoadingState from './components/LoadingState'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ReportFilters } from '@/components/reports/ReportsFilters'
import PropertyReportDrawer from './components/PropertyReportDrawer'
import PropertiesAggregatesSummary from './components/PropertiesAggregatesSummary'
import ColumnConfigurator from './components/ColumnConfigurator'
import { ColumnPreferences, createDefaultColumnPreferences, normalizeColumnPreferences, columnPreferencesEqual } from './components/columnPreferences'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  listRelatorioLeads,
  listRelatorioImoveis,
  listRelatorioCorretores,
  listRelatorioAgenda,
  listRelatorioServicos,
  listRelatorioDistribuicao,
  listRelatorioApi,
} from '@/services/reportsService'
import reportsPropertiesService from '@/services/reportsPropertiesService'
import type { BaseFilters, Pagination, SortDirection, SortState } from '@/types/reports'
import type { PropertiesAggregates } from '@/types/reports-properties'

interface ListResult<T> {
  rows: T[]
  pagination: Pagination
}

interface ReportTab {
  value: string
  label: string
  columns: Column[]
  fetch: (
    filters: BaseFilters & Record<string, any>,
    page: number,
    pageSize: number,
    sort?: SortState | null,
  ) => Promise<ListResult<any>>
  extraFilters?: (
    filters: ReportFilters,
    setFilters: (f: ReportFilters) => void,
  ) => JSX.Element
  filterFn?: (rows: any[], filters: ReportFilters) => any[]
  badge?: string | number
}

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function formatDateTime(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return dateTimeFormatter.format(date)
}

const TABS: ReportTab[] = [
  {
    value: 'leads',
    label: 'Leads',
    columns: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'nome', label: 'Nome', sortable: true },
      { key: 'telefone', label: 'Telefone', sortable: true },
      { key: 'email', label: 'E-mail', sortable: true },
      { key: 'origem', label: 'Origem', sortable: true },
      { key: 'origemDetalhada', label: 'Origem detalhada', sortable: true },
      {
        key: 'utmResumo',
        label: 'UTM',
        sortable: true,
        sortKey: 'utmCampaign',
        render: row => (
          <div className="flex flex-col text-xs text-gray-600">
            <span className="text-sm text-gray-900">{row.utmCampaign ?? '-'}</span>
            <span>{row.utmSource ? `Fonte: ${row.utmSource}` : '-'}</span>
            <span>{row.utmMedium ? `Meio: ${row.utmMedium}` : '-'}</span>
          </div>
        ),
      },
      { key: 'responsavel', label: 'Responsável', sortable: true },
      { key: 'equipe', label: 'Equipe', sortable: true },
      { key: 'loja', label: 'Loja', sortable: true },
      {
        key: 'statusEtapa',
        label: 'Status/etapa',
        sortable: true,
        sortKey: 'status',
        render: row => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{row.status ?? '-'}</span>
            <span className="text-xs text-gray-600">{row.etapa ?? '-'}</span>
          </div>
        ),
      },
      {
        key: 'criadoEm',
        label: 'Criado em',
        sortable: true,
        render: row => formatDateTime(row.criadoEm),
      },
      {
        key: 'atualizadoEm',
        label: 'Atualizado em',
        sortable: true,
        render: row => formatDateTime(row.atualizadoEm),
      },
      {
        key: 'ultimoContatoEm',
        label: 'Último contato',
        sortable: true,
        render: row => formatDateTime(row.ultimoContatoEm),
      },
      {
        key: 'proximaAcaoEm',
        label: 'Próxima ação',
        sortable: true,
        render: row => formatDateTime(row.proximaAcaoEm),
      },
      {
        key: 'slaHorasRestantes',
        label: 'SLA',
        sortable: true,
        render: row => {
          if (row.slaHorasRestantes === null || row.slaHorasRestantes === undefined) {
            return '-'
          }

          const horas = Math.floor(row.slaHorasRestantes)
          const minutos = Math.round((row.slaHorasRestantes - horas) * 60)
          const partes: string[] = []
          if (horas > 0) partes.push(`${horas}h`)
          if (minutos > 0) partes.push(`${minutos}min`)
          if (partes.length === 0) partes.push('0h')

          return (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{partes.join(' ')}</span>
              <span className="text-xs text-gray-600">{row.slaStatus ?? 'Sem status'}</span>
            </div>
          )
        },
      },
      {
        key: 'score',
        label: 'Score',
        sortable: true,
        render: row => (row.score ?? '-'),
      },
      {
        key: 'valorPotencial',
        label: 'Valor potencial',
        sortable: true,
        render: row =>
          row.valorPotencial !== undefined && row.valorPotencial !== null
            ? currencyFormatter.format(row.valorPotencial)
            : '-',
      },
      {
        key: 'tags',
        label: 'Tags',
        render: row =>
          row.tags && row.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="border-gray-300 text-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            '-'
          ),
      },
      {
        key: 'observacoes',
        label: 'Observações',
        render: row => row.observacoes ?? '-',
      },
      {
        key: 'camposCustomizados',
        label: 'Campos customizados',
        render: row => {
          const entries = Object.entries(row.camposCustomizados ?? {})
          if (entries.length === 0) return '-'
          return (
            <div className="space-y-1 text-xs text-gray-600">
              {entries.map(([field, value]) => (
                <div key={field}>
                  <span className="font-medium text-gray-700">{field}:</span> {String(value)}
                </div>
              ))}
            </div>
          )
        },
      },
    ],
    fetch: listRelatorioLeads,
    extraFilters: (filters, setFilters) => (
      <Select
        value={filters.origem || ''}
        onValueChange={v => setFilters({ ...filters, origem: v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Origem" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="Facebook">Facebook</SelectItem>
          <SelectItem value="Google">Google</SelectItem>
          <SelectItem value="Site">Site</SelectItem>
          <SelectItem value="Indicação">Indicação</SelectItem>
        </SelectContent>
      </Select>
    ),
    filterFn: (rows, filters) =>
      filters.origem && filters.origem !== 'todas' ? rows.filter(r => r.origem === filters.origem) : rows,
  },
  {
    value: 'imoveis',
    label: 'Imóveis',
    columns: [
      { key: 'codigo', label: 'Código', sortable: true },
      { key: 'titulo', label: 'Título', sortable: true },
      { key: 'tipo', label: 'Tipo', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'responsavel', label: 'Responsável', sortable: true },
      { key: 'interessados', label: 'Interessados', sortable: true },
      { key: 'visitas', label: 'Visitas', sortable: true },
      { key: 'propostas', label: 'Propostas', sortable: true },
      { key: 'negocios', label: 'Negócios', sortable: true },
      {
        key: 'atualizadoEm',
        label: 'Atualizado em',
        sortable: true,
        render: row => formatDateTime(row.atualizadoEm ?? row.updatedAt),
      },
    ],
    fetch: listRelatorioImoveis,
    extraFilters: (filters, setFilters) => (
      <Select
        value={filters.status || ''}
        onValueChange={v => setFilters({ ...filters, status: v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="inativo">Inativo</SelectItem>
        </SelectContent>
      </Select>
    ),
    filterFn: (rows, filters) =>
      filters.status && filters.status !== 'todos' ? rows.filter(r => r.status === filters.status) : rows,
  },
  {
    value: 'corretores',
    label: 'Corretores',
    columns: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'nome', label: 'Nome', sortable: true },
      { key: 'email', label: 'E-mail', sortable: true },
      { key: 'telefone', label: 'Telefone', sortable: true },
    ],
    fetch: listRelatorioCorretores,
    extraFilters: (filters, setFilters) => (
      <Select
        value={filters.telefone || ''}
        onValueChange={v => setFilters({ ...filters, telefone: v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Telefone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="com">Com telefone</SelectItem>
          <SelectItem value="sem">Sem telefone</SelectItem>
        </SelectContent>
      </Select>
    ),
    filterFn: (rows, filters) => {
      if (filters.telefone === 'com') return rows.filter(r => r.telefone)
      if (filters.telefone === 'sem') return rows.filter(r => !r.telefone)
      return rows
    },
  },
  {
    value: 'agenda',
    label: 'Agenda',
    columns: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'data', label: 'Data', sortable: true },
      { key: 'cliente', label: 'Cliente', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
    ],
    fetch: listRelatorioAgenda,
    extraFilters: (filters, setFilters) => (
      <Select
        value={filters.status || ''}
        onValueChange={v => setFilters({ ...filters, status: v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="confirmado">Confirmado</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>
    ),
    filterFn: (rows, filters) =>
      filters.status && filters.status !== 'todos' ? rows.filter(r => r.status === filters.status) : rows,
  },
  {
    value: 'servicos',
    label: 'Serviços',
    columns: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'nome', label: 'Nome', sortable: true },
      { key: 'valor', label: 'Valor', sortable: true },
      {
        key: 'ativo',
        label: 'Ativo',
        sortable: true,
        render: (row: any) => (row.ativo ? 'Sim' : 'Não'),
      },
    ],
    fetch: listRelatorioServicos,
    extraFilters: (filters, setFilters) => (
      <Select
        value={filters.ativo || ''}
        onValueChange={v => setFilters({ ...filters, ativo: v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Ativo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="sim">Sim</SelectItem>
          <SelectItem value="nao">Não</SelectItem>
        </SelectContent>
      </Select>
    ),
    filterFn: (rows, filters) => {
      if (filters.ativo === 'sim') return rows.filter(r => r.ativo)
      if (filters.ativo === 'nao') return rows.filter(r => !r.ativo)
      return rows
    },
  },
  {
    value: 'distribuicao',
    label: 'Distribuição',
    columns: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'leadId', label: 'Lead', sortable: true },
      { key: 'corretorId', label: 'Corretor', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'data', label: 'Data', sortable: true },
    ],
    fetch: listRelatorioDistribuicao,
    extraFilters: (filters, setFilters) => (
      <Select
        value={filters.status || ''}
        onValueChange={v => setFilters({ ...filters, status: v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="novo">Novo</SelectItem>
          <SelectItem value="contatado">Contatado</SelectItem>
          <SelectItem value="em andamento">Em andamento</SelectItem>
          <SelectItem value="finalizado">Finalizado</SelectItem>
          <SelectItem value="perdido">Perdido</SelectItem>
        </SelectContent>
      </Select>
    ),
    filterFn: (rows, filters) =>
      filters.status && filters.status !== 'todos' ? rows.filter(r => r.status === filters.status) : rows,
  },
  {
    value: 'api',
    label: 'API',
    columns: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'endpoint', label: 'Endpoint', sortable: true },
      { key: 'total', label: 'Total', sortable: true },
      { key: 'sucesso', label: 'Sucesso', sortable: true },
      { key: 'falha', label: 'Falha', sortable: true },
    ],
    fetch: listRelatorioApi,
    extraFilters: (filters, setFilters) => (
      <Select
        value={filters.endpoint || ''}
        onValueChange={v => setFilters({ ...filters, endpoint: v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Endpoint" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="/leads">/leads</SelectItem>
          <SelectItem value="/imoveis">/imoveis</SelectItem>
          <SelectItem value="/corretores">/corretores</SelectItem>
          <SelectItem value="/agenda">/agenda</SelectItem>
          <SelectItem value="/servicos">/servicos</SelectItem>
        </SelectContent>
      </Select>
    ),
    filterFn: (rows, filters) =>
      filters.endpoint && filters.endpoint !== 'todos' ? rows.filter(r => r.endpoint === filters.endpoint) : rows,
  },
]

const DEFAULT_PERIOD_PRESET: ReportFilters['periodPreset'] = 'last30'

function createDefaultFilters(): ReportFilters {
  return {
    search: '',
    startDate: null,
    endDate: null,
    filial: 'todas',
    usuario: 'todos',
    status: 'todos',
    origem: 'todas',
    codigo: '',
    titulo: '',
    utm: '',
    tipo: 'todos',
    teamId: 'todas',
    storeId: 'todas',
    ownerId: 'todos',
    periodPreset: DEFAULT_PERIOD_PRESET,
    customPeriod: { start: null, end: null },
  }
}

function startOfDay(date: Date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function endOfDay(date: Date) {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

function resolveDateRange(filters: ReportFilters) {
  const today = new Date()
  const end = endOfDay(today)

  switch (filters.periodPreset) {
    case 'last7':
    case 'last15':
    case 'last30':
    case 'last90': {
      const daysMap: Record<ReportFilters['periodPreset'], number> = {
        last7: 7,
        last15: 15,
        last30: 30,
        last90: 90,
        currentMonth: 30,
        custom: 0,
      }
      const days = daysMap[filters.periodPreset] ?? 30
      const start = startOfDay(new Date(end))
      start.setDate(end.getDate() - (days - 1))
      return { from: start, to: end }
    }
    case 'currentMonth': {
      const start = startOfDay(new Date(end.getFullYear(), end.getMonth(), 1))
      return { from: start, to: end }
    }
    case 'custom': {
      const { start, end: customEnd } = filters.customPeriod
      if (start && customEnd) {
        return { from: startOfDay(start), to: endOfDay(customEnd) }
      }
      return null
    }
    default:
      return null
  }
}

function buildServiceFilters(filters: ReportFilters): BaseFilters & Record<string, any> {
  const searchTerm = filters.search.trim()
  const result: BaseFilters & Record<string, any> = {
    search: searchTerm,
    periodPreset: filters.periodPreset,
  }

  if (searchTerm) {
    result.codigo = searchTerm
    result.titulo = searchTerm
    result.utm = searchTerm
  }

  if (filters.status && filters.status !== 'todos') {
    result.status = filters.status
  }

  if (filters.tipo && filters.tipo !== 'todos') {
    result.tipo = filters.tipo
  }

  if (filters.teamId && filters.teamId !== 'todas') {
    result.teamId = filters.teamId
  }

  if (filters.storeId && filters.storeId !== 'todas') {
    result.storeId = filters.storeId
  }

  if (filters.ownerId && filters.ownerId !== 'todos') {
    result.ownerId = filters.ownerId
  }

  if (filters.origem && filters.origem !== 'todas') {
    result.origem = filters.origem
  }

  if (filters.filial && filters.filial !== 'todas') {
    result.filial = filters.filial
  }

  if (filters.usuario && filters.usuario !== 'todos') {
    result.usuario = filters.usuario
  }

  const range = resolveDateRange(filters)
  if (range) {
    result.dateRange = {
      from: range.from.toISOString(),
      to: range.to.toISOString(),
    }
  }

  return result
}

export default function ReportsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [navTab, setNavTab] = useState('home')
  const [activeTab, setActiveTab] = useState(TABS[0].value)
  const [filters, setFilters] = useState<ReportFilters>(() => loadFilters(TABS[0].value))
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(() => loadFilters(TABS[0].value))
  const [lastServiceFilters, setLastServiceFilters] = useState<BaseFilters & Record<string, any>>(() =>
    buildServiceFilters(loadFilters(TABS[0].value)),
  )
  const [data, setData] = useState<any[]>([])
  const [exportData, setExportData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [propertySort, setPropertySort] = useState<SortState | null>(null)
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(() => {
    const param = searchParams.get('imovelId')
    if (!param) return null
    const parsed = Number(param)
    return Number.isNaN(parsed) ? null : parsed
  })
  const [propertiesAggregates, setPropertiesAggregates] = useState<PropertiesAggregates | null>(null)
  const [aggregatesLoading, setAggregatesLoading] = useState(true)
  const [aggregatesError, setAggregatesError] = useState<string | null>(null)
  const [columnPreferences, setColumnPreferences] = useState<Record<string, ColumnPreferences>>(() => {
    const defaults = TABS.reduce<Record<string, ColumnPreferences>>((acc, tab) => {
      acc[tab.value] = createDefaultColumnPreferences(tab.columns)
      return acc
    }, {})

    if (typeof window === 'undefined') {
      return defaults
    }

    const stored = localStorage.getItem('reportsColumnPreferences')
    if (!stored) {
      return defaults
    }

    try {
      const parsed = JSON.parse(stored) as Record<string, ColumnPreferences>
      const result = { ...defaults }
      for (const tab of TABS) {
        if (parsed[tab.value]) {
          result[tab.value] = normalizeColumnPreferences(parsed[tab.value], tab.columns)
        }
      }
      return result
    } catch (error) {
      console.error('Failed to load column preferences', error)
      return defaults
    }
  })
  const [columnConfiguratorOpen, setColumnConfiguratorOpen] = useState(false)

  function loadFilters(tab: string): ReportFilters {
    const stored = localStorage.getItem(`reportsFilters-${tab}`)
    const base = createDefaultFilters()
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...base,
        ...parsed,
        startDate: null,
        endDate: null,
        customPeriod: {
          start: parsed.customPeriod?.start ? new Date(parsed.customPeriod.start) : null,
          end: parsed.customPeriod?.end ? new Date(parsed.customPeriod.end) : null,
        },
      }
    }
    return base
  }

  function saveFilters(tab: string, value: ReportFilters) {
    const toStore = {
      ...value,
      startDate: null,
      endDate: null,
      customPeriod: {
        start: value.customPeriod.start ? value.customPeriod.start.toISOString() : null,
        end: value.customPeriod.end ? value.customPeriod.end.toISOString() : null,
      },
    }
    localStorage.setItem(`reportsFilters-${tab}`, JSON.stringify(toStore))
  }

  useEffect(() => {
    const currentTab = TABS.find(t => t.value === activeTab)
    if (!currentTab) return

    setColumnPreferences(prev => {
      const current = prev[activeTab]
      const normalized = normalizeColumnPreferences(current, currentTab.columns)
      if (!current || !columnPreferencesEqual(current, normalized)) {
        return { ...prev, [activeTab]: normalized }
      }
      return prev
    })

    const nextFilters = loadFilters(activeTab)
    setFilters(nextFilters)
    setAppliedFilters(nextFilters)
    setLastServiceFilters(buildServiceFilters(nextFilters))
    setPage(1)
  }, [activeTab])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('reportsColumnPreferences', JSON.stringify(columnPreferences))
  }, [columnPreferences])

  const fetchData = async (overrideFilters?: ReportFilters) => {
    const tab = TABS.find(t => t.value === activeTab)!
    setLoading(true)
    const currentFilters = overrideFilters ?? appliedFilters
    if (overrideFilters) {
      setAppliedFilters(overrideFilters)
    }
    const serviceFilters = buildServiceFilters(currentFilters)
    setLastServiceFilters(serviceFilters)
    const sort = activeTab === 'imoveis' ? propertySort : null
    const targetPage = overrideFilters ? 1 : page

    try {
      const result = await tab.fetch(serviceFilters, targetPage, pageSize, sort)
      const rows = tab.filterFn ? tab.filterFn(result.rows, currentFilters) : result.rows
      setData(rows)
      setExportData(rows)
      setTotal(result.pagination.total)
    } finally {
      setLoading(false)
    }
  }

  const fetchAggregates = useCallback(
    async (serviceFilters: BaseFilters & Record<string, any>) => {
      setAggregatesLoading(true)
      setAggregatesError(null)
      try {
        const result = await reportsPropertiesService.getAggregates(serviceFilters)
        setPropertiesAggregates(result)
      } catch (error) {
        console.error(error)
        setPropertiesAggregates(null)
        setAggregatesError(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os indicadores dos imóveis.',
        )
      } finally {
        setAggregatesLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchData()
  }, [activeTab, page, pageSize, propertySort])

  useEffect(() => {
    if (activeTab !== 'imoveis') return
    if (selectedPropertyId !== null) return
    if (!lastServiceFilters) return
    fetchAggregates(lastServiceFilters)
  }, [activeTab, selectedPropertyId, lastServiceFilters, fetchAggregates])

  const handleAggregatesRetry = useCallback(() => {
    if (activeTab !== 'imoveis') return
    if (selectedPropertyId !== null) return
    if (!lastServiceFilters) return
    fetchAggregates(lastServiceFilters)
  }, [activeTab, selectedPropertyId, lastServiceFilters, fetchAggregates])

  const handleApply = () => {
    saveFilters(activeTab, filters)
    setPage(1)
    fetchData(filters)
  }

  const handleClear = () => {
    const cleared = createDefaultFilters()
    setFilters(cleared)
    saveFilters(activeTab, cleared)
    setPage(1)
    fetchData(cleared)
  }

  const handleRefresh = () => {
    fetchData()
  }

  const handleSort = (column: string, direction: SortDirection) => {
    if (activeTab !== 'imoveis') return
    setPropertySort({ column, direction })
    setPage(1)
  }

  const updatePropertySelection = (
    propertyId: number | null,
    options: { syncUrl?: boolean } = {},
  ) => {
    setSelectedPropertyId(prev => {
      if (prev === propertyId) return prev
      return propertyId
    })

    if (options.syncUrl === false) {
      return
    }

    const nextParams = new URLSearchParams(location.search)
    if (propertyId) {
      nextParams.set('imovelId', String(propertyId))
    } else {
      nextParams.delete('imovelId')
    }
    setSearchParams(nextParams, { replace: true })
  }

  const handlePropertyRowClick = (row: any) => {
    if (activeTab !== 'imoveis') return
    const rawId = row?.id ?? row?.codigo
    const parsed = Number(rawId)
    if (!Number.isFinite(parsed)) return
    const nextId = selectedPropertyId === parsed ? null : parsed
    updatePropertySelection(nextId)
  }

  const handleLeadRowClick = useCallback(
    (row: any) => {
      if (activeTab !== 'leads') return
      const rawId = row?.id
      if (rawId === null || rawId === undefined) return
      const id = String(rawId).trim()
      if (!id) return
      if (typeof window === 'undefined') return
      window.open(`/lead-vendas/${encodeURIComponent(id)}`, '_blank', 'noopener')
    },
    [activeTab],
  )

  const handleClosePropertyDrawer = () => {
    updatePropertySelection(null)
  }

  const handleSelectRow = (row: any, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, row])
    } else {
      setSelectedRows(prev => prev.filter(r => r.id !== row.id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows([...data])
    } else {
      setSelectedRows([])
    }
  }

  // Clear selections when changing tabs or refreshing data
  useEffect(() => {
    setSelectedRows([])
  }, [activeTab, data])

  useEffect(() => {
    if (activeTab !== 'imoveis') return
    const params = new URLSearchParams(location.search)
    const param = params.get('imovelId')
    if (!param) {
      setSelectedPropertyId(prev => (prev === null ? prev : null))
      return
    }
    const parsed = Number(param)
    if (Number.isNaN(parsed)) {
      const nextParams = new URLSearchParams(location.search)
      nextParams.delete('imovelId')
      setSearchParams(nextParams, { replace: true })
      setSelectedPropertyId(null)
      return
    }
    setSelectedPropertyId(prev => (prev === parsed ? prev : parsed))
  }, [activeTab, location.search, setSearchParams])

  useEffect(() => {
    if (activeTab === 'imoveis') return
    if (selectedPropertyId !== null) {
      setSelectedPropertyId(null)
    }
    const params = new URLSearchParams(location.search)
    if (params.has('imovelId')) {
      params.delete('imovelId')
      setSearchParams(params, { replace: true })
    }
  }, [activeTab, selectedPropertyId, location.search, setSearchParams])

  const handleNavChange = (tab: string) => {
    setNavTab(tab)
    switch (tab) {
      case 'home':
        navigate('/')
        break
      case 'vendas':
        navigate('/vendas')
        break
      case 'servicos':
        navigate('/servicos')
        break
      case 'imoveis':
        navigate('/imoveis')
        break
      case 'agenda':
        navigate('/agenda')
        break
      default:
        break
    }
  }

  const tabConfig = TABS.find(t => t.value === activeTab)!
  const columnPreference = columnPreferences[tabConfig.value]
  const normalizedPreference = useMemo(
    () => normalizeColumnPreferences(columnPreference, tabConfig.columns),
    [columnPreference, tabConfig.columns],
  )
  const visibleColumns = useMemo(() => {
    const columnMap = new Map(tabConfig.columns.map(column => [column.key, column]))
    const hidden = new Set(normalizedPreference.hidden)
    const ordered = normalizedPreference.order
      .map(key => columnMap.get(key))
      .filter((column): column is Column => Boolean(column) && !hidden.has(column!.key))

    if (ordered.length === 0) {
      return tabConfig.columns.filter(column => !hidden.has(column.key))
    }

    const remaining = tabConfig.columns.filter(
      column => !ordered.includes(column) && !hidden.has(column.key),
    )
    return [...ordered, ...remaining]
  }, [normalizedPreference, tabConfig.columns])
  const exportColumns = visibleColumns.map(({ key, label }) => ({ key, label }))
  const exportTab = { value: tabConfig.value, label: tabConfig.label, columns: exportColumns }
  const appliedRange = resolveDateRange(appliedFilters)

  const handleSaveColumnPreferences = (prefs: ColumnPreferences) => {
    setColumnPreferences(prev => ({
      ...prev,
      [activeTab]: normalizeColumnPreferences(prefs, tabConfig.columns),
    }))
    setColumnConfiguratorOpen(false)
  }
  return (
    <ExportModalProvider
      dataset={tabConfig.value}
      tab={exportTab}
      appliedFilters={appliedFilters}
      serviceFilters={lastServiceFilters}
      selectedRows={selectedRows}
      rows={exportData}
      columns={exportColumns}
      totalRows={total}
      dateRange={appliedRange}
    >
      <ResponsiveLayout activeTab={navTab} setActiveTab={handleNavChange}>
      <PageContainer className="bg-gray-50">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
                <p className="text-gray-600 mt-1">Visualize e exporte relatórios detalhados</p>
              </div>
              <ExportModalTrigger />
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-gray-200 px-6">
                <TabsList className="bg-transparent h-auto p-0 flex space-x-8">
                  {TABS.map(t => (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className="relative bg-transparent border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none px-1 py-4 text-gray-600 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                    >
                      {t.label}
                      {t.badge !== undefined && (
                        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {t.badge}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="p-6 space-y-6">
                {activeTab === 'imoveis' && selectedPropertyId === null && (
                  <PropertiesAggregatesSummary
                    data={propertiesAggregates}
                    loading={aggregatesLoading}
                    error={aggregatesError}
                    onRetry={handleAggregatesRetry}
                  />
                )}
                <FilterBar
                  filters={filters}
                  onChange={setFilters}
                  onApply={handleApply}
                  onClear={handleClear}
                  onRefresh={handleRefresh}
                />

                {loading ? (
                  <LoadingState />
                ) : data.length === 0 ? (
                  <EmptyState
                    title="Nenhum registro encontrado"
                    subtitle="Não há dados para os filtros selecionados."
                  />
                ) : (
                  <ReportTable
                    data={data}
                    columns={visibleColumns}
                    page={page}
                    total={total}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={size => {
                      setPageSize(size)
                      setPage(1)
                    }}
                    selectedRows={selectedRows}
                    onSelectRow={handleSelectRow}
                    onSelectAll={handleSelectAll}
                    sortState={activeTab === 'imoveis' ? propertySort : null}
                    onSort={handleSort}
                    onRowClick={
                      activeTab === 'imoveis'
                        ? handlePropertyRowClick
                        : activeTab === 'leads'
                          ? handleLeadRowClick
                          : undefined
                    }
                    activeRowId={activeTab === 'imoveis' ? selectedPropertyId : null}
                    rowClickLabel={
                      activeTab === 'imoveis'
                        ? 'Visualizar relatório do imóvel'
                        : activeTab === 'leads'
                          ? 'Abrir lead em nova aba'
                          : undefined
                    }
                    onConfigureColumns={() => setColumnConfiguratorOpen(true)}
                  />
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </PageContainer>
      <PropertyReportDrawer
        open={activeTab === 'imoveis' && selectedPropertyId !== null}
        propertyId={activeTab === 'imoveis' ? selectedPropertyId : null}
        onClose={handleClosePropertyDrawer}
      />
      <ColumnConfigurator
        open={columnConfiguratorOpen}
        onOpenChange={setColumnConfiguratorOpen}
        columns={tabConfig.columns}
        preferences={normalizedPreference}
        onSave={handleSaveColumnPreferences}
      />
    </ResponsiveLayout>
    </ExportModalProvider>
  )
}

