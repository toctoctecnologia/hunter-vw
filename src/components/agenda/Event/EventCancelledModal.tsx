
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface EventCancelledModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const EventCancelledModal = ({ isVisible, onClose }: EventCancelledModalProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4 z-50">
      <div className="modal-content bg-white rounded-xl p-6 w-full max-w-sm flex flex-col items-center">
        {/* Warning Icon */}
        <div className="w-12 h-12 bg-[#FFC107] rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-white" />
        </div>

        {/* Title */}
        <h2 className="font-semibold text-xl text-gray-800 text-center mb-2">
          Serviço cancelado
        </h2>
        
        <p className="text-sm text-gray-600 text-center mb-6">
          O serviço agendado foi cancelado. Informe o fotógrafo conforme necessário.
        </p>

        {/* Button */}
        <button
          className="w-full h-12 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center hover:bg-[hsl(var(--accentHover))] transition-colors"
          onClick={onClose}
        >
          <span className="font-semibold text-base text-white">
            Voltar para a agenda
          </span>
        </button>
      </div>
    </div>
  );
};
