import { useQuery } from '@tanstack/react-query';
import { Building, Building2, Calendar, Home } from 'lucide-react';
import { PaginationState } from '@tanstack/react-table';
import { useState, useMemo } from 'react';

import { formatDate, formatValue } from '@/shared/lib/utils';

import { getCondominiumById, getCondominiumMedias } from '@/features/dashboard/properties/api/condominiums';
import { getCondominiumFeatures } from '@/features/dashboard/properties/api/condominium-feature';

import { propertyMediaArrayToMediaItems } from '@/features/dashboard/properties/components/property-gallery/utils';
import { PropertyGallery } from '@/features/dashboard/properties/components/property-gallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { NoContentCard } from '@/shared/components/no-content-card';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';
import { Badge } from '@/shared/components/ui/badge';

interface CondominiumDetailProps {
  uuid: string | null;
}

export function CondominiumDetail({ uuid }: CondominiumDetailProps) {
  const [pagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 100 });

  const {
    data: condominium,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['condominium-detail', uuid],
    queryFn: () => getCondominiumById(uuid!),
    enabled: !!uuid,
  });

  const {
    data: condominiumMedias,
    isLoading: isLoadingMedias,
    isError: isErrorMedias,
    error: errorMedias,
  } = useQuery({
    queryKey: ['condominium-medias', uuid],
    queryFn: () => getCondominiumMedias(uuid!),
    enabled: !!uuid,
  });

  const { data: condominiumFeatures = [] } = useQuery({
    queryKey: ['condominium-feature', pagination],
    queryFn: () => getCondominiumFeatures(pagination),
  });

  const filteredFeatures = useMemo(() => {
    if (!condominium?.featureUuids || !condominiumFeatures.length) return [];
    return condominiumFeatures.filter((feature) => condominium.featureUuids.includes(feature.uuid));
  }, [condominium?.featureUuids, condominiumFeatures]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar condomínio" />;
  if (!uuid) return <NoContentCard title="Imóvel não possui condomínio associado" icon={Building} />;
  if (!condominium) return <NoContentCard title="Condomínio não encontrado" />;

  const medias = propertyMediaArrayToMediaItems(condominiumMedias || []);

  return (
    <div className="space-y-6 pb-24">
      {isLoadingMedias ? (
        <Loading />
      ) : isErrorMedias ? (
        <ErrorCard error={errorMedias} title="Erro ao carregar mídias do condomínio" />
      ) : (
        <PropertyGallery media={medias} editMode={false} />
      )}

      {/* Informações Principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Informações do Condomínio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">{condominium.name}</h2>

          {condominium.edificeName && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nome do Edifício:</p>
              <p className="text-base font-semibold">{condominium.edificeName}</p>
            </div>
          )}

          {condominium.years && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ano de Construção:</p>
              <p className="text-base font-semibold">{condominium.years}</p>
            </div>
          )}

          {condominium.price && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor do Condomínio:</p>
              <p className="text-lg font-bold text-primary">{formatValue(condominium.price)}</p>
            </div>
          )}

          {condominium.updatedAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <Calendar className="w-4 h-4" />
              <span>Última atualização: {formatDate(condominium.updatedAt)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações da Construtora */}
      {condominium.builder && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Construtora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nome:</p>
              <p className="text-base font-semibold">{condominium.builder.name}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Características do Condomínio */}
      {filteredFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Características do Condomínio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filteredFeatures.map((feature) => (
                <Badge key={feature.uuid} variant="secondary">
                  {feature.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
