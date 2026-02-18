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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface NovaFaturaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NovaFaturaModal({ open, onOpenChange }: NovaFaturaModalProps) {
  const { toast } = useToast();
  const [competencia, setCompetencia] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState<Date | undefined>();
  const [formaPagamento, setFormaPagamento] = useState('');

  const handleSubmit = () => {
    if (!competencia || !valor || !vencimento || !formaPagamento) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos para criar o boleto.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Boleto criado',
      description: `Boleto de ${competencia} criado com sucesso.`,
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setCompetencia('');
    setValor('');
    setVencimento(undefined);
    setFormaPagamento('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Receipt className="w-5 h-5 text-[hsl(var(--accent))]" />
            Novo boleto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="competencia">Competência</Label>
              <Select value={competencia} onValueChange={setCompetencia}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nov/2024">Nov/2024</SelectItem>
                  <SelectItem value="dez/2024">Dez/2024</SelectItem>
                  <SelectItem value="jan/2025">Jan/2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                placeholder="R$ 0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal rounded-xl',
                      !vencimento && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {vencimento ? format(vencimento, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={vencimento}
                    onSelect={setVencimento}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Forma de pagamento</Label>
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="cartao">Cartão de crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
          >
            Criar boleto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
