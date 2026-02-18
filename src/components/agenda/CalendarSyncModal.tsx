import React, { useState } from 'react';
import { X, Calendar, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useCalendar } from '@/context/CalendarContext';
import { useToast } from '@/hooks/use-toast';
interface CalendarSyncModalProps {
  onClose: () => void;
}
export const CalendarSyncModal = ({
  onClose
}: CalendarSyncModalProps) => {
  const [syncSettings, setSyncSettings] = useState({
    googleCalendar: false,
    appleCalendar: false,
    tocTocAgenda: true,
    autoSync: true,
    syncNotifications: true
  });
  const [syncing, setSyncing] = useState(false);
  const {
    syncGoogleCalendar,
    syncAppleCalendar,
    storeGoogleToken,
    storeAppleToken,
    revokeGoogleToken,
    revokeAppleToken
  } = useCalendar();
  const { toast } = useToast();

  const handleSyncToggle = async (setting: keyof typeof syncSettings) => {
    const newValue = !syncSettings[setting];
    setSyncSettings(prev => ({
      ...prev,
      [setting]: newValue
    }));

    try {
      if (setting === 'googleCalendar') {
        if (newValue) {
          const token = await syncGoogleCalendar();
          if (token) await storeGoogleToken(token);
          toast({ title: 'Google Calendar conectado' });
        } else {
          await revokeGoogleToken();
          toast({ title: 'Google Calendar desconectado' });
        }
      }
      if (setting === 'appleCalendar') {
        if (newValue) {
          const token = await syncAppleCalendar();
          if (token) await storeAppleToken(token);
          toast({ title: 'Apple Calendar conectado' });
        } else {
          await revokeAppleToken();
          toast({ title: 'Apple Calendar desconectado' });
        }
      }
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a sincronização',
        variant: 'destructive'
      });
    }
  };
  const handleSyncNow = async () => {
    setSyncing(true);
    // Simulate sync process
    setTimeout(() => {
      setSyncing(false);
    }, 2000);
  };
  return <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-content bg-white rounded-3xl w-full max-w-sm shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentHover))] p-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Sincronizar Calendários</h2>
              <p className="text-white/80 text-xs mt-1">Mantenha tudo sincronizado</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Calendar Sync Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Google Calendar</h3>
                  <p className="text-sm text-gray-600">Sincronizar com Google Agenda</p>
                </div>
              </div>
              <Switch checked={syncSettings.googleCalendar} onCheckedChange={() => handleSyncToggle('googleCalendar')} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Apple Calendar</h3>
                  <p className="text-sm text-gray-600">Sincronizar com Calendário Apple</p>
                </div>
              </div>
              <Switch checked={syncSettings.appleCalendar} onCheckedChange={() => handleSyncToggle('appleCalendar')} />
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[hsl(var(--accent))] rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Toc Toc Agenda</h3>
                  <p className="text-sm text-gray-600">Agenda interna do sistema</p>
                </div>
              </div>
              
            </div>
          </div>

          {/* Auto Sync Settings */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Configurações Automáticas</h3>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium text-gray-900">Sincronização automática</h4>
                <p className="text-sm text-gray-600">Atualizar dados automaticamente</p>
              </div>
              <Switch checked={syncSettings.autoSync} onCheckedChange={() => handleSyncToggle('autoSync')} />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium text-gray-900">Notificações de sync</h4>
                <p className="text-sm text-gray-600">Receber avisos de sincronização</p>
              </div>
              <Switch checked={syncSettings.syncNotifications} onCheckedChange={() => handleSyncToggle('syncNotifications')} />
            </div>
          </div>

          {/* Sync Status */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Última sincronização</span>
            </div>
            <p className="text-sm text-green-700">
              Hoje às 14:32 - Todos os calendários atualizados
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pt-0 flex-shrink-0">
          <button onClick={handleSyncNow} disabled={syncing} className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] disabled:bg-gray-300 text-white py-3 rounded-2xl font-semibold transition-all duration-200 active:scale-95 text-sm flex items-center justify-center space-x-2">
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
          </button>
        </div>
      </div>
    </div>;
};