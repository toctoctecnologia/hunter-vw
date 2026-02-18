import React from 'react';
import { debugLog } from '@/utils/debug';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/AppRoutes';
import { CalendarProvider } from '@/context/CalendarContext';
import { AgendaSettingsProvider } from '@/hooks/agenda/useAgendaSettings';
import { FunnelConfigProvider } from '@/context/FunnelConfigContext';
import { Toaster } from '@/components/ui/sonner';

function WebApp() {
  debugLog('WebApp component rendering');

  return (
    <Router>
      <CalendarProvider>
        <AgendaSettingsProvider>
          <FunnelConfigProvider>
            <Toaster />
            <AppRoutes />
          </FunnelConfigProvider>
        </AgendaSettingsProvider>
      </CalendarProvider>
    </Router>
  );
}

export default WebApp;
