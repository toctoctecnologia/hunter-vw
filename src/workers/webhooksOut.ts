import { enforceRateLimit, retryOperation } from '@/api/webhooks';
import type { WebhookConfig, WebhookTestResult } from '@/types/webhooks';

interface OutboundWebhookTask {
  config: WebhookConfig;
  eventId: string;
  payload: Record<string, unknown>;
  attempt?: number;
}

export async function dispatchOutboundWebhook(
  task: OutboundWebhookTask,
): Promise<WebhookTestResult> {
  enforceRateLimit('webhooks:outbound', 60, 60_000);

  return retryOperation(async () => {
    if (!task.config.enabled) {
      throw new Error('Webhook desativado para o tenant atual.');
    }

    const success = Math.random() > 0.1;
    if (!success) {
      throw new Error('Falha transitória ao contactar o endpoint remoto.');
    }

    return {
      success: true,
      message: `Evento ${task.eventId} entregue no endpoint ${task.config.targetUrl}.`,
      requestId: `out-${Date.now()}`,
    };
  }, task.config.events.length > 3 ? 4 : 3, 450);
}

export async function scheduleWebhookRetry(
  task: OutboundWebhookTask,
  error: unknown,
): Promise<void> {
  const attempt = (task.attempt ?? 1) + 1;
  const delay = Math.min(5_000 * attempt, 30_000);
  console.warn('[webhooks:out] reagendando tentativa', {
    eventId: task.eventId,
    attempt,
    delay,
    error,
  });
  await new Promise(resolve => setTimeout(resolve, delay));
  if (attempt <= 5) {
    await dispatchOutboundWebhook({ ...task, attempt });
  }
}
