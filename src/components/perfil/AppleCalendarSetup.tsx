
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AppleCalendarSetupProps {
  onClose: () => void;
}

export const AppleCalendarSetup = ({ onClose }: AppleCalendarSetupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    appleId: '',
    password: ''
  });
  const { toast } = useToast();

  const steps = [
    {
      number: 1,
      title: 'Inserir Apple ID',
      description: 'Digite seu Apple ID e senha específica para app',
      action: 'Inserir dados'
    },
    {
      number: 2,
      title: 'Verificar conexão',
      description: 'Testando conexão com o servidor iCloud',
      action: 'Verificando'
    },
    {
      number: 3,
      title: 'Sincronização ativa',
      description: 'Seus eventos serão sincronizados automaticamente',
      action: 'Concluído'
    }
  ];

  const handleConnect = async () => {
    if (!formData.appleId || !formData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha seu Apple ID e senha.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      setCurrentStep(2);
      // Simular processo de conexão
      await new Promise(resolve => setTimeout(resolve, 3000));
      setCurrentStep(3);
      setIsConnected(true);
      toast({
        title: "Apple Calendar conectado!",
        description: "Sincronização ativada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Verifique seus dados e tente novamente.",
        variant: "destructive"
      });
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setCurrentStep(1);
    setFormData({ appleId: '', password: '' });
    toast({
      title: "Apple Calendar desconectado",
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
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold">Apple Calendar</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isConnected ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Configurar Apple Calendar</h3>
                <p className="text-gray-600">Conecte sua conta iCloud para sincronizar eventos</p>
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

              {/* Form */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apple ID
                    </label>
                    <input
                      type="email"
                      value={formData.appleId}
                      onChange={(e) => setFormData(prev => ({ ...prev, appleId: e.target.value }))}
                      placeholder="seu@icloud.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha específica para app
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••••••••••"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Gere uma senha específica em appleid.apple.com
                    </p>
                  </div>

                  <Button
                    onClick={handleConnect}
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-3"
                  >
                    {loading ? 'Conectando...' : 'Conectar Apple Calendar'}
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Verificando conexão...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Conectado com sucesso!</h3>
              <p className="text-gray-600">Seus eventos do Apple Calendar estão sendo sincronizados</p>
              
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
