import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ConnectorModal from './ConnectorModal';
import type { Connector } from '@/lib/mock/connectors';
import { formatDateWithFallback } from '@/utils/date';
import { SafeImage } from '@/components/ui/SafeImage';

interface ConnectorCardProps {
  connector: Connector;
  onChange: (connector: Connector) => void;
}

export function ConnectorCard({ connector, onChange }: ConnectorCardProps) {
  const { nome, descricao, ativo } = connector;
  const [open, setOpen] = useState(false);
  const lastUpdated = useMemo(
    () => connector.updatedAt ?? connector.updated_at,
    [connector],
  );
  const formattedLastUpdated = useMemo(() => {
    if (!lastUpdated) return null;
    return formatDateWithFallback(lastUpdated, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }, [lastUpdated]);

  const handleToggle = (value: boolean) => {
    onChange({ ...connector, ativo: value });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-3">
        <div className="flex gap-3">
          {connector.logoUrl && (
            <div className="mt-1 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/60">
              <SafeImage
                src={connector.logoUrl}
                alt={`Logo ${nome}`}
                className="h-full w-full object-contain"
              />
            </div>
          )}
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {nome}
              {ativo && <Badge>Ativo</Badge>}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{descricao}</p>
            {formattedLastUpdated && (
              <p className="text-xs text-muted-foreground">
                Atualizado em {formattedLastUpdated}
              </p>
            )}
          </div>
        </div>
        <Switch checked={ativo} onCheckedChange={handleToggle} />
      </CardHeader>
      <CardContent className="flex items-center justify-end gap-2">
        {connector.appPath && (
          <Button asChild variant="outline" size="sm">
            <Link to={connector.appPath}>Abrir app</Link>
          </Button>
        )}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="orange"
                onClick={() => setOpen(true)}
                aria-label={`Configurar API para ${nome}`}
              >
                Configurar API
              </Button>
            </TooltipTrigger>
            <TooltipContent>Configurar API</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
      <ConnectorModal
        open={open}
        onOpenChange={setOpen}
        connector={connector}
        onSave={onChange}
      />
    </Card>
  );
}

export default ConnectorCard;
