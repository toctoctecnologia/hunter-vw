
import { ArrowLeft, MessageCircle, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuportePage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const supportOptions = [
    {
      id: 1,
      title: 'Chat Online',
      description: 'Fale conosco pelo chat em tempo real',
      icon: MessageCircle,
      status: 'Disponível',
      action: 'Iniciar Chat'
    },
    {
      id: 2,
      title: 'Telefone',
      description: '(11) 99999-9999',
      icon: Phone,
      status: 'Disponível das 8h às 18h',
      action: 'Ligar'
    },
    {
      id: 3,
      title: 'Email',
      description: 'suporte@imobiliaria.com',
      icon: Mail,
      status: 'Resposta em até 24h',
      action: 'Enviar Email'
    }
  ];

  const recentTickets = [
    {
      id: 1,
      title: 'Problema com upload de fotos',
      date: '23/06/2025',
      status: 'Resolvido'
    },
    {
      id: 2,
      title: 'Dúvida sobre agendamento',
      date: '22/06/2025',
      status: 'Em andamento'
    }
  ];

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
            <h1 className="text-lg font-semibold text-gray-900">Suporte</h1>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Support Options */}
            <div className="space-y-4 mb-6">
              <h2 className="font-semibold text-gray-900">Como podemos ajudar?</h2>
              
              {supportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{option.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{option.status}</span>
                        </div>
                        <button className="py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          {option.action}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Tickets */}
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Chamados Recentes</h2>
              
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{ticket.title}</h3>
                      <p className="text-sm text-gray-500">{ticket.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className={`w-4 h-4 ${
                        ticket.status === 'Resolvido' ? 'text-green-500' : 'text-yellow-500'
                      }`} />
                      <span className={`text-xs font-medium ${
                        ticket.status === 'Resolvido' ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuportePage;
