import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { parseISO } from 'date-fns';
import { ymdLocal } from '@/lib/datetime';
import { X } from 'lucide-react';

interface StatusModalIndisponivelProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (meta: any) => void;
}

// Motivos baseados no print 2
const motivosIndisponibilidade = [
  { codigo: '10', descricao: 'Vendido por outro corretor ou direto com a construtora (só vale para imóveis de construtoras)' },
  { codigo: '15', descricao: 'Vendido por outra imobiliária ou direto com o proprietário (só vale para imóveis agenciados)' },
  { codigo: '20', descricao: 'Desistiu de vender' },
  { codigo: '25', descricao: 'Desativado por opção da imobiliária (preço fora do mercado, documentação, sem fotos etc)' },
  { codigo: '30', descricao: 'Outros' },
  { codigo: '35', descricao: 'Cliente alugou o imóvel' },
  { codigo: '40', descricao: 'Cliente vai usar ou emprestar o imóvel' },
  { codigo: '45', descricao: 'Dificuldade ou falta de acesso ao imóvel' },
  { codigo: '5', descricao: 'Corretor saiu' },
  { codigo: '50', descricao: 'Dificuldade ou falta de comunicação com o proprietário' },
  { codigo: '55', descricao: 'Cliente insatisfeito com a imobiliária/corretor' },
  { codigo: '60', descricao: 'O imóvel esta fora do nosso nicho de atuação' },
  { codigo: '65', descricao: 'O imóvel ficou exclusivo com outra imobiliária' },
  { codigo: '7', descricao: 'O imóvel ficou com a construtora.' },
  { codigo: '70', descricao: 'Imóvel duplicado, criado para teste, avanço de funil ou criado errado' },
  { codigo: '75', descricao: 'Vendido pela Felicità Imóveis' },
  { codigo: '80', descricao: 'Proprietário desrespeitoso/arrogante/antiético' }
];

export function StatusModalIndisponivel({ open, onClose, onConfirm }: StatusModalIndisponivelProps) {
  const [motivoSelecionado, setMotivoSelecionado] = useState('');
  const [prazoEstimado, setPrazoEstimado] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleConfirm = () => {
    const motivoObj = motivosIndisponibilidade.find(m => m.codigo === motivoSelecionado);
    onConfirm({
      tipo: 'indisponivel',
      motivo: motivoObj?.descricao || '',
      codigoMotivo: motivoSelecionado,
      prazoEstimado,
      observacao
    });
    // Reset form
    setMotivoSelecionado('');
    setPrazoEstimado('');
    setObservacao('');
  };

  const handleClose = () => {
    setMotivoSelecionado('');
    setPrazoEstimado('');
    setObservacao('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-gray-200" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Imóvel Indisponível
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo" className="text-sm font-medium text-gray-700">
              Motivo da indisponibilidade
            </Label>
            <Select value={motivoSelecionado} onValueChange={setMotivoSelecionado}>
              <SelectTrigger className="rounded-xl border-gray-200 focus:border-[hsl(var(--accent))]">
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white border border-gray-200 rounded-xl shadow-lg">
                {motivosIndisponibilidade.map((motivo) => (
                  <SelectItem key={motivo.codigo} value={motivo.codigo}>
                    <span className="text-sm">
                      <span className="font-medium">{motivo.codigo}.</span> {motivo.descricao}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prazo Estimado */}
          <div className="space-y-2">
            <Label htmlFor="prazo" className="text-sm font-medium text-gray-700">
              Prazo estimado (opcional)
            </Label>
            <DatePickerInput
              value={prazoEstimado ? parseISO(prazoEstimado) : null}
              onChange={(d) => setPrazoEstimado(d ? ymdLocal(d) : '')}
              className="rounded-xl border-gray-200 focus:border-[hsl(var(--accent))]"
            />
          </div>

          {/* Observação */}
          <div className="space-y-2">
            <Label htmlFor="observacao" className="text-sm font-medium text-gray-700">
              Observação (opcional)
            </Label>
            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Detalhes adicionais..."
              className="rounded-xl border-gray-200 focus:border-[hsl(var(--accent))]"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl border-gray-200"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!motivoSelecionado}
              className="flex-1 bg-[hsl(var(--accent))] text-white rounded-xl hover:bg-[hsl(var(--accentHover))]"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}