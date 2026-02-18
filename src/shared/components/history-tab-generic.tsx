'use client';
import React, { Dispatch, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PaginationState } from '@tanstack/react-table';
import { Calendar as CalendarIcon, X, Info, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { cn, formatDate, getActionTypeLabel } from '@/shared/lib/utils';
import { AuditEvent, Record } from '@/shared/types';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { CatcherListModal, SelectedItem } from '@/shared/components/modal/catcher-list-modal';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { DataTable } from '@/shared/components/ui/data-table';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Badge } from '@/shared/components/ui/badge';
import { Filter } from '@/shared/components/filters';

const getActionTypeVariant = (actionType: string) => {
  if (actionType.includes('CREATED')) return 'default';
  if (actionType.includes('LIST')) return 'secondary';
  if (actionType.includes('DELETED')) return 'destructive';
  return 'outline';
};

const columns: ColumnDef<AuditEvent>[] = [
  {
    accessorKey: 'occurredAt',
    header: () => (
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        DATA/HORA
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('occurredAt'));
      const formattedDate = formatDate(row.getValue('occurredAt'));
      const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return (
        <div className="flex flex-col">
          <span className="font-medium">{formattedDate}</span>
          <span className="text-sm text-muted-foreground">{formattedTime}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'eventType',
    header: 'TIPO DE AÇÃO',
    cell: ({ row }) => {
      const eventType = row.getValue('eventType') as string;
      return (
        <Badge variant={getActionTypeVariant(eventType)} className="whitespace-nowrap">
          {getActionTypeLabel(eventType)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'action',
    header: 'AÇÃO',
    cell: ({ row }) => <div className="max-w-75">{row.getValue('action')}</div>,
  },
  {
    accessorKey: 'description',
    header: 'DESCRIÇÃO',
    cell: ({ row }) => {
      const description = row.getValue('description') as string | null;
      const eventType = row.original.eventType;

      if (!description) return <div>-</div>;

      if (eventType === 'LEAD_SUMMARY_CREATED') {
        try {
          const data = JSON.parse(description);

          const formatValue = (value: unknown): string => {
            if (Array.isArray(value)) {
              return value.join(', ');
            }
            if (typeof value === 'object' && value !== null) {
              return Object.entries(value)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ');
            }
            return String(value);
          };

          const summary = (
            <div className="space-y-2 text-sm">
              {data.interesse_lead && (
                <div>
                  <strong>Interesse:</strong> {formatValue(data.interesse_lead)}
                </div>
              )}
              {data.caracteristicas_desejadas && (
                <div>
                  <strong>Características:</strong> {formatValue(data.caracteristicas_desejadas)}
                </div>
              )}
              {data.estagio_negociacao && (
                <div>
                  <strong>Estágio:</strong> {data.estagio_negociacao}
                </div>
              )}
              {data.nivel_interesse && (
                <div>
                  <strong>Nível de Interesse:</strong> {formatValue(data.nivel_interesse)}
                </div>
              )}
              {data.sugestao_follow_up && (
                <div>
                  <strong>Sugestão de Follow-up:</strong> {data.sugestao_follow_up}
                </div>
              )}
            </div>
          );

          return (
            <>
              <div className="hidden md:block">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 group cursor-help">
                        <div className="max-w-125 truncate">
                          {data.interesse_lead ? formatValue(data.interesse_lead) : 'Resumo do Lead'}
                        </div>
                        <Info className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-150">{summary}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="md:hidden">
                <div className="text-sm">{summary}</div>
              </div>
            </>
          );
        } catch {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 group cursor-help">
                    <div className="max-w-125 truncate">{description}</div>
                    <Info className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-100">
                  <p className="whitespace-pre-wrap">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 group cursor-help">
                <div className="max-w-125 truncate">{description}</div>
                <Info className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-100">
              <p className="whitespace-pre-wrap">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

interface UserHistoryTabProps {
  availableEvents: { value: string; label: string }[];
  isLoading: boolean;
  currentEventType: string | null;
  setEventType: (eventType: string | null) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  data: Record<AuditEvent> | undefined;
  pagination: PaginationState;
  setPagination: Dispatch<React.SetStateAction<PaginationState>>;
  clearFilters: () => void;
  canChangeEventType?: boolean;
  showCatcherFilter?: boolean;
  selectedCatcher?: SelectedItem | null;
  setSelectedCatcher?: (catcher: SelectedItem | null) => void;
}

export function HistoryTabGeneric({
  availableEvents,
  isLoading,
  currentEventType,
  setEventType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  data,
  pagination,
  setPagination,
  clearFilters,
  canChangeEventType = true,
  showCatcherFilter = false,
  selectedCatcher,
  setSelectedCatcher,
}: UserHistoryTabProps) {
  const [showCatcherModal, setShowCatcherModal] = useState(false);

  const hasActiveFilters = currentEventType || startDate || endDate || selectedCatcher;

  return (
    <>
      <CatcherListModal
        maxSelection={1}
        open={showCatcherModal}
        onClose={() => setShowCatcherModal(false)}
        onConfirm={(selectedItem) => {
          if (setSelectedCatcher) {
            if (selectedItem.length > 0) {
              setSelectedCatcher({ uuid: selectedItem[0].uuid, name: selectedItem[0].name });
            } else {
              setSelectedCatcher(null);
            }
          }
          setShowCatcherModal(false);
        }}
      />

      <div className="space-y-4">
        <Filter>
          <Select
            value={currentEventType || ''}
            onValueChange={(value) => setEventType(value || null)}
            disabled={!canChangeEventType}
          >
            <SelectTrigger className="w-full md:w-70">
              <SelectValue placeholder="Filtrar por tipo de evento" />
            </SelectTrigger>
            <SelectContent>
              {availableEvents.map((event) => (
                <SelectItem key={event.value} value={event.value}>
                  {event.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showCatcherFilter && (
            <Button
              variant="outline"
              className={cn(
                'w-full md:w-60 justify-start text-left font-normal',
                !selectedCatcher && 'text-muted-foreground',
              )}
              onClick={() => setShowCatcherModal(true)}
            >
              <User className="mr-2 h-4 w-4" />
              {selectedCatcher ? selectedCatcher.name : 'Selecionar captador'}
              {selectedCatcher && (
                <X
                  className="ml-auto h-4 w-4 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCatcher?.(null);
                  }}
                />
              )}
            </Button>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full md:w-60 justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Data inicial'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={(date) => setStartDate(date || null)}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full md:w-60 justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Data final'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => setEndDate(date || null)}
                autoFocus
              />
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto">
              <X className="mr-2 h-4 w-4" />
              Limpar filtros
            </Button>
          )}
        </Filter>

        {isLoading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={data?.content || []}
            pagination={pagination}
            setPagination={setPagination}
            pageCount={data?.totalPages || 0}
          />
        )}
      </div>
    </>
  );
}
