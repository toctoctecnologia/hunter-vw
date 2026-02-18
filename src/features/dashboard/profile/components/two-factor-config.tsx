'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { createClient } from '@/shared/lib/supabase/client';

import { Card, CardTitle, CardHeader, CardContent } from '@/shared/components/ui/card';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';

import { TwoFactorDisableModal } from '@/shared/components/modal/two-factor-disable-modal';
import { TwoFactorSetupModal } from '@/shared/components/modal/two-factor-setup-modal';

export function TwoFactorConfig() {
  const [showSetup2FAModal, setShowSetup2FAModal] = useState(false);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);

  const { data: mfaFactors, refetch: refetchMfaFactors } = useQuery({
    queryKey: ['mfa-factors'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        console.error('Error fetching MFA factors:', error);
        return null;
      }
      return data;
    },
  });

  const verifiedTotpFactor = mfaFactors?.totp?.find((f) => f.status === 'verified');

  return (
    <>
      <TwoFactorSetupModal
        isOpen={showSetup2FAModal}
        onClose={() => setShowSetup2FAModal(false)}
        onSuccess={() => {
          refetchMfaFactors();
          setShowSetup2FAModal(false);
        }}
      />

      {verifiedTotpFactor && (
        <TwoFactorDisableModal
          isOpen={showDisable2FAModal}
          factorId={verifiedTotpFactor.id}
          onClose={() => setShowDisable2FAModal(false)}
          onSuccess={() => {
            refetchMfaFactors();
            setShowDisable2FAModal(false);
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
          <TypographyMuted>
            Adicione uma camada extra de segurança à sua conta usando um aplicativo autenticador
          </TypographyMuted>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Ativar 2FA</Label>
              <TypographyMuted className="text-xs">
                {verifiedTotpFactor
                  ? 'Sua conta está protegida com autenticação de dois fatores'
                  : 'Use um aplicativo como Google Authenticator ou Authy para gerar códigos de verificação'}
              </TypographyMuted>
            </div>
            <Switch
              checked={!!verifiedTotpFactor}
              onCheckedChange={(checked) => {
                if (checked) {
                  setShowSetup2FAModal(true);
                } else {
                  setShowDisable2FAModal(true);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
