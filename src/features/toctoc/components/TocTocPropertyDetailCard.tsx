import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Home, Loader2, MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SafeImage } from '@/components/ui/SafeImage';
import { useTocTocPropertyDetail } from '../useTocTocPropertyDetail';

interface TocTocPropertyDetailCardProps {
  propertyId?: string;
  onPropertyIdChange?: (propertyId: string) => void;
}

export const TocTocPropertyDetailCard = ({
  propertyId,
  onPropertyIdChange,
}: TocTocPropertyDetailCardProps) => {
  const [inputId, setInputId] = useState(propertyId ?? '');

  useEffect(() => {
    setInputId(propertyId ?? '');
  }, [propertyId]);

  const {
    data,
    isFetching,
    isError,
    error,
    refetch,
  } = useTocTocPropertyDetail(inputId || propertyId);

  const gallery = useMemo(() => {
    const photos = data?.data?.photos ?? [];
    if (!Array.isArray(photos)) return [];

    return photos.map(photo => {
      if (typeof photo === 'string') {
        return { url: photo };
      }
      return photo;
    });
  }, [data?.data?.photos]);

  const hasContent = Boolean(data?.data);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Detalhes do imóvel
            </p>
            <CardTitle className="text-lg">API TocToc · api-property-detail</CardTitle>
            <p className="text-xs text-muted-foreground">
              Informe o <code>id</code> para ver as informações completas, fotos e preço.
            </p>
          </div>
          {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="toctoc-property-id">UUID do imóvel</Label>
          <div className="flex gap-2">
            <Input
              id="toctoc-property-id"
              placeholder="550e8400-e29b-41d4-a716-446655440000"
              value={inputId}
              onChange={event => {
                setInputId(event.target.value);
                onPropertyIdChange?.(event.target.value);
              }}
            />
            <Button type="button" onClick={() => refetch()} disabled={!inputId || isFetching}>
              Consultar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{(error as Error)?.message ?? 'Não foi possível carregar o imóvel.'}</span>
          </div>
        )}

        {!hasContent && !isFetching && (
          <p className="text-sm text-muted-foreground">
            Selecione um imóvel na lista ao lado ou cole o <code>id</code> para carregar os dados.
          </p>
        )}

        {hasContent && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">
                {data?.data?.name ?? 'Imóvel sem título'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {data?.data?.type_property && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  <span className="capitalize">{data.data.type_property}</span>
                </Badge>
              )}
              {data?.data?.size_property && (
                <Badge variant="outline">{data.data.size_property}</Badge>
              )}
              {typeof data?.data?.quantity_rooms === 'number' && (
                <Badge variant="outline">{data.data.quantity_rooms} quartos</Badge>
              )}
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4" />
              <div className="space-y-1">
                <p>{data?.data?.address}</p>
                <p>
                  {[data?.data?.neighborhood, data?.data?.city, data?.data?.state].filter(Boolean).join(' · ')}
                </p>
                {data?.data?.zip_code && <p>CEP: {data.data.zip_code}</p>}
              </div>
            </div>

            {data?.data?.price && (
              <p className="text-xl font-semibold text-foreground">
                {typeof data.data.price === 'number'
                  ? data.data.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                    })
                  : String(data.data.price)}
              </p>
            )}

            {data?.data?.description && (
              <p className="text-sm text-muted-foreground">{data.data.description}</p>
            )}

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Galeria</p>
              {gallery.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma foto aprovada encontrada para este imóvel.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {gallery.map(photo => (
                    <div
                      key={`${photo.url}-${photo.order ?? Math.random()}`}
                      className="overflow-hidden rounded-lg border border-border/60 bg-muted"
                    >
                      <SafeImage
                        src={photo.url}
                        alt={data?.data?.name ?? 'Foto do imóvel'}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TocTocPropertyDetailCard;
