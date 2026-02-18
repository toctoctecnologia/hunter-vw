'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, Copy, Check, ShieldCheck } from 'lucide-react';

import { createClient } from '@/shared/lib/supabase/client';

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/components/ui/input-otp';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { DialogFooter } from '@/shared/components/ui/dialog';
import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui/button';

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type SetupStep = 'loading' | 'qrcode' | 'verify' | 'success';

interface EnrollmentData {
  id: string;
  totp: {
    qr_code: string;
    secret: string;
    uri: string;
  };
}

const stepConfig = {
  loading: {
    title: 'Configurando Autenticação',
    description: 'Aguarde enquanto preparamos a configuração...',
  },
  qrcode: {
    title: 'Configurar Autenticador',
    description: 'Escaneie o QR code abaixo com seu aplicativo autenticador (Google Authenticator, Authy, etc.)',
  },
  verify: {
    title: 'Verificar Código',
    description: 'Digite o código de 6 dígitos exibido no seu aplicativo autenticador',
  },
  success: {
    title: '2FA Ativado!',
    description: 'Sua conta está agora protegida com autenticação de dois fatores',
  },
};

export function TwoFactorSetupModal({ isOpen, onClose, onSuccess }: TwoFactorSetupModalProps) {
  const [step, setStep] = useState<SetupStep>('loading');
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData | null>(null);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const startEnrollment = useCallback(async () => {
    setStep('loading');
    setOtp('');
    setCopiedSecret(false);

    try {
      const supabase = createClient();

      // First, check if there's an existing unverified TOTP factor and remove it
      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      const unverifiedTotpFactor = factorsData?.all?.find((f) => f.factor_type === 'totp' && f.status === 'unverified');

      if (unverifiedTotpFactor) {
        // Remove the existing unverified factor before creating a new one
        await supabase.auth.mfa.unenroll({ factorId: unverifiedTotpFactor.id });
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Hunter CRM Authenticator',
      });

      if (error) {
        toast.error('Erro ao iniciar configuração do 2FA');
        console.error('MFA enroll error:', error);
        onClose();
        return;
      }

      if (data && data.totp) {
        setEnrollmentData(data as EnrollmentData);
        setStep('qrcode');
      }
    } catch (err) {
      console.error('MFA enrollment error:', err);
      toast.error('Erro inesperado ao configurar 2FA');
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      startEnrollment();
    }
  }, [isOpen, startEnrollment]);

  const handleVerify = async () => {
    if (otp.length !== 6 || !enrollmentData) return;

    setIsVerifying(true);
    try {
      const supabase = createClient();

      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: enrollmentData.id,
      });

      if (challengeError) {
        toast.error('Erro ao criar desafio de verificação');
        console.error('MFA challenge error:', challengeError);
        setIsVerifying(false);
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: enrollmentData.id,
        challengeId: challengeData.id,
        code: otp,
      });

      if (verifyError) {
        toast.error('Código inválido. Tente novamente.');
        setOtp('');
        setIsVerifying(false);
        return;
      }

      setStep('success');
      toast.success('Autenticação de dois fatores ativada com sucesso!');
    } catch (err) {
      console.error('MFA verify error:', err);
      toast.error('Erro ao verificar código');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopySecret = async () => {
    if (enrollmentData?.totp.secret) {
      await navigator.clipboard.writeText(enrollmentData.totp.secret);
      setCopiedSecret(true);
      toast.success('Chave secreta copiada!');
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      onSuccess();
    }
    setStep('loading');
    setEnrollmentData(null);
    setOtp('');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={stepConfig[step].title}
      description={stepConfig[step].description}
      className="sm:max-w-md"
    >
      {step === 'loading' && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {step === 'qrcode' && enrollmentData && (
        <>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-white p-2 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={enrollmentData.totp.qr_code.trimEnd()}
                alt="QR Code para autenticação"
                width={200}
                height={200}
                className="rounded"
              />
            </div>

            <div className="w-full space-y-2">
              <TypographySmall className="text-center">Ou insira a chave manualmente:</TypographySmall>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted p-2 rounded text-xs text-center font-mono break-all">
                  {enrollmentData.totp.secret}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopySecret} className="shrink-0">
                  {copiedSecret ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={() => setStep('verify')}>Continuar</Button>
          </DialogFooter>
        </>
      )}

      {step === 'verify' && (
        <>
          <div className="flex flex-col items-center gap-4 py-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSeparator />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <TypographyMuted className="text-center text-xs">O código é atualizado a cada 30 segundos</TypographyMuted>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStep('qrcode')} disabled={isVerifying}>
              Voltar
            </Button>
            <Button onClick={handleVerify} disabled={otp.length !== 6 || isVerifying} isLoading={isVerifying}>
              Verificar
            </Button>
          </DialogFooter>
        </>
      )}

      {step === 'success' && (
        <>
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
              <ShieldCheck className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <TypographyMuted className="text-center">
              A partir de agora, você precisará do código do aplicativo autenticador para fazer login
            </TypographyMuted>
          </div>

          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Concluir
            </Button>
          </DialogFooter>
        </>
      )}
    </Modal>
  );
}
