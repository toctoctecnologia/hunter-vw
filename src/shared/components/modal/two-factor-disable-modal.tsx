'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShieldOff } from 'lucide-react';

import { createClient } from '@/shared/lib/supabase/client';

import { DialogFooter } from '@/shared/components/ui/dialog';
import { Modal } from '@/shared/components/ui/modal';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/components/ui/input-otp';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Button } from '@/shared/components/ui/button';

interface TwoFactorDisableModalProps {
  isOpen: boolean;
  factorId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function TwoFactorDisableModal({ isOpen, factorId, onClose, onSuccess }: TwoFactorDisableModalProps) {
  const [otp, setOtp] = useState('');
  const [isDisabling, setIsDisabling] = useState(false);

  const handleDisable = async () => {
    if (otp.length !== 6) return;

    setIsDisabling(true);
    try {
      const supabase = createClient();

      // First, verify the code to ensure user has access
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) {
        toast.error('Erro ao criar desafio de verificação');
        console.error('MFA challenge error:', challengeError);
        setIsDisabling(false);
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: otp,
      });

      if (verifyError) {
        toast.error('Código inválido. Tente novamente.');
        setOtp('');
        setIsDisabling(false);
        return;
      }

      // Now unenroll the factor
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (unenrollError) {
        toast.error('Erro ao desativar 2FA');
        console.error('MFA unenroll error:', unenrollError);
        setIsDisabling(false);
        return;
      }

      toast.success('Autenticação de dois fatores desativada');
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('MFA disable error:', err);
      toast.error('Erro ao desativar 2FA');
    } finally {
      setIsDisabling(false);
    }
  };

  const handleClose = () => {
    setOtp('');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Desativar Autenticação de Dois Fatores"
      description="Para desativar o 2FA, digite o código do seu aplicativo autenticador"
      className="sm:max-w-lg"
    >
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

        <TypographyMuted className="text-center text-xs text-destructive">
          Atenção: Desativar o 2FA tornará sua conta menos segura
        </TypographyMuted>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleClose} disabled={isDisabling}>
          Cancelar
        </Button>
        <Button
          variant="destructive"
          onClick={handleDisable}
          disabled={otp.length !== 6 || isDisabling}
          isLoading={isDisabling}
        >
          Desativar 2FA
        </Button>
      </DialogFooter>
    </Modal>
  );
}
