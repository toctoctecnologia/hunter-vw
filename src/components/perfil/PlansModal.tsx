
import { ArrowLeft, Crown, Check, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlansModal = ({ isOpen, onClose }: PlansModalProps) => {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'Corretor Autônomo',
      price: 'R$ 97',
      period: '/mês',
      current: true,
      features: [
        'Até 500 leads por mês',
        'WhatsApp Business integrado',
        'Agenda básica',
        'Relatórios simples',
        'Suporte por email'
      ]
    },
    {
      name: 'Plano Gestão',
      price: 'R$ 197',
      period: '/mês',
      popular: true,
      features: [
        'Leads ilimitados',
        'WhatsApp Business + automação',
        'Agenda avançada com automações',
        'Relatórios completos',
        'IA para sugestões de leads',
        'Suporte prioritário',
        'Integração com CRM externo',
        'API completa'
      ]
    },
    {
      name: 'Plano Imobiliária',
      price: 'R$ 397',
      period: '/mês',
      features: [
        'Tudo do Plano Gestão',
        'Múltiplos usuários (até 10)',
        'Dashboard para gestores',
        'Relatórios personalizados',
        'Treinamento personalizado',
        'Suporte dedicado',
        'Customizações avançadas'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden h-dvh">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Planos</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha seu Plano</h2>
            <p className="text-gray-500">Encontre o plano ideal para seu negócio</p>
          </div>

          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-3xl p-6 border-2 transition-all duration-200 ${
                plan.current ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100/50 shadow-lg' : 
                plan.popular ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg' : 
                'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  {plan.current && (
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-full">
                      Atual
                    </span>
                  )}
                  {plan.popular && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Popular
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full h-12 rounded-2xl font-semibold text-base transition-all duration-200 ${
                  plan.current ? 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200' :
                  plan.popular ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl active:scale-95' :
                  'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl active:scale-95'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Plano Atual' : 'Escolher Plano'}
              </Button>
            </div>
          ))}

          <div className="text-center bg-gray-50 rounded-2xl p-4 mt-6">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Todos os planos incluem período de teste gratuito de 7 dias
            </p>
            <p className="text-xs text-gray-500">Cancele a qualquer momento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansModal;
