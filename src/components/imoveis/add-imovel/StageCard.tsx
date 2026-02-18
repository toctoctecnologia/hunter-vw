import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { parseISO } from 'date-fns';
import { ymdLocal } from '@/lib/datetime';
import type { FormData } from '@/types/formData';

interface StageCardProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export const StageCard = ({ formData, onChange }: StageCardProps) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
    <h3 className="text-lg font-semibold text-black mb-4">Estágio do Imóvel</h3>
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-black">Imóvel na planta ou pronto para morar?</Label>
        <RadioGroup value={formData.propertyStage} onValueChange={(value) => onChange('propertyStage', value)} className="space-y-3">
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
            <RadioGroupItem className="text-orange-500 border-gray-300" value="planta" id="planta" />
            <Label htmlFor="planta" className="text-black font-medium">Na planta</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
            <RadioGroupItem className="text-orange-500 border-gray-300" value="pronto" id="pronto" />
            <Label htmlFor="pronto" className="text-black font-medium">Pronto para morar</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.propertyStage === 'planta' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Data de entrega</Label>
          <DatePickerInput
            value={formData.deliveryDate ? parseISO(formData.deliveryDate) : null}
            onChange={(date) => onChange('deliveryDate', date ? ymdLocal(date) : '')}
            className="h-12 rounded-xl border-gray-200 focus:border-orange-500 bg-gray-50 hover:bg-white transition-colors"
          />
        </div>
      )}
    </div>
  </div>
);

