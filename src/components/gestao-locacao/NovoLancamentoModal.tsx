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
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface NovoLancamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NovoLancamentoModal({ open, onOpenChange }: NovoLancamentoModalProps) {
  const { toast } = useToast();
  const [categoria, setCategoria] = useState('');
  const [debitoDe, setDebitoDe] = useState('');
  const [creditoPara, setCreditoPara] = useState('');
  const [valor, setValor] = useState('');
  const [competencia, setCompetencia] = useState('');
  const [vencimento, setVencimento] = useState<Date | undefined>();
  const [recorrente, setRecorrente] = useState(false);
  const [recorrencia, setRecorrencia] = useState('');

  const handleSubmit = () => {
    if (!categoria || !debitoDe || !creditoPara || !valor || !competencia || !vencimento) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos para criar o lançamento.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Lançamento criado',
      description: `Lançamento de ${categoria} criado com sucesso.`,
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setCategoria('');
    setDebitoDe('');
    setCreditoPara('');
    setValor('');
    setCompetencia('');
    setVencimento(undefined);
    setRecorrente(false);
    setRecorrencia('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Wallet className="w-5 h-5 text-[hsl(var(--accent))]" />
            Novo Lançamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluguel">Aluguel</SelectItem>
                <SelectItem value="condominio">Condomínio</SelectItem>
                <SelectItem value="iptu">IPTU</SelectItem>
                <SelectItem value="agua">Água</SelectItem>
                <SelectItem value="luz">Luz</SelectItem>
                <SelectItem value="gas">Gás</SelectItem>
                <SelectItem value="seguro">Seguro</SelectItem>
                <SelectItem value="taxa-adm">Taxa de administração</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Débito de</Label>
              <Select value={debitoDe} onValueChange={setDebitoDe}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="locatario">Locatário</SelectItem>
                  <SelectItem value="locador">Locador</SelectItem>
                  <SelectItem value="imobiliaria">Imobiliária</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Crédito para</Label>
              <Select value={creditoPara} onValueChange={setCreditoPara}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="locador">Locador</SelectItem>
                  <SelectItem value="imobiliaria">Imobiliária</SelectItem>
                  <SelectItem value="condominio">Condomínio</SelectItem>
                  <SelectItem value="prefeitura">Prefeitura</SelectItem>
                  <SelectItem value="concessionaria">Concessionária</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label>Competência</Label>
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
          </div>

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
                  {vencimento ? format(vencimento, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione a data'}
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recorrente"
              checked={recorrente}
              onCheckedChange={(checked) => setRecorrente(checked as boolean)}
            />
            <Label htmlFor="recorrente" className="text-sm font-normal cursor-pointer">
              Lançamento recorrente
            </Label>
          </div>

          {recorrente && (
            <div className="space-y-2">
              <Label>Recorrência</Label>
              <Select value={recorrencia} onValueChange={setRecorrencia}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione a recorrência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="bimestral">Bimestral</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
          >
            Criar lançamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
