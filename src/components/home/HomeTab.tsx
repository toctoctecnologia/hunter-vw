import { useEffect, useRef, useState, type UIEvent } from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLauncher from '@/components/header/AppLauncher';
import { AgendaTab } from './agenda/AgendaTab';
import { ServicosTab } from './ServicosTab';
import DashboardModular from '@/components/dashboard-modular/DashboardModular';
import { HOME_ALUGUEIS_UNIFIED_WIDGETS } from '@/components/dashboard-modular/widgets';

interface HomeTabProps {
  onNavigateToTab: (tab: string) => void;
}

export const HomeTab = ({ onNavigateToTab }: HomeTabProps) => {
  const [currentNotificationSlide, setCurrentNotificationSlide] = useState(0);
  const [activeView, setActiveView] = useState('home');
  const notificationScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const importantNotifications = [
    {
      id: 1,
      title: 'Notificações Importantes',
      message: '5 leads aguardando retorno urgente',
      count: 5,
      action: 'Ver Leads',
    },
    {
      id: 2,
      title: 'Lembretes do Dia',
      message: '3 visitas agendadas para hoje',
      count: 3,
      action: 'Ver Agenda',
    },
    {
      id: 3,
      title: 'Tarefas Importantes',
      message: 'Está na sua agenda captar imóvel do seu João, não se esqueça',
      count: 1,
      action: 'Ver Agenda',
    },
    {
      id: 4,
      title: 'Comissões',
      message: 'R$ 2.500 em comissões pendentes',
      count: 2500,
      action: 'Ver Valores',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!notificationScrollRef.current) return;

      const itemWidth = 350;
      const maxScroll = (importantNotifications.length - 1) * itemWidth;
      const scrollLeft = notificationScrollRef.current.scrollLeft;

      if (scrollLeft >= maxScroll) {
        notificationScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        setCurrentNotificationSlide(0);
      } else {
        const nextSlide = currentNotificationSlide + 1;
        notificationScrollRef.current.scrollTo({ left: nextSlide * itemWidth, behavior: 'smooth' });
        setCurrentNotificationSlide(nextSlide);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentNotificationSlide, importantNotifications.length]);

  const handleNotificationScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const itemWidth = 350;
    setCurrentNotificationSlide(Math.round(scrollLeft / itemWidth));
  };

  if (activeView === 'agenda') {
    return <AgendaTab onClose={() => setActiveView('home')} />;
  }

  if (activeView === 'servicos') {
    return <ServicosTab onClose={() => setActiveView('home')} />;
  }

  return (
    <div className="bg-card min-h-full">
      <div className="h-14 bg-card flex items-center justify-between px-4 border-b border-border relative md:hidden">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/servicos')} aria-label="Abrir menu" className="p-2 mr-1">
            <Menu size={20} className="text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Olá, Paulo</h1>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/pesquisa')}>
            <Search size={20} className="text-muted-foreground" />
          </button>
          <button onClick={() => navigate('/notificacoes')}>
            <Bell size={20} className="text-muted-foreground" />
          </button>
          <AppLauncher />
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div
            ref={notificationScrollRef}
            className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
            onScroll={handleNotificationScroll}
          >
            {importantNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex-shrink-0 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentSoft))] rounded-xl p-4 text-white shadow-md"
                style={{ width: '350px', maxWidth: '350px', scrollSnapAlign: 'start' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white mb-1">{notification.title}</h3>
                      <p className="text-xs text-white/90">{notification.message}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{notification.count}</div>
                  </div>
                </div>

                <button
                  className="bg-white text-[hsl(var(--accent))] rounded-xl text-xs font-semibold active:scale-95 transition-transform px-4 py-2"
                  onClick={() => (notification.action === 'Ver Leads' ? onNavigateToTab('vendas') : undefined)}
                >
                  {notification.action}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-1 mt-3">
            {importantNotifications.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  index === currentNotificationSlide ? 'w-2 h-2 bg-[hsl(var(--accent))]' : 'w-1.5 h-1.5 bg-[#D8D8D8]'
                }`}
              />
            ))}
          </div>
        </div>

        <DashboardModular context="home" title="Home" widgets={HOME_ALUGUEIS_UNIFIED_WIDGETS} />
      </div>
    </div>
  );
};
