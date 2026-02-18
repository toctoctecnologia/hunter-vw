import React, { useCallback, useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  getProperty,
  mergeProperty,
  type PropertyCatalogChannelState,
  type PropertyCatalogKey,
  type PropertyCatalogState,
} from '@/features/imoveis/state/imovelLocalStore';
import { buildCatalogFeed } from '@/features/imoveis/state/buildCatalogFeed';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type CatalogState = Record<PropertyCatalogKey, PropertyCatalogChannelState>;

const CHANNELS: Array<{
  key: PropertyCatalogKey;
  title: string;
  description: string;
  placeholder: string;
}> = [
  {
    key: 'facebookStore',
    title: 'Facebook Store',
    description: 'Disponibiliza o imóvel na vitrine da loja do Facebook.',
    placeholder: 'ID do catálogo da Store',
  },
  {
    key: 'facebookAds',
    title: 'Facebook Ads',
    description: 'Usa CO por foto para gerar anúncios dinâmicos no Ads.',
    placeholder: 'ID do catálogo de Ads',
  },
  {
    key: 'googleAds',
    title: 'Google Ads',
    description: 'Sincroniza criativos responsivos com base nas fotos com CO.',
    placeholder: 'ID da conta de Ads',
  },
  {
    key: 'googleMerchant',
    title: 'Google Merchant',
    description: 'Publica o imóvel na aba Shopping utilizando os dados de CO.',
    placeholder: 'ID do Merchant Center',
  },
];

const createDefaultState = (): CatalogState => ({
  facebookStore: { enabled: false, catalogId: '' },
  facebookAds: { enabled: false, catalogId: '' },
  googleAds: { enabled: false, catalogId: '' },
  googleMerchant: { enabled: false, catalogId: '' },
});

const applyDefaults = (catalogs?: PropertyCatalogState): CatalogState => {
  const defaults = createDefaultState();

  return {
    facebookStore: { ...defaults.facebookStore, ...(catalogs?.facebookStore ?? {}) },
    facebookAds: { ...defaults.facebookAds, ...(catalogs?.facebookAds ?? {}) },
    googleAds: { ...defaults.googleAds, ...(catalogs?.googleAds ?? {}) },
    googleMerchant: { ...defaults.googleMerchant, ...(catalogs?.googleMerchant ?? {}) },
  };
};

export interface MarketingPanelProps {
  propertyId?: string;
  className?: string;
}

export const MarketingPanel: React.FC<MarketingPanelProps> = ({ propertyId, className }) => {
  const [catalogs, setCatalogs] = useState<CatalogState>(createDefaultState);

  const persistCatalog = useCallback(
    (key: PropertyCatalogKey, next: PropertyCatalogChannelState) => {
      if (!propertyId) {
        return;
      }

      mergeProperty(propertyId, previous => ({
        ...previous,
        catalogs: {
          ...(previous.catalogs ?? {}),
          [key]: next,
        },
      }));
    },
    [propertyId],
  );

  useEffect(() => {
    if (!propertyId) {
      setCatalogs(createDefaultState());
      return;
    }

    const stored = getProperty(propertyId)?.catalogs;
    setCatalogs(applyDefaults(stored));
  }, [propertyId]);

  const updateCatalog = (key: PropertyCatalogKey, patch: Partial<PropertyCatalogChannelState>) => {
    setCatalogs(previous => {
      const current = previous[key];
      const catalogId =
        patch.catalogId !== undefined ? patch.catalogId.trim() : current.catalogId;
      const next = {
        ...current,
        ...patch,
        catalogId,
      } satisfies PropertyCatalogChannelState;

      const nextState = {
        ...previous,
        [key]: next,
      };

      persistCatalog(key, next);
      return nextState;
    });
  };

  const handleGenerateFeeds = () => {
    if (!propertyId) {
      return;
    }

    buildCatalogFeed(propertyId);
    toast({ title: 'Feeds gerados (mock)' });
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Marketing</CardTitle>
        <CardDescription>
          Configure os catálogos e feeds usados para distribuir os imóveis automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-dashed border-primary/40 bg-primary/5">
          <Info className="h-4 w-4 text-primary" aria-hidden="true" />
          <AlertDescription>Usa CO por foto… para manter os catálogos sincronizados.</AlertDescription>
        </Alert>

        <div className="space-y-6">
          {CHANNELS.map((channel, index) => {
            const channelState = catalogs[channel.key];
            const switchId = `${channel.key}-enabled`;
            const inputId = `${channel.key}-catalog-id`;

            return (
              <div key={channel.key} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor={switchId} className="text-base font-medium">
                      {channel.title}
                    </Label>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                  <Switch
                    id={switchId}
                    checked={channelState.enabled}
                    onCheckedChange={checked => updateCatalog(channel.key, { enabled: checked })}
                    disabled={!propertyId}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={inputId}>ID do catálogo</Label>
                  <Input
                    id={inputId}
                    placeholder={channel.placeholder}
                    value={channelState.catalogId ?? ''}
                    onChange={event => updateCatalog(channel.key, { catalogId: event.target.value })}
                    onBlur={event => updateCatalog(channel.key, { catalogId: event.target.value })}
                    disabled={!propertyId || !channelState.enabled}
                  />
                </div>
                {index < CHANNELS.length - 1 ? <Separator /> : null}
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={handleGenerateFeeds}
          aria-label="Gerar feeds (mock)"
          disabled={!propertyId}
        >
          Gerar feeds (mock)
        </Button>
      </CardFooter>
    </Card>
  );
};
