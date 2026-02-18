import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditHorarioModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (horarios: { inicio: string; fim: string }) => void;
  dia: string;
  horariosAtuais: { inicio: string; fim: string };
}

export function EditHorarioModal({ 
  open, 
  onClose, 
  onConfirm, 
  dia, 
  horariosAtuais 
}: EditHorarioModalProps) {
  const [inicio, setInicio] = useState(horariosAtuais.inicio);
  const [fim, setFim] = useState(horariosAtuais.fim);

  const handleConfirm = () => {
    onConfirm({ inicio, fim });
    onClose();
  };

  const handleClose = () => {
    setInicio(horariosAtuais.inicio);
    setFim(horariosAtuais.fim);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-gray-200" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Editar horários - {dia}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Horário de início */}
          <div className="space-y-2">
            <Label htmlFor="inicio" className="text-sm font-medium text-gray-700">
              Horário de início
            </Label>
            <Input
              id="inicio"
              type="time"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-[hsl(var(--accent))]"
            />
          </div>

          {/* Horário de fim */}
          <div className="space-y-2">
            <Label htmlFor="fim" className="text-sm font-medium text-gray-700">
              Horário de término
            </Label>
            <Input
              id="fim"
              type="time"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-[hsl(var(--accent))]"
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
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}