
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SairPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full md:max-w-2xl h-full flex flex-col overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm min-h-[640px]">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Sair</h1>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-600">Confirmação de saída em desenvolvimento...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SairPage;
