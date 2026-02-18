import { useMemo, useState } from 'react';
import { AlertCircle, Image as ImageIcon, Loader2, MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/ui/SafeImage';
import { useTocTocPropertyPhotos } from '../useTocTocPropertyPhotos';

export const TocTocPropertyPhotosPanel = () => {
  const [serviceId, setServiceId] = useState('');
  const [appliedServiceId, setAppliedServiceId] = useState('');
  const { data, isFetching, isError, error, refetch } = useTocTocPropertyPhotos(appliedServiceId);

  const photos = useMemo(() => data?.data?.photos ?? [], [data?.data?.photos]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Fotos do imóvel</p>
            <CardTitle className="text-lg">api-property-photos</CardTitle>
            <p className="text-xs text-muted-foreground">
              Consulte todas as fotos aprovadas de um imóvel informando o <code>service_id</code>.
            </p>
          </div>
          {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-id-photos">service_id*</Label>
          <div className="flex gap-2">
            <Input
              id="service-id-photos"
              value={serviceId}
              onChange={event => setServiceId(event.target.value)}
              placeholder="550e8400-e29b-41d4-a716-446655440000"
            />
            <Button
              type="button"
              disabled={!serviceId || isFetching}
              onClick={() => {
                setAppliedServiceId(serviceId);
                refetch();
              }}
            >
              Buscar fotos
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{(error as Error)?.message ?? 'Erro ao buscar fotos do imóvel.'}</span>
          </div>
        )}

        {!data?.data && !isFetching && (
          <p className="text-sm text-muted-foreground">
            Informe o <code>service_id</code> para recuperar todas as fotos aprovadas do imóvel.
          </p>
        )}

        {data?.data && (
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">{data.data.service_name}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {data.data.service_code && <span className="rounded-full bg-muted px-2 py-1">{data.data.service_code}</span>}
                {data.data.type_property && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 capitalize">
                    <Tag className="h-3.5 w-3.5" />
                    {data.data.type_property}
                  </span>
                )}
                {data.data.size_property && (
                  <span className="rounded-full bg-muted px-2 py-1">{data.data.size_property}</span>
                )}
                {typeof data.data.quantity_rooms === 'number' && (
                  <span className="rounded-full bg-muted px-2 py-1">{data.data.quantity_rooms} quartos</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {[data.data.address, data.data.city, data.data.state].filter(Boolean).join(' · ') ||
                    'Localização não informada'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {photos.map(photo => (
                <div
                  key={`${photo.url}-${photo.order ?? Math.random()}`}
                  className="overflow-hidden rounded-lg border border-border/60 bg-muted"
                >
                  <SafeImage
                    src={photo.url}
                    alt={data.data?.service_name ?? 'Foto do imóvel'}
                    className="h-32 w-full object-cover"
                  />
                  {photo.order !== undefined && (
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        Ordem {photo.order}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              {photos.length} fotos aprovadas encontradas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TocTocPropertyPhotosPanel;
