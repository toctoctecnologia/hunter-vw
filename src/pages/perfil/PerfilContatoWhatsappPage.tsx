import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, CheckCircle, XCircle, Power, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function PerfilContatoWhatsappPage() {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const { toast } = useToast();

  const handleConnect = async () => {
    setLoading(true);
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast({
        title: "WhatsApp conectado",
        description: "Integração com WhatsApp Business ativada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao WhatsApp Business.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConnected(false);
      toast({
        title: "WhatsApp desconectado",
        description: "Integração com WhatsApp Business desativada.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível desconectar do WhatsApp Business.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/perfil" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#25D366] rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-500">Gerencie sua integração com WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Status da Conexão</h1>
            {isConnected && <CheckCircle className="w-6 h-6 text-green-500" />}
          </div>
          
          <div className={`p-6 rounded-2xl border-2 ${
            isConnected 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-red-500 bg-red-500/10'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isConnected ? 'bg-[#25D366]' : 'bg-gray-600'
                }`}>
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="font-medium text-gray-900 dark:text-white text-lg">
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </p>
                  <p className={`text-sm ${
                    isConnected ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isConnected ? 'Integração ativa' : 'Integração inativa'}
                  </p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            </div>
            
            {isConnected && (
              <div className="text-sm text-gray-400 space-y-1">
                <p>Número: +55 47 97367-3966</p>
                <p>Última sincronização: Hoje às 14:32</p>
                <p>Status: Funcionando normalmente</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Ações</h2>
          
          <div className="space-y-4">
            {isConnected ? (
              <>
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors border border-gray-200 dark:border-neutral-800 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Reautorizando...
                    </>
                  ) : (
                    <>
                      <Power className="w-5 h-5" />
                      Reautorizar Conexão
                    </>
                  )}
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={loading}
                      className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Desconectar WhatsApp
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Desconectar WhatsApp</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação irá desativar a integração com o WhatsApp Business. Você não receberá mais mensagens automaticamente e precisará reconectar para reativar a funcionalidade.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => toast({ title: 'Desconexão cancelada' })}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDisconnect}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    Conectar WhatsApp Business
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}