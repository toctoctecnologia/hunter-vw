import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { FormData } from '@/types/formData';

interface OwnerCardProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export const OwnerCard = ({ formData, onChange }: OwnerCardProps) => (
  <div className="bg-white rounded-3xl p-6 border border-orange-200">
    <h3 className="text-lg font-semibold text-black mb-4">Informações do Proprietário</h3>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Nome completo do proprietário</Label>
        <Input
          value={formData.ownerName}
          onChange={(e) => onChange('ownerName', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="Nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Telefone do proprietário</Label>
        <Input
          value={formData.ownerPhone}
          onChange={(e) => onChange('ownerPhone', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="(11) 99999-9999"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Captador(a)</Label>
        <Input
          value={formData.capturer}
          onChange={(e) => onChange('capturer', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="Nome do captador"
        />
      </div>
    </div>
  </div>
);

