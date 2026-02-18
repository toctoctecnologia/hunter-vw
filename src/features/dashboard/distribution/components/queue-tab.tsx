'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';

import { hasFeature } from '@/shared/lib/permissions';
import { useAuth } from '@/shared/hooks/use-auth';

import { changeActiveQueue, changeQueueOrder, deleteQueue, getQueues } from '@/features/dashboard/distribution/api/queue';

import { QueueFilters } from '@/shared/types';

import { SortableQueueCard } from '@/features/dashboard/distribution/components/sortable-queue-card';
import { NoContentCard } from '@/shared/components/no-content-card';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';

interface QueueTabProps {
  filters: QueueFilters;
  searchTerm: string;
}

export function QueueTab({ filters, searchTerm }: QueueTabProps) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [queueToDelete, setQueueToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: queues = [], isLoading: isLoadingQueues } = useQuery({
    queryKey: ['queues', filters, searchTerm],
    queryFn: () => getQueues(filters, searchTerm),
  });

  const sortedQueues = [...queues].sort((a, b) => a.queueOrder - b.queueOrder);

  const changeOrderMutation = useMutation({
    mutationFn: ({ queueId, newOrder }: { queueId: string; newOrder: number }) => changeQueueOrder(queueId, newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      toast.success('Ordem da fila atualizada com sucesso');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ queueId, isActive }: { queueId: string; isActive: boolean }) => changeActiveQueue(queueId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      toast.success('Status da fila atualizado com sucesso');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (queueId: string) => deleteQueue(queueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      toast.success('Fila excluída com sucesso');
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!hasFeature(user?.userInfo.profile.permissions, '1601')) return;
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedQueues.findIndex((item) => item.uuid === active.id);
      const newIndex = sortedQueues.findIndex((item) => item.uuid === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const targetOrder = sortedQueues[newIndex].queueOrder;
        changeOrderMutation.mutate({
          queueId: active.id as string,
          newOrder: targetOrder,
        });
      }
    }
  };

  const handleToggleActive = (id: string) => {
    const queue = sortedQueues.find((q) => q.uuid === id);
    if (queue) {
      toggleActiveMutation.mutate({
        queueId: id,
        isActive: !queue.isActive,
      });
    }
  };

  const handleDelete = (id: string) => {
    const queue = sortedQueues.find((q) => q.uuid === id);
    if (queue) {
      setQueueToDelete({ id, name: queue.name });
      setIsAlertOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (queueToDelete) {
      deleteMutation.mutate(queueToDelete.id);
      setIsAlertOpen(false);
      setQueueToDelete(null);
    }
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
    setQueueToDelete(null);
  };

  return (
    <>
      <AlertModal
        isOpen={isAlertOpen}
        onClose={handleCloseAlert}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        title="Excluir fila"
        description={`Tem certeza que deseja excluir a fila "${queueToDelete?.name}"? Essa ação não poderá ser desfeita.`}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Filas de Distribuição</h2>
            <p className="text-sm text-muted-foreground">Gerencie as regras de distribuição automática de leads</p>
          </div>

          {hasFeature(user?.userInfo.profile.permissions, '1601') && (
            <Button onClick={() => router.push('/dashboard/distribution/queue/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar fila
            </Button>
          )}
        </div>

        {isLoadingQueues ? (
          <Loading />
        ) : (
          <>
            {queues.length === 0 ? (
              <NoContentCard title="Nenhuma fila cadastrada" />
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortedQueues.map((q) => q.uuid)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {sortedQueues.map((queue) => (
                      <SortableQueueCard
                        key={queue.uuid}
                        queue={queue}
                        position={queue.queueOrder}
                        onToggleActive={handleToggleActive}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </>
        )}
      </div>
    </>
  );
}
