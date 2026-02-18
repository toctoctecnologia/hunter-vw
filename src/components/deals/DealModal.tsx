import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Trash2 } from 'lucide-react';

import type {
  DealParticipantInput,
  DealParticipantProfile,
  LeadDeal,
  LeadDealDraft,
} from '@/api/deals';
import { PropertyCard } from '@/components/imoveis/PropertyCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const propertySchema = z.object({
  id: z.string().optional().default(''),
  code: z.string().optional().default(''),
  title: z.string().optional().default(''),
  type: z.string().optional().default(''),
  city: z.string().optional().default(''),
  price: z
    .number({ invalid_type_error: 'Informe o valor do imóvel' })
    .min(0, 'Valor inválido')
    .optional()
    .or(z.literal(NaN)),
  area: z
    .number({ invalid_type_error: 'Informe a área' })
    .min(0, 'Área inválida')
    .optional()
    .or(z.literal(NaN)),
  beds: z
    .number({ invalid_type_error: 'Informe os dormitórios' })
    .min(0, 'Valor inválido')
    .optional()
    .or(z.literal(NaN)),
  baths: z
    .number({ invalid_type_error: 'Informe os banheiros' })
    .min(0, 'Valor inválido')
    .optional()
    .or(z.literal(NaN)),
  parking: z
    .number({ invalid_type_error: 'Informe as vagas' })
    .min(0, 'Valor inválido')
    .optional()
    .or(z.literal(NaN)),
  coverUrl: z.string().optional(),
});

const participantSchema = z.object({
  id: z.string(),
  memberId: z.string().min(1, 'Selecione o responsável'),
  name: z.string().min(1, 'Informe o nome'),
  role: z.enum(['captador', 'corretor', 'coordenador', 'assistente']).optional(),
  avatarUrl: z.string().optional(),
  percent: z
    .number({ invalid_type_error: 'Informe o percentual' })
    .min(0, 'Use valores positivos')
    .max(100, 'O percentual deve ser menor ou igual a 100'),
});

const formSchema = z.object({
  id: z.string().optional(),
  leadId: z.string().min(1),
  kind: z.enum(['sale', 'proposal_sale', 'proposal_rent', 'won']),
  status: z.enum(['draft', 'sent', 'negotiating', 'approved', 'rejected', 'won', 'lost']),
  title: z.string().min(1, 'Informe o título do negócio'),
  amount: z
    .number({ invalid_type_error: 'Informe o valor do negócio' })
    .min(0, 'Valor inválido'),
  commissionPercentage: z
    .number({ invalid_type_error: 'Informe o percentual de comissão' })
    .min(0, 'Use valores positivos')
    .max(100, 'O percentual deve ser menor ou igual a 100')
    .optional()
    .or(z.literal(NaN)),
  commissionBase: z
    .number({ invalid_type_error: 'Informe a base da comissão' })
    .min(0, 'Use valores positivos')
    .optional()
    .or(z.literal(NaN)),
  paymentMethod: z.string().optional(),
  proposalSentAt: z.string().optional(),
  proposalValidUntil: z.string().optional(),
  closedAt: z.string().optional(),
  buyerName: z.string().optional(),
  sellerName: z.string().optional(),
  notes: z.string().optional(),
  property: propertySchema,
  participants: z.array(participantSchema).min(1, 'Adicione pelo menos um responsável'),
});

type DealFormValues = z.infer<typeof formSchema>;

type DealParticipantOption = DealParticipantProfile & { label: string };

type DealKindConfig = {
  label: string;
  description: string;
  defaultStatus: DealFormValues['status'];
  statusOptions: { value: DealFormValues['status']; label: string }[];
};

const businessDealConfig: DealKindConfig = {
  label: 'Negócio ganho',
  description:
    'Registre os detalhes do fechamento, forma de pagamento e divisão de comissão.',
  defaultStatus: 'won',
  statusOptions: [
    { value: 'won', label: 'Negócio ganho' },
    { value: 'lost', label: 'Negócio perdido' },
  ],
};

const dealKindConfig: Record<Exclude<DealFormValues['kind'], 'won'>, DealKindConfig> = {
  sale: businessDealConfig,
  proposal_sale: {
    label: 'Proposta de venda',
    description:
      'Controle o envio e a validade da proposta de venda com o status atualizado.',
    defaultStatus: 'draft',
    statusOptions: [
      { value: 'draft', label: 'Rascunho' },
      { value: 'sent', label: 'Proposta enviada' },
      { value: 'negotiating', label: 'Em negociação' },
      { value: 'approved', label: 'Proposta aprovada' },
      { value: 'rejected', label: 'Proposta recusada' },
    ],
  },
  proposal_rent: {
    label: 'Proposta de locação',
    description:
      'Acompanhe propostas de locação com datas de envio e validade.',
    defaultStatus: 'draft',
    statusOptions: [
      { value: 'draft', label: 'Rascunho' },
      { value: 'sent', label: 'Proposta enviada' },
      { value: 'negotiating', label: 'Em negociação' },
      { value: 'approved', label: 'Proposta aprovada' },
      { value: 'rejected', label: 'Proposta recusada' },
    ],
  },
};

const getDealKindConfig = (kind: DealFormValues['kind']): DealKindConfig => {
  if (kind === 'won') return businessDealConfig;
  return dealKindConfig[kind];
};

const isBusinessKind = (kind: DealFormValues['kind']) => kind === 'sale' || kind === 'won';

const paymentMethods = [
  'Transferência bancária',
  'PIX',
  'Boleto bancário',
  'Financiamento bancário',
  'Outro',
];

const emptyProperty: DealFormValues['property'] = {
  id: '',
  code: '',
  title: '',
  type: '',
  city: '',
  price: 0,
  area: 0,
  beds: 0,
  baths: 0,
  parking: 0,
  coverUrl: '',
};

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const toDateInput = (value?: string | null) => (value ? value.slice(0, 10) : '');

const toISOString = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

const createDefaultParticipants = (members: DealParticipantProfile[]): DealParticipantInput[] => {
  const firstMember = members[0];
  return [
    {
      id: `split-${Math.random().toString(16).slice(2)}`,
      memberId: firstMember?.id ?? '',
      name: firstMember?.name ?? '',
      role: firstMember?.role,
      avatarUrl: firstMember?.avatarUrl,
      percent: 100,
    },
  ];
};

const createDefaultValues = (
  leadId: string,
  members: DealParticipantProfile[],
): DealFormValues => ({
  id: undefined,
  leadId,
  kind: 'won',
  status: 'won',
  title: '',
  amount: 0,
  commissionPercentage: 5,
  commissionBase: NaN,
  paymentMethod: paymentMethods[0],
  proposalSentAt: toDateInput(new Date().toISOString()),
  proposalValidUntil: toDateInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
  closedAt: toDateInput(new Date().toISOString()),
  buyerName: '',
  sellerName: '',
  notes: '',
  property: { ...emptyProperty },
  participants: createDefaultParticipants(members),
});

const mapDealToFormValues = (deal: LeadDeal): DealFormValues => ({
  id: deal.id,
  leadId: deal.leadId,
  kind: deal.kind === 'sale' ? 'won' : deal.kind,
  status: deal.status,
  title: deal.title,
  amount: deal.amount,
  commissionPercentage: deal.commissionPercentage ?? NaN,
  commissionBase: deal.commissionBase ?? NaN,
  paymentMethod: deal.paymentMethod ?? paymentMethods[0],
  proposalSentAt: toDateInput(deal.proposalSentAt),
  proposalValidUntil: toDateInput(deal.proposalValidUntil),
  closedAt: toDateInput(deal.closedAt),
  buyerName: deal.buyerName ?? '',
  sellerName: deal.sellerName ?? '',
  notes: deal.notes ?? '',
  property: deal.property
    ? {
        ...deal.property,
        coverUrl: deal.property.coverUrl ?? '',
      }
    : { ...emptyProperty },
  participants: deal.participants.map(participant => ({
    id: participant.id,
    memberId: participant.memberId,
    name: participant.name,
    role: participant.role,
    avatarUrl: participant.avatarUrl,
    percent: participant.percent,
  })),
});

const sanitizeNumber = (value?: number) => (Number.isFinite(value) ? Number(value) : undefined);

const sanitizeText = (value?: string) => (value && value.trim().length ? value.trim() : undefined);

export interface DealModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  leadId: string;
  deal?: LeadDeal | null;
  members?: DealParticipantProfile[];
  isSubmitting?: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onSubmit: (payload: LeadDealDraft) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}

export function DealModal({
  open,
  mode,
  leadId,
  deal,
  members = [],
  isSubmitting,
  isDeleting,
  onClose,
  onSubmit,
  onDelete,
}: DealModalProps) {
  const memberOptions: DealParticipantOption[] = useMemo(
    () => members.map(member => ({ ...member, label: member.name })),
    [members],
  );

  const defaultValues = useMemo(
    () => (deal ? mapDealToFormValues(deal) : createDefaultValues(leadId, members)),
    [deal, leadId, members],
  );

  const [activeKind, setActiveKind] = useState<DealFormValues['kind']>(defaultValues.kind);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues,
  });

  const { control, watch, handleSubmit, reset, setValue, getValues } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'participants' });

  useEffect(() => {
    reset(defaultValues);
    setActiveKind(defaultValues.kind);
  }, [defaultValues, reset]);

  useEffect(() => {
    setValue('kind', activeKind, { shouldDirty: true });
    const config = getDealKindConfig(activeKind);
    const currentStatus = getValues('status');
    if (!config.statusOptions.some(option => option.value === currentStatus)) {
      setValue('status', config.defaultStatus, { shouldDirty: true });
    }
    if (isBusinessKind(activeKind)) {
      const method = getValues('paymentMethod');
      if (!method) {
        setValue('paymentMethod', paymentMethods[0], { shouldDirty: true });
      }
    } else {
      setValue('paymentMethod', getValues('paymentMethod') || '', { shouldDirty: false });
    }
  }, [activeKind, getValues, setValue]);

  const amountValue = watch('amount');
  const commissionPercentageValue = watch('commissionPercentage');
  const manualCommissionBase = watch('commissionBase');
  const participants = watch('participants');

  const amount = Number.isFinite(amountValue) ? Number(amountValue) : 0;
  const percentage = Number.isFinite(commissionPercentageValue)
    ? Number(commissionPercentageValue)
    : 0;
  const manualBase = Number.isFinite(manualCommissionBase)
    ? Number(manualCommissionBase)
    : undefined;

  const computedCommissionBase = useMemo(() => {
    if (typeof manualBase === 'number') {
      return manualBase;
    }
    return Number(((amount * percentage) / 100 || 0).toFixed(2));
  }, [amount, manualBase, percentage]);

  const totalPercent = useMemo(
    () => participants.reduce((total, participant) => total + (participant.percent || 0), 0),
    [participants],
  );

  const splitBase = computedCommissionBase || amount;

  const handleAddParticipant = () => {
    append({
      id: `split-${Math.random().toString(16).slice(2)}`,
      memberId: '',
      name: '',
      percent: 0,
    });
  };

  const handleMemberChange = (index: number, memberId: string) => {
    setValue(`participants.${index}.memberId`, memberId, { shouldDirty: true });
    const member = memberOptions.find(option => option.id === memberId);
    if (member) {
      setValue(`participants.${index}.name`, member.name, { shouldDirty: true });
      setValue(`participants.${index}.role`, member.role, { shouldDirty: true });
      setValue(`participants.${index}.avatarUrl`, member.avatarUrl, { shouldDirty: true });
    }
  };

  const handleKindChange = (value: string) => {
    const nextKind = value as DealFormValues['kind'];
    if (nextKind === 'sale') {
      setActiveKind('won');
      return;
    }
    setActiveKind(nextKind);
  };

  const submitForm = handleSubmit(async values => {
    const payload: LeadDealDraft = {
      id: values.id,
      leadId: values.leadId,
      kind: activeKind,
      status: values.status,
      title: values.title,
      amount: values.amount,
      commissionPercentage: sanitizeNumber(values.commissionPercentage),
      commissionBase: sanitizeNumber(values.commissionBase),
      paymentMethod: sanitizeText(values.paymentMethod),
      proposalSentAt: toISOString(values.proposalSentAt),
      proposalValidUntil: toISOString(values.proposalValidUntil),
      closedAt: toISOString(values.closedAt),
      buyerName: sanitizeText(values.buyerName),
      sellerName: sanitizeText(values.sellerName),
      notes: sanitizeText(values.notes),
      property: values.property
        ? {
            id: values.property.id || '',
            code: values.property.code || '',
            title: values.property.title || '',
            type: values.property.type || '',
            city: values.property.city || '',
            coverUrl: sanitizeText(values.property.coverUrl) || '',
            price: Number.isFinite(values.property.price) ? Number(values.property.price) : 0,
            area: Number.isFinite(values.property.area) ? Number(values.property.area) : 0,
            beds: Number.isFinite(values.property.beds) ? Number(values.property.beds) : 0,
            baths: Number.isFinite(values.property.baths) ? Number(values.property.baths) : 0,
            parking: Number.isFinite(values.property.parking) ? Number(values.property.parking) : 0,
          }
        : undefined,
      participants: values.participants.map(participant => ({
        id: participant.id,
        memberId: participant.memberId,
        name: participant.name,
        role: participant.role,
        avatarUrl: participant.avatarUrl,
        percent: participant.percent,
      })),
      timeline: deal?.timeline ? deal.timeline.map(event => ({ ...event })) : undefined,
      documents: deal?.documents ? deal.documents.map(document => ({ ...document })) : undefined,
      createdAt: deal?.createdAt,
      updatedAt: deal?.updatedAt,
    };

    await onSubmit(payload);
    onClose();
  });

  const tabDescription = getDealKindConfig(activeKind).description;
  const tabsValue: Exclude<DealFormValues['kind'], 'won'> = isBusinessKind(activeKind)
    ? 'sale'
    : activeKind;

  return (
    <Dialog open={open} onOpenChange={value => (!value ? onClose() : undefined)}>
      <DialogContent className="max-h-[92vh] w-full max-w-4xl overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {mode === 'create' ? 'Registrar negociação' : 'Editar negociação'}
          </DialogTitle>
          <DialogDescription>{tabDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={submitForm} className="flex h-full flex-col">
            <Tabs value={tabsValue} onValueChange={handleKindChange} className="flex h-full flex-col">
              <div className="px-6 pt-4">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
                  {Object.entries(dealKindConfig).map(([kind, config]) => (
                    <TabsTrigger
                      key={kind}
                      value={kind}
                      className="rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow"
                    >
                      {config.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <ScrollArea className="flex-1 px-6">
                <div className="space-y-8 pb-12 pt-6">
                  <section className="grid gap-4 md:grid-cols-[1fr_380px]">
                    <div className="space-y-4">
                      <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Resumo do negócio" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={control}
                          name="buyerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Comprador / Interessado</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nome do interessado" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="sellerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proprietário</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nome do proprietário" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Detalhes relevantes, condições combinadas ou próximos passos."
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900">Resumo do imóvel</h3>
                      <div className="rounded-xl border border-dashed border-gray-200">
                        <PropertyCard
                          compact
                          id={Number(watch('property.id')) || 0}
                          code={watch('property.code') || ''}
                          title={watch('property.title') || ''}
                          type={watch('property.type') || ''}
                          city={watch('property.city') || ''}
                          price={(() => {
                            const price = watch('property.price');
                            return typeof price === 'number' ? price : Number(price) || 0;
                          })()}
                          area={Number.isFinite(watch('property.area')) ? Number(watch('property.area')) : 0}
                          beds={Number.isFinite(watch('property.beds')) ? Number(watch('property.beds')) : 0}
                          baths={Number.isFinite(watch('property.baths')) ? Number(watch('property.baths')) : 0}
                          parking={Number.isFinite(watch('property.parking')) ? Number(watch('property.parking')) : 0}
                          coverUrl={watch('property.coverUrl') ?? ''}
                        />
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={control}
                          name="property.id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID interno</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Código no CRM" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="property.code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código público</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Código divulgado" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="property.title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Descrição curta" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={control}
                            name="property.type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Apartamento, casa..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name="property.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cidade</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Cidade/UF" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getDealKindConfig(activeKind).statusOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                                {!getDealKindConfig(activeKind).statusOptions.some(option => option.value === field.value) && (
                                  <SelectItem value={field.value}>{field.value}</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isBusinessKind(activeKind) && (
                        <FormField
                          control={control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Forma de pagamento</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {paymentMethods.map(method => (
                                    <SelectItem key={method} value={method}>
                                      {method}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {!isBusinessKind(activeKind) && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={control}
                          name="proposalSentAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enviada em</FormLabel>
                              <FormControl>
                                <Input type="date" value={field.value ?? ''} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="proposalValidUntil"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Validade</FormLabel>
                              <FormControl>
                                <Input type="date" value={field.value ?? ''} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {isBusinessKind(activeKind) && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={control}
                          name="closedAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de fechamento</FormLabel>
                              <FormControl>
                                <Input type="date" value={field.value ?? ''} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </section>

                  <Separator />

                  <section className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor do negócio</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} value={field.value ?? 0} onChange={event => field.onChange(Number(event.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="commissionPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>% Comissão</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              value={Number.isFinite(field.value) ? field.value : ''}
                              onChange={event => field.onChange(event.target.value === '' ? NaN : Number(event.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="commissionBase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base da comissão</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              value={Number.isFinite(field.value) ? field.value : ''}
                              onChange={event => field.onChange(event.target.value === '' ? NaN : Number(event.target.value))}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Valor calculado: {formatCurrency(computedCommissionBase)}
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Divisão da comissão</h3>
                        <p className="text-xs text-muted-foreground">
                          Distribua o percentual entre os responsáveis. Valor calculado com base em {formatCurrency(splitBase)}.
                        </p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddParticipant}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {fields.map((field, index) => {
                        const participant = participants[index];
                        const participantAmount = Number(
                          ((participant?.percent || 0) * splitBase) / 100,
                        ).toFixed(2);
                        return (
                          <div
                            key={field.id}
                            className="rounded-xl border border-gray-200 p-4 shadow-sm"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div className="grid flex-1 gap-3 md:grid-cols-2">
                                <FormField
                                  control={control}
                                  name={`participants.${index}.memberId`}
                                  render={({ field: memberField }) => (
                                    <FormItem>
                                      <FormLabel>Responsável</FormLabel>
                                      <Select
                                        value={memberField.value}
                                        onValueChange={value => handleMemberChange(index, value)}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="">
                                            Selecionar responsável
                                          </SelectItem>
                                          {memberOptions.map(option => (
                                            <SelectItem key={option.id} value={option.id}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={control}
                                  name={`participants.${index}.percent`}
                                  render={({ field: percentField }) => (
                                    <FormItem>
                                      <FormLabel>%</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          step="0.01"
                                          value={percentField.value ?? 0}
                                          onChange={event =>
                                            percentField.onChange(Number(event.target.value))
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {formatCurrency(Number(participantAmount))}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => remove(index)}
                                  disabled={fields.length === 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={cn('text-xs', totalPercent !== 100 && 'text-amber-600')}>
                      Percentual distribuído: {totalPercent.toFixed(2)}%
                      {totalPercent !== 100 && ' (ideal: 100%)'}
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </Tabs>

            <DialogFooter className="gap-3 px-6 pb-6 pt-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-0">
              {mode === 'edit' && onDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onDelete?.()}
                  disabled={isDeleting || isSubmitting}
                >
                  Excluir negócio
                </Button>
              ) : (
                <div />
              )}

              <div className="flex w-full justify-end gap-3 sm:w-auto">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {mode === 'create' ? 'Salvar negócio' : 'Atualizar negócio'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
