import { httpJSON } from '@/lib/http'
import type { BaseFilters, ImovelRow, SortState } from '@/types/reports'
import type {
  PropertyReportDetail,
  PropertiesAggregates,
  PropertiesAggregateMetric,
  PropertiesAggregateSeriesPoint,
  PropertiesAggregatesTotals,
  PropertiesAggregatesPeriod,
} from '@/types/reports-properties'

interface ReportsPropertiesListArgs {
  filters: BaseFilters & Record<string, unknown>
  page: number
  pageSize: number
  sort?: SortState | null
}

interface ReportsPropertiesApiResponse {
  items?: unknown[]
  total?: number
}

interface PropertyReportDetailApiResponse {
  detail?: PropertyReportDetail
}

interface PropertiesAggregatesApiResponse {
  summary?: Record<string, unknown>
}

interface ResponsavelInfo {
  name?: string
  id?: string
  email?: string
}

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value

  if (typeof value === 'string') {
    const normalized = Number(value)
    return Number.isNaN(normalized) ? 0 : normalized
  }

  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>
    const candidates = ['total', 'count', 'value', 'qtde', 'quantidade']
    for (const key of candidates) {
      const candidate = source[key]
      if (typeof candidate === 'number' && Number.isFinite(candidate)) {
        return candidate
      }
      if (typeof candidate === 'string') {
        const parsed = Number(candidate)
        if (!Number.isNaN(parsed)) return parsed
      }
    }
  }

  return 0
}

function normalizeDate(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString()
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value.toISOString()
  }
  return undefined
}

function extractResponsavelInfo(value: unknown): ResponsavelInfo {
  if (!value) return {}

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? { name: trimmed } : {}
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const info = extractResponsavelInfo(entry)
      if (info.name) return info
    }
    return {}
  }

  if (typeof value === 'object') {
    const source = value as Record<string, unknown>
    const nameParts: string[] = []

    const nameCandidates = [
      source.nome,
      source.name,
      source.fullName,
      source.full_name,
      source.label,
      source.displayName,
      source.display_name,
    ]

    for (const candidate of nameCandidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        nameParts.push(candidate.trim())
        break
      }
    }

    if (nameParts.length === 0) {
      const composed = [source.firstName, source.lastName]
        .filter(part => typeof part === 'string' && part.trim())
        .map(part => (part as string).trim())
      if (composed.length) {
        nameParts.push(composed.join(' '))
      }
    }

    const idCandidates = [source.id, source.user_id, source.owner_id, source.uuid, source.value]
    let id: string | undefined
    for (const candidate of idCandidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        id = candidate
        break
      }
      if (typeof candidate === 'number' && Number.isFinite(candidate)) {
        id = String(candidate)
        break
      }
    }

    const emailCandidates = [source.email, source.mail]
    let email: string | undefined
    for (const candidate of emailCandidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        email = candidate
        break
      }
    }

    return {
      name: nameParts.length ? nameParts[0] : undefined,
      id,
      email,
    }
  }

  return {}
}

function sanitizeFilters(filters: BaseFilters & Record<string, unknown>) {
  const sanitized: Record<string, unknown> = {}

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (key === 'dateRange' && value && typeof value === 'object') {
      const range = value as Record<string, unknown>
      const from = range.from
      const to = range.to
      if (typeof from === 'string' && typeof to === 'string') {
        sanitized.dateRange = { from, to }
      }
      return
    }

    sanitized[key] = value
  })

  return sanitized
}

function mapApiItemToRow(item: Record<string, unknown>): ImovelRow {
  const responsavelInfo = extractResponsavelInfo(
    item.responsavel ?? item.owner ?? item.usuario ?? item.captador ?? item.responsible,
  )

  const rawStore = item.storeId ?? item.store_id ?? item.filial ?? item.store
  const storeId =
    typeof rawStore === 'string' && rawStore.trim()
      ? rawStore.trim()
      : typeof rawStore === 'number' && Number.isFinite(rawStore)
      ? String(rawStore)
      : undefined

  const updated =
    normalizeDate(
      item.atualizadoEm ??
        item.updated_at ??
        item.updatedAt ??
        item.last_update ??
        item.lastUpdatedAt ??
        item.last_updated_at,
    ) ?? undefined

  const meta: Record<string, unknown> = {}

  const origin = item.origem ?? item.source
  if (typeof origin === 'string' && origin.trim()) {
    meta.origem = origin
  }

  if (storeId) {
    meta.filial = storeId
  }

  if (responsavelInfo.id) {
    meta.responsavelId = responsavelInfo.id
  }

  if (responsavelInfo.email) {
    meta.responsavelEmail = responsavelInfo.email
  }

  if (item.meta && typeof item.meta === 'object') {
    Object.entries(item.meta as Record<string, unknown>).forEach(([key, value]) => {
      if (!(key in meta)) meta[key] = value
    })
  }

  const codigo = item.codigo ?? item.code ?? ''
  const titulo = item.titulo ?? item.title ?? ''

  const precoValue = item.preco ?? item.valor ?? item.price
  let preco: number | undefined
  if (typeof precoValue === 'number' && Number.isFinite(precoValue)) {
    preco = precoValue
  } else if (typeof precoValue === 'string' && precoValue.trim()) {
    const parsed = Number(precoValue.replace(/[^0-9.,-]/g, '').replace(',', '.'))
    if (!Number.isNaN(parsed)) preco = parsed
  }

  return {
    id:
      typeof item.id === 'number' && Number.isFinite(item.id)
        ? item.id
        : typeof item.id === 'string' && item.id.trim()
        ? Number(item.id)
        : 0,
    codigo: typeof codigo === 'string' ? codigo : String(codigo ?? ''),
    titulo: typeof titulo === 'string' ? titulo : String(titulo ?? ''),
    tipo:
      typeof item.tipo === 'string'
        ? item.tipo
        : typeof item.type === 'string'
        ? item.type
        : undefined,
    status:
      typeof item.status === 'string'
        ? item.status
        : typeof item.situacao === 'string'
        ? item.situacao
        : typeof item.situation === 'string'
        ? item.situation
        : undefined,
    utm:
      typeof item.utm === 'string'
        ? item.utm
        : typeof item.utm_source === 'string'
        ? item.utm_source
        : typeof item.utmSource === 'string'
        ? item.utmSource
        : undefined,
    teamId:
      typeof item.teamId === 'string'
        ? item.teamId
        : typeof item.team_id === 'string'
        ? item.team_id
        : undefined,
    storeId,
    ownerId:
      typeof item.ownerId === 'string'
        ? item.ownerId
        : typeof item.owner_id === 'string'
        ? item.owner_id
        : undefined,
    responsavel: responsavelInfo.name,
    responsavelId: responsavelInfo.id,
    responsavelEmail: responsavelInfo.email,
    atualizadoEm: updated,
    updatedAt: updated,
    interessados: normalizeNumber(
      item.interessados ??
        item.leads ??
        item.leads_total ??
        item.leadsCount ??
        item.total_leads ??
        item.interessados_total,
    ),
    visitas: normalizeNumber(
      item.visitas ??
        item.visits ??
        item.visitas_total ??
        item.visitsCount ??
        item.total_visits ??
        item.visitasAgendadas,
    ),
    propostas: normalizeNumber(
      item.propostas ??
        item.proposals ??
        item.propostas_total ??
        item.proposalsCount ??
        item.total_proposals ??
        item.propostasEnviadas,
    ),
    negocios: normalizeNumber(
      item.negocios ??
        item.deals ??
        item.negocios_total ??
        item.dealsCount ??
        item.total_deals ??
        item.negociosFechados,
    ),
    cidade:
      typeof item.cidade === 'string'
        ? item.cidade
        : typeof item.city === 'string'
        ? item.city
        : undefined,
    bairro:
      typeof item.bairro === 'string'
        ? item.bairro
        : typeof item.neighborhood === 'string'
        ? item.neighborhood
        : undefined,
    preco,
    meta: Object.keys(meta).length ? meta : undefined,
  }
}

function mapMetricChange(value: unknown): PropertiesAggregateMetric['change'] | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const source = value as Record<string, unknown>
  const rawType = source.type ?? source.direction ?? source.status ?? source.trend
  let type: PropertiesAggregateMetric['change']['type'] = 'neutral'
  if (typeof rawType === 'string') {
    const normalized = rawType.toLowerCase()
    if (normalized.includes('up') || normalized.includes('increase') || normalized.includes('positivo')) {
      type = 'increase'
    } else if (normalized.includes('down') || normalized.includes('decrease') || normalized.includes('negativo')) {
      type = 'decrease'
    }
  }

  let valueNumber: number | undefined
  if ('value' in source) {
    const candidate = source.value
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      valueNumber = candidate
    } else if (typeof candidate === 'string' && candidate.trim()) {
      const parsed = Number(candidate.replace(/[^0-9.,-]/g, '').replace(',', '.'))
      if (!Number.isNaN(parsed)) valueNumber = parsed
    }
  }

  if (!rawType && valueNumber !== undefined) {
    if (valueNumber > 0) type = 'increase'
    else if (valueNumber < 0) type = 'decrease'
  }

  const labelCandidate = source.label ?? source.text ?? source.helper
  const label = typeof labelCandidate === 'string' ? labelCandidate : undefined

  return {
    type,
    value: valueNumber,
    label,
  }
}

function mapMetricFormat(value: unknown): PropertiesAggregateMetric['format'] | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.toLowerCase()
  if (normalized.includes('currency') || normalized.includes('money') || normalized.includes('valor')) {
    return 'currency'
  }
  if (normalized.includes('percent')) {
    return 'percentage'
  }
  return 'number'
}

function mapApiMetric(item: Record<string, unknown>): PropertiesAggregateMetric | null {
  const rawId =
    item.id ??
    item.key ??
    item.metric ??
    (typeof item.label === 'string' ? item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined)
  const id = typeof rawId === 'string' && rawId.trim() ? rawId.trim() : undefined

  const labelCandidate = item.label ?? item.title ?? item.name
  const label = typeof labelCandidate === 'string' && labelCandidate.trim() ? labelCandidate.trim() : id

  if (!id && !label) {
    return null
  }

  const helperCandidate = item.helperText ?? item.description ?? item.helper
  const helperText = typeof helperCandidate === 'string' ? helperCandidate : undefined

  const format = mapMetricFormat(item.format)

  const changeSource = item.change ?? item.delta ?? item.trend ?? item.variation
  const change = mapMetricChange(changeSource)

  const metricValue =
    item.value ??
    item.total ??
    item.amount ??
    item.count ??
    (item as Record<string, unknown>).valor ??
    (item as Record<string, unknown>).quantidade

  return {
    id: id ?? String(Math.random()).slice(2),
    label: label ?? 'Indicador',
    value: normalizeNumber(metricValue),
    helperText,
    format,
    change,
  }
}

function mapSeriesPoint(item: Record<string, unknown>): PropertiesAggregateSeriesPoint | null {
  const dateCandidate = item.date ?? item.day ?? item.period ?? item.label ?? item.reference
  const date = normalizeDate(dateCandidate)
  if (!date) return null

  const visits = normalizeNumber(
    item.visits ?? item.visitas ?? item.total_visits ?? item.totalVisits ?? item.visits_count,
  )
  const proposals = normalizeNumber(
    item.proposals ?? item.propostas ?? item.total_proposals ?? item.totalProposals ?? item.proposals_count,
  )

  return {
    date,
    visits,
    proposals,
  }
}

const EMPTY_AGGREGATES: PropertiesAggregates = {
  totals: {
    properties: 0,
    active: 0,
    published: 0,
    interested: 0,
    visits: 0,
    proposals: 0,
    deals: 0,
    dealsVolume: 0,
  },
  metrics: [],
  series: [],
}

function mapAggregatesSummary(summary?: Record<string, unknown>): PropertiesAggregates {
  if (!summary) {
    return EMPTY_AGGREGATES
  }

  const totalsSource =
    (summary.totals as Record<string, unknown> | undefined) ??
    (summary.total as Record<string, unknown> | undefined) ??
    {}

  const totals: PropertiesAggregatesTotals = {
    properties: normalizeNumber(
      totalsSource.properties ??
        totalsSource.total ??
        summary.totalProperties ??
        summary.properties ??
        summary.total,
    ),
    active: normalizeNumber(
      totalsSource.active ?? totalsSource.actives ?? totalsSource.ativos ?? totalsSource.activeProperties,
    ),
    published: normalizeNumber(
      totalsSource.published ?? totalsSource.publicados ?? totalsSource.publicadosSite ?? totalsSource.site,
    ),
    interested: normalizeNumber(
      totalsSource.interested ?? totalsSource.interessados ?? totalsSource.leads ?? totalsSource.leadsCount,
    ),
    visits: normalizeNumber(
      totalsSource.visits ?? totalsSource.visitas ?? totalsSource.totalVisits ?? totalsSource.visitsCount,
    ),
    proposals: normalizeNumber(
      totalsSource.proposals ?? totalsSource.propostas ?? totalsSource.totalProposals ?? totalsSource.proposalsCount,
    ),
    deals: normalizeNumber(
      totalsSource.deals ?? totalsSource.negocios ?? totalsSource.sales ?? totalsSource.dealsCount,
    ),
    dealsVolume: normalizeNumber(
      totalsSource.dealsVolume ?? totalsSource.volume ?? totalsSource.volumeNegocios ?? totalsSource.totalVolume,
    ),
  }

  const metricsSource = Array.isArray(summary.metrics) ? summary.metrics : []
  let metrics = metricsSource
    .map(item => (item && typeof item === 'object' ? mapApiMetric(item as Record<string, unknown>) : null))
    .filter((metric): metric is PropertiesAggregateMetric => Boolean(metric))

  if (!metrics.length) {
    metrics = [
      { id: 'active', label: 'Imóveis ativos', value: totals.active, format: 'number' },
      { id: 'published', label: 'Imóveis publicados', value: totals.published, format: 'number' },
      { id: 'interested', label: 'Interessados', value: totals.interested, format: 'number' },
      { id: 'visits', label: 'Visitas', value: totals.visits, format: 'number' },
      { id: 'proposals', label: 'Propostas', value: totals.proposals, format: 'number' },
      {
        id: 'deals',
        label: 'Negócios',
        value: totals.deals,
        format: 'number',
        helperText: totals.dealsVolume ? 'Volume negociado' : undefined,
      },
    ]
  }

  const seriesSource = Array.isArray(summary.series) ? summary.series : []
  const series = seriesSource
    .map(item => (item && typeof item === 'object' ? mapSeriesPoint(item as Record<string, unknown>) : null))
    .filter((point): point is PropertiesAggregateSeriesPoint => Boolean(point))

  const periodSource = summary.period ?? summary.dateRange ?? summary.range
  let period: PropertiesAggregatesPeriod | undefined
  if (periodSource && typeof periodSource === 'object') {
    const source = periodSource as Record<string, unknown>
    const from = normalizeDate(source.from ?? source.start)
    const to = normalizeDate(source.to ?? source.end)
    const label = typeof source.label === 'string' ? source.label : undefined
    period = { from, to, label }
  }

  const message = typeof summary.message === 'string' ? summary.message : undefined

  return {
    period,
    totals,
    metrics,
    series,
    message,
  }
}

async function list({ filters, page, pageSize, sort }: ReportsPropertiesListArgs) {
  const payload: Record<string, unknown> = {
    filters: sanitizeFilters(filters),
    page,
    pageSize,
  }

  if (sort?.column) {
    payload.sort = {
      field: sort.column,
      direction: sort.direction,
    }
  }

  const response = await httpJSON<ReportsPropertiesApiResponse>(
    '/api/reports/properties',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  const items = response?.items ?? []
  const total = response?.total ?? items.length

  return {
    rows: items.map(item => mapApiItemToRow(item as Record<string, unknown>)),
    total,
  }
}

async function getDetail(propertyId: number) {
  if (!propertyId) {
    throw new Error('É necessário informar o identificador do imóvel para carregar o relatório.')
  }

  const response = await httpJSON<PropertyReportDetailApiResponse>(
    `/api/reports/properties/${propertyId}/detail`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response?.detail) {
    throw new Error('Não foi possível carregar os dados do relatório do imóvel.')
  }

  return response.detail
}

async function getAggregates(filters: BaseFilters & Record<string, unknown>) {
  const payload = {
    filters: sanitizeFilters(filters),
  }

  const response = await httpJSON<PropertiesAggregatesApiResponse>(
    '/api/reports/properties/aggregates',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  return mapAggregatesSummary(response?.summary as Record<string, unknown> | undefined)
}

const reportsPropertiesService = {
  list,
  getDetail,
  getAggregates,
}

export type ReportsPropertiesService = typeof reportsPropertiesService

export default reportsPropertiesService
