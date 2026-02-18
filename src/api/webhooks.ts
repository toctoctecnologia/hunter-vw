import {
  defaultWebhookConfig,
  webhookEventsMock,
  webhookLogsMock,
  webhookPresetsMock,
} from '@/mocks/webhooks';
import type {
  WebhookConfig,
  WebhookDeliveryStatus,
  WebhookLogEntry,
  WebhookMetadata,
  WebhookTestResult,
} from '@/types/webhooks';

let currentConfig: WebhookConfig = { ...defaultWebhookConfig };
let logStore: WebhookLogEntry[] = [...webhookLogsMock];

const RATE_LIMIT_WINDOW = 30_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimiterState = new Map<string, number[]>();

function generateRandomHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i += 1) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, value => value.toString(16).padStart(2, '0')).join('');
}

export function maskSecret(secret: string | null | undefined): string {
  if (!secret) return '••••••••••••';
  if (secret.length <= 8) return `${secret.slice(0, 2)}••••${secret.slice(-2)}`;
  return `${secret.slice(0, 4)}••••••${secret.slice(-4)}`;
}

export function enforceRateLimit(
  key: string,
  limit = RATE_LIMIT_MAX_REQUESTS,
  windowMs = RATE_LIMIT_WINDOW,
): void {
  const now = Date.now();
  const bucket = rateLimiterState.get(key) ?? [];
  const filtered = bucket.filter(timestamp => now - timestamp < windowMs);
  if (filtered.length >= limit) {
    throw new Error('Limite de requisições excedido. Tente novamente em instantes.');
  }
  filtered.push(now);
  rateLimiterState.set(key, filtered);
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  attempts = 3,
  delayMs = 400,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  throw lastError ?? new Error('Operação não concluída.');
}

async function securityMiddleware<T>(
  permission: 'integrations:view' | 'integrations:manage',
  handler: () => Promise<T>,
): Promise<T> {
  // Placeholder que simula o middleware de autenticação/autorização da API real.
  // Aqui poderíamos validar sessão, tenant, assinatura HMAC, etc.
  await new Promise(resolve => setTimeout(resolve, 80));
  return handler();
}

export async function fetchWebhookMetadata(): Promise<WebhookMetadata> {
  return securityMiddleware('integrations:view', async () => ({
    events: webhookEventsMock,
    presets: webhookPresetsMock,
  }));
}

export async function getWebhookConfiguration(): Promise<WebhookConfig> {
  return securityMiddleware('integrations:view', async () => ({
    ...currentConfig,
  }));
}

export async function updateWebhookConfiguration(
  updates: Partial<WebhookConfig>,
): Promise<WebhookConfig> {
  return securityMiddleware('integrations:manage', async () => {
    currentConfig = {
      ...currentConfig,
      ...updates,
      events: updates.events ?? currentConfig.events,
      presetId: updates.presetId ?? currentConfig.presetId ?? null,
    };
    if (typeof updates.enabled === 'boolean' && updates.enabled) {
      currentConfig.lastDelivery = new Date().toISOString();
    }
    return { ...currentConfig };
  });
}

export async function rotateWebhookSecret(): Promise<WebhookConfig> {
  return securityMiddleware('integrations:manage', async () =>
    retryOperation(async () => {
      const secret = `whsec_${generateRandomHex(12)}`;
      currentConfig = {
        ...currentConfig,
        secret,
        lastRotation: new Date().toISOString(),
      };
      return { ...currentConfig };
    }, 3, 500),
  );
}

export async function testWebhookDelivery(): Promise<WebhookTestResult> {
  return securityMiddleware('integrations:manage', async () => {
    enforceRateLimit('webhook:test');
    return retryOperation(async () => {
      const success = Math.random() > 0.2;
      if (!success) {
        throw new Error('Simulação de falha na entrega do webhook.');
      }
      return {
        success,
        message: 'Webhook entregue com sucesso ao endpoint informado.',
        requestId: `req_${generateRandomHex(6)}`,
      } satisfies WebhookTestResult;
    }, 2, 600);
  });
}

interface ListWebhookLogsParams {
  status?: WebhookDeliveryStatus;
  search?: string;
}

export async function listWebhookLogs(
  params: ListWebhookLogsParams = {},
): Promise<WebhookLogEntry[]> {
  return securityMiddleware('integrations:view', async () => {
    const { status, search } = params;
    const normalizedSearch = search?.toLowerCase().trim();
    return logStore
      .filter(log => {
        const statusMatches = status ? log.status === status : true;
        if (!statusMatches) return false;
        if (!normalizedSearch) return true;
        return (
          log.eventId.toLowerCase().includes(normalizedSearch) ||
          log.errorMessage?.toLowerCase().includes(normalizedSearch) ||
          log.responseCode.toString().includes(normalizedSearch)
        );
      })
      .map(log => ({ ...log }))
      .sort((a, b) => b.deliveredAt.localeCompare(a.deliveredAt));
  });
}

export async function appendWebhookLog(entry: WebhookLogEntry): Promise<void> {
  await securityMiddleware('integrations:manage', async () => {
    logStore = [{ ...entry }, ...logStore].slice(0, 50);
  });
}

export function resetWebhookMocks(): void {
  currentConfig = { ...defaultWebhookConfig };
  logStore = [...webhookLogsMock];
  rateLimiterState.clear();
}
