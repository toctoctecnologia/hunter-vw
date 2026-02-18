import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface StatusModalDisponivelProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (meta: any) => void;
}

export function StatusModalDisponivel({ open, onClose, onConfirm }: StatusModalDisponivelProps) {
  const [dataLiberacao, setDataLiberacao] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleConfirm = () => {
    onConfirm({
      tipo: 'vago',
      dataLiberacao,
      observacao
    });
    // Reset form
    setDataLiberacao('');
    setObservacao('');
  };

  const handleClose = () => {
    setDataLiberacao('');
    setObservacao('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-gray-200" aria-describedby={undefined}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Imóvel Disponível
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 rounded-xl"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Data de Liberação */}
          <div className="space-y-2">
            <Label htmlFor="dataLiberacao" className="text-sm font-medium text-gray-700">
              Data de liberação (opcional)
            </Label>
            <Input
              id="dataLiberacao"
              type="datetime-local"
              value={dataLiberacao}
              onChange={(e) => setDataLiberacao(e.target.value)}
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
              placeholder="Informações adicionais..."
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