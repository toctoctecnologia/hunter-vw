'use client';

import React from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { SignatureInfoStatus } from '@/shared/types';

import { EMAIL_CONTACT, WHATSAPP_CONTACT } from '@/shared/constants';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Button } from '@/shared/components/ui/button';

interface PaymentConfirmStatusProps {
  status: SignatureInfoStatus;
  lastExpirationDate: string;
  userName: string;
}

export function PaymentConfirmStatus({ lastExpirationDate, status, userName }: PaymentConfirmStatusProps) {
  const getStatusConfig = (status: SignatureInfoStatus) => {
    switch (status) {
      case 'WAITING_PAYMENT_CONFIRMATION':
        return {
          icon: Clock,
          title: 'Aguardando Confirmação de Pagamento',
          description: 'Seu pagamento está sendo processado',
          message:
            'Estamos aguardando a confirmação do seu pagamento. Este processo pode levar alguns minutos. Você receberá uma notificação assim que o pagamento for confirmado.',
          variant: 'default' as const,
          badgeVariant: 'outline' as const,
          iconColor: 'text-blue-600 dark:text-blue-400',
          cardBg: 'bg-blue-50/50 dark:bg-blue-950/20',
          borderColor: 'border-l-blue-500',
          iconBg: 'bg-blue-100/50 dark:bg-blue-900/30',
        };
      case 'WAITING_RELEASE':
        return {
          icon: Clock,
          title: 'Aguardando Liberação',
          description: 'Pagamento confirmado, aguardando liberação',
          message:
            'Seu pagamento foi confirmado com sucesso! Nossa equipe está processando a liberação do seu acesso. Você será notificado em breve.',
          variant: 'default' as const,
          badgeVariant: 'outline' as const,
          iconColor: 'text-orange-600 dark:text-orange-400',
          cardBg: 'bg-orange-50/50 dark:bg-orange-950/20',
          borderColor: 'border-l-orange-500',
          iconBg: 'bg-orange-100/50 dark:bg-orange-900/30',
        };
      case 'OVERDUE':
        return {
          icon: XCircle,
          title: 'Pagamento em Atraso',
          description: 'Sua assinatura está vencida',
          message:
            'Seu pagamento está em atraso. Regularize sua assinatura para não perder o acesso aos nossos serviços.',
          variant: 'destructive' as const,
          badgeVariant: 'destructive' as const,
          iconColor: 'text-red-600 dark:text-red-400',
          cardBg: 'bg-red-50/50 dark:bg-red-950/20',
          borderColor: 'border-l-red-500',
          iconBg: 'bg-red-100/50 dark:bg-red-900/30',
        };
      case 'ACTIVE':
        return {
          icon: CheckCircle,
          title: 'Conta Ativa',
          description: 'Sua conta está ativa e funcionando',
          message: 'Parabéns! Sua conta está ativa e você tem acesso completo a todos os recursos.',
          variant: 'default' as const,
          badgeVariant: 'secondary' as const,
          iconColor: 'text-green-600 dark:text-green-400',
          cardBg: 'bg-green-50/50 dark:bg-green-950/20',
          borderColor: 'border-l-green-500',
          iconBg: 'bg-green-100/50 dark:bg-green-900/30',
        };
      case 'TEST_PERIOD_ACTIVE':
        return {
          icon: AlertTriangle,
          title: 'Período de Teste Ativo',
          description: 'Você está no período de teste',
          message:
            'Você está aproveitando nosso período de teste gratuito. Não esqueça de escolher um plano antes do vencimento.',
          variant: 'default' as const,
          badgeVariant: 'outline' as const,
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          cardBg: 'bg-yellow-50/50 dark:bg-yellow-950/20',
          borderColor: 'border-l-yellow-500',
          iconBg: 'bg-yellow-100/50 dark:bg-yellow-900/30',
        };
      case 'EXPIRED':
        return {
          icon: XCircle,
          title: 'Assinatura Expirada',
          description: 'Sua assinatura expirou',
          message: 'Sua assinatura expirou. Renove agora para continuar aproveitando nossos serviços sem interrupções.',
          variant: 'destructive' as const,
          badgeVariant: 'destructive' as const,
          iconColor: 'text-red-600 dark:text-red-400',
          cardBg: 'bg-red-50/50 dark:bg-red-950/20',
          borderColor: 'border-l-red-500',
          iconBg: 'bg-red-100/50 dark:bg-red-900/30',
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Status Desconhecido',
          description: 'Status não reconhecido',
          message: 'Entre em contato com nosso suporte para verificar o status da sua conta.',
          variant: 'default' as const,
          badgeVariant: 'outline' as const,
          iconColor: 'text-muted-foreground',
          cardBg: 'bg-muted/30',
          borderColor: 'border-l-muted-foreground',
          iconBg: 'bg-muted/50',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  // Status que permitem acesso ao dashboard
  const hasAccessToDashboard = ['ACTIVE', 'OVERDUE', 'TEST_PERIOD_ACTIVE'].includes(status);

  const handleWhatsAppMessage = () => {
    const message = 'Olá, estou com dúvidas sobre o status da minha conta.';
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONTACT}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 leading-tight">
          Olá, {userName}!
        </h1>
        <TypographyMuted className="text-sm sm:text-base">Aqui está o status atual da sua conta</TypographyMuted>
      </div>

      <Card className={`${config.cardBg} border-l-4 ${config.borderColor} mx-4 sm:mx-0`}>
        <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className={`p-2 sm:p-3 rounded-full ${config.iconBg} self-start sm:self-auto`}>
              <Icon className={`size-5 sm:size-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-foreground mb-1 sm:mb-2 leading-tight">
                {config.title}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                {config.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <Alert variant={config.variant} className="mb-4">
            <AlertDescription className="text-xs sm:text-sm leading-relaxed">{config.message}</AlertDescription>
          </Alert>

          {hasAccessToDashboard && (
            <div className="mb-4">
              <Link to="/dashboard">
                <Button className="w-full sm:w-auto">Acessar Dashboard</Button>
              </Link>
            </div>
          )}

          {lastExpirationDate && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                <span className="font-medium text-foreground block sm:inline">Última data de expiração:</span>
                <span className="sm:ml-2 block sm:inline mt-1 sm:mt-0">{formatDate(lastExpirationDate)}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-xs sm:text-sm text-muted-foreground px-4 sm:px-0 space-y-3">
        <p className="leading-relaxed">
          Se você tiver dúvidas sobre o status da sua conta, entre em contato conosco:{' '}
          <a
            href={`mailto:${EMAIL_CONTACT}`}
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            {EMAIL_CONTACT}
          </a>
        </p>
        <button
          onClick={handleWhatsAppMessage}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1da851] text-white rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span className="text-sm font-medium">Falar pelo WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
