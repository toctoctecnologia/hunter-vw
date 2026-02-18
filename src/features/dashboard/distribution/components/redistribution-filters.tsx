'use client';

import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { CalendarIcon, User, X } from 'lucide-react';
import { useState } from 'react';

import { LeadOriginType, RedistributionFilters, ArchiveReason, QueueItem } from '@/shared/types';
import { cn, LeadOriginTypeToLabel } from '@/shared/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CatcherListModal } from '@/shared/components/modal/catcher-list-modal';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';

interface RedistributionFiltersProps {
  filters: RedistributionFilters;
  onFilterChange: (key: keyof RedistributionFilters, value: any) => void;
  onClearFilters: () => void;
  queues: QueueItem[];
  archiveReasons: ArchiveReason[];
  isLoadingQueues?: boolean;
  isLoadingArchiveReasons?: boolean;
}

export function RedistributionFiltersComponent({
  filters,
  onFilterChange,
  onClearFilters,
  queues,
  archiveReasons,
  isLoadingQueues,
  isLoadingArchiveReasons,
}: RedistributionFiltersProps) {
  const [showCatcherModal, setShowCatcherModal] = useState(false);

  return (
    <>
      <CatcherListModal
        maxSelection={1}
        open={showCatcherModal}
        onClose={() => setShowCatcherModal(false)}
        onConfirm={(selectedItem) => {
          if (selectedItem.length > 0) {
            onFilterChange('selectedCatcher', selectedItem[0]);
          } else {
            onFilterChange('selectedCatcher', null);
          }
          setShowCatcherModal(false);
        }}
      />

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <TypographyMuted>Responsável</TypographyMuted>
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
                {filters.selectedCatcher ? filters.selectedCatcher.name : 'Selecionar Responsável'}
                {filters.selectedCatcher && (
                  <X
                    className="ml-auto h-4 w-4 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterChange('selectedCatcher', null);
                    }}
                  />
                )}
              </Button>
            </div>

            {/* Fila */}
            <div className="space-y-2">
              <TypographyMuted>Fila</TypographyMuted>
              <Select
                value={filters.queueUuid || ''}
                onValueChange={(value) => onFilterChange('queueUuid', value || undefined)}
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

            {/* Motivo de Arquivamento */}
            <div className="space-y-2">
              <TypographyMuted>Motivo de arquivamento</TypographyMuted>
              <Select
                value={filters.reasonUuid || ''}
                onValueChange={(value) => onFilterChange('reasonUuid', value || undefined)}
                disabled={isLoadingArchiveReasons}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  {archiveReasons.map((reason) => (
                    <SelectItem key={reason.uuid} value={reason.uuid}>
                      {reason.reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Origem */}
            <div className="space-y-2">
              <TypographyMuted>Origem</TypographyMuted>
              <Select
                value={filters.originType || ''}
                onValueChange={(value) => onFilterChange('originType', value || undefined)}
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

            {/* Data início (criação) */}
            <div className="space-y-2">
              <TypographyMuted>Data início (criação)</TypographyMuted>
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
                    onSelect={(date) => onFilterChange('startDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data fim (criação) */}
            <div className="space-y-2">
              <TypographyMuted>Data fim (criação)</TypographyMuted>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !filters.endDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {filters.endDate
                      ? format(new Date(filters.endDate), 'dd/MM/yyyy', { locale: ptBR })
                      : 'Selecione a data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.endDate ? new Date(filters.endDate) : undefined}
                    onSelect={(date) => onFilterChange('endDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data início (arquivamento) */}
            <div className="space-y-2">
              <TypographyMuted>Data início (arquivamento)</TypographyMuted>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !filters.archivedStartDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {filters.archivedStartDate
                      ? format(new Date(filters.archivedStartDate), 'dd/MM/yyyy', { locale: ptBR })
                      : 'Selecione a data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.archivedStartDate ? new Date(filters.archivedStartDate) : undefined}
                    onSelect={(date) =>
                      onFilterChange('archivedStartDate', date ? format(date, 'yyyy-MM-dd') : undefined)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data fim (arquivamento) */}
            <div className="space-y-2">
              <TypographyMuted>Data fim (arquivamento)</TypographyMuted>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !filters.archivedEndDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {filters.archivedEndDate
                      ? format(new Date(filters.archivedEndDate), 'dd/MM/yyyy', { locale: ptBR })
                      : 'Selecione a data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.archivedEndDate ? new Date(filters.archivedEndDate) : undefined}
                    onSelect={(date) =>
                      onFilterChange('archivedEndDate', date ? format(date, 'yyyy-MM-dd') : undefined)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Limpar filtros */}
            <div className="space-y-2 flex items-end">
              <Button onClick={onClearFilters} className="w-full">
                Limpar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
