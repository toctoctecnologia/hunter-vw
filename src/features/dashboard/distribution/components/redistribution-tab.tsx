'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Upload, Info } from 'lucide-react';
import { toast } from 'sonner';

import { RedistributionFilters, RedistributionItem, RedistributionBatchJobItemStatus } from '@/shared/types';
import { redistributionBatchStatusLabel } from '@/shared/lib/utils';

import { redistribute, getBatchJobs } from '@/features/dashboard/distribution/api/redistribution';
import { getArchiveReasons } from '@/features/dashboard/manage-leads/api/archive-reason';
import { getQueues } from '@/features/dashboard/distribution/api/queue';

import { RedistributionClient } from '@/features/dashboard/distribution/components/tables/redistribution-table/client';
import { RedistributionFiltersComponent } from '@/features/dashboard/distribution/components/redistribution-filters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { BatchUploadModal } from '@/features/dashboard/distribution/components/modal/batch-upload-modal';
import { TypographyMuted, TypographyH3 } from '@/shared/components/ui/typography';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

export function RedistributionTab() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<RedistributionFilters>({});
  const [selectedArchivedLeads, setSelectedArchivedLeads] = useState<RedistributionItem[]>([]);
  const [selectedQueueUuid, setSelectedQueueUuid] = useState('');
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  const { data: queues = [], isLoading: isLoadingQueues } = useQuery({
    queryKey: ['redistribution-queues'],
    queryFn: () => getQueues({ isActive: '' }, ''),
  });

  const { data: archiveReasonsData = [], isLoading: isLoadingArchiveReasons } = useQuery({
    queryKey: ['archiveReasons', { pageIndex: 0, pageSize: 100 }],
    queryFn: () => getArchiveReasons({ pageIndex: 0, pageSize: 100 }),
  });

  const { data: batchJobsData } = useQuery({
    queryKey: ['redistribution-batch-jobs'],
    queryFn: () => getBatchJobs(),
    refetchInterval: 10000,
  });

  const redistributeMutation = useMutation({
    mutationFn: (params: { leadUuids: string[]; queueUuid?: string }) =>
      redistribute(params.leadUuids, params.queueUuid),
    onSuccess: () => {
      toast.success('Redistribuição iniciada');
      setSelectedArchivedLeads([]);
      queryClient.invalidateQueries({ queryKey: ['redistribution-archived'] });
    },
  });

  const handleFilterChange = (key: keyof RedistributionFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRedistribute = () => {
    if (selectedArchivedLeads.length === 0) {
      toast.error('Nenhum lead selecionado');
      return;
    }

    const leadUuids = selectedArchivedLeads.map((lead) => lead.uuid);
    redistributeMutation.mutate({
      leadUuids,
      queueUuid: !selectedQueueUuid || selectedQueueUuid === 'x' ? undefined : selectedQueueUuid,
    });
  };

  const lastJob = batchJobsData?.content?.[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBatchModalOpen(true)}>
            <Upload className="size-4" />
            Adicionar lote
          </Button>
        </div>
      </div>

      <BatchUploadModal open={batchModalOpen} onOpenChange={setBatchModalOpen} />

      <RedistributionFiltersComponent
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={() => setFilters({})}
        queues={queues}
        archiveReasons={archiveReasonsData}
        isLoadingQueues={isLoadingQueues}
        isLoadingArchiveReasons={isLoadingArchiveReasons}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <RedistributionClient filters={filters} onChangeSelectedRows={setSelectedArchivedLeads} />
        </div>

        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <TypographyH3>Resumo do destino</TypographyH3>
              <Badge variant="secondary" className="text-sm">
                {selectedQueueUuid
                  ? queues.find((q) => q.uuid === selectedQueueUuid)?.name || 'Fila Específica'
                  : 'Distribuição Automática'}
              </Badge>
            </div>

            <div className="space-y-2">
              <TypographyMuted>Fila de destino (opcional)</TypographyMuted>
              <Select
                value={selectedQueueUuid}
                onValueChange={setSelectedQueueUuid}
                disabled={isLoadingQueues || redistributeMutation.isPending}
                defaultValue="x"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Distribuição automática (padrão)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x">Distribuição automática</SelectItem>
                  {queues.map((queue) => (
                    <SelectItem key={queue.uuid} value={queue.uuid}>
                      {queue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedQueueUuid && selectedQueueUuid !== 'x' && (
              <Alert>
                <Info className="size-4" />
                <AlertDescription>
                  Os leads serão atribuídos diretamente à fila selecionada, sem passar pelo motor de distribuição.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between items-start">
                <TypographyMuted className="text-xs">Redistribuição para fila</TypographyMuted>
              </div>

              <div className="flex justify-between items-center">
                <TypographyMuted className="text-xs">Leads selecionados</TypographyMuted>
                <span className="text-sm font-medium">{selectedArchivedLeads.length}</span>
              </div>
            </div>

            {lastJob && (
              <div className="space-y-3 border-t pt-4">
                <TypographyMuted className="text-xs font-semibold">Último job</TypographyMuted>

                <div className="flex justify-between items-center">
                  <TypographyMuted className="text-xs">Status</TypographyMuted>
                  <Badge
                    variant={
                      lastJob.status === RedistributionBatchJobItemStatus.COMPLETED
                        ? 'default'
                        : lastJob.status === RedistributionBatchJobItemStatus.FAILED
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {redistributionBatchStatusLabel[lastJob.status]}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <TypographyMuted className="text-xs">Arquivo</TypographyMuted>
                  <span className="text-sm font-medium truncate max-w-[160px]" title={lastJob.fileName}>
                    {lastJob.fileName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <TypographyMuted className="text-xs">Criado em</TypographyMuted>
                  <span className="text-sm font-medium">{format(new Date(lastJob.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                </div>

                {lastJob.startedAt && (
                  <div className="flex justify-between items-center">
                    <TypographyMuted className="text-xs">Iniciado em</TypographyMuted>
                    <span className="text-sm font-medium">
                      {format(new Date(lastJob.startedAt), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                )}

                {lastJob.finishedAt && (
                  <div className="flex justify-between items-center">
                    <TypographyMuted className="text-xs">Finalizado em</TypographyMuted>
                    <span className="text-sm font-medium">
                      {format(new Date(lastJob.finishedAt), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                )}

                {lastJob.errorMessage && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-xs">{lastJob.errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <Button
              className="w-full"
              variant="outline"
              onClick={handleRedistribute}
              disabled={selectedArchivedLeads.length === 0 || redistributeMutation.isPending}
              isLoading={redistributeMutation.isPending}
            >
              Redistribuir leads
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
