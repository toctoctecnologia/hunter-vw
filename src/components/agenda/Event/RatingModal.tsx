
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { debugLog } from '@/utils/debug';

interface RatingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RatingModal = ({ isVisible, onClose, onSuccess }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const reasons = [
    'Atraso no dia do serviço',
    'Fotógrafo rude',
    'Qualidade ruim das fotos',
    'Imóvel diferente da descrição',
    'Outro motivo'
  ];

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleSubmit = () => {
    if (rating < 1 || (rating <= 3 && selectedReasons.length === 0)) {
      return;
    }

    try {
      const saved = localStorage.getItem('ratings');
      const ratings = saved ? JSON.parse(saved) : [];
      const data = { rating, reasons: selectedReasons, comment };
      ratings.push(data);
      localStorage.setItem('ratings', JSON.stringify(ratings));
      debugLog('Rating saved:', data);
      onSuccess();
    } catch (error) {
      console.error('Failed to save rating:', error);
    }
  };

  const isValid = rating >= 1 && (rating > 3 || selectedReasons.length > 0);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4 z-50">
      <div className="modal-content bg-white rounded-xl p-6 w-full max-w-sm">
        {/* Title */}
        <h2 className="font-semibold text-xl text-gray-800 text-center mb-2">
          Avalie o serviço
        </h2>
        
        <p className="text-sm text-gray-600 text-center mb-6">
          Aproveite o espaço para classificar o serviço e qualquer outro comentário pertinente
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)}>
              <Star
                size={32}
                className={star <= rating ? 'text-[hsl(var(--accent))] fill-current' : 'text-gray-300'}
              />
            </button>
          ))}
        </div>

        {/* Reasons (only if rating <= 3) */}
        {rating <= 3 && rating > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-base text-gray-800 mb-2">
              Selecione um ou mais motivos
            </h3>
            <div className="flex overflow-x-auto gap-2 pb-2">
              {reasons.map(reason => (
                <button
                  key={reason}
                  className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
                    selectedReasons.includes(reason)
                      ? 'bg-[hsl(var(--accent))] border-[hsl(var(--accent))] text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                  onClick={() => toggleReason(reason)}
                >
                  <span className="text-sm">
                    {reason}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="mb-6">
          <h3 className="font-medium text-base text-gray-800 mb-2">
            Comentários adicionais
          </h3>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-600 min-h-[120px] resize-none"
            placeholder="Se necessário, insira comentários aqui..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          className={`w-full h-12 rounded-lg flex items-center justify-center transition-colors ${
            isValid 
              ? 'bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))]' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!isValid}
          onClick={handleSubmit}
        >
          <span className="font-semibold text-base text-white">
            Enviar avaliação
          </span>
        </button>
      </div>
    </div>
  );
};
