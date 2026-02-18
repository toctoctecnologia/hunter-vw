import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LocacaoModuleLayout } from '@/layouts/LocacaoModuleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  Calendar,
  ChevronRight,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Receipt,
  RefreshCw,
  Send,
  User,
  Users,
  Wallet,
  CheckSquare,
  Upload,
  Eye,
  Download,
  Ban,
  AlertTriangle,
  Trash2,
  Copy,
  Wrench,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NovaFaturaModal } from '@/components/gestao-locacao/NovaFaturaModal';
import { NovoLancamentoModal } from '@/components/gestao-locacao/NovoLancamentoModal';
import { VisualizarDocumentoModal } from '@/components/gestao-locacao/VisualizarDocumentoModal';
import { useToast } from '@/hooks/use-toast';
import { getGestaoLocacaoService } from '@/services/gestao-locacao/getGestaoLocacaoService';
import { listScheduledEvents } from '@/services/gestao-locacao/agendaCobrancaService';
import type { ContractBeneficiary } from '@/services/gestao-locacao/gestaoLocacaoService';
import type { ContractTask } from '@/mocks/gestao-locacao/tasks.mock';
import type { ContractNote } from '@/mocks/gestao-locacao/notes.mock';

type AgendaEvento = ReturnType<typeof listScheduledEvents>['items'][number];

const mockLancamentos = [
  { id: '1', categoria: 'Aluguel', competencia: 'Out/2024', debitoDe: 'Locatário', creditoPara: 'Locador', valor: 'R$ 2.500,00', vencimento: '10/10/2024', status: 'Pendente' },
  { id: '2', categoria: 'Condomínio', competencia: 'Out/2024', debitoDe: 'Locatário', creditoPara: 'Condomínio', valor: 'R$ 450,00', vencimento: '10/10/2024', status: 'Pendente' },
  { id: '3', categoria: 'IPTU', competencia: 'Out/2024', debitoDe: 'Locatário', creditoPara: 'Prefeitura', valor: 'R$ 180,00', vencimento: '10/10/2024', status: 'Pago' },
];

const mockDocumentos = [
  { id: '1', nome: 'Contrato assinado.pdf', tipo: 'anexo', data: '18/10/2022' },
  { id: '2', nome: 'Vistoria de entrada.pdf', tipo: 'anexo', data: '18/10/2022' },
];

const mockReparos = [
  {
    id: '1',
    titulo: 'Troca do registro do banheiro',
    solicitante: 'Luiz Victor Ferreira',
    data: '05/11/2024',
    status: 'Em andamento',
  },
  {
    id: '2',
    titulo: 'Reparo no ar-condicionado',
    solicitante: 'Luiz Victor Ferreira',
    data: '18/10/2024',
    status: 'Concluído',
  },
];

export const ContratoDetalhesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('contrato');
  const [novaNota, setNovaNota] = useState('');
  const [novaFaturaOpen, setNovaFaturaOpen] = useState(false);
  const [novoLancamentoOpen, setNovoLancamentoOpen] = useState(false);
  const [visualizarDocOpen, setVisualizarDocOpen] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState<typeof mockDocumentos[0] | null>(null);
  const [beneficiarioSelecionado, setBeneficiarioSelecionado] = useState<ContractBeneficiary | null>(null);
  const [beneficiarios, setBeneficiarios] = useState<ContractBeneficiary[]>([]);
  const [editarBeneficiario, setEditarBeneficiario] = useState(false);
  const [tarefas, setTarefas] = useState<ContractTask[]>([]);
  const [notas, setNotas] = useState<ContractNote[]>([]);
  const [agendaEventosLocal, setAgendaEventosLocal] = useState<AgendaEvento[]>([]);
  const [novaTarefaOpen, setNovaTarefaOpen] = useState(false);
  const [novaTarefaTitulo, setNovaTarefaTitulo] = useState('');
  const [novaTarefaResponsavel, setNovaTarefaResponsavel] = useState('');
  const [novaTarefaData, setNovaTarefaData] = useState('');
  const [cancelarContratoOpen, setCancelarContratoOpen] = useState(false);
  const [avisoPrevioOpen, setAvisoPrevioOpen] = useState(false);
  const [excluirContratoOpen, setExcluirContratoOpen] = useState(false);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [motivoAvisoPrevio, setMotivoAvisoPrevio] = useState('');
  const [motivoExclusao, setMotivoExclusao] = useState('');
  const [detalhesEncerramento, setDetalhesEncerramento] = useState('');
  const [detalhesAvisoPrevio, setDetalhesAvisoPrevio] = useState('');
  const [detalhesExclusao, setDetalhesExclusao] = useState('');
  const [reparos, setReparos] = useState(mockReparos);
  const [novoReparoOpen, setNovoReparoOpen] = useState(false);
  const [novoReparoTitulo, setNovoReparoTitulo] = useState('');
  const [novoReparoSolicitante, setNovoReparoSolicitante] = useState('');
  const [novoReparoData, setNovoReparoData] = useState('');

  const gestaoLocacaoService = useMemo(() => getGestaoLocacaoService(), []);
  const contratoId = id ?? '1';
  const contrato =
    gestaoLocacaoService.getContractById(contratoId) ?? gestaoLocacaoService.getContractById('1');
  const faturas = useMemo(
    () =>
      (contrato ? gestaoLocacaoService.listInvoicesByContract(contrato.id) : []).map((fatura) => ({
        id: fatura.id,
        periodo: fatura.competencia,
        valor: fatura.valor,
        vencimento: fatura.vencimento,
        status: fatura.status,
      })),
    [gestaoLocacaoService, contrato?.id]
  );
  const repasses = useMemo(
    () =>
      (contrato ? gestaoLocacaoService.listTransfersByContract(contrato.id) : []).map((repasse) => ({
        id: repasse.id,
        mes: repasse.competencia,
        valor: repasse.valorLiquido,
        data: repasse.dataExecucao ?? repasse.dataPrevista,
        status: repasse.status === 'Concluída' ? 'Executado' : 'Planejado',
      })),
    [gestaoLocacaoService, contrato?.id]
  );
  const agendaEventos = useMemo(
    () => listScheduledEvents({}).items.filter((evento) => evento.contrato === contrato?.codigo),
    [contrato?.codigo]
  );

  useEffect(() => {
    if (!contrato) return;
    setBeneficiarios(gestaoLocacaoService.listContractBeneficiaries(contrato.id));
    setTarefas(gestaoLocacaoService.listTasksByContract(contrato.id));
    setNotas(gestaoLocacaoService.listNotesByContract(contrato.id));
    setAgendaEventosLocal(agendaEventos);
  }, [contrato, gestaoLocacaoService, agendaEventos]);

  const handleAdicionarTarefa = () => {
    if (!novaTarefaTitulo.trim()) return;
    const novaTarefa: ContractTask = {
      id: String(tarefas.length + 1),
      contratoId: contrato?.id ?? '1',
      tarefa: novaTarefaTitulo.trim(),
      responsavel: novaTarefaResponsavel.trim() || 'Equipe Hunter',
      data: novaTarefaData.trim() || 'Hoje',
      concluido: false,
    };
    setTarefas((prev) => [novaTarefa, ...prev]);
    setAgendaEventosLocal((prev) => [
      {
        id: `tarefa-${novaTarefa.id}`,
        contrato: contrato?.codigo ?? '',
        tipo: `Tarefa: ${novaTarefa.tarefa}`,
        data: novaTarefa.data ?? 'Hoje',
        canal: novaTarefa.responsavel,
        acao: 'Acompanhar execução',
        boleto: '-',
        status: 'Previsto',
      },
      ...prev,
    ]);
    setNovaTarefaTitulo('');
    setNovaTarefaResponsavel('');
    setNovaTarefaData('');
    setNovaTarefaOpen(false);
    toast({ title: 'Tarefa adicionada', description: 'A tarefa foi registrada e vinculada à agenda.' });
  };

  const handleConfirmarCancelamento = () => {
    toast({
      title: 'Cancelamento registrado',
      description: motivoCancelamento
        ? `Motivo: ${motivoCancelamento}.`
        : 'Cancelamento registrado com sucesso.',
    });
    setCancelarContratoOpen(false);
    setMotivoCancelamento('');
    setDetalhesEncerramento('');
  };

  const handleConfirmarAvisoPrevio = () => {
    toast({
      title: 'Aviso prévio registrado',
      description: motivoAvisoPrevio
        ? `Motivo: ${motivoAvisoPrevio}.`
        : 'Aviso prévio registrado com sucesso.',
    });
    setAvisoPrevioOpen(false);
    setMotivoAvisoPrevio('');
    setDetalhesAvisoPrevio('');
  };

  const handleConfirmarExclusao = () => {
    toast({
      title: 'Solicitação de exclusão enviada',
      description: motivoExclusao
        ? `Motivo: ${motivoExclusao}.`
        : 'Solicitação registrada para análise.',
    });
    setExcluirContratoOpen(false);
    setMotivoExclusao('');
    setDetalhesExclusao('');
  };

  const handleVisualizarDocumento = (doc: typeof mockDocumentos[0]) => {
    setDocumentoSelecionado(doc);
    setVisualizarDocOpen(true);
  };

  const handleVisualizarFatura = (fatura: (typeof faturas)[0]) => {
    navigate(`/gestao-locacao/faturas/${fatura.id}`);
  };

  const handleReenviarEmail = (fatura: (typeof faturas)[0]) => {
    toast({
      title: 'Email enviado',
      description: `Boleto ${fatura.periodo} reenviado por email.`,
    });
  };

  const handleReenviarWhatsApp = (fatura: (typeof faturas)[0]) => {
    toast({
      title: 'WhatsApp enviado',
      description: `Boleto ${fatura.periodo} reenviado por WhatsApp.`,
    });
  };

  const handleBaixarPDF = (fatura: (typeof faturas)[0]) => {
    toast({
      title: 'Download iniciado',
      description: `Baixando PDF do boleto ${fatura.periodo}...`,
    });
  };

  const handleCriarReparo = () => {
    if (!novoReparoTitulo.trim()) {
      toast({ title: 'Informe o título do reparo' });
      return;
    }

    const reparo = {
      id: String(Date.now()),
      titulo: novoReparoTitulo.trim(),
      solicitante: novoReparoSolicitante.trim() || 'Equipe Hunter',
      data: novoReparoData
        ? new Date(`${novoReparoData}T00:00:00`).toLocaleDateString('pt-BR')
        : new Date().toLocaleDateString('pt-BR'),
      status: 'Em andamento',
    };

    setReparos((prev) => [reparo, ...prev]);
    setNovoReparoTitulo('');
    setNovoReparoSolicitante('');
    setNovoReparoData('');
    setNovoReparoOpen(false);
    toast({ title: 'Reparo criado', description: 'O novo reparo foi registrado no histórico.' });
  };

  const handleDownloadDocumento = (doc: typeof mockDocumentos[0]) => {
    toast({
      title: 'Download iniciado',
      description: `Baixando ${doc.nome}...`,
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Ativo': 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
      'Em encerramento': 'bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]',
      'Pendente': 'bg-[hsl(var(--accent)/0.16)] text-[hsl(var(--accent))]',
      'Encerrado': 'bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)]',
      'Pago': 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
      'Planejado': 'bg-[hsl(var(--accent)/0.16)] text-[hsl(var(--accent))]',
      'Executado': 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
    };
    return <Badge className={`${styles[status] || 'bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)]'} rounded-lg px-2.5 py-0.5 text-xs font-medium`}>{status}</Badge>;
  };

  const handleSelecionarBeneficiario = (beneficiario: ContractBeneficiary) => {
    setBeneficiarioSelecionado(beneficiario);
    setEditarBeneficiario(false);
  };

  const handleSalvarBeneficiario = () => {
    if (!beneficiarioSelecionado) return;
    setBeneficiarios((prev) =>
      prev.map((item) => (item.id === beneficiarioSelecionado.id ? beneficiarioSelecionado : item))
    );
    setEditarBeneficiario(false);
    toast({ title: 'Dados atualizados', description: 'Alterações salvas no modo mock.' });
  };

  const handleCopiarDados = async () => {
    if (!beneficiarioSelecionado) return;
    const texto = `${beneficiarioSelecionado.nome} • ${beneficiarioSelecionado.banco} Ag ${beneficiarioSelecionado.agencia} CC ${beneficiarioSelecionado.conta}`;
    try {
      await navigator.clipboard.writeText(texto);
      toast({ title: 'Dados copiados', description: 'Informações copiadas para a área de transferência.' });
    } catch {
      toast({ title: 'Copiar dados', description: texto });
    }
  };

  if (!contrato) {
    return (
      <LocacaoModuleLayout
        breadcrumbItems={[
          { label: 'INÍCIO', href: '/gestao-locacao' },
          { label: 'CONTRATOS DE LOCAÇÃO', href: '/gestao-locacao/contratos' },
        ]}
      >
        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardContent className="p-6 text-sm text-[var(--ui-text-subtle)]">
            Nenhum contrato encontrado para o identificador informado.
          </CardContent>
        </Card>
      </LocacaoModuleLayout>
    );
  }

  return (
    <LocacaoModuleLayout
      breadcrumbItems={[
        { label: 'INÍCIO', href: '/gestao-locacao' },
        { label: 'CONTRATOS DE LOCAÇÃO', href: '/gestao-locacao/contratos' },
        { label: contrato.codigo },
      ]}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[var(--ui-text)]">
                Contrato {contrato.codigo}
              </h1>
              {getStatusBadge(contrato.status)}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--ui-text-subtle)]">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {contrato.imovel.tipo} - {contrato.imovel.endereco.split(',').slice(0, 2).join(',')}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {contrato.locatarios[0]?.nome}
              </span>
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                {contrato.valores.aluguel}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Próx. reajuste: {contrato.proximoReajuste}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="rounded-xl h-10">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              className="rounded-xl h-10"
              onClick={() => setNovoLancamentoOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo lançamento
            </Button>
            <Button 
              className="rounded-xl h-10 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
              onClick={() => setNovaFaturaOpen(true)}
            >
              <Receipt className="w-4 h-4 mr-2" />
              Novo boleto
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl h-10 w-10">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem className="cursor-pointer" onSelect={() => setCancelarContratoOpen(true)}>
                  <Ban className="w-4 h-4 mr-2" />
                  Cancelar contrato
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onSelect={() => setAvisoPrevioOpen(true)}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Registrar aviso prévio
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-[hsl(var(--danger))]" onSelect={() => setExcluirContratoOpen(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-0 border-b border-[var(--ui-stroke)]">
                <TabsList className="bg-transparent p-0 h-auto gap-2 w-full flex flex-wrap sm:flex-nowrap overflow-x-auto">
                  {[
                    { value: 'contrato', label: 'Contrato', icon: FileText },
                    { value: 'lancamentos', label: 'Lançamentos', icon: Wallet },
                    { value: 'faturas', label: 'Boletos', icon: Receipt },
                    { value: 'repasses', label: 'Transferências', icon: RefreshCw },
                    { value: 'documentos', label: 'Documentos', icon: FileText },
                    { value: 'reparos', label: 'Reparos', icon: Wrench },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={cn(
                        "rounded-lg border border-transparent px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                        "data-[state=active]:border-[hsl(var(--accent))] data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:bg-[hsl(var(--accent)/0.12)]",
                        "data-[state=inactive]:text-[var(--ui-text-subtle)] hover:text-[var(--ui-text)]"
                      )}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardHeader>

              <CardContent className="p-6">
                {/* Tab: Contrato */}
                <TabsContent value="contrato" className="mt-0 space-y-6">
                  {/* Informações Gerais */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Informações Gerais
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Imóvel</p>
                        <p className="text-sm text-[hsl(var(--link))] font-medium">{contrato.imovel.tipo} | {contrato.imovel.codigo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Finalidade</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.finalidade}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Responsável</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.responsavel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Duração</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.duracao}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Data de início</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.dataInicio}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Próximo reajuste</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.proximoReajuste}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[var(--ui-stroke)]" />

                  {/* Locadores e Beneficiários */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Locadores e Beneficiários
                    </h3>
                    <div className="space-y-3">
                      {beneficiarios.map((locador) => (
                        <button
                          key={locador.id}
                          type="button"
                          onClick={() => handleSelecionarBeneficiario(locador)}
                          className="w-full text-left flex items-center justify-between p-3 bg-[var(--ui-stroke)]/20 rounded-xl hover:bg-[var(--ui-stroke)]/40 transition"
                        >
                          <div>
                            <p className="text-sm font-medium text-[hsl(var(--link))]">{locador.nome}</p>
                            <p className="text-xs text-[var(--ui-text-subtle)]">
                              {locador.banco} - Ag: {locador.agencia} / CC: {locador.conta}
                            </p>
                          </div>
                          <Badge className="bg-[hsl(var(--accent)/0.16)] text-[hsl(var(--accent))] rounded-lg">{locador.percentual}%</Badge>
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-[var(--ui-stroke)]" />

                  {/* Locatários e Ocupantes */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Locatários e Ocupantes
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs text-[var(--ui-text-subtle)]">Locatário (assina o contrato)</p>
                        {contrato.locatarios.map((locatario, index) => (
                          <div key={index} className="p-3 bg-[var(--ui-stroke)]/20 rounded-xl">
                            <p className="text-sm font-medium text-[hsl(var(--link))]">{locatario.nome}</p>
                            <p className="text-xs text-[var(--ui-text-subtle)]">CPF: {locatario.cpf}</p>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-[var(--ui-text-subtle)]">Ocupantes (moram no imóvel)</p>
                        {contrato.ocupantes.map((ocupante, index) => (
                          <div key={index} className="p-3 bg-[var(--ui-stroke)]/20 rounded-xl">
                            <p className="text-sm font-medium text-[var(--ui-text)]">{ocupante.nome}</p>
                            <p className="text-xs text-[var(--ui-text-subtle)]">{ocupante.parentesco}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-[var(--ui-stroke)]" />

                  {/* Valores e Taxas */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Valores e Taxas
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Aluguel</p>
                        <p className="text-sm font-semibold text-[var(--ui-text)]">{contrato.valores.aluguel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Índice de reajuste</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.valores.indiceReajuste}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Taxa de administração</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.valores.taxaAdministracao}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Taxa de intermediação</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.valores.taxaIntermediacao}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Taxa bancária</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.valores.taxaBancaria}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Multa</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.valores.multa}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Juros</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.valores.juros}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[var(--ui-stroke)]" />

                  {/* Boletos e Cobrança */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                      <Receipt className="w-4 h-4" />
                      Boletos e Cobrança
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Forma de pagamento</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.faturamento.formaPagamento}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Vencimento</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.faturamento.vencimento}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Tipo</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.faturamento.prePago ? 'Pré-pago' : 'Pós-pago'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Boleto automático</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.faturamento.faturaAutomatica ? `Sim, ${contrato.faturamento.diasAntecedencia} dias antes` : 'Não'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-[var(--ui-text-subtle)]">Canais de envio</p>
                        <div className="flex gap-2 mt-1">
                          {contrato.faturamento.canaisEnvio.map((canal) => (
                            <Badge key={canal} className="bg-[var(--ui-stroke)]/50 text-[var(--ui-text)] rounded-lg text-xs">{canal}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[var(--ui-stroke)]" />

                  {/* Transferências */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Transferências ao locador
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Transferência automática</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.repasse.automatico ? 'Sim' : 'Não'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Dia da transferência</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.repasse.diaRepasse}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Transferência garantida</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.repasse.garantido ? 'Sim' : 'Não'}</p>
                      </div>
                      {contrato.repasse.garantido && (
                        <div>
                          <p className="text-xs text-[var(--ui-text-subtle)]">Meses de garantia</p>
                          <p className="text-sm text-[var(--ui-text)]">{contrato.repasse.mesesGarantia} meses</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <hr className="border-[var(--ui-stroke)]" />

                  {/* Seguros e Garantias */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Seguros e Garantias
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Seguro incêndio</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.seguros.incendio.ativo ? contrato.seguros.incendio.valor : 'Não contratado'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Tipo de garantia</p>
                        <p className="text-sm text-[var(--ui-text)]">{contrato.seguros.garantia}</p>
                      </div>
                    </div>
                    {contrato.seguros.fiadores && contrato.seguros.fiadores.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-[var(--ui-text-subtle)]">Fiadores</p>
                        {contrato.seguros.fiadores.map((fiador, index) => (
                          <div key={index} className="p-3 bg-[var(--ui-stroke)]/20 rounded-xl">
                            <p className="text-sm font-medium text-[hsl(var(--link))]">{fiador.nome}</p>
                            <p className="text-xs text-[var(--ui-text-subtle)]">CPF: {fiador.cpf}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Tab: Lançamentos */}
                <TabsContent value="lancamentos" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)]">Lançamentos Ativos</h3>
                    <Button 
                      size="sm" 
                      className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
                      onClick={() => setNovoLancamentoOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo lançamento
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--ui-stroke)]">
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Categoria</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Competência</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Débito de</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Crédito para</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Valor</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Vencimento</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockLancamentos.map((lanc) => (
                          <tr key={lanc.id} className="border-b border-[var(--ui-stroke)] hover:bg-[var(--ui-stroke)]/20">
                            <td className="py-3 px-2 text-[var(--ui-text)]">{lanc.categoria}</td>
                            <td className="py-3 px-2 text-[var(--ui-text)]">{lanc.competencia}</td>
                            <td className="py-3 px-2 text-[var(--ui-text)]">{lanc.debitoDe}</td>
                            <td className="py-3 px-2 text-[var(--ui-text)]">{lanc.creditoPara}</td>
                            <td className="py-3 px-2 text-[var(--ui-text)] font-medium">{lanc.valor}</td>
                            <td className="py-3 px-2 text-[var(--ui-text)]">{lanc.vencimento}</td>
                            <td className="py-3 px-2">{getStatusBadge(lanc.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                {/* Tab: Boletos */}
                <TabsContent value="faturas" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)]">Boletos</h3>
                    <Button 
                      size="sm" 
                      className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
                      onClick={() => setNovaFaturaOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo boleto
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {faturas.map((fatura) => (
                      <div key={fatura.id} className="flex items-center justify-between p-4 bg-[var(--ui-stroke)]/20 rounded-xl hover:bg-[var(--ui-stroke)]/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-medium text-[var(--ui-text)]">{fatura.periodo}</p>
                            <p className="text-xs text-[var(--ui-text-subtle)]">Vencimento: {fatura.vencimento}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-sm font-semibold text-[var(--ui-text)]">{fatura.valor}</p>
                          {getStatusBadge(fatura.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem onClick={() => handleVisualizarFatura(fatura)}>
                                <Eye className="w-4 h-4 mr-2" />Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReenviarEmail(fatura)}>
                                <Send className="w-4 h-4 mr-2" />Reenviar email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReenviarWhatsApp(fatura)}>
                                <Send className="w-4 h-4 mr-2" />Reenviar WhatsApp
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleBaixarPDF(fatura)}>
                                <Download className="w-4 h-4 mr-2" />Baixar PDF
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Tab: Transferências */}
                <TabsContent value="repasses" className="mt-0 space-y-4">
                  <h3 className="text-sm font-semibold text-[var(--ui-text)]">Transferências ao locador</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--ui-stroke)]">
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Mês</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Valor</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Data</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-[var(--ui-text-subtle)]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {repasses.map((repasse) => (
                          <tr key={repasse.id} className="border-b border-[var(--ui-stroke)] hover:bg-[var(--ui-stroke)]/20">
                            <td className="py-3 px-2 text-[var(--ui-text)]">{repasse.mes}</td>
                            <td className="py-3 px-2 text-[var(--ui-text)] font-medium">{repasse.valor}</td>
                            <td className="py-3 px-2 text-[var(--ui-text)]">{repasse.data}</td>
                            <td className="py-3 px-2">{getStatusBadge(repasse.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                {/* Tab: Documentos */}
                <TabsContent value="documentos" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)]">Documentos Anexados</h3>
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <Upload className="w-4 h-4 mr-2" />
                      Anexar documento
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {mockDocumentos.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-[var(--ui-stroke)]/20 rounded-xl hover:bg-[var(--ui-stroke)]/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[hsl(var(--accent))]" />
                          <div>
                            <p className="text-sm font-medium text-[var(--ui-text)]">{doc.nome}</p>
                            <p className="text-xs text-[var(--ui-text-subtle)]">{doc.data}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleVisualizarDocumento(doc)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleDownloadDocumento(doc)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Tab: Reparos */}
                <TabsContent value="reparos" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)]">Histórico de reparos</h3>
                    <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setNovoReparoOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Novo reparo
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {reparos.map((reparo) => (
                      <div
                        key={reparo.id}
                        className="flex items-center justify-between p-4 bg-[var(--ui-stroke)]/20 rounded-xl hover:bg-[var(--ui-stroke)]/30 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-[var(--ui-text)]">{reparo.titulo}</p>
                          <p className="text-xs text-[var(--ui-text-subtle)]">
                            Solicitado por {reparo.solicitante} • {reparo.data}
                          </p>
                        </div>
                        {getStatusBadge(reparo.status)}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Agenda de cobrança */}
          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Agenda de cobrança
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-lg text-[hsl(var(--link))]"
                  onClick={() => navigate('/gestao-locacao/regua-cobranca')}
                >
                  Ver agenda
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {agendaEventosLocal.length === 0 && (
                <p className="text-xs text-[var(--ui-text-subtle)]">Sem eventos previstos para este contrato.</p>
              )}
              {agendaEventosLocal.map((evento) => (
                <div key={evento.id} className="p-3 bg-[var(--ui-stroke)]/20 rounded-xl">
                  <p className="text-sm text-[var(--ui-text)]">{evento.tipo}</p>
                  <p className="text-xs text-[var(--ui-text-subtle)]">{evento.data} • {evento.canal}</p>
                  <p className="text-xs text-[var(--ui-text-subtle)]">{evento.acao}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tarefas */}
          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Tarefas
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-lg text-[hsl(var(--link))]"
                  onClick={() => setNovaTarefaOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Novo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {tarefas.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <Checkbox
                    checked={item.concluido}
                    onCheckedChange={(checked) =>
                      setTarefas((prev) =>
                        prev.map((tarefa) =>
                          tarefa.id === item.id ? { ...tarefa, concluido: Boolean(checked) } : tarefa
                        )
                      )
                    }
                    className="mt-0.5 rounded"
                  />
                  <div className="flex-1">
                    <p className={cn("text-sm", item.concluido ? "text-[var(--ui-text-subtle)] line-through" : "text-[var(--ui-text)]")}>
                      {item.tarefa}
                    </p>
                    <p className="text-xs text-[var(--ui-text-subtle)]">
                      {item.responsavel} {item.data && `• ${item.data}`}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notas */}
          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                <Info className="w-4 h-4" />
                Informações importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Adicionar uma informação importante..."
                  value={novaNota}
                  onChange={(e) => setNovaNota(e.target.value)}
                  className="rounded-xl border-[var(--ui-stroke)] resize-none"
                  rows={2}
                />
                <Button
                  size="sm"
                  className="w-full rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
                  disabled={!novaNota.trim()}
                  onClick={() => {
                    if (!novaNota.trim()) return;
                    setNotas((prev) => [
                      { id: String(prev.length + 1), contratoId: contrato.id, texto: novaNota.trim(), autor: 'Usuário Demo', data: 'Hoje' },
                      ...prev,
                    ]);
                    setNovaNota('');
                  }}
                >
                  Adicionar informação
                </Button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notas.map((nota) => (
                  <div key={nota.id} className="p-3 bg-[var(--ui-stroke)]/20 rounded-xl">
                    <p className="text-sm text-[var(--ui-text)]">{nota.texto}</p>
                    <p className="text-xs text-[var(--ui-text-subtle)] mt-2">{nota.autor} • {nota.data}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Atalhos */}
          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <CardContent className="pt-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start rounded-xl h-10 text-[hsl(var(--link))]">
                <Building2 className="w-4 h-4 mr-2" />
                Ver imóvel
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-xl h-10 text-[hsl(var(--link))]">
                <User className="w-4 h-4 mr-2" />
                Ver locatário
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-xl h-10 text-[hsl(var(--link))]">
                <Users className="w-4 h-4 mr-2" />
                Ver locador
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={novaTarefaOpen} onOpenChange={setNovaTarefaOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar nova tarefa</DialogTitle>
            <DialogDescription>
              Registre a tarefa e ela será vinculada à agenda de cobrança deste contrato.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-[var(--ui-text-subtle)]">Título da tarefa</label>
              <Input
                value={novaTarefaTitulo}
                onChange={(e) => setNovaTarefaTitulo(e.target.value)}
                placeholder="Ex.: Solicitar vistoria de reparo"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[var(--ui-text-subtle)]">Responsável</label>
              <Input
                value={novaTarefaResponsavel}
                onChange={(e) => setNovaTarefaResponsavel(e.target.value)}
                placeholder="Equipe Hunter"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[var(--ui-text-subtle)]">Data prevista</label>
              <Input
                value={novaTarefaData}
                onChange={(e) => setNovaTarefaData(e.target.value)}
                placeholder="10/12/2024"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setNovaTarefaOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--brandPrimaryText))]"
              onClick={handleAdicionarTarefa}
              disabled={!novaTarefaTitulo.trim()}
            >
              Salvar tarefa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelarContratoOpen} onOpenChange={setCancelarContratoOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Cancelar contrato</DialogTitle>
            <DialogDescription>
              Informe o motivo do cancelamento e os próximos passos para registrar o encerramento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-[var(--ui-text-subtle)]">Motivo do cancelamento</label>
              <Input
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
                placeholder="Ex.: Rescisão antecipada solicitada pelo locatário"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[var(--ui-text-subtle)]">Detalhes e próximos passos</label>
              <Textarea
                value={detalhesEncerramento}
                onChange={(e) => setDetalhesEncerramento(e.target.value)}
                placeholder="Descreva as etapas, documentos e responsáveis."
                className="rounded-xl border-[var(--ui-stroke)] resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setCancelarContratoOpen(false)}>
              Voltar
            </Button>
            <Button
              className="rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--brandPrimaryText))]"
              onClick={handleConfirmarCancelamento}
              disabled={!motivoCancelamento.trim()}
            >
              Registrar cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={avisoPrevioOpen} onOpenChange={setAvisoPrevioOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Registrar aviso prévio</DialogTitle>
            <DialogDescription>
              Defina o motivo e o plano de acompanhamento do aviso prévio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-[var(--ui-text-subtle)]">Motivo do aviso prévio</label>
              <Input
                value={motivoAvisoPrevio}
                onChange={(e) => setMotivoAvisoPrevio(e.target.value)}
                placeholder="Ex.: Mudança do locatário"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[var(--ui-text-subtle)]">Detalhes e acompanhamento</label>
              <Textarea
                value={detalhesAvisoPrevio}
                onChange={(e) => setDetalhesAvisoPrevio(e.target.value)}
                placeholder="Informe prazos, notificações e responsáveis."
                className="rounded-xl border-[var(--ui-stroke)] resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setAvisoPrevioOpen(false)}>
              Voltar
            </Button>
            <Button
              className="rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--brandPrimaryText))]"
              onClick={handleConfirmarAvisoPrevio}
              disabled={!motivoAvisoPrevio.trim()}
            >
              Registrar aviso prévio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={excluirContratoOpen} onOpenChange={setExcluirContratoOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Excluir contrato</DialogTitle>
            <DialogDescription>
              Confirme o motivo da exclusão e registre o histórico para auditoria.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-[var(--ui-text-subtle)]">Motivo da exclusão</label>
              <Input
                value={motivoExclusao}
                onChange={(e) => setMotivoExclusao(e.target.value)}
                placeholder="Ex.: Contrato duplicado ou criado por engano"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[var(--ui-text-subtle)]">Detalhes adicionais</label>
              <Textarea
                value={detalhesExclusao}
                onChange={(e) => setDetalhesExclusao(e.target.value)}
                placeholder="Descreva as validações feitas antes de excluir."
                className="rounded-xl border-[var(--ui-stroke)] resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setExcluirContratoOpen(false)}>
              Voltar
            </Button>
            <Button
              className="rounded-xl bg-[hsl(var(--danger))] text-white hover:bg-[hsl(var(--danger))]/90"
              onClick={handleConfirmarExclusao}
              disabled={!motivoExclusao.trim()}
            >
              Solicitar exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer
        open={Boolean(beneficiarioSelecionado)}
        onOpenChange={(open) => {
          if (!open) {
            setBeneficiarioSelecionado(null);
            setEditarBeneficiario(false);
          }
        }}
      >
        <DrawerContent className="bg-[var(--ui-surface)]">
          {beneficiarioSelecionado && (
            <div className="p-4 space-y-6">
              <DrawerHeader className="p-0 text-left space-y-1">
                <DrawerTitle className="text-[var(--ui-text)]">{beneficiarioSelecionado.nome}</DrawerTitle>
                <DrawerDescription className="text-[var(--ui-text-subtle)]">
                  {beneficiarioSelecionado.tipo} • Documento {beneficiarioSelecionado.documento}
                </DrawerDescription>
              </DrawerHeader>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-[var(--ui-text-subtle)]">Dados do beneficiário</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[var(--ui-text-subtle)]">Percentual</p>
                    {editarBeneficiario ? (
                      <Input
                        value={beneficiarioSelecionado.percentual}
                        onChange={(e) =>
                          setBeneficiarioSelecionado({
                            ...beneficiarioSelecionado,
                            percentual: Number(e.target.value),
                          })
                        }
                        className="rounded-xl"
                      />
                    ) : (
                      <p className="text-sm text-[var(--ui-text)]">{beneficiarioSelecionado.percentual}%</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--ui-text-subtle)]">Tipo de repasse</p>
                    {editarBeneficiario ? (
                      <Input
                        value={beneficiarioSelecionado.tipoRepasse}
                        onChange={(e) =>
                          setBeneficiarioSelecionado({
                            ...beneficiarioSelecionado,
                            tipoRepasse: e.target.value as ContractBeneficiary['tipoRepasse'],
                          })
                        }
                        className="rounded-xl"
                      />
                    ) : (
                      <p className="text-sm text-[var(--ui-text)]">{beneficiarioSelecionado.tipoRepasse}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-[var(--ui-text-subtle)]">Dados bancários</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[var(--ui-text-subtle)]">Banco</p>
                    {editarBeneficiario ? (
                      <Input
                        value={beneficiarioSelecionado.banco}
                        onChange={(e) =>
                          setBeneficiarioSelecionado({ ...beneficiarioSelecionado, banco: e.target.value })
                        }
                        className="rounded-xl"
                      />
                    ) : (
                      <p className="text-sm text-[var(--ui-text)]">{beneficiarioSelecionado.banco}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--ui-text-subtle)]">Agência</p>
                    {editarBeneficiario ? (
                      <Input
                        value={beneficiarioSelecionado.agencia}
                        onChange={(e) =>
                          setBeneficiarioSelecionado({ ...beneficiarioSelecionado, agencia: e.target.value })
                        }
                        className="rounded-xl"
                      />
                    ) : (
                      <p className="text-sm text-[var(--ui-text)]">{beneficiarioSelecionado.agencia}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--ui-text-subtle)]">Conta</p>
                    {editarBeneficiario ? (
                      <Input
                        value={beneficiarioSelecionado.conta}
                        onChange={(e) =>
                          setBeneficiarioSelecionado({ ...beneficiarioSelecionado, conta: e.target.value })
                        }
                        className="rounded-xl"
                      />
                    ) : (
                      <p className="text-sm text-[var(--ui-text)]">{beneficiarioSelecionado.conta}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-[var(--ui-text-subtle)]">Histórico recente</p>
                <div className="space-y-2">
                  {beneficiarioSelecionado.historico.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--ui-text)]">{item.data}</span>
                      <span className="text-[var(--ui-text-subtle)]">{item.status}</span>
                      <span className="text-[var(--ui-text)]">{item.valor}</span>
                    </div>
                  ))}
                </div>
              </div>

              <DrawerFooter className="p-0 gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="rounded-xl" onClick={handleCopiarDados}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar dados
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => toast({ title: 'Repasses relacionados', description: 'Filtro aplicado no modo mock.' })}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Ver repasses
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setEditarBeneficiario((prev) => !prev)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {editarBeneficiario ? 'Cancelar edição' : 'Editar'}
                  </Button>
                  <Button
                    className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
                    onClick={handleSalvarBeneficiario}
                    disabled={!editarBeneficiario}
                  >
                    Salvar
                  </Button>
                </div>
              </DrawerFooter>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* Modals */}
      <NovaFaturaModal open={novaFaturaOpen} onOpenChange={setNovaFaturaOpen} />
      <NovoLancamentoModal open={novoLancamentoOpen} onOpenChange={setNovoLancamentoOpen} />
        <VisualizarDocumentoModal
          open={visualizarDocOpen}
          onOpenChange={setVisualizarDocOpen}
          documento={documentoSelecionado}
        />

        <Dialog open={novoReparoOpen} onOpenChange={setNovoReparoOpen}>
          <DialogContent className="sm:max-w-[520px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Novo reparo</DialogTitle>
              <DialogDescription>Cadastre um reparo para este contrato.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <label className="text-sm text-[var(--ui-text-subtle)]">Título do reparo</label>
                <Input value={novoReparoTitulo} onChange={(e) => setNovoReparoTitulo(e.target.value)} placeholder="Ex: Troca de torneira" className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-[var(--ui-text-subtle)]">Solicitante</label>
                <Input value={novoReparoSolicitante} onChange={(e) => setNovoReparoSolicitante(e.target.value)} placeholder="Nome de quem solicitou" className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-[var(--ui-text-subtle)]">Data</label>
                <Input type="date" value={novoReparoData} onChange={(e) => setNovoReparoData(e.target.value)} className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNovoReparoOpen(false)}>Cancelar</Button>
              <Button onClick={handleCriarReparo}>Salvar reparo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </LocacaoModuleLayout>
  );
};

export default ContratoDetalhesPage;
