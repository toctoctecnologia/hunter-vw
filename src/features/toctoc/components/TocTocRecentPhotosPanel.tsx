import { useMemo, useState } from 'react';
import { AlertCircle, Clock, Loader2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/ui/SafeImage';
import { useTocTocRecentPhotos } from '../useTocTocRecentPhotos';
import type { TocTocRecentPhotosFilters } from '../api';

const DEFAULT_LIMIT = 8;

export const TocTocRecentPhotosPanel = () => {
  const [filters, setFilters] = useState<TocTocRecentPhotosFilters>({ days: 30, limit: DEFAULT_LIMIT });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const { data, isFetching, isError, error, refetch } = useTocTocRecentPhotos(appliedFilters);

  const hasResults = useMemo(() => (data?.data?.length ?? 0) > 0, [data?.data?.length]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Fotos recentes</p>
            <CardTitle className="text-lg">api-recent-photos</CardTitle>
            <p className="text-xs text-muted-foreground">
              Retorne as fotos mais recentes com filtros de imobiliária, período e limite.
            </p>
          </div>
          {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="recent-real-estate">real_estate_id (opcional)</Label>
            <Input
              id="recent-real-estate"
              value={filters.real_estate_id ?? ''}
              onChange={event =>
                setFilters(prev => ({
                  ...prev,
                  real_estate_id: event.target.value || undefined,
                }))
              }
              placeholder="Filtrar por imobiliária"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recent-days">Dias</Label>
            <Input
              id="recent-days"
              type="number"
              min={1}
              max={90}
              value={filters.days ?? 30}
              onChange={event =>
                setFilters(prev => ({
                  ...prev,
                  days: Number(event.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recent-limit">Limite (máx. 50)</Label>
            <Input
              id="recent-limit"
              type="number"
              min={1}
              max={50}
              value={filters.limit ?? DEFAULT_LIMIT}
              onChange={event =>
                setFilters(prev => ({
                  ...prev,
                  limit: Number(event.target.value),
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
          disabled={isFetching}
        >
          Atualizar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{(error as Error)?.message ?? 'Erro ao listar fotos recentes.'}</span>
          </div>
        )}

        {!hasResults && !isFetching && (
          <p className="text-sm text-muted-foreground">
            Nenhuma foto encontrada para os filtros informados.
          </p>
        )}

        {hasResults && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data?.data.map(photo => (
              <div key={`${photo.photo_url}-${photo.service_id}`} className="overflow-hidden rounded-lg border border-border/60 bg-muted/40">
                <div className="h-24 w-full bg-muted">
                  <SafeImage
                    src={photo.photo_url}
                    alt={photo.service_name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1 px-2 py-2">
                  <p className="text-xs font-semibold text-foreground line-clamp-2">
                    {photo.service_name}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">
                      {[photo.city, photo.state].filter(Boolean).join(' · ') || '—'}
                    </span>
                  </div>
                  {photo.completed_at && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(photo.completed_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TocTocRecentPhotosPanel;
