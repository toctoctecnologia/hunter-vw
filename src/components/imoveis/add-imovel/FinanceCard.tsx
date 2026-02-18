import { DollarSign } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { FormData } from '@/types/formData';

interface FinanceCardProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export const FinanceCard = ({ formData, onChange }: FinanceCardProps) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
    <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
      <DollarSign className="w-5 h-5 text-orange-500" />
      Valores
    </h3>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Valor do Imóvel</Label>
        <Input
          value={formData.price}
          onChange={(e) => onChange('price', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="R$ 0,00"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Condomínio</Label>
          <Input
            value={formData.condominium}
            onChange={(e) => onChange('condominium', e.target.value)}
            className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
            placeholder="R$ 0,00"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">IPTU</Label>
          <Input
            value={formData.iptu}
            onChange={(e) => onChange('iptu', e.target.value)}
            className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
            placeholder="R$ 0,00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Entrada</Label>
          <Input
            value={formData.downPayment}
            onChange={(e) => onChange('downPayment', e.target.value)}
            className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
            placeholder="R$ 0,00"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Parcelas</Label>
          <Input
            value={formData.installments}
            onChange={(e) => onChange('installments', e.target.value)}
            className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
            placeholder="Ex: 12x R$ 500,00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Reforço</Label>
          <Input
            value={formData.reinforcement}
            onChange={(e) => onChange('reinforcement', e.target.value)}
            className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
            placeholder="R$ 0,00"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Valor de quitação</Label>
          <Input
            value={formData.settlementValue}
            onChange={(e) => onChange('settlementValue', e.target.value)}
            className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
            placeholder="R$ 0,00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Formas de Pagamento</Label>
        <Textarea
          value={formData.paymentMethods}
          onChange={(e) => onChange('paymentMethods', e.target.value)}
          className="min-h-[80px] rounded-2xl border-orange-200 focus:border-orange-500 resize-none bg-white"
          placeholder="Descreva as formas de pagamento aceitas..."
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-black">Pode ser direto com o proprietário?</Label>
          <RadioGroup value={formData.directWithOwner} onValueChange={(value) => onChange('directWithOwner', value)} className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
              <RadioGroupItem className="text-orange-500 border-gray-300" value="sim" id="direto-sim" />
              <Label htmlFor="direto-sim" className="text-black font-medium">Sim</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
              <RadioGroupItem className="text-orange-500 border-gray-300" value="nao" id="direto-nao" />
              <Label htmlFor="direto-nao" className="text-black font-medium">Não</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-black">Aceita financiamento?</Label>
          <RadioGroup value={formData.acceptsFinancing} onValueChange={(value) => onChange('acceptsFinancing', value)} className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
              <RadioGroupItem className="text-orange-500 border-gray-300" value="sim" id="financ-sim" />
              <Label htmlFor="financ-sim" className="text-black font-medium">Sim</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
              <RadioGroupItem className="text-orange-500 border-gray-300" value="nao" id="financ-nao" />
              <Label htmlFor="financ-nao" className="text-black font-medium">Não</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  </div>
);

