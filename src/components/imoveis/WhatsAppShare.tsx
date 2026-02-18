
import { X } from 'lucide-react';

interface WhatsAppShareProps {
  property: {
    name: string;
    address: string;
    images: string[];
  };
  onClose: () => void;
  onShare: () => void;
}

export const WhatsAppShare = ({ property, onClose, onShare }: WhatsAppShareProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="px-6 pt-4 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Compartilhar Imóvel</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-700 text-sm">
              Será enviado: {property.name} + {Math.min(4, property.images.length)} fotos
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-3">
          <button 
            onClick={onShare}
            className="w-full bg-[#25D366] text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-[#128C7E] transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
            </svg>
            <span>Enviar via WhatsApp</span>
          </button>
          
          <button 
            onClick={onClose}
            className="w-full text-gray-700 py-4 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 border border-gray-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
