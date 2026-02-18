import { Ruler } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { FormData } from '@/types/formData';

interface DimensionsCardProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export const DimensionsCard = ({ formData, onChange }: DimensionsCardProps) => (
  <div className="bg-white rounded-3xl p-6 border border-orange-200">
    <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
      <Ruler className="w-5 h-5 text-black" />
      Dimensões
    </h3>
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Área Interna</Label>
        <Input
          value={formData.internalArea}
          onChange={(e) => onChange('internalArea', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="m²"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Área Externa</Label>
        <Input
          value={formData.externalArea}
          onChange={(e) => onChange('externalArea', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="m²"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Área do Lote</Label>
        <Input
          value={formData.lotArea}
          onChange={(e) => onChange('lotArea', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="m²"
        />
      </div>
    </div>
  </div>
);

