import { enforceRateLimit, retryOperation } from '@/api/webhooks';
import type { WebhookLogEntry } from '@/types/webhooks';

interface InboundWebhookPayload {
  eventId: string;
  signature: string;
  deliveredAt: string;
  headers: Record<string, string>;
  body: unknown;
}

const SIGNATURE_HEADER = 'x-webhook-signature';

export async function verifyWebhookSignature(
  payload: InboundWebhookPayload,
): Promise<boolean> {
  // Stub de verificação de assinatura HMAC.
  // Um projeto real faria o cálculo com o secret atual do tenant.
  const providedSignature =
    payload.headers[SIGNATURE_HEADER] ?? payload.signature ?? '';
  return Boolean(providedSignature && providedSignature.length > 10);
}

export async function persistWebhookLog(entry: WebhookLogEntry): Promise<void> {
  // Nesta simulação apenas aguardamos um ciclo de event loop.
  await new Promise(resolve => setTimeout(resolve, 10));
  console.info('[webhooks:in] log persistido', entry.id);
}

export async function handleInboundWebhook(
  payload: InboundWebhookPayload,
): Promise<void> {
  enforceRateLimit('webhooks:inbound', 120, 60_000);

  await retryOperation(async () => {
    const signatureOk = await verifyWebhookSignature(payload);
    if (!signatureOk) {
      throw new Error('Assinatura inválida para o webhook recebido.');
    }

    const logEntry: WebhookLogEntry = {
      id: `in-${payload.eventId}-${Date.now()}`,
      eventId: payload.eventId,
      status: 'success',
      deliveredAt: payload.deliveredAt,
      responseCode: 200,
      latencyMs: 150,
      attempt: 1,
      maxAttempts: 1,
    };

    await persistWebhookLog(logEntry);
  }, 3, 500);
}
