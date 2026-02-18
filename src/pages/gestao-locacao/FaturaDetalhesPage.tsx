import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StandardLayout } from '@/layouts/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft, MoreHorizontal, FileText, Mail, MessageSquare, Download,
  DollarSign, XCircle, Send, Plus, History, ExternalLink, CreditCard
} from 'lucide-react';
import { toast } from 'sonner';
import { FaturaDadosGeraisCard, FaturaValoresCard, BoletoConfigModal, type BoletoConfig } from '@/components/gestao-locacao/fatura';
import { exportGestaoLocacaoData, type ExportColumn } from '@/utils/gestaoLocacaoExport';

const initialFaturaData = {
  id: '1',
  numero: 'FAT-2024-001',
  contrato: { id: '1', codigo: '2093477/1' },
  locatario: { nome: 'Luiz Victor Ferreira', email: 'luiz.ferreira@exemplo.com', telefone: '(11) 90000-1111' },
  imovel: { tipo: 'Apartamento', endereco: 'Rua Exemplo, 100, Centro, São Paulo - SP' },
  competencia: 'Dezembro/2024',
  dataEmissao: '01/12/2024',
  dataVencimento: '10/12/2024',
  metodoPagamento: 'Boleto bancário',
  status: 'Pendente' as const,
  statusConciliacao: 'enviado',
  responsavelAlteracao: 'Usuário Demo',
  dataAlteracao: '02/12/2024 14:30',
  valores: {
    itens: [
      { id: 'item-1', categoria: 'aluguel', valor: 2500.00 },
      { id: 'item-2', categoria: 'condominio', valor: 350.00 },
      { id: 'item-3', categoria: 'iptu', valor: 85.00 },
      { id: 'item-4', categoria: 'taxa_administracao', valor: 250.00 },
      { id: 'item-5', categoria: 'taxa_bancaria', valor: 3.50 },
      { id: 'item-6', categoria: 'seguro', valor: 45.00 },
    ],
    multa: 0, juros: 0, desconto: 0, total: 3233.50
  },
  historico: [
    { data: '01/12/2024 09:00', evento: 'Boleto criado', usuario: 'Sistema' },
    { data: '01/12/2024 09:05', evento: 'E-mail enviado para luiz.ferreira@exemplo.com', usuario: 'Sistema' },
    { data: '02/12/2024 14:30', evento: 'WhatsApp enviado', usuario: 'Usuário Demo' },
  ],
  integracoes: { gatewayId: 'bol_123456789', mycoiId: 'MC-2024-001', boletoUrl: 'https://exemplo.com/boleto/123' },
  notas: [{ id: '1', texto: 'Cliente solicitou envio do boleto por WhatsApp', autor: 'Equipe Hunter', data: '02/12/2024' }],
  boleto: {
    banco: 'ATL', agencia: '0001', conta: '12345-6', carteira: '17', nossoNumero: '12345678901',
    linhaDigitavel: 'ATL93.38128 60800.000003 12345.678901 1 92340000323350', tipoBoleto: 'registrado',
    instrucoes: 'Não receber após 30 dias do vencimento.\nProtestar após 5 dias úteis.',
    multaPercentual: 2.0, jurosPercentual: 1.0, descontoPercentual: 0, dataLimiteDesconto: '',
    statusBanco: 'registrado', idRemessa: 'REM-2024-001234',
  } as BoletoConfig
};

export const FaturaDetalhesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('detalhes');
  const [novaNota, setNovaNota] = useState('');
  const [fatura, setFatura] = useState(initialFaturaData);
  const [isBoletoModalOpen, setIsBoletoModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Paga': 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
      'Pendente': 'bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]',
      'Atrasada': 'bg-[hsl(var(--danger)/0.16)] text-[hsl(var(--danger))]',
      'Cancelada': 'bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)]'
    };
    return <Badge className={`${styles[status]} rounded-lg px-3 py-1 text-sm font-medium`}>{status}</Badge>;
  };

  const handleSaveDadosGerais = (dados: typeof fatura) => { setFatura(prev => ({ ...prev, ...dados, dataAlteracao: new Date().toLocaleString('pt-BR'), responsavelAlteracao: 'Usuário atual' })); toast.success('Dados gerais atualizados!'); };
  const handleSaveValores = (valores: typeof fatura.valores) => { setFatura(prev => ({ ...prev, valores, dataAlteracao: new Date().toLocaleString('pt-BR'), responsavelAlteracao: 'Usuário atual' })); toast.success('Valores atualizados!'); };
  const handleSaveBoleto = (config: BoletoConfig) => { setFatura(prev => ({ ...prev, boleto: config, dataAlteracao: new Date().toLocaleString('pt-BR'), responsavelAlteracao: 'Usuário atual' })); toast.success('Configurações do boleto salvas!'); };
  const handleAddNota = () => { if (!novaNota.trim()) return; setFatura(prev => ({ ...prev, notas: [{ id: `nota-${Date.now()}`, texto: novaNota, autor: 'Usuário atual', data: new Date().toLocaleDateString('pt-BR') }, ...prev.notas] })); setNovaNota(''); toast.success('Nota adicionada!'); };
  const handleExportPdf = () => {
    const columns: ExportColumn[] = [
      { key: 'numero', label: 'Boleto' },
      { key: 'contrato', label: 'Contrato' },
      { key: 'locatario', label: 'Locatário' },
      { key: 'competencia', label: 'Competência' },
      { key: 'vencimento', label: 'Vencimento' },
      { key: 'status', label: 'Status' },
      { key: 'total', label: 'Valor total' },
    ];

    exportGestaoLocacaoData({
      format: 'pdf',
      section: 'boleto',
      data: [
        {
          numero: fatura.numero,
          contrato: fatura.contrato.codigo,
          locatario: fatura.locatario.nome,
          competencia: fatura.competencia,
          vencimento: fatura.dataVencimento,
          status: fatura.status,
          total: `R$ ${fatura.valores.total.toLocaleString('pt-BR')}`,
        },
      ],
      columns,
    });
  };

  const handleOpenBoleto = () => {
    if (!fatura.integracoes.boletoUrl) {
      toast.error('URL do boleto não disponível.');
      return;
    }
    window.open(fatura.integracoes.boletoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <StandardLayout>
      <div className="gestao-locacao-theme p-6 bg-[var(--ui-surface)] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-[var(--ui-text-subtle)] mb-6">
            <Link to="/gestao-locacao" className="hover:text-[var(--ui-text)] transition-colors">INÍCIO</Link><span>›</span>
            <Link to="/gestao-locacao/faturas" className="hover:text-[var(--ui-text)] transition-colors">BOLETOS</Link><span>›</span>
            <span className="text-[var(--ui-text)] font-medium">{fatura.numero}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/gestao-locacao/faturas')} className="rounded-xl hover:bg-[var(--ui-stroke)]/50"><ArrowLeft className="w-5 h-5" /></Button>
              <div>
                <div className="flex items-center gap-3"><h1 className="text-2xl font-bold text-[var(--ui-text)]">Boleto {fatura.numero}</h1>{getStatusBadge(fatura.status)}</div>
                <p className="text-sm text-[hsl(var(--textSecondary))] mt-1">Contrato {fatura.contrato.codigo} • Vencimento: {fatura.dataVencimento}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] rounded-xl h-11 px-5"><DollarSign className="w-4 h-4 mr-2" />Registrar pagamento</Button>
              <Button variant="outline" className="rounded-xl h-11 px-5 border-[var(--ui-stroke)]"><Send className="w-4 h-4 mr-2" />Reenviar</Button>
              <Button variant="outline" className="rounded-xl h-11 px-5 border-[var(--ui-stroke)]" onClick={handleExportPdf}><Download className="w-4 h-4 mr-2" />Exportar PDF</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline" size="icon" className="rounded-xl h-11 w-11 border-[var(--ui-stroke)]"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem className="cursor-pointer rounded-lg"><Mail className="w-4 h-4 mr-2" />Enviar por e-mail</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg"><MessageSquare className="w-4 h-4 mr-2" />Enviar por WhatsApp</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg text-[hsl(var(--danger))]"><XCircle className="w-4 h-4 mr-2" />Cancelar boleto</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-[var(--ui-stroke)]/30 p-1 rounded-xl h-auto">
                  <TabsTrigger value="detalhes" className="rounded-lg px-4 py-2 text-[var(--ui-text-subtle)] data-[state=active]:bg-[var(--ui-card)] data-[state=active]:text-[var(--ui-text)] data-[state=active]:shadow-sm">Detalhes</TabsTrigger>
                  <TabsTrigger value="historico" className="rounded-lg px-4 py-2 text-[var(--ui-text-subtle)] data-[state=active]:bg-[var(--ui-card)] data-[state=active]:text-[var(--ui-text)] data-[state=active]:shadow-sm">Histórico</TabsTrigger>
                  <TabsTrigger value="integracoes" className="rounded-lg px-4 py-2 text-[var(--ui-text-subtle)] data-[state=active]:bg-[var(--ui-card)] data-[state=active]:text-[var(--ui-text)] data-[state=active]:shadow-sm">Integrações</TabsTrigger>
                </TabsList>
                <TabsContent value="detalhes" className="mt-6 space-y-6">
                  <FaturaDadosGeraisCard dados={fatura} onSave={handleSaveDadosGerais} />
                  <FaturaValoresCard valores={fatura.valores} status={fatura.status} onSave={handleSaveValores} />
                </TabsContent>
                <TabsContent value="historico" className="mt-6">
                  <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                    <CardHeader className="pb-4"><CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2"><History className="w-4 h-4" />Histórico de eventos</CardTitle></CardHeader>
                    <CardContent><div className="space-y-4">{fatura.historico.map((item, index) => (<div key={index} className="flex gap-4 items-start"><div className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] mt-2 flex-shrink-0" /><div className="flex-1"><p className="text-sm font-medium text-[var(--ui-text)]">{item.evento}</p><p className="text-xs text-[var(--ui-text-subtle)]">{item.data} • {item.usuario}</p></div></div>))}</div></CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="integracoes" className="mt-6">
                  <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                    <CardHeader className="pb-4"><CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2"><ExternalLink className="w-4 h-4" />Integrações e metadados</CardTitle></CardHeader>
                    <CardContent className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-1"><p className="text-xs text-[var(--ui-text-subtle)]">ID Gateway</p><p className="text-sm font-mono text-[var(--ui-text)]">{fatura.integracoes.gatewayId}</p></div><div className="space-y-1"><p className="text-xs text-[var(--ui-text-subtle)]">MyCOI ID</p><p className="text-sm font-mono text-[var(--ui-text)]">{fatura.integracoes.mycoiId}</p></div><div className="space-y-1 md:col-span-2"><p className="text-xs text-[var(--ui-text-subtle)]">URL do boleto</p><a href={fatura.integracoes.boletoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[hsl(var(--link))] hover:underline flex items-center gap-1">{fatura.integracoes.boletoUrl}<ExternalLink className="w-3 h-3" /></a></div></div></CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <div className="space-y-6">
              <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                <CardHeader className="pb-4"><CardTitle className="text-base font-semibold text-[var(--ui-text)]">Ações rápidas</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start rounded-xl h-11 border-[var(--ui-stroke)]"><Mail className="w-4 h-4 mr-2" />Reenviar por e-mail</Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl h-11 border-[var(--ui-stroke)]"><MessageSquare className="w-4 h-4 mr-2" />Reenviar por WhatsApp</Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl h-11 border-[var(--ui-stroke)]" onClick={handleOpenBoleto}><Download className="w-4 h-4 mr-2" />Baixar boleto</Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl h-11 border-[var(--ui-stroke)]" onClick={() => setIsBoletoModalOpen(true)}><CreditCard className="w-4 h-4 mr-2" />Editar boleto</Button>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                <CardHeader className="pb-4"><CardTitle className="text-base font-semibold text-[var(--ui-text)]">Documentos</CardTitle></CardHeader>
                <CardContent><div className="flex items-center gap-3 p-3 bg-[var(--ui-stroke)]/30 rounded-xl"><FileText className="w-8 h-8 text-[hsl(var(--danger))]" /><div className="flex-1"><p className="text-sm font-medium text-[var(--ui-text)]">Boleto {fatura.numero}.pdf</p><p className="text-xs text-[var(--ui-text-subtle)]">Gerado em {fatura.dataEmissao}</p></div><Button variant="ghost" size="icon" className="rounded-lg" onClick={handleOpenBoleto}><Download className="w-4 h-4" /></Button></div></CardContent>
              </Card>
              <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                <CardHeader className="pb-4"><div className="flex items-center justify-between"><CardTitle className="text-base font-semibold text-[var(--ui-text)]">Notas internas</CardTitle><Button variant="ghost" size="sm" className="text-[hsl(var(--link))] hover:bg-[hsl(var(--accent))]/10 rounded-lg" onClick={handleAddNota} disabled={!novaNota.trim()}><Plus className="w-4 h-4 mr-1" />Nova</Button></div></CardHeader>
                <CardContent className="space-y-4"><Textarea placeholder="Adicionar uma nota..." value={novaNota} onChange={(e) => setNovaNota(e.target.value)} className="rounded-xl border-[var(--ui-stroke)] min-h-[80px] resize-none" />{fatura.notas.map((nota) => (<div key={nota.id} className="p-3 bg-[var(--ui-stroke)]/30 rounded-xl"><p className="text-sm text-[var(--ui-text)]">{nota.texto}</p><p className="text-xs text-[var(--ui-text-subtle)] mt-2">{nota.autor} • {nota.data}</p></div>))}</CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <BoletoConfigModal isOpen={isBoletoModalOpen} onClose={() => setIsBoletoModalOpen(false)} config={fatura.boleto} onSave={handleSaveBoleto} />
    </StandardLayout>
  );
};

export default FaturaDetalhesPage;
