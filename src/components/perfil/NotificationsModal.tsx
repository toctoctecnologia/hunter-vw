
import { ArrowLeft, Bell, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal = ({ isOpen, onClose }: NotificationsModalProps) => {
  const [notifications, setNotifications] = useState({
    leads: true,
    vendas: true,
    servicos: true,
    agenda: true,
    whatsapp: true,
    email: false,
    push: true,
    marketing: false,
  });

  if (!isOpen) return null;

  const handleToggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg h-dvh">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Notificações</h1>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className="text-center">
            <Bell className="w-16 h-16 text-[hsl(var(--accent))] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Configurar Notificações</h2>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Notificações do App</h3>
            
            {[
              { key: 'leads', label: 'Novos Leads', desc: 'Receber notificações de novos leads' },
              { key: 'vendas', label: 'Vendas', desc: 'Atualizações sobre vendas' },
              { key: 'servicos', label: 'Serviços', desc: 'Lembretes de serviços agendados' },
              { key: 'agenda', label: 'Agenda', desc: 'Compromissos e eventos' },
              { key: 'whatsapp', label: 'WhatsApp', desc: 'Mensagens do WhatsApp Business' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
                <Switch 
                  checked={notifications[key]} 
                  onCheckedChange={() => handleToggle(key)} 
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Tipos de Notificação</h3>
            
            {[
              { key: 'push', label: 'Push Notifications', desc: 'Notificações na tela' },
              { key: 'email', label: 'Email', desc: 'Notificações por email' },
              { key: 'marketing', label: 'Marketing', desc: 'Ofertas e novidades' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
                <Switch 
                  checked={notifications[key]} 
                  onCheckedChange={() => handleToggle(key)} 
                />
              </div>
            ))}
          </div>

          <Button className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
