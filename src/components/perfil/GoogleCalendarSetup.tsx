
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GoogleCalendarSetupProps {
  onClose: () => void;
}

export const GoogleCalendarSetup = ({ onClose }: GoogleCalendarSetupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      number: 1,
      title: 'Fazer login no Google',
      description: 'Você será redirecionado para fazer login na sua conta Google',
      action: 'Conectar com Google'
    },
    {
      number: 2,
      title: 'Autorizar acesso',
      description: 'Permita que o TOC TOC CRM acesse seu Google Calendar',
      action: 'Autorizar'
    },
    {
      number: 3,
      title: 'Sincronização ativa',
      description: 'Seus eventos serão sincronizados automaticamente',
      action: 'Concluído'
    }
  ];

  const handleConnect = async () => {
    setLoading(true);
    try {
      // Simular processo de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(2);
      setTimeout(() => {
        setCurrentStep(3);
        setIsConnected(true);
        toast({
          title: "Google Calendar conectado!",
          description: "Sincronização ativada com sucesso.",
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao Google Calendar.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setCurrentStep(1);
    toast({
      title: "Google Calendar desconectado",
      description: "Sincronização desativada.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#4285F4] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold">Google Calendar</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isConnected ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Configurar Google Calendar</h3>
                <p className="text-gray-600">Siga os passos abaixo para conectar sua conta</p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.number} className={`flex items-start space-x-4 p-4 rounded-lg border ${
                    currentStep === step.number ? 'border-blue-200 bg-blue-50' :
                    currentStep > step.number ? 'border-green-200 bg-green-50' :
                    'border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step.number ? 'bg-blue-500 text-white' :
                      currentStep > step.number ? 'bg-green-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                {currentStep === 1 && (
                  <Button
                    onClick={handleConnect}
                    disabled={loading}
                    className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full py-3"
                  >
                    {loading ? 'Conectando...' : 'Conectar com Google'}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Conectado com sucesso!</h3>
              <p className="text-gray-600">Seus eventos do Google Calendar estão sendo sincronizados</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Status da sincronização</p>
                    <p className="text-sm text-green-600">Ativo</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  Desconectar
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white rounded-full"
                >
                  Concluir
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
