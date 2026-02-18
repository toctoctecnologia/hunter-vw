import { Home } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FormData } from '@/types/formData';

interface TypeStatusCardProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export const TypeStatusCard = ({ formData, onChange }: TypeStatusCardProps) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
    <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
      <Home className="w-5 h-5 text-orange-500" />
      Tipo e Status
    </h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Tipo do Imóvel</Label>
        <Select onValueChange={(value) => onChange('type', value)}>
          <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-orange-500 bg-gray-50 hover:bg-white transition-colors">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            <SelectItem value="casa" className="hover:bg-orange-50 rounded-lg">Casa</SelectItem>
            <SelectItem value="apartamento" className="hover:bg-orange-50 rounded-lg">Apartamento</SelectItem>
            <SelectItem value="terreno" className="hover:bg-orange-50 rounded-lg">Terreno</SelectItem>
            <SelectItem value="comercial" className="hover:bg-orange-50 rounded-lg">Comercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Status</Label>
        <Select onValueChange={(value) => onChange('status', value)}>
          <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-orange-500 bg-gray-50 hover:bg-white transition-colors">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            <SelectItem value="disponivel" className="hover:bg-orange-50 rounded-lg">Disponível</SelectItem>
            <SelectItem value="indisponivel" className="hover:bg-orange-50 rounded-lg">Indisponível</SelectItem>
            <SelectItem value="vendido" className="hover:bg-orange-50 rounded-lg">Vendido</SelectItem>
            <SelectItem value="reservado" className="hover:bg-orange-50 rounded-lg">Reservado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

