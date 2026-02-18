'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { LeadOriginTypeToLabel } from '@/shared/lib/utils';
import { normalizePhoneNumber } from '@/shared/lib/masks';

function removeCountryCode(phone: string | null | undefined): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  // Se começa com 55 e tem 12-13 dígitos (formato brasileiro com DDI)
  if (cleaned.startsWith('55') && (cleaned.length === 12 || cleaned.length === 13)) {
    return cleaned.slice(2);
  }
  return cleaned;
}

import { LeadNegotiationType, LeadOriginType, ModalProps } from '@/shared/types';

import { createLead, getCatchers, getLeadById, updateLead } from '@/features/dashboard/sales/api/lead';

import { Modal } from '@/shared/components/ui/modal';
import {
  LeadFormData,
  leadFormSchema,
  contactOriginOptions,
} from '@/features/dashboard/sales/components/form/lead-form';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { CurrencyInput } from '@/shared/components/ui/currency-input';
import { Separator } from '@/shared/components/ui/separator';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';

interface SaveLeadModalProps extends Omit<ModalProps, 'title'> {
  title?: string;
  uuid?: string | null;
}

export function SaveLeadModal({ open, onClose, title, uuid }: SaveLeadModalProps) {
  const queryClient = useQueryClient();
  const [assignmentType, setAssignmentType] = useState<'user' | 'automatic'>('automatic');

  const {
    data: lead,
    isLoading: isLoadingLead,
    isError: isErrorLead,
    error: leadError,
  } = useQuery({
    queryKey: ['lead-detail', uuid],
    queryFn: () => getLeadById(uuid!),
    enabled: !!uuid,
  });

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      phone1: '',
      phone2: '',
      email: '',
      productTitle: '',
      productPrice: '',
      propertyCode: '',
      negotiationType: LeadNegotiationType.INDEFINIDO,
      adUrl: '',
      originType: LeadOriginType.WHATSAPP,
      catcherUuid: undefined,
      canModifyQueue: false,
      canJoinRoletao: false,
      messageToCatcher: '',
      contactOriginType: 'INBOUND',
    },
  });

  useEffect(() => {
    if (lead) {
      console.log(lead);
      form.reset({
        name: lead.name || '',
        phone1: removeCountryCode(lead.phone1),
        phone2: removeCountryCode(lead.phone2),
        email: lead.email || '',
        productTitle: lead.productTitle || '',
        productPrice: lead.productPrice ? String(lead.productPrice * 100) : '',
        propertyCode: lead.propertyCode || '',
        negotiationType: lead.negotiationType || LeadNegotiationType.INDEFINIDO,
        adUrl: lead.adUrl || '',
        originType: lead.originType || LeadOriginType.WHATSAPP,
        catcherUuid: lead.catcher?.uuid || undefined,
        canModifyQueue: lead.canModifyQueue || false,
        canJoinRoletao: lead.canJoinRoletao || false,
        messageToCatcher: lead.messageToCatcher || '',
        contactOriginType: (lead.contactOriginType as 'INBOUND' | 'OUTBOUND') || 'INBOUND',
      });

      if (lead.catcher?.uuid) {
        setAssignmentType('user');
      }
    }
  }, [lead, form]);

  const createMutation = useMutation({
    mutationFn: async (data: LeadFormData) => createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead criado com sucesso!');
      form.reset();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: LeadFormData) => updateLead(uuid!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead atualizado com sucesso!');
      form.reset();
      onClose();
    },
  });

  const { data: leadCatchers = [] } = useQuery({
    queryKey: ['lead-catchers'],
    queryFn: () => getCatchers(),
    enabled: open,
  });

  function onSubmit(data: LeadFormData) {
    const formattedData = {
      ...data,
      productPrice: data.productPrice ? (parseFloat(data.productPrice) / 100).toString() : '',
    };

    if (uuid) {
      updateMutation.mutate(formattedData);
    } else {
      createMutation.mutate(formattedData);
    }
  }

  const isLoading = isLoadingLead || createMutation.isPending || updateMutation.isPending;
  const isEditMode = !!uuid;

  return (
    <Modal open={open} onClose={onClose} title={title || (isEditMode ? 'Editar Lead' : 'Criar Novo Lead')}>
      {isLoadingLead ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">Carregando dados do lead...</p>
        </div>
      ) : isErrorLead ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-destructive">Erro ao carregar lead: {leadError?.message}</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 1 - Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary">1. Informações Pessoais</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone 1</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} value={normalizePhoneNumber(field.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone 2</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} value={normalizePhoneNumber(field.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* 2 - Produto (Interesse) */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary">2. Produto (Interesse)</h3>

              <FormField
                control={form.control}
                name="productTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Apartamento 3 quartos no centro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
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
                />

                <FormField
                  control={form.control}
                  name="propertyCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código do Imóvel</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: #IMO-45213" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="negotiationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Natureza da Negociação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o tipo de negociação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LeadNegotiationType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do Anúncio</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* 3 - Forma de Entrada (Fonte) */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary">3. Forma de Entrada</h3>

              <FormField
                control={form.control}
                name="originType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origem</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a origem" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LeadOriginType).map((option) => (
                          <SelectItem key={option} value={option}>
                            {LeadOriginTypeToLabel(option)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* 4 - Atribuição e Regras */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary">4. Atribuição e Regras</h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    size="sm"
                    variant={assignmentType === 'user' ? 'default' : 'outline'}
                    onClick={() => setAssignmentType('user')}
                  >
                    Enviar para Usuário
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={assignmentType === 'automatic' ? 'default' : 'outline'}
                    onClick={() => setAssignmentType('automatic')}
                  >
                    Distribuir Automaticamente
                  </Button>
                </div>

                {assignmentType === 'user' && (
                  <FormField
                    control={form.control}
                    name="catcherUuid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecione o Usuário</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione um usuário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {leadCatchers.length === 0 ? (
                              <SelectItem value="no-users" disabled>
                                Nenhum usuário disponível
                              </SelectItem>
                            ) : (
                              leadCatchers.map((user) => (
                                <SelectItem key={user.uuid} value={user.uuid}>
                                  {user.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="canModifyQueue"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Modificar Fila de Distribuição</FormLabel>
                      <FormDescription>Este lead deve modificar a fila de distribuição?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="canJoinRoletao"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Entrar no Roletão</FormLabel>
                      <FormDescription>Este lead pode entrar no Roletão de leads?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="messageToCatcher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem ao Usuário</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite uma mensagem para o usuário que receberá o lead..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* 5 - Origem do Contato */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary">5. Origem do Contato</h3>

              <FormField
                control={form.control}
                name="contactOriginType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Origem do Relacionamento</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
                        {contactOriginOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-start space-x-3 space-y-0 rounded-lg border p-4"
                          >
                            <RadioGroupItem value={option.value} id={option.value} />
                            <div className="space-y-1 leading-none">
                              <Label htmlFor={option.value} className="font-medium cursor-pointer">
                                {option.label}
                              </Label>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" onClick={onClose} variant="outline" disabled={isLoading}>
                Cancelar
              </Button>

              <Button type="submit" isLoading={isLoading}>
                {isEditMode ? 'Atualizar Lead' : 'Criar Novo Lead'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Modal>
  );
}
