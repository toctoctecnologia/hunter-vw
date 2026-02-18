import fetchWithMock from "@/utils/fetchWithMock";

export type FonteItem = {
  fonte: string;
  value: number;
};

export type LeadsPorFonte = FonteItem[];

export async function getLeadsPorFonte(
  days: number,
  orgId?: string,
  userScope?: string,
): Promise<LeadsPorFonte> {
  const params = new URLSearchParams({ days: String(days) });
  if (orgId) params.set("orgId", orgId);
  if (userScope) params.set("userScope", userScope);

  const res = await fetchWithMock(`/api/dashboard/leads-por-fonte?${params}`);
  if (!res.ok) throw new Error("Falha ao carregar leads por fonte");
  return res.json();
}

export type VendedorItem = {
  nome: string;
  value: number;
};

export type LeadsPorVendedor = VendedorItem[];

export async function getLeadsPorVendedor(
  days: number,
  orgId?: string,
): Promise<LeadsPorVendedor> {
  const params = new URLSearchParams({ days: String(days) });
  if (orgId) params.set("orgId", orgId);

  const res = await fetchWithMock(`/api/dashboard/leads-por-vendedor?${params}`);
  if (!res.ok) throw new Error("Falha ao carregar leads por vendedor");
  return res.json();
}

export type CanalItem = {
  canal: string;
  total: number;
};

export type ArquivadosPorCanal = CanalItem[];

export async function getArquivadosPorCanal(
  days: number,
  orgId?: string,
): Promise<ArquivadosPorCanal> {
  const params = new URLSearchParams({ days: String(days) });
  if (orgId) params.set("orgId", orgId);

  const res = await fetchWithMock(`/api/dashboard/arquivados-por-canal?${params}`);
  if (!res.ok) throw new Error("Falha ao carregar arquivados por canal");
  return res.json();
}

