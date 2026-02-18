import { useCallback, useEffect, useSyncExternalStore } from 'react';

import {
  getThresholds,
  saveThresholds,
  type SLAThresholds,
  THRESHOLDS_STORAGE_KEY
} from './thresholds';

type Listener = () => void;

let currentThresholds: SLAThresholds = getThresholds();
const listeners = new Set<Listener>();

const getSnapshot = () => currentThresholds;

const subscribe = (listener: Listener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const emitChange = () => {
  listeners.forEach(listener => listener());
};

const setState = (thresholds: SLAThresholds) => {
  currentThresholds = thresholds;
  emitChange();
};

const refreshFromStorage = () => {
  const stored = getThresholds();

  if (
    stored.greenMax !== currentThresholds.greenMax ||
    stored.yellowMax !== currentThresholds.yellowMax
  ) {
    setState(stored);
  }
};

const storageListener = (event: StorageEvent) => {
  if (event.key !== null && event.key !== THRESHOLDS_STORAGE_KEY) {
    return;
  }

  refreshFromStorage();
};

let isListeningToStorage = false;

export const useThresholds = (): [SLAThresholds, (thresholds: SLAThresholds) => void] => {
  const thresholds = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!isListeningToStorage) {
      window.addEventListener('storage', storageListener);
      isListeningToStorage = true;
    }

    refreshFromStorage();

    return () => {
      if (typeof window === 'undefined') {
        return;
      }

      if (isListeningToStorage && listeners.size === 0) {
        window.removeEventListener('storage', storageListener);
        isListeningToStorage = false;
      }
    };
  }, []);

  const updateThresholds = useCallback((next: SLAThresholds) => {
    saveThresholds(next);
    setState(next);
  }, []);

  return [thresholds, updateThresholds];
};

