
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { parseISO } from 'date-fns';
import { ymdLocal } from '@/lib/datetime';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { debugLog } from '@/utils/debug';
import MobilePage from '@/components/shell/MobilePage';

const AddLeadPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    origem: '',
    observacoes: '',
    dataRetorno: '',
    horaRetorno: ''
  });

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      debugLog('Novo lead enviado:', formData);
      navigate('/vendas');
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
    }
  };

  return (
    <MobilePage>
      <div className="flex flex-col overflow-y-auto h-full">
        <div className="bg-white rounded-lg shadow-sm min-h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Adicionar Lead</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Nome *</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full h-11 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black text-sm"
                placeholder="Digite o nome do lead"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Telefone *</label>
              <input
                type="tel"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full h-11 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black text-sm"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Origem</label>
              <select
                value={formData.origem}
                onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
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
              <label className="block text-sm font-medium text-black mb-1">Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black resize-none text-sm"
                placeholder="Adicione observações sobre o lead"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Data de Retorno</label>
                <DatePickerInput
                  value={formData.dataRetorno ? parseISO(formData.dataRetorno) : null}
                  onChange={(date) =>
                    setFormData({ ...formData, dataRetorno: date ? ymdLocal(date) : '' })
                  }
                  className="w-full h-11 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Hora de Retorno</label>
                <input
                  type="time"
                  value={formData.horaRetorno}
                  onChange={(e) => setFormData({ ...formData, horaRetorno: e.target.value })}
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
    </MobilePage>
  );
};

export default AddLeadPage;
