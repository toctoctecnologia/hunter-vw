import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LoadingFull } from '@/shared/components/loading-full';

const queryClient = new QueryClient();

export function PublicLayout() {
  return (
    <Suspense fallback={<LoadingFull title="Carregando..." />}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </Suspense>
  );
}
