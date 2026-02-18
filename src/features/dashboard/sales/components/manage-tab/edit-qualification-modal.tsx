import { useState } from 'react';
import { Settings } from 'lucide-react';

import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { removeNonNumeric } from '@/shared/lib/masks';

interface EditQualificationModalProps {
  open: boolean;
  onClose: () => void;
  recentMaxDays: number;
  attentionMaxDays: number;
  onSave: (recentMaxDays: number, attentionMaxDays: number) => void;
}

export function EditQualificationModal({ open, onClose, recentMaxDays, attentionMaxDays, onSave }: EditQualificationModalProps) {
  const [recentDays, setRecentDays] = useState(recentMaxDays.toString());
  const [attentionDays, setAttentionDays] = useState(attentionMaxDays.toString());

  const handleSave = () => {
    const recent = parseInt(recentDays);
    const attention = parseInt(attentionDays);

    if (isNaN(recent) || isNaN(attention)) {
      return;
    }

    if (recent >= attention) {
      alert('O limite de dias "Recente" deve ser menor que "Atenção"');
      return;
    }

    if (recent < 1 || attention < 1) {
      alert('Os valores devem ser maiores que zero');
      return;
    }

    onSave(recent, attention);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Configurar Qualificação por Tempo"
      description="Defina os limites de dias para cada categoria de qualificação"
    >
      <div className="space-y-4">
        {/* Recente */}
        <div className="space-y-2">
          <Label htmlFor="recentDays">Dias para categoria &ldquo;Recente&rdquo;</Label>
          <Input
            id="recentDays"
            value={recentDays}
            onChange={(e) => setRecentDays(removeNonNumeric(e.target.value))}
            placeholder="Ex: 25"
          />
          <p className="text-xs text-muted-foreground">Leads com até este número de dias de contato</p>
        </div>

        {/* Atenção */}
        <div className="space-y-2">
          <Label htmlFor="attentionDays">Dias para categoria &ldquo;Atenção&rdquo;</Label>
          <Input
            id="attentionDays"
            value={attentionDays}
            onChange={(e) => setAttentionDays(removeNonNumeric(e.target.value))}
            placeholder="Ex: 30"
          />
          <p className="text-xs text-muted-foreground">Leads com mais de {recentDays || '?'} dias até este limite</p>
        </div>

        {/* Preview Urgente */}
        <div className="rounded-lg border border-border bg-muted/50 p-3">
          <p className="text-sm font-semibold mb-1">Categoria &ldquo;Urgente&rdquo;</p>
          <p className="text-xs text-muted-foreground">
            Leads com mais de {attentionDays || '?'} dias de contato (calculado automaticamente)
          </p>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Settings className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </Modal>
  );
}
