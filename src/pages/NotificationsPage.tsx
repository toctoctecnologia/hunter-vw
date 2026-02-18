import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Calendar, AlertTriangle, Phone, Bell, CheckCircle, Clock, X, ArrowLeft } from 'lucide-react';
export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([{
    id: 1,
    icon: User,
    title: 'Novo Lead',
    subtitle: 'João Silva',
    description: 'Interessado em casa no centro da cidade',
    color: '#007AFF',
    time: '5 min atrás',
    read: false,
    type: 'lead'
  }, {
    id: 2,
    icon: Building2,
    title: 'Lembrete',
    subtitle: 'Enviar contrato',
    description: 'Contrato do apartamento na Rua das Flores',
    color: 'hsl(var(--accent))',
    time: '15 min atrás',
    read: false,
    type: 'reminder'
  }, {
    id: 3,
    icon: Calendar,
    title: 'Visita Técnica',
    subtitle: 'agendada',
    description: 'Sessão de fotos com David Michel às 14:00',
    color: '#25D366',
    time: '1 hora atrás',
    read: true,
    type: 'appointment'
  }, {
    id: 4,
    icon: AlertTriangle,
    title: 'Alerta',
    subtitle: 'Crédito baixo',
    description: 'Restam apenas 50 créditos para serviços',
    color: '#FF3B30',
    time: '2 horas atrás',
    read: false,
    type: 'alert'
  }, {
    id: 5,
    icon: Phone,
    title: 'Follow-up',
    subtitle: 'Maria Oliveira',
    description: 'Retornar ligação sobre proposta',
    color: '#FF9500',
    time: '3 horas atrás',
    read: true,
    type: 'followup'
  }, {
    id: 6,
    icon: Building2,
    title: 'Novo Imóvel',
    subtitle: 'Casa Luxo',
    description: 'Imóvel adicionado ao seu portfólio',
    color: '#34C759',
    time: '5 horas atrás',
    read: true,
    type: 'property'
  }, {
    id: 7,
    icon: CheckCircle,
    title: 'Comissão Recebida',
    subtitle: 'R$ 2.500,00',
    description: 'Venda do apartamento finalizada',
    color: '#007AFF',
    time: '1 dia atrás',
    read: true,
    type: 'commission'
  }, {
    id: 8,
    icon: Calendar,
    title: 'Reunião Cancelada',
    subtitle: 'Cliente Pedro Silva',
    description: 'Reagendar para próxima semana',
    color: '#FF3B30',
    time: '2 dias atrás',
    read: true,
    type: 'cancelled'
  }]);
  const [filter, setFilter] = useState('all');
  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => notif.id === id ? {
      ...notif,
      read: true
    } : notif));
  };
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({
      ...notif,
      read: true
    })));
  };
  const handleDeleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });
  const unreadCount = notifications.filter(n => !n.read).length;
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-card-foreground">Notificações</h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-[hsl(var(--accent))] hover:text-[hsl(var(--accentHover))] transition-colors my-0 text-xs font-medium"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-border bg-card/60">
        <div className="flex px-4">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              filter === 'all' ? 'border-[hsl(var(--accent))] text-[hsl(var(--accent))]' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              filter === 'unread' ? 'border-[hsl(var(--accent))] text-[hsl(var(--accent))]' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Não lidas ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              filter === 'read' ? 'border-[hsl(var(--accent))] text-[hsl(var(--accent))]' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Lidas ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredNotifications.map(notification => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/60 transition-colors ${!notification.read ? 'bg-primary/10' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: notification.color + '20' }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: notification.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm ${!notification.read ? 'text-muted-foreground' : 'text-muted-foreground/80'}`}>
                            {notification.subtitle}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 hover:bg-muted rounded-full transition-colors"
                              title="Marcar como lida"
                            >
                              <CheckCircle className="w-4 h-4 text-[hsl(var(--accent))]" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 hover:bg-muted rounded-full transition-colors"
                            title="Excluir notificação"
                          >
                            <X className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        {!notification.read && <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {filter === 'unread'
                ? 'Nenhuma notificação não lida'
                : filter === 'read'
                  ? 'Nenhuma notificação lida'
                  : 'Nenhuma notificação'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all'
                ? 'Você está em dia com suas notificações!'
                : 'Quando houver notificações, elas aparecerão aqui.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}