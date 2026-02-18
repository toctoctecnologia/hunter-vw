import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Save, Loader2, Mail, MessageSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useNotificationPrefs } from '@/hooks/useNotificationPrefs';
import type { NotificationPrefs } from '@/types/notifications';

type BooleanPrefKey = Exclude<keyof NotificationPrefs, 'pushPriority' | 'pushSound'>;

export default function PerfilNotificacoesPage() {
  const { prefs, load, save } = useNotificationPrefs();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationPrefs>(prefs);
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setSettings(prefs);
  }, [prefs]);

  const handleToggleSetting = (key: BooleanPrefKey) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      await save(settings);

      toast({
        title: 'Configurações salvas',
        description: 'Suas preferências de notificação foram atualizadas.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
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
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-500">Configure suas preferências de notificação</p>
            </div>
          </div>
        </div>

        {/* Notifications Settings Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Configurações de Notificação</h1>
          
          <div className="space-y-6">
            {/* Notification Channels */}
            <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-[hsl(var(--accent))]" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Canais de Notificação</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Notificações por Email</p>
                    <p className="text-sm text-gray-400">Receber notificações via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={() => handleToggleSetting('emailNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Notificações Push</p>
                    <p className="text-sm text-gray-400">Receber notificações no navegador/app</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={() => handleToggleSetting('pushNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">SMS</p>
                    <p className="text-sm text-gray-400">Receber notificações via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={() => handleToggleSetting('smsNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Business Notifications */}
            <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-[hsl(var(--accent))]" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notificações de Negócio</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Novos Leads</p>
                    <p className="text-sm text-gray-400">Notificar quando receber novos leads</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.leadNotifications}
                      onChange={() => handleToggleSetting('leadNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Lembretes de Agenda</p>
                    <p className="text-sm text-gray-400">Lembrar de compromissos agendados</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.appointmentReminders}
                      onChange={() => handleToggleSetting('appointmentReminders')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Relatórios Semanais</p>
                    <p className="text-sm text-gray-400">Receber resumo semanal de atividades</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.weeklyReports}
                      onChange={() => handleToggleSetting('weeklyReports')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* System Notifications */}
            <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-[hsl(var(--accent))]" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notificações do Sistema</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Atualizações do Sistema</p>
                    <p className="text-sm text-gray-400">Notificar sobre novas funcionalidades</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.systemUpdates}
                      onChange={() => handleToggleSetting('systemUpdates')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Emails de Marketing</p>
                    <p className="text-sm text-gray-400">Receber dicas e promoções</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.marketingEmails}
                      onChange={() => handleToggleSetting('marketingEmails')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--accent))]"></div>
                  </label>
                </div>
              </div>
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
