import type { AlugueisWidgetResponse } from '@/types/dashboard';

const MOCK_WIDGET_METRICS: Record<string, AlugueisWidgetResponse> = {
  'imoveis-gestao': {
    widgetId: 'imoveis-gestao',
    metrics: [
      { id: 'total', label: 'Imóveis ativos', value: 4124 },
      { id: 'atualizados', label: 'Atualizados', value: 2705 },
      { id: 'desatualizados', label: 'Desatualizados', value: 1419 },
    ],
  },
  chaves: {
    widgetId: 'chaves',
    metrics: [
      { id: 'retiradas', label: 'Retiradas', value: 0 },
      { id: 'atrasadas', label: 'Atrasadas', value: 39 },
      { id: 'limite', label: 'Limite de chaves', value: 120 },
    ],
  },
  'contratos-locacao': {
    widgetId: 'contratos-locacao',
    metrics: [
      { id: 'avisos', label: 'Aviso prévio', value: 61 },
      { id: 'garantias', label: 'Garantias vencendo', value: 0 },
      { id: 'reajustes', label: 'Reajustes no mês', value: 12 },
    ],
  },
};

export async function getAlugueisWidgetMetrics(widgetId: string): Promise<AlugueisWidgetResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        MOCK_WIDGET_METRICS[widgetId] ?? {
          widgetId,
          metrics: [{ id: 'empty', label: 'Sem dados', value: '--' }],
        }
      );
    }, 200);
  });
}
