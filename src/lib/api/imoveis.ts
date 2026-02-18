export type Property = {
  id: string;
  codigo: string;
  titulo: string;
  cidade: string;
  bairro?: string;
  preco: number;
  thumbUrl: string;
  status: "site" | "interno" | "indisponivel";
  createdAt: string; // ISO
  captador?: string | { nome: string };
  address?: string;
};

export async function getNovidades(limit = 8): Promise<Property[]> {
  const res = await fetch(`/imoveis?sort=createdAt:desc&limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar novidades");
  return res.json();
}
