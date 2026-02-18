import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { GripVertical, Plus, RefreshCcw, Trash2 } from 'lucide-react';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BusinessModule } from '@/types/businessRules';
import type { EditableRule } from '@/hooks/useBusinessRulesViewModel';
import type {
  AuxTableConfig,
  DadosConfig,
  FormConfig,
  FormFieldConfig,
  FunilConfig,
  FunilStage,
  IntervaloConfig,
} from '@/mocks/business-rules/configs';

interface BusinessRulesModuleDrawerProps {
  module: BusinessModule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rules?: EditableRule[];
  dadosConfig: DadosConfig;
  onDadosConfigChange: (config: DadosConfig) => void;
  funilConfig: FunilConfig;
  onFunilConfigChange: (config: FunilConfig) => void;
  auxTables: AuxTableConfig[];
  onAuxTablesChange: (tables: AuxTableConfig[]) => void;
  formConfigs: FormConfig[];
  onFormConfigsChange: (forms: FormConfig[]) => void;
}

export function BusinessRulesModuleDrawer({
  module,
  open,
  onOpenChange,
  rules = [],
  dadosConfig,
  onDadosConfigChange,
  funilConfig,
  onFunilConfigChange,
  auxTables,
  onAuxTablesChange,
  formConfigs,
  onFormConfigsChange,
}: BusinessRulesModuleDrawerProps) {
  const [draftDados, setDraftDados] = useState<DadosConfig>(dadosConfig);
  const [draftFunil, setDraftFunil] = useState<FunilConfig>(funilConfig);
  const [draftTables, setDraftTables] = useState<AuxTableConfig[]>(auxTables);
  const [draftForms, setDraftForms] = useState<FormConfig[]>(formConfigs);

  useEffect(() => {
    if (open) {
      setDraftDados(dadosConfig);
      setDraftFunil(funilConfig);
      setDraftTables(auxTables);
      setDraftForms(formConfigs);
    }
  }, [open, dadosConfig, funilConfig, auxTables, formConfigs]);

  const handleSave = () => {
    if (!module) return;
    if (module.moduleId === 'dados') onDadosConfigChange(draftDados);
    if (module.moduleId === 'funil') onFunilConfigChange(draftFunil);
    if (module.moduleId === 'tabelas-auxiliares') onAuxTablesChange(draftTables);
    if (module.moduleId === 'formularios') onFormConfigsChange(draftForms);
    onOpenChange(false);
  };

  const title = module ? module.title : 'Detalhe do módulo';

  const renderContent = useMemo(() => {
    if (!module) return null;
    switch (module.moduleId) {
      case 'dados':
        return <DadosModuleEditor data={draftDados} onChange={setDraftDados} />;
      case 'funil':
        return <FunilModuleEditor data={draftFunil} onChange={setDraftFunil} />;
      case 'tabelas-auxiliares':
        return <AuxTablesModuleEditor tables={draftTables} onChange={setDraftTables} />;
      case 'formularios':
        return <FormsModuleEditor forms={draftForms} onChange={setDraftForms} />;
      default:
        return <GenericModuleSummary module={module} rules={rules} />;
    }
  }, [module, draftDados, draftFunil, draftTables, draftForms, rules]);

  const showSave =
    module?.moduleId === 'dados' ||
    module?.moduleId === 'funil' ||
    module?.moduleId === 'tabelas-auxiliares' ||
    module?.moduleId === 'formularios';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center justify-between gap-4">
            <span>{title}</span>
            {module?.editable ? (
              <Badge variant="outline" className="text-[11px] text-emerald-600 border-emerald-200 bg-emerald-50">
                Editável
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[11px] text-muted-foreground">
                Somente leitura
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Camada 3 · Tela interna de edição. Mantenha contexto sem sair da aba de Regras de Negócios.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[70vh] pr-4">{renderContent}</ScrollArea>

        <SheetFooter className="mt-6">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              Salva localmente. Use para experimentar sem tocar backend.
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              {showSave ? (
                <Button onClick={handleSave} className="gap-2">
                  Salvar alterações
                </Button>
              ) : (
                <Button onClick={() => onOpenChange(false)} className="gap-2">
                  Fechar
                </Button>
              )}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DadosModuleEditor({ data, onChange }: { data: DadosConfig; onChange: (value: DadosConfig) => void }) {
  const updateInterval = (key: keyof DadosConfig['avaliacao'], field: keyof IntervaloConfig, value: number) => {
    onChange({
      ...data,
      avaliacao: {
        ...data.avaliacao,
        [key]: { ...data.avaliacao[key], [field]: value },
      },
    });
  };

  return (
    <div className="space-y-6">
      <SectionTitle title="Avaliação do imóvel" helper="Configure faixas de cores, usando neutro no lugar de amarelo." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(
          [
            ['venda', 'Venda'] as const,
            ['locacao', 'Locação'] as const,
            ['atualizacaoVenda', 'Atualização imóvel venda (dias)'] as const,
            ['atualizacaoAluguel', 'Atualização imóvel aluguel (dias)'] as const,
            ['atualizacaoLancamento', 'Atualização lançamento (dias)'] as const,
            ['insercaoAtendimento', 'Inserção e atendimento (dias)'] as const,
            ['interacaoLocacao', 'Interação atendimento locação (dias)'] as const,
          ] satisfies (readonly [keyof DadosConfig['avaliacao'], string])[]
        ).map(([key, label]) => (
          <Card key={key} className="p-4 space-y-3 border-border/80">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{label}</p>
              <Badge variant="outline" className="text-[11px]">
                Intervalo
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>De</Label>
                <Input
                  type="number"
                  value={data.avaliacao[key].de}
                  onChange={e => updateInterval(key, 'de', Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label>Até</Label>
                <Input
                  type="number"
                  value={data.avaliacao[key].ate}
                  onChange={e => updateInterval(key, 'ate', Number(e.target.value))}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Helper: use faixas consistentes para alertas verde, neutro e vermelho.
            </p>
          </Card>
        ))}
      </div>

      <SectionTitle title="Marca d’água" helper="Escolha posição e tamanho. Sem amarelo, apenas tokens neutros." />
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Usar marca d’água ao cadastrar imóveis</Label>
            <p className="text-xs text-muted-foreground">Protege imagens e segue padrão Hunter.</p>
          </div>
          <Switch
            checked={data.marcaDagua.habilitada}
            onCheckedChange={checked => onChange({ ...data, marcaDagua: { ...data.marcaDagua, habilitada: checked } })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Posição</Label>
            <Select
              value={data.marcaDagua.posicao}
              onValueChange={value =>
                onChange({ ...data, marcaDagua: { ...data.marcaDagua, posicao: value as DadosConfig['marcaDagua']['posicao'] } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superior">Superior</SelectItem>
                <SelectItem value="inferior">Inferior</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tamanho</Label>
            <Slider
              value={[data.marcaDagua.tamanho]}
              max={24}
              min={8}
              step={1}
              onValueChange={([value]) => onChange({ ...data, marcaDagua: { ...data.marcaDagua, tamanho: value } })}
            />
            <p className="text-xs text-muted-foreground">Atual: {data.marcaDagua.tamanho}px</p>
          </div>
        </div>
      </Card>

      <SectionTitle title="Padrões de agenda e visitas" helper="Configure janela padrão e duração." />
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Janela inicial</Label>
            <Input
              type="time"
              value={data.agenda.janelaInicio}
              onChange={e => onChange({ ...data, agenda: { ...data.agenda, janelaInicio: e.target.value } })}
            />
          </div>
          <div className="space-y-1">
            <Label>Janela final</Label>
            <Input
              type="time"
              value={data.agenda.janelaFim}
              onChange={e => onChange({ ...data, agenda: { ...data.agenda, janelaFim: e.target.value } })}
            />
          </div>
          <div className="space-y-1">
            <Label>Duração padrão (min)</Label>
            <Input
              type="number"
              value={data.agenda.duracaoPadrao}
              onChange={e => onChange({ ...data, agenda: { ...data.agenda, duracaoPadrao: Number(e.target.value) } })}
            />
          </div>
        </div>
      </Card>

      <SectionTitle title="Portais de anúncio" helper="Envio de mídia e ordem de priorização." />
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Enviar fotos de condomínio junto</Label>
            <p className="text-xs text-muted-foreground">Sempre envia fotos de áreas comuns junto com o imóvel.</p>
          </div>
          <Switch
            checked={data.portais.enviarFotosCondominio}
            onCheckedChange={checked => onChange({ ...data, portais: { ...data.portais, enviarFotosCondominio: checked } })}
          />
        </div>
        <div className="space-y-1">
          <Label>Ordem de mídia</Label>
          <Input
            value={data.portais.ordemMidia}
            onChange={e => onChange({ ...data, portais: { ...data.portais, ordemMidia: e.target.value } })}
            placeholder="Fotos > Plantas > Tour"
          />
          <p className="text-xs text-muted-foreground">Helper: defina a hierarquia de exibição nos portais.</p>
        </div>
      </Card>

      <SectionTitle title="Pontuações" helper="Pesos editáveis por tipo de corretor." />
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(
            [
              ['corretorVenda', 'Pontuação corretor venda'] as const,
              ['corretorAluguel', 'Pontuação corretor aluguel'] as const,
            ] satisfies (readonly [keyof DadosConfig['pontuacoes'], string])[]
          ).map(([key, label]) => (
            <div key={key} className="space-y-3 rounded-lg border border-border/80 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{label}</p>
                <Badge variant="secondary" className="text-[11px]">
                  Pontuação
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ['captacao', 'Captação'],
                    ['visita', 'Visita'],
                    ['proposta', 'Proposta'],
                    ['fechamento', 'Fechamento'],
                  ] satisfies (readonly [keyof DadosConfig['pontuacoes']['corretorVenda'], string])[]
                ).map(([field, labelField]) => (
                  <div key={field} className="space-y-1">
                    <Label>{labelField}</Label>
                    <Input
                      type="number"
                      value={data.pontuacoes[key][field]}
                      onChange={e =>
                        onChange({
                          ...data,
                          pontuacoes: {
                            ...data.pontuacoes,
                            [key]: { ...data.pontuacoes[key], [field]: Number(e.target.value) },
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FunilModuleEditor({ data, onChange }: { data: FunilConfig; onChange: (value: FunilConfig) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = data.etapas.findIndex(item => item.id === active.id);
      const newIndex = data.etapas.findIndex(item => item.id === over?.id);
      onChange({ ...data, etapas: arrayMove(data.etapas, oldIndex, newIndex) });
    }
  };

  const addStage = () => {
    const ordem = data.etapas.length + 1;
    onChange({
      ...data,
      etapas: [...data.etapas, { id: `etapa-${ordem}`, nome: `Etapa ${ordem}`, descricao: 'Descreva a etapa', ativo: true }],
    });
  };

  const initialFunil: FunilConfig = {
    limiteEtapas: 10,
    etapas: [
      { id: 'novo', nome: 'Novo', descricao: 'Lead recebido', ativo: true },
      { id: 'contato', nome: 'Contato', descricao: 'Primeiro contato realizado', ativo: true },
      { id: 'qualificado', nome: 'Qualificado', descricao: 'Interesse confirmado', ativo: true },
      { id: 'proposta', nome: 'Proposta', descricao: 'Proposta enviada', ativo: true },
      { id: 'fechado', nome: 'Fechado', descricao: 'Ganho ou perdido', ativo: true },
    ],
  };

  const restoreDefault = () => onChange({ ...data, etapas: [...initialFunil.etapas] });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle title="Etapas do funil" helper="Arraste para reordenar. Visualização rápida ao lado." />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2" onClick={restoreDefault}>
            <RefreshCcw className="h-4 w-4" /> Restaurar padrão
          </Button>
          <Button size="sm" className="gap-2" onClick={addStage}>
            <Plus className="h-4 w-4" /> Adicionar etapa
          </Button>
        </div>
      </div>
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Quantidade de etapas</Label>
            <Input
              type="number"
              value={data.etapas.length}
              onChange={e =>
                onChange({
                  ...data,
                  limiteEtapas: Number(e.target.value),
                })
              }
            />
            <p className="text-xs text-muted-foreground">Limite máximo: {data.limiteEtapas} etapas</p>
          </div>
          <div className="md:col-span-2">
            <Label>Visualização rápida</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.etapas.map(stage => (
                <Badge key={stage.id} variant="secondary" className="text-[11px]">
                  {stage.nome}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={data.etapas.map(stage => stage.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {data.etapas.map((stage: FunilStage) => (
                <SortableStageItem key={stage.id} id={stage.id}>
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          value={stage.nome}
                          onChange={e =>
                            onChange({
                              ...data,
                              etapas: data.etapas.map(item =>
                                item.id === stage.id ? { ...item, nome: e.target.value } : item
                              ),
                            })
                          }
                        />
                        <Input
                          placeholder="Descrição curta"
                          value={stage.descricao || ''}
                          onChange={e =>
                            onChange({
                              ...data,
                              etapas: data.etapas.map(item =>
                                item.id === stage.id ? { ...item, descricao: e.target.value } : item
                              ),
                            })
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={stage.ativo}
                            onCheckedChange={checked =>
                              onChange({
                                ...data,
                                etapas: data.etapas.map(item =>
                                  item.id === stage.id ? { ...item, ativo: checked } : item
                                ),
                              })
                            }
                          />
                          <span className="text-sm">{stage.ativo ? 'Ativo' : 'Inativo'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SortableStageItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Card>
    </div>
  );
}

function AuxTablesModuleEditor({ tables, onChange }: { tables: AuxTableConfig[]; onChange: (tables: AuxTableConfig[]) => void }) {
  const [selectedTable, setSelectedTable] = useState<AuxTableConfig | null>(tables[0] ?? null);
  const [itemSearch, setItemSearch] = useState('');
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    if (tables.length && !selectedTable) {
      setSelectedTable(tables[0]);
    }
  }, [tables, selectedTable]);

  const handleToggleItem = (itemId: string, active: boolean) => {
    if (!selectedTable) return;
    onChange(
      tables.map(table =>
        table.id === selectedTable.id
          ? {
              ...table,
              items: table.items.map(item => (item.id === itemId ? { ...item, ativo: active } : item)),
            }
          : table
      )
    );
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedTable) return;
    onChange(
      tables.map(table =>
        table.id === selectedTable.id ? { ...table, items: table.items.filter(item => item.id !== itemId) } : table
      )
    );
  };

  const handleAddItem = () => {
    if (!selectedTable || !newItemName.trim()) return;
    const newItem = { id: `${selectedTable.id}-${Date.now()}`, nome: newItemName.trim(), ativo: true };
    onChange(
      tables.map(table => (table.id === selectedTable.id ? { ...table, items: [newItem, ...table.items] } : table))
    );
    setNewItemName('');
  };

  const filteredItems =
    selectedTable?.items.filter(item => item.nome.toLowerCase().includes(itemSearch.toLowerCase())) ?? [];

  return (
    <div className="space-y-4">
      <SectionTitle title="Tabelas auxiliares" helper="Grid refinado com estados de listagem e edição." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tables.map(table => {
          const isActive = selectedTable?.id === table.id;
          return (
            <Card
              key={table.id}
              className={cn(
                'p-4 cursor-pointer border border-border/70 hover:border-primary/50',
                isActive && 'border-primary shadow-sm'
              )}
              onClick={() => setSelectedTable(table)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{table.nome}</p>
                  <p className="text-xs text-muted-foreground">{table.descricao}</p>
                </div>
                <Badge variant="outline" className="text-[11px]">
                  {table.items.length} itens
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedTable ? (
        <Card className="p-4 space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold">{selectedTable.nome}</p>
              <p className="text-xs text-muted-foreground">
                Buscar, adicionar, editar e excluir com confirmação.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar itens"
                className="w-56"
                value={itemSearch}
                onChange={e => setItemSearch(e.target.value)}
              />
              <Button variant="outline" size="sm" onClick={() => setItemSearch('')}>
                Limpar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
            <div className="space-y-2">
              <Label>Adicionar novo item</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do item"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                />
                <Button size="sm" className="gap-2" onClick={handleAddItem}>
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Estados vazios exibem mensagem elegante e CTA para adicionar.
            </div>
          </div>

          <div className="rounded-lg border border-border/70 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-28 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-sm text-muted-foreground text-center py-6">
                      Nenhum item encontrado. Use a busca ou adicione um novo.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.ativo}
                            onCheckedChange={checked => handleToggleItem(item.id, checked)}
                          />
                          <span className="text-sm">{item.ativo ? 'Ativo' : 'Inativo'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-dashed text-center text-sm text-muted-foreground">
          Selecione uma tabela para editar seus itens.
        </Card>
      )}
    </div>
  );
}

function FormsModuleEditor({ forms, onChange }: { forms: FormConfig[]; onChange: (forms: FormConfig[]) => void }) {
  const [activeFormId, setActiveFormId] = useState(forms[0]?.id);
  const activeForm = forms.find(form => form.id === activeFormId);
  const [newField, setNewField] = useState<Partial<FormFieldConfig>>({
    label: '',
    type: 'texto',
    required: false,
  });

  useEffect(() => {
    if (!activeForm && forms.length > 0) {
      setActiveFormId(forms[0].id);
    }
  }, [forms, activeForm]);

  const updateField = (fieldId: string, key: keyof FormFieldConfig, value: string | boolean) => {
    if (!activeForm) return;
    onChange(
      forms.map(form =>
        form.id === activeForm.id
          ? {
              ...form,
              fields: form.fields.map(field => (field.id === fieldId ? { ...field, [key]: value } : field)),
            }
          : form
      )
    );
  };

  const removeField = (fieldId: string) => {
    if (!activeForm) return;
    onChange(
      forms.map(form =>
        form.id === activeForm.id ? { ...form, fields: form.fields.filter(field => field.id !== fieldId) } : form
      )
    );
  };

  const addField = () => {
    if (!activeForm || !newField.label?.trim()) return;
    const id = `${activeForm.id}-${Date.now()}`;
    const nextField: FormFieldConfig = {
      id,
      label: newField.label.trim(),
      type: (newField.type as FormFieldConfig['type']) || 'texto',
      required: Boolean(newField.required),
      helper: newField.helper || '',
    };
    onChange(
      forms.map(form =>
        form.id === activeForm.id ? { ...form, fields: [...form.fields, nextField] } : form
      )
    );
    setNewField({ label: '', type: 'texto', required: false, helper: '' });
  };

  return (
    <div className="space-y-4">
      <SectionTitle title="Formulários" helper="Lista de formulários com status e editor interno." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {forms.map(form => (
          <Card
            key={form.id}
            className={cn(
              'p-4 cursor-pointer border border-border/70 hover:border-primary/50',
              activeFormId === form.id && 'border-primary shadow-sm'
            )}
            onClick={() => setActiveFormId(form.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{form.nome}</p>
                <p className="text-xs text-muted-foreground">{form.descricao}</p>
              </div>
              <Badge variant="outline" className="text-[11px]">
                {form.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{form.fields.length} campos</p>
          </Card>
        ))}
      </div>

      {activeForm ? (
        <Card className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{activeForm.nome}</p>
              <p className="text-xs text-muted-foreground">{activeForm.descricao}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={activeForm.ativo}
                onCheckedChange={checked =>
                  onChange(forms.map(form => (form.id === activeForm.id ? { ...form, ativo: checked } : form)))
                }
              />
              <span className="text-sm">{activeForm.ativo ? 'Ativo' : 'Inativo'}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Campos</Label>
            <div className="space-y-2">
              {activeForm.fields.map(field => (
                <Card key={field.id} className="p-3 border-border/70">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                    <Input
                      value={field.label}
                      onChange={e => updateField(field.id, 'label', e.target.value)}
                      placeholder="Label"
                    />
                    <Select
                      value={field.type}
                      onValueChange={value => updateField(field.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="texto">Texto</SelectItem>
                        <SelectItem value="numero">Número</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="booleano">Boolean</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.required}
                        onCheckedChange={checked => updateField(field.id, 'required', checked)}
                      />
                      <span className="text-sm">Obrigatório</span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="justify-self-end text-destructive hover:text-destructive"
                      onClick={() => removeField(field.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    className="mt-2"
                    placeholder="Helper text opcional"
                    value={field.helper || ''}
                    onChange={e => updateField(field.id, 'helper', e.target.value)}
                  />
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Adicionar campo</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Label do campo"
                value={newField.label ?? ''}
                onChange={e => setNewField(current => ({ ...current, label: e.target.value }))}
              />
              <Select
                value={newField.type}
                onValueChange={value => setNewField(current => ({ ...current, type: value as FormFieldConfig['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="texto">Texto</SelectItem>
                  <SelectItem value="numero">Número</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="booleano">Boolean</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Switch
                  checked={Boolean(newField.required)}
                  onCheckedChange={checked => setNewField(current => ({ ...current, required: checked }))}
                />
                <span className="text-sm">Obrigatório</span>
              </div>
              <Button className="gap-2" onClick={addField}>
                <Plus className="h-4 w-4" /> Adicionar
              </Button>
            </div>
            <Textarea
              placeholder="Helper text"
              value={newField.helper ?? ''}
              onChange={e => setNewField(current => ({ ...current, helper: e.target.value }))}
            />
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-dashed text-center text-sm text-muted-foreground">
          Selecione um formulário para editar campos.
        </Card>
      )}
    </div>
  );
}

function GenericModuleSummary({ module, rules }: { module: BusinessModule; rules: EditableRule[] }) {
  return (
    <div className="space-y-4">
      <SectionTitle
        title={module.title}
        helper="Resumo rápido das regras do módulo. Edição local disponível para módulos principais."
      />
      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-[11px]">
            {module.moduleType}
          </Badge>
          {module.badges?.map(badge => (
            <Badge key={badge} variant="outline" className="text-[11px]">
              {badge}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{module.description}</p>
        <Separator />
        <div className="space-y-2">
          <p className="text-sm font-semibold">Regras rápidas</p>
          {rules.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhuma regra cadastrada ainda.</p>
          ) : (
            <div className="space-y-2">
              {rules.slice(0, 5).map(rule => (
                <div key={rule.ruleId} className="flex items-start justify-between gap-2 rounded-lg border border-border/70 p-3">
                  <div>
                    <p className="text-sm font-semibold">{rule.title}</p>
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                  </div>
                  <Badge variant="outline" className="text-[11px]">
                    {rule.status === 'active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function SortableStageItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-3 rounded-lg border border-border/80 bg-muted/40',
        isDragging && 'shadow-lg border-primary/50 bg-card'
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, helper }: { title: string; helper: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default BusinessRulesModuleDrawer;
