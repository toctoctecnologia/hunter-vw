
import { Camera, Calendar, MessageCircle, User, LogOut, X, BarChart3, Search, Settings, RefreshCw, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDrawer = ({ isOpen, onClose }: SidebarDrawerProps) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 w-60 h-full bg-white rounded-r-lg overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen
            ? 'translate-x-0 z-50 pointer-events-auto'
            : '-translate-x-full z-0 pointer-events-none'
        }`}
      >
        {/* Header with Profile */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button 
            onClick={() => handleNavigate('/configuracoes')}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/uploads/3572e105-6c67-4a1a-95cc-a46e2d2faffb.png" 
                alt="Paulo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Paulo Capelani</h3>
              <p className="text-sm text-gray-500">Capelani Imóveis</p>
            </div>
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          {/* Buscar */}
          <button
            onClick={() => handleNavigate('/pesquisa')}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Buscar</span>
          </button>


          {/* Ver calendário completo */}
          <button
            onClick={() => handleNavigate('/agenda')}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Ver calendário completo</span>
          </button>

          {/* Sincronizar */}
          <button
            onClick={() => handleNavigate('/agenda')}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Sincronizar</span>
          </button>

          {/* Suporte */}
          <button
            onClick={() => handleNavigate('/suporte')}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Suporte</span>
          </button>

          {/* Perfil */}
          <button
            onClick={() => handleNavigate('/perfil')}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Perfil</span>
          </button>

          {/* Gestão */}
          <button
            onClick={() => handleNavigate('/gestao')}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Gestão</span>
          </button>

          {/* Indicadores de Leads */}
          <button
            onClick={() => handleNavigate('/leads')}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Indicadores de Leads</span>
          </button>

          {/* Configurações */}
          <button
            onClick={() => handleNavigate('/configuracoes')}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Configurações</span>
          </button>

          {/* Sair */}
          <button
            onClick={() => handleNavigate('/sair')}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};
