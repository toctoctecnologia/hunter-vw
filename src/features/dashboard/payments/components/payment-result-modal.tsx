'use client';

import { useState } from 'react';
import { CheckCircle, Copy, ExternalLink, QrCode, Barcode, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { ModalProps, NewSubscriptionPlanChangeItem, PaymentBillingType } from '@/shared/types';
import { formatDate, formatValue, getHumanExpirationDate } from '@/shared/lib/utils';

import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Input } from '@/shared/components/ui/input';

interface PaymentResultModalProps extends Omit<ModalProps, 'title'> {
  paymentResult: NewSubscriptionPlanChangeItem | null;
}

export function PaymentResultModal({ paymentResult, ...rest }: PaymentResultModalProps) {
  const [copied, setCopied] = useState(false);

  if (!paymentResult) return null;

  const handleCopyPixPayload = async () => {
    if (paymentResult.pixPayload) {
      await navigator.clipboard.writeText(paymentResult.pixPayload);
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyBoletoBarCode = async () => {
    if (paymentResult.boletoBarCode) {
      await navigator.clipboard.writeText(paymentResult.boletoBarCode);
      toast.success('Código de barras copiado!');
    }
  };

  const isPix = paymentResult.billingType === PaymentBillingType.PIX;
  const isBoleto = paymentResult.billingType === PaymentBillingType.BOLETO;
  const isCreditCard = paymentResult.billingType === PaymentBillingType.CREDIT_CARD;

  return (
    <Modal {...rest} className="sm:max-w-lg" title="Mudança de plano" description="Detalhes da sua solicitação">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          {isCreditCard && paymentResult.creditCardPaymentProcessed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-600">Pagamento confirmado!</h3>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {isPix && <QrCode className="size-12 text-primary" />}
              {isBoleto && <Barcode className="size-12 text-primary" />}
              <h3 className="text-lg font-semibold">
                {paymentResult.scheduled ? 'Mudança agendada!' : 'Complete o pagamento'}
              </h3>
            </div>
          )}
        </div>

        <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Mudança de plano</span>
            <Badge variant={paymentResult.isUpgrade ? 'default' : 'secondary'}>
              {paymentResult.isUpgrade ? 'Upgrade' : 'Downgrade'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 font-medium">
            <span>{paymentResult.currentPlanName}</span>
            <ArrowRight className="size-4 text-muted-foreground" />
            <span className="text-primary">{paymentResult.newPlanName}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
            <div>
              <p className="text-muted-foreground">Período</p>
              <p className="font-medium">{paymentResult.newPaymentPeriod === 'MONTHLY' ? 'Mensal' : 'Anual'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Valor</p>
              <p className="font-medium">{formatValue(paymentResult.newPlanPrice)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Data de vigência</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(paymentResult.effectiveDate)}
              </p>
            </div>
          </div>
        </div>

        {isPix && paymentResult.pixQrCodeBase64 && (
          <div className="space-y-4">
            <Tabs defaultValue="qrcode" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="qrcode" className="flex-1">
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="copypaste" className="flex-1">
                  Copia e Cola
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qrcode" className="space-y-4">
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <Image
                    src={`data:image/png;base64,${paymentResult.pixQrCodeBase64}`}
                    alt="QR Code PIX"
                    width={200}
                    height={200}
                    className="rounded"
                  />
                </div>
                <p className="text-sm text-center text-muted-foreground">Escaneie o QR Code com o app do seu banco</p>
              </TabsContent>

              <TabsContent value="copypaste" className="space-y-4">
                <div className="space-y-2">
                  <Input value={paymentResult.pixPayload} readOnly className="font-mono text-xs" />
                  <Button onClick={handleCopyPixPayload} variant="outline" className="w-full">
                    {copied ? (
                      <>
                        <CheckCircle className="size-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4 mr-2" />
                        Copiar código PIX
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {paymentResult.pixExpirationDate && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-sm text-center">
                <p>
                  Este PIX expira em <strong>{getHumanExpirationDate(paymentResult.pixExpirationDate)}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {isBoleto && (
          <div className="space-y-4">
            {paymentResult.boletoBarCode && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Código de barras</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input value={paymentResult.boletoBarCode} readOnly className="font-mono text-xs" />
                  </div>
                  <div>
                    <Button onClick={handleCopyBoletoBarCode} variant="outline" size="icon">
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {paymentResult.boletoUrl && (
              <Button asChild className="w-full">
                <a href={paymentResult.boletoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4 mr-2" />
                  Ver boleto completo
                </a>
              </Button>
            )}

            {paymentResult.boletoDueDate && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-sm text-center">
                <p>
                  Vencimento: <strong>{formatDate(paymentResult.boletoDueDate)}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {isCreditCard && paymentResult.creditCardPaymentProcessed && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-sm text-center">
            <p>Seu pagamento foi processado com sucesso! A mudança de plano entrará em vigor na data indicada acima.</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={rest.onClose}>Entendi</Button>
        </div>
      </div>
    </Modal>
  );
}
