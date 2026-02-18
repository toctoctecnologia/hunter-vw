
import { ArrowLeft, HelpCircle, FileText, MessageCircle, Phone, ExternalLink } from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpCenterModal = ({ isOpen, onClose }: HelpCenterModalProps) => {
  if (!isOpen) return null;

  const helpTopics = [
    { title: 'Primeiros Passos', description: 'Como começar a usar o TOC TOC CRM', icon: FileText },
    { title: 'Gerenciar Leads', description: 'Cadastro e acompanhamento de leads', icon: FileText },
    { title: 'Agenda e Serviços', description: 'Como agendar e gerenciar serviços', icon: FileText },
    { title: 'WhatsApp Integration', description: 'Conectar e usar o WhatsApp Business', icon: MessageCircle },
    { title: 'Relatórios', description: 'Gerar e interpretar relatórios', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg h-dvh">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Central de Ajuda</h1>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 text-[hsl(var(--accent))] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Como podemos ajudar?</h2>
            <p className="text-sm text-gray-500 mt-2">FAQ e tutoriais</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Tópicos Populares</h3>
            {helpTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{topic.title}</p>
                      <p className="text-sm text-gray-500">{topic.description}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Suporte Direto</h3>
            
            <button 
              onClick={() => window.open('https://wa.me/5547973673966', '_blank')}
              className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-green-900">Chat ao Vivo</p>
                  <p className="text-sm text-green-700">Fale conosco pelo WhatsApp</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-green-600" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-blue-900">Suporte por Telefone</p>
                  <p className="text-sm text-blue-700">(47) 9736-7396</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">
              <strong>Versão 1.0 TOC TOC CRM</strong>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Última atualização: Janeiro 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterModal;
