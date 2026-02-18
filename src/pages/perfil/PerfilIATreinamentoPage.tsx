import React, { useState } from 'react';
import { ArrowLeft, Brain, RefreshCw, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function PerfilIATreinamentoPage() {
  const [loading, setLoading] = useState(false);
  const [reindexing, setReindexing] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();

  const handleToggleActive = async (checked: boolean) => {
    setLoading(true);
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsActive(checked);
      toast({
        title: checked ? "Treinamento ativado" : "Treinamento desativado",
        description: checked ? 
          "O treinamento personalizado da IA foi ativado." : 
          "O treinamento personalizado da IA foi desativado.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do treinamento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReindex = async () => {
    setReindexing(true);
    
    try {
      // Simular processo de reindexação
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Reindexação concluída",
        description: "Os dados foram atualizados e a IA foi retreinada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na reindexação",
        description: "Não foi possível reindexar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setReindexing(false);
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
            <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-500">Configure o treinamento personalizado</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Status do Treinamento</h1>
            {isActive && <CheckCircle className="w-6 h-6 text-green-500" />}
          </div>
          
          <div className={`p-6 rounded-2xl border-2 ${
            isActive
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-200 dark:border-neutral-800 bg-gray-800/50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-[hsl(var(--accent))]' : 'bg-gray-600'
                }`}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="font-medium text-gray-900 dark:text-white text-lg">
                    {isActive ? 'Ativo' : 'Inativo'}
                  </p>
                  <p className={`text-sm ${
                    isActive ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {isActive ? 'Treinamento personalizado em funcionamento' : 'Treinamento personalizado desativado'}
                  </p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full ${
                isActive ? 'bg-green-500' : 'bg-gray-600'
              }`}></div>
            </div>
            
            {isActive && (
              <div className="text-sm text-gray-400 space-y-1">
                <p>Última atualização: Hoje às 15:42</p>
                <p>Dados indexados: 1.247 registros</p>
                <p>Próxima sincronização: Amanhã às 06:00</p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Configurações</h2>
          
          <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-gray-900 dark:text-white font-medium">Treinamento Personalizado</label>
              <p className="text-sm text-gray-400">
                Permite que a IA aprenda com seus dados específicos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => handleToggleActive(e.target.checked)}
                disabled={loading}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
            </label>
          </div>
        </div>

        {/* Actions Card */}
        {isActive && (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Ações</h2>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={reindexing}
                  className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors border border-gray-200 dark:border-neutral-800 flex items-center justify-center gap-2"
                >
                  {reindexing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Reindexando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Reindexar Dados
                    </>
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reindexar dados</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá reprocessar todos os seus dados e retreinar a IA. O processo pode levar alguns minutos e a IA ficará temporariamente indisponível durante a atualização.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => toast({ title: 'Reindexação cancelada' })}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleReindex}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}