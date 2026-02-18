
import React, { useState } from 'react';
import { ArrowLeft, Building, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyData: {
    name: string;
    contractedName: string;
    document: string;
  };
  onSave: (data: any) => void;
}

const EditCompanyModal = ({ isOpen, onClose, companyData, onSave }: EditCompanyModalProps) => {
  const [formData, setFormData] = useState(companyData);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden h-dvh">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 bg-white border-b border-gray-100">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Editar Empresa</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto bg-white flex-1">
          <div className="text-center">
            <div className="w-20 h-20 bg-[hsl(var(--accent))] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações da Empresa</h2>
            <p className="text-gray-500">Atualize os dados da sua empresa</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Nome da Empresa</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent bg-gray-50 text-gray-900 font-medium"
                placeholder="Digite o nome da empresa"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Nome do Contratado</label>
              <input
                type="text"
                value={formData.contractedName}
                onChange={(e) => setFormData({ ...formData, contractedName: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent bg-gray-50 text-gray-900 font-medium"
                placeholder="Digite o nome do contratado"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">CPF/CNPJ</label>
              <input
                type="text"
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent bg-gray-50 text-gray-900 font-medium"
                placeholder="Digite o CPF ou CNPJ"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <Button
            onClick={handleSave}
            className="w-full h-14 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyModal;
