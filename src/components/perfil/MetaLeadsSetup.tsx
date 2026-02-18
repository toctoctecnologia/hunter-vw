import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MetaLeadsSetupProps {
  onClose: () => void;
}

export const MetaLeadsSetup = ({ onClose }: MetaLeadsSetupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    appId: '',
    appSecret: '',
    pageId: '',
    accessToken: ''
  });
  const { toast } = useToast();

  const steps = [
    {
      number: 1,
      title: 'Configurar App Facebook',
      description: 'Configure sua aplicação no Facebook Developers',
      action: 'Configurar'
    },
    {
      number: 2,
      title: 'Conectar página',
      description: 'Autorize acesso à sua página do Facebook',
      action: 'Autorizar'
    },
    {
      number: 3,
      title: 'Leads ativos',
      description: 'Seus leads serão sincronizados automaticamente',
      action: 'Concluído'
    }
  ];

  const handleConnect = async () => {
    if (!formData.appId || !formData.appSecret || !formData.pageId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos necessários.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      setCurrentStep(2);
      // Simular processo de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(3);
      setIsConnected(true);
      toast({
        title: "Meta Leads conectado!",
        description: "Sincronização ativada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Verifique os dados e tente novamente.",
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
    setFormData({ appId: '', appSecret: '', pageId: '', accessToken: '' });
    toast({
      title: "Meta Leads desconectado",
      description: "Sincronização desativada.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0866FF] rounded-lg flex items-center justify-center">
                <Facebook className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold">Meta Leads</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isConnected ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Configurar Meta Leads</h3>
                <p className="text-gray-600">Conecte suas páginas do Facebook/Instagram</p>
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      Configure sua aplicação em{' '}
                      <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">
                        developers.facebook.com
                      </a>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      App ID
                    </label>
                    <input
                      type="text"
                      value={formData.appId}
                      onChange={(e) => setFormData(prev => ({ ...prev, appId: e.target.value }))}
                      placeholder="123456789012345"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      App Secret
                    </label>
                    <input
                      type="password"
                      value={formData.appSecret}
                      onChange={(e) => setFormData(prev => ({ ...prev, appSecret: e.target.value }))}
                      placeholder="••••••••••••••••••••••••••••••••"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page ID
                    </label>
                    <input
                      type="text"
                      value={formData.pageId}
                      onChange={(e) => setFormData(prev => ({ ...prev, pageId: e.target.value }))}
                      placeholder="987654321098765"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <Button
                    onClick={handleConnect}
                    disabled={loading}
                    className="w-full bg-[#0866FF] hover:bg-[#0653D3] text-white rounded-full py-3"
                  >
                    {loading ? 'Conectando...' : 'Conectar Meta Leads'}
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Autorizando acesso à página...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Conectado com sucesso!</h3>
              <p className="text-gray-600">Seus leads do Facebook/Instagram estão sendo sincronizados</p>
              
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