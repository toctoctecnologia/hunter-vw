
import { ArrowLeft, Camera, Video, Upload, Calendar, MapPin, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CaptacoesPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const captacaoServices = [
    {
      id: 1,
      title: 'Fotos Profissionais',
      description: 'Fotografia profissional para imóveis',
      icon: Camera,
      price: 'R$ 150',
      duration: '2-3 horas'
    },
    {
      id: 2,
      title: 'Vídeos HD',
      description: 'Filmagem profissional em alta definição',
      icon: Video,
      price: 'R$ 250',
      duration: '3-4 horas'
    },
    {
      id: 3,
      title: 'Tour Virtual 360°',
      description: 'Experiência imersiva completa',
      icon: Upload,
      price: 'R$ 400',
      duration: '4-5 horas'
    }
  ];

  const recentCaptacoes = [
    {
      id: 1,
      property: 'Casa Luxo - Alphaville',
      date: '23/06/2025',
      status: 'Concluído',
      photographer: 'David Michel',
      rating: 5
    },
    {
      id: 2,
      property: 'Apartamento Centro',
      date: '22/06/2025',
      status: 'Em andamento',
      photographer: 'Maria Santos',
      rating: null
    },
    {
      id: 3,
      property: 'Cobertura Jardins',
      date: '21/06/2025',
      status: 'Agendado',
      photographer: 'Carlos Lima',
      rating: null
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
            <h1 className="text-lg font-semibold text-gray-900">Captações</h1>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Services */}
            <div className="space-y-4 mb-6">
              <h2 className="font-semibold text-gray-900">Serviços Disponíveis</h2>
              
              {captacaoServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.id} className="bg-gradient-to-r from-[#E91E63] to-[#F06292] rounded-lg p-4 text-white shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{service.title}</h3>
                        <p className="text-sm text-white/90 mb-2">{service.description}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-white/80" />
                            <span className="text-xs text-white/80">{service.duration}</span>
                          </div>
                          <span className="text-sm font-semibold text-white">{service.price}</span>
                        </div>
                        <button className="py-2 px-4 bg-white text-[#E91E63] rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                          Agendar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Captações */}
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Captações Recentes</h2>
              
              {recentCaptacoes.map((captacao) => (
                <div key={captacao.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{captacao.property}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>{captacao.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Camera className="w-4 h-4" />
                        <span>{captacao.photographer}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                        captacao.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                        captacao.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {captacao.status}
                      </div>
                      {captacao.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(captacao.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
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

export default CaptacoesPage;
