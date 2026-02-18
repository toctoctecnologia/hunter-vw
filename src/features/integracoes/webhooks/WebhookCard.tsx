import { Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { maskSecret } from '@/api/webhooks';
import type { WebhookConfig } from '@/types/webhooks';

interface WebhookCardProps {
  config: WebhookConfig | null;
  loading: boolean;
  canManage: boolean;
  onConfigure: () => void;
  onToggle: (enabled: boolean) => void;
  onViewLogs: () => void;
  onRotateSecret: () => void;
  rotatingSecret?: boolean;
}

export function WebhookCard({
  config,
  loading,
  canManage,
  onConfigure,
  onToggle,
  onViewLogs,
  onRotateSecret,
  rotatingSecret = false,
}: WebhookCardProps) {
  const enabled = config?.enabled ?? false;
  const lastRotation = config?.lastRotation
    ? new Date(config.lastRotation).toLocaleString('pt-BR')
    : 'Nunca';
  const lastDelivery = config?.lastDelivery
    ? new Date(config.lastDelivery).toLocaleString('pt-BR')
    : 'Sem entregas recentes';

  return (
    <Card className="flex h-full flex-col justify-between border-[1.5px] border-dashed border-orange-200 bg-orange-50/40">
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div className="space-y-3">
          <div>
            <CardTitle className="text-lg">Webhook genérico</CardTitle>
            <p className="text-sm text-muted-foreground">
              Envie eventos do Hunter para qualquer endpoint HTTPS mantendo o seu
              ecossistema atualizado em tempo real.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-orange-300 text-orange-600">
              Eventos em tempo real
            </Badge>
            <Badge variant="secondary">REST</Badge>
            <Badge variant="outline">HMAC-SHA256</Badge>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger className="inline-flex items-center justify-center rounded-full border border-border p-1 text-muted-foreground">
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Configure filtros, secret dedicado e acompanhe tentativas com retry
                  automático. Requer permissões de integração.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-muted-foreground">Status</span>
          {loading ? (
            <Skeleton className="h-6 w-14" />
          ) : (
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              disabled={!canManage || loading}
              aria-label={enabled ? 'Desativar webhook' : 'Ativar webhook'}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Secret atual
            </span>
            {loading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <span className="font-mono text-sm">{maskSecret(config?.secret)}</span>
            )}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Última rotação
            </span>
            {loading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <span className="text-sm text-muted-foreground">{lastRotation}</span>
            )}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Última entrega
            </span>
            {loading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <span className="text-sm text-muted-foreground">{lastDelivery}</span>
            )}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Eventos configurados
            </span>
            {loading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <span className="text-sm text-muted-foreground">
                {config?.events.length ? `${config.events.length} eventos` : 'Nenhum evento selecionado'}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onViewLogs} disabled={loading}>
          Ver logs
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRotateSecret}
          disabled={!canManage || loading || rotatingSecret}
        >
          {rotatingSecret ? 'Rotacionando...' : 'Rotacionar secret'}
        </Button>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="orange"
                onClick={onConfigure}
                disabled={!canManage || loading}
              >
                Configurar Webhook
              </Button>
            </TooltipTrigger>
            <TooltipContent>Configurar Webhook</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

export default WebhookCard;
