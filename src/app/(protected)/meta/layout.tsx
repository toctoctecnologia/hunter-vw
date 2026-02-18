'use client';
import { PropsWithChildren, Suspense } from 'react';

import { LoadingFull } from '@/shared/components/loading-full';

export default function Page({ children }: PropsWithChildren) {
  return <Suspense fallback={<LoadingFull title="Carregando..." />}>{children}</Suspense>;
}
