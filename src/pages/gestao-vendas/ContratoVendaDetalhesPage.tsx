import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VendasModuleLayout } from '@/layouts/VendasModuleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CheckSquare,
  FileText,
  History,
  Landmark,
  Notebook,
  RefreshCw,
  Send,
  Upload,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  getSaleContractById,
} from '@/services/gestao-vendas/saleContractsService';
import {
  listSaleChecklistByContract,
  updateSaleChecklistItem,
  type SaleChecklistItem,
} from '@/services/gestao-vendas/saleChecklistService';
import { listSaleDocuments } from '@/services/gestao-vendas/saleDocumentsService';
import { listSaleReceipts } from '@/services/gestao-vendas/saleReceiptsService';
import { listSaleCommissions } from '@/services/gestao-vendas/saleCommissionsService';
import { listSaleTransfers } from '@/services/gestao-vendas/saleTransfersService';
import { listSaleEvents } from '@/services/gestao-vendas/saleEventsService';
import { saleNotes, saleTasks } from '@/mocks/gestao-vendas/data';

export const ContratoVendaDetalhesPage = () => {
  const { saleId } = useParams<{ saleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('contrato');
  const contractId = saleId ?? 'sale-1';
  const contract = getSaleContractById(contractId) ?? getSaleContractById('sale-1');

  const [checklist, setChecklist] = useState<SaleChecklistItem[]>([]);

  useEffect(() => {
    setChecklist(listSaleChecklistByContract(contractId));
  }, [contractId]);

  const documents = useMemo(() => listSaleDocuments({ contrato: contractId }).items, [contractId]);
  const receipts = useMemo(() => listSaleReceipts({ contrato: contract?.codigo ?? '' }).items, [contract?.codigo]);
  const commissions = useMemo(() => listSaleCommissions({ contrato: contract?.codigo ?? '' }).items, [contract?.codigo]);
  const transfers = useMemo(() => listSaleTransfers({ contrato: contract?.codigo ?? '' }).items, [contract?.codigo]);
  const events = useMemo(() => listSaleEvents({}).items.filter((event) => event.contrato === contract?.codigo), [contract?.codigo]);

  const timeline = useMemo(() => {
    const noteItems = saleNotes
      .filter((note) => note.contratoId === contract?.id)
      .map((note) => ({
        id: `note-${note.id}`,
        titulo: note.titulo,
        descricao: note.descricao,
        meta: `${note.responsavel} • ${note.data}`,
      }));

    const receiptItems = receipts.map((receipt) => ({
      id: `receipt-${receipt.id}`,
      titulo: `Recebimento ${receipt.status.toLowerCase()}`,
      descricao: `${receipt.valor} via ${receipt.formaPagamento}`,
      meta: `Vencimento ${receipt.vencimento}`,
    }));

    const transferItems = transfers.map((transfer) => ({
      id: `transfer-${transfer.id}`,
      titulo: `Transferência ${transfer.status.toLowerCase()}`,
      descricao: transfer.tarefa,
      meta: `${transfer.responsavel} • Previsto ${transfer.dataPrevista}`,
    }));

    const commissionItems = commissions.map((commission) => ({
      id: `commission-${commission.id}`,
      titulo: `Comissão ${commission.status.toLowerCase()}`,
      descricao: `${commission.corretor} • ${commission.percentual}`,
      meta: commission.valorLiquido,
    }));

    return [...noteItems, ...receiptItems, ...transferItems, ...commissionItems];
  }, [commissions, contract?.id, receipts, transfers]);

  if (!contract) {
    return (
      <VendasModuleLayout title="Contrato de venda não encontrado" showTabs>
        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-[var(--ui-text-subtle)]">Não foi possível localizar o contrato solicitado.</p>
            <Button onClick={() => navigate('/gestao-vendas/contratos')}>Voltar para contratos</Button>
          </CardContent>
        </Card>
      </VendasModuleLayout>
    );
  }

  const handleChecklistStatus = (itemId: string, status: SaleChecklistItem['status']) => {
    const updated = updateSaleChecklistItem(itemId, { status });
    if (!updated) return;
    setChecklist((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
    toast({ title: 'Checklist atualizado', description: `Status atualizado para ${status}.` });
  };

  const handleUpload = (itemId: string) => {
    const updated = updateSaleChecklistItem(itemId, { anexoUrl: 'anexo-demo.pdf', status: 'Em andamento' });
    if (!updated) return;
    setChecklist((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
    toast({ title: 'Anexo registrado', description: 'O arquivo foi vinculado ao checklist.' });
  };

  const tabs = [
    { value: 'contrato', label: 'Contrato', icon: FileText },
    { value: 'documentos', label: 'Documentos', icon: Notebook },
    { value: 'checklist', label: 'Checklist', icon: CheckSquare },
    { value: 'recebimentos', label: 'Recebimentos', icon: Wallet },
    { value: 'comissoes', label: 'Comissões', icon: Landmark },
    { value: 'transferencias', label: 'Transferências', icon: RefreshCw },
    { value: 'posvenda', label: 'Pós venda', icon: Send },
    { value: 'historico', label: 'Histórico', icon: History },
  ];

  return (
    <VendasModuleLayout
      showTabs
      title={`Contrato de venda ${contract.codigo}`}
      subtitle={`Comprador: ${contract.comprador.nome} • Corretor: ${contract.corretor.nome}`}
      breadcrumbItems={[
        { label: 'INÍCIO', href: '/gestao-vendas' },
        { label: 'CONTRATOS DE VENDA', href: '/gestao-vendas/contratos' },
        { label: contract.codigo },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-0 border-b border-[var(--ui-stroke)]">
                <TabsList className="bg-transparent p-0 h-auto gap-2 w-full flex flex-wrap overflow-x-auto">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={cn(
                        'rounded-lg border border-transparent px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
                        'data-[state=active]:border-[hsl(var(--accent))] data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:bg-[hsl(var(--accent)/0.12)]',
                        'data-[state=inactive]:text-[var(--ui-text-subtle)] hover:text-[var(--ui-text)]'
                      )}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardHeader>

              <CardContent className="p-6">
                <TabsContent value="contrato" className="mt-0 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)]">Informações gerais</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Imóvel', value: `${contract.imovel.tipo} | ${contract.imovel.codigo}` },
                        { label: 'Empreendimento', value: contract.empreendimento },
                        { label: 'Incorporadora', value: contract.incorporadora },
                        { label: 'Tipo de venda', value: contract.tipoVenda },
                        { label: 'Status', value: contract.status },
                        { label: 'Banco financiamento', value: contract.bancoFinanciamento },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-xs text-[var(--ui-text-subtle)]">{item.label}</p>
                          <p className="text-sm text-[var(--ui-text)]">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-[var(--ui-stroke)]" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)]">Partes envolvidas</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[{ title: 'Comprador', data: contract.comprador }, { title: 'Vendedor', data: contract.vendedor }].map((entry) => (
                        <div key={entry.title} className="rounded-xl border border-[var(--ui-stroke)] p-4">
                          <p className="text-xs text-[var(--ui-text-subtle)]">{entry.title}</p>
                          <p className="text-sm font-medium text-[hsl(var(--link))]">{entry.data.nome}</p>
                          <p className="text-xs text-[var(--ui-text-subtle)]">{entry.data.documento}</p>
                          <p className="text-xs text-[var(--ui-text-subtle)]">{entry.data.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-[var(--ui-stroke)]" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)]">Resumo financeiro</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Valor de venda', value: contract.valorVenda },
                        { label: 'Entrada', value: contract.entrada },
                        { label: 'Financiamento', value: contract.financiamento },
                        { label: 'Assinatura', value: contract.dataAssinatura },
                        { label: 'Conclusão', value: contract.dataConclusao },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-xs text-[var(--ui-text-subtle)]">{item.label}</p>
                          <p className="text-sm text-[var(--ui-text)]">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-[var(--ui-stroke)]" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--ui-text)]">Cláusulas relevantes</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        {
                          titulo: 'Condições de transferência',
                          descricao: 'Transferência de titularidade após confirmação de pagamento e liberação do banco financiador.',
                        },
                        {
                          titulo: 'Obrigações das partes',
                          descricao: 'Comprador e vendedor devem manter documentação válida e atualizada até a conclusão do contrato.',
                        },
                        {
                          titulo: 'Anexos obrigatórios',
                          descricao: 'Contrato assinado, certidões e matrícula atualizada devem permanecer anexados para auditoria.',
                        },
                        {
                          titulo: 'Conta entrelaçada',
                          descricao: 'Movimentações financeiras do contrato ficam registradas no histórico para rastreabilidade.',
                        },
                      ].map((clause) => (
                        <div key={clause.titulo} className="rounded-xl border border-[var(--ui-stroke)] p-4">
                          <p className="text-sm font-medium text-[var(--ui-text)]">{clause.titulo}</p>
                          <p className="text-xs text-[var(--ui-text-subtle)] mt-1">{clause.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documentos" className="mt-0 space-y-4">
                  {documents.length === 0 ? (
                    <div className="text-sm text-[var(--ui-text-subtle)]">Nenhum documento anexado.</div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="rounded-xl border border-[var(--ui-stroke)] p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[var(--ui-text)]">{doc.nome}</p>
                            <p className="text-xs text-[var(--ui-text-subtle)]">{doc.categoria}</p>
                            <p className="text-xs text-[var(--ui-text-subtle)]">Atualizado em {doc.atualizadoEm}</p>
                          </div>
                          <Badge variant="secondary" className="rounded-full">{doc.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="checklist" className="mt-0 space-y-4">
                  {checklist.length === 0 ? (
                    <div className="text-sm text-[var(--ui-text-subtle)]">Checklist indisponível.</div>
                  ) : (
                    <div className="space-y-3">
                      {checklist.map((item) => (
                        <div key={item.id} className="rounded-xl border border-[var(--ui-stroke)] p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-[var(--ui-text)]">{item.titulo}</p>
                              <p className="text-xs text-[var(--ui-text-subtle)]">Responsável: {item.responsavel} • Prazo {item.prazo}</p>
                            </div>
                            <Badge className="rounded-full" variant="secondary">{item.status}</Badge>
                          </div>
                          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                            <Select value={item.status} onValueChange={(value) => handleChecklistStatus(item.id, value as SaleChecklistItem['status'])}>
                              <SelectTrigger className="h-10 rounded-xl border-[var(--ui-stroke)]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {['Pendente', 'Em andamento', 'Concluído', 'Bloqueado'].map((status) => (
                                  <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              className="rounded-xl"
                              onClick={() => handleUpload(item.id)}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {item.exigeAnexo ? 'Anexar' : 'Vincular'}
                            </Button>
                            <Input
                              value={item.exigeAnexo ? 'Anexo obrigatório' : 'Anexo opcional'}
                              disabled
                              className="h-10 rounded-xl"
                            />
                          </div>
                          {item.exigeAnexo && !item.anexoUrl && (
                            <p className="text-xs text-[hsl(var(--warning))]">Anexo obrigatório para concluir.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="recebimentos" className="mt-0 space-y-3">
                  {receipts.map((receipt) => (
                    <div key={receipt.id} className="rounded-xl border border-[var(--ui-stroke)] p-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-[var(--ui-text)]">{receipt.valor}</p>
                        <p className="text-xs text-[var(--ui-text-subtle)]">{receipt.formaPagamento} • Vencimento {receipt.vencimento}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full">{receipt.status}</Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="comissoes" className="mt-0 space-y-3">
                  {commissions.map((commission) => (
                    <div key={commission.id} className="rounded-xl border border-[var(--ui-stroke)] p-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-[var(--ui-text)]">{commission.corretor}</p>
                        <p className="text-xs text-[var(--ui-text-subtle)]">{commission.percentual} • {commission.valorLiquido}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full">{commission.status}</Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="transferencias" className="mt-0 space-y-3">
                  {transfers.map((transfer) => (
                    <div key={transfer.id} className="rounded-xl border border-[var(--ui-stroke)] p-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-[var(--ui-text)]">{transfer.tarefa}</p>
                        <p className="text-xs text-[var(--ui-text-subtle)]">Responsável: {transfer.responsavel} • Previsto {transfer.dataPrevista}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full">{transfer.status}</Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="posvenda" className="mt-0 space-y-4">
                  <div className="rounded-xl border border-[var(--ui-stroke)] p-4">
                    <p className="text-sm font-medium text-[var(--ui-text)]">Checklist pós venda</p>
                    <p className="text-xs text-[var(--ui-text-subtle)]">Acompanhe registros de chaves, atualizações cadastrais e satisfação do cliente.</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-[var(--ui-stroke)] p-3">
                        <p className="text-xs text-[var(--ui-text-subtle)]">Entrega de chaves</p>
                        <p className="text-sm text-[var(--ui-text)]">Concluída em 12/02/2025</p>
                      </div>
                      <div className="rounded-lg border border-[var(--ui-stroke)] p-3">
                        <p className="text-xs text-[var(--ui-text-subtle)]">Atualização condomínio</p>
                        <p className="text-sm text-[var(--ui-text)]">Em andamento</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[var(--ui-stroke)] p-4">
                    <p className="text-sm font-medium text-[var(--ui-text)]">Feedback do cliente</p>
                    <Textarea placeholder="Registrar feedback do comprador" className="mt-2" />
                    <Button className="mt-3">Salvar feedback</Button>
                  </div>
                </TabsContent>

                <TabsContent value="historico" className="mt-0 space-y-3">
                  {timeline.map((item) => (
                    <div key={item.id} className="rounded-xl border border-[var(--ui-stroke)] p-4">
                      <p className="text-sm font-medium text-[var(--ui-text)]">{item.titulo}</p>
                      <p className="text-xs text-[var(--ui-text-subtle)]">{item.descricao}</p>
                      <p className="text-xs text-[var(--ui-text-subtle)]">{item.meta}</p>
                    </div>
                  ))}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <CardHeader>
              <CardTitle className="text-base">Tarefas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {saleTasks
                .filter((task) => task.contratoId === contract.id)
                .map((task) => (
                  <div key={task.id} className="rounded-xl border border-[var(--ui-stroke)] p-3">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{task.tarefa}</p>
                    <p className="text-xs text-[var(--ui-text-subtle)]">{task.responsavel} • {task.data}</p>
                  </div>
                ))}
              <Button variant="outline" className="w-full rounded-xl">Nova tarefa</Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <CardHeader>
              <CardTitle className="text-base">Ocorrências</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="rounded-xl border border-[var(--ui-stroke)] p-3">
                  <p className="text-sm font-medium text-[var(--ui-text)]">{event.titulo}</p>
                  <p className="text-xs text-[var(--ui-text-subtle)]">{event.data} • {event.status}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <CardHeader>
              <CardTitle className="text-base">Ações rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">Solicitar documentação</Button>
              <Button className="w-full" variant="outline">Enviar para jurídico</Button>
              <Button className="w-full">Gerar resumo do contrato</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendasModuleLayout>
  );
};

export default ContratoVendaDetalhesPage;
