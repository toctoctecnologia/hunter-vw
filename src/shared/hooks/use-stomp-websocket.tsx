'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './use-auth';
import type {
  StompFrame,
  StompSubscription,
  UseStompWebSocketOptions,
  UseStompWebSocketReturn,
} from '../types/websocket';
import { createClient } from '../lib/supabase/client';

export function useStompWebSocket({
  url,
  enabled = true,
  onConnected,
  onDisconnected,
  onError,
  reconnectDelay = 5000,
  maxReconnectAttempts = 10,
  heartbeatInterval = 10000,
}: UseStompWebSocketOptions): UseStompWebSocketReturn {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const stompConnectedRef = useRef(false);
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());
  const subscriptionIdCounterRef = useRef(0);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);
  const userRef = useRef(user);

  // Mantém userRef atualizado
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const createStompFrame = useCallback((command: string, headers: Record<string, string> = {}, body = '') => {
    let frame = command + '\n';
    for (const [key, value] of Object.entries(headers)) {
      frame += `${key}:${value}\n`;
    }
    frame += '\n' + body + '\u0000';
    return frame;
  }, []);

  const parseStompFrame = useCallback((data: string): StompFrame => {
    const cleanData = data.replace(/\u0000$/, '');
    const lines = cleanData.split('\n');
    const command = lines[0];
    const headers: Record<string, string> = {};
    let bodyStartIndex = 1;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line === '') {
        bodyStartIndex = i + 1;
        break;
      }
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex);
        const value = line.substring(colonIndex + 1);
        headers[key] = value;
      }
    }

    const body = lines.slice(bodyStartIndex).join('\n');

    return { command, headers, body };
  }, []);

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send('\n');
      }
    }, heartbeatInterval);
  }, [heartbeatInterval]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  const handleStompFrame = useCallback(
    (data: string) => {
      const frame = parseStompFrame(data);
      switch (frame.command) {
        case 'CONNECTED':
          stompConnectedRef.current = true;
          setIsConnected(true);
          reconnectAttemptsRef.current = 0;
          startHeartbeat();
          onConnected?.();

          subscriptionsRef.current.forEach((sub) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              const subscribeFrame = createStompFrame('SUBSCRIBE', {
                id: sub.id,
                destination: sub.destination,
              });
              wsRef.current.send(subscribeFrame);
            }
          });
          break;

        case 'MESSAGE':
          subscriptionsRef.current.forEach((sub) => {
            if (frame.headers['destination']?.includes(sub.destination) || frame.headers['subscription'] === sub.id) {
              try {
                sub.callback(frame);
              } catch (error) {
                console.error('[STOMP] Erro ao processar mensagem:', error);
              }
            }
          });
          break;

        case 'ERROR':
          onError?.(new Error(frame.headers['message'] || 'STOMP Error'));
          break;

        case 'RECEIPT':
          break;

        default:
      }
    },
    [parseStompFrame, createStompFrame, startHeartbeat, onConnected, onError],
  );

  const connect = useCallback(async () => {
    if (!enabled || !user) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const supabase = createClient();
    const sessionResponse = await supabase.auth.getSession();

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        const connectHeaders: Record<string, string> = {
          'accept-version': '1.2,1.1,1.0',
          'heart-beat': `${heartbeatInterval},${heartbeatInterval}`,
          Authorization: `Bearer ${sessionResponse.data.session?.access_token}`,
        };

        const stompConnect = createStompFrame('CONNECT', connectHeaders);
        ws.send(stompConnect);
      };

      ws.onmessage = (event) => {
        const data = event.data;

        if (data === '\n' || data === '\r\n') {
          ws.send('\n');
          return;
        }

        const stompCommands = ['CONNECTED', 'MESSAGE', 'RECEIPT', 'ERROR'];
        const firstLine = data.split('\n')[0];

        if (stompCommands.includes(firstLine)) {
          handleStompFrame(data);
        } else {
          const message = JSON.parse(data);
          if (message.type === 'PING') {
            const pongMessage = { type: 'PONG', payload: {} };
            ws.send(JSON.stringify(pongMessage));
          }
        }
      };

      ws.onerror = () => {
        onError?.(new Error('WebSocket error'));
      };

      ws.onclose = () => {
        stompConnectedRef.current = false;
        setIsConnected(false);
        wsRef.current = null;
        stopHeartbeat();
        onDisconnected?.();

        if (!shouldReconnectRef.current || !userRef.current) {
          return;
        }

        if (enabled && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          onError?.(new Error('Max reconnect attempts exceeded'));
        }
      };
    } catch (error) {
      onError?.(error as Error);
    }
  }, [
    enabled,
    user,
    url,
    heartbeatInterval,
    createStompFrame,
    handleStompFrame,
    stopHeartbeat,
    onDisconnected,
    onError,
    reconnectDelay,
    maxReconnectAttempts,
  ]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopHeartbeat();

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const disconnectFrame = createStompFrame('DISCONNECT', { receipt: 'disconnect-receipt' });
      wsRef.current.send(disconnectFrame);

      setTimeout(() => {
        wsRef.current?.close();
        wsRef.current = null;
      }, 100);
    } else {
      wsRef.current?.close();
      wsRef.current = null;
    }

    stompConnectedRef.current = false;
    setIsConnected(false);
  }, [stopHeartbeat, createStompFrame]);

  const subscribe = useCallback(
    (destination: string, callback: (frame: StompFrame) => void) => {
      const id = `sub-${++subscriptionIdCounterRef.current}`;
      const subscription: StompSubscription = { id, destination, callback };
      subscriptionsRef.current.set(id, subscription);

      if (wsRef.current?.readyState === WebSocket.OPEN && stompConnectedRef.current) {
        const subscribeFrame = createStompFrame('SUBSCRIBE', {
          id,
          destination,
        });
        wsRef.current.send(subscribeFrame);
      }

      // Retorna função de unsubscribe
      return () => {
        subscriptionsRef.current.delete(id);
        if (wsRef.current?.readyState === WebSocket.OPEN && stompConnectedRef.current) {
          const unsubscribeFrame = createStompFrame('UNSUBSCRIBE', { id });
          wsRef.current.send(unsubscribeFrame);
        }
      };
    },
    [createStompFrame],
  );

  const send = useCallback(
    (destination: string, body: string, contentType = 'application/json') => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !stompConnectedRef.current) {
        console.error('[STOMP] Não conectado, não é possível enviar mensagem');
        return;
      }

      const frame = createStompFrame(
        'SEND',
        {
          destination,
          'content-type': contentType,
        },
        body,
      );

      wsRef.current.send(frame);
    },
    [createStompFrame],
  );

  useEffect(() => {
    if (enabled && user) {
      shouldReconnectRef.current = true;
      connect();
    } else if (!user) {
      shouldReconnectRef.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      disconnect();
    }

    return () => {
      shouldReconnectRef.current = false;
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, user]);

  return {
    isConnected,
    subscribe,
    send,
    disconnect,
    reconnect: connect,
  };
}
