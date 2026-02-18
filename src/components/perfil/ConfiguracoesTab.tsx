
import React, { useState } from 'react';
import { debugLog } from '@/utils/debug';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  HelpCircle, 
  Calendar,
  RefreshCw,
  ChevronRight,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ConfiguracoesTabProps {
  onClose?: () => void;
}

export const ConfiguracoesTab = ({ onClose }: ConfiguracoesTabProps) => {
  const [syncSettings, setSyncSettings] = useState({
    googleCalendar: false,
    appleCalendar: false,
    tocTocAgenda: true,
    autoSync: true,
    syncNotifications: true
  });

  const handleSyncToggle = (setting: keyof typeof syncSettings) => {
    setSyncSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const configOptions = [
    {
      icon: User,
      title: 'Informações Pessoais',
      description: 'Editar perfil e dados pessoais',
      action: () => debugLog('Navigate to profile')
    },
    {
      icon: Calendar,
      title: 'Sincronização',
      description: 'Configurar calendários e agenda',
      action: () => debugLog('Navigate to sync settings'),
      hasSubmenu: true
    },
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Configurar alertas e lembretes',
      action: () => debugLog('Navigate to notifications')
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Senha e autenticação',
      action: () => debugLog('Navigate to security')
    },
    {
      icon: Palette,
      title: 'Aparência',
      description: 'Tema e personalização',
      action: () => debugLog('Navigate to theme')
    },
    {
      icon: Settings,
      title: 'Configurações Avançadas',
      description: 'Opções técnicas e integração',
      action: () => debugLog('Navigate to advanced settings')
    },
    {
      icon: HelpCircle,
      title: 'Ajuda e Suporte',
      description: 'Central de ajuda e contato',
      action: () => debugLog('Navigate to help')
    }
  ];

  return (
    <div className="flex flex-col bg-gray-50 h-dvh w-full md:max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            {onClose && (
              <button onClick={onClose} className="mr-3 p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
            )}
            <h1 className="font-semibold text-lg text-gray-900">Configurações</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Sync Settings Section */}
        <div className="bg-white border-b border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sincronização</h2>
          
          {/* Individual Calendar Sync Options */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Google Calendar</h3>
                  <p className="text-sm text-gray-600">Sincronizar com Google Agenda</p>
                </div>
              </div>
              <Switch
                checked={syncSettings.googleCalendar}
                onCheckedChange={() => handleSyncToggle('googleCalendar')}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Apple Calendar</h3>
                  <p className="text-sm text-gray-600">Sincronizar com Calendário Apple</p>
                </div>
              </div>
              <Switch
                checked={syncSettings.appleCalendar}
                onCheckedChange={() => handleSyncToggle('appleCalendar')}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Toc Toc Agenda</h3>
                  <p className="text-sm text-gray-600">Agenda interna do sistema</p>
                </div>
              </div>
              <Switch
                checked={syncSettings.tocTocAgenda}
                onCheckedChange={() => handleSyncToggle('tocTocAgenda')}
              />
            </div>
          </div>

          {/* Auto Sync Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Sincronização automática</h4>
                <p className="text-sm text-gray-600">Atualizar dados automaticamente</p>
              </div>
              <Switch
                checked={syncSettings.autoSync}
                onCheckedChange={() => handleSyncToggle('autoSync')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Notificações de sync</h4>
                <p className="text-sm text-gray-600">Receber avisos de sincronização</p>
              </div>
              <Switch
                checked={syncSettings.syncNotifications}
                onCheckedChange={() => handleSyncToggle('syncNotifications')}
              />
            </div>
          </div>

          {/* Sync Now Button */}
          <button className="w-full mt-6 bg-[hsl(var(--accent))] hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors">
            Sincronizar Agora
          </button>
        </div>

        {/* Other Configuration Options */}
        <div className="p-4">
          <div className="space-y-2">
            {configOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <option.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
