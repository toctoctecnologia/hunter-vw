
import React, { useMemo, useState, useEffect } from 'react';
import { AgendaTab } from '@/components/agenda/AgendaTab';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { ActionModal } from '@/components/common/ActionModal';
import FloatingAddButton from '@/components/ui/FloatingAddButton';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTasks } from '@/hooks/agenda/useTasks';
import type { TaskProperty } from '@/types/task';
import { TaskPropertyModal } from '@/components/agenda/Task';
import { ServiceAgendaPanel } from '@/components/servicos/ServiceAgendaPanel';
import { getAgendaUserPreference } from '@/services/agendaNavigation';
import { isSameDay, isSameWeek } from 'date-fns';
import type { AgendaView } from '@/services/agendaNavigation';
import { AgendaErrorBoundary } from '@/components/agenda/AgendaErrorBoundary';

export default function AgendaPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'agenda' ? 'agenda' : 'tasks';
  const dateParam = searchParams.get('date');
  const parsedDate = dateParam ? new Date(dateParam) : new Date();
  const initialDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const viewParam = searchParams.get('view');
  const sourceType = searchParams.get('sourceType') ?? undefined;
  const contractId = searchParams.get('contractId') ?? undefined;
  const invoiceId = searchParams.get('invoiceId') ?? undefined;
  const eventId = searchParams.get('eventId') ?? undefined;
  const startAt = searchParams.get('startAt') ?? undefined;
  const [showActionModal, setShowActionModal] = useState(false);
  const [propertyInfo, setPropertyInfo] = useState<TaskProperty | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const isMobile = useIsMobile();
  const userId = useMemo(() => {
    if (typeof window === 'undefined') return 'demo-user';
    return localStorage.getItem('hunter:userId') ?? 'demo-user';
  }, []);

  const source = searchParams.get('source');
  const taskId = searchParams.get('taskId');
  const { data: tasks = [] } = useTasks(initialDate);

  const computedView = useMemo<AgendaView>(() => {
    const allowed = ['day', 'week', 'month'] as const;
    if (viewParam && allowed.includes(viewParam as AgendaView)) {
      return viewParam as AgendaView;
    }
    const preferred = getAgendaUserPreference(userId);
    if (sourceType === 'BillingRule' && startAt) {
      if (preferred) return preferred;
      const eventDate = new Date(startAt);
      if (Number.isNaN(eventDate.getTime())) return 'week';
      if (isSameDay(eventDate, new Date())) return 'day';
      if (isSameWeek(eventDate, new Date(), { weekStartsOn: 1 })) return 'week';
      return 'month';
    }
    return preferred ?? 'week';
  }, [viewParam, sourceType, startAt, userId]);

  const deepLink = useMemo(
    () => ({
      sourceType,
      contractId,
      invoiceId,
      eventId,
      startAt,
      view: computedView,
      userId
    }),
    [sourceType, contractId, invoiceId, eventId, startAt, computedView, userId]
  );

  const updateTabInQuery = (tab: 'agenda' | 'tasks') => {
    const params = new URLSearchParams(location.search);
    params.set('tab', tab);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  useEffect(() => {
    if (source === 'lead' && taskId && tasks.length > 0) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.type === 'visit' && task.property) {
        setPropertyInfo(task.property);
        setShowPropertyModal(true);
      }
    }
  }, [source, taskId, tasks]);

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'servicos':
        navigate('/servicos');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      default:
        break;
    }
  };

  const handleAddClick = () => {
    setShowActionModal(true);
  };

  const handleClose = () => {
    navigate('/');
  };

  const handlePropertyModalClose = () => {
    setShowPropertyModal(false);
    const params = new URLSearchParams(location.search);
    params.delete('source');
    params.delete('taskId');
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  return (
    <ResponsiveLayout
      activeTab="agenda"
      setActiveTab={handleTabChange}
      onAddClick={handleAddClick}
    >
      <AgendaErrorBoundary>
        {viewParam === 'servicos' ? (
          <div className="w-full px-6 py-6">
            <ServiceAgendaPanel />
          </div>
        ) : (
          <AgendaTab
            onClose={handleClose}
            initialDate={startAt ? new Date(startAt) : initialDate}
            initialTab={initialTab}
            initialView={computedView}
            deepLink={deepLink}
            onTabChange={updateTabInQuery}
          />
        )}
        {viewParam !== 'servicos' && showActionModal && (
          <ActionModal
            isOpen={showActionModal}
            onClose={() => setShowActionModal(false)}
          />
        )}
        {viewParam !== 'servicos' && !isMobile && (
          <FloatingAddButton onClick={() => navigate('/agenda/agendar')} />
        )}
        {viewParam !== 'servicos' && showPropertyModal && propertyInfo && (
          <TaskPropertyModal
            property={propertyInfo}
            onClose={handlePropertyModalClose}
          />
        )}
      </AgendaErrorBoundary>
    </ResponsiveLayout>
  );
}
