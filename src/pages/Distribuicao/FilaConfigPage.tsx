import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ChevronDown, Plus } from 'lucide-react';
import type { Fila, Regra, UsuarioFila, ConfigHorarioCheckin, ConfigAvancadas } from '@/types/filas';
import { useFilasStore } from '@/state/distribuicao/filas.store';
import UsuarioList from '@/components/distribuicao/usuarios/UsuarioList';
import RegraItem from '@/components/distribuicao/regra/RegraItem';
import HorarioCheckinConfig from '@/components/distribuicao/config/HorarioCheckinConfig';
import ConfigAvancadasPanel from '@/components/distribuicao/config/ConfigAvancadasPanel';
import AddUsuarioDialog from '@/components/distribuicao/config/AddUsuarioDialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  REDISTRIBUICAO_CAMPANHAS,
  REDISTRIBUICAO_CANAIS,
  REDISTRIBUICAO_CORRETORES,
  REDISTRIBUICAO_FASES,
  REDISTRIBUICAO_FILAS,
  REDISTRIBUICAO_FUNIS,
  REDISTRIBUICAO_SLA,
  REDISTRIBUICAO_STATUS,
  REDISTRIBUICAO_TAGS,
  REDISTRIBUICAO_TIPOS_OPERACAO,
  type FilterOption,
} from '@/data/redistribuicaoFilters';

interface RedistribuicaoFiltersState {
  brokerIds: string[];
  pipelineIds: string[];
  stageIds: string[];
  sourceQueueIds: string[];
  targetQueueIds: string[];
  sourceChannels: string[];
  campaignIds: string[];
  tagIds: string[];
  currentStatuses: string[];
  dateFrom: string;
  dateTo: string;
  timeToRedistributeBucket: string;
}

interface RedistribuicaoHistoricoItem {
  id: string;
  motivoId: string;
  motivo: string;
  responsavelId: string;
  responsavel: string;
  responsavelTipo: 'user' | 'system';
  corretorId: string;
  corretor: string;
  filaOrigemId: string;
  filaOrigem: string;
  filaDestinoId: string;
  filaDestino: string;
  tagId: string;
  tag: string;
  criadoEm: string;
  quantidade: number;
  destino: string;
  tipoRedistribuicao: 'automatic' | 'manual';
  tipoOperacao: 'sale' | 'rent' | 'short_stay' | 'launch';
  pipelineId: string;
  stageId: string;
  developmentId?: string;
  propertyId?: string;
  canalOrigem: string;
  campanhaId: string;
  statusAtual: string;
  tempoRedistribuicao: 'lte_5m' | 'lte_15m' | 'lte_1h' | 'lte_24h' | 'gt_24h';
  leadNome: string;
  leadTelefone: string;
  leadEmail: string;
  leadCodigo: string;
}

const REDISTRIBUICAO_HISTORICO: RedistribuicaoHistoricoItem[] = [
  {
    id: 'hist-001',
    motivoId: 'sem-contato',
    motivo: 'Sem contato',
    responsavelId: 'user-ana',
    responsavel: 'Ana Lima',
    responsavelTipo: 'user',
    corretorId: 'broker-ana',
    corretor: 'Ana Lima',
    filaOrigemId: 'fila-geral',
    filaOrigem: 'Fila Geral',
    filaDestinoId: 'fila-premium',
    filaDestino: 'Fila Premium',
    tagId: 'apartamento',
    tag: 'apartamento',
    criadoEm: '2025-01-10T10:15:00Z',
    quantidade: 18,
    destino: 'Fila Premium',
    tipoRedistribuicao: 'automatic',
    tipoOperacao: 'sale',
    pipelineId: 'pipeline-vendas',
    stageId: 'stage-atendimento',
    developmentId: 'dev-vista',
    canalOrigem: 'whatsapp',
    campanhaId: 'camp-whatsapp',
    statusAtual: 'em_atendimento',
    tempoRedistribuicao: 'lte_15m',
    leadNome: 'Mariana Souza',
    leadTelefone: '11999990000',
    leadEmail: 'mariana@exemplo.com',
    leadCodigo: 'LD-2024-001',
  },
  {
    id: 'hist-002',
    motivoId: 'duplicado',
    motivo: 'Duplicado',
    responsavelId: 'system',
    responsavel: 'Sistema',
    responsavelTipo: 'system',
    corretorId: 'broker-juliana',
    corretor: 'Juliana Mendes',
    filaOrigemId: 'fila-campanha',
    filaOrigem: 'Campanha Social',
    filaDestinoId: 'fila-digital',
    filaDestino: 'Fila Digital',
    tagId: 'casa',
    tag: 'casa',
    criadoEm: '2025-01-08T16:45:00Z',
    quantidade: 9,
    destino: 'Fila Digital',
    tipoRedistribuicao: 'automatic',
    tipoOperacao: 'rent',
    pipelineId: 'pipeline-locacao',
    stageId: 'stage-agendamento',
    propertyId: 'prop-101',
    canalOrigem: 'facebook',
    campanhaId: 'camp-facebook',
    statusAtual: 'arquivado',
    tempoRedistribuicao: 'lte_5m',
    leadNome: 'João Pereira',
    leadTelefone: '21988887777',
    leadEmail: 'joao@exemplo.com',
    leadCodigo: 'LD-2024-024',
  },
  {
    id: 'hist-003',
    motivoId: 'sem-interesse',
    motivo: 'Sem interesse',
    responsavelId: 'user-carlos',
    responsavel: 'Carlos Silva',
    responsavelTipo: 'user',
    corretorId: 'broker-lucas',
    corretor: 'Lucas Souza',
    filaOrigemId: 'fila-premium',
    filaOrigem: 'Fila Premium',
    filaDestinoId: 'fila-geral',
    filaDestino: 'Fila Geral',
    tagId: 'comercial',
    tag: 'comercial',
    criadoEm: '2024-12-29T09:00:00Z',
    quantidade: 15,
    destino: 'Fila Geral',
    tipoRedistribuicao: 'manual',
    tipoOperacao: 'launch',
    pipelineId: 'pipeline-orcamento',
    stageId: 'stage-negociacao',
    developmentId: 'dev-mar',
    canalOrigem: 'google',
    campanhaId: 'camp-google',
    statusAtual: 'perdido',
    tempoRedistribuicao: 'gt_24h',
    leadNome: 'Fernanda Lopes',
    leadTelefone: '48988886666',
    leadEmail: 'fernanda@exemplo.com',
    leadCodigo: 'LD-2023-311',
  },
  {
    id: 'hist-004',
    motivoId: 'dados-incompletos',
    motivo: 'Dados incompletos',
    responsavelId: 'user-equipe-digital',
    responsavel: 'Equipe Digital',
    responsavelTipo: 'user',
    corretorId: 'broker-ana',
    corretor: 'Ana Lima',
    filaOrigemId: 'fila-digital',
    filaOrigem: 'Fila Digital',
    filaDestinoId: 'fila-premium',
    filaDestino: 'Fila Premium',
    tagId: 'studio',
    tag: 'studio',
    criadoEm: '2025-02-05T14:25:00Z',
    quantidade: 6,
    destino: 'Fila Premium',
    tipoRedistribuicao: 'manual',
    tipoOperacao: 'short_stay',
    pipelineId: 'pipeline-shortsale',
    stageId: 'stage-visita-proposta',
    developmentId: 'dev-parque',
    canalOrigem: 'indicacao',
    campanhaId: 'camp-organico',
    statusAtual: 'convertido',
    tempoRedistribuicao: 'lte_1h',
    leadNome: 'Ricardo Alves',
    leadTelefone: '31977775555',
    leadEmail: 'ricardo@exemplo.com',
    leadCodigo: 'LD-2024-450',
  },
  {
    id: 'hist-005',
    motivoId: 'tempo-expirado',
    motivo: 'Tempo expirado',
    responsavelId: 'user-equipe-especialista',
    responsavel: 'Equipe Especialista',
    responsavelTipo: 'user',
    corretorId: 'broker-juliana',
    corretor: 'Juliana Mendes',
    filaOrigemId: 'fila-geral',
    filaOrigem: 'Fila Geral',
    filaDestinoId: 'fila-campanha',
    filaDestino: 'Campanha Social',
    tagId: 'terreno',
    tag: 'terreno',
    criadoEm: '2025-02-01T08:10:00Z',
    quantidade: 12,
    destino: 'Campanha Social',
    tipoRedistribuicao: 'automatic',
    tipoOperacao: 'sale',
    pipelineId: 'pipeline-vendas',
    stageId: 'stage-negocio-fechado',
    propertyId: 'prop-202',
    canalOrigem: 'instagram',
    campanhaId: 'camp-instagram',
    statusAtual: 'rearquivado',
    tempoRedistribuicao: 'lte_24h',
    leadNome: 'Patricia Oliveira',
    leadTelefone: '11911112222',
    leadEmail: 'patricia@exemplo.com',
    leadCodigo: 'LD-2024-512',
  },
];

const defaultRedistribuicaoFilters: RedistribuicaoFiltersState = {
  brokerIds: [],
  pipelineIds: [],
  stageIds: [],
  sourceQueueIds: [],
  targetQueueIds: [],
  sourceChannels: [],
  campaignIds: [],
  tagIds: [],
  currentStatuses: [],
  dateFrom: '',
  dateTo: '',
  timeToRedistributeBucket: 'todos',
};

interface MultiSelectProps {
  value: string[];
  options: FilterOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (next: string[]) => void;
}

function MultiSelect({ value, options, placeholder = 'Todos', disabled, onChange }: MultiSelectProps) {
  const labels = options.filter(option => value.includes(option.value)).map(option => option.label);
  const summary = labels.length === 0
    ? placeholder
    : labels.length <= 2
      ? labels.join(', ')
      : `${labels.length} selecionados`;

  const toggleValue = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange(Array.from(new Set([...value, optionValue])));
      return;
    }
    onChange(value.filter(item => item !== optionValue));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          <span className="truncate">{summary}</span>
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-64 overflow-y-auto">
        {options.map(option => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={checked => toggleValue(option.value, Boolean(checked))}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
        {options.length === 0 && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">Nenhuma opção disponível</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function FilaConfigPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    filas,
    carregarFilas,
    atualizarFila,
    excluirFila,
  } = useFilasStore();
  const [fila, setFila] = useState<Fila | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addUsuarioOpen, setAddUsuarioOpen] = useState(false);
  const [redistribuicaoArquivo, setRedistribuicaoArquivo] = useState<File | null>(null);
  const [redistribuicaoFilters, setRedistribuicaoFilters] = useState<RedistribuicaoFiltersState>(
    defaultRedistribuicaoFilters,
  );
  const availableStages = useMemo(() => {
    return redistribuicaoFilters.pipelineIds.flatMap(pipelineId => REDISTRIBUICAO_FASES[pipelineId] ?? []);
  }, [redistribuicaoFilters.pipelineIds]);

  const filteredCampaigns = useMemo(() => {
    if (redistribuicaoFilters.sourceChannels.length === 0) return REDISTRIBUICAO_CAMPANHAS;
    return REDISTRIBUICAO_CAMPANHAS.filter(campaign =>
      redistribuicaoFilters.sourceChannels.includes(campaign.channel),
    );
  }, [redistribuicaoFilters.sourceChannels]);

  const filtrosAtivos = useMemo(() => {
    let count = 0;
    if (redistribuicaoFilters.brokerIds.length) count++;
    if (redistribuicaoFilters.pipelineIds.length) count++;
    if (redistribuicaoFilters.stageIds.length) count++;
    if (redistribuicaoFilters.sourceQueueIds.length) count++;
    if (redistribuicaoFilters.targetQueueIds.length) count++;
    if (redistribuicaoFilters.tagIds.length) count++;
    if (redistribuicaoFilters.currentStatuses.length) count++;
    if (redistribuicaoFilters.sourceChannels.length) count++;
    if (redistribuicaoFilters.campaignIds.length) count++;
    if (redistribuicaoFilters.dateFrom) count++;
    if (redistribuicaoFilters.dateTo) count++;
    if (redistribuicaoFilters.timeToRedistributeBucket !== 'todos') count++;
    return count;
  }, [redistribuicaoFilters]);

  const filtroPayload = useMemo(() => {
    return {
      filter: {
        broker_ids: redistribuicaoFilters.brokerIds,
        pipeline_ids: redistribuicaoFilters.pipelineIds,
        stage_ids: redistribuicaoFilters.stageIds,
        source_queue_ids: redistribuicaoFilters.sourceQueueIds,
        target_queue_ids: redistribuicaoFilters.targetQueueIds,
        source_channels: redistribuicaoFilters.sourceChannels,
        campaign_ids: redistribuicaoFilters.campaignIds,
        tag_ids: redistribuicaoFilters.tagIds,
        current_statuses: redistribuicaoFilters.currentStatuses,
        date_from: redistribuicaoFilters.dateFrom || undefined,
        date_to: redistribuicaoFilters.dateTo || undefined,
        time_to_redistribute_bucket:
          redistribuicaoFilters.timeToRedistributeBucket === 'todos'
            ? undefined
            : redistribuicaoFilters.timeToRedistributeBucket,
      },
      pagination: {
        page: 1,
        per_page: 20,
      },
      order_by: 'archived_at desc',
    };
  }, [redistribuicaoFilters]);

  const historicoFiltrado = useMemo(() => {
    return REDISTRIBUICAO_HISTORICO.filter(evento => {
      if (redistribuicaoFilters.brokerIds.length && !redistribuicaoFilters.brokerIds.includes(evento.corretorId)) {
        return false;
      }
      if (
        redistribuicaoFilters.pipelineIds.length &&
        !redistribuicaoFilters.pipelineIds.includes(evento.pipelineId)
      ) {
        return false;
      }
      if (redistribuicaoFilters.stageIds.length && !redistribuicaoFilters.stageIds.includes(evento.stageId)) {
        return false;
      }
      if (
        redistribuicaoFilters.sourceQueueIds.length &&
        !redistribuicaoFilters.sourceQueueIds.includes(evento.filaOrigemId)
      ) {
        return false;
      }
      if (
        redistribuicaoFilters.targetQueueIds.length &&
        !redistribuicaoFilters.targetQueueIds.includes(evento.filaDestinoId)
      ) {
        return false;
      }
      if (redistribuicaoFilters.sourceChannels.length && !redistribuicaoFilters.sourceChannels.includes(evento.canalOrigem)) {
        return false;
      }
      if (redistribuicaoFilters.campaignIds.length && !redistribuicaoFilters.campaignIds.includes(evento.campanhaId)) {
        return false;
      }
      if (redistribuicaoFilters.tagIds.length && !redistribuicaoFilters.tagIds.includes(evento.tagId)) {
        return false;
      }
      if (
        redistribuicaoFilters.currentStatuses.length &&
        !redistribuicaoFilters.currentStatuses.includes(evento.statusAtual)
      ) {
        return false;
      }
      if (
        redistribuicaoFilters.timeToRedistributeBucket !== 'todos' &&
        evento.tempoRedistribuicao !== redistribuicaoFilters.timeToRedistributeBucket
      ) {
        return false;
      }

      const dataEvento = new Date(evento.criadoEm).getTime();
      if (redistribuicaoFilters.dateFrom) {
        const inicio = new Date(redistribuicaoFilters.dateFrom).setHours(0, 0, 0, 0);
        if (dataEvento < inicio) return false;
      }
      if (redistribuicaoFilters.dateTo) {
        const fim = new Date(redistribuicaoFilters.dateTo).setHours(23, 59, 59, 999);
        if (dataEvento > fim) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
  }, [redistribuicaoFilters]);

  useEffect(() => {
    const loadFila = async () => {
      if (!id) return;
      try {
        setLoading(true);
        if (!filas.length) {
          await carregarFilas();
        }
        const found = useFilasStore.getState().filas.find(f => f.id === id);
        if (found) {
          setFila(found);
        } else {
          toast.error('Fila não encontrada');
          navigate('/distribuicao');
        }
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar fila');
      } finally {
        setLoading(false);
      }
    };
    loadFila();
  }, [id, navigate, carregarFilas, filas.length]);

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
        navigate('/distribuicao');
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    if (!fila) return;
    if (!fila.nome.trim()) {
      toast.error('Nome da fila é obrigatório');
      return;
    }
    if (fila.regras.length === 0) {
      toast.error('Adicione pelo menos uma regra');
      return;
    }
    try {
      setSaving(true);
      await atualizarFila(fila);
      toast.success('Fila salva com sucesso');
      navigate('/distribuicao');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar fila');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/distribuicao');
  };

  const handleDelete = async () => {
    if (!fila) return;
    try {
      setDeleting(true);
      await excluirFila(fila.id);
      toast.success('Fila excluída com sucesso');
      navigate('/distribuicao');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir fila');
    } finally {
      setDeleting(false);
    }
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFila(prev => (prev ? { ...prev, nome: value } : prev));
  };

  const handleTipoChange = (value: string) => {
    setFila(prev => (prev ? { ...prev, tipo: value as Fila['tipo'] } : prev));
  };

  const handleAddRegra = () => {
    setFila(prev =>
      prev
        ? {
            ...prev,
            regras: [
              ...prev.regras,
              { id: Date.now().toString(), campo: 'titulo', operador: 'igual', valor: '' },
            ],
          }
        : prev
    );
  };

  const handleRegraChange = (idRegra: string, changes: Partial<Regra>) => {
    setFila(prev =>
      prev
        ? {
            ...prev,
            regras: prev.regras.map(r => (r.id === idRegra ? { ...r, ...changes } : r)),
          }
        : prev
    );
  };

  const handleDuplicateRegra = (idRegra: string) => {
    setFila(prev =>
      prev
        ? {
            ...prev,
            regras: prev.regras.flatMap(r =>
              r.id === idRegra
                ? [
                    r,
                    { ...r, id: Date.now().toString() },
                  ]
                : [r]
            ),
          }
        : prev
    );
  };

  const handleRemoveRegra = (idRegra: string) => {
    setFila(prev =>
      prev ? { ...prev, regras: prev.regras.filter(r => r.id !== idRegra) } : prev
    );
  };

  const handleUsuariosChange = async (usuarios: UsuarioFila[]) => {
    setFila(prev => {
      if (!prev) return prev;
      const ativos = usuarios.filter(u => u.ativo).length;
      const proximo = usuarios.find(u => u.ativo)?.id;
      return { ...prev, usuarios, ativosNaFila: ativos, proximoUsuarioId: proximo };
    });
    try {
      if (fila) {
        const ativos = usuarios.filter(u => u.ativo).length;
        const proximo = usuarios.find(u => u.ativo)?.id;
        await atualizarFila({
          id: fila.id,
          usuarios,
          ativosNaFila: ativos,
          proximoUsuarioId: proximo
        });
      }
    } catch (err) {
      console.error('Erro ao atualizar usuários da fila', err);
    }
  };

  const handleAddUsuario = (usuario: UsuarioFila) => {
    setFila(prev => {
      if (!prev) return prev;
      const updatedUsuarios = [...prev.usuarios, usuario];
      const ativos = updatedUsuarios.filter(u => u.ativo).length;
      return { ...prev, usuarios: updatedUsuarios, ativosNaFila: ativos };
    });
  };

  const handleResetRedistribuicao = () => {
    setRedistribuicaoFilters(defaultRedistribuicaoFilters);
  };

  const handleOpenRedistribuicaoHistory = () => {
    navigate('/distribuicao/redistribuicao', {
      state: {
        filter: filtroPayload.filter,
        pagination: filtroPayload.pagination,
        orderBy: filtroPayload.order_by,
      },
    });
  };

  useEffect(() => {
    if (redistribuicaoFilters.pipelineIds.length === 0 && redistribuicaoFilters.stageIds.length > 0) {
      setRedistribuicaoFilters(prev => ({ ...prev, stageIds: [] }));
    }
  }, [redistribuicaoFilters.pipelineIds, redistribuicaoFilters.stageIds.length]);

  useEffect(() => {
    if (redistribuicaoFilters.pipelineIds.length === 0) return;
    const availableStageIds = new Set(availableStages.map(stage => stage.value));
    const nextStages = redistribuicaoFilters.stageIds.filter(stageId => availableStageIds.has(stageId));
    if (nextStages.length !== redistribuicaoFilters.stageIds.length) {
      setRedistribuicaoFilters(prev => ({ ...prev, stageIds: nextStages }));
    }
  }, [availableStages, redistribuicaoFilters.pipelineIds.length, redistribuicaoFilters.stageIds]);

  useEffect(() => {
    const availableCampaignIds = new Set(filteredCampaigns.map(campaign => campaign.value));
    const nextCampaigns = redistribuicaoFilters.campaignIds.filter(campaignId => availableCampaignIds.has(campaignId));
    if (nextCampaigns.length !== redistribuicaoFilters.campaignIds.length) {
      setRedistribuicaoFilters(prev => ({ ...prev, campaignIds: nextCampaigns }));
    }
  }, [filteredCampaigns, redistribuicaoFilters.campaignIds]);

  const handleArquivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setRedistribuicaoArquivo(file ?? null);
  };

  const handleUploadRedistribuicao = () => {
    if (!redistribuicaoArquivo) {
      toast.error('Selecione um arquivo Excel ou CSV para importar.');
      return;
    }
    toast.success(`Arquivo ${redistribuicaoArquivo.name} pronto para redistribuição automática.`);
    setRedistribuicaoArquivo(null);
  };

  const formatarDataHistorico = (valor: string) => {
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '-';
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleHorarioCheckinChange = (config: ConfigHorarioCheckin) => {
    setFila(prev => (prev ? { ...prev, configHorarioCheckin: config } : prev));
  };

  const handleConfigAvancadasChange = (config: ConfigAvancadas) => {
    setFila(prev => (prev ? { ...prev, configAvancadas: config } : prev));
  };

  if (loading || !fila) {
    return (
      <ResponsiveLayout activeTab="distribuicao" setActiveTab={handleMainTabChange}>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Carregando...</div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activeTab="distribuicao" setActiveTab={handleMainTabChange}>
      <div className="p-6 space-y-6 bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Configurar fila</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as regras e usuários desta fila de distribuição
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              disabled={saving || deleting}
              className="rounded-xl border-border hover:bg-muted/50"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="rounded-xl"
            >
              {deleting ? 'Excluindo...' : 'Excluir fila'}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || deleting}
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-border shadow-sm">
          <Accordion type="multiple" defaultValue={['tipo-nome', 'regras']} className="w-full">
            {/* Tipo e Nome */}
            <AccordionItem value="tipo-nome" className="border-b border-border px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <span className="text-base font-medium text-foreground">Tipo de fila e Nome</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Tipo</label>
                    <Select value={fila.tipo} onValueChange={handleTipoChange}>
                      <SelectTrigger className="w-full rounded-xl border-border h-11">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-white border-border">
                        <SelectItem value="Personalizada" className="rounded-lg">Personalizada</SelectItem>
                        <SelectItem value="Padrão" className="rounded-lg">Padrão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nome</label>
                    <Input 
                      value={fila.nome} 
                      onChange={handleNomeChange} 
                      placeholder="Nome da fila" 
                      className="rounded-xl border-border h-11"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Regras */}
            <AccordionItem value="regras" className="border-b border-border px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <span className="text-base font-medium text-foreground">Regras</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-3">
                  {fila.regras.map(regra => (
                    <RegraItem
                      key={regra.id}
                      regra={regra}
                      onChange={handleRegraChange}
                      onAdd={handleAddRegra}
                      onDuplicate={handleDuplicateRegra}
                      onRemove={handleRemoveRegra}
                      disableRemove={fila.regras.length <= 1}
                    />
                  ))}
                  {fila.regras.length === 0 && (
                    <Button 
                      variant="outline" 
                      onClick={handleAddRegra}
                      className="rounded-xl border-dashed border-border hover:border-primary hover:bg-primary/5"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar regra
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Configurações de Horário e Check-in */}
            <AccordionItem value="horario" className="border-b border-border px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <span className="text-base font-medium text-foreground">Configurações de horário e check-in</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <HorarioCheckinConfig
                  config={fila.configHorarioCheckin}
                  filaId={fila.id}
                  onChange={handleHorarioCheckinChange}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Usuários ativos na fila */}
            <AccordionItem value="usuarios" className="border-b border-border px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-foreground">Usuários ativos na fila</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddUsuarioOpen(true);
                    }}
                    className="rounded-full h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <UsuarioList
                  filaId={fila.id}
                  usuarios={fila.usuarios}
                  onChange={handleUsuariosChange}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Redistribuição */}
            <AccordionItem value="redistribuicao" className="border-b border-border px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <span className="text-base font-medium text-foreground">Redistribuição</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-6">
                  <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Filtros completos</p>
                        <p className="text-sm text-muted-foreground">
                          Filtre por corretor, funil, fase do funil, fila de origem/destino, canal, campanha, tipo de
                          imóvel, status atual, período da redistribuição e SLA.
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleOpenRedistribuicaoHistory}>
                        Abrir aba de redistribuição
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Corretor</Label>
                        <MultiSelect
                          value={redistribuicaoFilters.brokerIds}
                          options={REDISTRIBUICAO_CORRETORES}
                          placeholder="Todos"
                          onChange={brokerIds => setRedistribuicaoFilters(prev => ({ ...prev, brokerIds }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Funil</Label>
                        <MultiSelect
                          value={redistribuicaoFilters.pipelineIds}
                          options={REDISTRIBUICAO_FUNIS}
                          placeholder="Todos"
                          onChange={pipelineIds => setRedistribuicaoFilters(prev => ({ ...prev, pipelineIds }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fase do funil</Label>
                        <MultiSelect
                          value={redistribuicaoFilters.stageIds}
                          options={availableStages}
                          placeholder="Todas"
                          disabled={redistribuicaoFilters.pipelineIds.length === 0}
                          onChange={stageIds => setRedistribuicaoFilters(prev => ({ ...prev, stageIds }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fila de origem</Label>
                        <MultiSelect
                          value={redistribuicaoFilters.sourceQueueIds}
                          options={REDISTRIBUICAO_FILAS}
                          placeholder="Todas"
                          onChange={sourceQueueIds => setRedistribuicaoFilters(prev => ({ ...prev, sourceQueueIds }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fila de destino</Label>
                        <MultiSelect
                          value={redistribuicaoFilters.targetQueueIds}
                          options={REDISTRIBUICAO_FILAS}
                          placeholder="Todas"
                          onChange={targetQueueIds => setRedistribuicaoFilters(prev => ({ ...prev, targetQueueIds }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Canal de origem</Label>
                        <MultiSelect
                          value={redistribuicaoFilters.sourceChannels}
                          options={REDISTRIBUICAO_CANAIS}
                          placeholder="Todos"
                          onChange={sourceChannels => setRedistribuicaoFilters(prev => ({ ...prev, sourceChannels }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Campanha</Label>
                        <MultiSelect
                          value={redistribuicaoFilters.campaignIds}
                          options={filteredCampaigns.map(campaign => ({ value: campaign.value, label: campaign.label }))}
                          placeholder="Todas"
                          onChange={campaignIds => setRedistribuicaoFilters(prev => ({ ...prev, campaignIds }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tipo de imóvel</Label>
                        <MultiSelect
                          value={redistribuicaoFilters.tagIds}
                          options={REDISTRIBUICAO_TAGS}
                          placeholder="Todas"
                          onChange={tagIds => setRedistribuicaoFilters(prev => ({ ...prev, tagIds }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Status atual do lead</Label>
                        <MultiSelect
                          value={redistribuicaoFilters.currentStatuses}
                          options={REDISTRIBUICAO_STATUS}
                          placeholder="Todos"
                          onChange={currentStatuses => setRedistribuicaoFilters(prev => ({ ...prev, currentStatuses }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Data da redistribuição</Label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">A partir de</span>
                            <Input
                              type="date"
                              value={redistribuicaoFilters.dateFrom}
                              onChange={event =>
                                setRedistribuicaoFilters(prev => ({ ...prev, dateFrom: event.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Até</span>
                            <Input
                              type="date"
                              value={redistribuicaoFilters.dateTo}
                              onChange={event => setRedistribuicaoFilters(prev => ({ ...prev, dateTo: event.target.value }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tempo até redistribuição (SLA)</Label>
                        <Select
                          value={redistribuicaoFilters.timeToRedistributeBucket}
                          onValueChange={value =>
                            setRedistribuicaoFilters(prev => ({ ...prev, timeToRedistributeBucket: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            {REDISTRIBUICAO_SLA.map(item => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                    </div>

                    <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                      <span>{filtrosAtivos} filtro(s) aplicados</span>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" size="sm" onClick={handleResetRedistribuicao} disabled={!filtrosAtivos}>
                          Limpar filtros
                        </Button>
                        <Button size="sm" onClick={handleOpenRedistribuicaoHistory}>
                          Ver histórico na aba
                        </Button>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border bg-white">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Motivo</th>
                            <th className="px-4 py-3 font-semibold">Responsável</th>
                            <th className="px-4 py-3 font-semibold">Corretor</th>
                            <th className="px-4 py-3 font-semibold">Tipo de operação</th>
                            <th className="px-4 py-3 font-semibold">Fila de origem</th>
                            <th className="px-4 py-3 font-semibold">Tag</th>
                            <th className="px-4 py-3 font-semibold">Arquivado em</th>
                            <th className="px-4 py-3 font-semibold text-right">Quantidade</th>
                            <th className="px-4 py-3 font-semibold">Destino</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historicoFiltrado.map(item => (
                            <tr key={item.id} className="border-t text-foreground">
                              <td className="px-4 py-3">{item.motivo}</td>
                              <td className="px-4 py-3">{item.responsavel}</td>
                              <td className="px-4 py-3">{item.corretor}</td>
                              <td className="px-4 py-3">
                                {REDISTRIBUICAO_TIPOS_OPERACAO.find(tipo => tipo.value === item.tipoOperacao)?.label ?? item.tipoOperacao}
                              </td>
                              <td className="px-4 py-3">{item.filaOrigem}</td>
                              <td className="px-4 py-3 capitalize">{item.tag}</td>
                              <td className="px-4 py-3 text-muted-foreground">{formatarDataHistorico(item.criadoEm)}</td>
                              <td className="px-4 py-3 text-right font-semibold">{item.quantidade}</td>
                              <td className="px-4 py-3">{item.destino}</td>
                            </tr>
                          ))}
                          {historicoFiltrado.length === 0 && (
                            <tr>
                              <td className="px-4 py-6 text-center text-muted-foreground" colSpan={9}>
                                Nenhum registro encontrado com os filtros selecionados.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-border bg-white p-5">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Adicionar lote</p>
                      <p className="text-sm text-muted-foreground">
                        Faça o upload de um arquivo Excel ou CSV para redistribuir automaticamente os leads do lote.
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="cursor-pointer"
                      onChange={handleArquivoChange}
                    />
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                      <span>Formatos suportados: .xlsx, .xls e .csv</span>
                      <Button size="sm" onClick={handleUploadRedistribuicao}>
                        Upload e redistribuir
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Configurações avançadas */}
            <AccordionItem value="avancadas" className="px-6 border-none">
              <AccordionTrigger className="hover:no-underline py-5">
                <span className="text-base font-medium text-foreground">Configurações avançadas</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <ConfigAvancadasPanel
                  config={fila.configAvancadas}
                  onChange={handleConfigAvancadasChange}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Dialog para adicionar usuário */}
      <AddUsuarioDialog
        open={addUsuarioOpen}
        onOpenChange={setAddUsuarioOpen}
        onAdd={handleAddUsuario}
        existingUserIds={fila.usuarios.map(u => u.id)}
      />
    </ResponsiveLayout>
  );
}
