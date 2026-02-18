import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DistribuicaoSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  filterPreset?: 'filas' | 'cadencias';
  filters?: Record<string, string | undefined>;
  onFiltersChange?: (filters: Record<string, string | undefined>) => void;
}

export default function DistribuicaoSearchBar({ 
  value, 
  onChange,
  placeholder = "Buscar filas por nome, equipe, regra ou usuário...",
  filterPreset = 'filas',
  filters,
  onFiltersChange,
}: DistribuicaoSearchBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [internalFilters, setInternalFilters] = useState<Record<string, string>>({
    status: '',
    tipo: '',
    gatilho: '',
    responsavel: '',
    canal: '',
    sla: '',
  });

  const activeFilters = filters ?? internalFilters;

  const hasFilters = Object.values(activeFilters).some((value) => value);

  const clearFilters = () => {
    const cleared = {
      status: '',
      tipo: '',
      gatilho: '',
      responsavel: '',
      canal: '',
      sla: '',
    };
    if (filters && onFiltersChange) {
      onFiltersChange(cleared);
    } else {
      setInternalFilters(cleared);
    }
  };

  const updateFilter = (key: string, val: string) => {
    const updated = { ...activeFilters, [key]: val };
    if (filters && onFiltersChange) {
      onFiltersChange(updated);
    } else {
      setInternalFilters(updated);
    }
  };

  const isCadenciaPreset = filterPreset === 'cadencias';

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-11 pr-4 h-12 rounded-xl border-border bg-card text-sm shadow-sm focus-visible:ring-primary/20"
        />
      </div>
      
      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className={`
              h-12 w-12 rounded-xl border-border shrink-0 transition-colors
              ${hasFilters ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-card'}
            `}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[320px] sm:w-[400px]">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-lg font-semibold">Filtros</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select 
                value={activeFilters.status} 
                onValueChange={(val) => updateFilter('status', val)}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-popover">
                  <SelectItem value="ativa">Ativas</SelectItem>
                  <SelectItem value="pausada">Pausadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {isCadenciaPreset ? 'Evento de disparo' : 'Tipo de fila'}
              </Label>
              {isCadenciaPreset ? (
                <Select value={activeFilters.gatilho} onValueChange={(val) => updateFilter('gatilho', val)}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Todos os eventos" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-popover">
                    <SelectItem value="novo-lead">Novo lead</SelectItem>
                    <SelectItem value="mudanca-etapa">Mudança de etapa</SelectItem>
                    <SelectItem value="negocio-fechado">Negócio fechado</SelectItem>
                    <SelectItem value="sem-resposta">Sem resposta</SelectItem>
                    <SelectItem value="lead-sem-atividade">Lead sem atividade</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select 
                  value={activeFilters.tipo} 
                  onValueChange={(val) => updateFilter('tipo', val)}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-popover">
                    <SelectItem value="personalizada">Personalizada</SelectItem>
                    <SelectItem value="padrao">Padrão</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {isCadenciaPreset && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Responsável</Label>
                  <Select value={activeFilters.responsavel} onValueChange={(val) => updateFilter('responsavel', val)}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Qualquer responsável" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-popover">
                      <SelectItem value="Equipe Digital">Equipe Digital</SelectItem>
                      <SelectItem value="Sucesso do Cliente">Sucesso do Cliente</SelectItem>
                      <SelectItem value="Time Plantão">Time Plantão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Canal</Label>
                  <Select value={activeFilters.canal} onValueChange={(val) => updateFilter('canal', val)}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Todos os canais" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-popover">
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Ligação">Ligação</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">SLA</Label>
                  <Select value={activeFilters.sla} onValueChange={(val) => updateFilter('sla', val)}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Todos os SLAs" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-popover">
                      <SelectItem value="Retorno em até 2h">Retorno em até 2h</SelectItem>
                      <SelectItem value="Retorno em 24h">Retorno em 24h</SelectItem>
                      <SelectItem value="Retorno em 48h">Retorno em 48h</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {hasFilters && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="w-full rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
