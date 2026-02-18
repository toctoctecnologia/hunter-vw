import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, MessageCircle, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppControlProps {
  onClose: () => void;
}

export const WhatsAppControl = ({ onClose }: WhatsAppControlProps) => {
  const [isConnected, setIsConnected] = useState(true);
  const [settings, setSettings] = useState({
    autoResponses: true,
    leadCapture: true,
    businessHours: true,
    notifications: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleConnection = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsConnected(!isConnected);
      toast({
        title: isConnected ? "WhatsApp desconectado" : "WhatsApp conectado",
        description: isConnected ? "Integração desativada." : "Integração ativada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da conexão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast({
      title: "Configuração atualizada",
      description: "As alterações foram salvas.",
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
              <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold">WhatsApp Business</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Connection Status */}
          <div className={`p-4 rounded-lg border ${
            isConnected ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isConnected ? 'bg-[#25D366]' : 'bg-gray-400'
                }`}>
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Status da conexão</p>
                  <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
            
            {isConnected && (
              <div className="text-sm text-gray-600">
                <p>Número: +55 47 97367-3966</p>
                <p>Última sincronização: Hoje às 14:32</p>
                <p>Próxima atualização: Jun. 27 • Manhã</p>
              </div>
            )}
          </div>

          {/* Connection Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Power className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Integração WhatsApp</p>
                <p className="text-sm text-gray-500">Ativar/desativar conexão</p>
              </div>
            </div>
            <Button
              onClick={handleToggleConnection}
              disabled={loading}
              variant={isConnected ? "destructive" : "default"}
              className="rounded-full"
            >
              {loading ? 'Alterando...' : (isConnected ? 'Desconectar' : 'Conectar')}
            </Button>
          </div>

          {/* Settings (only visible when connected) */}
          {isConnected && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Configurações</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Respostas automáticas</p>
                      <p className="text-sm text-gray-500">Enviar mensagens automáticas</p>
                    </div>
                    <Switch 
                      checked={settings.autoResponses} 
                      onCheckedChange={() => handleSettingChange('autoResponses')} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Captura de leads</p>
                      <p className="text-sm text-gray-500">Salvar novos contatos automaticamente</p>
                    </div>
                    <Switch 
                      checked={settings.leadCapture} 
                      onCheckedChange={() => handleSettingChange('leadCapture')} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Horário comercial</p>
                      <p className="text-sm text-gray-500">Respeitar horário de funcionamento</p>
                    </div>
                    <Switch 
                      checked={settings.businessHours} 
                      onCheckedChange={() => handleSettingChange('businessHours')} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Notificações</p>
                      <p className="text-sm text-gray-500">Receber alertas de mensagens</p>
                    </div>
                    <Switch 
                      checked={settings.notifications} 
                      onCheckedChange={() => handleSettingChange('notifications')} 
                    />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Estatísticas (últimos 30 dias)</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">156</p>
                    <p className="text-xs text-blue-700">Mensagens</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">23</p>
                    <p className="text-xs text-blue-700">Novos leads</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white rounded-full py-3"
          >
            Concluir
          </Button>
        </div>
      </div>
    </div>
  );
};