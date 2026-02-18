import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderImoveisProps {
  hideBack?: boolean;
}

export const HeaderImoveis = ({ hideBack }: HeaderImoveisProps) => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-4 bg-white border-b border-gray-100 flex items-center">
      {!hideBack && (
        <button
          onClick={() => navigate(-1)}
          className="mr-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}
      <h1 className="text-xl font-semibold text-[#333333]">Imóveis</h1>
    </div>
  );
};
