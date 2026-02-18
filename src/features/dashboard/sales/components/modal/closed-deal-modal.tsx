'use client';

import { useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { ModalProps, LeadNegotiationType, CommissionAgentType } from '@/shared/types';
import { formatValue, participantTypeLabels } from '@/shared/lib/utils';

import { newLeadClosedDeal } from '@/features/dashboard/sales/api/lead-closed-deal';
import { getLeadProposal } from '@/features/dashboard/sales/api/lead-proposal';
import { getCatchers } from '@/features/dashboard/sales/api/lead';
import { makeClosedDealSchema, MakeClosedDealFormData } from '@/features/dashboard/sales/components/form/make-closed-deal-schema';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CurrencyInput } from '@/shared/components/ui/currency-input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { Loading } from '@/shared/components/loading';
import { removeNonNumeric } from '@/shared/lib/masks';

interface CloseDealModalProps extends Omit<ModalProps, 'title'> {
  leadName: string;
  leadUuid: string;
}

export function ClosedDealModal({ open, onClose, leadName, leadUuid }: CloseDealModalProps) {
  const queryClient = useQueryClient();

  const { data: proposal, isLoading: isLoadingProposal } = useQuery({
    queryKey: ['lead-proposal', leadUuid],
    queryFn: () => getLeadProposal(leadUuid),
    enabled: open && !!leadUuid,
  });

  const { data: catchersData, isLoading: isLoadingCatchers } = useQuery({
    queryKey: ['catchers-list'],
    queryFn: getCatchers,
    enabled: open,
  });

  const form = useForm<MakeClosedDealFormData>({
    resolver: zodResolver(makeClosedDealSchema),
    defaultValues: {
      propertyCode: 0,
      closedDate: new Date().toISOString().split('T')[0],
      totalValue: 0,
      totalCommission: '',
      negotiationType: LeadNegotiationType.COMPRA,
      additionalInfo: '',
      commissions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'commissions',
  });

  useEffect(() => {
    if (proposal && open) {
      form.setValue('propertyCode', Number(proposal.propertyCode));
      form.setValue('totalValue', proposal.proposalTotalValue);
    }
  }, [proposal, open, form]);

  const { mutate: createClosedDeal, isPending } = useMutation({
    mutationFn: (data: MakeClosedDealFormData) => newLeadClosedDeal(leadUuid, data),
    onSuccess: () => {
      toast.success('Negócio fechado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['lead-closed-deal', leadUuid] });
      queryClient.invalidateQueries({ queryKey: ['lead-detail', leadUuid] });
      form.reset();
      onClose();
    },
  });

  const handleAddParticipant = () => {
    append({
      agentUuid: '',
      agentType: CommissionAgentType.REALTOR,
      agentName: undefined,
      agentEmail: undefined,
      federalDocument: undefined,
      commissionPercentage: '',
      mainResponsible: fields.length === 0,
    });
  };

  const handleAgentTypeChange = (index: number, newType: CommissionAgentType) => {
    form.setValue(`commissions.${index}.agentType`, newType);

    if (newType === CommissionAgentType.PARTNER) {
      // Para PARTNER: limpar agentUuid e preparar campos para preenchimento manual
      form.setValue(`commissions.${index}.agentUuid`, '');
      form.setValue(`commissions.${index}.agentName`, '');
      form.setValue(`commissions.${index}.agentEmail`, '');
      form.setValue(`commissions.${index}.federalDocument`, '');
    } else {
      // Para outros tipos: limpar dados manuais
      form.setValue(`commissions.${index}.agentName`, undefined);
      form.setValue(`commissions.${index}.agentEmail`, undefined);
      form.setValue(`commissions.${index}.federalDocument`, undefined);
      form.setValue(`commissions.${index}.agentUuid`, '');
    }
  };

  const handleSetPrimary = (index: number) => {
    fields.forEach((_, i) => {
      form.setValue(`commissions.${i}.mainResponsible`, i === index);
    });
  };

  const handleUserSelect = (index: number, userUuid: string) => {
    const catcher = catchersData?.find((c) => c.uuid === userUuid);
    if (catcher) {
      form.setValue(`commissions.${index}.agentUuid`, catcher.uuid);
      form.setValue(`commissions.${index}.agentName`, catcher.name);
    }
  };

  const getTotalPercentage = () => {
    return fields.reduce((sum, _, index) => {
      const percentage = Number(form.watch(`commissions.${index}.commissionPercentage`) || 0);
      return sum + percentage;
    }, 0);
  };

  const calculateCommissionValue = (percentage: string) => {
    const totalValue = form.watch('totalValue') || 0;
    const totalCommission = Number(form.watch('totalCommission') || 0);

    if (!totalValue || !totalCommission || !percentage) return 0;

    const commissionAmount = (totalValue * totalCommission) / 100;
    const participantValue = (commissionAmount * Number(percentage)) / 100;

    return participantValue;
  };

  const onSubmit = (data: MakeClosedDealFormData) => {
    const totalPercentage = getTotalPercentage();
    if (Math.abs(totalPercentage - 100) > 0.001) {
      toast.error(`A soma das porcentagens deve ser 100%. Atual: ${totalPercentage}%`);
      return;
    }

    const hasMainResponsible = data.commissions.some((c) => c.mainResponsible);
    if (!hasMainResponsible && data.commissions.length > 0) {
      toast.error('Selecione um responsável principal pelo fechamento.');
      return;
    }

    const closedDateTime = `${data.closedDate}T${new Date().toTimeString().slice(0, 8)}`;

    const formattedData = {
      ...data,
      closedDate: closedDateTime,
      commissions: data.commissions.map((c) => {
        if (c.agentType === CommissionAgentType.PARTNER) {
          return {
            ...c,
            agentUuid: undefined,
            commissionPercentage: c.commissionPercentage,
          };
        } else {
          return {
            ...c,
            agentName: undefined,
            agentEmail: undefined,
            federalDocument: undefined,
            commissionPercentage: c.commissionPercentage,
          };
        }
      }),
    };

    createClosedDeal(formattedData);
  };

  const isLoading = isLoadingProposal || isLoadingCatchers;
  const hasProposal = !!proposal;

  return (
    <Modal
      title="Negócio Fechado"
      description="Registre o fechamento do negócio e distribua a comissão"
      open={open}
      onClose={() => {
        onClose();
        form.reset();
      }}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Contexto */}
            <div className="space-y-2 p-4 rounded-lg bg-muted">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Lead:</span>
                <span className="text-sm font-semibold">{leadName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Etapa do Funil:</span>
                <span className="text-sm text-primary font-semibold">Em Negociação → Negócio Fechado</span>
              </div>
            </div>

            {/* Dados Iniciais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-primary">Dados do Negócio</h3>

              <FormField
                control={form.control}
                name="closedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Fechamento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Real do Negócio</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="R$ 0,00"
                        value={(field.value * 100).toString()}
                        onChange={(value) => field.onChange(parseFloat(value) / 100)}
                        onBlur={field.onBlur}
                        name={field.name}
                        disabled={hasProposal}
                      />
                    </FormControl>
                    <FormMessage />
                    {hasProposal && <p className="text-xs text-muted-foreground">Valor preenchido automaticamente da proposta</p>}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="negotiationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Natureza da Negociação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={LeadNegotiationType.COMPRA}>Compra</SelectItem>
                        <SelectItem value={LeadNegotiationType.ALUGUEL}>Aluguel</SelectItem>
                        <SelectItem value={LeadNegotiationType.LANCAMENTO}>Lançamento</SelectItem>
                        <SelectItem value={LeadNegotiationType.CAPTACAO}>Captação</SelectItem>
                        <SelectItem value={LeadNegotiationType.INDEFINIDO}>Indefinido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código do Imóvel</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: IMO-12345" {...field} disabled={hasProposal} />
                    </FormControl>
                    <FormMessage />
                    {hasProposal && (
                      <p className="text-xs text-muted-foreground">Código preenchido automaticamente da proposta</p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Rateio da Comissão */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base text-primary">Rateio da Comissão</h3>
                <Button type="button" size="sm" variant="outline" onClick={handleAddParticipant}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Participante
                </Button>
              </div>

              <FormField
                control={form.control}
                name="totalCommission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comissão Total (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 6" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lista de Participantes */}
              {fields.length > 0 && (
                <>
                  <div className="space-y-4">
                    {fields.map((field, index) => {
                      const commissionValue = calculateCommissionValue(form.watch(`commissions.${index}.commissionPercentage`));

                      return (
                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-medium text-sm">Participante {index + 1}</span>
                            <Button type="button" size="sm" variant="ghost" onClick={() => remove(index)} className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <FormField
                            control={form.control}
                            name={`commissions.${index}.agentType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Tipo</FormLabel>
                                <Select
                                  onValueChange={(value) => handleAgentTypeChange(index, value as CommissionAgentType)}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.entries(participantTypeLabels).map(([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch(`commissions.${index}.agentType`) === CommissionAgentType.PARTNER ? (
                            <>
                              <FormField
                                control={form.control}
                                name={`commissions.${index}.agentName`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">Nome</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Nome do parceiro" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`commissions.${index}.agentEmail`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">Email</FormLabel>
                                    <FormControl>
                                      <Input placeholder="email@exemplo.com" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`commissions.${index}.federalDocument`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">CPF/CNPJ</FormLabel>
                                    <FormControl>
                                      <Input placeholder="000.000.000-00" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          ) : (
                            <FormField
                              control={form.control}
                              name={`commissions.${index}.agentUuid`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Participante</FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      handleUserSelect(index, value);
                                    }}
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione...">
                                          {form.watch(`commissions.${index}.agentName`) || 'Selecione...'}
                                        </SelectValue>
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {catchersData?.map((catcher) => (
                                        <SelectItem key={catcher.uuid} value={catcher.uuid}>
                                          {catcher.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`commissions.${index}.commissionPercentage`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">% Comissão</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="space-y-2">
                              <FormLabel className="text-xs">Valor (R$)</FormLabel>
                              <Input type="text" value={formatValue(commissionValue)} disabled className="bg-muted" />
                            </div>
                          </div>

                          <FormField
                            control={form.control}
                            name={`commissions.${index}.mainResponsible`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <FormLabel className="text-xs">Responsável Principal</FormLabel>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={() => handleSetPrimary(index)} />
                                  </FormControl>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      );
                    })}

                    <div className="p-3 rounded-lg bg-muted">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">Total:</span>
                        <span
                          className={`font-semibold text-sm ${
                            getTotalPercentage() > 100
                              ? 'text-destructive'
                              : Math.abs(getTotalPercentage() - 100) < 0.001
                                ? 'text-green-600'
                                : ''
                          }`}
                        >
                          {Math.round(getTotalPercentage())}%
                        </span>
                      </div>
                      {getTotalPercentage() > 100 && (
                        <p className="text-xs text-destructive mt-1">A soma das porcentagens não pode ultrapassar 100%</p>
                      )}
                      {getTotalPercentage() < 100 && fields.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Faltam {Math.round(100 - getTotalPercentage())}% para distribuir
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  <p className="text-sm">Nenhum participante adicionado</p>
                  <p className="text-xs mt-1">Clique em &quot;Adicionar Participante&quot; para começar</p>
                </div>
              )}
            </div>

            {/* Informações Adicionais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-primary">Informações Adicionais</h3>
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do contrato, nota fiscal, link do dossiê, etc.</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Adicione informações relevantes como número do contrato, nota fiscal, links de documentos..."
                        rows={4}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isPending}>
                Finalizar Negócio
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Modal>
  );
}
