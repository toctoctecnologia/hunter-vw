import { useQuery } from "@tanstack/react-query";
import { getNovidades, type Property } from "@/lib/api/imoveis";
import { MOCK_PROPERTIES, type MockProperty } from "@/mocks/properties";

const normalizeCaptador = (captador: Property["captador"]) =>
  typeof captador === "string" ? captador : captador?.nome;

const normalizeAddress = (property: Property) => {
  if (property.address) return property.address;
  const parts = [property.bairro, property.cidade].filter(Boolean);
  return parts.length ? parts.join(" – ") : undefined;
};

const parsePrice = (value: MockProperty["price"]) =>
  typeof value === "number"
    ? value
    : Number(String(value ?? "").replace(/[^\d]+/g, ""));

const mapMockToProperty = (mock: MockProperty): Property => {
  const disponibilidade = mock.disponibilidade?.toLowerCase() ?? "";
  const status: Property["status"] = disponibilidade.includes("indisponível")
    ? "indisponivel"
    : disponibilidade.includes("interno")
      ? "interno"
      : "site";

  return {
    id: String(mock.id),
    codigo: mock.code,
    titulo: mock.title,
    cidade: mock.city,
    bairro: undefined,
    preco: parsePrice(mock.price),
    thumbUrl: mock.image,
    status,
    createdAt: mock.ultimoContatoEm || new Date().toISOString(),
    captador: mock.captador?.nome,
    address: mock.address,
  };
};

const withNormalizedFields = (properties: Property[]): Property[] =>
  properties.map(property => ({
    ...property,
    captador: normalizeCaptador(property.captador),
    address: normalizeAddress(property),
  }));

export function useNovidades(limit = 8) {
  return useQuery({
    queryKey: ["novidades", limit],
    queryFn: async () => {
      try {
        const data = await getNovidades(limit);
        return withNormalizedFields(data);
      } catch {
        return withNormalizedFields(
          MOCK_PROPERTIES.slice(0, limit).map(mapMockToProperty),
        );
      }
    },
    staleTime: 60_000,
  });
}
