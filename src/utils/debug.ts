export const DEBUG = import.meta.env.VITE_DEBUG === 'true';

export function debugLog(...args: unknown[]) {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.debug(...args);
  }
}
