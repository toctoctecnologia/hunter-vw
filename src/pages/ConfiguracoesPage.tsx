
import { ArrowLeft, Settings, Info, Briefcase, Star, MessageCircle, Eye, Link2, User, Mail, Phone, MapPin, Calendar, Shield, Bell, Palette, Globe, HelpCircle, FileText, LogOut, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MobilePage from '@/components/shell/MobilePage';

const ConfiguracoesPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'main' | 'profile' | 'business' | 'whatsapp'>('main');

  const handleBack = () => {
    if (activeSection === 'main') {
      navigate('/');
    } else {
      setActiveSection('main');
    }
  };

  const renderMainConfigurations = () => (
    <div className="p-4 space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img 
                src="/uploads/3572e105-6c67-4a1a-95cc-a46e2d2faffb.png" 
                alt="Paulo"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[hsl(var(--accent))] rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Capelani Imóveis</h3>
            <p className="text-sm text-gray-500">app.assis.co/capelani.imoveis</p>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="space-y-3">
        <button 
          onClick={() => setActiveSection('profile')}
          className="w-full bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100"
        >
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Configurações</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button 
          onClick={() => setActiveSection('business')}
          className="w-full bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100"
        >
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Sobre o seu negócio</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button className="w-full bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Serviços oferecidos</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button className="w-full bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100">
          <div className="flex items-center space-x-3">
            <Star className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Depoimentos</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button className="w-full bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Botão de contato</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button className="w-full bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Aparência</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button className="w-full bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100">
          <div className="flex items-center space-x-3">
            <Link2 className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Links</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>
      </div>

      {/* WhatsApp Connection Section */}
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conexões</h3>
        
        <button 
          onClick={() => setActiveSection('whatsapp')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">WhatsApp</p>
              <p className="text-sm text-[#25D366]">Conectado</p>
            </div>
          </div>
          <span className="text-gray-400">›</span>
        </button>
      </div>

      {/* Ver como cliente button */}
      <button className="w-full bg-[hsl(var(--accent))] text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-2">
        <Eye className="w-5 h-5" />
        <span>Ver como cliente</span>
      </button>
    </div>
  );

  const renderWhatsAppSettings = () => (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-[#25D366] rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </div>
          <div className="w-12 h-12 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Conexão WhatsApp</h2>
        <p className="text-gray-600 text-center">Receba lembretes e sugestões de mensagem que te ajudam a vender mais.</p>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-orange-700">100% inteligência artificial</span>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
          <Shield className="w-6 h-6 text-red-500" />
          <span className="text-red-700">Não acessa conversas pessoais e grupos</span>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <Briefcase className="w-6 h-6 text-blue-500" />
          <span className="text-blue-700">Conecte o WhatsApp que você usa para trabalhar</span>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Status da conexão</h3>
        
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Assistente WhatsApp</p>
              <p className="text-sm text-[#25D366]">Conectado</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <span className="text-gray-400 text-xl">×</span>
          </button>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
        <button className="w-full bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100">
          <span className="text-gray-900 font-medium">Serviços</span>
          <span className="text-gray-400">›</span>
        </button>

        <button className="w-full bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100">
          <span className="text-gray-900 font-medium">Contatos ignorados</span>
          <span className="text-gray-400">›</span>
        </button>
      </div>

      {/* Security Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-blue-900 font-medium">Suas informações estão seguras com a Assis.</span>
        </div>
      </div>

      {/* Help */}
      <div className="text-center">
        <button className="text-[hsl(var(--accent))] font-medium">Precisa de ajuda?</button>
      </div>
    </div>
  );

  const getTitle = () => {
    if (activeSection === 'whatsapp') return 'Conexão WhatsApp';
    return 'Configurações';
  };

  return (
    <MobilePage>
      <div className="w-full bg-white rounded-lg shadow-sm h-full md:max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{getTitle()}</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeSection === 'main' && renderMainConfigurations()}
          {activeSection === 'whatsapp' && renderWhatsAppSettings()}
        </div>
      </div>
    </MobilePage>
  );
};

export default ConfiguracoesPage;
