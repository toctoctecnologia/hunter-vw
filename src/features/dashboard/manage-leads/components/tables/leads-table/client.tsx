'use client';
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import { ArrowRightLeft, User2 } from 'lucide-react';

import { getLeads } from '@/features/dashboard/sales/api/lead';

import { NoContentCard } from '@/shared/components/no-content-card';
import { DataTable } from '@/shared/components/ui/data-table';
import { Loading } from '@/shared/components/loading';
import { Button } from '@/shared/components/ui/button';

import { TransferLeadsModal } from '@/features/dashboard/manage-leads/components/modal/transfer-leads-modal';
import { columns } from '@/features/dashboard/manage-leads/components/tables/leads-table/columns';

export function LeadsClient() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['leads', pagination],
    queryFn: () => getLeads({ filters: { afterDistribution: false }, pagination }),
  });

  const selectedItems = useMemo(() => {
    if (!data || data.content.length <= 0) return [];

    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((index) => data.content[Number(index)])
      .filter(Boolean);
  }, [data, rowSelection]);

  const handleRemoveLeadFromSelection = (leadUuid: string) => {
    if (!data) return;

    const leadIndex = data.content.findIndex((lead) => lead.uuid === leadUuid);
    if (leadIndex !== -1) {
      setRowSelection((prev) => {
        const newSelection = { ...prev };
        delete newSelection[String(leadIndex)];
        return newSelection;
      });
    }
  };

  const handleTransferSuccess = () => {
    setRowSelection({});
    setIsTransferModalOpen(false);
  };

  if (!data?.content.length) return <NoContentCard title="Nenhum lead encontrado" icon={User2} />;

  return (
    <>
      <TransferLeadsModal
        open={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onLeadRemove={handleRemoveLeadFromSelection}
        onSuccess={handleTransferSuccess}
        leads={selectedItems}
      />

      <div className="space-y-4">
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
            <span className="text-sm text-muted-foreground">{selectedItems.length} lead(s) selecionado(s)</span>
            <Button size="sm" onClick={() => setIsTransferModalOpen(true)}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Transferir Leads
            </Button>
          </div>
        )}

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
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
