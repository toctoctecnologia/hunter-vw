import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, Search, Check, Filter, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface PropertyFilters {
  codigo: string;
  situacoes: string[];
  disponibilidades: string[];
  equipes: string[];
  origens: string[];
  proposalStatus: string[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export const SITUACAO_OPTIONS = [
  { value: 'em_captacao', label: 'Em captação' },
  { value: 'preparacao', label: 'Em preparação' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'em_negociacao', label: 'Em negociação' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'retirado', label: 'Retirado' }
];

export const DISPONIBILIDADE_OPTIONS = [
  { value: 'disponivel_site', label: 'Disponível no site' },
  { value: 'disponivel_interno', label: 'Disponível interno' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'indisponivel', label: 'Indisponível' }
];

export const PROPOSAL_STATUS_OPTIONS = [
  { value: 'com_proposta', label: 'Com proposta ativa' },
  { value: 'em_negociacao', label: 'Em negociação' }
];

interface PropertyFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  onApplyFilters: (filters: PropertyFilters) => void;
  availableEquipes: string[];
  availableOrigens: string[];
  resultsCount: number;
}

type FilterSection = 'situacao' | 'disponibilidade' | 'equipe' | 'origem' | 'proposta' | 'periodo' | null;

export function PropertyFilterModal({
  isOpen,
  onClose,
  filters: externalFilters,
  onApplyFilters,
  availableEquipes,
  availableOrigens,
  resultsCount
}: PropertyFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(externalFilters);
  const [activeSection, setActiveSection] = useState<FilterSection>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(externalFilters);
      setActiveSection(null);
      setSearchQuery('');
    }
  }, [isOpen, externalFilters]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const toggleArrayFilter = useCallback((
    key: keyof Pick<PropertyFilters, 'situacoes' | 'disponibilidades' | 'equipes' | 'origens' | 'proposalStatus'>,
    value: string
  ) => {
    setLocalFilters(prev => {
      const current = prev[key] as string[];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setLocalFilters({
      codigo: '',
      situacoes: [],
      disponibilidades: [],
      equipes: [],
      origens: [],
      proposalStatus: [],
      dateRange: undefined
    });
    setSearchQuery('');
  }, []);

  const handleApply = useCallback(() => {
    onApplyFilters({ ...localFilters, codigo: searchQuery });
    onClose();
  }, [localFilters, searchQuery, onApplyFilters, onClose]);

  const activeFiltersCount = useMemo(() => {
    return (
      localFilters.situacoes.length +
      localFilters.disponibilidades.length +
      localFilters.equipes.length +
      localFilters.origens.length +
      localFilters.proposalStatus.length +
      (localFilters.dateRange?.from || localFilters.dateRange?.to ? 1 : 0) +
      (searchQuery ? 1 : 0)
    );
  }, [localFilters, searchQuery]);

  const renderFilterSection = (
    title: string,
    sectionKey: FilterSection,
    options: Array<{ value: string; label: string }>,
    filterKey: keyof Pick<PropertyFilters, 'situacoes' | 'disponibilidades' | 'equipes' | 'origens' | 'proposalStatus'>
  ) => {
    const isActive = activeSection === sectionKey;
    const selectedCount = (localFilters[filterKey] as string[]).length;

    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <button
          type="button"
          onClick={() => setActiveSection(isActive ? null : sectionKey)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
            isActive ? 'bg-orange-50' : 'hover:bg-gray-50'
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{title}</span>
            {selectedCount > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                {selectedCount}
              </Badge>
            )}
          </div>
          <svg
            className={cn(
              'h-4 w-4 text-gray-500 transition-transform',
              isActive && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isActive && (
          <div className="px-4 pb-4 space-y-2">
            {options.map(option => {
              const isSelected = (localFilters[filterKey] as string[]).includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleArrayFilter(filterKey, option.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isSelected
                      ? 'bg-orange-100 text-orange-800 font-medium'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
            {(localFilters[filterKey] as string[]).length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-orange-700 hover:text-orange-800 hover:bg-orange-50 mt-2"
                onClick={() => setLocalFilters(prev => ({ ...prev, [filterKey]: [] }))}
              >
                Limpar {title.toLowerCase()}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Filter className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Filtrar imóveis
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  {resultsCount} imóvel(is) encontrado(s)
                </DialogDescription>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por código, título, endereço, bairro..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 max-h-[50vh]">
          <div className="divide-y divide-gray-100">
            {renderFilterSection(
              'Equipe',
              'equipe',
              availableEquipes.map(e => ({ value: e, label: e })),
              'equipes'
            )}
            {renderFilterSection('Status da Proposta', 'proposta', PROPOSAL_STATUS_OPTIONS, 'proposalStatus')}

            {/* Date Range Section */}
            <div className="border-b border-gray-100 last:border-b-0">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'periodo' ? null : 'periodo')}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
                  activeSection === 'periodo' ? 'bg-orange-50' : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">Período de captação</span>
                  {(localFilters.dateRange?.from || localFilters.dateRange?.to) && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                      1
                    </Badge>
                  )}
                </div>
                <svg
                  className={cn(
                    'h-4 w-4 text-gray-500 transition-transform',
                    activeSection === 'periodo' && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeSection === 'periodo' && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {localFilters.dateRange?.from
                            ? format(localFilters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                            : "Data inicial"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={localFilters.dateRange?.from}
                          onSelect={date =>
                            setLocalFilters(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, from: date }
                            }))
                          }
                          className="pointer-events-auto"
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {localFilters.dateRange?.to
                            ? format(localFilters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })
                            : "Data final"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={localFilters.dateRange?.to}
                          onSelect={date =>
                            setLocalFilters(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, to: date }
                            }))
                          }
                          className="pointer-events-auto"
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {(localFilters.dateRange?.from || localFilters.dateRange?.to) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full text-orange-700 hover:text-orange-800 hover:bg-orange-50"
                      onClick={() => setLocalFilters(prev => ({ ...prev, dateRange: undefined }))}
                    >
                      Limpar período
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between w-full gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={clearAllFilters}
              disabled={activeFiltersCount === 0}
              className="text-gray-600 hover:text-gray-800"
            >
              Limpar todos ({activeFiltersCount})
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleApply}
                className="bg-orange-600 hover:bg-orange-500 text-white"
              >
                Aplicar filtros
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PropertyFilterModal;
