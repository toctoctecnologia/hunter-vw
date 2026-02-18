'use client';

import { useState } from 'react';
import { Home, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { propertyTypeLabels } from '@/shared/lib/property-status';

import { getLeadPropertyPreferenceHistory } from '@/features/dashboard/sales/api/lead-property-preference-history';

import { EditPropertyPreferenceHistoryModal } from '@/features/dashboard/sales/components/modal/edit-property-preference-history-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';

interface PropertyCharacteristicsProps {
  leadUuid: string;
}

export function PropertyCharacteristics({ leadUuid }: PropertyCharacteristicsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: propertyPreferenceHistory, isLoading: isLoadingPropertyPreferenceHistory } = useQuery({
    queryKey: ['lead-property-preference-history', leadUuid],
    queryFn: () => getLeadPropertyPreferenceHistory(leadUuid),
    enabled: !!leadUuid,
  });

  const firstPreference =
    propertyPreferenceHistory && propertyPreferenceHistory.length > 0 ? propertyPreferenceHistory[0] : null;

  return (
    <>
      <EditPropertyPreferenceHistoryModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        leadUuid={leadUuid}
        characteristics={firstPreference}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CardTitle>Características do Imóvel</CardTitle>
            </div>
            {propertyPreferenceHistory && (
              <Button size="sm" variant="outline" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="size-4" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPropertyPreferenceHistory ? (
            <Loading />
          ) : (
            <>
              {!firstPreference ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Nenhuma característica cadastrada para este lead.
                  </p>
                  <Button size="sm" onClick={() => setIsEditModalOpen(true)}>
                    Adicionar Características
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Localização */}
                  {(firstPreference.neighborhood || firstPreference.city || firstPreference.state) && (
                    <div>
                      <p className="text-xs font-semibold opacity-60 mb-2">Dados e Localização</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {firstPreference?.propertyType && (
                          <div>
                            <p className="text-xs opacity-60 mb-0.5">Tipo do Imóvel</p>
                            <p className="text-sm">{propertyTypeLabels[firstPreference.propertyType]}</p>
                          </div>
                        )}
                        {firstPreference.neighborhood && (
                          <div>
                            <p className="text-xs opacity-60 mb-0.5">Rua</p>
                            <p className="text-sm">{firstPreference.neighborhood}</p>
                          </div>
                        )}
                        {firstPreference.city && (
                          <div>
                            <p className="text-xs opacity-60 mb-0.5">Cidade</p>
                            <p className="text-sm">{firstPreference.city}</p>
                          </div>
                        )}
                        {firstPreference.state && (
                          <div>
                            <p className="text-xs opacity-60 mb-0.5">Estado</p>
                            <p className="text-sm">{firstPreference.state}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Áreas */}
                  {(firstPreference.internalArea !== null ||
                    firstPreference.externalArea !== null ||
                    firstPreference.lotArea !== null) && (
                    <div>
                      <p className="text-xs font-semibold opacity-60 mb-2">Dimensões</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {firstPreference.internalArea !== null && (
                          <div>
                            <p className="text-xs opacity-60 mb-0.5">Área Interna</p>
                            <p className="text-sm">{firstPreference.internalArea} m²</p>
                          </div>
                        )}
                        {firstPreference.externalArea !== null && (
                          <div>
                            <p className="text-xs opacity-60 mb-0.5">Área Externa</p>
                            <p className="text-sm">{firstPreference.externalArea} m²</p>
                          </div>
                        )}
                        {firstPreference.lotArea !== null && (
                          <div>
                            <p className="text-xs opacity-60 mb-0.5">Área do Lote</p>
                            <p className="text-sm">{firstPreference.lotArea} m²</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cômodos */}
                  {(firstPreference.rooms !== null ||
                    firstPreference.bathrooms !== null ||
                    firstPreference.garageSpots !== null) && (
                    <div>
                      <p className="text-xs font-semibold opacity-60 mb-2">Cômodos</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {firstPreference.rooms !== null && (
                          <div>
                            <p className="text-xs opacity-60 mb-0.5">Quartos</p>
                            <p className="text-sm">{firstPreference.rooms}</p>
                          </div>
                        )}
                        {firstPreference.bathrooms !== null && (
                          <div>
                            <p className="text-xs opacity-60 mb-0.5">Banheiros</p>
                            <p className="text-sm">{firstPreference.bathrooms}</p>
                          </div>
                        )}
                        {firstPreference.garageSpots !== null && (
                          <div>
                            <p className="text-xs opacity-60 mb-0.5">Vagas de Garagem</p>
                            <p className="text-sm">{firstPreference.garageSpots}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
