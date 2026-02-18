'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { LeadDetail, LeadFunnelStages, KanbanColumn as KanbanColumnType, NegotiationFilters } from '@/shared/types';
import { leadFunnelStepToLabel } from '@/shared/lib/utils';
import { useIsMobile } from '@/shared/hooks/use-mobile';

import { getLeads, updateLeadFunnelStep } from '@/features/dashboard/sales/api/lead';

import { KanbanLeadCard } from '@/features/dashboard/sales/components/kanban-lead-card';
import { KanbanColumn } from '@/features/dashboard/sales/components/kanban-column';
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area';
import { useSidebar } from '@/shared/components/ui/sidebar';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const CUSTOM_COLUMNS_KEY = 'kanban-custom-columns';
const CUSTOM_COLUMNS_LEADS_KEY = 'kanban-custom-columns-leads';

interface CustomColumnData {
  id: string;
  title: string;
}

interface CustomColumnsLeads {
  [columnId: string]: string[];
}

interface KanbanBoardProps {
  filters: NegotiationFilters | null;
  searchTerm: string;
}

export function KanbanBoard({ filters, searchTerm }: KanbanBoardProps) {
  const { open } = useSidebar();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [customColumns, setCustomColumns] = useState<CustomColumnData[]>([]);
  const [customColumnsLeads, setCustomColumnsLeads] = useState<CustomColumnsLeads>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const maxWidth = isMobile ? '100%' : open ? 'calc(100vw - 19.8rem)' : 'calc(100vw - 6.5rem)';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['leads', filters, searchTerm],
    queryFn: () => getLeads({ filters, searchTerm, pagination: { pageIndex: 0, pageSize: 999 } }),
  });

  useEffect(() => {
    const savedColumns = localStorage.getItem(CUSTOM_COLUMNS_KEY);
    const savedLeads = localStorage.getItem(CUSTOM_COLUMNS_LEADS_KEY);

    if (savedColumns) {
      try {
        setCustomColumns(JSON.parse(savedColumns));
      } catch (error) {
        console.error('Erro ao carregar colunas customizadas:', error);
      }
    }

    if (savedLeads) {
      try {
        setCustomColumnsLeads(JSON.parse(savedLeads));
      } catch (error) {
        console.error('Erro ao carregar leads das colunas customizadas:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (customColumns.length > 0) {
      localStorage.setItem(CUSTOM_COLUMNS_KEY, JSON.stringify(customColumns));
    }
  }, [customColumns]);

  useEffect(() => {
    if (Object.keys(customColumnsLeads).length > 0) {
      localStorage.setItem(CUSTOM_COLUMNS_LEADS_KEY, JSON.stringify(customColumnsLeads));
    }
  }, [customColumnsLeads]);

  const updateFunnelMutation = useMutation({
    mutationFn: ({ leadUuid, newStage }: { leadUuid: string; newStage: LeadFunnelStages }) =>
      updateLeadFunnelStep(leadUuid, newStage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const columns = useMemo<KanbanColumnType[]>(() => {
    if (!data?.content) return [];

    const leadsInCustomColumns = new Set<string>();
    Object.values(customColumnsLeads).forEach((leadUuids) => {
      leadUuids.forEach((uuid) => leadsInCustomColumns.add(uuid));
    });

    const columnMap = new Map<string, KanbanColumnType>();

    Object.values(LeadFunnelStages).forEach((stage) => {
      columnMap.set(stage, {
        id: stage,
        title: leadFunnelStepToLabel(stage),
        leads: [],
        isCustom: false,
      });
    });

    data.content.forEach((lead: LeadDetail) => {
      if (leadsInCustomColumns.has(lead.uuid)) {
        return;
      }

      const column = columnMap.get(lead.funnelStep);
      if (column) {
        column.leads.push(lead);
      }
    });

    const standardColumns = Array.from(columnMap.values());
    const customCols: KanbanColumnType[] = customColumns.map((customCol) => {
      const leadUuids = customColumnsLeads[customCol.id] || [];
      const leads = data.content.filter((lead: LeadDetail) => leadUuids.includes(lead.uuid));

      return {
        id: customCol.id,
        title: customCol.title,
        leads,
        isCustom: true,
      };
    });

    return [...standardColumns, ...customCols];
  }, [data?.content, customColumns, customColumnsLeads]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const leadUuid = active.id as string;
    const newColumnId = over.id as string;

    // Encontra o lead que está sendo arrastado
    const sourceLead = columns.flatMap((col) => col.leads).find((lead) => lead.uuid === leadUuid);
    if (!sourceLead) return;

    // Encontra a coluna de origem
    const sourceColumn = columns.find((col) => col.leads.some((lead) => lead.uuid === leadUuid));
    if (!sourceColumn) return;

    // Verifica se o destino é uma coluna válida
    let targetColumn = columns.find((col) => col.id === newColumnId);

    if (!targetColumn) {
      // Se não for uma coluna, tenta encontrar a coluna pelo lead
      const targetLead = columns.flatMap((col) => col.leads).find((lead) => lead.uuid === newColumnId);
      if (!targetLead) return;

      targetColumn = columns.find((col) => col.leads.some((lead) => lead.uuid === targetLead.uuid));
      if (!targetColumn) return;
    }

    // Se está movendo dentro da mesma coluna, não faz nada
    if (sourceColumn.id === targetColumn.id) return;

    // Se a coluna de destino é customizada
    if (targetColumn.isCustom) {
      // Remove o lead da coluna customizada de origem (se houver)
      if (sourceColumn.isCustom) {
        setCustomColumnsLeads((prev) => {
          const updated = { ...prev };
          updated[sourceColumn.id] = (updated[sourceColumn.id] || []).filter((uuid) => uuid !== leadUuid);
          return updated;
        });
      }

      // Adiciona à coluna customizada de destino
      setCustomColumnsLeads((prev) => {
        const updated = { ...prev };
        if (!updated[targetColumn.id]) {
          updated[targetColumn.id] = [];
        }
        if (!updated[targetColumn.id].includes(leadUuid)) {
          updated[targetColumn.id] = [...updated[targetColumn.id], leadUuid];
        }
        return updated;
      });
      return;
    }

    // Se a coluna de origem é customizada e o destino não é
    if (sourceColumn.isCustom && !targetColumn.isCustom) {
      // Remove da coluna customizada
      setCustomColumnsLeads((prev) => {
        const updated = { ...prev };
        updated[sourceColumn.id] = (updated[sourceColumn.id] || []).filter((uuid) => uuid !== leadUuid);
        return updated;
      });

      // Atualiza o funnel step no backend
      updateFunnelMutation.mutate({
        leadUuid,
        newStage: targetColumn.id as LeadFunnelStages,
      });
      return;
    }

    // Ambas são colunas padrão - atualiza o funnel step
    updateFunnelMutation.mutate({
      leadUuid,
      newStage: targetColumn.id as LeadFunnelStages,
    });
  };

  const activeLead = useMemo(() => {
    if (!activeId) return null;
    return columns.flatMap((col) => col.leads).find((lead) => lead.uuid === activeId) || null;
  }, [activeId, columns]);

  const handleCreateColumn = () => {
    if (!newColumnName.trim()) return;

    const newColumn: CustomColumnData = {
      id: `custom-${Date.now()}`,
      title: newColumnName.trim(),
    };

    setCustomColumns((prev) => [...prev, newColumn]);
    setCustomColumnsLeads((prev) => ({ ...prev, [newColumn.id]: [] }));
    setNewColumnName('');
    setIsDialogOpen(false);
  };

  useEffect(() => {
    console.log({ activeLead, columns, activeId });
  }, [activeId, activeLead, columns]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar leads" />;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Coluna
        </Button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md" style={{ maxWidth }}>
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <SortableContext items={columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  onDelete={
                    column.isCustom
                      ? () => {
                          setCustomColumns((prev) => prev.filter((col) => col.id !== column.id));
                          setCustomColumnsLeads((prev) => {
                            const updated = { ...prev };
                            delete updated[column.id];
                            return updated;
                          });
                        }
                      : undefined
                  }
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>{!!activeLead ? <KanbanLeadCard leadDetail={activeLead} isDragging /> : null}</DragOverlay>
        </DndContext>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Coluna de Organização</DialogTitle>
            <DialogDescription>
              Crie uma coluna customizada para organizar seus leads. Esta coluna ficará salva apenas localmente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="column-name">Nome da Coluna</Label>
              <Input
                id="column-name"
                placeholder="Ex: Em Análise"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateColumn();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateColumn} disabled={!newColumnName.trim()}>
              Criar Coluna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
