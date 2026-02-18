export type DashboardContext = 'home' | 'alugueis' | 'vendas';

export interface DashboardWidgetDefinition {
  id: string;
  title: string;
  description?: string;
  minCols: number;
  maxCols: number;
  defaultCols: number;
  minHeight: number;
  defaultHeight: number;
  allowResize: boolean;
}

export interface DashboardWidgetInstance {
  id: string;
  widgetId: string;
  cols: number;
  height: number;
}

export interface DashboardLayoutPayload {
  context: DashboardContext;
  userId: string;
  unitId?: string;
  role?: string;
  layout: DashboardWidgetInstance[];
}

export interface DashboardVisibilityPayload {
  context: DashboardContext;
  userId: string;
  unitId?: string;
  role?: string;
  visibility: Record<string, boolean>;
}

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  percent: number;
}

export interface FunnelFilters {
  startDate?: string;
  endDate?: string;
  brokerId?: string;
  inboundOutbound?: string;
  unitId?: string;
  mediaSource?: string;
  funnelType: 'financeiro' | 'contabil';
}

export interface FunnelResponse {
  stages: FunnelStage[];
  rates: {
    averageRate: string;
    meta: string;
  }[];
  meta: {
    lastUpdated: string;
  };
}

export interface AlugueisWidgetMetric {
  id: string;
  label: string;
  value: number | string;
}

export interface AlugueisWidgetResponse {
  widgetId: string;
  metrics: AlugueisWidgetMetric[];
}
