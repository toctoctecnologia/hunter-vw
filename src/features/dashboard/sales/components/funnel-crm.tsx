import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar as CalendarIcon, User, X } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { format, subDays } from 'date-fns';

import { FunnelDirection, FunnelLeadsFilters, LeadFunnelStages, LeadOriginType, UnitDetail } from '@/shared/types';
import { cn, funnelDirectionTypeLabels, LeadOriginTypeToLabel } from '@/shared/lib/utils';

import { getFunnelLeads } from '@/features/dashboard/sales/api/lead';
import { getUnits } from '@/features/dashboard/properties/api/units';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CatcherListModal, SelectedItem } from '@/shared/components/modal/catcher-list-modal';
import { LeadsTableModal } from '@/features/dashboard/sales/components/leads-table-modal';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { FunnelChart } from '@/features/dashboard/sales/components/charts/funnel-chart';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Calendar } from '@/shared/components/ui/calendar';
import { ErrorCard } from '@/shared/components/error-card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Label } from '@/shared/components/ui/label';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

const formatDateToAPI = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  return format(date, 'yyyy-MM-dd');
};

interface FunnelCrmProps {
  showFilters?: boolean;
}

export function FunnelCrm({ showFilters = true }: FunnelCrmProps) {
  const { user } = useAuth();
  const [selectedStage, setSelectedStage] = useState<LeadFunnelStages | null>(null);
  const [selectedCatcher, setSelectedCatcher] = useState<SelectedItem | null>(null);
  const [funnelType, setFunnelType] = useState<FunnelDirection | undefined>(undefined);
  const [originType, setOriginType] = useState<LeadOriginType | undefined>(undefined);
  const [unitUuid, setUnitUuid] = useState<string | undefined>(undefined);
  const [selectedStageLabel, setSelectedStageLabel] = useState('');
  const [showCatcherModal, setShowCatcherModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters: FunnelLeadsFilters = {
    startDate: formatDateToAPI(startDate),
    endDate: formatDateToAPI(endDate),
    catcherUuid: selectedCatcher ? selectedCatcher.uuid : undefined,
    funnelType,
    unitUuid,
    originType,
  };

  const { data: unitsList = [], isLoading: isLoadingUnits } = useQuery({
    queryKey: ['units'],
    queryFn: () => getUnits({ pageIndex: 0, pageSize: 999 }),
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['funnel-leads', filters],
    queryFn: () => getFunnelLeads(filters),
  });

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedCatcher(null);
    setFunnelType(undefined);
    setUnitUuid(undefined);
    setOriginType(undefined);
  };

  const handleStageClick = (stage: LeadFunnelStages, label: string) => {
    setSelectedStage(stage);
    setSelectedStageLabel(label);
    setIsModalOpen(true);
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar dados" />;
  if (!data) return null;

  return (
    <>
      <CatcherListModal
        maxSelection={1}
        open={showCatcherModal}
        onClose={() => setShowCatcherModal(false)}
        onConfirm={(selectedItem) => {
          if (selectedItem.length > 0) {
            setSelectedCatcher(selectedItem[0]);
          } else {
            setSelectedCatcher(null);
          }
          setShowCatcherModal(false);
        }}
      />

      {selectedStage && isModalOpen && (
        <LeadsTableModal open onClose={() => setIsModalOpen(false)} funnelStep={selectedStage} stageLabel={selectedStageLabel} />
      )}

      <div
        className={showFilters && hasFeature(user?.userInfo.profile.permissions, '1206') ? 'grid md:grid-cols-2 gap-4' : 'flex'}
      >
        <Card className="flex-1 order-2 md:order-1">
          <CardContent className="overflow-hidden">
            <FunnelChart data={data} onStageClick={handleStageClick} />
          </CardContent>
        </Card>

        {showFilters && hasFeature(user?.userInfo.profile.permissions, '1206') && (
          <Card className="order-1 md:order-2">
            <CardHeader className="px-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filtros do Funil</h3>

                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Limpar Filtros
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate || undefined} onSelect={(date) => setStartDate(date || null)} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate || undefined} onSelect={(date) => setEndDate(date || null)} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <TypographyMuted>Corretor</TypographyMuted>
                <Button
                  variant="outline"
                  type="button"
                  className={cn('w-full justify-start text-left font-normal', !selectedCatcher && 'text-muted-foreground')}
                  onClick={() => setShowCatcherModal(true)}
                >
                  <User className="mr-2 h-4 w-4" />
                  {selectedCatcher ? selectedCatcher.name : 'Selecionar Corretor'}
                  {selectedCatcher && (
                    <X
                      className="ml-auto h-4 w-4 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCatcher(null);
                      }}
                    />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="funnel-direction">Funil (Inbound/Outbound)</Label>
                  <Select
                    value={funnelType ?? ''}
                    onValueChange={(value) => setFunnelType((value as FunnelDirection) || undefined)}
                  >
                    <SelectTrigger id="funnel-direction" className="w-full">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(FunnelDirection).map((direction) => (
                        <SelectItem key={direction} value={direction}>
                          {funnelDirectionTypeLabels[direction]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Select
                    value={unitUuid ?? ''}
                    onValueChange={(value) => setUnitUuid(value || undefined)}
                    disabled={isLoadingUnits}
                  >
                    <SelectTrigger id="unit" className="w-full">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitsList.length > 0 ? (
                        unitsList.map((unit: UnitDetail) => (
                          <SelectItem key={unit.uuid} value={unit.uuid}>
                            {unit.socialReason}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="/" disabled>
                          Nenhuma unidade disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin-type">Mídia de origem</Label>
                <Select value={originType ?? ''} onValueChange={(value) => setOriginType((value as LeadOriginType) || undefined)}>
                  <SelectTrigger id="origin-type" className="w-full">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(LeadOriginType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {LeadOriginTypeToLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
