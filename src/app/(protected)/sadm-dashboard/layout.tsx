'use client';
import { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { sadmNavItems } from '@/shared/constants/navItems';

import { AuthProvider } from '@/shared/hooks/use-auth';

import { queryClient } from '@/shared/lib/queryClient';

import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { AppSidebar } from '@/shared/components/layout/app-sidebar';
import { Header } from '@/shared/components/layout/header';
import { ErrorProvider } from '@/shared/hooks/use-error';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <SidebarProvider>
          <AuthProvider>
            <AppSidebar variant="inset" logoHref="/sadm-dashboard" navItems={sadmNavItems} />
            <SidebarInset>
              <Header bellHref="/sadm-dashboard/notifications" profileHref="/sadm-dashboard/profile" />
              <div className="flex flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
          </AuthProvider>
        </SidebarProvider>
      </ErrorProvider>
    </QueryClientProvider>
  );
}
