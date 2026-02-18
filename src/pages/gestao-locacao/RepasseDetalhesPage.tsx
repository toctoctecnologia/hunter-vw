import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StandardLayout } from '@/layouts/StandardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronRight,
  DollarSign,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Copy,
  RotateCcw,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { exportGestaoLocacaoData, type ExportColumn } from '@/utils/gestaoLocacaoExport';
import {
  RepasseDadosGeraisCard,
  RepasseValoresCard,
  RepasseHistoricoCard,
  RepasseNotasCard,
  RepasseDocumentosCard,
  type RepasseDadosGerais,
  type RepasseValores,
  type EventoHistorico,
  type NotaInterna,
  type Documento,
} from '@/components/gestao-locacao/repasses';

type RepasseStatus = 'Pendente' | 'Processando' | 'Pago' | 'Falhou' | 'Estornado';

interface RepasseData {
  id: string;
  numero: string;
  status: RepasseStatus;
  dadosGerais: RepasseDadosGerais;
  valores: RepasseValores;
  historico: EventoHistorico[];
  notas: NotaInterna[];
  documentos: Documento[];
}

// Mock data
const mockRepasse: RepasseData = {
  id: '1',
  numero: 'REP-2024-001',
  status: 'Pendente',
  dadosGerais: {
    locador: { id: '1', nome: 'Maria Santos' },
    imovel: { id: '1', tipo: 'Apartamento', endereco: 'Rua Exemplo, 100' },
    contrato: { id: '1', codigo: '2093477/1' },
    competencia: 'Novembro 2024',
    dataPrevistaRepasse: '05/12/2024',
    metodoRepasse: 'Conta digital Hunter',
    contaDestino: {
      banco: 'Banco Atlântico',
      agencia: '0001',
      conta: '12345-6',
      chavePix: 'maria.santos@exemplo.com',
    },
  } as RepasseDadosGerais,
  valores: {
    itens: [
      { id: '1', descricao: 'Aluguel', valor: 2500, tipo: 'receita' as const },
      { id: '2', descricao: 'Condomínio', valor: 350, tipo: 'receita' as const },
      { id: '3', descricao: 'IPTU', valor: 150, tipo: 'receita' as const },
      { id: '4', descricao: 'Taxa de administração (10%)', valor: 250, tipo: 'deducao' as const },
      { id: '5', descricao: 'Seguro', valor: 50, tipo: 'deducao' as const },
    ],
    totalBruto: 3000,
    totalDeducoes: 300,
    totalLiquido: 2700,
  } as RepasseValores,
  historico: [
    {
      id: '1',
      tipo: 'criacao' as const,
      descricao: 'Transferência criada automaticamente a partir do boleto FAT-2024-001',
      autor: 'Sistema',
      data: '01/12/2024',
      hora: '08:30',
    },
    {
      id: '2',
      tipo: 'status' as const,
      descricao: 'Status alterado para Pendente',
      autor: 'Sistema',
      data: '01/12/2024',
      hora: '08:30',
    },
  ] as EventoHistorico[],
  notas: [
    {
      id: '1',
      texto: 'Proprietário solicitou transferência antecipada para o dia 03/12.',
      autor: 'Usuário Demo',
      data: '02/12/2024',
      hora: '14:25',
    },
  ] as NotaInterna[],
  documentos: [] as Documento[],
};

export const RepasseDetalhesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [repasse, setRepasse] = useState(mockRepasse);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Pendente': 'bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]',
      'Processando': 'bg-[hsl(var(--accent)/0.16)] text-[hsl(var(--accent))]',
      'Pago': 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
      'Falhou': 'bg-[hsl(var(--danger)/0.16)] text-[hsl(var(--danger))]',
      'Estornado': 'bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)]',
    };
    return (
      <Badge className={`${styles[status] || styles['Pendente']} rounded-lg px-3 py-1 text-sm font-medium`}>
        {status}
      </Badge>
    );
  };

  const handleSaveDadosGerais = (dados: RepasseDadosGerais) => {
    setRepasse((prev) => ({
      ...prev,
      dadosGerais: dados,
      historico: [
        {
          id: Date.now().toString(),
          tipo: 'edicao' as const,
          descricao: 'Dados gerais da transferência foram alterados',
          autor: 'Paulo Admin',
          data: new Date().toLocaleDateString('pt-BR'),
          hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.historico,
      ],
    }));
    toast({
      title: 'Dados atualizados',
      description: 'As informações da transferência foram salvas com sucesso.',
    });
  };

  const handleSaveValores = (valores: RepasseValores) => {
    setRepasse((prev) => ({
      ...prev,
      valores,
      historico: [
        {
          id: Date.now().toString(),
          tipo: 'edicao' as const,
          descricao: 'Valores da transferência foram alterados',
          autor: 'Paulo Admin',
          data: new Date().toLocaleDateString('pt-BR'),
          hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.historico,
      ],
    }));
    toast({
      title: 'Valores atualizados',
      description: 'Os valores da transferência foram salvos com sucesso.',
    });
  };

  const handleAddNota = (texto: string) => {
    const novaNota: NotaInterna = {
      id: Date.now().toString(),
      texto,
      autor: 'Paulo Admin',
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setRepasse((prev) => ({
      ...prev,
      notas: [novaNota, ...prev.notas],
    }));
    toast({
      title: 'Nota adicionada',
      description: 'A nota foi registrada com sucesso.',
    });
  };

  const handleAddDocumento = (documento: Omit<Documento, 'id'>) => {
    const novoDoc: Documento = {
      id: Date.now().toString(),
      ...documento,
    };
    setRepasse((prev) => ({
      ...prev,
      documentos: [...prev.documentos, novoDoc],
    }));
    toast({
      title: 'Documento adicionado',
      description: 'O documento foi anexado com sucesso.',
    });
  };

  const handleRemoveDocumento = (docId: string) => {
    setRepasse((prev) => ({
      ...prev,
      documentos: prev.documentos.filter((d) => d.id !== docId),
    }));
    toast({
      title: 'Documento removido',
      description: 'O documento foi removido com sucesso.',
    });
  };

  const handleRegistrarRepasse = () => {
    // TODO: Integrate with real API
    setRepasse((prev) => ({
      ...prev,
      status: 'Pago',
      dadosGerais: {
        ...prev.dadosGerais,
        dataPagamento: new Date().toLocaleDateString('pt-BR'),
      },
      historico: [
        {
          id: Date.now().toString(),
          tipo: 'pagamento' as const,
          descricao: 'Transferência registrada manualmente como paga',
          autor: 'Paulo Admin',
          data: new Date().toLocaleDateString('pt-BR'),
          hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.historico,
      ],
    }));
    toast({
      title: 'Transferência registrada',
      description: 'A transferência foi marcada como paga com sucesso.',
    });
  };

  const handleEstornar = () => {
    // TODO: Integrate with real API
    setRepasse((prev) => ({
      ...prev,
      status: 'Estornado',
      historico: [
        {
          id: Date.now().toString(),
          tipo: 'status' as const,
          descricao: 'Transferência estornada',
          autor: 'Paulo Admin',
          data: new Date().toLocaleDateString('pt-BR'),
          hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.historico,
      ],
    }));
    toast({
      title: 'Transferência estornada',
      description: 'A transferência foi estornada com sucesso.',
      variant: 'destructive',
    });
  };

  const handleCancelar = () => {
    // TODO: Integrate with real API
    toast({
      title: 'Transferência cancelada',
      description: 'A transferência foi cancelada com sucesso.',
      variant: 'destructive',
    });
    navigate('/gestao-locacao/repasses');
  };

  const handleExportarComprovante = () => {
    const columns: ExportColumn[] = [
      { key: 'numero', label: 'Transferência' },
      { key: 'locador', label: 'Locador' },
      { key: 'competencia', label: 'Competência' },
      { key: 'valorLiquido', label: 'Valor líquido' },
      { key: 'status', label: 'Status' },
      { key: 'dataPagamento', label: 'Data pagamento' },
    ];

    exportGestaoLocacaoData({
      format: 'pdf',
      section: 'transferencia',
      data: [
        {
          numero: repasse.numero,
          locador: repasse.dadosGerais.locador.nome,
          competencia: repasse.dadosGerais.competencia,
          valorLiquido: `R$ ${repasse.valores.totalLiquido.toLocaleString('pt-BR')}`,
          status: repasse.status,
          dataPagamento: repasse.dadosGerais.dataPrevistaRepasse ?? '-',
        },
      ],
      columns,
    });

    toast({
      title: 'Exportando comprovante',
      description: 'O PDF do comprovante foi gerado com sucesso.',
    });
  };

  return (
    <StandardLayout>
      <div className="gestao-locacao-theme p-6 bg-[var(--ui-surface)] min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[var(--ui-text-subtle)] mb-6">
            <Link to="/gestao-locacao" className="hover:text-[var(--ui-text)] transition-colors">
              INÍCIO
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/gestao-locacao/repasses" className="hover:text-[var(--ui-text)] transition-colors">
              TRANSFERÊNCIAS
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--ui-text)] font-medium">{repasse.numero}</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-[var(--ui-text)]">
                  Transferência {repasse.numero}
                </h1>
                {getStatusBadge(repasse.status)}
              </div>
              <p className="text-sm text-[hsl(var(--textSecondary))]">
                Locador {repasse.dadosGerais.locador.nome} • Competência {repasse.dadosGerais.competencia}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {repasse.status === 'Pendente' && (
                <Button
                  onClick={handleRegistrarRepasse}
                  className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] rounded-xl h-10 px-4"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Registrar transferência manual
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleExportarComprovante}
                className="rounded-xl h-10 px-4 border-[var(--ui-stroke)]"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar comprovante
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-[var(--ui-stroke)]">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl w-48">
                  {repasse.status === 'Pago' && (
                    <DropdownMenuItem
                      onClick={handleEstornar}
                      className="cursor-pointer rounded-lg text-[hsl(var(--danger))]"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Estornar transferência
                    </DropdownMenuItem>
                  )}
                  {repasse.status === 'Pendente' && (
                    <DropdownMenuItem
                      onClick={handleCancelar}
                      className="cursor-pointer rounded-lg text-[hsl(var(--danger))]"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar transferência
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer rounded-lg">
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar configuração
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              <RepasseDadosGeraisCard
                dados={repasse.dadosGerais}
                onSave={handleSaveDadosGerais}
                status={repasse.status}
              />
              <RepasseValoresCard
                valores={repasse.valores}
                onSave={handleSaveValores}
                status={repasse.status}
              />
              <RepasseHistoricoCard eventos={repasse.historico} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ações Rápidas */}
              <div className="bg-[var(--ui-card)] rounded-2xl border border-[var(--ui-stroke)] p-4 shadow-[var(--shadow-sm)]">
                <h3 className="text-sm font-semibold text-[var(--ui-text)] mb-3">Ações rápidas</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl h-10 border-[var(--ui-stroke)]"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar por e-mail
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl h-10 border-[var(--ui-stroke)]"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar por WhatsApp
                  </Button>
                </div>
              </div>

              <RepasseDocumentosCard
                documentos={repasse.documentos}
                onAddDocumento={handleAddDocumento}
                onRemoveDocumento={handleRemoveDocumento}
              />

              <RepasseNotasCard notas={repasse.notas} onAddNota={handleAddNota} />
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default RepasseDetalhesPage;
