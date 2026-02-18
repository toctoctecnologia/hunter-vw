import { Building2, Search, X, Calendar, Check } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from '@/shims/next-image';
import { format } from 'date-fns';

import { getTimeOneHourAhead, timeToString, stringToTime } from '@/shared/lib/utils';
import { PropertyDetail, PropertyStatus } from '@/shared/types';

import {
  getLeadProperties,
  signPropertyToLead,
  deleteLeadProperty,
} from '@/features/dashboard/sales/api/lead-properties';
import { getProperties } from '@/features/dashboard/properties/api/properties';
import { createTask } from '@/features/dashboard/calendar/api/tasks';

import { PropertyHighlightCard } from '@/features/dashboard/components/property-highlight-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area';
import { ErrorModal } from '@/shared/components/modal/error-modal';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Modal } from '@/shared/components/ui/modal';

interface LinkedProperty {
  uuid: string;
  code: string;
  name: string;
  price: number;
  principalMediaUrl?: string;
}

interface VisitSchedule {
  propertyCode: string;
  propertyName: string;
  date: string;
  time: { hour: number; minute: number; second: number };
}

interface LeadPropertiesProps {
  leadUuid: string;
}

export function LeadProperties({ leadUuid }: LeadPropertiesProps) {
  const queryClient = useQueryClient();
  const [searchPropertyQuery, setSearchPropertyQuery] = useState('');
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [selectedPropertyCodes, setSelectedPropertyCodes] = useState<string[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [visitSchedules, setVisitSchedules] = useState<VisitSchedule[]>([]);
  const [errorModal, setErrorModal] = useState<{ title: string; messages: string[] } | null>(null);

  const { data: linkedProperties, isLoading: isLoadingLinkedProperties } = useQuery<LinkedProperty[]>({
    queryKey: ['lead-properties', leadUuid],
    queryFn: () => getLeadProperties(leadUuid),
  });

  const { data: properties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties-search', searchPropertyQuery],
    queryFn: () =>
      getProperties({
        pagination: { pageIndex: 0, pageSize: 20 },
        filters: {
          filter: searchPropertyQuery,
          status: `!${PropertyStatus.PENDING_TO_APPROVE}`,
        },
      }),
    enabled: searchPropertyQuery.length >= 3 && isAddingProperty,
  });

  const signPropertyMutation = useMutation({
    mutationFn: ({ propertyCode }: { propertyCode: string }) => signPropertyToLead(leadUuid, propertyCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-properties', leadUuid] });
      toast.success('Imóvel vinculado com sucesso!');
      setIsAddingProperty(false);
      setSearchPropertyQuery('');
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: ({ propertyCode }: { propertyCode: string }) => deleteLeadProperty(leadUuid, propertyCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-properties', leadUuid] });
      toast.success('Imóvel removido com sucesso!');
    },
  });

  const scheduleVisitsMutation = useMutation({
    mutationFn: async (schedules: VisitSchedule[]) => {
      const promises = schedules.map((schedule) =>
        createTask({
          title: `Visita ao imóvel ${schedule.propertyCode} - ${schedule.propertyName}`,
          description: '',
          taskCode: 'PROPERTY_VISIT',
          taskDate: schedule.date,
          taskTime: schedule.time,
          color: '#22c55e',
          leadUuid,
          propertyCode: schedule.propertyCode,
        }),
      );

      return Promise.all(promises);
    },
    onSuccess: (_, schedules) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(
        schedules.length === 1 ? 'Visita agendada com sucesso!' : `${schedules.length} visitas agendadas com sucesso!`,
      );
      setSelectedPropertyCodes([]);
      setIsScheduleModalOpen(false);
      setVisitSchedules([]);
    },
  });

  const handleSelectProperty = (property: PropertyDetail) => {
    signPropertyMutation.mutate({ propertyCode: property.code });
  };

  const handleRemoveProperty = (propertyCode: string) => {
    deletePropertyMutation.mutate({ propertyCode });
  };

  const handleTogglePropertySelection = (propertyCode: string) => {
    setSelectedPropertyCodes((prev) =>
      prev.includes(propertyCode) ? prev.filter((code) => code !== propertyCode) : [...prev, propertyCode],
    );
  };

  const handleSelectAllProperties = () => {
    if (!linkedProperties) return;
    if (selectedPropertyCodes.length === linkedProperties.length) {
      setSelectedPropertyCodes([]);
    } else {
      setSelectedPropertyCodes(linkedProperties.map((p) => p.code));
    }
  };

  const handleScheduleVisits = () => {
    if (selectedPropertyCodes.length === 0) return;

    const tomorrow = new Date(Date.now() + 86400000);
    const defaultDate = format(tomorrow, 'yyyy-MM-dd');
    const defaultTime = getTimeOneHourAhead();

    const initialSchedules: VisitSchedule[] = selectedPropertyCodes.map((code) => {
      const property = linkedProperties?.find((p) => p.code === code);
      return {
        propertyCode: code,
        propertyName: property?.name || '',
        date: defaultDate,
        time: defaultTime,
      };
    });

    setVisitSchedules(initialSchedules);
    setIsScheduleModalOpen(true);
  };

  const handleUpdateScheduleDate = (propertyCode: string, date: string) => {
    setVisitSchedules((prev) =>
      prev.map((schedule) => (schedule.propertyCode === propertyCode ? { ...schedule, date } : schedule)),
    );
  };

  const handleUpdateScheduleTime = (propertyCode: string, time: { hour: number; minute: number; second: number }) => {
    setVisitSchedules((prev) =>
      prev.map((schedule) => (schedule.propertyCode === propertyCode ? { ...schedule, time } : schedule)),
    );
  };

  const handleConfirmScheduleVisits = () => {
    scheduleVisitsMutation.mutate(visitSchedules);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setVisitSchedules([]);
  };

  if (isLoadingLinkedProperties) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Imóveis Vinculados</CardTitle>
        </CardHeader>
        <CardContent>
          <Loading />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {errorModal && (
        <ErrorModal
          open={true}
          title={errorModal.title}
          messages={errorModal.messages}
          onClose={() => setErrorModal(null)}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Imóveis Vinculados</CardTitle>
            {!isAddingProperty && (
              <Button variant="outline" size="sm" onClick={() => setIsAddingProperty(true)}>
                <Building2 className="h-4 w-4" />
                Adicionar Imóvel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {linkedProperties && linkedProperties.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {linkedProperties.length} {linkedProperties.length === 1 ? 'imóvel vinculado' : 'imóveis vinculados'}
                </p>
                <div className="flex items-center gap-2">
                  {linkedProperties.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={handleSelectAllProperties}>
                      {selectedPropertyCodes.length === linkedProperties.length ? (
                        <>
                          <X className="h-4 w-4" />
                          Desmarcar todos
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Selecionar todos
                        </>
                      )}
                    </Button>
                  )}
                  {selectedPropertyCodes.length > 0 && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleScheduleVisits}
                      disabled={scheduleVisitsMutation.isPending}
                    >
                      <Calendar className="h-4 w-4" />
                      Agendar Visita ({selectedPropertyCodes.length})
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {linkedProperties.map((property) => (
                  <div
                    key={property.uuid}
                    className={`flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer ${
                      selectedPropertyCodes.includes(property.code) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleTogglePropertySelection(property.code)}
                  >
                    <Checkbox
                      checked={selectedPropertyCodes.includes(property.code)}
                      onCheckedChange={() => handleTogglePropertySelection(property.code)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="size-16 rounded-md overflow-hidden shrink-0 relative">
                      {property.principalMediaUrl ? (
                        <Image src={property.principalMediaUrl} alt={property.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {property.code} - {property.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(property.price)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProperty(property.code);
                      }}
                      disabled={deletePropertyMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isAddingProperty && (
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Adicionar Novo Imóvel</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingProperty(false);
                    setSearchPropertyQuery('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search-property">Buscar Imóvel</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-property"
                    type="text"
                    placeholder="Digite o código ou nome do imóvel..."
                    value={searchPropertyQuery}
                    onChange={(e) => setSearchPropertyQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {searchPropertyQuery.length > 0 && searchPropertyQuery.length < 3 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Digite ao menos 3 caracteres para buscar</p>
                </div>
              )}

              {searchPropertyQuery.length >= 3 && (
                <>
                  {isLoadingProperties ? (
                    <Loading />
                  ) : properties?.content && properties.content.length > 0 ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {properties.content.length}{' '}
                        {properties.content.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                      </p>
                      <ScrollArea className="w-full whitespace-nowrap rounded-md">
                        <div className="flex gap-4 pb-4 w-max">
                          {properties.content.map((property) => (
                            <PropertyHighlightCard
                              key={property.uuid}
                              property={property}
                              selectionMode={true}
                              onSelect={handleSelectProperty}
                            />
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">Nenhum imóvel encontrado</p>
                      <p className="text-sm text-muted-foreground mt-1">Tente buscar por outro termo</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!isAddingProperty && (!linkedProperties || linkedProperties.length === 0) && (
            <div className="text-center py-8">
              <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">Nenhum imóvel vinculado</p>
              <p className="text-sm text-muted-foreground mt-1">Clique em &quot;Adicionar Imóvel&quot; para vincular</p>
            </div>
          )}
        </CardContent>

        <Modal open={isScheduleModalOpen} onClose={handleCloseScheduleModal} title="Agendar Visitas">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Defina a data e horário para cada visita aos imóveis selecionados.
            </p>

            <div className="space-y-4 max-h-100 overflow-y-auto">
              {visitSchedules.map((schedule) => {
                const property = linkedProperties?.find((p) => p.code === schedule.propertyCode);
                return (
                  <div key={schedule.propertyCode} className="p-4 rounded-lg border bg-card space-y-3 overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-12 rounded-md overflow-hidden shrink-0 relative">
                        {property?.principalMediaUrl ? (
                          <Image
                            src={property.principalMediaUrl}
                            alt={schedule.propertyName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-sm font-semibold">
                          {schedule.propertyCode} - {schedule.propertyName}
                        </p>
                        {property && (
                          <p className="text-xs text-muted-foreground truncate">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(property.price)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <Label htmlFor={`date-${schedule.propertyCode}`} className="text-xs">
                          Data
                        </Label>
                        <Input
                          id={`date-${schedule.propertyCode}`}
                          type="date"
                          value={schedule.date}
                          onChange={(e) => handleUpdateScheduleDate(schedule.propertyCode, e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <Label htmlFor={`time-${schedule.propertyCode}`} className="text-xs">
                          Horário
                        </Label>
                        <Input
                          id={`time-${schedule.propertyCode}`}
                          type="time"
                          value={timeToString(schedule.time)}
                          onChange={(e) =>
                            handleUpdateScheduleTime(schedule.propertyCode, stringToTime(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCloseScheduleModal}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmScheduleVisits} isLoading={scheduleVisitsMutation.isPending}>
                <Calendar className="h-4 w-4" />
                Confirmar Agendamento
              </Button>
            </div>
          </div>
        </Modal>
      </Card>
    </>
  );
}
