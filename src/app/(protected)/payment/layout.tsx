'use client';
import { PropsWithChildren } from 'react';

import { AuthProvider } from '@/shared/hooks/use-auth';

export default function RootLayout({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
