'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MultistepRegister } from '@/features/dashboard/auth/components/multistep-register';

const queryClient = new QueryClient();

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <QueryClientProvider client={queryClient}>
        <MultistepRegister />
      </QueryClientProvider>
    </div>
  );
}
