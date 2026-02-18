import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Building2, MapPin, DollarSign, Rocket, Building, Home, Sofa, Trees, Tag, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PropertyCharacteristicsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PropertyCharacteristicsData;
  onSave: (data: PropertyCharacteristicsData) => void;
}

export interface PropertyCharacteristicsData {
  // 1. Property Type
  propertyTypes: string[];
  // 2. Tipologia
  bedrooms: string;
  suites: string;
  propertyAge: string;
  // 3. Localização
  city: string;
  neighborhood: string;
  fullAddress: string;
  number: string;
  complement: string;
  complementType: string;
  // 4. Valores e Dimensões
  minValue: string;
  maxValue: string;
  minInternalArea: string;
  maxInternalArea: string;
  minLotArea: string;
  maxLotArea: string;
  // 5. Empreendimento e Lançamento
  launchType: string[];
  modality: string[];
  constructionStage: string[];
  constructionStart: string;
  constructionEnd: string;
  // 6. Edifício e Condomínio
  buildingName: string;
  condominiumName: string;
  elevators: string;
  has24hDoorman: boolean;
  hasIntercom: boolean;
  // 7. Destinação do Imóvel
  destinations: string[];
  // 8. Características Internas
  internalFeatures: string[];
  // 9. Lazer e Áreas Comuns
  leisureFeatures: string[];
  // 10. Situação Comercial
  commercialSituation: string[];
  // 11. Tags de Destaque
  highlightTags: string[];
}

const defaultData: PropertyCharacteristicsData = {
  propertyTypes: [],
  bedrooms: '',
  suites: '',
  propertyAge: '',
  city: '',
  neighborhood: '',
  fullAddress: '',
  number: '',
  complement: '',
  complementType: '',
  minValue: '',
  maxValue: '',
  minInternalArea: '',
  maxInternalArea: '',
  minLotArea: '',
  maxLotArea: '',
  launchType: [],
  modality: [],
  constructionStage: [],
  constructionStart: '',
  constructionEnd: '',
  buildingName: '',
  condominiumName: '',
  elevators: '',
  has24hDoorman: false,
  hasIntercom: false,
  destinations: [],
  internalFeatures: [],
  leisureFeatures: [],
  commercialSituation: [],
  highlightTags: [],
};

// Options
const propertyTypeOptions = [
  'Apartamento', 'Apartamento diferenciado', 'Casa', 'Casa de condomínio',
  'Clube privado', 'Cobertura', 'Prédio', 'Terreno', 'Terreno em condomínio'
];

const bedroomOptions = [
  { value: '', label: 'Todos' },
  { value: 'min1', label: 'A partir de 1' },
  { value: 'min2', label: 'A partir de 2' },
  { value: 'min3', label: 'A partir de 3' },
  { value: 'min4', label: 'A partir de 4' },
  { value: 'min5', label: 'A partir de 5' },
  { value: 'exact1', label: 'Exatamente 1' },
  { value: 'exact2', label: 'Exatamente 2' },
  { value: 'exact3', label: 'Exatamente 3' },
  { value: 'exact4', label: 'Exatamente 4' },
  { value: 'exact5', label: 'Exatamente 5' },
];

const suiteOptions = [
  { value: '', label: 'Todos' },
  { value: 'min1', label: 'A partir de 1' },
  { value: 'min2', label: 'A partir de 2' },
  { value: 'min3', label: 'A partir de 3' },
  { value: 'min4', label: 'A partir de 4' },
  { value: 'min5', label: 'A partir de 5' },
];

const propertyAgeOptions = [
  { value: '', label: 'Todos' },
  { value: '5', label: 'Até 5 anos' },
  { value: '10', label: 'Até 10 anos' },
  { value: '20', label: 'Até 20 anos' },
  { value: '30', label: 'Até 30 anos' },
  { value: '40', label: 'Até 40 anos' },
  { value: '50', label: 'Até 50 anos' },
];

const complementTypeOptions = [
  'Apartamento', 'Barracão', 'Casa', 'Conjunto', 'Loja', 'Quadra', 'Lote', 'Sala', 'Vaga'
];

const launchTypeOptions = ['Vertical', 'Horizontal'];
const modalityOptions = ['Avulso', 'Lançamento'];
const constructionStageOptions = ['Pré-lançamento', 'Lançamento', 'Em construção', 'Acabamento', 'Pronto'];
const elevatorOptions = ['A partir de 1', 'A partir de 2', 'A partir de 3', 'A partir de 4', 'A partir de 5'];

const destinationOptions = [
  'Residencial', 'Comercial', 'Residencial e comercial', 'Industrial', 'Rural', 'Temporada', 'Corporativo'
];

const internalFeatureOptions = [
  'Área privativa', 'Varanda', 'Área de serviço', 'Banheiro social', 
  'Suíte', 'Mobiliado', 'Armário no quarto', 'Armário na cozinha', 
  'Box de banheiro', 'Box de despejo'
];

const leisureFeatureOptions = [
  'Piscina', 'Playground', 'Salão de festas', 'Quadra de tênis', 'Vaga de garagem', 'Box 24'
];

const commercialSituationOptions = ['Aceita financiamento', 'Aceita permuta'];

const highlightTagOptions = [
  'Frente mar', 'Vista mar', 'Quadra mar', 'Na planta', 
  'Pronto para morar', 'Mobiliado', 'Lançamento', 'Veraneio'
];

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-1 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">{icon}</span>
          <span className="font-medium text-foreground">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-1 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface ChipSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
}

function ChipSelect({ options, selected, onChange, multiple = true }: ChipSelectProps) {
  const toggle = (option: string) => {
    if (multiple) {
      if (selected.includes(option)) {
        onChange(selected.filter(s => s !== option));
      } else {
        onChange([...selected, option]);
      }
    } else {
      onChange(selected.includes(option) ? [] : [option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
              isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary/50"
            )}
          >
            {isSelected && <Check className="inline-block w-3.5 h-3.5 mr-1.5" />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

interface RadioSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

function RadioSelect({ options, value, onChange }: RadioSelectProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "px-3 py-2 rounded-lg text-sm font-medium transition-all border text-left",
            value === option.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground border-border hover:border-primary/50"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function PropertyCharacteristicsModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: PropertyCharacteristicsModalProps) {
  const [data, setData] = useState<PropertyCharacteristicsData>(initialData || defaultData);

  useEffect(() => {
    if (initialData) {
      setData({ ...defaultData, ...initialData });
    }
  }, [initialData, open]);

  const handleSave = () => {
    onSave(data);
    onOpenChange(false);
  };

  const handleClear = () => {
    setData(defaultData);
  };

  const updateField = <K extends keyof PropertyCharacteristicsData>(
    field: K,
    value: PropertyCharacteristicsData[K]
  ) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 bg-card">
        <DialogHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Características do imóvel
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-140px)]">
          <div className="px-6 py-2">
            {/* 1. Tipo de Imóvel */}
            <CollapsibleSection 
              title="Tipo de Imóvel" 
              icon={<Building2 className="h-5 w-5" />}
              defaultOpen={true}
            >
              <ChipSelect
                options={propertyTypeOptions}
                selected={data.propertyTypes}
                onChange={(val) => updateField('propertyTypes', val)}
              />
            </CollapsibleSection>

            {/* 2. Tipologia */}
            <CollapsibleSection 
              title="Tipologia" 
              icon={<Home className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Quartos</Label>
                  <RadioSelect
                    options={bedroomOptions}
                    value={data.bedrooms}
                    onChange={(val) => updateField('bedrooms', val)}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Suítes</Label>
                  <RadioSelect
                    options={suiteOptions}
                    value={data.suites}
                    onChange={(val) => updateField('suites', val)}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Idade do Imóvel</Label>
                  <RadioSelect
                    options={propertyAgeOptions}
                    value={data.propertyAge}
                    onChange={(val) => updateField('propertyAge', val)}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* 3. Localização */}
            <CollapsibleSection 
              title="Localização" 
              icon={<MapPin className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">Cidade</Label>
                  <Input
                    value={data.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Digite a cidade"
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">Bairro</Label>
                  <Input
                    value={data.neighborhood}
                    onChange={(e) => updateField('neighborhood', e.target.value)}
                    placeholder="Digite o bairro"
                    className="bg-background"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm text-muted-foreground mb-1.5 block">Endereço completo</Label>
                  <Input
                    value={data.fullAddress}
                    onChange={(e) => updateField('fullAddress', e.target.value)}
                    placeholder="Rua, Avenida..."
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">Número</Label>
                  <Input
                    value={data.number}
                    onChange={(e) => updateField('number', e.target.value)}
                    placeholder="Nº"
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">Complemento</Label>
                  <Input
                    value={data.complement}
                    onChange={(e) => updateField('complement', e.target.value)}
                    placeholder="Bloco, Apto..."
                    className="bg-background"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm text-muted-foreground mb-2 block">Tipo de Complemento</Label>
                  <ChipSelect
                    options={complementTypeOptions}
                    selected={data.complementType ? [data.complementType] : []}
                    onChange={(val) => updateField('complementType', val[0] || '')}
                    multiple={false}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* 4. Valores e Dimensões */}
            <CollapsibleSection 
              title="Valores e Dimensões" 
              icon={<DollarSign className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Valor do Imóvel</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={data.minValue}
                      onChange={(e) => updateField('minValue', e.target.value)}
                      placeholder="Valor mínimo"
                      className="bg-background"
                    />
                    <Input
                      value={data.maxValue}
                      onChange={(e) => updateField('maxValue', e.target.value)}
                      placeholder="Valor máximo"
                      className="bg-background"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Área Interna (m²)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={data.minInternalArea}
                      onChange={(e) => updateField('minInternalArea', e.target.value)}
                      placeholder="Mínima"
                      className="bg-background"
                    />
                    <Input
                      value={data.maxInternalArea}
                      onChange={(e) => updateField('maxInternalArea', e.target.value)}
                      placeholder="Máxima"
                      className="bg-background"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Área do Lote (m²)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={data.minLotArea}
                      onChange={(e) => updateField('minLotArea', e.target.value)}
                      placeholder="Mínima"
                      className="bg-background"
                    />
                    <Input
                      value={data.maxLotArea}
                      onChange={(e) => updateField('maxLotArea', e.target.value)}
                      placeholder="Máxima"
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* 5. Empreendimento e Lançamento */}
            <CollapsibleSection 
              title="Empreendimento e Lançamento" 
              icon={<Rocket className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Tipo de Lançamento</Label>
                  <ChipSelect
                    options={launchTypeOptions}
                    selected={data.launchType}
                    onChange={(val) => updateField('launchType', val)}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Modalidade</Label>
                  <ChipSelect
                    options={modalityOptions}
                    selected={data.modality}
                    onChange={(val) => updateField('modality', val)}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Estágio da Obra</Label>
                  <ChipSelect
                    options={constructionStageOptions}
                    selected={data.constructionStage}
                    onChange={(val) => updateField('constructionStage', val)}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Datas da Obra</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Início</Label>
                      <Input
                        type="date"
                        value={data.constructionStart}
                        onChange={(e) => updateField('constructionStart', e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Término</Label>
                      <Input
                        type="date"
                        value={data.constructionEnd}
                        onChange={(e) => updateField('constructionEnd', e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* 6. Edifício e Condomínio */}
            <CollapsibleSection 
              title="Edifício e Condomínio" 
              icon={<Building className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-1.5 block">Nome do edifício</Label>
                    <Input
                      value={data.buildingName}
                      onChange={(e) => updateField('buildingName', e.target.value)}
                      placeholder="Nome do edifício"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-1.5 block">Nome do condomínio</Label>
                    <Input
                      value={data.condominiumName}
                      onChange={(e) => updateField('condominiumName', e.target.value)}
                      placeholder="Nome do condomínio"
                      className="bg-background"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Quantidade de elevadores</Label>
                  <ChipSelect
                    options={elevatorOptions}
                    selected={data.elevators ? [data.elevators] : []}
                    onChange={(val) => updateField('elevators', val[0] || '')}
                    multiple={false}
                  />
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="doorman"
                      checked={data.has24hDoorman}
                      onCheckedChange={(checked) => updateField('has24hDoorman', !!checked)}
                    />
                    <Label htmlFor="doorman" className="text-sm cursor-pointer">Portaria 24 horas</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="intercom"
                      checked={data.hasIntercom}
                      onCheckedChange={(checked) => updateField('hasIntercom', !!checked)}
                    />
                    <Label htmlFor="intercom" className="text-sm cursor-pointer">Interfone</Label>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* 7. Destinação do Imóvel */}
            <CollapsibleSection 
              title="Destinação do Imóvel" 
              icon={<Home className="h-5 w-5" />}
            >
              <ChipSelect
                options={destinationOptions}
                selected={data.destinations}
                onChange={(val) => updateField('destinations', val)}
              />
            </CollapsibleSection>

            {/* 8. Características Internas */}
            <CollapsibleSection 
              title="Características Internas" 
              icon={<Sofa className="h-5 w-5" />}
            >
              <ChipSelect
                options={internalFeatureOptions}
                selected={data.internalFeatures}
                onChange={(val) => updateField('internalFeatures', val)}
              />
            </CollapsibleSection>

            {/* 9. Lazer e Áreas Comuns */}
            <CollapsibleSection 
              title="Lazer e Áreas Comuns" 
              icon={<Trees className="h-5 w-5" />}
            >
              <ChipSelect
                options={leisureFeatureOptions}
                selected={data.leisureFeatures}
                onChange={(val) => updateField('leisureFeatures', val)}
              />
            </CollapsibleSection>

            {/* 10. Situação Comercial */}
            <CollapsibleSection 
              title="Situação Comercial" 
              icon={<DollarSign className="h-5 w-5" />}
            >
              <ChipSelect
                options={commercialSituationOptions}
                selected={data.commercialSituation}
                onChange={(val) => updateField('commercialSituation', val)}
              />
            </CollapsibleSection>

            {/* 11. Tags de Destaque */}
            <CollapsibleSection 
              title="Tags de Destaque" 
              icon={<Tag className="h-5 w-5" />}
            >
              <ChipSelect
                options={highlightTagOptions}
                selected={data.highlightTags}
                onChange={(val) => updateField('highlightTags', val)}
              />
            </CollapsibleSection>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-card">
          <Button
            variant="ghost"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpar tudo
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
