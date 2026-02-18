/**
 * Tipos relacionados ao WebSocket STOMP
 */

export interface StompFrame {
  command: string;
  headers: Record<string, string>;
  body: string;
}

export interface StompSubscription {
  id: string;
  destination: string;
  callback: (frame: StompFrame) => void;
}

export interface StompHeaders {
  'accept-version'?: string;
  'heart-beat'?: string;
  type?: string;
  'x-type'?: string;
  'distribution-type'?: string;
  Authorization?: string;
  'content-type'?: string;
  destination?: string;
  id?: string;
  subscription?: string;
  message?: string;
  receipt?: string;
  'receipt-id'?: string;
  version?: string;
  [key: string]: string | undefined;
}

export enum StompCommand {
  CONNECT = 'CONNECT',
  CONNECTED = 'CONNECTED',
  SEND = 'SEND',
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  MESSAGE = 'MESSAGE',
  RECEIPT = 'RECEIPT',
  ERROR = 'ERROR',
  DISCONNECT = 'DISCONNECT',
}

export enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export interface UseStompWebSocketOptions {
  /** URL do servidor WebSocket */
  url: string;
  /** Ativa/desativa a conexão */
  enabled?: boolean;
  /** Callback executado quando conectar com sucesso */
  onConnected?: () => void;
  /** Callback executado quando desconectar */
  onDisconnected?: () => void;
  /** Callback executado em caso de erro */
  onError?: (error: Error) => void;
  /** Delay em ms entre tentativas de reconexão */
  reconnectDelay?: number;
  /** Número máximo de tentativas de reconexão */
  maxReconnectAttempts?: number;
  /** Intervalo em ms para envio de heartbeats */
  heartbeatInterval?: number;
  /** Headers customizados para conexão STOMP */
  customHeaders?: StompHeaders;
}

export interface UseStompWebSocketReturn {
  /** Indica se está conectado ao WebSocket */
  isConnected: boolean;
  /** Função para se inscrever em um tópico/destino */
  subscribe: (destination: string, callback: (frame: StompFrame) => void) => () => void;
  /** Função para enviar mensagem para um destino */
  send: (destination: string, body: string, contentType?: string) => void;
  /** Função para desconectar manualmente */
  disconnect: () => void;
  /** Função para tentar reconectar manualmente */
  reconnect: () => void;
}

/**
 * Tipos de notificação de lead via WebSocket
 */
export enum LeadNotificationType {
  NEW_LEAD = 'NEW_LEAD',
  LEAD_UPDATE = 'LEAD_UPDATE',
  LEAD_ASSIGNED = 'LEAD_ASSIGNED',
  LEAD_REJECTED = 'LEAD_REJECTED',
  LEAD_ACCEPTED = 'LEAD_ACCEPTED',
}

export interface LeadNotificationPayload<T = unknown> {
  type: LeadNotificationType;
  data: T;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Destinos/tópicos STOMP comuns da aplicação
 */
export const STOMP_DESTINATIONS = {
  // User-specific queues
  USER_OFFER: '/user/offer',
  USER_OFFER_RESPONSE: '/user/offer/response',

  // App destinations (para enviar)
  HUNTER_DISTRIBUTION_ACCEPT: '/hunter/distribution/accept',
  HUNTER_ROULETTE_ACCEPT: '/hunter/roulette/accept',
} as const;

export type StompDestination = (typeof STOMP_DESTINATIONS)[keyof typeof STOMP_DESTINATIONS];
