import { Outlet } from 'react-router-dom';

import { sadmNavItems } from '@/shared/constants/navItems';
import { AuthProvider } from '@/shared/hooks/use-auth';
import { ErrorProvider } from '@/shared/hooks/use-error';

import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { AppSidebar } from '@/shared/components/layout/app-sidebar';
import { Header } from '@/shared/components/layout/header';

export function SadmDashboardLayout() {
  return (
    <ErrorProvider>
      <SidebarProvider>
        <AuthProvider>
          <AppSidebar variant="inset" logoHref="/sadm-dashboard" navItems={sadmNavItems} />
          <SidebarInset>
            <Header bellHref="/sadm-dashboard/notifications" profileHref="/sadm-dashboard/profile" />
            <div className="flex flex-col gap-4 p-4">
              <Outlet />
            </div>
          </SidebarInset>
        </AuthProvider>
      </SidebarProvider>
    </ErrorProvider>
  );
}
