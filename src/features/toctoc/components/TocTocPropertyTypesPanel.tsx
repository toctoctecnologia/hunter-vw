import { AlertCircle, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTocTocPropertyTypes } from '../useTocTocPropertyTypes';

export const TocTocPropertyTypesPanel = () => {
  const { data, isLoading, isError, error } = useTocTocPropertyTypes();
  const total = data?.total ?? 0;

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase text-muted-foreground">Tipos de imóveis</p>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg">api-property-types</CardTitle>
            <p className="text-xs text-muted-foreground">Tipos disponíveis e contagem total.</p>
          </div>
          <Badge variant="outline" className="text-[11px]">
            {total} tipos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{(error as Error)?.message ?? 'Erro ao buscar tipos de imóveis.'}</span>
          </div>
        )}

        {isLoading && <p className="text-sm text-muted-foreground">Carregando tipos...</p>}

        {!isLoading && !data?.data?.length && (
          <p className="text-sm text-muted-foreground">Nenhum tipo de imóvel disponível.</p>
        )}

        <div className="space-y-3">
          {data?.data?.map(type => {
            const progress = total > 0 ? Math.min(100, (type.count / total) * 100) : 0;
            return (
              <div key={type.type} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground capitalize">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    {type.type}
                  </div>
                  <Badge variant="secondary" className="text-[11px]">
                    {type.count} imóveis
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TocTocPropertyTypesPanel;
