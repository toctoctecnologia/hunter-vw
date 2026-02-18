'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { CalendarAppointment } from '@/features/dashboard/calendar/types';

import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '@/features/dashboard/calendar/api/appointment';

import { AppointmentFormData } from '@/features/dashboard/calendar/components/modal/save-appointment/schema';
import { SaveAppointmentModal } from '@/features/dashboard/calendar/components/modal/save-appointment';
import { DateSelector } from '@/features/dashboard/calendar/components/date-selector';
import { ScheduleView } from '@/features/dashboard/calendar/components/schedule-view';
import { Loading } from '@/shared/components/loading';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function ScheduleTab() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [editingEvent, setEditingEvent] = useState<CalendarAppointment | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | undefined>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendar-events', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => getAppointments(format(selectedDate, 'yyyy-MM-dd')),
  });

  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Compromisso criado com sucesso!');
      setDialogOpen(false);
      setSelectedHour(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AppointmentFormData }) => updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Compromisso atualizado com sucesso!');
      setDialogOpen(false);
      setEditingEvent(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Compromisso excluído com sucesso!');
    },
  });

  const handleCreateEvent = (hour?: number) => {
    setSelectedHour(hour);
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const handleSubmitEvent = (data: AppointmentFormData) => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.uuid, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEditEvent = (event: CalendarAppointment) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  return (
    <>
      <SaveAppointmentModal
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingEvent(null);
          setSelectedHour(undefined);
        }}
        onSubmit={handleSubmitEvent}
        selectedDate={selectedDate}
        selectedHour={selectedHour}
        editingEvent={editingEvent}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} onCreateEvent={() => handleCreateEvent()} />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {hasFeature(user?.userInfo.profile.permissions, '1304') && (
            <ScheduleView
              selectedDate={selectedDate}
              events={events}
              onCreateEvent={handleCreateEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={(eventId) => deleteMutation.mutate(eventId)}
            />
          )}
        </>
      )}
    </>
  );
}
