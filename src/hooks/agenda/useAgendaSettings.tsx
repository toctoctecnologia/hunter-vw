
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MIN_PX_PER_MIN,
  MAX_PX_PER_MIN,
  BASE_PX_PER_MIN
} from '@/components/agenda/constants';

export interface AgendaSettings {
  zoomLevel: number;
  eventColors: {
    service: string;
    visit: string;
    task: string;
    info: string;
  };
  showHourLabels: boolean;
  compactView: boolean;
}

const DEFAULT_SETTINGS: AgendaSettings = {
  zoomLevel: 0,
  eventColors: {
    service: 'hsl(var(--accent))', // Laranja como padrão
    visit: 'hsl(var(--accent))',   // Laranja como padrão
    task: 'hsl(var(--accent))',    // Laranja como padrão
    info: 'hsl(var(--accent))'     // Laranja como padrão
  },
  showHourLabels: true,
  compactView: false
};

const MIN_ZOOM_LEVEL = Math.log(MIN_PX_PER_MIN / BASE_PX_PER_MIN) / Math.log(1.2);
const MAX_ZOOM_LEVEL = Math.log(MAX_PX_PER_MIN / BASE_PX_PER_MIN) / Math.log(1.2);

const useAgendaSettingsState = () => {
  const [settings, setSettings] = useState<AgendaSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('agendaSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Error loading agenda settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<AgendaSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
  };

  const saveSettings = () => {
    localStorage.setItem('agendaSettings', JSON.stringify(settings));
  };

  const zoomIn = () => {
    const newZoom = Math.min(settings.zoomLevel + 1, MAX_ZOOM_LEVEL);
    updateSettings({ zoomLevel: newZoom });
  };

  const zoomOut = () => {
    const newZoom = Math.max(settings.zoomLevel - 1, MIN_ZOOM_LEVEL);
    updateSettings({ zoomLevel: newZoom });
  };

  const resetZoom = () => {
    updateSettings({ zoomLevel: 0 });
  };

  return {
    settings,
    updateSettings,
    saveSettings,
    zoomIn,
    zoomOut,
    resetZoom
  };
};

type AgendaSettingsState = ReturnType<typeof useAgendaSettingsState>;

const AgendaSettingsContext = createContext<AgendaSettingsState | null>(null);

export const AgendaSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useAgendaSettingsState();
  return <AgendaSettingsContext.Provider value={value}>{children}</AgendaSettingsContext.Provider>;
};

export const useAgendaSettings = () => {
  const context = useContext(AgendaSettingsContext);
  if (!context) {
    throw new Error('useAgendaSettings must be used within an AgendaSettingsProvider');
  }
  return context;
};
