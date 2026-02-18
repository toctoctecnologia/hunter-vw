import { useMemo, useState } from 'react';
import { AlertCircle, Camera, Images, Loader2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SafeImage } from '@/components/ui/SafeImage';
import { useTocTocServicePhotos } from '../useTocTocServicePhotos';
import type { TocTocServicePhotosFilters } from '../api';

const DEFAULT_LIMIT = 6;

export const TocTocServicePhotosPanel = () => {
  const [filters, setFilters] = useState<TocTocServicePhotosFilters>({
    real_estate_id: '',
    limit: DEFAULT_LIMIT,
    offset: 0,
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const { data, isFetching, isError, error, refetch } = useTocTocServicePhotos(appliedFilters);

  const hasResults = useMemo(() => (data?.data?.length ?? 0) > 0, [data?.data?.length]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Fotos de serviços</p>
            <CardTitle className="text-lg">api-service-photos</CardTitle>
            <p className="text-xs text-muted-foreground">
              Liste fotos aprovadas informando <code>real_estate_id</code> e, se quiser, um{' '}
              <code>service_id</code>.
            </p>
          </div>
          {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="real-estate-id">real_estate_id*</Label>
            <Input
              id="real-estate-id"
              value={filters.real_estate_id}
              onChange={event =>
                setFilters(prev => ({
                  ...prev,
                  real_estate_id: event.target.value,
                }))
              }
              placeholder="ID da imobiliária"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service-id">service_id (opcional)</Label>
            <Input
              id="service-id"
              value={filters.service_id ?? ''}
              onChange={event =>
                setFilters(prev => ({
                  ...prev,
                  service_id: event.target.value || undefined,
                }))
              }
              placeholder="Filtrar por serviço"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="limit-service-photos">Limite (máx. 100)</Label>
            <Input
              id="limit-service-photos"
              type="number"
              min={1}
              max={100}
              value={filters.limit ?? DEFAULT_LIMIT}
              onChange={event =>
                setFilters(prev => ({
                  ...prev,
                  limit: Number(event.target.value),
                  offset: 0,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offset-service-photos">Offset</Label>
            <Input
              id="offset-service-photos"
              type="number"
              min={0}
              value={filters.offset ?? 0}
              onChange={event =>
                setFilters(prev => ({
                  ...prev,
                  offset: Math.max(0, Number(event.target.value)),
                }))
              }
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={() => {
            setAppliedFilters(filters);
            refetch();
          }}
          disabled={!filters.real_estate_id || isFetching}
        >
          Buscar fotos
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{(error as Error)?.message ?? 'Erro ao listar fotos de serviços.'}</span>
          </div>
        )}

        {!hasResults && !isFetching && (
          <p className="text-sm text-muted-foreground">
            Informe o <code>real_estate_id</code> para ver fotos aprovadas de serviços concluídos.
          </p>
        )}

        {hasResults && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data?.data.map(service => (
              <div
                key={service.service_id}
                className="overflow-hidden rounded-xl border border-border/60 bg-muted/40"
              >
                <div className="h-32 w-full bg-gradient-to-r from-orange-50 to-muted relative">
                  <SafeImage
                    src={service.photos?.[0]}
                    alt={service.service_name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur">
                    <Camera className="h-3.5 w-3.5" />
                    {service.photos_count ?? 0} fotos
                  </div>
                </div>
                <div className="space-y-1 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {service.service_name}
                    </p>
                    <span className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                      {service.service_code}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>
                      {[service.address, service.city, service.state].filter(Boolean).join(' · ') ||
                        'Localização não informada'}
                    </span>
                  </div>
                  {service.completed_at && (
                    <p className="text-xs text-muted-foreground">
                      Concluído em {new Date(service.completed_at).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {hasResults && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Images className="h-3.5 w-3.5" />
            <span>
              Exibindo {data?.data.length} de {data?.total ?? data?.data.length} serviços
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>Limite: {data?.limit ?? DEFAULT_LIMIT}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Offset: {data?.offset ?? 0}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TocTocServicePhotosPanel;
