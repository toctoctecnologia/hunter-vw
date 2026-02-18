import type {
  BaseFilters,
  Pagination,
  LeadsRow,
  ImovelRow,
  CorretorRow,
  AgendaRow,
  ServicoRow,
  DistribuicaoRow,
  ApiRow,
  SortState,
} from '@/types/reports'
import reportsPropertiesService from './reportsPropertiesService'

interface ListResult<T> {
  rows: T[]
  pagination: Pagination
}

function normalizeString(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function applyFilters<T extends Record<string, any>>(
  rows: T[],
  filters: BaseFilters,
  dateField?: keyof T,
  searchKeys?: (keyof T)[],
): T[] {
  let result = [...rows]

  if (filters.search) {
    const term = normalizeString(filters.search)
    result = result.filter(row => {
      const values = searchKeys ? searchKeys.map(key => row[key]) : Object.values(row)
      return values.some(value => {
        if (value === null || value === undefined) return false
        return normalizeString(String(value)).includes(term)
      })
    })
  }

  if (filters.dateRange && dateField) {
    const from = new Date(filters.dateRange.from)
    const to = new Date(filters.dateRange.to)
    result = result.filter((row) => {
      const value = row[dateField]
      if (!value) return false
      const date = new Date(String(value))
      return date >= from && date <= to
    })
  }

  return result
}

function recentISOString(daysAgo: number, time?: { hours?: number; minutes?: number }) {
  const date = new Date()
  date.setHours(time?.hours ?? 12, time?.minutes ?? 0, 0, 0)
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

function recentDateString(daysAgo: number) {
  return recentISOString(daysAgo).slice(0, 10)
}

function paginate<T>(rows: T[], page: number, pageSize: number): ListResult<T> {
  const start = (page - 1) * pageSize
  const pagedRows = rows.slice(start, start + pageSize)

  return {
    rows: pagedRows,
    pagination: {
      page,
      pageSize,
      total: rows.length,
    },
  }
}

function sortRows<T extends Record<string, any>>(rows: T[], sort?: SortState | null): T[] {
  if (!sort?.column) {
    return rows
  }

  const { column, direction } = sort
  const multiplier = direction === 'desc' ? -1 : 1

  const compareValues = (a: unknown, b: unknown) => {
    if (a === b) return 0
    if (a === undefined || a === null) return -1
    if (b === undefined || b === null) return 1

    const normalizeNumber = (value: unknown) => {
      if (typeof value === 'number' && Number.isFinite(value)) return value
      if (typeof value === 'string') {
        const normalized = value.replace(/\./g, '').replace(',', '.').trim()
        if (!normalized) return Number.NaN
        return Number(normalized)
      }
      return Number.NaN
    }

    const numA = normalizeNumber(a)
    const numB = normalizeNumber(b)
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return numA - numB
    }

    const dateA = new Date(String(a))
    const dateB = new Date(String(b))
    if (!Number.isNaN(dateA.getTime()) && !Number.isNaN(dateB.getTime())) {
      return dateA.getTime() - dateB.getTime()
    }

    return String(a).localeCompare(String(b), 'pt-BR', {
      numeric: true,
      sensitivity: 'base',
    })
  }

  return [...rows].sort((a, b) => {
    const comparison = compareValues(a[column], b[column])
    return comparison * multiplier
  })
}

export async function listRelatorioLeads(
  filters: BaseFilters,
  page = 1,
  pageSize = 25,
  _sort?: SortState | null,
): Promise<ListResult<LeadsRow>> {
  const data: LeadsRow[] = [
    {
      id: 1,
      nome: 'João Silva',
      origem: 'Facebook',
      origemDetalhada: 'Facebook Ads - Verão',
      telefone: '(11) 98765-4321',
      email: 'joao.silva@example.com',
      utmSource: 'facebook',
      utmMedium: 'cpc',
      utmCampaign: 'campanha_verao',
      responsavel: 'Carlos Mendes',
      equipe: 'Equipe Norte',
      loja: 'Loja Centro',
      status: 'Novo',
      etapa: 'Qualificação',
      criadoEm: recentISOString(5, { hours: 10, minutes: 30 }),
      atualizadoEm: recentISOString(4, { hours: 12 }),
      ultimoContatoEm: recentISOString(4, { hours: 12 }),
      proximaAcaoEm: recentISOString(2, { hours: 9 }),
      slaHorasRestantes: 12,
      slaStatus: 'Dentro do SLA',
      score: 78,
      valorPotencial: 350000,
      tags: ['Prioritário', 'Campanha Verão'],
      observacoes: 'Interessado em apartamento de 3 quartos.',
      camposCustomizados: {
        Perfil: 'Família',
        'Tipo de imóvel': 'Apartamento',
      },
    },
    {
      id: 2,
      nome: 'Maria Souza',
      origem: 'Google',
      origemDetalhada: 'Pesquisa orgânica',
      telefone: '(21) 99876-5432',
      email: 'maria.souza@example.com',
      utmSource: 'google',
      utmMedium: 'organic',
      utmCampaign: 'busca_imoveis',
      responsavel: 'Fernanda Alves',
      equipe: 'Equipe Leste',
      loja: 'Loja Barra',
      status: 'Em atendimento',
      etapa: 'Proposta',
      criadoEm: recentISOString(6, { hours: 9, minutes: 15 }),
      atualizadoEm: recentISOString(5, { hours: 18, minutes: 45 }),
      ultimoContatoEm: recentISOString(5, { hours: 18, minutes: 45 }),
      proximaAcaoEm: recentISOString(3, { hours: 14, minutes: 30 }),
      slaHorasRestantes: 4.5,
      slaStatus: 'Próximo do prazo',
      score: 92,
      valorPotencial: 480000,
      tags: ['Alto potencial'],
      observacoes: 'Prefere imóveis próximos ao metrô.',
      camposCustomizados: {
        'Número de quartos': '2',
        Financiamento: 'Sim',
      },
    },
    {
      id: 3,
      nome: 'Pedro Santos',
      origem: 'Site',
      origemDetalhada: 'Formulário landing page',
      telefone: '(31) 91234-5678',
      email: 'pedro.santos@example.com',
      utmSource: 'site',
      utmMedium: 'referral',
      utmCampaign: 'ebook_financiamento',
      responsavel: 'Ricardo Dias',
      equipe: 'Equipe Digital',
      loja: 'Loja Savassi',
      status: 'Em nutrição',
      etapa: 'Contato inicial',
      criadoEm: recentISOString(9, { hours: 14, minutes: 20 }),
      atualizadoEm: recentISOString(7, { hours: 16, minutes: 10 }),
      ultimoContatoEm: recentISOString(7, { hours: 16, minutes: 10 }),
      proximaAcaoEm: recentISOString(1, { hours: 11 }),
      slaHorasRestantes: 36,
      slaStatus: 'Dentro do SLA',
      score: 65,
      valorPotencial: 260000,
      tags: ['Interesse médio'],
      observacoes: 'Solicitou simulações de financiamento.',
      camposCustomizados: {
        'Faixa de renda': '6-8k',
        'Motivo da compra': 'Primeiro imóvel',
      },
    },
    {
      id: 4,
      nome: 'Ana Lima',
      origem: 'Facebook',
      origemDetalhada: 'Campanha remarketing',
      telefone: '(41) 93456-7890',
      email: 'ana.lima@example.com',
      utmSource: 'facebook',
      utmMedium: 'retargeting',
      utmCampaign: 'campanha_remarketing',
      responsavel: 'Paula Souza',
      equipe: 'Equipe Sul',
      loja: 'Loja Batel',
      status: 'Aguardando retorno',
      etapa: 'Follow-up',
      criadoEm: recentISOString(12, { hours: 8, minutes: 45 }),
      atualizadoEm: recentISOString(10, { hours: 10 }),
      ultimoContatoEm: recentISOString(10, { hours: 10 }),
      proximaAcaoEm: recentISOString(8, { hours: 9, minutes: 30 }),
      slaHorasRestantes: 2,
      slaStatus: 'Urgente',
      score: 55,
      valorPotencial: 310000,
      tags: ['Campanha remarketing'],
      observacoes: 'Combinar visita presencial.',
      camposCustomizados: {
        Interesse: 'Casa',
        'Disponibilidade para visita': 'Finais de semana',
      },
    },
    {
      id: 5,
      nome: 'Luiz Costa',
      origem: 'Indicação',
      origemDetalhada: 'Cliente atual',
      telefone: '(51) 94567-8901',
      email: 'luiz.costa@example.com',
      utmSource: 'referencia',
      utmMedium: 'cliente',
      utmCampaign: 'indicacao_jan',
      responsavel: 'Rafael Lima',
      equipe: 'Equipe Premium',
      loja: 'Loja Moinhos',
      status: 'Negociação',
      etapa: 'Proposta comercial',
      criadoEm: recentISOString(18, { hours: 11, minutes: 5 }),
      atualizadoEm: recentISOString(16, { hours: 17, minutes: 20 }),
      ultimoContatoEm: recentISOString(16, { hours: 17, minutes: 20 }),
      proximaAcaoEm: recentISOString(14, { hours: 15 }),
      slaHorasRestantes: 8,
      slaStatus: 'Dentro do SLA',
      score: 88,
      valorPotencial: 520000,
      tags: ['VIP', 'Indicação'],
      observacoes: 'Busca cobertura com área gourmet.',
      camposCustomizados: {
        'Forma de pagamento': 'À vista',
        'Preferência de bairro': 'Centro histórico',
      },
    },
  ]

  const filtered = applyFilters(data, filters, 'criadoEm')
  return paginate(filtered, page, pageSize)
}

export async function listRelatorioImoveis(
  filters: BaseFilters,
  page = 1,
  pageSize = 25,
  sort?: SortState | null,
): Promise<ListResult<ImovelRow>> {
  const { rows, total } = await reportsPropertiesService.list({
    filters: filters as BaseFilters & Record<string, unknown>,
    page,
    pageSize,
    sort,
  })

  const sortedRows = sortRows(rows, sort)

  return {
    rows: sortedRows,
    pagination: {
      page,
      pageSize,
      total,
    },
  }
}

export async function listRelatorioCorretores(
  filters: BaseFilters,
  page = 1,
  pageSize = 25,
  _sort?: SortState | null,
): Promise<ListResult<CorretorRow>> {
  const data: CorretorRow[] = [
    { id: 1, nome: 'Carlos Mendes', email: 'carlos@example.com', telefone: '1111-1111' },
    { id: 2, nome: 'Fernanda Alves', email: 'fernanda@example.com', telefone: '2222-2222' },
    { id: 3, nome: 'Ricardo Dias', email: 'ricardo@example.com', telefone: '3333-3333' },
    { id: 4, nome: 'Paula Souza', email: 'paula@example.com', telefone: '4444-4444' },
    { id: 5, nome: 'Rafael Lima', email: 'rafael@example.com', telefone: '5555-5555' },
  ]

  const filtered = applyFilters(data, filters)
  return paginate(filtered, page, pageSize)
}

export async function listRelatorioAgenda(
  filters: BaseFilters,
  page = 1,
  pageSize = 25,
  _sort?: SortState | null,
): Promise<ListResult<AgendaRow>> {
  const data: AgendaRow[] = [
    { id: 1, data: recentDateString(3), cliente: 'João Silva', status: 'confirmado' },
    { id: 2, data: recentDateString(5), cliente: 'Maria Souza', status: 'pendente' },
    { id: 3, data: recentDateString(7), cliente: 'Pedro Santos', status: 'cancelado' },
    { id: 4, data: recentDateString(9), cliente: 'Ana Lima', status: 'confirmado' },
    { id: 5, data: recentDateString(12), cliente: 'Luiz Costa', status: 'pendente' },
  ]

  const filtered = applyFilters(data, filters, 'data')
  return paginate(filtered, page, pageSize)
}

export async function listRelatorioServicos(
  filters: BaseFilters,
  page = 1,
  pageSize = 25,
  _sort?: SortState | null,
): Promise<ListResult<ServicoRow>> {
  const data: ServicoRow[] = [
    { id: 1, nome: 'Avaliação', valor: 100, ativo: true },
    { id: 2, nome: 'Fotografia', valor: 200, ativo: true },
    { id: 3, nome: 'Consultoria', valor: 300, ativo: false },
    { id: 4, nome: 'Planta Baixa', valor: 150, ativo: true },
    { id: 5, nome: 'Assinatura Digital', valor: 80, ativo: false },
  ]

  const filtered = applyFilters(data, filters)
  return paginate(filtered, page, pageSize)
}

export async function listRelatorioDistribuicao(
  filters: BaseFilters,
  page = 1,
  pageSize = 25,
  _sort?: SortState | null,
): Promise<ListResult<DistribuicaoRow>> {
  const data: DistribuicaoRow[] = [
    { id: 1, leadId: 1, corretorId: 1, status: 'novo', data: recentDateString(2) },
    { id: 2, leadId: 2, corretorId: 2, status: 'contatado', data: recentDateString(4) },
    { id: 3, leadId: 3, corretorId: 3, status: 'em andamento', data: recentDateString(6) },
    { id: 4, leadId: 4, corretorId: 4, status: 'finalizado', data: recentDateString(8) },
    { id: 5, leadId: 5, corretorId: 5, status: 'perdido', data: recentDateString(11) },
  ]

  const filtered = applyFilters(data, filters, 'data')
  return paginate(filtered, page, pageSize)
}

export async function listRelatorioApi(
  filters: BaseFilters,
  page = 1,
  pageSize = 25,
  _sort?: SortState | null,
): Promise<ListResult<ApiRow>> {
  const data: ApiRow[] = [
    { id: 1, endpoint: '/leads', total: 100, sucesso: 95, falha: 5 },
    { id: 2, endpoint: '/imoveis', total: 80, sucesso: 70, falha: 10 },
    { id: 3, endpoint: '/corretores', total: 60, sucesso: 60, falha: 0 },
    { id: 4, endpoint: '/agenda', total: 40, sucesso: 35, falha: 5 },
    { id: 5, endpoint: '/servicos', total: 20, sucesso: 18, falha: 2 },
  ]

  const filtered = applyFilters(data, filters)
  return paginate(filtered, page, pageSize)
}
