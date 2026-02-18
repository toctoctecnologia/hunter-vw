import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PageLayout from '@/components/shell/PageLayout';
import AppRoutes from '@/AppRoutes';
import { CalendarProvider } from '@/context/CalendarContext';
import { AgendaSettingsProvider } from '@/hooks/agenda/useAgendaSettings';
import { FunnelConfigProvider } from '@/context/FunnelConfigContext';
import { Toaster } from '@/components/ui/sonner';

function MobileApp() {
  return (
    <Router>
      <CalendarProvider>
        <AgendaSettingsProvider>
          <FunnelConfigProvider>
            <Toaster />
            <PageLayout>
              <AppRoutes />
            </PageLayout>
          </FunnelConfigProvider>
        </AgendaSettingsProvider>
      </CalendarProvider>
    </Router>
  );
}

export default MobileApp;
