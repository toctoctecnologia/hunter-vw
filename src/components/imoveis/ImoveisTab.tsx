import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type JSX
} from 'react';
import { Link } from 'react-router-dom';
import { Edit, BarChart3, TrendingUp, TrendingDown, X, Brush, Grid2X2, LayoutGrid, List, MapPin } from 'lucide-react';
import { TopSearchBar } from '@/components/common/TopSearchBar';
import { FilterModal, defaultFilters, type ImoveisFilters } from './FilterModal';
import { PropertyEditModal } from './PropertyEditModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManagementDonut, MANAGEMENT_DONUT_COLORS } from '@/components/charts/ManagementDonut';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import AddImovelPage from '@/pages/imoveis/AddImovelPage';
import PropertyCard, { type PropertyCardProps } from './PropertyCard';
import PropertyCardMini from './PropertyCardMini';
import { properties as mockProperties } from '@/data/properties';
import { MOCK_PROPERTIES } from '@/mocks/properties';
import { getCurrentUser } from '@/utils/auth';
import { usePropertySearch } from '@/features/imoveis/hooks/usePropertySearch';
import { ThresholdsDialog } from '@/components/vendas/ThresholdsDialog';
import { useThresholds } from '@/features/settings/use-thresholds';
import {
  getResumoPeriodo,
  type GestaoResumo,
  type GestaoResumoRange,
  type KpiItem,
  type StatusListItem
} from '@/data/imoveis/gestaoMock';
import { SituacoesPie } from '@/pages/imoveis/gestao/widgets/SituacoesPie';
import { CaptacaoBar } from '@/pages/imoveis/gestao/widgets/CaptacaoBar';
import { KpiDisponiveis } from '@/pages/imoveis/gestao/widgets/KpiDisponiveis';
import { FotosPie } from '@/pages/imoveis/gestao/widgets/FotosPie';
import { PlacaPie } from '@/pages/imoveis/gestao/widgets/PlacaPie';
import AvailabilityBadge from './AvailabilityBadge';
import { ImoveisMap } from './ImoveisMap';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
});

const numberFormatter = new Intl.NumberFormat('pt-BR');

const STATUS_STYLE: Record<StatusListItem['status'], { bg: string; text: string; dot: string }> = {
  disponivel_site: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500'
  },
  disponivel_interno: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    dot: 'bg-orange-500'
  },
  reservado: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-500'
  },
  indisponivel: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500'
  }
};

const formatVariation = (value?: number) => {
  const amount = value ?? 0;
  return {
    amount,
    text: `${amount > 0 ? '+' : ''}${percentFormatter.format(amount)}%`,
    className:
      amount > 0 ? 'text-emerald-600' : amount < 0 ? 'text-red-600' : 'text-zinc-500'
  };
};

type Bucket = 'green' | 'yellow' | 'red';

const BUCKET_ORDER: Bucket[] = ['green', 'yellow', 'red'];

const BUCKET_COLORS: Record<Bucket, string> = {
  green: MANAGEMENT_DONUT_COLORS.green,
  yellow: MANAGEMENT_DONUT_COLORS.yellow,
  red: MANAGEMENT_DONUT_COLORS.red
};

const LEGACY_LABELS: Record<string, Bucket> = {
  '0-25dias': 'green',
  '26-30dias': 'yellow',
  '31+dias': 'red',
  '31maisdias': 'red',
  'verde': 'green',
  'amarelo': 'yellow',
  'vermelho': 'red'
};

const normalizeLabelKey = (value: string) => value.replace(/\s+/g, '').toLowerCase();

const formatRangeLabel = (start: number, end?: number) => {
  const safeStart = Math.max(0, Math.floor(start));
  const safeEnd = end === undefined ? undefined : Math.max(safeStart, Math.floor(end));

  if (safeEnd === undefined) {
    return `${safeStart}+ dias`;
  }

  if (safeStart === safeEnd) {
    return `${safeStart} dias`;
  }

  return `${safeStart}-${safeEnd} dias`;
};
interface ImoveisTabProps {
  filter?: {
    filter: string;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
}
export const ImoveisTab = ({
  filter,
  activeTab,
  onTabChange
}: ImoveisTabProps) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState<ImoveisFilters>(defaultFilters);
  const [managementFilter, setManagementFilter] = useState<Bucket | null>(null);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchFilters, setSearchFilters] = useState<{ status?: string; captador?: string }>({});
  const [resumoRange, setResumoRange] = useState<GestaoResumoRange>('30d');
  const [resumoPeriodo, setResumoPeriodo] = useState<GestaoResumo>(() =>
    getResumoPeriodo('30d')
  );
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact' | 'map'>('grid');
  const [thresholds, setThresholds] = useThresholds();
  const [isThresholdsDialogOpen, setThresholdsDialogOpen] = useState(false);
  const { greenMax, yellowMax } = thresholds;
  const currentUser = getCurrentUser();

  useEffect(() => {
    setResumoPeriodo(getResumoPeriodo(resumoRange));
  }, [resumoRange]);

  const bucketDefinitions = useMemo<Record<Bucket, { label: string; color: string }>>(
    () => ({
      green: {
        label: formatRangeLabel(0, greenMax),
        color: BUCKET_COLORS.green
      },
      yellow: {
        label: formatRangeLabel(greenMax + 1, yellowMax),
        color: BUCKET_COLORS.yellow
      },
      red: {
        label: formatRangeLabel(yellowMax + 1),
        color: BUCKET_COLORS.red
      }
    }),
    [greenMax, yellowMax]
  );

  const parseBucketFromLabel = (value?: string | null): Bucket | null => {
    if (!value) {
      return null;
    }

    const normalized = value.trim().toLowerCase();
    const normalizedKey = normalizeLabelKey(value);

    for (const bucket of BUCKET_ORDER) {
      const definition = bucketDefinitions[bucket];
      if (definition.label.toLowerCase() === normalized) {
        return bucket;
      }

      if (normalizeLabelKey(definition.label) === normalizedKey) {
        return bucket;
      }
    }

    if (normalizedKey in LEGACY_LABELS) {
      return LEGACY_LABELS[normalizedKey];
    }

    if (normalized.includes('verde')) {
      return 'green';
    }

    if (normalized.includes('amarelo')) {
      return 'yellow';
    }

    if (normalized.includes('vermelho')) {
      return 'red';
    }

    return null;
  };

  const categorizeDays = (value: unknown): Bucket => {
    const parsed = Number(value);
    const days = Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;

    if (days <= greenMax) {
      return 'green';
    }

    if (days <= yellowMax) {
      return 'yellow';
    }

    return 'red';
  };
  // Merge both mock data sources for richer property information
  const allProperties = useMemo(() => {
    const enhancedProperties = mockProperties.map((p: any) => {
      const mockProperty = MOCK_PROPERTIES.find(mp => mp.id === p.id);
      if (mockProperty) {
        return {
          ...p,
          type: mockProperty.type,
          areaPrivativa: mockProperty.areaPrivativa,
          quartos: mockProperty.quartos,
          suites: mockProperty.suites,
          vagas: mockProperty.vagas,
          pavimentos: mockProperty.pavimentos,
          ultimoContatoEm: mockProperty.ultimoContatoEm,
          disponibilidade: mockProperty.disponibilidade,
          captador: mockProperty.captador,
          proprietario: mockProperty.proprietario,
          tags: mockProperty.tags,
          address: mockProperty.address,
          condominio: mockProperty.condominio,
          unidade: mockProperty.unidade,
        };
      }
      return {
        ...p,
        disponibilidade: p.availability || p.status,
        captador: undefined,
        proprietario: undefined,
      };
    });
    
    // Add mock properties that don't exist in main properties
    MOCK_PROPERTIES.forEach(mp => {
      if (!enhancedProperties.find((p: any) => p.id === mp.id)) {
        enhancedProperties.push({
          id: mp.id,
          name: mp.title,
          title: mp.title,
          city: mp.city,
          price: mp.price,
          value: mp.price,
          image: mp.image,
          imageUrl: mp.image,
          code: mp.code,
          areaPrivativa: mp.areaPrivativa,
          quartos: mp.quartos,
          suites: mp.suites,
          vagas: mp.vagas,
          pavimentos: mp.pavimentos,
          ultimoContatoEm: mp.ultimoContatoEm,
          disponibilidade: mp.disponibilidade,
          availability: mp.disponibilidade,
          captador: mp.captador,
          proprietario: mp.proprietario,
          tags: mp.tags,
          address: mp.address,
          condominio: mp.condominio,
          unidade: mp.unidade,
          daysWithoutContact: Math.floor(Math.random() * 40),
          dataCriacao: mp.ultimoContatoEm,
          lastContact: mp.ultimoContatoEm,
          lastContactAt: mp.ultimoContatoEm,
          status: mp.disponibilidade === 'Disponível' ? 'Disponível' : 'Indisponível',
          type: mp.type || (mp.quartos >= 4 ? 'Casa' : 'Apartamento'),
          area: `${mp.areaPrivativa} m²`,
          bedrooms: mp.quartos.toString(),
          bathrooms: mp.suites.toString(),
          parking: mp.vagas.toString(),
          rooms: mp.quartos.toString(),
          subtitle: '',
          state: 'SC',
          condominium: '',
          lastUpdate: '',
          portals: [],
          publishedOnSite: true,
          lastUpdatedAt: mp.ultimoContatoEm,
          developmentInfo: {},
          unitInfo: {},
          unitFeatures: [],
          developmentFeatures: [],
          images: [mp.image],
        });
      }
    });
    
    return enhancedProperties;
  }, []);

  const filteredByTokens = useMemo(() => {
    return allProperties.filter((p: any) => {
      if (searchFilters.status) {
        const status = searchFilters.status.toLowerCase();
        const propStatus = `${p.status ?? ''} ${p.availability ?? ''} ${p.disponibilidade ?? ''}`.toLowerCase();
        if (!propStatus.includes(status)) return false;
      }
      if (searchFilters.captador) {
        const captador = (p.captador?.nome || '').toLowerCase();
        if (!captador.includes(searchFilters.captador.toLowerCase())) return false;
      }
      return true;
    });
  }, [searchFilters, allProperties]);
  const { setQuery, filtered: searchedProperties } = usePropertySearch(
    filteredByTokens,
    currentUser?.id
  );

  const parseSearchInput = (value: string) => {
    const tokenPattern = /(\w+):([^\s]+)/g;
    const filters: { status?: string; captador?: string } = {};
    let remaining = value.replace(tokenPattern, (_, key, val) => {
      const k = key.toLowerCase();
      if (k === 'status' || k === 'captador') {
        filters[k as 'status' | 'captador'] = val;
        return '';
      }
      return `${key}:${val}`;
    });
    remaining = remaining.replace(/\s+/g, ' ').trim();
    setSearchFilters(filters);
    setQuery(remaining);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    parseSearchInput(value);
  };

  const removeFilter = (key: keyof typeof searchFilters) => {
    const val = searchFilters[key];
    if (!val) return;
    const regex = new RegExp(`${key}:${val}\\s*`, 'i');
    const newInput = searchInput.replace(regex, '').trim();
    setSearchInput(newInput);
    parseSearchInput(newInput);
  };
  const filterProperties = (properties: any[]) => {
    let filtered = properties;
    const externalBucket = parseBucketFromLabel(filter?.filter ?? null);

    if (externalBucket) {
      filtered = filtered.filter(
        property => categorizeDays(property.daysWithoutContact) === externalBucket
      );
    }

    if (managementFilter) {
      filtered = filtered.filter(
        property => categorizeDays(property.daysWithoutContact) === managementFilter
      );
    }

    const matchesAppliedFilters = (property: any) => {
      const toNumber = (value: any) =>
        typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^\d]+/g, ''));

      const rangeMatches = (value: number | undefined, range: { from: string; to: string }) => {
        if (!value && value !== 0) return false;
        if (range.from && value < Number(range.from)) return false;
        if (range.to && value > Number(range.to)) return false;
        return true;
      };

      const stringIncludes = (haystack: string | undefined, needle: string) =>
        haystack?.toLowerCase().includes(needle.toLowerCase());

      if (appliedFilters.codigos) {
        const tokens = appliedFilters.codigos
          .split(/[,\\s]+/)
          .map(t => t.trim())
          .filter(Boolean);

        const code = property.code ?? property.id ?? '';
        if (tokens.length > 0 && !tokens.some(token => String(code).includes(token))) {
          return false;
        }
      }

      if (appliedFilters.cidade && !stringIncludes(property.city, appliedFilters.cidade)) {
        return false;
      }

      if (appliedFilters.bairro) {
        const addressText =
          typeof property.address === 'string'
            ? property.address
            : property.address?.neighborhood ?? property.address?.street;

        if (!stringIncludes(addressText, appliedFilters.bairro)) {
          return false;
        }
      }

      const price = toNumber(property.price ?? property.value);
      if (
        (appliedFilters.valorImovel.from || appliedFilters.valorImovel.to) &&
        !rangeMatches(price, appliedFilters.valorImovel)
      ) {
        return false;
      }

      const area =
        toNumber(property.areaPrivativa ?? property.area ?? property.internalArea) ||
        toNumber(property.areaInterna);

      if (
        (appliedFilters.areaInterna.from || appliedFilters.areaInterna.to) &&
        !rangeMatches(area, appliedFilters.areaInterna)
      ) {
        return false;
      }

      const quartos = toNumber(property.quartos ?? property.bedrooms ?? property.rooms);
      if (appliedFilters.quartos && quartos !== Number(appliedFilters.quartos)) {
        return false;
      }

      const suites = toNumber(property.suites ?? property.bathrooms);
      if (appliedFilters.suites && suites !== Number(appliedFilters.suites)) {
        return false;
      }

      const vagas = toNumber(property.vagas ?? property.parking);
      if (appliedFilters.vagas && vagas !== Number(appliedFilters.vagas)) {
        return false;
      }

      return true;
    };

    filtered = filtered.filter(matchesAppliedFilters);

    return filtered
      .sort(
        (a, b) =>
          new Date(b.dataCriacao).getTime() -
          new Date(a.dataCriacao).getTime()
      );
  };
  const filteredProperties = filterProperties(searchedProperties);
  const resumoKpiMap = useMemo(
    () =>
      resumoPeriodo.kpis.reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<KpiItem['id'], KpiItem>
      ),
    [resumoPeriodo]
  );
  const getManagementStats = (properties: any[]) => {
    const total = properties.length;
    const disponiveisSite = properties.filter(
      (p: any) =>
        p.availability === 'Disponível no site' || p.disponibilidade === 'Disponível no site'
    ).length;
    const disponiveisInterno = properties.filter(
      (p: any) =>
        p.availability === 'Disponível interno' || p.disponibilidade === 'Disponível interno'
    ).length;
    const indisponiveis = properties.filter(
      (p: any) => p.status === 'Indisponível' || p.disponibilidade === 'Indisponível'
    ).length;

    const bucketCounts = properties.reduce(
      (acc, property) => {
        const bucket = categorizeDays(property.daysWithoutContact);
        acc[bucket] += 1;
        return acc;
      },
      { green: 0, yellow: 0, red: 0 } as Record<Bucket, number>
    );

    const valores = properties
      .map(p => Number(String(p.value ?? '').replace(/[^\d]+/g, '')))
      .filter(value => Number.isFinite(value));

    const mediaValor =
      valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;

    return {
      total,
      disponiveisSite,
      disponiveisInterno,
      indisponiveis,
      green: bucketCounts.green,
      yellow: bucketCounts.yellow,
      red: bucketCounts.red,
      mediaValor,
      novosImoveis: 2,
      imoveisSaidos: 1
    };
  };
  const stats = getManagementStats(filteredProperties);
  const bucketValues: Record<Bucket, number> = {
    green: stats.green,
    yellow: stats.yellow,
    red: stats.red
  };

  const chartData = BUCKET_ORDER.map(bucket => ({
    id: bucket,
    bucket,
    name: bucketDefinitions[bucket].label,
    value: bucketValues[bucket],
    color: bucketDefinitions[bucket].color
  }));

  const toNumber = (value: any) =>
    typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^\d]+/g, ''));

  const formatPrice = (value: any) => currencyFormatter.format(toNumber(value ?? 0));

  const mockLatLngByCity: Record<string, { lat: number; lng: number }> = {
    'Balneário Camboriú': { lat: -26.9914, lng: -48.6345 },
    'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
    'São Paulo': { lat: -23.5505, lng: -46.6333 },
    'Curitiba': { lat: -25.4284, lng: -49.2733 },
    'Florianópolis': { lat: -27.5949, lng: -48.5482 },
  };

  const fallbackLatLng = [
    { lat: -23.5505, lng: -46.6333 },
    { lat: -22.9068, lng: -43.1729 },
    { lat: -19.9167, lng: -43.9345 },
    { lat: -15.7939, lng: -47.8828 },
    { lat: -3.7172, lng: -38.5434 },
  ];

  const resolveLatLng = (property: any, index: number) => {
    if (property?.city && mockLatLngByCity[property.city]) {
      return mockLatLngByCity[property.city];
    }
    return fallbackLatLng[index % fallbackLatLng.length];
  };

  const mapToCardProps = (p: any): PropertyCardProps => ({
    id: p.id,
    code: p.code,
    type: p.type,
    title: p.title || p.name,
    city: p.city,
    price: toNumber(p.price ?? p.value),
    area: toNumber(p.area),
    beds: toNumber(p.bedrooms ?? p.rooms ?? p.quartos),
    baths: toNumber(p.bathrooms ?? p.suites),
    parking: toNumber(p.parking ?? p.vagas),
    statusBadge: p.availability ?? p.status ?? p.disponibilidade,
    lastContact: p.lastContact ?? p.lastContactAt ?? p.ultimoContatoEm,
    coverUrl: p.image ?? p.imageUrl,
    daysWithoutContact: p.daysWithoutContact ?? 0,
    disponibilidade: p.disponibilidade ?? p.availability,
    captador: p.captador,
    proprietario: p.proprietario,
    areaPrivativa: p.areaPrivativa,
    quartos: p.quartos,
    suites: p.suites,
    vagas: p.vagas,
    address: p.address,
    condominio: p.condominio,
    unidade: p.unidade,
    pavimentos: p.pavimentos,
  });

  const renderGridView = () => (
    <div className="space-y-4">
      {filteredProperties.map(property => (
        <PropertyCard
          key={property.id}
          {...mapToCardProps(property)}
          actions={
            <>
              <Link
                to={`/property/${property.id}`}
                className="flex-1 bg-[hsl(var(--accent))] text-white py-3 rounded-xl font-medium active:scale-95 transition-transform text-center"
              >
                Ver Mais Detalhes
              </Link>
              <Link
                to={`/imoveis/${property.id}/atualizar`}
                className="px-4 py-3 border border-[hsl(var(--accent))] text-[hsl(var(--accent))] rounded-xl font-medium active:scale-95 transition-transform flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Atualizar</span>
              </Link>
            </>
          }
        />
      ))}
    </div>
  );

  const renderCompactGridView = () => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filteredProperties.map(property => {
        const card = mapToCardProps(property);
        const cardId = String(card.id ?? property.id ?? '');

        return (
          <PropertyCardMini
            key={cardId}
            id={cardId}
            code={card.code ?? (property.id ? `COD:${property.id}` : '—')}
            title={card.title ?? property.title ?? property.name}
            type={card.type ?? property.type ?? '—'}
            city={card.city ?? property.city ?? '—'}
            price={card.price}
            area={card.area}
            beds={card.beds}
            baths={card.baths}
            parking={card.parking}
            coverUrl={card.coverUrl}
            className="h-full"
          />
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="grid grid-cols-[2fr_repeat(5,minmax(0,1fr))] gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <span>Imóvel</span>
        <span>Tipo</span>
        <span>Situação</span>
        <span>Quartos</span>
        <span>Vagas</span>
        <span>Valor</span>
      </div>
      <div className="divide-y divide-gray-100">
        {filteredProperties.map((property, index) => {
          const quartos = toNumber(property.quartos ?? property.bedrooms ?? property.rooms);
          const vagas = toNumber(property.vagas ?? property.parking);
          const status = property.disponibilidade ?? property.availability ?? property.status;
          const image = property.image ?? property.imageUrl;
          const title = property.title || property.name;
          const code = property.code ?? `COD:${property.id ?? index + 1}`;

          return (
            <div
              key={property.id ?? index}
              className="grid grid-cols-[2fr_repeat(5,minmax(0,1fr))] gap-4 px-6 py-4 text-sm text-gray-700"
            >
              <div className="flex items-center gap-3">
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="h-12 w-16 rounded-xl object-cover shadow-sm"
                  />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {code}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{property.subtitle ?? property.address ?? '—'}</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">{property.type ?? '—'}</span>
              <span>
                {status ? (
                  <AvailabilityBadge value={status} />
                ) : (
                  <span className="text-xs text-gray-500">—</span>
                )}
              </span>
              <span className="text-sm text-gray-600">{Number.isFinite(quartos) ? quartos : '—'}</span>
              <span className="text-sm text-gray-600">{Number.isFinite(vagas) ? vagas : '—'}</span>
              <span className="text-sm font-semibold text-gray-900">{formatPrice(property.price ?? property.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMapView = () => {
    const mapPoints = filteredProperties.map((property, index) => {
      const coords = resolveLatLng(property, index);
      return {
        id: property.id ?? index,
        title: property.title || property.name,
        code: property.code ?? `COD:${property.id ?? index + 1}`,
        address: property.address || property.city,
        price: toNumber(property.price ?? property.value),
        lat: coords.lat,
        lng: coords.lng,
      };
    });

    if (mapPoints.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          Nenhum imóvel disponível para exibir no mapa com os filtros atuais.
        </div>
      );
    }

    return (
      <div className="max-h-[calc(100vh-280px)] space-y-4 overflow-y-auto pr-2">
        <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="absolute left-6 top-6 z-10 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-semibold text-gray-500 shadow-sm">
            Brasil • imóveis mapeados
          </div>
          <ImoveisMap points={mapPoints} className="h-full w-full" />
        </div>
        <div className="grid gap-3 text-xs text-gray-500 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">
              {mapPoints.length} imóveis no mapa
            </p>
            <p>Marcadores baseados nos endereços dos imóveis filtrados.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Clique nos pins</p>
            <p>Veja endereço, código e preço ao abrir os popups.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Base de localização</p>
            <p>Coordenadas estimadas para manter a visualização pronta.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderGestaoTab = () => {
    const captadosKpi = resumoKpiMap.captados;
    const saidasKpi = resumoKpiMap.saidas;
    const ticketMedioKpi = resumoKpiMap.ticketMedio;

    const kpiCards: Array<{
      id: string;
      icon: JSX.Element;
      label: string;
      kpi?: KpiItem;
      description: string;
      valueClass: string;
      defaultType: 'count' | 'currency';
    }> = [
      {
        id: 'captados',
        icon: <TrendingUp className="h-5 w-5 text-emerald-500" aria-hidden />,
        label: 'Novos Imóveis',
        kpi: captadosKpi,
        description: 'Captados no período selecionado',
        valueClass: 'text-emerald-600',
        defaultType: 'count'
      },
      {
        id: 'saidas',
        icon: <TrendingDown className="h-5 w-5 text-red-500" aria-hidden />,
        label: 'Imóveis Saídos',
        kpi: saidasKpi,
        description: 'Saídas registradas no período',
        valueClass: 'text-red-600',
        defaultType: 'count'
      },
      {
        id: 'ticket',
        icon: <BarChart3 className="h-5 w-5 text-[hsl(var(--accent))]" aria-hidden />,
        label: 'Média de Valores',
        kpi: ticketMedioKpi,
        description: 'Ticket médio das captações',
        valueClass: 'text-[hsl(var(--accent))]',
        defaultType: 'currency'
      }
    ];

    return (
      <section
        id="gestao-imoveis"
        className="space-y-6 scroll-mt-28"
        aria-labelledby="titulo-gestao-imoveis"
      >
        <h2 id="titulo-gestao-imoveis" className="sr-only">
          Gestão de Imóveis
        </h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-zinc-900">Resumo da gestão</p>
            <p className="text-sm text-zinc-500">Dados atualizados conforme o período selecionado.</p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="gestao-periodo" className="sr-only">
              Selecionar período do resumo de gestão
            </label>
            <Select
              value={resumoRange}
              onValueChange={value => setResumoRange(value as GestaoResumoRange)}
            >
              <SelectTrigger id="gestao-periodo" className="w-[200px] bg-white">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="ytd">Ano atual (YTD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map(card => {
            const variation = formatVariation(card.kpi?.variation);
            const type = card.kpi?.type ?? card.defaultType;
            const baseValue = card.kpi?.value ?? 0;
            const value =
              type === 'currency'
                ? currencyFormatter.format(baseValue)
                : numberFormatter.format(baseValue);

            return (
              <div key={card.id} className="card p-6">
                <div className="flex items-center gap-3">
                  {card.icon}
                  <span className="text-sm font-medium text-zinc-500">{card.label}</span>
                </div>
                <p className={`mt-3 text-3xl font-semibold ${card.valueClass}`}>{value}</p>
                <p className="text-xs text-zinc-500">{card.description}</p>
                {card.kpi && (
                  <p className={`mt-2 text-xs font-medium ${variation.className}`}>
                    {variation.text} vs período anterior
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900">Status dos Imóveis</h3>
          <div className="space-y-3">
            {resumoPeriodo.statusList.map(status => {
              const style = STATUS_STYLE[status.status];
              const variation = formatVariation(status.variacao);

              return (
                <div
                  key={status.status}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 ${style.bg}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={`h-2.5 w-2.5 rounded-full ${style.dot}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{status.label}</p>
                      <p className="text-xs text-zinc-500">
                        {currencyFormatter.format(status.valor)} em carteira
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${style.text}`}>
                      {status.quantidade.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {percentFormatter.format(status.percentual)}% ·{' '}
                      <span className={`font-medium ${variation.className}`}>
                        {variation.text}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SituacoesPie
            volume={resumoPeriodo.situacoesVolume}
            valor={resumoPeriodo.situacoesValor}
          />
          <CaptacaoBar data={resumoPeriodo.captacaoMensal} />
          <KpiDisponiveis kpi={resumoKpiMap.ativos} statusList={resumoPeriodo.statusList} />
          <FotosPie data={resumoPeriodo.fotos} />
          <PlacaPie data={resumoPeriodo.placa} />
        </div>

        <div className="card p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-[#333333]">Gestão de Imóveis</h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setThresholdsDialogOpen(true)}
                    aria-label="Editar limites (apenas admin)"
                    className="text-gray-500 hover:text-[hsl(var(--accent))]"
                  >
                    <Brush className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar limites (apenas admin)</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <ManagementDonut
              data={chartData}
              className="h-[200px] w-[200px]"
              onSliceClick={item => {
                const bucket = (item as { bucket?: Bucket } | undefined)?.bucket;
                if (!bucket) {
                  return;
                }

                setManagementFilter(prev => (prev === bucket ? null : bucket));
              }}
            />

            <div className="w-full space-y-2">
              {chartData.map(item => (
                <button
                  key={item.bucket}
                  onClick={() => {
                    setManagementFilter(prev => (prev === item.bucket ? null : item.bucket));
                  }}
                  className={`flex w-full items-center justify-between rounded-lg p-3 transition-colors ${
                    managementFilter === item.bucket
                      ? 'border-2 border-gray-400 bg-gray-100'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      aria-hidden
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-zinc-950">{item.name}</span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: item.color }}
                  >
                    {item.value} imóveis
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {managementFilter && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#333333]">
                Imóveis - {bucketDefinitions[managementFilter].label}
              </h3>
              <button
                onClick={() => setManagementFilter(null)}
                className="text-sm font-medium text-[hsl(var(--accent))]"
              >
                Limpar filtro
              </button>
            </div>
            {renderGridView()}
          </div>
        )}
      </section>
    );
  };
  return <div className="bg-white min-h-full flex flex-col w-full h-dvh mx-auto max-w-[95%] md:max-w-none">
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <TopSearchBar
          placeholder="Buscar oportunidades"
          value={searchInput}
          onChange={handleSearchChange}
          onOpenFilter={() => setShowFilterModal(true)}
          filtersCount={appliedFiltersCount}
          className="mb-2"
        />
        {Object.entries(searchFilters).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {Object.entries(searchFilters).map(([key, value]) => (
              <span
                key={key}
                className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {key}:{value}
                <button
                  onClick={() => removeFilter(key as keyof typeof searchFilters)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  aria-label={`Remover filtro ${key}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl p-1">
            <TabsTrigger value="novo" className="text-sm font-medium py-2 px-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:shadow-sm">
              Novo Imóvel
            </TabsTrigger>
            <TabsTrigger value="imoveis" className="text-sm font-medium py-2 px-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:shadow-sm">
              Imóveis
            </TabsTrigger>
            <TabsTrigger value="gestao" className="text-sm font-medium py-2 px-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:shadow-sm">
              Gestão
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
          <TabsContent value="novo" className="flex-1 overflow-y-auto px-4 py-4 m-0">
            <AddImovelPage />
          </TabsContent>

          <TabsContent value="imoveis" className="flex-1 overflow-y-auto px-4 py-4 m-0">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Exibindo {filteredProperties.length} imóvel(is)
                </p>
                <p className="text-xs text-gray-500">
                  Selecione a visualização desejada para acompanhar o portfólio.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    viewMode === 'list'
                      ? 'bg-[hsl(var(--accent))] text-white'
                      : 'text-gray-500 hover:text-[hsl(var(--accent))]'
                  }`}
                >
                  <List className="h-4 w-4" />
                  Lista
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    viewMode === 'grid'
                      ? 'bg-[hsl(var(--accent))] text-white'
                      : 'text-gray-500 hover:text-[hsl(var(--accent))]'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    viewMode === 'compact'
                      ? 'bg-[hsl(var(--accent))] text-white'
                      : 'text-gray-500 hover:text-[hsl(var(--accent))]'
                  }`}
                >
                  <Grid2X2 className="h-4 w-4" />
                  Grade
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    viewMode === 'map'
                      ? 'bg-[hsl(var(--accent))] text-white'
                      : 'text-gray-500 hover:text-[hsl(var(--accent))]'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  Mapa
                </button>
              </div>
            </div>
            {viewMode === 'list' && renderListView()}
            {viewMode === 'grid' && renderGridView()}
            {viewMode === 'compact' && renderCompactGridView()}
            {viewMode === 'map' && renderMapView()}
          </TabsContent>

          <TabsContent value="gestao" className="flex-1 overflow-y-auto px-4 py-4 m-0">
            {renderGestaoTab()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showFilterModal && (
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApplyFilter={(_filters, count) => {
            setAppliedFilters(_filters);
            setAppliedFiltersCount(count);
            setShowFilterModal(false);
          }}
          initialFilters={appliedFilters}
        />
      )}

      {editingProperty && <PropertyEditModal
        property={{
          ...editingProperty,
          name: editingProperty.title,
          address: `${editingProperty.city}, ${editingProperty.state}`,
          value: editingProperty.price,
          rooms: editingProperty.bedrooms,
          bathrooms: editingProperty.bathrooms,
          area: editingProperty.area,
          availability: editingProperty.status || 'Disponível',
          images: editingProperty.imageUrl ? [editingProperty.imageUrl] : [],
          unitFeatures: [],
          bedrooms: parseInt(editingProperty.bedrooms) || 0,
          suites: 0,
          garages: 0
        }} 
        onClose={() => setEditingProperty(null)}
        onSave={updatedProperty => {
          console.log('Property updated:', updatedProperty);
          setEditingProperty(null);
        }}
      />}
      <ThresholdsDialog
        open={isThresholdsDialogOpen}
        onOpenChange={setThresholdsDialogOpen}
        thresholds={thresholds}
        onSave={setThresholds}
      />
    </div>;
};
