// Stub for next/headers - not available in client-side Vite apps
export function cookies() {
  return {
    getAll: () => [],
    get: (name: string) => null,
    set: (name: string, value: string, options?: any) => {},
    delete: (name: string) => {},
  };
}

export function headers() {
  return new Headers();
}
