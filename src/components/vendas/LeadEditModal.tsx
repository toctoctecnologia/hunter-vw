
import { useState } from 'react';
import { ChevronLeft, Phone, Mail, User } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  interest: string;
  lastContact: string;
  createdAt?: string;
  capturedBy?: number | null;
  publishedToRoleta?: boolean;
  profileImage?: string | null;
}

interface LeadEditModalProps {
  lead: Lead;
  onClose: () => void;
  onSave: (lead: Lead) => void;
}

export const LeadEditModal = ({ lead, onClose, onSave }: LeadEditModalProps) => {
  const [editedLead, setEditedLead] = useState(lead);
  const [notes, setNotes] = useState('');
  const [nextAction, setNextAction] = useState('Ligar');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'deactivate' | 'reactivate' | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativos': return '#4CAF50';
      case 'Em negociação': return '#FFC107';
      case 'Inativos': return '#F44336';
      default: return '#666666';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setEditedLead(prev => ({ ...prev, status: newStatus }));
  };

  const handleSave = () => {
    onSave(editedLead);
  };

  const handleDeactivate = () => {
    setConfirmAction('deactivate');
    setShowConfirm(true);
  };

  const handleReactivate = () => {
    setConfirmAction('reactivate');
    setShowConfirm(true);
  };

  const confirmStatusChange = () => {
    if (confirmAction === 'deactivate') {
      setEditedLead(prev => ({ ...prev, status: 'Inativos' }));
    } else if (confirmAction === 'reactivate') {
      setEditedLead(prev => ({ ...prev, status: 'Ativos' }));
    }
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const interactions = [
    { date: '18/06/2025 14:30', type: 'phone', content: 'Ligação realizada - Cliente interessado em apartamento 2 quartos', property: 'Infinity Coast, apto 2502' },
    { date: '15/06/2025 10:15', type: 'whatsapp', content: 'Enviado catálogo de imóveis via WhatsApp', property: null },
    { date: '12/06/2025 16:45', type: 'email', content: 'E-mail de follow-up enviado com novas opções', property: 'Vila Madalena, casa 3 quartos' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full md:max-w-2xl h-dvh flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button onClick={onClose} className="text-[hsl(var(--accent))] font-medium flex items-center">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Voltar
          </button>
          <h3 className="text-lg font-semibold text-[#333333]">Lead: {lead.name}</h3>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Profile Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                {editedLead.profileImage ? (
                  <img src={editedLead.profileImage} alt={editedLead.name} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#333333] mb-1">{editedLead.name}</h3>
                <div className="flex items-center space-x-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(editedLead.status) }}
                  />
                  <span className="text-sm text-[#666666]">{editedLead.status}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#666666]">
                  <Phone className="w-4 h-4" />
                  <span>{editedLead.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#666666]">
                  <Mail className="w-4 h-4" />
                  <span>{editedLead.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interaction History */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <h4 className="text-base font-semibold text-[#333333] mb-3">Histórico de Interações</h4>
            <div className="space-y-3">
              {interactions.map((interaction, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-3 pb-3">
                  <div className="flex items-center space-x-2 mb-1">
                    {interaction.type === 'phone' && <Phone className="w-4 h-4 text-blue-500" />}
                    {interaction.type === 'whatsapp' && <span className="text-green-500">📱</span>}
                    {interaction.type === 'email' && <Mail className="w-4 h-4 text-red-500" />}
                    <span className="text-xs text-[#666666]">{interaction.date}</span>
                  </div>
                  <p className="text-sm text-[#333333] mb-1">{interaction.content}</p>
                  {interaction.property && (
                    <p className="text-xs text-[hsl(var(--accent))] font-medium">Imóvel: {interaction.property}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <h4 className="text-base font-semibold text-[#333333] mb-3">Status do Lead</h4>
            <div className="grid grid-cols-3 gap-2">
              {['Ativos', 'Em negociação', 'Inativos'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    editedLead.status === status
                      ? 'bg-[hsl(var(--accent))] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Next Action */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <h4 className="text-base font-semibold text-[#333333] mb-3">Próxima Ação</h4>
            <select
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[hsl(var(--accent))]"
            >
              <option value="Ligar">Ligar</option>
              <option value="Enviar E-mail">Enviar E-mail</option>
              <option value="Agendar Visita">Agendar Visita</option>
              <option value="Enviar Proposta">Enviar Proposta</option>
            </select>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <h4 className="text-base font-semibold text-[#333333] mb-3">Anotações</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Digite observações ou lembretes..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[hsl(var(--accent))] resize-none"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSave}
              className="w-full bg-[hsl(var(--accent))] text-white py-3 rounded-lg font-medium"
            >
              Salvar Alterações
            </button>
            
            {editedLead.status !== 'Inativos' ? (
              <button
                onClick={handleDeactivate}
                className="w-full bg-[#F44336] text-white py-3 rounded-lg font-medium"
              >
                Desativar Lead
              </button>
            ) : (
              <button
                onClick={handleReactivate}
                className="w-full bg-[#4CAF50] text-white py-3 rounded-lg font-medium"
              >
                Reativar Lead
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center">
          <div className="bg-white rounded-lg w-80 p-6">
            <h3 className="text-lg font-semibold text-[#333333] mb-4">
              {confirmAction === 'deactivate' ? 'Desativar Lead' : 'Reativar Lead'}
            </h3>
            <p className="text-sm text-[#666666] mb-6">
              {confirmAction === 'deactivate' 
                ? 'Deseja mesmo desativar este lead?' 
                : 'Deseja reativar este lead?'}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmStatusChange}
                className={`flex-1 py-2 px-4 rounded-lg text-white ${
                  confirmAction === 'deactivate' ? 'bg-[#F44336]' : 'bg-[#4CAF50]'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
