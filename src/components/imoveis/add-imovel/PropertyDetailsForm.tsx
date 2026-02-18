import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { FC } from 'react';
import type { FormData } from '@/types/formData';
import {
  TypeStatusCard,
  StageCard,
  LocationCard,
  DetailsCard,
  FinanceCard,
  DimensionsCard,
  FeaturesCard,
  OwnerCard
} from './index';

interface PropertyDetailsFormProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
  openCondominiumModal: () => void;
}

export const PropertyDetailsForm: FC<PropertyDetailsFormProps> = ({
  formData,
  onChange,
  onSubmit,
  openCondominiumModal
}) => (
  <div className="space-y-8">
    <TypeStatusCard formData={formData} onChange={onChange} />
    <StageCard formData={formData} onChange={onChange} />
    <LocationCard formData={formData} onChange={onChange} />
    <DetailsCard formData={formData} onChange={onChange} openCondominiumModal={openCondominiumModal} />
    <FinanceCard formData={formData} onChange={onChange} />
    <DimensionsCard formData={formData} onChange={onChange} />
    <FeaturesCard formData={formData} onChange={onChange} />
    <OwnerCard formData={formData} onChange={onChange} />

    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-black mb-4">Descrição do Imóvel</h3>
      <Textarea
        value={formData.description}
        onChange={(e) => onChange('description', e.target.value)}
        className="min-h-[120px] rounded-2xl border-gray-200 focus:border-orange-500 resize-none bg-gray-50 transition-colors"
        placeholder="Descreva as principais características e diferenciais do imóvel..."
      />
    </div>

    <div className="pt-4">
      <Button
        onClick={onSubmit}
        className="w-full bg-orange-500 text-white rounded-xl px-6 py-4 hover:bg-orange-600 transition-colors font-medium text-base"
      >
        <Plus className="w-5 h-5 mr-2 text-white" />
        Adicionar Imóvel
      </Button>
    </div>
  </div>
);

