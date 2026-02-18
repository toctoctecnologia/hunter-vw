export type WebhookDeliveryStatus = 'success' | 'retrying' | 'failed';

export interface WebhookEvent {
  id: string;
  name: string;
  description: string;
  category: 'Leads' | 'Negócios' | 'Imóveis' | 'Campanhas';
}

export interface WebhookPreset {
  id: string;
  name: string;
  description: string;
  eventIds: string[];
  recommended?: boolean;
}

export interface WebhookConfig {
  enabled: boolean;
  targetUrl: string;
  secret: string;
  events: string[];
  presetId?: string | null;
  lastRotation?: string | null;
  lastDelivery?: string | null;
}

export interface WebhookLogEntry {
  id: string;
  eventId: string;
  status: WebhookDeliveryStatus;
  deliveredAt: string;
  responseCode: number;
  latencyMs: number;
  attempt: number;
  maxAttempts: number;
  errorMessage?: string;
}

export interface WebhookTestResult {
  success: boolean;
  message: string;
  requestId: string;
}

export interface WebhookMetadata {
  events: WebhookEvent[];
  presets: WebhookPreset[];
}
