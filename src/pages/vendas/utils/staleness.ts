const MS_IN_DAY = 24 * 60 * 60 * 1000;

const SUCCESS_COLOR = 'bg-[hsl(var(--success))]';
const WARNING_COLOR = 'bg-[hsl(var(--warning))]';
const DANGER_COLOR = 'bg-[hsl(var(--danger))]';
const DEFAULT_COLOR = 'bg-gray-300';

export const STALENESS_THRESHOLDS = {
  healthy: 25,
  warning: 30,
} as const;

export type StalenessTimestamps = {
  lastContactAt?: string | Date | null;
  lastUpdate?: string | Date | null;
  firstInteractionAt?: string | Date | null;
  createdAt?: string | Date | null;
};

export type StalenessInput =
  | StalenessTimestamps
  | string
  | Date
  | null
  | undefined;

const toDate = (value?: string | Date | null): Date | undefined => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? undefined : new Date(time);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export const resolveStalenessDate = (
  input?: StalenessInput
): Date | undefined => {
  if (!input) {
    return undefined;
  }

  if (typeof input === 'string' || input instanceof Date) {
    return toDate(input);
  }

  const candidates: Array<string | Date | null | undefined> = [
    input.lastContactAt,
    input.lastUpdate,
    input.firstInteractionAt,
    input.createdAt,
  ];

  for (const candidate of candidates) {
    const parsed = toDate(candidate ?? undefined);
    if (parsed) {
      return parsed;
    }
  }

  return undefined;
};

export const normalizeStalenessTimestamp = (
  input?: StalenessInput
): string | undefined => resolveStalenessDate(input)?.toISOString();

export const getStalenessColor = (input?: StalenessInput): string => {
  const referenceDate = resolveStalenessDate(input);
  if (!referenceDate) {
    return DEFAULT_COLOR;
  }

  const diffMs = Date.now() - referenceDate.getTime();
  const diffDays = diffMs <= 0 ? 0 : Math.floor(diffMs / MS_IN_DAY);

  if (diffDays <= STALENESS_THRESHOLDS.healthy) {
    return SUCCESS_COLOR;
  }

  if (diffDays <= STALENESS_THRESHOLDS.warning) {
    return WARNING_COLOR;
  }

  return DANGER_COLOR;
};

