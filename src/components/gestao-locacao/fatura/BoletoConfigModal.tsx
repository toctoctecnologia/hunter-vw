import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface BoletoConfig {
  banco: string;
  agencia: string;
  conta: string;
  carteira: string;
  nossoNumero: string;
  linhaDigitavel: string;
  tipoBoleto: string;
  instrucoes: string;
  multaPercentual: number;
  jurosPercentual: number;
  descontoPercentual: number;
  dataLimiteDesconto: string;
  statusBanco: string;
  idRemessa: string;
}

interface BoletoConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BoletoConfig;
  onSave: (config: BoletoConfig) => void;
}

const bancosDisponiveis = [
  { value: 'ATL', label: 'Banco Atlântico' },
  { value: 'HOR', label: 'Banco Horizonte' },
  { value: 'AUR', label: 'Banco Aurora' },
  { value: 'SOL', label: 'Banco Sol' },
  { value: 'NTE', label: 'Banco Norte' },
  { value: 'SUL', label: 'Banco Sul' },
];

const tiposBoleto = [
  { value: 'registrado', label: 'Registrado' },
  { value: 'sem_registro', label: 'Sem registro' },
];

const statusBancoOptions = [
  { value: 'nao_enviado', label: 'Não enviado' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'registrado', label: 'Registrado' },
  { value: 'baixado', label: 'Baixado' },
];

export const BoletoConfigModal = ({ isOpen, onClose, config, onSave }: BoletoConfigModalProps) => {
  const [editConfig, setEditConfig] = useState<BoletoConfig>(config);
  const [dataLimiteDesconto, setDataLimiteDesconto] = useState<Date | undefined>(
    config.dataLimiteDesconto ? new Date(config.dataLimiteDesconto.split('/').reverse().join('-')) : undefined
  );

  const handleSave = () => {
    onSave({
      ...editConfig,
      dataLimiteDesconto: dataLimiteDesconto ? format(dataLimiteDesconto, 'dd/MM/yyyy') : '',
    });
    onClose();
  };

  const handleRegenerate = () => {
    // TODO: Implement boleto regeneration via backend
    console.log('Regenerating boleto...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[var(--ui-text)]">
            Configurações do boleto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Campos principais */}
          <div>
            <h4 className="text-sm font-medium text-[var(--ui-text)] mb-4">Dados bancários</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Banco emissor</Label>
                <Select
                  value={editConfig.banco}
                  onValueChange={(value) => setEditConfig(prev => ({ ...prev, banco: value }))}
                >
                  <SelectTrigger className="rounded-xl border-[var(--ui-stroke)] h-10">
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {bancosDisponiveis.map(banco => (
                      <SelectItem key={banco.value} value={banco.value} className="rounded-lg">
                        {banco.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Tipo de boleto</Label>
                <Select
                  value={editConfig.tipoBoleto}
                  onValueChange={(value) => setEditConfig(prev => ({ ...prev, tipoBoleto: value }))}
                >
                  <SelectTrigger className="rounded-xl border-[var(--ui-stroke)] h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {tiposBoleto.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value} className="rounded-lg">
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Agência</Label>
                <Input
                  value={editConfig.agencia}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, agencia: e.target.value }))}
                  placeholder="0000"
                  className="rounded-xl border-[var(--ui-stroke)] h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Conta</Label>
                <Input
                  value={editConfig.conta}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, conta: e.target.value }))}
                  placeholder="00000-0"
                  className="rounded-xl border-[var(--ui-stroke)] h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Carteira / Convênio</Label>
                <Input
                  value={editConfig.carteira}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, carteira: e.target.value }))}
                  placeholder="Ex: 17"
                  className="rounded-xl border-[var(--ui-stroke)] h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Nosso número</Label>
                <Input
                  value={editConfig.nossoNumero}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, nossoNumero: e.target.value }))}
                  placeholder="00000000000"
                  className="rounded-xl border-[var(--ui-stroke)] h-10"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Linha digitável</Label>
                <Input
                  value={editConfig.linhaDigitavel}
                  readOnly
                  className="rounded-xl border-[var(--ui-stroke)] h-10 bg-[var(--ui-stroke)]/20 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Regras de cálculo */}
          <div>
            <h4 className="text-sm font-medium text-[var(--ui-text)] mb-4">Regras de cálculo</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Multa por atraso (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editConfig.multaPercentual}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, multaPercentual: parseFloat(e.target.value) || 0 }))}
                  placeholder="2.00"
                  className="rounded-xl border-[var(--ui-stroke)] h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Juros por atraso (% ao mês)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editConfig.jurosPercentual}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, jurosPercentual: parseFloat(e.target.value) || 0 }))}
                  placeholder="1.00"
                  className="rounded-xl border-[var(--ui-stroke)] h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Desconto por antecipação (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editConfig.descontoPercentual}
                  onChange={(e) => setEditConfig(prev => ({ ...prev, descontoPercentual: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="rounded-xl border-[var(--ui-stroke)] h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Data limite para desconto</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl border-[var(--ui-stroke)] h-10",
                        !dataLimiteDesconto && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataLimiteDesconto ? format(dataLimiteDesconto, "dd/MM/yyyy") : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={dataLimiteDesconto}
                      onSelect={setDataLimiteDesconto}
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          {/* Instruções */}
          <div>
            <h4 className="text-sm font-medium text-[var(--ui-text)] mb-4">Instruções do boleto</h4>
            <Textarea
              value={editConfig.instrucoes}
              onChange={(e) => setEditConfig(prev => ({ ...prev, instrucoes: e.target.value }))}
              placeholder="Ex: Não receber após 30 dias do vencimento. Protestar após 5 dias úteis."
              className="rounded-xl border-[var(--ui-stroke)] min-h-[80px] resize-none"
            />
          </div>

          <Separator />

          {/* Metadados */}
          <div>
            <h4 className="text-sm font-medium text-[var(--ui-text)] mb-4">Metadados</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">Status no banco</Label>
                <Select
                  value={editConfig.statusBanco}
                  onValueChange={(value) => setEditConfig(prev => ({ ...prev, statusBanco: value }))}
                >
                  <SelectTrigger className="rounded-xl border-[var(--ui-stroke)] h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {statusBancoOptions.map(status => (
                      <SelectItem key={status.value} value={status.value} className="rounded-lg">
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[var(--ui-text-subtle)]">ID da remessa / Gateway</Label>
                <Input
                  value={editConfig.idRemessa}
                  readOnly
                  className="rounded-xl border-[var(--ui-stroke)] h-10 bg-[var(--ui-stroke)]/20 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleRegenerate}
            className="rounded-xl border-[var(--ui-stroke)]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regerar boleto
          </Button>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-[var(--ui-stroke)]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] rounded-xl"
            >
              Salvar configurações
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BoletoConfigModal;
