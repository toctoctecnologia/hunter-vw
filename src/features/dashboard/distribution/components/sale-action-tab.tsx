'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CirclePlay, MonitorCheck, Users, Calendar as CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import { Record, SaleActionFilters, SaleActionItem } from '@/shared/types';

import { getSaleActionMetrics, getSaleActions } from '@/features/dashboard/distribution/api/sale-action';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { ActionsList } from '@/features/dashboard/distribution/components/actions-list';
import { Card, CardContent } from '@/shared/components/ui/card';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { FilterSearchInput } from '@/shared/components/filters';
import { StatusCard } from '@/shared/components/StatusCard';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';
import { NoContentCard } from '@/shared/components/no-content-card';

export function SaleActionTab() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDateFrom, setStartDateFrom] = useState<Date | undefined>();
  const [startDateTo, setStartDateTo] = useState<Date | undefined>();
  const [filters, setFilters] = useState<SaleActionFilters>({});
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, filters]);

  const { data: actionsData = { content: [] }, isLoading } = useQuery({
    queryKey: ['sale-actions', currentPage, filters, searchTerm],
    queryFn: () => getSaleActions({ pageIndex: currentPage, pageSize: 10 }, filters, searchTerm),
  });

  const { data: metricsData } = useQuery({
    queryKey: ['sale-action-metrics'],
    queryFn: getSaleActionMetrics,
  });

  const handleInProgressFilter = (value: string) => {
    setFilters((prev) => ({ ...prev, inProgress: value === 'true' }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDateFrom(undefined);
    setStartDateTo(undefined);
    setFilters({});
  };

  const handleStartDateFromChange = (date: Date | undefined) => {
    setStartDateFrom(date);
    setFilters((prev) => ({ ...prev, startDateFrom: date ? format(date, 'yyyy-MM-dd') : undefined }));
  };

  const handleStartDateToChange = (date: Date | undefined) => {
    setStartDateTo(date);
    setFilters((prev) => ({ ...prev, startDateTo: date ? format(date, 'yyyy-MM-dd') : undefined }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = (actionsData as Record<SaleActionItem>).totalPages || 0;

  return (
    <>
      {hasFeature(user?.userInfo.profile.permissions, '2170') ? (
        <div className="space-y-4">
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <TypographyMuted>Busca</TypographyMuted>
                  <FilterSearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou descrição"
                    showFilterButton={false}
                  />
                </div>

                <div className="space-y-2">
                  <TypographyMuted>Status</TypographyMuted>
                  <Select value={filters.inProgress?.toString() || ''} onValueChange={handleInProgressFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Em andamento</SelectItem>
                      <SelectItem value="false">Finalizados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <TypographyMuted>Data início de</TypographyMuted>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDateFrom ? format(startDateFrom, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione a data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDateFrom} onSelect={handleStartDateFromChange} locale={ptBR} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <TypographyMuted>Data início até</TypographyMuted>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDateTo ? format(startDateTo, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione a data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDateTo} onSelect={handleStartDateToChange} locale={ptBR} />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button onClick={handleClearFilters} className="md:mt-5.5">
                  Limpar filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {hasFeature(user?.userInfo.profile.permissions, '2171') && (
            <div className="grid md:grid-cols-2 gap-4">
              <StatusCard
                title="Ações de vendas monitoradas"
                description="Total configurado no período"
                icon={MonitorCheck}
                value={String(metricsData?.queuesAmount || 0)}
              />

              <StatusCard
                title="Ações de vendas em andamento"
                description="Ações de vendas ativas"
                icon={CirclePlay}
                value={String(metricsData?.queueExecutionsInProgress || 0)}
              />

              <StatusCard
                title="Participantes engajados em vendas"
                description="Usuários ativos hoje nas ações de vendas"
                icon={Users}
                value={String(metricsData?.engagedParticipants || 0)}
              />

              <StatusCard
                title="Notificações pendentes de vendas"
                description="Mensagens aguardando envio das ações de vendas"
                icon={AlertTriangle}
                value={String(metricsData?.offersPending || 0)}
              />
            </div>
          )}

          <ActionsList actionsData={actionsData as Record<SaleActionItem>} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                      className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 10) {
                      page = i;
                    } else if (currentPage < 3) {
                      page = i;
                    } else if (currentPage > totalPages - 3) {
                      page = totalPages - 10 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                      className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      ) : (
        <NoContentCard />
      )}
    </>
  );
}
