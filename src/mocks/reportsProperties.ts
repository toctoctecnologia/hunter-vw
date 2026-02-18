import type { PropertyReportDetail } from '@/types/reports-properties'
import type { ImovelRow } from '@/types/reports'
import { MOCK_PROPERTIES } from './properties'

interface ReportsPropertiesListPayload {
  filters?: Record<string, unknown>
  page?: number
  pageSize?: number
  sort?: {
    field?: string
    direction?: 'asc' | 'desc'
  }
}

function parseNumberFromString(value?: string): number | undefined {
  if (!value) return undefined
  const normalized = value.replace(/[^0-9.,-]/g, '').replace('.', '').replace(',', '.')
  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? undefined : parsed
}

function makeRecentDate(value?: string, fallbackDaysAgo = 5) {
  const today = new Date()
  const parsed = value ? new Date(value) : null

  if (parsed && !Number.isNaN(parsed.getTime())) {
    const diffDays = Math.abs(today.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays <= 120) {
      return parsed.toISOString()
    }
  }

  const recent = new Date(today)
  recent.setDate(today.getDate() - fallbackDaysAgo)
  return recent.toISOString()
}

function toImovelRow(property: (typeof MOCK_PROPERTIES)[number]): ImovelRow {
  const interessados = property.tags?.length ? property.tags.length * 3 : 8
  const visitas = Math.max(4, Math.floor(interessados / 2))
  const proposals = Math.max(1, Math.floor(visitas / 3))
  const deals = Math.max(0, proposals - 1)
  const updatedAt = makeRecentDate(property.ultimoContatoEm, (property.id % 10) + 2)
  return {
    id: property.id,
    codigo: property.code,
    titulo: property.title,
    tipo: property.type,
    status: property.disponibilidade,
    responsavel: property.captador?.nome,
    responsavelId: property.captador?.id,
    responsavelEmail: property.captador?.email,
    atualizadoEm: updatedAt,
    interessados,
    visitas,
    propostas: proposals,
    negocios: deals,
    cidade: property.city,
    bairro: property.address,
    preco: parseNumberFromString(property.price),
    meta: {
      origem: 'Site',
      filial: property.condominio ?? 'Matriz',
    },
  }
}

function parseDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return null
}

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : ''
}

function statusMatches(rowStatus: string | undefined, filterStatus: string) {
  if (!rowStatus) return false
  const normalizedRow = normalizeString(rowStatus)
  switch (filterStatus) {
    case 'ativo':
      return normalizedRow.includes('dispon') || normalizedRow.includes('ativo')
    case 'inativo':
      return normalizedRow.includes('indispon') || normalizedRow.includes('inativo') || normalizedRow.includes('reserv')
    case 'vendido':
      return normalizedRow.includes('vend')
    default:
      return normalizedRow === filterStatus
  }
}

function isActiveStatus(status?: string) {
  if (!status) return false
  const normalized = normalizeString(status)
  if (!normalized) return false
  if (normalized.includes('vend')) return false
  if (normalized.includes('indispon')) return false
  if (normalized.includes('inativo')) return false
  return true
}

function isPublishedStatus(status?: string) {
  if (!status) return false
  const normalized = normalizeString(status)
  if (normalized.includes('interno')) return false
  return normalized.includes('dispon') || normalized.includes('publicado')
}

function applyReportFilters(rows: ImovelRow[], filters: Record<string, unknown>) {
  let result = [...rows]

  const searchCandidates = [filters.search, filters.codigo, filters.titulo, filters.utm]
  const searchTerm = searchCandidates
    .map(candidate => (typeof candidate === 'string' ? candidate.trim().toLowerCase() : ''))
    .find(candidate => candidate.length > 0)

  if (searchTerm) {
    const normalizedSearch = normalizeString(searchTerm)
    result = result.filter(row =>
      [row.codigo, row.titulo, row.responsavel, row.cidade, row.bairro]
        .filter(value => value !== undefined && value !== null)
        .some(value => normalizeString(value).includes(normalizedSearch)),
    )
  }

  if (filters.status && typeof filters.status === 'string' && filters.status !== 'todos') {
    const normalizedStatus = normalizeString(filters.status)
    result = result.filter(row => statusMatches(row.status, normalizedStatus))
  }

  if (filters.tipo && typeof filters.tipo === 'string' && filters.tipo !== 'todos') {
    const normalizedTipo = normalizeString(filters.tipo)
    result = result.filter(row => normalizeString(row.tipo).includes(normalizedTipo))
  }

  if (filters.ownerId && typeof filters.ownerId === 'string' && filters.ownerId !== 'todos') {
    result = result.filter(row => row.ownerId === filters.ownerId)
  }

  if (filters.teamId && typeof filters.teamId === 'string' && filters.teamId !== 'todas') {
    result = result.filter(row => row.teamId === filters.teamId)
  }

  if (filters.storeId && typeof filters.storeId === 'string' && filters.storeId !== 'todas') {
    result = result.filter(row => row.storeId === filters.storeId)
  }

  if (filters.dateRange && typeof filters.dateRange === 'object') {
    const range = filters.dateRange as Record<string, unknown>
    const from = parseDate(range.from ?? range.start)
    const to = parseDate(range.to ?? range.end)
    if (from || to) {
      result = result.filter(row => {
        const updatedAt = row.atualizadoEm ?? row.updatedAt
        if (!updatedAt) return true
        const parsed = parseDate(updatedAt)
        if (!parsed) return false
        if (from && parsed < from) return false
        if (to && parsed > to) return false
        return true
      })
    }
  }

  return result
}

function buildSeries(rows: ImovelRow[]) {
  const accumulator = new Map<string, { visits: number; proposals: number }>()

  rows.forEach(row => {
    const updated = parseDate(row.atualizadoEm ?? row.updatedAt)
    if (!updated) return
    const key = updated.toISOString().slice(0, 10)
    const entry = accumulator.get(key) ?? { visits: 0, proposals: 0 }
    entry.visits += row.visitas ?? 0
    entry.proposals += row.propostas ?? 0
    accumulator.set(key, entry)
  })

  return Array.from(accumulator.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, values]) => ({
      date,
      visits: values.visits,
      proposals: values.proposals,
    }))
}

const PERIOD_LABELS: Record<string, string> = {
  last7: 'Últimos 7 dias',
  last15: 'Últimos 15 dias',
  last30: 'Últimos 30 dias',
  last90: 'Últimos 90 dias',
  currentmonth: 'Mês atual',
}

function buildPeriod(filters: Record<string, unknown>) {
  const periodPreset = typeof filters.periodPreset === 'string' ? filters.periodPreset : undefined
  const label = periodPreset ? PERIOD_LABELS[normalizeString(periodPreset)] : undefined

  if (filters.dateRange && typeof filters.dateRange === 'object') {
    const range = filters.dateRange as Record<string, unknown>
    const from = parseDate(range.from ?? range.start)
    const to = parseDate(range.to ?? range.end)
    return {
      from: from ? from.toISOString() : undefined,
      to: to ? to.toISOString() : undefined,
      label,
    }
  }

  if (label) {
    return { label }
  }

  return undefined
}

const PROPERTY_REPORTS: Record<number, PropertyReportDetail> = {
  1742: {
    property: {
      id: 1742,
      code: 'COD:1742',
      title: 'Casa Luxo com Piscina',
      type: 'Casa',
      status: 'Disponível',
      price: 2850000,
      address: 'Avenida Atlântica 2500',
      city: 'Balneário Camboriú',
      neighborhood: 'Centro',
      responsible: {
        id: 'current-user',
        name: 'João Captador',
        email: 'joao.captador@example.com',
        phone: '(47) 98888-0002',
      },
      owner: {
        name: 'Carlos Proprietário',
        phone: '(47) 97777-0003',
      },
      store: 'Balneário Camboriú',
      createdAt: '2023-11-01T10:30:00Z',
      updatedAt: '2024-05-18T14:05:00Z',
      leadId: 'L-1012',
      leadName: 'Carlos Proprietário',
      imageUrl: '/uploads/f50b6900-0b8c-4f5d-93cb-f962ee0f2be0.png',
    },
    quickActions: [
      {
        label: 'Abrir no módulo Imóveis',
        href: '/imoveis/1742',
        variant: 'outline',
      },
      {
        label: 'Abrir lead',
        href: '/leads/L-1012',
        variant: 'outline',
      },
    ],
    kpis: [
      {
        id: 'interested',
        label: 'Interessados',
        value: '18',
        helperText: 'Últimos 90 dias',
        trend: { direction: 'up', value: '12%' },
      },
      {
        id: 'visits',
        label: 'Visitas agendadas',
        value: '12',
        helperText: 'Taxa de conversão 38%',
        trend: { direction: 'up', value: '5%' },
      },
      {
        id: 'proposals',
        label: 'Propostas',
        value: '4',
        helperText: '2 no carrinho',
        trend: { direction: 'neutral', value: '0%' },
      },
      {
        id: 'deals',
        label: 'Negócios',
        value: '1',
        helperText: 'Ticket médio R$ 2,65M',
        trend: { direction: 'down', value: '3%' },
      },
    ],
    summary: [
      {
        id: 'basic-info',
        title: 'Resumo do Imóvel',
        items: [
          { label: 'Código', value: 'COD:1742' },
          { label: 'Tipo', value: 'Casa' },
          { label: 'Status', value: 'Disponível' },
          { label: 'Valor anunciado', value: 'R$ 2.850.000' },
          { label: 'Última atualização', value: '18/05/2024 11:05' },
        ],
      },
      {
        id: 'responsible',
        title: 'Responsáveis',
        items: [
          { label: 'Captador', value: 'João Captador (47) 98888-0002' },
          { label: 'Proprietário', value: 'Carlos Proprietário (47) 97777-0003' },
          { label: 'Lead relacionado', value: 'L-1012' },
        ],
      },
    ],
    timeline: [
      {
        id: 'evt-1',
        type: 'deal',
        title: 'Negócio fechado com Fernanda Lima',
        description: 'Negócio concluído por R$ 2.650.000 com comissão de 5%.',
        createdAt: '2024-05-14T18:20:00Z',
        actor: 'Mariana Captadora',
      },
      {
        id: 'evt-2',
        type: 'proposal',
        title: 'Proposta revisada',
        description: 'Contra-proposta enviada para o cliente Fernando Alves.',
        createdAt: '2024-05-09T16:10:00Z',
        actor: 'Ana Vendas',
      },
      {
        id: 'evt-3',
        type: 'visit',
        title: 'Visita realizada com Diego Souza',
        description: 'Visita presencial confirmada com feedback positivo.',
        createdAt: '2024-05-03T14:00:00Z',
        actor: 'Cláudia Corretora',
      },
      {
        id: 'evt-4',
        type: 'lead',
        title: 'Lead captado via site',
        description: 'Lead proveniente da landing page de imóveis de luxo.',
        createdAt: '2024-04-28T08:30:00Z',
      },
    ],
    interested: {
      items: [
        {
          id: 'lead-900',
          name: 'Fernanda Lima',
          email: 'fernanda.lima@email.com',
          phone: '(11) 94444-2222',
          createdAt: '2024-05-10T11:45:00Z',
          status: 'Em negociação',
          leadId: 'L-2321',
        },
        {
          id: 'lead-901',
          name: 'Diego Souza',
          email: 'diego.souza@email.com',
          phone: '(11) 93333-1111',
          createdAt: '2024-05-03T09:00:00Z',
          status: 'Visitou o imóvel',
          leadId: 'L-2325',
        },
        {
          id: 'lead-902',
          name: 'Carla Mendes',
          email: 'carla.mendes@email.com',
          phone: '(41) 92222-8888',
          createdAt: '2024-04-29T14:20:00Z',
          status: 'Carrinho',
          leadId: 'L-2340',
        },
      ],
      pagination: {
        page: 1,
        pageSize: 25,
        total: 3,
      },
    },
    visits: {
      items: [
        {
          id: 'visit-1',
          visitor: 'Diego Souza',
          broker: 'Cláudia Corretora',
          scheduledAt: '2024-05-03T14:00:00Z',
          status: 'Realizada',
          leadId: 'L-2325',
        },
        {
          id: 'visit-2',
          visitor: 'Fernanda Lima',
          broker: 'Mariana Captadora',
          scheduledAt: '2024-05-07T10:30:00Z',
          status: 'Reagendada',
          leadId: 'L-2321',
        },
      ],
      pagination: {
        page: 1,
        pageSize: 25,
        total: 2,
      },
    },
    cart: {
      items: [
        {
          id: 'cart-1',
          buyer: 'Carla Mendes',
          broker: 'Ana Vendas',
          createdAt: '2024-04-30T13:15:00Z',
          stage: 'Revisando documentação',
          leadId: 'L-2340',
        },
        {
          id: 'cart-2',
          buyer: 'Fernanda Lima',
          broker: 'Mariana Captadora',
          createdAt: '2024-05-08T09:45:00Z',
          stage: 'Aguardando assinatura',
          leadId: 'L-2321',
        },
      ],
      pagination: {
        page: 1,
        pageSize: 25,
        total: 2,
      },
    },
    proposals: {
      items: [
        {
          id: 'proposal-1',
          buyer: 'Fernanda Lima',
          broker: 'Mariana Captadora',
          amount: 2650000,
          status: 'Aceita',
          createdAt: '2024-05-09T16:00:00Z',
          leadId: 'L-2321',
        },
        {
          id: 'proposal-2',
          buyer: 'Diego Souza',
          broker: 'Cláudia Corretora',
          amount: 2570000,
          status: 'Em análise',
          createdAt: '2024-05-04T15:20:00Z',
          leadId: 'L-2325',
        },
      ],
      pagination: {
        page: 1,
        pageSize: 25,
        total: 2,
      },
    },
    deals: {
      items: [
        {
          id: 'deal-1',
          buyer: 'Fernanda Lima',
          broker: 'Mariana Captadora',
          amount: 2650000,
          status: 'Concluído',
          closedAt: '2024-05-14T18:20:00Z',
          leadId: 'L-2321',
        },
      ],
      pagination: {
        page: 1,
        pageSize: 25,
        total: 1,
      },
    },
    portals: [
      {
        portal: 'VivaReal',
        status: 'Publicado',
        lastSync: '2024-05-15T09:00:00Z',
        link: 'https://www.vivareal.com.br/imovel/1742',
      },
      {
        portal: 'Zap Imóveis',
        status: 'Pendente de atualização',
        lastSync: '2024-05-12T17:20:00Z',
        notes: 'Aguardando atualização das fotos com a equipe de marketing.',
      },
      {
        portal: 'Facebook Ads',
        status: 'Campanha ativa',
        lastSync: '2024-05-16T20:00:00Z',
      },
    ],
  },
}

export function getReportsPropertiesList({
  filters = {},
  page = 1,
  pageSize = 25,
  sort,
}: ReportsPropertiesListPayload) {
  let rows = applyReportFilters(MOCK_PROPERTIES.map(toImovelRow), filters)

  if (sort?.field) {
    const direction = sort.direction === 'desc' ? -1 : 1
    rows = [...rows].sort((a, b) => {
      const left = (a as unknown as Record<string, unknown>)[sort.field!]
      const right = (b as unknown as Record<string, unknown>)[sort.field!]

      if (left === right) return 0
      if (left === undefined || left === null) return -1 * direction
      if (right === undefined || right === null) return 1 * direction

      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * direction
      }

      const dateLeft = new Date(String(left))
      const dateRight = new Date(String(right))
      if (!Number.isNaN(dateLeft.getTime()) && !Number.isNaN(dateRight.getTime())) {
        return (dateLeft.getTime() - dateRight.getTime()) * direction
      }

      return String(left).localeCompare(String(right), 'pt-BR', { sensitivity: 'base' }) * direction
    })
  }

  const total = rows.length
  const start = (page - 1) * pageSize
  const items = rows.slice(start, start + pageSize)

  return {
    items,
    total,
  }
}

export function getReportsPropertiesAggregates({
  filters = {},
}: {
  filters?: Record<string, unknown>
}) {
  const rows = applyReportFilters(MOCK_PROPERTIES.map(toImovelRow), filters)

  const totals = rows.reduce(
    (acc, row) => {
      acc.properties += 1
      if (isActiveStatus(row.status)) acc.active += 1
      if (isPublishedStatus(row.status)) acc.published += 1
      acc.interested += row.interessados ?? 0
      acc.visits += row.visitas ?? 0
      acc.proposals += row.propostas ?? 0
      acc.deals += row.negocios ?? 0
      const price = row.preco ?? 0
      if (row.negocios && price) {
        acc.dealsVolume += row.negocios * price
      }
      return acc
    },
    {
      properties: 0,
      active: 0,
      published: 0,
      interested: 0,
      visits: 0,
      proposals: 0,
      deals: 0,
      dealsVolume: 0,
    },
  )

  const metrics = [
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

  if (totals.dealsVolume > 0) {
    metrics.push({ id: 'deals-volume', label: 'Volume negociado', value: totals.dealsVolume, format: 'currency' })
  }

  const summary = {
    totals,
    metrics,
    series: buildSeries(rows),
    period: buildPeriod(filters),
    message: rows.length ? undefined : 'Não encontramos imóveis para os filtros selecionados.',
  }

  return { summary }
}

export function getPropertyReportDetail(propertyId: number): PropertyReportDetail | undefined {
  return PROPERTY_REPORTS[propertyId]
}
