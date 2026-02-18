import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCadenciasStore } from '@/state/distribuicao/cadencias.store';
import type { Cadencia, CadenciaFiltro, CadenciaStatus } from '@/types/cadencia';
import {
  Clock3,
  Copy,
  GripVertical,
  Layers,
  PenLine,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { SortableItem } from './SortableItem';

interface CadenciaTabProps {
  searchValue?: string;
  filters?: CadenciaFiltro;
}

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 9);

export default function CadenciaTab({ searchValue = '', filters }: CadenciaTabProps) {
  const navigate = useNavigate();
  const {
    cadencias,
    carregarCadencias,
    atualizarCadencia,
    criarCadencia,
    duplicarCadencia,
    excluirCadencia,
    reordenar,
    salvarOrdem,
  } = useCadenciasStore();
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        await carregarCadencias();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [carregarCadencias]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredCadencias = useMemo(() => {
    const query = searchValue.toLowerCase();
    return cadencias.filter((cadencia) => {
      const matchesSearch =
        !query ||
        cadencia.nome.toLowerCase().includes(query) ||
        cadencia.descricao.toLowerCase().includes(query) ||
        cadencia.evento.toLowerCase().includes(query) ||
        cadencia.canais.some((canal) => canal.toLowerCase().includes(query)) ||
        cadencia.regrasTabela.some((regra) => regra.titulo.toLowerCase().includes(query));

      const matchesStatus =
        !filters?.status ||
        (filters.status === 'ativa' && cadencia.status === 'ativa') ||
        (filters.status === 'pausada' && cadencia.status === 'pausada');

      const matchesGatilho = !filters?.gatilho || cadencia.gatilho.tipo === filters.gatilho;
      const matchesResponsavel =
        !filters?.responsavel ||
        cadencia.responsavel.nome.toLowerCase().includes(filters.responsavel.toLowerCase());
      const matchesCanal =
        !filters?.canal ||
        cadencia.canais.some((canal) => canal.toLowerCase().includes(filters.canal.toLowerCase()));
      const matchesSla =
        !filters?.sla || cadencia.sla?.toLowerCase().includes(filters.sla.toLowerCase());

      return matchesSearch && matchesStatus && matchesGatilho && matchesResponsavel && matchesCanal && matchesSla;
    });
  }, [cadencias, filters, searchValue]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cadencias.findIndex((item) => item.id === active.id);
    const newIndex = cadencias.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(cadencias, oldIndex, newIndex).map((cadencia, index) => ({
      ...cadencia,
      prioridade: index + 1,
    }));

    reordenar(reordered);
    setSavingOrder(true);
    await salvarOrdem();
    setSavingOrder(false);
    toast.success('Ordem atualizada');
  };

  const handleToggleStatus = async (id: string, ativo: boolean) => {
    await atualizarCadencia({ id, status: ativo ? 'ativa' : 'pausada' });
    toast.success(`Cadência ${ativo ? 'ativada' : 'pausada'}`);
  };

  const handleDuplicate = async (id: string) => {
    const duplicated = await duplicarCadencia(id);
    toast.success(`Cadência duplicada: ${duplicated.nome}`);
    navigate(`/distribuicao/cadencia/${duplicated.id}`);
  };

  const buildCadenciaPayload = (template: Cadencia, nome: string) => {
    const { id: _id, ...rest } = template;
    return {
      ...rest,
      nome,
      status: 'pausada' as CadenciaStatus,
      prioridade: cadencias.length + 1,
      regrasTabela: template.regrasTabela.map((regra) => ({ ...regra, id: uid() })),
      regrasEntrada: template.regrasEntrada.map((regra) => ({ ...regra, id: uid() })),
      passos: template.passos.map((passo) => ({ ...passo, id: uid() })),
    };
  };

  const handleCreateCadencia = async (mode: 'modelo' | 'nova') => {
    if (!cadencias.length) {
      toast.error('Nenhuma cadência disponível como modelo');
      return;
    }
    const template = cadencias[0];
    const nome = mode === 'modelo' ? `${template.nome} (cópia)` : 'Nova cadência';
    const created = await criarCadencia(buildCadenciaPayload(template, nome));
    toast.success(
      mode === 'modelo' ? `Modelo duplicado: ${created.nome}` : `Cadência criada: ${created.nome}`
    );
    navigate(`/distribuicao/cadencia/${created.id}`);
  };

  const handleDelete = async (id: string) => {
    await excluirCadencia(id);
    toast.success('Cadência excluída');
  };

  const handleEdit = (id: string) => {
    navigate(`/distribuicao/cadencia/${id}`);
  };

  if (loading) {
    return (
      <Card className="p-6 rounded-2xl border-dashed">
        <div className="h-4 w-40 bg-muted/60 rounded-lg animate-pulse" />
        <div className="mt-3 h-3 w-60 bg-muted/40 rounded-lg animate-pulse" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">Cadência</h1>
          <p className="text-sm text-muted-foreground">
            Crie regras de contato, acompanhamento e reativação após eventos do lead.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Ordenar as cadências aqui não altera a distribuição, apenas a organização da lista.</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => handleCreateCadencia('modelo')}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicar modelo
          </Button>
          <Button className="rounded-xl" onClick={() => handleCreateCadencia('nova')}>
            <PenLine className="h-4 w-4 mr-2" />
            Nova cadência
          </Button>
        </div>
      </div>

      {filteredCadencias.length === 0 ? (
        <Card className="p-10 text-center rounded-2xl border-dashed border-muted-foreground/20 bg-card">
          <p className="text-foreground font-medium">Nenhuma cadência encontrada</p>
          <p className="text-sm text-muted-foreground mt-1">
            Ajuste sua busca ou crie uma nova cadência
          </p>
          <Button className="mt-4 rounded-xl" onClick={() => handleCreateCadencia('nova')}>
            <PenLine className="h-4 w-4 mr-2" />
            Criar cadência
          </Button>
        </Card>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredCadencias.map((cad) => cad.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {filteredCadencias.map((cadencia) => (
                <SortableItem
                  key={cadencia.id}
                  id={cadencia.id}
                >
                  {(sortable) => (
                    <CadenciaCard
                      cadencia={cadencia}
                      onToggleStatus={handleToggleStatus}
                      onDuplicate={handleDuplicate}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      sortable={sortable}
                    />
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {savingOrder && (
        <div className="text-xs text-muted-foreground text-right pr-1">Salvando nova ordem...</div>
      )}
    </div>
  );
}

function CadenciaCard({
  cadencia,
  onToggleStatus,
  onDuplicate,
  onDelete,
  onEdit,
  sortable,
}: {
  cadencia: Cadencia;
  onToggleStatus: (id: string, ativo: boolean) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  sortable: {
    setNodeRef: (element: HTMLElement | null) => void;
    style: CSSProperties;
    listeners: Record<string, unknown> | undefined;
    attributes: Record<string, unknown>;
    isDragging: boolean;
  };
}) {
  const canalBadgeClass =
    'rounded-full bg-muted text-muted-foreground border-0 px-2.5 py-1 text-[11px] font-medium';

  return (
    <Card
      ref={sortable.setNodeRef}
      style={sortable.style}
      className={cn(
        'relative overflow-hidden border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 bg-card',
        sortable.isDragging && 'ring-2 ring-primary/20 shadow-lg'
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: cadencia.cor }} />
      <div className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-muted/60 text-muted-foreground cursor-grab active:cursor-grabbing"
              {...sortable.listeners}
              {...sortable.attributes}
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-center min-w-[36px] h-9 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: cadencia.cor }}>
              {cadencia.prioridade}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-base text-foreground leading-tight">{cadencia.nome}</h3>
                <Badge variant="secondary" className="rounded-full bg-muted text-muted-foreground border-0">
                  {cadencia.evento}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{cadencia.descricao}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={canalBadgeClass}>
                  {cadencia.gatilho.tipo === 'novo-lead' && 'Novo lead'}
                  {cadencia.gatilho.tipo === 'mudanca-etapa' && 'Mudança de etapa'}
                  {cadencia.gatilho.tipo === 'negocio-fechado' && 'Negócio fechado'}
                  {cadencia.gatilho.tipo === 'sem-resposta' && 'Sem resposta'}
                  {cadencia.gatilho.tipo === 'lead-sem-atividade' && 'Lead sem atividade'}
                </Badge>
                {cadencia.canais.map((canal) => (
                  <Badge key={canal} variant="secondary" className={canalBadgeClass}>
                    {canal}
                  </Badge>
                ))}
                <Badge variant="secondary" className={canalBadgeClass}>
                  Responsável: {cadencia.responsavel.nome}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 bg-muted/30">
              <span className="text-sm text-muted-foreground">Ativa</span>
              <Switch
                checked={cadencia.status === 'ativa'}
                onCheckedChange={(checked) => onToggleStatus(cadencia.id, checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl" onClick={() => onEdit(cadencia.id)}>
                    <PenLine className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Editar cadência</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => onDuplicate(cadencia.id)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicar cadência</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 text-destructive hover:text-destructive"
                    onClick={() => onDelete(cadencia.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Excluir cadência</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Separator className="my-4 bg-border" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoPill label="Passos" value={`${cadencia.passos.length} passos`} icon={<Layers className="h-4 w-4" />} />
          <InfoPill
            label="Tarefas automáticas"
            value={`${cadencia.passos.filter((p) => p.ativo).length} tarefas`}
            icon={<Clock3 className="h-4 w-4" />}
          />
          <InfoPill label="Janela estimada" value={cadencia.resumo.janelaEstimativa} icon={<Clock3 className="h-4 w-4" />} />
          <InfoPill label="SLA" value={cadencia.sla ?? 'Sem SLA'} icon={<ShieldCheck className="h-4 w-4" />} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {cadencia.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full bg-muted text-muted-foreground border-0 px-2.5 py-1 text-[11px]">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

function InfoPill({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2">
      <span className="text-muted-foreground">{icon}</span>
      <div className="flex flex-col leading-tight">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}
