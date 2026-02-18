import { AlertCircle, MapPin, Route } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTocTocLocations } from '../useTocTocLocations';

export const TocTocLocationsPanel = () => {
  const { data, isLoading, isError, error } = useTocTocLocations();

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase text-muted-foreground">Localizações</p>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg">api-locations</CardTitle>
            <p className="text-xs text-muted-foreground">
              Estados e cidades com imóveis disponíveis.
            </p>
          </div>
          <Badge variant="outline" className="text-[11px]">
            {data?.data?.total_states ?? 0} estados · {data?.data?.total_cities ?? 0} cidades
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{(error as Error)?.message ?? 'Erro ao buscar localizações.'}</span>
          </div>
        )}

        {isLoading && <p className="text-sm text-muted-foreground">Carregando localizações...</p>}

        {!isLoading && !data?.data?.states?.length && (
          <p className="text-sm text-muted-foreground">Nenhuma localização disponível.</p>
        )}

        <div className="space-y-3">
          {data?.data?.states?.map(state => (
            <div
              key={state.state}
              className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 shadow-sm"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Route className="h-4 w-4 text-muted-foreground" />
                {state.state}
                <span className="text-xs text-muted-foreground">({state.cities.length} cidades)</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {state.cities.map(city => (
                  <Badge key={city} variant="secondary" className="text-[11px]">
                    <MapPin className="mr-1 h-3 w-3" />
                    {city}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TocTocLocationsPanel;
