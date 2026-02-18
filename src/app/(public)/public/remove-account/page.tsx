'use client';
import { PublicHeader } from '@/shared/components/layout/public-header';
import { AccountDeletionForm } from '@/features/public/components/account-deletion-form';

export default function Page() {
  return (
    <>
      <PublicHeader />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <AccountDeletionForm />
      </div>
    </>
  );
}
