import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search } from 'lucide-react';
import type { FormData } from '@/types/formData';

interface DetailsCardProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  openCondominiumModal: () => void;
}

export const DetailsCard = ({ formData, onChange, openCondominiumModal }: DetailsCardProps) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
    <h3 className="text-lg font-semibold text-black mb-4">Detalhes do Imóvel</h3>
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-black">Apartamento mobiliado ou vazio?</Label>
        <RadioGroup value={formData.furnished} onValueChange={(value) => onChange('furnished', value)} className="space-y-3">
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
            <RadioGroupItem className="text-orange-500 border-gray-300" value="mobiliado" id="mobiliado" />
            <Label htmlFor="mobiliado" className="text-black font-medium">Mobiliado</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
            <RadioGroupItem className="text-orange-500 border-gray-300" value="vazio" id="vazio" />
            <Label htmlFor="vazio" className="text-black font-medium">Vazio</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Tipo (face / andar)</Label>
        <Input
          value={formData.typeFloor}
          onChange={(e) => onChange('typeFloor', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="Ex: Face norte, Andar alto"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Descrição da unidade</Label>
        <Textarea
          value={formData.unitDescription}
          onChange={(e) => onChange('unitDescription', e.target.value)}
          className="min-h-[80px] rounded-2xl border-orange-200 focus:border-orange-500 resize-none bg-white"
          placeholder="Descreva a unidade..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Lazer do condomínio</Label>
        <Textarea
          value={formData.condominiumLeisure}
          onChange={(e) => onChange('condominiumLeisure', e.target.value)}
          className="min-h-[80px] rounded-2xl border-orange-200 focus:border-orange-500 resize-none bg-white"
          placeholder="Piscina, Academia, etc."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Condomínio</Label>
        <div className="flex items-center gap-2">
          <Input
            value={formData.selectedCondominium}
            onChange={(e) => onChange('selectedCondominium', e.target.value)}
            className="flex-1 h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
            placeholder="Nome do condomínio"
          />
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 rounded-2xl border-orange-200 hover:bg-orange-50 text-black"
            onClick={openCondominiumModal}
          >
            <Search className="w-4 h-4 mr-2 text-black" />
            Buscar Condomínio
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Construtora</Label>
        <Input
          value={formData.constructionCompany}
          onChange={(e) => onChange('constructionCompany', e.target.value)}
          className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
          placeholder="Nome da construtora"
        />
      </div>

      {formData.constructionCompany && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Tempo de mercado da construtora</Label>
          <Input
            value={formData.constructionCompanyYears}
            onChange={(e) => onChange('constructionCompanyYears', e.target.value)}
            className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
            placeholder="Ex: 15 anos no mercado"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium text-black">Tipo da vaga de garagem</Label>
        <Select onValueChange={(value) => onChange('garageType', value)}>
          <SelectTrigger className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            <SelectItem value="sem-vaga" className="hover:bg-orange-50">Sem vaga</SelectItem>
            <SelectItem value="simples" className="hover:bg-orange-50">Simples</SelectItem>
            <SelectItem value="dupla" className="hover:bg-orange-50">Dupla</SelectItem>
            <SelectItem value="coberta" className="hover:bg-orange-50">Coberta</SelectItem>
            <SelectItem value="descoberta" className="hover:bg-orange-50">Descoberta</SelectItem>
            <SelectItem value="box" className="hover:bg-orange-50">Box</SelectItem>
            <SelectItem value="vaga-rotativa" className="hover:bg-orange-50">Vaga rotativa</SelectItem>
            <SelectItem value="vaga-trancada" className="hover:bg-orange-50">Vaga trancada</SelectItem>
            <SelectItem value="outro" className="hover:bg-orange-50">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.garageType !== '' && formData.garageType !== 'sem-vaga' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-black">Localização da vaga</Label>
            <div className="grid grid-cols-2 gap-4">
              <Select onValueChange={(value) => onChange('garageLocation', value)}>
                <SelectTrigger className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white">
                  <SelectValue placeholder="G1, G2..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <SelectItem value="G1" className="hover:bg-orange-50">G1</SelectItem>
                  <SelectItem value="G2" className="hover:bg-orange-50">G2</SelectItem>
                  <SelectItem value="G3" className="hover:bg-orange-50">G3</SelectItem>
                  <SelectItem value="subsolo" className="hover:bg-orange-50">Subsolo</SelectItem>
                </SelectContent>
              </Select>

              <Input
                value={formData.garageNumber}
                onChange={(e) => onChange('garageNumber', e.target.value)}
                className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white"
                placeholder="Nº da vaga"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-black">Onde está localizada a vaga</Label>
            <Textarea
              value={formData.garageLocationDetails}
              onChange={(e) => onChange('garageLocationDetails', e.target.value)}
              className="min-h-[80px] rounded-2xl border-orange-200 focus:border-orange-500 resize-none bg-white"
              placeholder="Descreva a localização da vaga..."
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

