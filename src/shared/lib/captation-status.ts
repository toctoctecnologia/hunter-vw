// Captation status colors and utilities
// Based on the captationStatusSummary data structure

export const captationStatusColors: Record<string, string> = {
  EM_CAPTACAO: '#FF6600',
  EM_PREPARACAO: '#F97316',
  PUBLICADO: '#FACC15',
  EM_NEGOCIACAO: '#6366F1',
  VENDIDO: '#0EA5E9',
  RETIRADO: '#22C55E',
  ALUGADO: '#10B981',
  RESERVADO: '#F59E0B',
  INDISPONIVEL: '#EF4444',
};

export const captationStatusLabels: Record<string, string> = {
  EM_CAPTACAO: 'Em captação',
  EM_PREPARACAO: 'Em preparação',
  PUBLICADO: 'Publicado',
  EM_NEGOCIACAO: 'Em negociação',
  VENDIDO: 'Vendido',
  RETIRADO: 'Retirado',
  ALUGADO: 'Alugado',
  RESERVADO: 'Reservado',
  INDISPONIVEL: 'Indisponível',
};

export function getCaptationStatusColor(status: string): string {
  return captationStatusColors[status] || '#6B7280';
}

export function getCaptationStatusLabel(status: string): string {
  return captationStatusLabels[status] || status;
}
