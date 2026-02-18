'use client';

import { useState } from 'react';
import { Calendar, Building2, Users, FileText, UserPlus, DollarSign, MessageCircle, CircleAlert } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { formatLongDateHour, formatValue } from '@/shared/lib/utils';
import { CommissionAgentType, LeadFunnelStages } from '@/shared/types';

import { updateLeadFunnelStep } from '@/features/dashboard/sales/api/lead';

import { getLeadClosedDeal, leadClosedDealSetRevenuePayment } from '@/features/dashboard/sales/api/lead-closed-deal';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { SaveLeadModal } from '@/features/dashboard/sales/components/modal/save-lead-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { NoContentCard } from '@/shared/components/no-content-card';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { ErrorCard } from '@/shared/components/error-card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Modal } from '@/shared/components/ui/modal';

interface DealsTabProps {
  leadUuid: string;
  leadFunnelStage: LeadFunnelStages;
}

const commissionAgentTypeLabels: Record<CommissionAgentType, string> = {
  [CommissionAgentType.REALTOR]: 'Corretor',
  [CommissionAgentType.MANAGER]: 'Gestor',
  [CommissionAgentType.PARTNER]: 'Parceria Externa',
  [CommissionAgentType.CATCHER]: 'Captador',
};

const negotiationTypeLabels = {
  COMPRA: 'Compra',
  ALUGUEL: 'Aluguel',
  LANCAMENTO: 'Lançamento',
  CAPTACAO: 'Captação',
  INDEFINIDO: 'Indefinido',
};

export function DealsTab({ leadUuid, leadFunnelStage }: DealsTabProps) {
  const queryClient = useQueryClient();
  const [isSaveLeadModalOpen, setIsSaveLeadModalOpen] = useState(false);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isAfterSalesModalOpen, setIsAfterSalesModalOpen] = useState(false);
  const [revenueDate, setRevenueDate] = useState('');

  const {
    data: deal,
    isLoading: isLoadingDeal,
    isError: isErrorDeal,
    error: dealError,
  } = useQuery({
    queryKey: ['lead-closed-deal', leadUuid],
    queryFn: () => getLeadClosedDeal(leadUuid),
    enabled: !!leadUuid,
  });

  const { mutate: setRevenuePayment, isPending } = useMutation({
    mutationFn: (revenueGenerationDate: string) => leadClosedDealSetRevenuePayment(leadUuid, revenueGenerationDate),
    onSuccess: () => {
      toast.success('Receita registrada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['lead-closed-deal', leadUuid] });
      queryClient.invalidateQueries({ queryKey: ['lead-detail', leadUuid] });
      setIsRevenueModalOpen(false);
      setRevenueDate('');
    },
  });

  const leadPostSale = useMutation({
    mutationFn: () => updateLeadFunnelStep(leadUuid, LeadFunnelStages.POS_VENDA),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-detail'] });
      toast.success('Lead movido para pós-venda com sucesso!');
      setIsAfterSalesModalOpen(false);
    },
  });

  const handleSaveRevenue = () => {
    if (!revenueDate) return;
    const revenueDateTime = `${revenueDate}T${new Date().toTimeString().slice(0, 8)}`;
    setRevenuePayment(revenueDateTime);
  };

  const calculateCommissionValue = (percentage: number, totalValue: number, totalCommission: number) => {
    const commissionAmount = (totalValue * totalCommission) / 100;
    const participantValue = (commissionAmount * percentage) / 100;
    return participantValue;
  };

  const getTotalCommissionValue = () => {
    if (!deal) return 0;
    return (deal.totalValue * deal.totalCommission) / 100;
  };

  if (isLoadingDeal) return <Loading />;
  if (!deal) return <NoContentCard title="Ainda não há negócio fechado" icon={CircleAlert} />;
  if (isErrorDeal) return <ErrorCard error={dealError} title="Erro ao carregar negócio fechado" />;

  return (
    <>
      <SaveLeadModal open={isSaveLeadModalOpen} onClose={() => setIsSaveLeadModalOpen(false)} title="Gerar Indicação" />

      <Modal
        open={isRevenueModalOpen}
        onClose={() => setIsRevenueModalOpen(false)}
        title="Registrar Receita Gerada"
        description="Informe a data em que recebeu a comissão"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="revenueDate">Data do Recebimento</Label>
            <Input id="revenueDate" type="date" value={revenueDate} onChange={(e) => setRevenueDate(e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsRevenueModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRevenue} disabled={!revenueDate || isPending} isLoading={isPending}>
              Salvar
            </Button>
          </div>
        </div>
      </Modal>

      <AlertModal
        title="Mover para Pós-venda?"
        description="Este lead será movido para o status de pós-venda no funil. Deseja continuar?"
        isDestructive={false}
        isOpen={isAfterSalesModalOpen}
        onClose={() => setIsAfterSalesModalOpen(false)}
        onConfirm={leadPostSale.mutate}
        loading={leadPostSale.isPending}
      />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Negócio Fechado</CardTitle>
          </CardHeader>
          <CardContent>
            {!deal ? (
              <div className="text-center py-12">
                <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">Nenhum negócio fechado ainda</p>
                <p className="text-sm text-muted-foreground mt-1">O negócio fechado aparecerá aqui</p>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                {/* Cabeçalho do Negócio */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-base">{deal.propertyCode}</h3>
                      <Badge variant="outline">{negotiationTypeLabels[deal.negotiationType]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(deal.closedDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{formatValue(deal.totalValue)}</p>
                    <p className="text-sm text-muted-foreground">
                      Comissão: {formatValue(getTotalCommissionValue())} ({deal.totalCommission}%)
                    </p>
                  </div>
                </div>

                {/* Informações Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Fechado em:</span>
                    <span className="font-medium">{new Date(deal.closedDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Imóvel:</span>
                    <span className="font-medium">{deal.propertyCode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Participantes:</span>
                    <span className="font-medium">{deal.commissions.length}</span>
                  </div>
                </div>

                {/* Detalhes Expansíveis */}
                <Accordion type="single" collapsible className="border-t pt-3">
                  <AccordionItem value="details" className="border-0">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <span className="text-sm font-medium">Ver detalhes completos</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {/* Participantes e Comissões */}
                        <div>
                          <h4 className="font-semibold text-sm mb-3">Rateio da Comissão</h4>
                          <div className="space-y-2">
                            {deal.commissions.map((commission, index) => {
                              const commissionValue = calculateCommissionValue(
                                commission.commissionPercentage,
                                deal.totalValue,
                                deal.totalCommission,
                              );

                              return (
                                <div
                                  key={index}
                                  className={`p-3 rounded-lg border ${
                                    commission.mainResponsible ? 'bg-primary/5 border-primary/20' : 'bg-muted'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-sm">{commission.agentName}</p>
                                      {commission.mainResponsible && (
                                        <Badge variant="default" className="h-5 text-xs">
                                          Principal
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                    <div>
                                      <p className="text-muted-foreground">Tipo</p>
                                      <p className="font-medium">{commissionAgentTypeLabels[commission.agentType]}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Email</p>
                                      <p className="font-medium">{commission.agentEmail || '-'}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">% Comissão</p>
                                      <p className="font-medium">{commission.commissionPercentage.toFixed(2)}%</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Valor</p>
                                      <p className="font-medium text-primary">{formatValue(commissionValue)}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Informações Adicionais */}
                        {deal.additionalInfo && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Informações Adicionais</h4>
                            <p className="text-sm p-3 bg-muted rounded-lg whitespace-pre-wrap">{deal.additionalInfo}</p>
                          </div>
                        )}

                        {/* Receita Gerada */}
                        {deal.revenueGenerationDate && (
                          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-green-900 dark:text-green-100">
                                Receita registrada em {new Date(deal.revenueGenerationDate).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Data de Criação */}
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Registrado em {formatLongDateHour(deal.createdAt)}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Botões de Ação */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-3">Ações</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="w-full" onClick={() => setIsSaveLeadModalOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Gerar Indicação
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsRevenueModalOpen(true)}
                      disabled={!!deal.revenueGenerationDate}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      {deal.revenueGenerationDate ? 'Receita Registrada' : 'Receita Gerada'}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsAfterSalesModalOpen(true)}
                      disabled={leadFunnelStage === LeadFunnelStages.POS_VENDA}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Pós-venda
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
