'use client';
import { PropsWithChildren, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LoadingFull } from '@/shared/components/loading-full';

const queryClient = new QueryClient();

export default function Page({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<LoadingFull title="Carregando..." />}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Suspense>
  );
}
