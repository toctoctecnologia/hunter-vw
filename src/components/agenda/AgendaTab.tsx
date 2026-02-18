import React, { useState, useEffect } from 'react';
import { debugLog } from '@/utils/debug';
import { DailyCalendar, type DailyCalendarHandle } from '@/components/agenda/Calendar';
import { EventViewModal, EditEventModal } from '@/components/agenda/Event';
import { EventModalContext } from '@/context/EventModalContext';
import type { Event } from '@/types/event';
import { useEvents, useAgendaDate } from '@/hooks/agenda';
import type { AgendaView } from '@/services/agendaNavigation';
import { onAgendaOpenEvent } from '@/services/agendaNavigation';
import { useQueryClient } from '@tanstack/react-query';

interface AgendaTabProps {
  onClose: () => void;
  initialDate?: Date;
  initialTab?: 'agenda' | 'tasks';
  initialView?: AgendaView;
  deepLink?: {
    sourceType?: string;
    contractId?: string;
    invoiceId?: string;
    eventId?: string;
    startAt?: string;
    view?: AgendaView;
    userId?: string;
  };
  calendarRef?: React.Ref<DailyCalendarHandle>;
  onTabChange?: (tab: 'agenda' | 'tasks') => void;
}
export const AgendaTab = ({
  onClose,
  initialDate,
  initialTab,
  initialView,
  deepLink,
  calendarRef,
  onTabChange
}: AgendaTabProps) => {
  const { date: selectedDate, setDate: setSelectedDate } = useAgendaDate(initialDate);
  const [activeTab, setActiveTab] = useState<'agenda' | 'tasks'>(initialTab ?? 'tasks');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventView, setShowEventView] = useState(false);
  const [showEventEdit, setShowEventEdit] = useState(false);
  const { data: eventsData = [] } = useEvents();
  const queryClient = useQueryClient();
  const eventsToRender = eventsData;
  const openEventModal = (eventId: string) => {
    const event = eventsToRender.find(e => e.id === eventId);
    if (event) {
      const unifiedEvent: Event = {
        ...event,
        status: event.status || 'pending'
      };
      setSelectedEvent(unifiedEvent);
      setShowEventView(true);
    }
  };
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  useEffect(() => {
    if (initialTab) {
      debugLog('AgendaTab initialTab:', initialTab);
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (deepLink?.eventId) {
      openEventModal(deepLink.eventId);
      setShowEventView(true);
    }
  }, [deepLink?.eventId, eventsToRender]);

  useEffect(() => {
    const unsubscribe = onAgendaOpenEvent(eventId => {
      openEventModal(eventId);
      setShowEventView(true);
    });
    return () => unsubscribe?.();
  }, [eventsToRender]);

  const handleEventPress = (event: Event) => {
    debugLog('Event pressed:', event);
    setSelectedEvent(event);
    setShowEventView(true);
  };
  const handleEventEdit = () => {
    setShowEventView(false);
    setShowEventEdit(true);
  };
  const handleEventUpdated = (updatedEvent: Event) => {
    debugLog('Evento atualizado:', updatedEvent);
    queryClient.invalidateQueries({ queryKey: ['events'] });
    setShowEventEdit(false);
    setSelectedEvent(null);
  };
  const handleCloseModals = () => {
    setShowEventView(false);
    setShowEventEdit(false);
    setSelectedEvent(null);
  };
  const handleTabChange = (tab: 'agenda' | 'tasks') => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  return (
    <EventModalContext.Provider value={{ openEventModal }}>
      <div className="bg-white min-h-full flex flex-col relative">
        <div className="h-14 bg-white flex items-center px-6 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-foreground">
            {activeTab === 'agenda' ? 'Agenda' : 'Tarefas'}
          </h1>
        </div>

        {/* Calendar Content */}
        <div className="flex-1">
          <DailyCalendar
            ref={calendarRef}
            events={eventsToRender.map(ev => ({
              ...ev,
              status: ev.status || 'pending'
            }))}
            onEventPress={handleEventPress}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            initialTab={activeTab}
            initialView={initialView}
            deepLink={deepLink}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Event View Modal */}
        {showEventView && selectedEvent && (
          <EventViewModal
            event={selectedEvent}
            onClose={handleCloseModals}
            onEdit={handleEventEdit}
          />
        )}

        {/* Event Edit Modal */}
        {showEventEdit && selectedEvent && (
          <EditEventModal
            event={selectedEvent}
            onClose={handleCloseModals}
            onEventUpdated={handleEventUpdated}
          />
        )}
      </div>
    </EventModalContext.Provider>
  );
};
