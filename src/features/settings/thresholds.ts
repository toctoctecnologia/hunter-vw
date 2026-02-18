export type SLAThresholds = {
  greenMax: number;
  yellowMax: number;
};

export const THRESHOLDS_STORAGE_KEY = 'app.thresholds.v1';

const STORAGE_KEY = THRESHOLDS_STORAGE_KEY;

export const DEFAULT_THRESHOLDS: SLAThresholds = {
  greenMax: 25,
  yellowMax: 30,
};

export const validate = ({ greenMax, yellowMax }: SLAThresholds): boolean => {
  if (!Number.isFinite(greenMax) || !Number.isFinite(yellowMax)) {
    return false;
  }

  if (greenMax < 1 || yellowMax > 365) {
    return false;
  }

  if (greenMax >= yellowMax) {
    return false;
  }

  return true;
};

const coerceThresholds = (value: unknown): SLAThresholds | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const { greenMax, yellowMax } = value as Partial<SLAThresholds>;
  const coercedGreen = typeof greenMax === 'number' ? greenMax : Number(greenMax);
  const coercedYellow = typeof yellowMax === 'number' ? yellowMax : Number(yellowMax);

  if (!Number.isFinite(coercedGreen) || !Number.isFinite(coercedYellow)) {
    return null;
  }

  const candidate: SLAThresholds = {
    greenMax: coercedGreen,
    yellowMax: coercedYellow,
  };

  return validate(candidate) ? candidate : null;
};

const getStorage = (): Storage | null => {
  try {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage;
  } catch (error) {
    console.warn('localStorage is not available', error);
    return null;
  }
};

export const getThresholds = (): SLAThresholds => {
  const storage = getStorage();
  if (!storage) {
    return DEFAULT_THRESHOLDS;
  }

  let stored: string | null = null;
  try {
    stored = storage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to read thresholds from localStorage', error);
    return DEFAULT_THRESHOLDS;
  }

  if (!stored) {
    return DEFAULT_THRESHOLDS;
  }

  try {
    const parsed = JSON.parse(stored);
    const thresholds = coerceThresholds(parsed);

    if (thresholds) {
      return thresholds;
    }
  } catch (error) {
    console.warn('Failed to parse thresholds from localStorage', error);
  }

  try {
    storage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clean invalid thresholds from localStorage', error);
  }

  return DEFAULT_THRESHOLDS;
};

export const saveThresholds = (thresholds: SLAThresholds): void => {
  if (!validate(thresholds)) {
    throw new Error('Invalid SLA thresholds');
  }

  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(thresholds));
  } catch (error) {
    console.warn('Failed to persist thresholds to localStorage', error);
  }
};
