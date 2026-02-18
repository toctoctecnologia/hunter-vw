import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { toast } from 'sonner';
import { ArrowLeft, Copy, GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import RegraItem from '@/components/distribuicao/regra/RegraItem';
import { SortableItem } from '@/components/distribuicao/SortableItem';
import { cn } from '@/lib/utils';
import type { Cadencia, CadenciaPasso, CadenciaPassoTipo, CadenciaTentativasConfig } from '@/types/cadencia';
import type { Regra } from '@/types/filas';
import { useCadenciasStore } from '@/state/distribuicao/cadencias.store';

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 9);

const CANAL_OPTIONS = ['WhatsApp', 'Ligação', 'Email', 'Visita agendada'];

export default function CadenciaConfigPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { cadencias, carregarCadencias, atualizarCadencia, excluirCadencia } = useCadenciasStore();
  const [draft, setDraft] = useState<Cadencia | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      if (!cadencias.length) {
        await carregarCadencias();
      }
      const found = useCadenciasStore.getState().cadencias.find((cad) => cad.id === id);
      if (!found) {
        toast.error('Cadência não encontrada');
        navigate('/distribuicao/cadencia');
        return;
      }
      setDraft(found);
    };
    load();
  }, [cadencias.length, carregarCadencias, id, navigate]);

  const handleMainTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'usuarios':
        navigate('/usuarios');
        break;
      case 'distribuicao':
      default:
        navigate('/distribuicao/cadencia');
        break;
    }
  };

  const handleFieldChange = <K extends keyof Cadencia>(key: K, value: Cadencia[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleAddRegra = () => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            regrasEntrada: [
              ...prev.regrasEntrada,
              { id: uid(), campo: 'titulo', operador: 'contém', valor: '' } as Regra,
            ],
          }
        : prev
    );
  };

  const handleRegraChange = (idRegra: string, changes: Partial<Regra>) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            regrasEntrada: prev.regrasEntrada.map((regra) =>
              regra.id === idRegra ? { ...regra, ...changes } : regra
            ),
          }
        : prev
    );
  };

  const handleDuplicateRegra = (idRegra: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            regrasEntrada: prev.regrasEntrada.reduce<Regra[]>((acc, regra) => {
              acc.push(regra);
              if (regra.id === idRegra) {
                acc.push({ ...regra, id: uid() });
              }
              return acc;
            }, []),
          }
        : prev
    );
  };

  const handleRemoveRegra = (idRegra: string) => {
    setDraft((prev) =>
      prev ? { ...prev, regrasEntrada: prev.regrasEntrada.filter((regra) => regra.id !== idRegra) } : prev
    );
  };

  const handleAddPasso = () => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            passos: [
              ...prev.passos,
              {
                id: uid(),
                nome: `Passo ${prev.passos.length + 1}`,
                tipo: 'whatsapp',
                prazo: 'em 24h',
                responsavel: prev.responsavel.nome,
                template: '',
                ativo: true,
              },
            ],
          }
        : prev
    );
  };

  const handlePassoUpdate = (idPasso: string, changes: Partial<CadenciaPasso>) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            passos: prev.passos.map((passo) => (passo.id === idPasso ? { ...passo, ...changes } : passo)),
          }
        : prev
    );
  };

  const handlePassoDuplicate = (idPasso: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            passos: prev.passos.reduce<CadenciaPasso[]>((acc, passo) => {
              acc.push(passo);
              if (passo.id === idPasso) {
                acc.push({ ...passo, id: uid(), nome: `${passo.nome} (cópia)` });
              }
              return acc;
            }, []),
          }
        : prev
    );
  };

  const handlePassoDragEnd = (event: any) => {
    if (!draft) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = draft.passos.findIndex((p) => p.id === active.id);
    const newIndex = draft.passos.findIndex((p) => p.id === over.id);
    const newPassos = arrayMove(draft.passos, oldIndex, newIndex);
    setDraft({ ...draft, passos: newPassos });
  };

  const handleTentativaChange = (changes: Partial<CadenciaTentativasConfig>) => {
    setDraft((prev) => (prev ? { ...prev, tentativas: { ...prev.tentativas, ...changes } } : prev));
  };

  const handleSave = async () => {
    if (!draft) return;
    if (!draft.nome.trim()) {
      toast.error('Nome da cadência é obrigatório');
      return;
    }
    setSaving(true);
    try {
      await atualizarCadencia(draft);
      toast.success('Cadência salva com sucesso');
      navigate('/distribuicao/cadencia');
    } catch (error) {
      toast.error('Erro ao salvar cadência');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!draft) return;
    setDeleting(true);
    try {
      await excluirCadencia(draft.id);
      toast.success('Cadência excluída');
      navigate('/distribuicao/cadencia');
    } catch (error) {
      toast.error('Erro ao excluir cadência');
    } finally {
      setDeleting(false);
    }
  };

  const resumoPreview = useMemo(() => {
    if (!draft) return null;
    return {
      passos: draft.passos.length,
      automacoes: draft.passos.filter((p) => p.ativo).length,
      janela: draft.resumo.janelaEstimativa,
      descricao: draft.regrasResultado,
    };
  }, [draft]);

  if (!draft) {
    return (
      <ResponsiveLayout activeTab="distribuicao" setActiveTab={handleMainTabChange}>
        <div className="px-6 py-8">
          <Card className="p-6 rounded-2xl border-dashed">
            <div className="h-4 w-48 bg-muted/60 rounded-lg animate-pulse" />
            <div className="mt-3 h-3 w-72 bg-muted/40 rounded-lg animate-pulse" />
          </Card>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activeTab="distribuicao" setActiveTab={handleMainTabChange}>
      <div className="px-6 py-6 space-y-5 max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="rounded-xl" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Configurar cadência</h1>
              <p className="text-sm text-muted-foreground">
                Defina gatilhos, regras, tentativas de contato e tarefas automáticas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate('/distribuicao/cadencia')}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? 'Excluindo...' : 'Excluir cadência'}
            </Button>
            <Button className="rounded-xl" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        <Accordion type="multiple" defaultValue={['identidade', 'gatilho', 'regras', 'tentativas', 'tarefas', 'resultado', 'preview']}>
          <AccordionItem value="identidade" className="border border-border rounded-2xl px-4">
            <AccordionTrigger className="text-lg font-semibold">Identidade</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome da cadência</Label>
                  <Input
                    value={draft.nome}
                    onChange={(e) => handleFieldChange('nome', e.target.value)}
                    placeholder="Cadência de relacionamento"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags ou categoria</Label>
                  <Input
                    value={(draft.tags ?? []).join(', ')}
                    onChange={(e) => handleFieldChange('tags', e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))}
                    placeholder="Relacionamento, Reativação, Qualificação"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={draft.descricao}
                  onChange={(e) => handleFieldChange('descricao', e.target.value)}
                  placeholder="Explique o objetivo desta cadência"
                  className="min-h-[90px] rounded-xl"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="gatilho" className="border border-border rounded-2xl px-4">
            <AccordionTrigger className="text-lg font-semibold">Gatilho da cadência</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Quando iniciar</Label>
                  <Select
                    value={draft.gatilho.tipo}
                    onValueChange={(val) => handleFieldChange('gatilho', { ...draft.gatilho, tipo: val as Cadencia['gatilho']['tipo'] })}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Selecione o gatilho" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="novo-lead">Novo lead recebido</SelectItem>
                      <SelectItem value="mudanca-etapa">Mudança de etapa do funil</SelectItem>
                      <SelectItem value="negocio-fechado">Negócio fechado</SelectItem>
                      <SelectItem value="sem-resposta">Sem resposta após tempo</SelectItem>
                      <SelectItem value="lead-sem-atividade">Lead sem atividade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>SLA (opcional)</Label>
                  <Input
                    value={draft.sla ?? ''}
                    onChange={(e) => handleFieldChange('sla', e.target.value)}
                    placeholder="Retorno em até 2h"
                    className="rounded-xl"
                  />
                </div>
              </div>

              {draft.gatilho.tipo === 'mudanca-etapa' && (
                <div className="space-y-2">
                  <Label>Etapas do funil</Label>
                  <Input
                    value={(draft.gatilho.etapasFunil ?? []).join(', ')}
                    onChange={(e) =>
                      handleFieldChange('gatilho', {
                        ...draft.gatilho,
                        etapasFunil: e.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Qualificação, Proposta, Visita"
                    className="rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">Separe as etapas com vírgula.</p>
                </div>
              )}

              {draft.gatilho.tipo === 'negocio-fechado' && (
                <div className="space-y-2">
                  <Label>Regra de pós-venda (dias)</Label>
                  <Input
                    value={(draft.gatilho.posVendaIntervalos ?? []).join(', ')}
                    onChange={(e) =>
                      handleFieldChange('gatilho', {
                        ...draft.gatilho,
                        posVendaIntervalos: e.target.value
                          .split(',')
                          .map((item) => Number(item.trim()))
                          .filter(Boolean),
                      })
                    }
                    placeholder="30, 60, 90"
                    className="rounded-xl"
                  />
                </div>
              )}

              {draft.gatilho.tipo === 'sem-resposta' && (
                <div className="space-y-2">
                  <Label>Sem resposta após (horas)</Label>
                  <Input
                    type="number"
                    value={draft.gatilho.tempoSemRespostaHoras ?? ''}
                    onChange={(e) =>
                      handleFieldChange('gatilho', { ...draft.gatilho, tempoSemRespostaHoras: Number(e.target.value) })
                    }
                    className="rounded-xl"
                  />
                </div>
              )}

              {draft.gatilho.tipo === 'lead-sem-atividade' && (
                <div className="space-y-2">
                  <Label>Lead sem atividade por (dias)</Label>
                  <Input
                    type="number"
                    value={draft.gatilho.tempoInatividadeDias ?? ''}
                    onChange={(e) =>
                      handleFieldChange('gatilho', { ...draft.gatilho, tempoInatividadeDias: Number(e.target.value) })
                    }
                    className="rounded-xl"
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="regras" className="border border-border rounded-2xl px-4">
            <AccordionTrigger className="text-lg font-semibold">Regras de entrada</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="rounded-full border-dashed">E</Badge>
                <span>Combine campos, operadores e valores para segmentar a entrada na cadência.</span>
              </div>
              <div className="space-y-3">
                {draft.regrasEntrada.map((regra, index) => (
                  <RegraItem
                    key={regra.id}
                    regra={regra}
                    onChange={handleRegraChange}
                    onAdd={handleAddRegra}
                    onDuplicate={handleDuplicateRegra}
                    onRemove={handleRemoveRegra}
                    disableRemove={draft.regrasEntrada.length === 1 && index === 0}
                  />
                ))}
              </div>
              <Button variant="outline" className="rounded-xl" onClick={handleAddRegra}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar regra
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tentativas" className="border border-border rounded-2xl px-4">
            <AccordionTrigger className="text-lg font-semibold">Tentativas obrigatórias e escalonamento</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Quantidade mínima obrigatória</Label>
                  <Input
                    type="number"
                    value={draft.tentativas.minimoObrigatorio}
                    onChange={(e) => handleTentativaChange({ minimoObrigatorio: Number(e.target.value) })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Janela entre tentativas</Label>
                  <Input
                    value={draft.tentativas.intervalo}
                    onChange={(e) => handleTentativaChange({ intervalo: e.target.value })}
                    placeholder="2h, 24h, 3 dias"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Canais por tentativa</Label>
                <div className="flex flex-wrap gap-2">
                  {CANAL_OPTIONS.map((canal) => {
                    const checked = draft.tentativas.canais.includes(canal);
                    return (
                      <Button
                        key={canal}
                        type="button"
                        variant={checked ? 'default' : 'outline'}
                        onClick={() =>
                          handleTentativaChange({
                            canais: checked
                              ? draft.tentativas.canais.filter((item) => item !== canal)
                              : [...draft.tentativas.canais, canal],
                          })
                        }
                        className={cn(
                          'rounded-full px-3 py-1 text-sm',
                          checked ? 'bg-primary text-primary-foreground' : 'bg-white'
                        )}
                      >
                        {canal}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Resultado esperado</Label>
                  <Select
                    value={draft.tentativas.resultadoEsperado}
                    onValueChange={(val) => handleTentativaChange({ resultadoEsperado: val as CadenciaTentativasConfig['resultadoEsperado'] })}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Contato estabelecido">Contato estabelecido</SelectItem>
                      <SelectItem value="Sem resposta">Sem resposta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ação após falha</Label>
                  <Select
                    value={draft.tentativas.acaoPosFalha}
                    onValueChange={(val) =>
                      handleTentativaChange({
                        acaoPosFalha: val as CadenciaTentativasConfig['acaoPosFalha'],
                        redistribuir: val === 'redistribuir',
                        criarTarefaGestor: val === 'tarefa-gestor',
                      })
                    }
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Escolha a ação" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="descartar">Descartar automaticamente</SelectItem>
                      <SelectItem value="redistribuir">Redistribuir</SelectItem>
                      <SelectItem value="tarefa-gestor">Criar tarefa para gestor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Motivo pós-falha (opcional)</Label>
                <Input
                  value={draft.tentativas.motivoPosFalha ?? ''}
                  onChange={(e) => handleTentativaChange({ motivoPosFalha: e.target.value })}
                  placeholder="Lead não retornou após X tentativas"
                  className="rounded-xl"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tarefas" className="border border-border rounded-2xl px-4">
            <AccordionTrigger className="text-lg font-semibold">Tarefas automáticas e passos</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePassoDragEnd}>
                <SortableContext items={draft.passos.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {draft.passos.map((passo) => (
                      <SortableItem key={passo.id} id={passo.id}>
                        {(sortable) => (
                          <PassoItem
                            passo={passo}
                            onChange={handlePassoUpdate}
                            onDuplicate={handlePassoDuplicate}
                            sortable={sortable}
                          />
                        )}
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <Button variant="outline" className="rounded-xl" onClick={handleAddPasso}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar passo
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resultado" className="border border-border rounded-2xl px-4">
            <AccordionTrigger className="text-lg font-semibold">Regras por resultado</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <ResultadoSelect
                  label="Se o lead respondeu"
                  value={draft.regrasResultado.respondeu}
                  onChange={(value) => handleFieldChange('regrasResultado', { ...draft.regrasResultado, respondeu: value })}
                />
                <ResultadoSelect
                  label="Se marcou visita"
                  value={draft.regrasResultado.marcouVisita}
                  onChange={(value) => handleFieldChange('regrasResultado', { ...draft.regrasResultado, marcouVisita: value })}
                />
                <ResultadoSelect
                  label="Se negócio foi fechado"
                  value={draft.regrasResultado.negocioFechado}
                  onChange={(value) =>
                    handleFieldChange('regrasResultado', { ...draft.regrasResultado, negocioFechado: value })
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="preview" className="border border-border rounded-2xl px-4">
            <AccordionTrigger className="text-lg font-semibold">Preview e auditoria</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <Card className="p-4 rounded-2xl border border-border shadow-none">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">Como vai funcionar</h3>
                    <p className="text-sm text-muted-foreground">
                      Linha do tempo estimada, passos e o que acontece em cada cenário.
                    </p>
                  </div>
                  {resumoPreview && (
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="rounded-full bg-muted text-muted-foreground border-0">
                        {resumoPreview.janela}
                      </Badge>
                      <Badge variant="outline" className="rounded-full border-dashed">
                        {resumoPreview.passos} passos · {resumoPreview.automacoes} tarefas
                      </Badge>
                    </div>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Entram na cadência</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                      {draft.resumo.exemplosEntrada.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Não entram</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                      {draft.resumo.exemplosExclusao.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ResponsiveLayout>
  );
}

function PassoItem({
  passo,
  onChange,
  onDuplicate,
  sortable,
}: {
  passo: CadenciaPasso;
  onChange: (id: string, changes: Partial<CadenciaPasso>) => void;
  onDuplicate: (id: string) => void;
  sortable: {
    setNodeRef: (element: HTMLElement | null) => void;
    style: CSSProperties;
    listeners: Record<string, unknown> | undefined;
    attributes: Record<string, unknown>;
    isDragging: boolean;
  };
}) {
  return (
    <Card
      ref={sortable.setNodeRef}
      style={sortable.style}
      className={cn(
        'p-3 rounded-2xl border border-border bg-card flex flex-col gap-3',
        sortable.isDragging && 'ring-2 ring-primary/20 shadow-lg'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-muted/60 text-muted-foreground cursor-grab active:cursor-grabbing"
            {...sortable.listeners}
            {...sortable.attributes}
            type="button"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <Input
            value={passo.nome}
            onChange={(e) => onChange(passo.id, { nome: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={passo.ativo} onCheckedChange={(checked) => onChange(passo.id, { ativo: checked })} />
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onDuplicate(passo.id)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <Label>Tipo de tarefa</Label>
          <Select
            value={passo.tipo}
            onValueChange={(val) => onChange(passo.id, { tipo: val as CadenciaPassoTipo })}
          >
            <SelectTrigger className="rounded-xl h-10">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="ligacao">Ligação</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="visita">Agendar visita</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Prazo</Label>
          <Input
            value={passo.prazo}
            onChange={(e) => onChange(passo.id, { prazo: e.target.value })}
            placeholder="em 24h"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label>Responsável</Label>
          <Input
            value={passo.responsavel}
            onChange={(e) => onChange(passo.id, { responsavel: e.target.value })}
            placeholder="Equipe ou usuário"
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Template (opcional)</Label>
        <Textarea
          value={passo.template ?? ''}
          onChange={(e) => onChange(passo.id, { template: e.target.value })}
          placeholder="Mensagem, roteiro ou email"
          className="rounded-xl min-h-[80px]"
        />
      </div>
    </Card>
  );
}

function ResultadoSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="rounded-xl h-11">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="Encerrar cadência">Encerrar cadência</SelectItem>
          <SelectItem value="Pausar cadência até a visita">Pausar cadência até a visita</SelectItem>
          <SelectItem value="Pausar cadência até a data da visita">Pausar cadência até a data da visita</SelectItem>
          <SelectItem value="Mover para outra cadência">Mover para outra cadência</SelectItem>
          <SelectItem value="Continuar acompanhamento">Continuar acompanhamento</SelectItem>
          <SelectItem value="Mover para cadência de pós-venda em 30 dias">
            Mover para cadência de pós-venda em 30 dias
          </SelectItem>
          <SelectItem value="Continuar em pós-venda com intervalo de 30 dias">
            Continuar em pós-venda com intervalo de 30 dias
          </SelectItem>
          <SelectItem value="Mover para fila principal">Mover para fila principal</SelectItem>
          <SelectItem value="Enviar para pós-venda em 60 dias">Enviar para pós-venda em 60 dias</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
