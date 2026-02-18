export interface FunnelConfig {
  stages: string[];
}

export async function updateFunnelConfig(config: FunnelConfig): Promise<void> {
  // Placeholder for API call; using localStorage for demo
  try {
    localStorage.setItem('funnelConfig', JSON.stringify(config));
  } catch (e) {
    // ignore storage errors
  }
}
