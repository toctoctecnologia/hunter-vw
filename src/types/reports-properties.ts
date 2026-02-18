import type { ISODateString, Pagination } from './reports'

export interface PropertyReportQuickAction {
  label: string
  href: string
  variant?: 'default' | 'outline' | 'secondary'
  target?: '_blank' | '_self'
}

export interface PropertyReportKpi {
  id: string
  label: string
  value: string
  helperText?: string
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
  }
}

export interface PropertyReportSummaryItem {
  label: string
  value: string
}

export interface PropertyReportSummarySection {
  id: string
  title: string
  items: PropertyReportSummaryItem[]
}

export type PropertiesAggregateMetricFormat = 'number' | 'currency' | 'percentage'

export interface PropertiesAggregateMetricChange {
  type: 'increase' | 'decrease' | 'neutral'
  value?: number
  label?: string
}

export interface PropertiesAggregateMetric {
  id: string
  label: string
  value: number
  format?: PropertiesAggregateMetricFormat
  helperText?: string
  change?: PropertiesAggregateMetricChange
}

export interface PropertiesAggregateSeriesPoint {
  date: ISODateString
  visits: number
  proposals: number
}

export interface PropertiesAggregatesPeriod {
  from?: ISODateString
  to?: ISODateString
  label?: string
}

export interface PropertiesAggregatesTotals {
  properties: number
  active: number
  published: number
  interested: number
  visits: number
  proposals: number
  deals: number
  dealsVolume: number
}

export interface PropertiesAggregates {
  period?: PropertiesAggregatesPeriod
  totals: PropertiesAggregatesTotals
  metrics: PropertiesAggregateMetric[]
  series: PropertiesAggregateSeriesPoint[]
  message?: string
}

type TimelineEventType =
  | 'lead'
  | 'visit'
  | 'proposal'
  | 'deal'
  | 'cart'
  | 'status'
  | 'note'
  | 'portal'
  | 'kpi'

export interface PropertyTimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description?: string
  createdAt: ISODateString
  actor?: string
  metadata?: Record<string, unknown>
}

export interface PropertyPortalStatus {
  portal: string
  status: string
  lastSync?: ISODateString
  link?: string
  notes?: string
}

export interface PropertyReportTableItem {
  id: string | number
  [key: string]: unknown
}

export interface PropertyReportTable<T extends PropertyReportTableItem> {
  items: T[]
  pagination: Pagination
}

export interface PropertyInterestedRow extends PropertyReportTableItem {
  name: string
  email?: string
  phone?: string
  createdAt: ISODateString
  status?: string
  leadId?: string
}

export interface PropertyVisitRow extends PropertyReportTableItem {
  visitor: string
  broker?: string
  scheduledAt: ISODateString
  status?: string
  leadId?: string
}

export interface PropertyCartRow extends PropertyReportTableItem {
  buyer: string
  broker?: string
  createdAt: ISODateString
  stage: string
  leadId?: string
}

export interface PropertyProposalRow extends PropertyReportTableItem {
  buyer: string
  broker?: string
  amount: number
  status: string
  createdAt: ISODateString
  leadId?: string
}

export interface PropertyDealRow extends PropertyReportTableItem {
  buyer: string
  broker?: string
  amount: number
  status: string
  closedAt: ISODateString
  leadId?: string
}

export interface PropertyReportDetail {
  property: {
    id: number
    code: string
    title: string
    type?: string
    status?: string
    price?: number
    address?: string
    city?: string
    neighborhood?: string
    responsible?: {
      id?: string
      name?: string
      email?: string
      phone?: string
    }
    owner?: {
      name?: string
      phone?: string
    }
    store?: string
    createdAt?: ISODateString
    updatedAt?: ISODateString
    leadId?: string
    leadName?: string
    imageUrl?: string
  }
  quickActions: PropertyReportQuickAction[]
  kpis: PropertyReportKpi[]
  summary: PropertyReportSummarySection[]
  timeline: PropertyTimelineEvent[]
  interested: PropertyReportTable<PropertyInterestedRow>
  visits: PropertyReportTable<PropertyVisitRow>
  cart: PropertyReportTable<PropertyCartRow>
  proposals: PropertyReportTable<PropertyProposalRow>
  deals: PropertyReportTable<PropertyDealRow>
  portals: PropertyPortalStatus[]
}
