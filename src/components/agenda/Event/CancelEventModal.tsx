
import React, { useState } from 'react';
import { useCalendar } from '@/context/CalendarContext';

interface CancelEventModalProps {
  isVisible: boolean;
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CancelEventModal = ({ isVisible, eventId, onClose, onSuccess }: CancelEventModalProps) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const { cancelEvent } = useCalendar();

  const reasons = [
    'Proprietário cancelou',
    'Previsão de tempo ruim',
    'Imóvel já foi vendido ou locado',
    'Outro'
  ];

  const handleCancel = () => {
    if (!reason || (reason === 'Outro' && !customReason.trim())) {
      return;
    }
    const finalReason = reason === 'Outro' ? customReason.trim() : reason;
    cancelEvent(eventId, finalReason);
    onSuccess();
    onClose();
  };

  const isValid = reason && (reason !== 'Outro' || customReason.trim());

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4 z-50">
      <div className="modal-content bg-white rounded-xl p-6 w-full max-w-sm">
        {/* Title */}
        <h2 className="font-semibold text-xl text-gray-800 text-center mb-4">
          Cancelar serviço
        </h2>

        {/* Reason Label */}
        <label className="text-sm text-gray-600 mb-2 block">
          Selecione o motivo
        </label>

        {/* Reason Buttons */}
        <div className="mb-4">
          {reasons.map(reasonOption => (
            <button
              key={reasonOption}
              className={`w-full p-3 border rounded-lg mb-2 text-left transition-colors ${
                reason === reasonOption 
                  ? 'border-[hsl(var(--accent))] bg-orange-50 text-[hsl(var(--accent))]' 
                  : 'border-gray-300 bg-white text-gray-800'
              }`}
              onClick={() => setReason(reasonOption)}
            >
              <span className="text-sm">
                {reasonOption}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Reason Input */}
        {reason === 'Outro' && (
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-800 min-h-[80px] mb-4 resize-none"
            placeholder="Descreva o motivo..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 h-12 bg-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-400 transition-colors"
            onClick={onClose}
          >
            <span className="font-semibold text-sm text-gray-600">
              Voltar
            </span>
          </button>
          
          <button
            className={`flex-1 h-12 rounded-lg flex items-center justify-center transition-colors ${
              isValid 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!isValid}
            onClick={handleCancel}
          >
            <span className="font-semibold text-sm text-white">
              Confirmar cancelamento
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
