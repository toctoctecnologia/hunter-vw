'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Building2,
  Phone,
  Mail,
  User,
  Users,
  Home,
  Calendar,
  CreditCard,
  TrendingUp,
  FileText,
  Globe,
  MapPin,
  Hash,
  BadgeCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Settings,
  Link as LinkIcon,
} from 'lucide-react';

import { formatShortDate, getUserNameInitials, formatValue } from '@/shared/lib/utils';
import { formatPriceForBackend, removeNonNumeric } from '@/shared/lib/masks';

import { Client, ModalProps } from '@/shared/types';

import { configureEnterprisePlan, getEnterprisePlanPaymentLink } from '@/features/sadm-dashboard/access-control/api/save-plan';
import {
  enterprisePlanSchema,
  EnterprisePlanFormData,
} from '@/features/sadm-dashboard/access-control/components/form/enterprise-plan-schema';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Separator } from '@/shared/components/ui/separator';
import { Modal } from '@/shared/components/ui/modal';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { normalizeCnpjNumber } from '@/shared/lib/masks';

const ENTERPRISE_PLAN_UUID = 'c775246b-c15d-40e1-a5da-b2fcb37a56f2';

function maskPrice(value: string): string {
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '';

  const number = parseFloat(numericValue) / 100;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

interface ClientDetailsModalProps extends Omit<ModalProps, 'title' | 'description'> {
  client: Client;
}

interface InfoItemProps {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ComponentType<{ className?: string }>;
}

function InfoItem({ label, value, icon: Icon }: InfoItemProps) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-muted-foreground text-xs">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </Label>
      <TypographyMuted className="text-sm font-medium text-foreground">{value || 'Não informado'}</TypographyMuted>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

function StatCard({ icon: Icon, label, value, trend, variant = 'default' }: StatCardProps) {
  const variantClasses = {
    default:
      'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800',
    success:
      'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800',
    warning:
      'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-200 dark:border-amber-800',
    info: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800',
  };

  const iconClasses = {
    default: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
    info: 'text-purple-600 dark:text-purple-400',
  };

  return (
    <div className={`p-4 border rounded-lg ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-white/80 dark:bg-gray-900/80 ${iconClasses[variant]}`}>
          <Icon className="size-5" />
        </div>
        {trend && (
          <Badge variant="secondary" className="text-xs">
            {trend}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function getStatusConfig(status: string) {
  const configs: Record<
    string,
    {
      label: string;
      variant: 'default' | 'secondary' | 'destructive' | 'outline';
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    ACTIVE: { label: 'Ativo', variant: 'default', icon: CheckCircle2 },
    WAITING_PAYMENT_CONFIRMATION: { label: 'Aguardando Confirmação', variant: 'secondary', icon: Clock },
    WAITING_RELEASE: { label: 'Aguardando Liberação', variant: 'secondary', icon: Clock },
    OVERDUE: { label: 'Vencido', variant: 'destructive', icon: AlertCircle },
    TEST_PERIOD_ACTIVE: { label: 'Período de Teste', variant: 'outline', icon: BadgeCheck },
    EXPIRED: { label: 'Expirado', variant: 'destructive', icon: AlertCircle },
  };

  return (
    configs[status] || {
      label: status,
      variant: 'secondary' as const,
      icon: AlertCircle,
    }
  );
}

export function ClientDetailsModal({ client, ...props }: ClientDetailsModalProps) {
  const isPJ = client.accountType === 'MATRIZ';
  const statusConfig = getStatusConfig(client.signature.status);
  const StatusIcon = statusConfig.icon;
  const isEnterprisePlan = client.signature.plan.uuid === ENTERPRISE_PLAN_UUID;

  const [isEnterpriseConfigured, setIsEnterpriseConfigured] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const form = useForm<EnterprisePlanFormData>({
    resolver: zodResolver(enterprisePlanSchema),
    defaultValues: {
      activeUsersAmount: String(client.signature.plan.activeUsersAmount || ''),
      activePropertiesAmount: String(client.signature.plan.activePropertiesAmount || ''),
      signaturePrice: '',
      paymentPeriodEnum: 'MONTHLY',
    },
  });

  const configureMutation = useMutation({
    mutationFn: (data: EnterprisePlanFormData) => {
      const formattedData = {
        ...data,
        signaturePrice: String(formatPriceForBackend(data.signaturePrice)),
      };
      return configureEnterprisePlan(client.id, formattedData);
    },
    onSuccess: () => {
      toast.success('Plano Enterprise configurado com sucesso!');
      setIsEnterpriseConfigured(true);
    },
  });

  const generatePaymentLinkMutation = useMutation({
    mutationFn: () => getEnterprisePlanPaymentLink(client.id),
    onSuccess: (data) => {
      setPaymentLink(data.paymentLink);
      toast.success('Link de pagamento gerado com sucesso!');
    },
  });

  const onSubmitEnterprise = (data: EnterprisePlanFormData) => {
    configureMutation.mutate(data);
  };

  const handleGeneratePaymentLink = () => {
    generatePaymentLinkMutation.mutate();
  };

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  return (
    <Modal
      {...props}
      title="Detalhes do Cliente"
      description={`Informações completas sobre a conta`}
      className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl"
    >
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="size-16 border-2 border-primary/20">
          <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary/10 to-primary/20">
            {getUserNameInitials(client.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-xl font-semibold">{client.name}</h3>
              <Badge variant={isPJ ? 'default' : 'secondary'}>{isPJ ? 'Pessoa Jurídica' : 'Pessoa Física'}</Badge>
              <Badge variant={statusConfig.variant} className="gap-1">
                <StatusIcon className="size-3" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Mail className="size-4" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="size-4" />
              <span>{client.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={Home}
          label="Imóveis Ativos"
          value="-"
          variant="info"
          trend={`de ${client.activePropertiesAmount ?? '--'}`}
        />
        <StatCard
          icon={Users}
          label="Usuários Ativos"
          value="-"
          variant="success"
          trend={`de ${client.activeUsersAmount ?? '--'}`}
        />
        <StatCard icon={TrendingUp} label="Tier do Plano" value={`Nível ${client.signature.plan.tier}`} variant="default" />
        <StatCard icon={CreditCard} label="Mensalidade" value={formatValue(client.signature.signaturePrice)} variant="warning" />
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="plan">Plano</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4 mt-4">
          {isPJ ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="size-4" />
                  Informações Empresariais
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <InfoItem label="Razão Social" value={client.companyInfo?.socialReason} icon={Building2} />
                <InfoItem label="CNPJ" value={normalizeCnpjNumber(client.companyInfo?.federalDocument)} icon={Hash} />
                <InfoItem label="Inscrição Estadual" value={client.companyInfo?.stateRegistration} icon={FileText} />
                <InfoItem label="Inscrição Municipal" value={client.companyInfo?.municipalRegistration} icon={FileText} />
                <InfoItem label="Quantidade de Unidades" value={client.companyInfo?.unitAmount} icon={Home} />
                <InfoItem label="Website" value={client.companyInfo?.website} icon={Globe} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="size-4" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <InfoItem label="CPF" value={client.personalInfo?.federalDocument} icon={Hash} />
                <InfoItem label="Cidade" value={client.personalInfo?.city} icon={MapPin} />
                <InfoItem label="CRECI" value={client.personalInfo?.creci} icon={BadgeCheck} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="size-4" />
                Dados de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <InfoItem label="Nome" value={client.name} icon={User} />
              <InfoItem label="E-mail" value={client.email} icon={Mail} />
              <InfoItem label="Telefone" value={client.phone} icon={Phone} />
              <InfoItem label="Tipo de Conta" value={client.accountType} icon={Building2} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Tab */}
        <TabsContent value="plan" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4" />
                Detalhes do Plano
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isEnterprisePlan && (
                <>
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold">{client.signature.plan.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{client.signature.plan.description}</p>
                      </div>
                      <Badge className="ml-2">Tier {client.signature.plan.tier}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/80 dark:bg-gray-900/80 rounded border dark:border-gray-700">
                        <p className="text-xs text-muted-foreground mb-1">Mensal</p>
                        <p className="text-lg font-bold">{formatValue(client.signature.plan.monthlySignaturePrice)}</p>
                      </div>
                      <div className="p-3 bg-white/80 dark:bg-gray-900/80 rounded border dark:border-gray-700">
                        <p className="text-xs text-muted-foreground mb-1">Anual</p>
                        <p className="text-lg font-bold">{formatValue(client.signature.plan.annualSignaturePrice)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <InfoItem label="UUID do Plano" value={client.signature.plan.uuid} icon={Hash} />
                <InfoItem
                  label="Valor Atual da Assinatura"
                  value={formatValue(client.signature.signaturePrice)}
                  icon={CreditCard}
                />
                <InfoItem label="Imóveis Permitidos" value={client.signature.plan.activePropertiesAmount} icon={Home} />
                <InfoItem label="Usuários Permitidos" value={client.signature.plan.activeUsersAmount} icon={Users} />
              </div>

              <Separator />

              <div className="space-y-4">
                <h5 className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="size-4" />
                  Informações de Vigência
                </h5>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoItem label="Status da Assinatura" value={statusConfig.label} icon={StatusIcon} />
                  <InfoItem label="Data de Expiração" value={formatShortDate(client.signature.expirationDate)} icon={Calendar} />
                </div>
              </div>
            </CardContent>
          </Card>

          {isEnterprisePlan && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="size-4" />
                  Configuração Enterprise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitEnterprise)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="activeUsersAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade de Usuários Ativos</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: 10"
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
                        name="activePropertiesAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade de Propriedades Ativas</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: 100"
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
                        name="signaturePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço da Assinatura</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="R$ 0,00"
                                {...field}
                                onChange={(e) => field.onChange(maskPrice(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentPeriodEnum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Período de Pagamento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione o período" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MONTHLY">Mensal</SelectItem>
                                <SelectItem value="ANNUAL">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={configureMutation.isPending} className="w-full sm:w-auto">
                      {configureMutation.isPending ? 'Configurando...' : 'Configurar Plano Enterprise'}
                    </Button>
                  </form>
                </Form>

                {isEnterpriseConfigured && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h5 className="text-sm font-semibold flex items-center gap-2">
                        <LinkIcon className="size-4" />
                        Link de Pagamento
                      </h5>

                      {!paymentLink ? (
                        <Button
                          onClick={handleGeneratePaymentLink}
                          disabled={generatePaymentLinkMutation.isPending}
                          className="w-full sm:w-auto"
                        >
                          {generatePaymentLinkMutation.isPending ? 'Gerando...' : 'Gerar Link de Pagamento'}
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input value={paymentLink} readOnly className="flex-1" />
                            <Button onClick={handleCopyLink} variant="outline">
                              Copiar
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Link gerado com sucesso! Compartilhe com o cliente para realizar o pagamento.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </Modal>
  );
}
