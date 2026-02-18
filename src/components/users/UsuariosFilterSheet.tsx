import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface UsuariosFilters {
  role: string[];
  status: string[];
  empresa: string[];
  cidade: string[];
  state: string[];
  period: string;
  from?: Date | null;
  to?: Date | null;
  order?: string;
}

export interface UsuariosFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: UsuariosFilters;
  onApply: (value: UsuariosFilters) => void;
  onClear: () => void;
}

const defaultValues: UsuariosFilters = {
  role: [],
  status: [],
  empresa: [],
  cidade: [],
  state: [],
  period: '7',
  from: null,
  to: null,
  order: undefined,
};

const roleOptions = ['admin', 'gestor', 'corretor'];
const statusOptions = ['ativo', 'inativo'];
const empresaOptions = ['Empresa 1', 'Empresa 2', 'Empresa 3'];
const cidadeOptions = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'];
const stateOptions = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];
const periodOptions = [
  { value: '7', label: 'Últimos 7 dias' },
  { value: '15', label: 'Últimos 15 dias' },
  { value: '30', label: 'Últimos 30 dias' },
  { value: '90', label: 'Últimos 90 dias' },
  { value: 'custom', label: 'Personalizado' },
];
const orderOptions = [
  { value: 'nome_asc', label: 'Nome (A-Z)' },
  { value: 'tempo_desc', label: 'Tempo na plataforma' },
  { value: 'nps_desc', label: 'NPS' },
  { value: 'servicos_desc', label: 'Serviços' },
];

export function UsuariosFilterSheet({ open, onOpenChange, value, onApply, onClear }: UsuariosFilterSheetProps) {
  const [local, setLocal] = useState<UsuariosFilters>(value);

  useEffect(() => {
    setLocal(value);
  }, [value, open]);

  const toggleArray = (field: keyof UsuariosFilters, option: string) => {
    setLocal(prev => {
      const arr = prev[field] as string[];
      const exists = arr.includes(option);
      const next = exists ? arr.filter(v => v !== option) : [...arr, option];
      return { ...prev, [field]: next };
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto pr-2">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2">Função</p>
              <div className="space-y-2">
                {roleOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${option}`}
                      checked={local.role.includes(option)}
                      onCheckedChange={() => toggleArray('role', option)}
                    />
                    <Label htmlFor={`role-${option}`} className="text-sm">
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Status</p>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option}`}
                      checked={local.status.includes(option)}
                      onCheckedChange={() => toggleArray('status', option)}
                    />
                    <Label htmlFor={`status-${option}`} className="text-sm">
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Empresa</p>
              <div className="space-y-2">
                {empresaOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`empresa-${option}`}
                      checked={local.empresa.includes(option)}
                      onCheckedChange={() => toggleArray('empresa', option)}
                    />
                    <Label htmlFor={`empresa-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">UF</p>
              <Select
                value={local.state[0]}
                onValueChange={v => setLocal(prev => ({ ...prev, state: [v] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map(uf => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Cidade</p>
              <div className="space-y-2">
                {cidadeOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cidade-${option}`}
                      checked={local.cidade.includes(option)}
                      onCheckedChange={() => toggleArray('cidade', option)}
                    />
                    <Label htmlFor={`cidade-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Período</p>
              <Select
                value={local.period}
                onValueChange={v =>
                  setLocal(prev => ({
                    ...prev,
                    period: v,
                    from: v === 'custom' ? prev.from : null,
                    to: v === 'custom' ? prev.to : null,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {local.period === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">De</p>
                  <DatePickerInput
                    value={local.from ?? null}
                    onChange={date => setLocal(prev => ({ ...prev, from: date }))}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Até</p>
                  <DatePickerInput
                    value={local.to ?? null}
                    onChange={date => setLocal(prev => ({ ...prev, to: date }))}
                  />
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Ordenar</p>
              <Select value={local.order} onValueChange={v => setLocal(prev => ({ ...prev, order: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {orderOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setLocal(defaultValues);
              onClear();
            }}
          >
            Limpar
          </Button>
          <Button
            className="flex-1 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white"
            onClick={() => onApply(local)}
          >
            Aplicar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default UsuariosFilterSheet;

