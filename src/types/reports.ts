export type ISODateString = string

export interface DateRange {
  from: ISODateString
  to: ISODateString
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
}

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  column: string
  direction: SortDirection
}

export type ReportPeriodPreset =
  | 'last7'
  | 'last15'
  | 'last30'
  | 'last90'
  | 'currentMonth'
  | 'custom'

export interface BaseFilters {
  dateRange?: DateRange
  search?: string
  codigo?: string
  titulo?: string
  utm?: string
  status?: string
  tipo?: string
  teamId?: string
  storeId?: string
  ownerId?: string
  periodPreset?: ReportPeriodPreset
}

export interface LeadsRow {
  id: number
  nome: string
  origem?: string
  criadoEm?: ISODateString
  telefone?: string
  email?: string
  origemDetalhada?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  responsavel?: string
  equipe?: string
  loja?: string
  status?: string
  etapa?: string
  atualizadoEm?: ISODateString
  ultimoContatoEm?: ISODateString
  proximaAcaoEm?: ISODateString
  slaHorasRestantes?: number
  slaStatus?: string
  score?: number
  valorPotencial?: number
  tags?: string[]
  observacoes?: string
  camposCustomizados?: Record<string, unknown>
}

export interface ImovelRow {
  id: number
  codigo: string
  titulo: string
  tipo?: string
  status?: string
  utm?: string
  teamId?: string
  storeId?: string
  ownerId?: string
  responsavel?: string
  responsavelId?: string
  responsavelEmail?: string
  atualizadoEm?: ISODateString
  updatedAt?: ISODateString
  interessados?: number
  visitas?: number
  propostas?: number
  negocios?: number
  cidade?: string
  bairro?: string
  preco?: number
  meta?: Record<string, unknown>
}

export interface CorretorRow {
  id: number
  nome: string
  email?: string
  telefone?: string
}

export interface AgendaRow {
  id: number
  data: ISODateString
  cliente: string
  status?: string
}

export interface ServicoRow {
  id: number
  nome: string
  valor?: number
  ativo?: boolean
}

export interface DistribuicaoRow {
  id: number
  leadId: number
  corretorId: number
  status: string
  data: ISODateString
}

export interface ApiRow {
  id: number
  endpoint: string
  total: number
  sucesso: number
  falha: number
}
