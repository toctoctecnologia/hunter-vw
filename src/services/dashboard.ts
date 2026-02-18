export interface LeadsPorFonteItem {
  fonte: string;
  value: number;
}

export async function getLeadsPorFonte(
  days: number,
  orgId?: string,
  userScope?: string
): Promise<LeadsPorFonteItem[]> {
  // Placeholder implementation using mock data.
  // Replace with real API integration when available.
  const mockData: LeadsPorFonteItem[] = [
    { fonte: 'Site', value: 30 },
    { fonte: 'Indicação', value: 20 },
    { fonte: 'Instagram', value: 15 },
    { fonte: 'Facebook', value: 10 },
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 300);
  });
}

export interface LeadsPorVendedorItem {
  nome: string;
  value: number;
}

export async function getLeadsPorVendedor(
  days: number,
  orgId?: string
): Promise<LeadsPorVendedorItem[]> {
  // Placeholder implementation using mock data.
  // Replace with real API integration when available.
  const mockData: LeadsPorVendedorItem[] = [
    { nome: 'Ana', value: 25 },
    { nome: 'João', value: 18 },
    { nome: 'Maria', value: 15 },
    { nome: 'Carlos', value: 12 },
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 300);
  });
}

export interface ArquivadosPorCanalItem {
  canal: string;
  total: number;
}

export async function getArquivadosPorCanal(
  days: number,
  orgId?: string
): Promise<ArquivadosPorCanalItem[]> {
  // Placeholder implementation using mock data.
  // Replace with real API integration when available.
  const mockData: ArquivadosPorCanalItem[] = [
    { canal: 'WhatsApp', total: 40 },
    { canal: 'Telefone', total: 25 },
    { canal: 'E-mail', total: 20 },
    { canal: 'Presencial', total: 15 },
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 300);
  });
}

