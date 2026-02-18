import { useAgendaSettings } from './useAgendaSettings';
import {
  MIN_PX_PER_MIN,
  MAX_PX_PER_MIN,
  BASE_PX_PER_MIN,
} from '@/components/agenda/constants';

const MIN_ZOOM_LEVEL = Math.log(MIN_PX_PER_MIN / BASE_PX_PER_MIN) / Math.log(1.2);
const MAX_ZOOM_LEVEL = Math.log(MAX_PX_PER_MIN / BASE_PX_PER_MIN) / Math.log(1.2);

export function useCalendarZoom() {
  const { settings, updateSettings } = useAgendaSettings();

  const setZoom = (level: number) => {
    const clamped = Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, level));
    updateSettings({ zoomLevel: clamped });
  };

  const zoomIn = () => setZoom(settings.zoomLevel + 1);
  const zoomOut = () => setZoom(settings.zoomLevel - 1);
  const resetZoom = () => setZoom(0);

  return {
    zoom: settings.zoomLevel,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    MIN_ZOOM_LEVEL,
    MAX_ZOOM_LEVEL,
  } as const;
}

export type UseCalendarZoomReturn = ReturnType<typeof useCalendarZoom>;
