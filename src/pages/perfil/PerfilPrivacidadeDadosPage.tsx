import React, { useState } from 'react';
import { ArrowLeft, Eye, Save, Loader2, Shield, Users, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function PerfilPrivacidadeDadosPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    shareAnalytics: true,
    shareWithPartners: false,
    personalizedAds: true,
    dataCollection: true,
    profileVisibility: 'private' as 'public' | 'private' | 'team'
  });
  const { toast } = useToast();

  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleVisibilityChange = (value: 'public' | 'private' | 'team') => {
    setSettings(prev => ({
      ...prev,
      profileVisibility: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Configurações salvas",
        description: "Suas preferências de privacidade foram atualizadas.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
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
            <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-500">Configure como seus dados são utilizados</p>
            </div>
          </div>
        </div>

        {/* Privacy Settings Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Privacidade dos Dados</h1>
          
          <div className="space-y-6">
            {/* Data Collection */}
            <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-[hsl(var(--accent))]" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Coleta de Dados</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                      <p className="text-gray-900 dark:text-white font-medium">Análises de Uso</p>
                    <p className="text-sm text-gray-400">Permitir coleta de dados para melhorar a experiência</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.shareAnalytics}
                      onChange={() => handleToggleSetting('shareAnalytics')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                      <p className="text-gray-900 dark:text-white font-medium">Dados para Parceiros</p>
                    <p className="text-sm text-gray-400">Compartilhar dados anonimizados com parceiros</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.shareWithPartners}
                      onChange={() => handleToggleSetting('shareWithPartners')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                      <p className="text-gray-900 dark:text-white font-medium">Publicidade Personalizada</p>
                    <p className="text-sm text-gray-400">Usar dados para personalizar anúncios</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.personalizedAds}
                      onChange={() => handleToggleSetting('personalizedAds')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Profile Visibility */}
            <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[hsl(var(--accent))]" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Visibilidade do Perfil</h3>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={settings.profileVisibility === 'private'}
                    onChange={() => handleVisibilityChange('private')}
                    className="w-4 h-4 text-[hsl(var(--accent))] bg-gray-700 border-gray-200 dark:border-neutral-800 focus:ring-[hsl(var(--accent))]"
                  />
                  <div>
                      <p className="text-gray-900 dark:text-white font-medium">Privado</p>
                    <p className="text-sm text-gray-400">Apenas você pode ver suas informações</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="team"
                    checked={settings.profileVisibility === 'team'}
                    onChange={() => handleVisibilityChange('team')}
                    className="w-4 h-4 text-[hsl(var(--accent))] bg-gray-700 border-gray-200 dark:border-neutral-800 focus:ring-[hsl(var(--accent))]"
                  />
                  <div>
                      <p className="text-gray-900 dark:text-white font-medium">Equipe</p>
                    <p className="text-sm text-gray-400">Visível para membros da sua equipe</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={settings.profileVisibility === 'public'}
                    onChange={() => handleVisibilityChange('public')}
                    className="w-4 h-4 text-[hsl(var(--accent))] bg-gray-700 border-gray-200 dark:border-neutral-800 focus:ring-[hsl(var(--accent))]"
                  />
                  <div>
                      <p className="text-gray-900 dark:text-white font-medium">Público</p>
                    <p className="text-sm text-gray-400">Visível para todos os usuários</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-500" />
                <p className="text-sm text-white font-medium">Seus dados estão seguros</p>
              </div>
              <p className="text-xs text-gray-400">
                Utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança para proteger suas informações.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Salvar Configurações
            </>
          )}
        </button>
      </div>
    </div>
  );
}