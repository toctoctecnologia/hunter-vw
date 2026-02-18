import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type {
  WebhookDeliveryStatus,
  WebhookEvent,
  WebhookLogEntry,
} from '@/types/webhooks';

const statusConfig: Record<
  WebhookDeliveryStatus,
  { label: string; badge: 'success' | 'warning' | 'destructive' }
> = {
  success: { label: 'Sucesso', badge: 'success' },
  retrying: { label: 'Em retry', badge: 'warning' },
  failed: { label: 'Falhou', badge: 'destructive' },
};

interface WebhookLogsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logs: WebhookLogEntry[];
  events: WebhookEvent[];
  isLoading?: boolean;
  statusFilter: WebhookDeliveryStatus | 'all';
  onStatusFilterChange: (status: WebhookDeliveryStatus | 'all') => void;
  onRefresh: () => void;
}

export function WebhookLogsDrawer({
  open,
  onOpenChange,
  logs,
  events,
  isLoading = false,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
}: WebhookLogsDrawerProps) {
  const eventsMap = useMemo(() => {
    return events.reduce<Record<string, WebhookEvent>>((acc, event) => {
      acc[event.id] = event;
      return acc;
    }, {});
  }, [events]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85dvh]">
        <DrawerHeader className="px-6 pt-6 text-left">
          <DrawerTitle>Logs de entrega do webhook</DrawerTitle>
          <DrawerDescription>
            Acompanhe as últimas entregas do webhook genérico, incluindo tentativas
            com retry automático.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={value =>
                  onStatusFilterChange((value as WebhookDeliveryStatus | 'all') ?? 'all')
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="retrying">Em retry</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
              Atualizar
            </Button>
          </div>

          <Separator />

          <ScrollArea className="h-[50vh] pr-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                Nenhum log encontrado para o filtro atual.
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map(log => {
                  const config = statusConfig[log.status];
                  const event = eventsMap[log.eventId];
                  return (
                    <div
                      key={log.id}
                      className="rounded-lg border p-4 shadow-sm transition hover:border-primary/40"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            {event?.name ?? log.eventId}
                            <Badge variant={config.badge}>{config.label}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Entregue {formatDistanceToNow(new Date(log.deliveredAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                            , código {log.responseCode}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          <div>Latência: {log.latencyMs}ms</div>
                          <div>
                            Tentativa {log.attempt} de {log.maxAttempts}
                          </div>
                        </div>
                      </div>
                      {log.errorMessage && (
                        <p className="mt-3 text-xs text-destructive">
                          {log.errorMessage}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default WebhookLogsDrawer;
