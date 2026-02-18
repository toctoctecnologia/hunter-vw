'use client';
import { PropsWithChildren, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { useLeadNotification } from '@/features/dashboard/hooks/use-lead-notification';
import { ErrorProvider } from '@/shared/hooks/use-error';
import { AuthProvider } from '@/shared/hooks/use-auth';
import { navItems } from '@/shared/constants/navItems';
import { queryClient } from '@/shared/lib/queryClient';

import { LeadNotificationModal } from '@/features/dashboard/components/modal/lead-notification-modal';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { AppSidebar } from '@/shared/components/layout/app-sidebar';
import { LoadingFull } from '@/shared/components/loading-full';
import { Header } from '@/shared/components/layout/header';

function DashboardContent({ children }: PropsWithChildren) {
  const { lead, isOpen, onClose, onAccept } = useLeadNotification();

  return (
    <>
      <AppSidebar variant="inset" logoHref="/dashboard" navItems={navItems} />
      <SidebarInset>
        <Header bellHref="/dashboard/notifications" profileHref="/dashboard/profile" />
        <div className="flex flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
      <LeadNotificationModal lead={lead} open={isOpen} onClose={onClose} onAccept={onAccept} />
    </>
  );
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<LoadingFull title="Carregando..." />}>
      <QueryClientProvider client={queryClient}>
        <ErrorProvider>
          <SidebarProvider>
            <AuthProvider>
              <DashboardContent>{children}</DashboardContent>
            </AuthProvider>
          </SidebarProvider>
        </ErrorProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
