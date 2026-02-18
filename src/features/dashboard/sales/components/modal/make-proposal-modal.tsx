'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addHours } from 'date-fns';

import { LeadPaymentConditionTypes, LeadPaymentExchangeType, LeadPaymentPriceIndex, ModalProps } from '@/shared/types';

import { getLeadBankOptions, newLeadProposal } from '@/features/dashboard/sales/api/lead-proposal';
import { createTask, completeTask } from '@/features/dashboard/calendar/api/tasks';
import { MakeProposalFormData, makeProposalSchema } from '@/features/dashboard/sales/components/form/make-proposal-schema';

import { normalizeDateTimeInput, parseDateTimeToISO, formatISOToDateTime, removeNonNumeric } from '@/shared/lib/masks';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CurrencyInput } from '@/shared/components/ui/currency-input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface MakeProposalModalProps extends Omit<ModalProps, 'title'> {
  leadUuid: string;
  leadName: string;
  propertyCode?: string;
}

export function MakeProposalModal({ open, onClose, leadUuid, leadName, propertyCode }: MakeProposalModalProps) {
  const queryClient = useQueryClient();

  const { data: banks, isLoading: isLoadingBanks } = useQuery({
    queryKey: ['lead-banks'],
    queryFn: getLeadBankOptions,
    enabled: open,
  });

  const form = useForm<MakeProposalFormData>({
    resolver: zodResolver(makeProposalSchema),
    defaultValues: {
      propertyCode: propertyCode || '',
      proposalTotalValue: '',
      validity: addHours(new Date(), 72).toISOString(),
      paymentConditionTypes: [],
      ownResources: null,
      financing: null,
      consortium: null,
      exchange: null,
      otherPayment: null,
      signal: null,
    },
  });

  const selectedConditions = form.watch('paymentConditionTypes') || [];

  const { mutate: createProposal, isPending } = useMutation({
    mutationFn: (data: MakeProposalFormData) => newLeadProposal(leadUuid, data),
    onSuccess: async () => {
      toast.success('Proposta criada com sucesso!');
      try {
        const now = new Date();
        const task = await createTask({
          title: `Proposta criada para ${leadName}`,
          description: `Proposta criada para o lead ${leadName}`,
          taskCode: 'PROPOSAL',
          taskDate: now.toISOString().split('T')[0],
          taskTime: {
            hour: now.getHours() + 3,
            minute: now.getMinutes(),
            second: now.getSeconds(),
          },
          color: '#22c55e',
          leadUuid: leadUuid,
          propertyCode: form.getValues('propertyCode'),
        });

        await completeTask(task.uuid);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      } catch {}

      queryClient.invalidateQueries({ queryKey: ['lead-proposal', leadUuid] });
      queryClient.invalidateQueries({ queryKey: ['lead-detail', leadUuid] });
      form.reset();
      onClose();
    },
  });

  const handleConditionToggle = (condition: LeadPaymentConditionTypes) => {
    const current = selectedConditions;
    const updated = current.includes(condition) ? current.filter((c) => c !== condition) : [...current, condition];
    form.setValue('paymentConditionTypes', updated);
  };

  const onSubmit = (data: MakeProposalFormData) => {
    const cleanedData = {
      ...data,
      propertyCode: data.propertyCode.trim(),
      proposalTotalValue: data.proposalTotalValue ? (parseFloat(data.proposalTotalValue) / 100).toString() : '',
      ownResources:
        data.ownResources?.resourcesAmount && data.ownResources?.balance
          ? {
              resourcesAmount: (parseFloat(data.ownResources.resourcesAmount) / 100).toString(),
              balance: (parseFloat(data.ownResources.balance) / 100).toString(),
            }
          : null,
      financing: data.financing?.bankUuid
        ? {
            bankUuid: data.financing.bankUuid,
            financingPercent: data.financing.financingPercent,
            term: data.financing.term,
            taxRate: data.financing.taxRate,
            signalValue: data.financing.signalValue ? (parseFloat(data.financing.signalValue) / 100).toString() : '0',
            fgtsValue: data.financing.fgtsValue ? (parseFloat(data.financing.fgtsValue) / 100).toString() : '0',
          }
        : null,
      consortium: data.consortium?.value
        ? {
            value: (parseFloat(data.consortium.value) / 100).toString(),
            consortiumContemplated: data.consortium.consortiumContemplated,
          }
        : null,
      exchange: data.exchange?.exchangeValue
        ? {
            exchangeType: data.exchange.exchangeType,
            exchangeValue: (parseFloat(data.exchange.exchangeValue) / 100).toString(),
            observations: data.exchange.observations,
          }
        : null,
      otherPayment:
        data.otherPayment?.description && data.otherPayment?.amount
          ? {
              description: data.otherPayment.description,
              amount: (parseFloat(data.otherPayment.amount) / 100).toString(),
            }
          : null,
      signal:
        data.signal?.signalValue || data.signal?.signalDate || data.signal?.priceIndex || data.signal?.observations
          ? {
              signalValue: data.signal?.signalValue ? (parseFloat(data.signal.signalValue) / 100).toString() : undefined,
              signalDate: data.signal?.signalDate,
              priceIndex: data.signal?.priceIndex || LeadPaymentPriceIndex.NO_INDEX,
              observations: data.signal?.observations,
            }
          : null,
    };

    createProposal(cleanedData as MakeProposalFormData);
  };

  return (
    <Modal
      title="Fazer Proposta"
      description="Crie uma proposta comercial para este lead"
      open={open}
      onClose={() => {
        onClose();
        form.reset();
      }}
    >
      {isLoadingBanks ? (
        <Loading />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 p-4 rounded-lg bg-muted">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Lead:</span>
                <span className="text-sm font-semibold">{leadName}</span>
              </div>
            </div>

            {/* Dados da Proposta */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-primary">Dados da Proposta</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="proposalTotalValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total da Proposta</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="R$ 500.000,00"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{' '}
                <FormField
                  control={form.control}
                  name="validity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validade da Proposta</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="DD/MM/AAAA HH:MM"
                          {...field}
                          value={field.value ? formatISOToDateTime(field.value) : ''}
                          onChange={(e) => {
                            const formatted = normalizeDateTimeInput(e.target.value);
                            if (formatted.length === 16) {
                              const isoDate = parseDateTimeToISO(formatted);
                              if (isoDate) {
                                field.onChange(isoDate);
                              }
                            } else {
                              field.onChange(field.value);
                            }
                          }}
                          maxLength={16}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="propertyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código do Imóvel</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value} placeholder="IMO-21EAFE45" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Condições de Pagamento */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-primary">Condições de Pagamento</h3>
              <p className="text-sm text-muted-foreground">Selecione uma ou mais formas de pagamento</p>

              <div className="space-y-3">
                {/* Recursos Próprios */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="own_resources"
                    checked={selectedConditions.includes(LeadPaymentConditionTypes.OWN_RESOURCES)}
                    onCheckedChange={() => handleConditionToggle(LeadPaymentConditionTypes.OWN_RESOURCES)}
                  />
                  <div className="flex-1 space-y-3">
                    <Label htmlFor="own_resources" className="font-medium cursor-pointer">
                      Recursos Próprios
                    </Label>
                    {selectedConditions.includes(LeadPaymentConditionTypes.OWN_RESOURCES) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
                        <FormField
                          control={form.control}
                          name="ownResources.resourcesAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Entrada (R$)</FormLabel>
                              <FormControl>
                                <CurrencyInput
                                  placeholder="R$ 50.000,00"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ownResources.balance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Saldo (R$)</FormLabel>
                              <FormControl>
                                <CurrencyInput
                                  placeholder="R$ 50.000,00"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Financiamento */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="financing"
                    checked={selectedConditions.includes(LeadPaymentConditionTypes.FINANCING)}
                    onCheckedChange={() => handleConditionToggle(LeadPaymentConditionTypes.FINANCING)}
                  />
                  <div className="flex-1 space-y-3">
                    <Label htmlFor="financing" className="font-medium cursor-pointer">
                      Financiamento
                    </Label>
                    {selectedConditions.includes(LeadPaymentConditionTypes.FINANCING) && (
                      <div className="space-y-3 pl-1">
                        <FormField
                          control={form.control}
                          name="financing.bankUuid"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Banco</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o banco" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {banks?.map((bank) => (
                                    <SelectItem key={bank.uuid} value={bank.uuid}>
                                      {bank.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="financing.financingPercent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Percentual Financiado (%)</FormLabel>
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
                          <FormField
                            control={form.control}
                            name="financing.signalValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Entrada (R$)</FormLabel>
                                <FormControl>
                                  <CurrencyInput
                                    placeholder="R$ 50.000,00"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="financing.term"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Prazo (meses)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="360"
                                    {...field}
                                    onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="financing.taxRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Taxa (% a.a.)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="8.5"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="financing.fgtsValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">FGTS (R$)</FormLabel>
                                <FormControl>
                                  <CurrencyInput
                                    placeholder="R$ 50.000,00"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Consórcio */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consortium"
                    checked={selectedConditions.includes(LeadPaymentConditionTypes.CONSORTIUM)}
                    onCheckedChange={() => handleConditionToggle(LeadPaymentConditionTypes.CONSORTIUM)}
                  />
                  <div className="flex-1 space-y-3">
                    <Label htmlFor="consortium" className="font-medium cursor-pointer">
                      Consórcio
                    </Label>
                    {selectedConditions.includes(LeadPaymentConditionTypes.CONSORTIUM) && (
                      <div className="space-y-3 pl-1">
                        <FormField
                          control={form.control}
                          name="consortium.value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Valor (R$)</FormLabel>
                              <FormControl>
                                <CurrencyInput
                                  placeholder="R$ 50.000,00"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="consortium.consortiumContemplated"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Contemplado?</FormLabel>
                              <FormControl>
                                <div className="flex items-center space-x-4">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      checked={field.value === true}
                                      onChange={() => field.onChange(true)}
                                      className="h-4 w-4"
                                    />
                                    <span className="text-sm">Sim</span>
                                  </label>
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      checked={field.value === false}
                                      onChange={() => field.onChange(false)}
                                      className="h-4 w-4"
                                    />
                                    <span className="text-sm">Não</span>
                                  </label>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Permuta */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="exchange"
                    checked={selectedConditions.includes(LeadPaymentConditionTypes.EXCHANGE)}
                    onCheckedChange={() => handleConditionToggle(LeadPaymentConditionTypes.EXCHANGE)}
                  />
                  <div className="flex-1 space-y-3">
                    <Label htmlFor="exchange" className="font-medium cursor-pointer">
                      Permuta
                    </Label>
                    {selectedConditions.includes(LeadPaymentConditionTypes.EXCHANGE) && (
                      <div className="space-y-3 pl-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="exchange.exchangeType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Tipo de Permuta</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value={LeadPaymentExchangeType.PROPERTY}>Imóvel</SelectItem>
                                    <SelectItem value={LeadPaymentExchangeType.VEHICLE}>Veículo</SelectItem>
                                    <SelectItem value={LeadPaymentExchangeType.OTHER}>Outro</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="exchange.exchangeValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Valor (R$)</FormLabel>
                                <FormControl>
                                  <CurrencyInput
                                    placeholder="R$ 50.000,00"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="exchange.observations"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Observações</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Descreva detalhes sobre a permuta..." rows={2} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Outros */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="other"
                    checked={selectedConditions.includes(LeadPaymentConditionTypes.OTHER)}
                    onCheckedChange={() => handleConditionToggle(LeadPaymentConditionTypes.OTHER)}
                  />
                  <div className="flex-1 space-y-3">
                    <Label htmlFor="other" className="font-medium cursor-pointer">
                      Outros
                    </Label>
                    {selectedConditions.includes(LeadPaymentConditionTypes.OTHER) && (
                      <div className="space-y-3 pl-1">
                        <FormField
                          control={form.control}
                          name="otherPayment.description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Descrição</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Descreva outras condições de pagamento..." rows={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="otherPayment.amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Valor (R$)</FormLabel>
                              <FormControl>
                                <CurrencyInput
                                  placeholder="R$ 50.000,00"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sinal / Condições Comerciais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-primary">Sinal / Condições Comerciais (Opcional)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="signal.signalValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sinal (R$)</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="R$ 25.000,00"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="signal.signalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Sinal</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="signal.priceIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correção/Índice</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um índice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={LeadPaymentPriceIndex.NO_INDEX}>Sem correção</SelectItem>
                        <SelectItem value={LeadPaymentPriceIndex.INCC}>INCC</SelectItem>
                        <SelectItem value={LeadPaymentPriceIndex.IPCA}>IPCA</SelectItem>
                        <SelectItem value={LeadPaymentPriceIndex.IGPM}>IGPM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="signal.observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Condições adicionais, cláusulas especiais, etc."
                        rows={3}
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
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Criando...' : 'Criar Proposta'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Modal>
  );
}
