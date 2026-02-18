'use client';

import { useAuth } from '@/shared/hooks/use-auth';

import { PaymentConfirmStatus } from '@/features/payment/components/payment-confirm-status';
import { Loading } from '@/shared/components/loading';

export default function Page() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 lg:py-12">
      <div className="w-full max-w-4xl mx-auto">
        <PaymentConfirmStatus
          status={user.signatureInfo.status}
          lastExpirationDate={user.signatureInfo.lastExpirationDate}
          userName={user.userInfo.name}
        />
      </div>
    </div>
  );
}
