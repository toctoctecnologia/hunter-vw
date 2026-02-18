import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Repasse {
  id: string;
  locador: string;
  imovel: string;
  valorBruto: string;
  taxaAdm?: string;
  comissao?: string;
  valorLiquido: string;
  competencia: string;
  status: string;
}

interface ProcessarRepassesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repasses: Repasse[];
  onConfirm: (data: { dataRepasse: Date; metodo: string }) => void;
}

export function ProcessarRepassesModal({
  open,
  onOpenChange,
  repasses,
  onConfirm,
}: ProcessarRepassesModalProps) {
  const [dataRepasse, setDataRepasse] = useState<Date | undefined>(new Date());
  const [metodo, setMetodo] = useState('conta_digital');

  // Calculate totals
  const parseCurrency = (value: string): number => {
    return parseFloat(value.replace('R$ ', '').replace('.', '').replace(',', '.')) || 0;
  };

  const totalBruto = repasses.reduce((acc, r) => acc + parseCurrency(r.valorBruto), 0);
  const totalTaxaAdm = repasses.reduce((acc, r) => acc + parseCurrency(r.taxaAdm ?? r.comissao ?? 'R$ 0,00'), 0);
  const totalLiquido = repasses.reduce((acc, r) => acc + parseCurrency(r.valorLiquido), 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleConfirm = () => {
    if (dataRepasse) {
      onConfirm({ dataRepasse, metodo });
    }
  };

  if (repasses.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[var(--ui-text)]">
              <AlertCircle className="w-5 h-5 text-[hsl(var(--warning))]" />
              Nenhuma transferência selecionada
            </DialogTitle>
            <DialogDescription className="text-[var(--ui-text-subtle)]">
              Selecione pelo menos uma transferência na tabela antes de processar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
            >
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--ui-text)]">
            <Send className="w-5 h-5 text-[hsl(var(--accent))]" />
            Processar transferências
          </DialogTitle>
          <DialogDescription className="text-[var(--ui-text-subtle)]">
            Confirme os dados para processar as transferências selecionadas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Summary */}
          <div className="bg-[var(--ui-stroke)]/20 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--ui-text-subtle)]">Transferências selecionadas</span>
              <span className="font-semibold text-[var(--ui-text)]">{repasses.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--ui-text-subtle)]">Total bruto</span>
              <span className="font-medium text-[var(--ui-text)]">{formatCurrency(totalBruto)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--ui-text-subtle)]">Taxa de administração</span>
              <span className="font-medium text-[hsl(var(--danger))]">{formatCurrency(totalTaxaAdm)}</span>
            </div>
            <div className="border-t border-[var(--ui-stroke)] pt-3 flex justify-between items-center">
              <span className="font-medium text-[var(--ui-text)]">Total líquido a transferir</span>
              <span className="text-lg font-bold text-[hsl(var(--success))]">{formatCurrency(totalLiquido)}</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Data da transferência</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full h-11 rounded-xl border-[var(--ui-stroke)] justify-start text-left font-normal',
                      !dataRepasse && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataRepasse ? format(dataRepasse, "dd/MM/yyyy", { locale: ptBR }) : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={dataRepasse}
                    onSelect={setDataRepasse}
                    initialFocus
                    className="pointer-events-auto"
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Método de transferência</Label>
              <Select value={metodo} onValueChange={setMetodo}>
                <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="conta_digital">Conta digital Hunter</SelectItem>
                  <SelectItem value="ted">Transferência bancária (TED)</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="manual">Transferência manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Alert className="rounded-xl border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.12)]">
            <AlertCircle className="h-4 w-4 text-[hsl(var(--warning))]" />
            <AlertDescription className="text-[hsl(var(--textSecondary))] text-sm">
              Ao confirmar, as transferências serão marcadas como "Processando" e enviadas para o sistema financeiro.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-[var(--ui-stroke)]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
            disabled={!dataRepasse}
          >
            Confirmar processamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProcessarRepassesModal;
