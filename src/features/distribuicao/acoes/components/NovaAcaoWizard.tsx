import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';
import { acoesApi } from '../api';
import type { NovaAcaoPayload, AcaoRecorrenciaTipo } from '../types';
import { filasApi } from '@/api/filas';
import type { CheckinStatus, Fila } from '@/types/filas';

interface NovaAcaoWizardProps {
  onCancel: () => void;
  onCompleted: (acaoId: string) => void;
}

interface FormState {
  titulo: string;
  descricao: string;
  tipo: NovaAcaoPayload['tipo'];
  redistribuicaoOrigem: NonNullable<NovaAcaoPayload['redistribuicaoOrigem']>;
  origemLeads: NonNullable<NovaAcaoPayload['origemLeads']>;
  filaId: string;
  inicioPrevisto: string;
  terminoPrevisto: string;
  participantesSelecionados: string[];
  recorrenciaAtiva: boolean;
  recorrenciaTipo: AcaoRecorrenciaTipo;
  recorrenciaDias: Array<'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom'>;
  recorrenciaHorario: string;
  recorrenciaIntervalo: number;
  recorrenciaDataFim: string;
  enviarNotificacao: boolean;
  mensagemNotificacao: string;
}

const defaultForm: FormState = {
  titulo: '',
  descricao: '',
  tipo: 'checkin',
  redistribuicaoOrigem: 'existentes',
  origemLeads: 'existentes',
  filaId: '',
  inicioPrevisto: new Date().toISOString().slice(0, 16),
  terminoPrevisto: '',
  participantesSelecionados: [],
  recorrenciaAtiva: true,
  recorrenciaTipo: 'diaria',
  recorrenciaDias: ['seg', 'ter', 'qua', 'qui', 'sex'],
  recorrenciaHorario: '08:00',
  recorrenciaIntervalo: 1,
  recorrenciaDataFim: '',
  enviarNotificacao: true,
  mensagemNotificacao: 'Olá! Sua ação de distribuição acaba de iniciar. Fique atento às novas distribuições.',
};

const steps = [
  { titulo: 'Configuração', descricao: 'Defina o objetivo e o período da ação.' },
  { titulo: 'Participantes', descricao: 'Selecione quem fará parte da ação.' },
  { titulo: 'Recorrência', descricao: 'Configure a frequência e a duração.' },
  { titulo: 'Confirmação', descricao: 'Revise os dados e conclua a criação.' },
];

export function NovaAcaoWizard({ onCancel, onCompleted }: NovaAcaoWizardProps) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [step, setStep] = useState(0);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(true);
  const [carregandoFilas, setCarregandoFilas] = useState(true);
  const [usuarios, setUsuarios] = useState<CheckinStatus[]>([]);
  const [filas, setFilas] = useState<Fila[]>([]);
  const [submetendo, setSubmetendo] = useState(false);
  const [buscaParticipante, setBuscaParticipante] = useState('');

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        setCarregandoUsuarios(true);
        setCarregandoFilas(true);
        const [dadosUsuarios, dadosFilas] = await Promise.all([
          filasApi.getCheckin(),
          filasApi.getFilas(),
        ]);
        setUsuarios(dadosUsuarios);
        setFilas(dadosFilas);
        if (!defaultForm.filaId && dadosFilas[0]) {
          setForm(prev => ({ ...prev, filaId: dadosFilas[0].id }));
        }
      } catch (error) {
        console.error('Erro ao carregar participantes disponíveis', error);
        toast.error('Não foi possível carregar os usuários ou filas.');
      } finally {
        setCarregandoUsuarios(false);
        setCarregandoFilas(false);
      }
    };

    carregarDadosIniciais();
  }, []);

  const participantesFiltrados = useMemo(() => {
    const daFila = form.filaId ? usuarios.filter(usuario => usuario.filaIds.includes(form.filaId)) : usuarios;
    if (!buscaParticipante) return daFila;
    const termo = buscaParticipante.toLowerCase();
    return daFila.filter(usuario => usuario.nome.toLowerCase().includes(termo) || usuario.email.toLowerCase().includes(termo));
  }, [usuarios, buscaParticipante, form.filaId]);

  const toggleParticipante = (id: string) => {
    setForm(prev => ({
      ...prev,
      participantesSelecionados: prev.participantesSelecionados.includes(id)
        ? prev.participantesSelecionados.filter(item => item !== id)
        : [...prev.participantesSelecionados, id],
    }));
  };

  const selecionarTodos = () => {
    setForm(prev => ({ ...prev, participantesSelecionados: participantesFiltrados.map(usuario => usuario.usuarioId) }));
  };

  const limparParticipantes = () => {
    setForm(prev => ({ ...prev, participantesSelecionados: [] }));
  };

  const atualizarCampo = <K extends keyof FormState>(campo: K, valor: FormState[K]) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const validarStep = () => {
    if (step === 0) {
      return Boolean(
        form.titulo.trim() &&
          form.inicioPrevisto &&
          form.filaId &&
          (form.tipo !== 'redistribuicao' || form.redistribuicaoOrigem)
      );
    }
    if (step === 1) {
      return form.participantesSelecionados.length > 0;
    }
    if (step === 2) {
      if (!form.recorrenciaAtiva) return true;
      if (form.recorrenciaTipo === 'semanal') {
        return form.recorrenciaDias.length > 0;
      }
      return Boolean(form.recorrenciaHorario);
    }
    if (step === 3) {
      if (form.enviarNotificacao) {
        return Boolean(form.mensagemNotificacao.trim());
      }
      return true;
    }
    return true;
  };

  const avancar = () => {
    if (!validarStep()) {
      toast.error('Preencha as informações obrigatórias antes de continuar.');
      return;
    }
    setStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const voltar = () => setStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    if (!validarStep()) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }
    try {
      setSubmetendo(true);
      const payload: NovaAcaoPayload = {
        titulo: form.titulo,
        descricao: form.descricao || 'Ação de distribuição configurada manualmente.',
        tipo: form.tipo,
        redistribuicaoOrigem: form.tipo === 'redistribuicao' ? form.redistribuicaoOrigem : undefined,
        origemLeads: form.origemLeads,
        filaId: form.filaId,
        inicioPrevisto: new Date(form.inicioPrevisto).toISOString(),
        terminoPrevisto: form.terminoPrevisto ? new Date(form.terminoPrevisto).toISOString() : null,
        participantes: form.participantesSelecionados,
        recorrencia: form.recorrenciaAtiva
          ? {
              tipo: form.recorrenciaTipo,
              diasSemana: form.recorrenciaTipo === 'semanal' ? form.recorrenciaDias : undefined,
              horario: form.recorrenciaHorario,
              intervalo: form.recorrenciaIntervalo,
              dataFim: form.recorrenciaDataFim ? new Date(form.recorrenciaDataFim).toISOString() : null,
            }
          : undefined,
        enviarNotificacao: form.enviarNotificacao,
        mensagemNotificacao: form.enviarNotificacao ? form.mensagemNotificacao : undefined,
      };

      const acao = await acoesApi.criar(payload);
      toast.success('Ação criada com sucesso.');
      onCompleted(acao.id);
    } catch (error) {
      console.error('Erro ao criar ação', error);
      toast.error('Não foi possível criar a ação. Tente novamente.');
    } finally {
      setSubmetendo(false);
    }
  };

  return (
    <div className="space-y-6">
      <nav aria-label="Progresso da criação" className="rounded-lg border bg-background">
        <ol className="grid gap-4 p-4 sm:grid-cols-4">
          {steps.map((item, index) => {
            const ativo = index === step;
            const concluido = index < step;
            return (
              <li key={item.titulo} className={`rounded-md border p-4 ${ativo ? 'border-primary shadow-sm' : concluido ? 'border-muted-foreground/40' : 'border-border'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.titulo}</span>
                  <Badge variant={ativo ? 'default' : concluido ? 'secondary' : 'outline'}>{index + 1}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{item.descricao}</p>
              </li>
            );
          })}
        </ol>
      </nav>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step].titulo}</CardTitle>
          <CardDescription>{steps[step].descricao}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="titulo">Título da ação</Label>
                <Input id="titulo" value={form.titulo} onChange={event => atualizarCampo('titulo', event.target.value)} placeholder="Ex: Check-in matinal da equipe" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={form.descricao}
                  onChange={event => atualizarCampo('descricao', event.target.value)}
                  placeholder="Explique o objetivo desta ação"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de ação</Label>
                <Select value={form.tipo} onValueChange={value => atualizarCampo('tipo', value as FormState['tipo'])}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkin">Check-in</SelectItem>
                    <SelectItem value="notificacao">Notificação</SelectItem>
                    <SelectItem value="redistribuicao">Redistribuição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fila">Fila de distribuição</Label>
                {carregandoFilas ? (
                  <Skeleton className="h-10" />
                ) : (
                  <Select value={form.filaId} onValueChange={value => atualizarCampo('filaId', value)}>
                    <SelectTrigger id="fila">
                      <SelectValue placeholder="Selecione a fila" />
                    </SelectTrigger>
                    <SelectContent>
                      {filas.map(fila => (
                        <SelectItem key={fila.id} value={fila.id}>
                          {fila.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-xs text-muted-foreground">Leads serão distribuídos conforme as regras desta fila.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="origemLeads">Origem dos leads</Label>
                <Select
                  value={form.origemLeads}
                  onValueChange={value => atualizarCampo('origemLeads', value as FormState['origemLeads'])}
                >
                  <SelectTrigger id="origemLeads">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existentes">Leads já cadastrados</SelectItem>
                    <SelectItem value="upload">Importar via Excel/planilha</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Defina como os leads entram na ação de venda.</p>
              </div>
              {form.tipo === 'redistribuicao' && (
                <div className="space-y-2">
                  <Label htmlFor="redistribuicaoOrigem">Origem dos leads para redistribuição</Label>
                  <Select
                    value={form.redistribuicaoOrigem}
                    onValueChange={value => atualizarCampo('redistribuicaoOrigem', value as FormState['redistribuicaoOrigem'])}
                  >
                    <SelectTrigger id="redistribuicaoOrigem">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="existentes">Leads já existentes no sistema</SelectItem>
                      <SelectItem value="upload">Importar novos leads (upload)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Escolha se a redistribuição usará leads atuais ou se você fará upload de novos registros.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="inicioPrevisto">Início previsto</Label>
                <Input
                  id="inicioPrevisto"
                  type="datetime-local"
                  value={form.inicioPrevisto}
                  onChange={event => atualizarCampo('inicioPrevisto', event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terminoPrevisto">Término previsto</Label>
                <Input
                  id="terminoPrevisto"
                  type="datetime-local"
                  value={form.terminoPrevisto}
                  onChange={event => atualizarCampo('terminoPrevisto', event.target.value)}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="sm:w-80">
                  <Label className="text-sm font-medium">Buscar participante</Label>
                  <Input value={buscaParticipante} onChange={event => setBuscaParticipante(event.target.value)} placeholder="Digite o nome ou e-mail" />
                  {form.filaId && (
                    <p className="mt-1 text-xs text-muted-foreground">Mostrando participantes vinculados à fila selecionada.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={limparParticipantes}>
                    Limpar
                  </Button>
                  <Button variant="outline" size="sm" onClick={selecionarTodos}>
                    Selecionar todos
                  </Button>
                </div>
              </div>
              {carregandoUsuarios ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-16" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {participantesFiltrados.map(usuario => {
                    const selecionado = form.participantesSelecionados.includes(usuario.usuarioId);
                    return (
                      <div
                        key={usuario.usuarioId}
                        className={`flex items-start justify-between rounded-lg border p-4 transition hover:border-primary ${selecionado ? 'border-primary bg-primary/5' : ''}`}
                      >
                        <div className="flex gap-3">
                          <Checkbox
                            checked={selecionado}
                            onCheckedChange={() => toggleParticipante(usuario.usuarioId)}
                            id={`usuario-${usuario.usuarioId}`}
                          />
                          <div>
                            <label htmlFor={`usuario-${usuario.usuarioId}`} className="font-medium leading-none">
                              {usuario.nome}
                            </label>
                            <p className="text-xs text-muted-foreground">{usuario.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {usuario.leadsAtivos} leads ativos • Status: {usuario.status}
                            </p>
                          </div>
                        </div>
                        <Badge variant={usuario.status === 'online' ? 'success' : usuario.status === 'ausente' ? 'warning' : 'secondary'}>
                          {usuario.status === 'online' ? 'Online' : usuario.status === 'ausente' ? 'Ausente' : 'Offline'}
                        </Badge>
                      </div>
                    );
                  })}
                  {participantesFiltrados.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhum participante encontrado com o filtro atual.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="font-medium">Ativar recorrência</h3>
                  <p className="text-sm text-muted-foreground">Defina a frequência e o intervalo de execução da ação.</p>
                </div>
                <Switch checked={form.recorrenciaAtiva} onCheckedChange={checked => atualizarCampo('recorrenciaAtiva', checked)} />
              </div>

              {form.recorrenciaAtiva && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recorrenciaTipo">Tipo de recorrência</Label>
                    <Select
                      value={form.recorrenciaTipo}
                      onValueChange={value => atualizarCampo('recorrenciaTipo', value as FormState['recorrenciaTipo'])}
                    >
                      <SelectTrigger id="recorrenciaTipo">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diaria">Diária</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recorrenciaIntervalo">Intervalo</Label>
                    <Input
                      id="recorrenciaIntervalo"
                      type="number"
                      min={1}
                      value={form.recorrenciaIntervalo}
                      onChange={event => atualizarCampo('recorrenciaIntervalo', Number(event.target.value) || 1)}
                    />
                    <p className="text-xs text-muted-foreground">Número de ciclos entre cada execução.</p>
                  </div>
                  {form.recorrenciaTipo !== 'mensal' && (
                    <div className="space-y-2 md:col-span-2">
                      <Label>Dias da semana</Label>
                      <ToggleGroup
                        type="multiple"
                        value={form.recorrenciaDias}
                        onValueChange={value => atualizarCampo('recorrenciaDias', value as FormState['recorrenciaDias'])}
                        className="flex flex-wrap gap-2"
                      >
                        {['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].map(dia => (
                          <ToggleGroupItem key={dia} value={dia} className="w-12">
                            {dia.toUpperCase()}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                      <p className="text-xs text-muted-foreground">Selecione os dias em que a ação deve ocorrer.</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="recorrenciaHorario">Horário</Label>
                    <Input
                      id="recorrenciaHorario"
                      type="time"
                      value={form.recorrenciaHorario}
                      onChange={event => atualizarCampo('recorrenciaHorario', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recorrenciaDataFim">Data final</Label>
                    <Input
                      id="recorrenciaDataFim"
                      type="date"
                      value={form.recorrenciaDataFim}
                      onChange={event => atualizarCampo('recorrenciaDataFim', event.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-sm">
              <div className="space-y-2">
                <h3 className="font-semibold">Resumo</h3>
                <div className="rounded-lg border bg-muted/40 p-4">
                  <p><strong>Título:</strong> {form.titulo || '—'}</p>
                  <p>
                    <strong>Fila:</strong> {filas.find(f => f.id === form.filaId)?.nome || 'Selecione uma fila'}
                  </p>
                  <p>
                    <strong>Origem dos leads:</strong> {form.origemLeads === 'upload' ? 'Importação (Excel/CSV)' : 'Base existente'}
                  </p>
                  <p><strong>Tipo:</strong> {form.tipo}</p>
                  {form.tipo === 'redistribuicao' && (
                    <p>
                      <strong>Origem dos leads:</strong>{' '}
                      {form.redistribuicaoOrigem === 'upload'
                        ? 'Importar novos leads (upload)'
                        : 'Leads já existentes no sistema'}
                    </p>
                  )}
                  <p><strong>Período:</strong> {new Date(form.inicioPrevisto).toLocaleString('pt-BR')} {form.terminoPrevisto ? `até ${new Date(form.terminoPrevisto).toLocaleString('pt-BR')}` : ''}</p>
                  <p><strong>Participantes:</strong> {form.participantesSelecionados.length}</p>
                  <p>
                    <strong>Recorrência:</strong>{' '}
                    {form.recorrenciaAtiva
                      ? `${form.recorrenciaTipo} • intervalo ${form.recorrenciaIntervalo}${
                          form.recorrenciaTipo !== 'mensal' && form.recorrenciaDias.length > 0
                            ? ` • dias ${form.recorrenciaDias.join(', ').toUpperCase()}`
                            : ''
                        }`
                      : 'Não recorrente'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enviar notificação inicial</h3>
                    <p className="text-xs text-muted-foreground">Ao confirmar, os participantes selecionados receberão esta mensagem.</p>
                  </div>
                  <Switch
                    checked={form.enviarNotificacao}
                    onCheckedChange={checked => atualizarCampo('enviarNotificacao', checked)}
                  />
                </div>
                {form.enviarNotificacao && (
                  <Textarea
                    value={form.mensagemNotificacao}
                    onChange={event => atualizarCampo('mensagemNotificacao', event.target.value)}
                    rows={4}
                    placeholder="Digite a mensagem a ser enviada"
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t bg-muted/40 py-4 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
            {step > 0 && (
              <Button variant="outline" onClick={voltar}>
                Voltar
              </Button>
            )}
          </div>
          <div>
            {step < steps.length - 1 ? (
              <Button onClick={avancar} disabled={!validarStep()}>
                Avançar
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submetendo}>
                {submetendo ? 'Criando...' : 'Concluir ação'}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
