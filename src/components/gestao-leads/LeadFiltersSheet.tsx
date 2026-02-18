import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export type LeadFilters = {
  month: string;
  year: string;
  periodOption: string;
  unit: string;
  equipe: string;
  funilTipo: string;
  funil: string;
  finalidade: string;
  campanha: string;
  termometro: string;
  faseAtendimento: string;
  midiaOrigem: string;
  corretor: string;
};

export const LEAD_FILTER_DEFAULTS: LeadFilters = {
  month: '12',
  year: '2025',
  periodOption: 'indicadores',
  unit: 'todas',
  equipe: 'todas',
  funilTipo: 'operacional',
  funil: 'todos',
  finalidade: 'todas',
  campanha: 'todas',
  termometro: 'todos',
  faseAtendimento: 'todas',
  midiaOrigem: 'todas',
  corretor: 'todos',
};

const MONTHS = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const YEARS = [
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
];

const PERIOD_OPTIONS = [
  { value: 'indicadores', label: 'Aplicar período somente nos indicadores dos funis' },
  { value: 'todos', label: 'Aplicar em todos os dados' },
];

const UNITS = [
  { value: 'todas', label: 'Todas' },
  { value: 'matriz', label: 'Matriz' },
  { value: 'filial-1', label: 'Filial 1' },
  { value: 'filial-2', label: 'Filial 2' },
];

const EQUIPES = [
  { value: 'todas', label: 'Todas' },
  { value: 'vendas', label: 'Vendas' },
  { value: 'locacao', label: 'Locação' },
  { value: 'captacao', label: 'Captação' },
];

const FUNIL_TIPOS = [
  { value: 'operacional', label: 'Funil operacional' },
  { value: 'financeiro', label: 'Funil financeiro' },
  { value: 'contabil', label: 'Funil contábil' },
];

const FUNIL_ETAPAS = [
  { value: 'todos', label: 'Todas as etapas' },
  { value: 'pre-atendimento', label: 'Pré-atendimento' },
  { value: 'em-atendimento', label: 'Em atendimento' },
  { value: 'agendamento', label: 'Agendamento' },
  { value: 'visita', label: 'Visita' },
  { value: 'proposta-enviada', label: 'Proposta enviada' },
  { value: 'negocio-fechado', label: 'Negócio fechado' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'receita-gerada', label: 'Receita gerada' },
  { value: 'pos-venda', label: 'Pós-venda' },
];

const CORRETORES = [
  { value: 'todos', label: 'Selecione um corretor' },
  { value: 'aline', label: 'Aline de Fatima Fernandes Martins' },
  { value: 'brayann', label: 'Brayann Germano' },
  { value: 'amanda', label: 'Amanda Aylon' },
  { value: 'ana', label: 'Ana Zauer' },
  { value: 'marcia', label: 'Marcia Camargo' },
  { value: 'pedro', label: 'Pedro Santos' },
];

const FINALIDADES = [
  { value: 'todas', label: 'Todas' },
  { value: 'venda', label: 'Venda' },
  { value: 'locacao', label: 'Locação' },
  { value: 'shortstay', label: 'Short Stay' },
];

const CAMPANHAS = [
  { value: 'todas', label: 'Todas' },
  { value: 'central-tower', label: 'Central Tower' },
  { value: 'grande-oportunidade', label: 'Grande oportunidade' },
  { value: 'black-friday', label: 'Black Friday' },
];

const TERMOMETROS = [
  { value: 'todos', label: 'Todos' },
  { value: 'frio', label: 'Frio' },
  { value: 'morno', label: 'Morno' },
  { value: 'quente', label: 'Quente' },
];

const FASES_ATENDIMENTO = [
  { value: 'todas', label: 'Todas' },
  { value: 'em-atendimento', label: 'Em atendimento' },
  { value: 'visita', label: 'Visita' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'negocio-fechado', label: 'Negócio fechado' },
  { value: 'descartado', label: 'Descartado' },
];

const MIDIAS_ORIGEM = [
  { value: 'todas', label: 'Todas' },
  { value: 'instagram-leads', label: 'Instagram Leads' },
  { value: 'google-ads', label: 'Google Ads' },
  { value: 'abordagem-direta', label: 'Abordagem direta' },
  { value: 'indicacao', label: 'Indicação' },
];

interface LeadFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: LeadFilters;
  onApply: (filters: LeadFilters) => void;
}

export function LeadFiltersSheet({ open, onOpenChange, filters, onApply }: LeadFiltersSheetProps) {
  const [localFilters, setLocalFilters] = useState<LeadFilters>(filters);

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [filters, open]);

  const handleUpdate = (key: keyof LeadFilters, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl bg-white">
        <SheetHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-[#FF5506]">
            <Filter className="w-5 h-5" />
            <SheetTitle className="text-lg">Filtros</SheetTitle>
          </div>
          <SheetDescription className="text-sm text-muted-foreground">
            Ajuste o período e refine os resultados do funil de leads.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Mês</Label>
              <Select value={localFilters.month} onValueChange={(value) => handleUpdate('month', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Ano</Label>
              <Select value={localFilters.year} onValueChange={(value) => handleUpdate('year', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <Label className="text-xs text-muted-foreground">Opção período</Label>
              <Select
                value={localFilters.periodOption}
                onValueChange={(value) => handleUpdate('periodOption', value)}
              >
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Unidade</Label>
              <Select value={localFilters.unit} onValueChange={(value) => handleUpdate('unit', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Equipe</Label>
              <Select value={localFilters.equipe} onValueChange={(value) => handleUpdate('equipe', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EQUIPES.map((team) => (
                    <SelectItem key={team.value} value={team.value}>
                      {team.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Tipo de funil</Label>
              <Select value={localFilters.funilTipo} onValueChange={(value) => handleUpdate('funilTipo', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUNIL_TIPOS.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Campanha</Label>
              <Select value={localFilters.campanha} onValueChange={(value) => handleUpdate('campanha', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAMPANHAS.map((campaign) => (
                    <SelectItem key={campaign.value} value={campaign.value}>
                      {campaign.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Finalidade</Label>
              <Select value={localFilters.finalidade} onValueChange={(value) => handleUpdate('finalidade', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FINALIDADES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Etapa do funil</Label>
              <Select value={localFilters.funil} onValueChange={(value) => handleUpdate('funil', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUNIL_ETAPAS.map((funnel) => (
                    <SelectItem key={funnel.value} value={funnel.value}>
                      {funnel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Fase de atendimento</Label>
              <Select
                value={localFilters.faseAtendimento}
                onValueChange={(value) => handleUpdate('faseAtendimento', value)}
              >
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FASES_ATENDIMENTO.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Termômetro</Label>
              <Select value={localFilters.termometro} onValueChange={(value) => handleUpdate('termometro', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TERMOMETROS.map((heat) => (
                    <SelectItem key={heat.value} value={heat.value}>
                      {heat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Mídia de origem</Label>
              <Select value={localFilters.midiaOrigem} onValueChange={(value) => handleUpdate('midiaOrigem', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MIDIAS_ORIGEM.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs text-muted-foreground">Corretores</Label>
              <Select value={localFilters.corretor} onValueChange={(value) => handleUpdate('corretor', value)}>
                <SelectTrigger className="h-9 rounded-lg border-border">
                  <SelectValue placeholder="Selecione um corretor" />
                </SelectTrigger>
                <SelectContent>
                  {CORRETORES.map((agent) => (
                    <SelectItem key={agent.value} value={agent.value}>
                      {agent.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex md:justify-end md:col-span-1">
              <Button
                className="w-full md:w-auto bg-[#FF5506] hover:bg-[#E04D05] text-white h-9 px-6 rounded-lg"
                onClick={handleApply}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}
