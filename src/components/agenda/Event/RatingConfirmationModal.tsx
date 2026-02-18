
import React from 'react';
import { Check } from 'lucide-react';

interface RatingConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const RatingConfirmationModal = ({ isVisible, onClose }: RatingConfirmationModalProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm flex flex-col items-center">
        {/* Success Icon */}
        <div className="w-12 h-12 bg-[#28A745] rounded-full flex items-center justify-center mb-4">
          <Check size={24} className="text-white" />
        </div>

        {/* Title */}
        <h2 className="font-semibold text-xl text-gray-800 text-center mb-2">
          Avaliação enviada!
        </h2>
        
        <p className="text-sm text-gray-600 text-center mb-6">
          Sua avaliação é muito importante para o nosso time garantir a melhor qualidade de serviço para você!
        </p>

        {/* Button */}
        <button
          className="w-full h-12 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center hover:bg-[hsl(var(--accentHover))] transition-colors"
          onClick={onClose}
        >
          <span className="font-semibold text-base text-white">
            Ir para detalhes do serviço
          </span>
        </button>
      </div>
    </div>
  );
};
