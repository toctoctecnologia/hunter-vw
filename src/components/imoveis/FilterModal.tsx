import { useEffect, useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

type NullableBoolean = boolean | null;

type RangeValue = {
  from: string;
  to: string;
};

type FeatureRecord<T extends string> = Record<T, boolean>;

const ALL_SELECT_VALUE = '__all__';

const normalizeSelectValue = (value: string) => value || ALL_SELECT_VALUE;
const parseSelectValue = (value: string) => (value === ALL_SELECT_VALUE ? '' : value);

const INTERNAL_FEATURES = [
  { key: 'areaPrivativa', label: 'Área privativa' },
  { key: 'areaServico', label: 'Área serviço' },
  { key: 'boxBanheiro', label: 'Box banheiro' },
  { key: 'closet', label: 'Closet' },
  { key: 'dce', label: 'DCE' },
  { key: 'lavabo', label: 'Lavabo' },
  { key: 'varanda', label: 'Varanda' },
  { key: 'varandaGourmet', label: 'Varanda gourmet' },
  { key: 'mobiliado', label: 'Mobiliado' },
  { key: 'arCondicionado', label: 'Ar condicionado' },
  { key: 'vistaMar', label: 'Vista para o mar' }
] as const;

const EXTERNAL_FEATURES = [
  { key: 'alarme', label: 'Alarme' },
  { key: 'jardim', label: 'Jardim' },
  { key: 'boxDespejo', label: 'Box despejo' },
  { key: 'portaoEletronico', label: 'Portão eletrônico' },
  { key: 'circuitoTv', label: 'Circuito TV' },
  { key: 'portaria24h', label: 'Portaria 24 horas' },
  { key: 'interfone', label: 'Interfone' }
] as const;

const LEISURE_FEATURES = [
  { key: 'academia', label: 'Academia' },
  { key: 'espacoGourmet', label: 'Espaço gourmet' },
  { key: 'sauna', label: 'Sauna' },
  { key: 'churrasqueira', label: 'Churrasqueira' },
  { key: 'piscina', label: 'Piscina' },
  { key: 'playground', label: 'Playground' },
  { key: 'quadraTenis', label: 'Quadra de tênis' },
  { key: 'quadraPoliesportiva', label: 'Quadra poliesportiva' },
  { key: 'quadraSquash', label: 'Quadra de squash' },
  { key: 'quadraBeachTenis', label: 'Quadra de beach tênis' },
  { key: 'salaoFestas', label: 'Salão de festas' },
  { key: 'salaoJogos', label: 'Salão de jogos' },
  { key: 'hidromassagem', label: 'Hidromassagem' },
  { key: 'homeCinema', label: 'Home cinema' },
  { key: 'salaMassagem', label: 'Sala de massagem' },
  { key: 'wifi', label: 'Wifi' },
  { key: 'garageBand', label: 'Garage Band' }
] as const;

const OTHER_FEATURES = [
  { key: 'imovelAlugado', label: 'Imóvel alugado' },
  { key: 'exclusivo', label: 'Exclusivo' },
  { key: 'aceitaFinanciamento', label: 'Aceita financiamento' },
  { key: 'naPlanta', label: 'Na planta' },
  { key: 'permiteAnimais', label: 'Permite animais' }
] as const;

type InternalFeatureKey = (typeof INTERNAL_FEATURES)[number]['key'];
type ExternalFeatureKey = (typeof EXTERNAL_FEATURES)[number]['key'];
type LeisureFeatureKey = (typeof LEISURE_FEATURES)[number]['key'];
type OtherFeatureKey = (typeof OTHER_FEATURES)[number]['key'];

export interface ImoveisFilters {
  codigos: string;
  unidade: string;
  finalidade: string;
  situacao: string;
  avulsoLancamento: string;
  statusObra: string;
  tipoImovel: string[];
  tipoLancamento: string[];
  dataObra: RangeValue;
  cidade: string;
  regiao: string;
  subRegiao: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  localChaves: string;
  identificadorChaves: string;
  valorImovel: RangeValue;
  valorCondominio: RangeValue;
  areaInterna: RangeValue;
  quartos: string;
  suites: string;
  vagas: string;
  edificio: string;
  tipoCondominio: string;
  imovelOcupado: NullableBoolean;
  destinacao: string;
  proprietario: string;
  construtora: string;
  equipe: string;
  captador: string;
  zonaUso: string;
  posicaoImovel: string;
  torreBloco: string;
  unidadesAndar: string;
  numeroAndares: string;
  avaliacao: string;
  atualizacao: string;
  anterioridade: string;
  periodoSituacao: string;
  periodoCadastro: string;
  idadeImovel: string;
  aceitaPermuta: NullableBoolean;
  publicacaoInternet: NullableBoolean;
  exibidoPortal: NullableBoolean;
  naoExibidoPortal: NullableBoolean;
  areaPatio: string;
  areaArmazenagem: string;
  peDireito: string;
  cargaPiso: string;
  forcaInstalada: string;
  numeroDocas: string;
  alturaPortao: string;
  internalFeatures: FeatureRecord<InternalFeatureKey>;
  externalFeatures: FeatureRecord<ExternalFeatureKey>;
  leisureFeatures: FeatureRecord<LeisureFeatureKey>;
  otherFeatures: FeatureRecord<OtherFeatureKey>;
}

export interface FilterModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApplyFilter?: (filters: ImoveisFilters, activeCount: number) => void;
  initialFilters?: ImoveisFilters;
}

const createFeatureState = <T extends string>(items: readonly { key: T }[]) =>
  items.reduce(
    (acc, item) => {
      acc[item.key] = false;
      return acc;
    },
    {} as Record<T, boolean>
  );

export const defaultFilters: ImoveisFilters = {
  codigos: '',
  unidade: '',
  finalidade: '',
  situacao: '',
  avulsoLancamento: '',
  statusObra: '',
  tipoImovel: [],
  tipoLancamento: [],
  dataObra: { from: '', to: '' },
  cidade: '',
  regiao: '',
  subRegiao: '',
  bairro: '',
  logradouro: '',
  numero: '',
  complemento: '',
  localChaves: '',
  identificadorChaves: '',
  valorImovel: { from: '', to: '' },
  valorCondominio: { from: '', to: '' },
  areaInterna: { from: '', to: '' },
  quartos: '',
  suites: '',
  vagas: '',
  edificio: '',
  tipoCondominio: '',
  imovelOcupado: null,
  destinacao: '',
  proprietario: '',
  construtora: '',
  equipe: '',
  captador: '',
  zonaUso: '',
  posicaoImovel: '',
  torreBloco: '',
  unidadesAndar: '',
  numeroAndares: '',
  avaliacao: '',
  atualizacao: '',
  anterioridade: '',
  periodoSituacao: '',
  periodoCadastro: '',
  idadeImovel: '',
  aceitaPermuta: null,
  publicacaoInternet: null,
  exibidoPortal: null,
  naoExibidoPortal: null,
  areaPatio: '',
  areaArmazenagem: '',
  peDireito: '',
  cargaPiso: '',
  forcaInstalada: '',
  numeroDocas: '',
  alturaPortao: '',
  internalFeatures: createFeatureState(INTERNAL_FEATURES),
  externalFeatures: createFeatureState(EXTERNAL_FEATURES),
  leisureFeatures: createFeatureState(LEISURE_FEATURES),
  otherFeatures: createFeatureState(OTHER_FEATURES)
};

export function FilterModal({ isOpen = false, onClose, onApplyFilter, initialFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<ImoveisFilters>(defaultFilters);

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters ?? defaultFilters);
    }
  }, [initialFilters, isOpen]);

  const updateRange = (key: keyof Pick<ImoveisFilters, 'dataObra' | 'valorImovel' | 'valorCondominio' | 'areaInterna'>, field: keyof RangeValue, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const updateFeature = <T extends string>(
    key: keyof Pick<ImoveisFilters, 'internalFeatures' | 'externalFeatures' | 'leisureFeatures' | 'otherFeatures'>,
    feature: T
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] as Record<T, boolean>),
        [feature]: !(prev[key] as Record<T, boolean>)[feature]
      }
    }));
  };

  const updateBoolean = (
    key: keyof Pick<
      ImoveisFilters,
      'imovelOcupado' | 'aceitaPermuta' | 'publicacaoInternet' | 'exibidoPortal' | 'naoExibidoPortal'
    >,
    value: NullableBoolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArrayValue = (key: keyof Pick<ImoveisFilters, 'tipoImovel' | 'tipoLancamento'>, value: string) => {
    setFilters(prev => {
      const current = prev[key];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists ? current.filter(v => v !== value) : [...current, value]
      };
    });
  };

  const activeFiltersCount = useMemo(() => {
    const rangeCount = (range: RangeValue) =>
      (range.from ? 1 : 0) + (range.to ? 1 : 0);

    const booleanCount = (value: NullableBoolean) => (value === null ? 0 : 1);

    const featureCount = (record: Record<string, boolean>) =>
      Object.values(record).filter(Boolean).length;

    return (
      (filters.codigos ? 1 : 0) +
      (filters.unidade ? 1 : 0) +
      (filters.finalidade ? 1 : 0) +
      (filters.situacao ? 1 : 0) +
      (filters.avulsoLancamento ? 1 : 0) +
      (filters.statusObra ? 1 : 0) +
      filters.tipoImovel.length +
      filters.tipoLancamento.length +
      rangeCount(filters.dataObra) +
      (filters.cidade ? 1 : 0) +
      (filters.regiao ? 1 : 0) +
      (filters.subRegiao ? 1 : 0) +
      (filters.bairro ? 1 : 0) +
      (filters.logradouro ? 1 : 0) +
      (filters.numero ? 1 : 0) +
      (filters.complemento ? 1 : 0) +
      (filters.localChaves ? 1 : 0) +
      (filters.identificadorChaves ? 1 : 0) +
      rangeCount(filters.valorImovel) +
      rangeCount(filters.valorCondominio) +
      rangeCount(filters.areaInterna) +
      (filters.quartos ? 1 : 0) +
      (filters.suites ? 1 : 0) +
      (filters.vagas ? 1 : 0) +
      (filters.edificio ? 1 : 0) +
      (filters.tipoCondominio ? 1 : 0) +
      booleanCount(filters.imovelOcupado) +
      (filters.destinacao ? 1 : 0) +
      (filters.proprietario ? 1 : 0) +
      (filters.construtora ? 1 : 0) +
      (filters.equipe ? 1 : 0) +
      (filters.captador ? 1 : 0) +
      (filters.zonaUso ? 1 : 0) +
      (filters.posicaoImovel ? 1 : 0) +
      (filters.torreBloco ? 1 : 0) +
      (filters.unidadesAndar ? 1 : 0) +
      (filters.numeroAndares ? 1 : 0) +
      (filters.avaliacao ? 1 : 0) +
      (filters.atualizacao ? 1 : 0) +
      (filters.anterioridade ? 1 : 0) +
      (filters.periodoSituacao ? 1 : 0) +
      (filters.periodoCadastro ? 1 : 0) +
      (filters.idadeImovel ? 1 : 0) +
      booleanCount(filters.aceitaPermuta) +
      booleanCount(filters.publicacaoInternet) +
      booleanCount(filters.exibidoPortal) +
      booleanCount(filters.naoExibidoPortal) +
      (filters.areaPatio ? 1 : 0) +
      (filters.areaArmazenagem ? 1 : 0) +
      (filters.peDireito ? 1 : 0) +
      (filters.cargaPiso ? 1 : 0) +
      (filters.forcaInstalada ? 1 : 0) +
      (filters.numeroDocas ? 1 : 0) +
      (filters.alturaPortao ? 1 : 0) +
      featureCount(filters.internalFeatures) +
      featureCount(filters.externalFeatures) +
      featureCount(filters.leisureFeatures) +
      featureCount(filters.otherFeatures)
    );
  }, [filters]);

  const handleApply = () => {
    onApplyFilter?.(filters, activeFiltersCount);
    onClose?.();
  };

  const handleClear = () => {
    setFilters(defaultFilters);
  };

  const renderRangeInputs = (
    label: string,
    key: keyof Pick<ImoveisFilters, 'dataObra' | 'valorImovel' | 'valorCondominio' | 'areaInterna'>,
    placeholderFrom = 'De',
    placeholderTo = 'Até'
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={filters[key].from}
          onChange={e => updateRange(key, 'from', e.target.value)}
          placeholder={placeholderFrom}
        />
        <Input
          value={filters[key].to}
          onChange={e => updateRange(key, 'to', e.target.value)}
          placeholder={placeholderTo}
        />
      </div>
    </div>
  );

  const renderBooleanSelector = (
    label: string,
    key: keyof Pick<
      ImoveisFilters,
      'imovelOcupado' | 'aceitaPermuta' | 'publicacaoInternet' | 'exibidoPortal' | 'naoExibidoPortal'
    >
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">{label}</Label>
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant={filters[key] === null ? 'secondary' : 'outline'}
          className={filters[key] === null ? 'bg-gray-100' : ''}
          onClick={() => updateBoolean(key, null)}
        >
          Todos
        </Button>
        <Button
          type="button"
          variant={filters[key] === true ? 'default' : 'outline'}
          className={filters[key] === true ? 'bg-orange-500 hover:bg-orange-500 text-white' : ''}
          onClick={() => updateBoolean(key, true)}
        >
          Sim
        </Button>
        <Button
          type="button"
          variant={filters[key] === false ? 'default' : 'outline'}
          className={filters[key] === false ? 'bg-orange-500 hover:bg-orange-500 text-white' : ''}
          onClick={() => updateBoolean(key, false)}
        >
          Não
        </Button>
      </div>
    </div>
  );

  const renderFeatureSection = <T extends string>(
    title: string,
    features: readonly { key: T; label: string }[],
    valueKey: keyof Pick<ImoveisFilters, 'internalFeatures' | 'externalFeatures' | 'leisureFeatures' | 'otherFeatures'>
  ) => (
    <div className="rounded-xl border border-gray-100 p-4 space-y-3 bg-gray-50/60">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map(feature => (
          <label key={feature.key} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
            <span className="text-sm text-gray-800">{feature.label}</span>
            <Switch
              checked={(filters[valueKey] as Record<T, boolean>)[feature.key]}
              onCheckedChange={() => updateFeature(valueKey, feature.key)}
            />
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose?.()}>
      <DialogContent className="max-w-6xl w-full p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Filter className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">Filtros de imóveis</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Use os campos abaixo para filtrar rapidamente por identificação, classificação, localização e características.
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleClear} className="text-gray-600">
                Limpar filtros
              </Button>
              <Button onClick={handleApply} className="bg-orange-600 hover:bg-orange-500 text-white">
                Aplicar filtros ({activeFiltersCount})
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 px-6 py-4">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">1. Identificação e controle</p>
                  <p className="text-sm text-gray-500">Defina os dados principais do imóvel para localizar cadastros específicos.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Códigos do imóvel</Label>
                  <Input
                    placeholder="Digite um ou mais códigos"
                    value={filters.codigos}
                    onChange={e => setFilters(prev => ({ ...prev, codigos: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select
                    value={normalizeSelectValue(filters.unidade)}
                    onValueChange={value => setFilters(prev => ({ ...prev, unidade: parseSelectValue(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SELECT_VALUE}>Todas</SelectItem>
                      <SelectItem value="filial1">Filial 1</SelectItem>
                      <SelectItem value="filial2">Filial 2</SelectItem>
                      <SelectItem value="filial3">Filial 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Finalidade</Label>
                  <Select
                    value={normalizeSelectValue(filters.finalidade)}
                    onValueChange={value => setFilters(prev => ({ ...prev, finalidade: parseSelectValue(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SELECT_VALUE}>Todas</SelectItem>
                      <SelectItem value="venda">Venda</SelectItem>
                      <SelectItem value="aluguel">Aluguel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Situação</Label>
                  <Select
                    value={normalizeSelectValue(filters.situacao)}
                    onValueChange={value => setFilters(prev => ({ ...prev, situacao: parseSelectValue(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SELECT_VALUE}>Todas</SelectItem>
                      <SelectItem value="vago">Vago</SelectItem>
                      <SelectItem value="disponivel">Disponível</SelectItem>
                      <SelectItem value="alugado">Alugado</SelectItem>
                      <SelectItem value="desativado">Desativado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Avulso ou Lançamento</Label>
                  <Select
                    value={normalizeSelectValue(filters.avulsoLancamento)}
                    onValueChange={value => setFilters(prev => ({ ...prev, avulsoLancamento: parseSelectValue(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SELECT_VALUE}>Todos</SelectItem>
                      <SelectItem value="avulso">Avulso</SelectItem>
                      <SelectItem value="lancamento">Lançamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status da obra</Label>
                  <Select
                    value={normalizeSelectValue(filters.statusObra)}
                    onValueChange={value => setFilters(prev => ({ ...prev, statusObra: parseSelectValue(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SELECT_VALUE}>Todos</SelectItem>
                      <SelectItem value="pre-lancamento">Pré-lançamento</SelectItem>
                      <SelectItem value="lancamento">Lançamento</SelectItem>
                      <SelectItem value="em-construcao">Em construção</SelectItem>
                      <SelectItem value="em-acabamento">Em acabamento</SelectItem>
                      <SelectItem value="pronto">Pronto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {renderRangeInputs('Data da obra', 'dataObra')}
                <div className="space-y-2 md:col-span-2">
                  <Label>Etiquetas / Tipo de imóvel</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Apartamento',
                      'Apartamento diferenciado',
                      'Casa',
                      'Casa em condomínio',
                      'Clube privado',
                      'Cobertura',
                      'Prédio',
                      'Terreno',
                      'Terreno em condomínio'
                    ].map(option => (
                      <label key={option} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                        <span>{option}</span>
                        <Switch
                          checked={filters.tipoImovel.includes(option)}
                          onCheckedChange={() => toggleArrayValue('tipoImovel', option)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <div>
                <p className="text-base font-semibold text-gray-900">2. Classificação do imóvel</p>
                <p className="text-sm text-gray-500">Defina o tipo de lançamento e o perfil do produto.</p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="md:col-span-2 space-y-2">
                  <Label>Tipo de imóvel</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Horizontal', 'Vertical', 'Lotes'].map(option => (
                      <label key={option} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                        <span>{option}</span>
                        <Switch
                          checked={filters.tipoLancamento.includes(option)}
                          onCheckedChange={() => toggleArrayValue('tipoLancamento', option)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de lançamento</Label>
                  <Input placeholder="Ex: Vertical" value={filters.tipoLancamento.join(', ')} readOnly />
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <div>
                <p className="text-base font-semibold text-gray-900">3. Localização</p>
                <p className="text-sm text-gray-500">Busque por cidade, região, endereço e localização das chaves.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    placeholder="Digite o nome das cidades"
                    value={filters.cidade}
                    onChange={e => setFilters(prev => ({ ...prev, cidade: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Região</Label>
                  <Input
                    placeholder="Informe uma região"
                    value={filters.regiao}
                    onChange={e => setFilters(prev => ({ ...prev, regiao: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sub-região</Label>
                  <Input
                    placeholder="Informe uma sub-região"
                    value={filters.subRegiao}
                    onChange={e => setFilters(prev => ({ ...prev, subRegiao: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input
                    placeholder="Digite os nomes dos bairros"
                    value={filters.bairro}
                    onChange={e => setFilters(prev => ({ ...prev, bairro: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input
                    placeholder="Digite o nome do endereço"
                    value={filters.logradouro}
                    onChange={e => setFilters(prev => ({ ...prev, logradouro: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input
                    placeholder="Digite o número do endereço"
                    value={filters.numero}
                    onChange={e => setFilters(prev => ({ ...prev, numero: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Complemento</Label>
                  <Input
                    placeholder="Digite o complemento"
                    value={filters.complemento}
                    onChange={e => setFilters(prev => ({ ...prev, complemento: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Local das chaves</Label>
                  <Input
                    placeholder="Ex.: Portaria, escritório"
                    value={filters.localChaves}
                    onChange={e => setFilters(prev => ({ ...prev, localChaves: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Identificador das chaves</Label>
                  <Input
                    placeholder="Código da chave"
                    value={filters.identificadorChaves}
                    onChange={e => setFilters(prev => ({ ...prev, identificadorChaves: e.target.value }))}
                  />
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <div>
                <p className="text-base font-semibold text-gray-900">4. Valores e dimensões</p>
                <p className="text-sm text-gray-500">Defina faixas de valores, metragem e informações de ocupação.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {renderRangeInputs('Valor do imóvel', 'valorImovel')}
                {renderRangeInputs('Valor do condomínio', 'valorCondominio')}
                {renderRangeInputs('Área interna m²', 'areaInterna')}
                <div className="space-y-2">
                  <Label>Quartos</Label>
                  <Input
                    placeholder="Quantidade"
                    value={filters.quartos}
                    onChange={e => setFilters(prev => ({ ...prev, quartos: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Suítes</Label>
                  <Input
                    placeholder="Quantidade"
                    value={filters.suites}
                    onChange={e => setFilters(prev => ({ ...prev, suites: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vagas</Label>
                  <Input
                    placeholder="Quantidade"
                    value={filters.vagas}
                    onChange={e => setFilters(prev => ({ ...prev, vagas: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Edifício</Label>
                  <Input
                    placeholder="Nome do edifício"
                    value={filters.edificio}
                    onChange={e => setFilters(prev => ({ ...prev, edificio: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de condomínio</Label>
                  <Input
                    placeholder="Tipo de condomínio"
                    value={filters.tipoCondominio}
                    onChange={e => setFilters(prev => ({ ...prev, tipoCondominio: e.target.value }))}
                  />
                </div>
                {renderBooleanSelector('Imóvel ocupado', 'imovelOcupado')}
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <div>
                <p className="text-base font-semibold text-gray-900">5. Destinação e gestão</p>
                <p className="text-sm text-gray-500">Configure o uso do imóvel e relacione responsáveis.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Destinação</Label>
                  <Select
                    value={normalizeSelectValue(filters.destinacao)}
                    onValueChange={value => setFilters(prev => ({ ...prev, destinacao: parseSelectValue(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SELECT_VALUE}>Todas</SelectItem>
                      <SelectItem value="residencial">Residencial</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Proprietário</Label>
                  <Input
                    placeholder="Nome, email ou telefone"
                    value={filters.proprietario}
                    onChange={e => setFilters(prev => ({ ...prev, proprietario: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Construtora</Label>
                  <Input
                    placeholder="Digite o nome da construtora"
                    value={filters.construtora}
                    onChange={e => setFilters(prev => ({ ...prev, construtora: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Equipe</Label>
                  <Input
                    placeholder="Selecione a equipe"
                    value={filters.equipe}
                    onChange={e => setFilters(prev => ({ ...prev, equipe: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Captador</Label>
                  <Input
                    placeholder="Responsável pela captação"
                    value={filters.captador}
                    onChange={e => setFilters(prev => ({ ...prev, captador: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zona de uso</Label>
                  <Input
                    placeholder="Residencial, comercial..."
                    value={filters.zonaUso}
                    onChange={e => setFilters(prev => ({ ...prev, zonaUso: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Posição do imóvel</Label>
                  <Select
                    value={normalizeSelectValue(filters.posicaoImovel)}
                    onValueChange={value => setFilters(prev => ({ ...prev, posicaoImovel: parseSelectValue(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SELECT_VALUE}>Todas</SelectItem>
                      <SelectItem value="frente">Frente</SelectItem>
                      <SelectItem value="fundo">Fundo</SelectItem>
                      <SelectItem value="lateral">Lateral</SelectItem>
                      <SelectItem value="meio">Meio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Torre ou bloco</Label>
                  <Input
                    placeholder="Identificador da torre"
                    value={filters.torreBloco}
                    onChange={e => setFilters(prev => ({ ...prev, torreBloco: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidades por andar</Label>
                  <Input
                    placeholder="Quantidade"
                    value={filters.unidadesAndar}
                    onChange={e => setFilters(prev => ({ ...prev, unidadesAndar: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número de andares</Label>
                  <Input
                    placeholder="Quantidade"
                    value={filters.numeroAndares}
                    onChange={e => setFilters(prev => ({ ...prev, numeroAndares: e.target.value }))}
                  />
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <div>
                <p className="text-base font-semibold text-gray-900">6. Avaliação e status operacional</p>
                <p className="text-sm text-gray-500">Controle SLA, ciclos de atualização e exposição nos portais.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Avaliação</Label>
                  <Select
                    value={normalizeSelectValue(filters.avaliacao)}
                    onValueChange={value => setFilters(prev => ({ ...prev, avaliacao: parseSelectValue(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SELECT_VALUE}>Todas</SelectItem>
                      <SelectItem value="verde">Verde</SelectItem>
                      <SelectItem value="amarelo">Amarelo</SelectItem>
                      <SelectItem value="vermelho">Vermelho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Atualização</Label>
                  <Select
                    value={normalizeSelectValue(filters.atualizacao)}
                    onValueChange={value => setFilters(prev => ({ ...prev, atualizacao: parseSelectValue(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SELECT_VALUE}>Todas</SelectItem>
                      <SelectItem value="verde">Verde</SelectItem>
                      <SelectItem value="amarelo">Amarelo</SelectItem>
                      <SelectItem value="vermelho">Vermelho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Anterioridade</Label>
                  <Input
                    placeholder="Dias desde o último contato"
                    value={filters.anterioridade}
                    onChange={e => setFilters(prev => ({ ...prev, anterioridade: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Período de situação</Label>
                  <Select
                    value={normalizeSelectValue(filters.periodoSituacao)}
                    onValueChange={value => setFilters(prev => ({ ...prev, periodoSituacao: parseSelectValue(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SELECT_VALUE}>Todos</SelectItem>
                      <SelectItem value="vencido">Vencido</SelectItem>
                      <SelectItem value="hoje">Hoje</SelectItem>
                      <SelectItem value="amanha">Amanhã</SelectItem>
                      <SelectItem value="proximo-mes">Próximo mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Período de cadastro</Label>
                  <Input
                    placeholder="Informe intervalo ou data"
                    value={filters.periodoCadastro}
                    onChange={e => setFilters(prev => ({ ...prev, periodoCadastro: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Idade do imóvel</Label>
                  <Input
                    placeholder="Anos de construção"
                    value={filters.idadeImovel}
                    onChange={e => setFilters(prev => ({ ...prev, idadeImovel: e.target.value }))}
                  />
                </div>
                {renderBooleanSelector('Aceita permuta', 'aceitaPermuta')}
                {renderBooleanSelector('Publicação na internet', 'publicacaoInternet')}
                {renderBooleanSelector('Exibido no portal', 'exibidoPortal')}
                {renderBooleanSelector('Não exibido no portal', 'naoExibidoPortal')}
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <div>
                <p className="text-base font-semibold text-gray-900">7. Características extras técnicas</p>
                <p className="text-sm text-gray-500">Campos específicos para imóveis industriais e logísticos.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Área de pátio a partir de (m²)</Label>
                  <Input
                    value={filters.areaPatio}
                    onChange={e => setFilters(prev => ({ ...prev, areaPatio: e.target.value }))}
                    placeholder="Ex.: 1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Área de armazenagem a partir de (m²)</Label>
                  <Input
                    value={filters.areaArmazenagem}
                    onChange={e => setFilters(prev => ({ ...prev, areaArmazenagem: e.target.value }))}
                    placeholder="Ex.: 5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pé direito a partir de (m²)</Label>
                  <Input
                    value={filters.peDireito}
                    onChange={e => setFilters(prev => ({ ...prev, peDireito: e.target.value }))}
                    placeholder="Ex.: 8"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Carga de piso mínima (ton/m²)</Label>
                  <Input
                    value={filters.cargaPiso}
                    onChange={e => setFilters(prev => ({ ...prev, cargaPiso: e.target.value }))}
                    placeholder="Ex.: 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Força instalada mínima (kVA)</Label>
                  <Input
                    value={filters.forcaInstalada}
                    onChange={e => setFilters(prev => ({ ...prev, forcaInstalada: e.target.value }))}
                    placeholder="Ex.: 150"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número de docas mínimo</Label>
                  <Input
                    value={filters.numeroDocas}
                    onChange={e => setFilters(prev => ({ ...prev, numeroDocas: e.target.value }))}
                    placeholder="Ex.: 4"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Altura de portão mínima</Label>
                  <Input
                    value={filters.alturaPortao}
                    onChange={e => setFilters(prev => ({ ...prev, alturaPortao: e.target.value }))}
                    placeholder="Ex.: 3,5"
                  />
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              {renderFeatureSection('8. Características internas', INTERNAL_FEATURES, 'internalFeatures')}
              {renderFeatureSection('9. Características externas', EXTERNAL_FEATURES, 'externalFeatures')}
              {renderFeatureSection('10. Lazer', LEISURE_FEATURES, 'leisureFeatures')}
              {renderFeatureSection('11. Outras características', OTHER_FEATURES, 'otherFeatures')}
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
