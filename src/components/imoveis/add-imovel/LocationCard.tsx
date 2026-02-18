import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { FormData } from '@/types/formData';

interface LocationCardProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export const LocationCard = ({ formData, onChange }: LocationCardProps) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
    <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
      <MapPin className="w-5 h-5 text-orange-500" />
      Localização
    </h3>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Nome do Imóvel</Label>
        <Input
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="h-12 rounded-xl border-gray-200 focus:border-orange-500 bg-gray-50 hover:bg-white transition-colors"
          placeholder="Ex: Casa Luxo com Piscina"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Endereço Completo</Label>
        <Input
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          className="h-12 rounded-xl border-gray-200 focus:border-orange-500 bg-gray-50 hover:bg-white transition-colors"
          placeholder="Rua, número, bairro"
        />
      </div>

      {formData.type === 'apartamento' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Unidade</Label>
          <Input
            value={formData.unit}
            onChange={(e) => onChange('unit', e.target.value)}
            className="h-12 rounded-xl border-gray-200 focus:border-orange-500 bg-gray-50 hover:bg-white transition-colors"
            placeholder="Ex: 2503"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Cidade</Label>
          <Input
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="h-12 rounded-xl border-gray-200 focus:border-orange-500 bg-gray-50 hover:bg-white transition-colors"
            placeholder="Cidade"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Estado</Label>
          <Input
            value={formData.state}
            onChange={(e) => onChange('state', e.target.value)}
            className="h-12 rounded-xl border-gray-200 focus:border-orange-500 bg-gray-50 hover:bg-white transition-colors"
            placeholder="UF"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">CEP</Label>
        <Input
          value={formData.cep}
          onChange={(e) => onChange('cep', e.target.value)}
          className="h-12 rounded-xl border-gray-200 focus:border-orange-500 bg-gray-50 hover:bg-white transition-colors"
          placeholder="00000-000"
        />
      </div>
    </div>
  </div>
);