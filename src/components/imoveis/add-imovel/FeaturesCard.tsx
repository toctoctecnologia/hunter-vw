import { Key } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FormData } from '@/types/formData';

interface FeaturesCardProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export const FeaturesCard = ({ formData, onChange }: FeaturesCardProps) => (
  <div className="bg-white rounded-3xl p-6 border border-orange-200">
    <h3 className="text-lg font-semibold text-black mb-4">Características</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Quartos</Label>
        <Input
          value={formData.bedrooms}
          onChange={(e) => onChange('bedrooms', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Suítes</Label>
        <Input
          value={formData.suites}
          onChange={(e) => onChange('suites', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Banheiros</Label>
        <Input
          value={formData.bathrooms}
          onChange={(e) => onChange('bathrooms', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Vagas</Label>
        <Input
          value={formData.garages}
          onChange={(e) => onChange('garages', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="0"
        />
      </div>
    </div>

    <div className="mt-4 space-y-2">
      <Label className="text-sm font-medium text-black flex items-center gap-2">
        <Key className="w-4 h-4 text-black" />
        Local das Chaves
      </Label>
      <Select onValueChange={(value) => onChange('keyLocation', value)}>
        <SelectTrigger className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white">
          <SelectValue placeholder="Selecione o local" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <SelectItem value="no-local" className="hover:bg-orange-50">No local</SelectItem>
          <SelectItem value="imobiliaria" className="hover:bg-orange-50">Na imobiliária</SelectItem>
          <SelectItem value="proprietario" className="hover:bg-orange-50">Como proprietário</SelectItem>
          <SelectItem value="portaria" className="hover:bg-orange-50">Na portaria</SelectItem>
          <SelectItem value="outro" className="hover:bg-orange-50">Outro</SelectItem>
        </SelectContent>
      </Select>

      {formData.keyLocation === 'outro' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Especifique onde estão as chaves</Label>
          <Input
            value={formData.keyLocationOther}
            onChange={(e) => onChange('keyLocationOther', e.target.value)}
            className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
            placeholder="Descreva onde estão as chaves..."
          />
        </div>
      )}
    </div>
  </div>
);

