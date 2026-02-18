'use client';
import React, { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, User, X } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import { CaptationFilters, CaptationStatus, LeadOriginType, QueueFilters } from '@/shared/types';
import { captationStatusLabels, LeadOriginTypeToLabel, cn } from '@/shared/lib/utils';

import { getCaptations } from '@/features/dashboard/distribution/api/captation';
import { getQueues } from '@/features/dashboard/distribution/api/queue';
import { getTeams } from '@/features/dashboard/properties/api/teams';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { columns } from '@/features/dashboard/distribution/components/tables/captation-table/columns';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { CatcherListModal } from '@/shared/components/modal/catcher-list-modal';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Card, CardContent } from '@/shared/components/ui/card';
import { DataTable } from '@/shared/components/ui/data-table';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';
import { NoContentCard } from '@/shared/components/no-content-card';

interface CaptationClientProps {
  queueFilters: QueueFilters;
  queueSearchTerm: string;
}

export function CaptationClient({ queueFilters, queueSearchTerm }: CaptationClientProps) {
  const { user } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [showCatcherModal, setShowCatcherModal] = useState(false);
  const [filters, setFilters] = useState<CaptationFilters>({});

  const handleFilterChange = (key: keyof CaptationFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const { data: teamsData = { content: [] }, isLoading: isLoadingTeams } = useQuery({
    queryKey: ['captation-list-teams'],
    queryFn: () => getTeams({ pageIndex: 0, pageSize: 999 }),
  });

  const { data: queues = [], isLoading: isLoadingQueues } = useQuery({
    queryKey: ['captation-queues', queueFilters, queueSearchTerm],
    queryFn: () => getQueues(queueFilters, queueSearchTerm),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['captations', pagination, filters],
    queryFn: () => getCaptations(pagination, filters),
  });

  return (
    <>
      <CatcherListModal
        maxSelection={1}
        open={showCatcherModal}
        onClose={() => setShowCatcherModal(false)}
        onConfirm={(selectedItem) => {
          if (selectedItem.length > 0) {
            handleFilterChange('selectedCatcher', selectedItem[0]);
          } else {
            handleFilterChange('selectedCatcher', null);
          }
          setShowCatcherModal(false);
        }}
      />

      {hasFeature(user?.userInfo.profile.permissions, '2160') ? (
        <div className="space-y-4">
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <TypographyMuted>Status</TypographyMuted>
                  <Select
                    value={filters.status || ''}
                    onValueChange={(value) => handleFilterChange('status', value as CaptationStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CaptationStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {captationStatusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <TypographyMuted>Origem</TypographyMuted>
                  <Select
                    value={filters.origin || ''}
                    onValueChange={(value) => handleFilterChange('origin', value as LeadOriginType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(LeadOriginType).map((origin) => (
                        <SelectItem key={origin} value={origin}>
                          {LeadOriginTypeToLabel(origin)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <TypographyMuted>Equipe</TypographyMuted>
                  <Select
                    value={filters.teamUuid || ''}
                    onValueChange={(value) => handleFilterChange('teamUuid', value)}
                    disabled={isLoadingTeams}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a equipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamsData.content.map((team) => (
                        <SelectItem key={team.uuid} value={team.uuid}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <TypographyMuted>Captador</TypographyMuted>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !filters.selectedCatcher && 'text-muted-foreground',
                    )}
                    onClick={() => setShowCatcherModal(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {filters.selectedCatcher ? filters.selectedCatcher.name : 'Selecionar Captador'}
                    {filters.selectedCatcher && (
                      <X
                        className="ml-auto h-4 w-4 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange('selectedCatcher', null);
                        }}
                      />
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <TypographyMuted>Fila de distribuição</TypographyMuted>
                  <Select
                    value={filters.queueUuid || ''}
                    onValueChange={(value) => handleFilterChange('queueUuid', value)}
                    disabled={isLoadingQueues}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a fila" />
                    </SelectTrigger>
                    <SelectContent>
                      {queues.map((queue) => (
                        <SelectItem key={queue.uuid} value={queue.uuid}>
                          {queue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <TypographyMuted>Data início</TypographyMuted>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !filters.startDate && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                        {filters.startDate
                          ? format(new Date(filters.startDate), 'dd/MM/yyyy', { locale: ptBR })
                          : 'Selecione a data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.startDate ? new Date(filters.startDate) : undefined}
                        onSelect={(date) => handleFilterChange('startDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <TypographyMuted>Data fim</TypographyMuted>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn('w-full justify-start text-left font-normal', !filters.endDate && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="h-4 w-4" />
                        {filters.endDate ? format(new Date(filters.endDate), 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione a data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.endDate ? new Date(filters.endDate) : undefined}
                        onSelect={(date) => handleFilterChange('endDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button className="mt-5.5" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              {data && (
                <DataTable
                  pagination={pagination}
                  setPagination={setPagination}
                  pageCount={data.totalPages}
                  columns={columns}
                  data={data.content}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <NoContentCard />
      )}
    </>
  );
}
