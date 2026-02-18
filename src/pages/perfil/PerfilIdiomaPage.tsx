import React, { useEffect, useState } from 'react';
import { ArrowLeft, Globe, Save, Loader2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useIdioma } from '@/hooks/perfil';

export default function PerfilIdiomaPage() {
  const { language, setLanguage, updating } = useIdioma();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const languages = [
    {
      code: 'pt-BR',
      name: 'Português (Brasil)',
      nativeName: 'Português (BR)',
      flag: '🇧🇷'
    },
    {
      code: 'en-US',
      name: 'English (United States)',
      nativeName: 'English (US)',
      flag: '🇺🇸'
    },
    {
      code: 'es-ES',
      name: 'Español (España)',
      nativeName: 'Español (ES)',
      flag: '🇪🇸'
    },
    {
      code: 'fr-FR',
      name: 'Français (France)',
      nativeName: 'Français (FR)',
      flag: '🇫🇷'
    },
    {
      code: 'de-DE',
      name: 'Deutsch (Deutschland)',
      nativeName: 'Deutsch (DE)',
      flag: '🇩🇪'
    },
    {
      code: 'it-IT',
      name: 'Italiano (Italia)',
      nativeName: 'Italiano (IT)',
      flag: '🇮🇹'
    }
  ];

  const handleSave = async () => {
    try {
      await setLanguage(selectedLanguage);
      toast({
        title: 'Idioma alterado',
        description: 'O idioma da interface foi atualizado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o idioma.',
        variant: 'destructive',
      });
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
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-500">Selecione o idioma da interface</p>
            </div>
          </div>
        </div>

        {/* Language Selection Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Configuração de Idioma</h1>
          
          <div className="space-y-6">
            {/* Current Language */}
              <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Idioma Atual</h3>
              
              <div className="flex items-center gap-4">
                <span className="text-2xl">🇧🇷</span>
                <div>
                    <p className="text-gray-900 dark:text-white font-medium">Português (Brasil)</p>
                  <p className="text-sm text-gray-400">Interface totalmente traduzida</p>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Available Languages */}
              <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Idiomas Disponíveis</h3>
              
              <div className="space-y-3">
                {languages.map((language) => (
                  <label
                    key={language.code}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                      selectedLanguage === language.code
                        ? 'bg-[hsl(var(--accent))]/20 border border-[hsl(var(--accent))]'
                        : 'bg-gray-800 hover:bg-gray-700 border border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="language"
                      value={language.code}
                      checked={selectedLanguage === language.code}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{language.flag}</span>
                    <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium">{language.nativeName}</p>
                      <p className="text-sm text-gray-400">{language.name}</p>
                    </div>
                    {selectedLanguage === language.code && (
                      <Check className="w-5 h-5 text-[hsl(var(--accent))]" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Language Info */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-[hsl(var(--accent))]" />
                <p className="text-sm text-white font-medium">Sobre a Tradução</p>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>• A alteração do idioma será aplicada imediatamente</p>
                <p>• Alguns termos técnicos podem permanecer em inglês</p>
                <p>• Formatos de data e número seguirão o padrão regional</p>
                <p>• Relatórios e documentos manterão o idioma de criação</p>
              </div>
            </div>

            {/* Regional Settings */}
              <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurações Regionais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Formato de Data</p>
                    <p className="text-gray-900 dark:text-white">DD/MM/AAAA</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Formato de Número</p>
                    <p className="text-gray-900 dark:text-white">1.234,56</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Moeda</p>
                    <p className="text-gray-900 dark:text-white">R$ (Real Brasileiro)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Fuso Horário</p>
                    <p className="text-gray-900 dark:text-white">UTC-3 (Brasília)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          disabled={updating || selectedLanguage === language}
          className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {updating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Aplicando...
            </>
          ) : selectedLanguage === language ? (
            <>
              <Check className="w-5 h-5" />
              Idioma Atual
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Aplicar Idioma
            </>
          )}
        </button>
      </div>
    </div>
  );
}
