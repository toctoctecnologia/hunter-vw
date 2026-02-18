const BOOLEAN_TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);
const BOOLEAN_FALSE_VALUES = new Set(['0', 'false', 'no', 'off']);

const parseBooleanEnv = (value: unknown, defaultValue = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return defaultValue;

  const normalizedValue = value.trim().toLowerCase();
  if (BOOLEAN_TRUE_VALUES.has(normalizedValue)) return true;
  if (BOOLEAN_FALSE_VALUES.has(normalizedValue)) return false;

  return defaultValue;
};

export const IS_MOCK: boolean = parseBooleanEnv(import.meta.env.VITE_MOCK, false);
export const FILES_BASEURL: string = import.meta.env.VITE_FILES_BASEURL ?? '';
export const shouldShowLoginMenu = (): boolean =>
  parseBooleanEnv(import.meta.env.VITE_SHOW_LOGIN_MENU, true);
export const shouldShowCreateAccountMenu = (): boolean =>
  parseBooleanEnv(import.meta.env.VITE_SHOW_CREATE_ACCOUNT_MENU, true);

// Debug logging
console.log('Environment variables:', {
  VITE_MOCK: import.meta.env.VITE_MOCK,
  IS_MOCK,
  VITE_SHOW_LOGIN_MENU: import.meta.env.VITE_SHOW_LOGIN_MENU,
  shouldShowLoginMenu: shouldShowLoginMenu(),
  VITE_SHOW_CREATE_ACCOUNT_MENU: import.meta.env.VITE_SHOW_CREATE_ACCOUNT_MENU,
  shouldShowCreateAccountMenu: shouldShowCreateAccountMenu()
});
