import { addMinutes, subMinutes } from 'date-fns';
import type {
  WebhookConfig,
  WebhookEvent,
  WebhookLogEntry,
  WebhookPreset,
} from '@/types/webhooks';

export const webhookEventsMock: WebhookEvent[] = [
  {
    id: 'lead.created',
    name: 'Lead criado',
    description: 'Disparado quando um lead é criado na base.',
    category: 'Leads',
  },
  {
    id: 'lead.updated',
    name: 'Lead atualizado',
    description: 'Notifica atualizações de status ou dados do lead.',
    category: 'Leads',
  },
  {
    id: 'deal.won',
    name: 'Negócio ganho',
    description: 'Enviado quando um negócio é marcado como ganho.',
    category: 'Negócios',
  },
  {
    id: 'deal.lost',
    name: 'Negócio perdido',
    description: 'Enviado quando um negócio é marcado como perdido.',
    category: 'Negócios',
  },
  {
    id: 'property.updated',
    name: 'Imóvel atualizado',
    description: 'Atualizações relevantes sobre dados dos imóveis.',
    category: 'Imóveis',
  },
  {
    id: 'campaign.performance',
    name: 'Performance de campanha',
    description: 'Resumo diário de performance das campanhas.',
    category: 'Campanhas',
  },
];

export const webhookPresetsMock: WebhookPreset[] = [
  {
    id: 'crm-sync',
    name: 'Sincronização com CRM',
    description: 'Eventos essenciais para manter o CRM atualizado.',
    eventIds: ['lead.created', 'lead.updated', 'deal.won'],
    recommended: true,
  },
  {
    id: 'ads-automation',
    name: 'Automação de campanhas',
    description: 'Monitoramento de resultados de anúncios e leads.',
    eventIds: ['lead.created', 'campaign.performance'],
  },
  {
    id: 'full-coverage',
    name: 'Cobertura total',
    description: 'Inclui todos os eventos disponíveis para integrações avançadas.',
    eventIds: webhookEventsMock.map(event => event.id),
  },
];

export const defaultWebhookConfig: WebhookConfig = {
  enabled: true,
  targetUrl: 'https://hooks.tenantx.com/webhook',
  secret: 'whsec_live_2f71d0c1a3e44e4a',
  events: ['lead.created', 'lead.updated', 'deal.won'],
  presetId: 'crm-sync',
  lastRotation: subMinutes(new Date(), 90).toISOString(),
  lastDelivery: subMinutes(new Date(), 12).toISOString(),
};

export const webhookLogsMock: WebhookLogEntry[] = [
  {
    id: 'log-1',
    eventId: 'lead.created',
    status: 'success',
    deliveredAt: subMinutes(new Date(), 5).toISOString(),
    responseCode: 200,
    latencyMs: 342,
    attempt: 1,
    maxAttempts: 3,
  },
  {
    id: 'log-2',
    eventId: 'deal.won',
    status: 'retrying',
    deliveredAt: subMinutes(new Date(), 18).toISOString(),
    responseCode: 504,
    latencyMs: 1200,
    attempt: 2,
    maxAttempts: 4,
    errorMessage: 'Timeout ao contatar endpoint do parceiro.',
  },
  {
    id: 'log-3',
    eventId: 'campaign.performance',
    status: 'failed',
    deliveredAt: subMinutes(new Date(), 45).toISOString(),
    responseCode: 500,
    latencyMs: 890,
    attempt: 4,
    maxAttempts: 4,
    errorMessage: 'Resposta 500 persistente após múltiplas tentativas.',
  },
  {
    id: 'log-4',
    eventId: 'property.updated',
    status: 'success',
    deliveredAt: addMinutes(new Date(), -60).toISOString(),
    responseCode: 202,
    latencyMs: 450,
    attempt: 1,
    maxAttempts: 3,
  },
];
