
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { parseISO } from 'date-fns';
import { ymdLocal } from '@/lib/datetime';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { debugLog } from '@/utils/debug';
import { useToast } from '@/hooks/use-toast';

interface AddLeadModalProps {
  onClose: () => void;
}

export const AddLeadModal = ({ onClose }: AddLeadModalProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    origem: '',
    observacoes: '',
    dataRetorno: '',
    horaRetorno: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      debugLog('Novo lead:', formData);
      toast({ title: 'Sucesso', description: 'Lead salvo com sucesso!' });
      onClose();
      navigate('/vendas');
    } catch (error) {
      debugLog('Erro ao salvar lead:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o lead.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-w-[375px] md:max-w-none mx-auto h-[90vh] rounded-t-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white h-14">
          <h2 className="text-lg font-semibold text-black">Adicionar Lead</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="bg-white h-full overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-[343px] md:max-w-none mx-auto">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Nome *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full h-11 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black text-sm"
                placeholder="Digite o nome do lead"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                className="w-full h-11 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black text-sm"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Origem
              </label>
              <select
                value={formData.origem}
                onChange={(e) => setFormData({...formData, origem: e.target.value})}
                className="w-full h-11 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black text-sm"
              >
                <option value="">Selecione a origem</option>
                <option value="Instagram Leads">Instagram Leads</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Site">Site</option>
                <option value="Indicação">Indicação</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black resize-none text-sm"
                placeholder="Adicione observações sobre o lead"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Data de Retorno
                </label>
                <DatePickerInput
                  value={formData.dataRetorno ? parseISO(formData.dataRetorno) : null}
                  onChange={(date) =>
                    setFormData({ ...formData, dataRetorno: date ? ymdLocal(date) : '' })
                  }
                  className="w-full h-11 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Hora de Retorno
                </label>
                <input
                  type="time"
                  value={formData.horaRetorno}
                  onChange={(e) => setFormData({...formData, horaRetorno: e.target.value})}
                  className="w-full h-11 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black text-sm"
                />
              </div>
            </div>

            <div className="pt-4 pb-6">
              <button
                type="submit"
                className="w-full h-12 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Salvar Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
