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
import { FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NovaDimobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NovaDimobModal({ open, onOpenChange }: NovaDimobModalProps) {
  const { toast } = useToast();
  const [anoBase, setAnoBase] = useState('');
  const [intermediador, setIntermediador] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [regime, setRegime] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const handleSubmit = () => {
    if (!anoBase || !intermediador || !responsavel || !regime) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos para gerar a DIMOB.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'DIMOB gerada',
      description: `DIMOB do ano base ${anoBase} gerada com sucesso.`,
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setAnoBase('');
    setIntermediador('');
    setResponsavel('');
    setRegime('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <FileSpreadsheet className="w-5 h-5 text-[hsl(var(--accent))]" />
            Nova DIMOB
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Ano base</Label>
            <Select value={anoBase} onValueChange={setAnoBase}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intermediador">Intermediador (CNPJ/Razão Social)</Label>
            <Input
              id="intermediador"
              placeholder="00.000.000/0000-00 (Nome da Empresa)"
              value={intermediador}
              onChange={(e) => setIntermediador(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input
              id="responsavel"
              placeholder="Nome do responsável"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Regime</Label>
            <Select value={regime} onValueChange={setRegime}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione o regime" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="caixa">Caixa</SelectItem>
                <SelectItem value="competencia">Competência</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-[var(--ui-stroke)]/20 rounded-xl">
            <p className="text-sm text-[var(--ui-text-subtle)]">
              <strong>Importante:</strong> A DIMOB será gerada com base nas operações registradas 
              no sistema durante o ano selecionado. Certifique-se de que todos os contratos e 
              transações estejam devidamente cadastrados.
            </p>
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
            Gerar DIMOB
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
