import { api } from '@/shared/lib/api';
import { CalendarAppointment } from '@/features/dashboard/calendar/types';
import { AppointmentFormData } from '@/features/dashboard/calendar/components/modal/save-appointment/schema';
import { getGoogleCalendarToken, isGoogleCalendarAvailable } from '@/features/dashboard/calendar/api/google-calendar';

function putGoogleCalendarTokenInHeaders() {
  const isGoogleAvailable = isGoogleCalendarAvailable();
  if (!isGoogleAvailable) return null;
  return {
    headers: {
      googleCalendarToken: getGoogleCalendarToken(),
    },
  };
}

export async function getAppointments(date: string) {
  const { data } = await api.get<CalendarAppointment[]>(`dashboard/schedule/appointment?date=${date}`);
  return data;
}

export async function getAppointment(uuid: string) {
  const { data } = await api.get<CalendarAppointment>(`dashboard/schedule/appointment/${uuid}`);
  return data;
}

export async function createAppointment(appointment: AppointmentFormData) {
  const headers = putGoogleCalendarTokenInHeaders() ?? undefined;
  const { data } = await api.post<CalendarAppointment>(
    'dashboard/schedule/appointment',
    {
      ...appointment,
      endingTime: `${String(appointment.endingTime.hour).padStart(2, '0')}:${String(
        appointment.endingTime.minute,
      ).padStart(2, '0')}:${String(appointment.endingTime.second).padStart(2, '0')}`,
      startingTime: `${String(appointment.startingTime.hour).padStart(2, '0')}:${String(
        appointment.startingTime.minute,
      ).padStart(2, '0')}:${String(appointment.startingTime.second).padStart(2, '0')}`,
    },
    headers,
  );

  return data;
}

export async function updateAppointment(appointmentId: string, appointment: AppointmentFormData) {
  const headers = putGoogleCalendarTokenInHeaders() ?? undefined;
  const { data } = await api.put<CalendarAppointment>(
    `dashboard/schedule/appointment/${appointmentId}`,
    {
      ...appointment,
      endingTime: `${String(appointment.endingTime.hour).padStart(2, '0')}:${String(
        appointment.endingTime.minute,
      ).padStart(2, '0')}:${String(appointment.endingTime.second).padStart(2, '0')}`,
      startingTime: `${String(appointment.startingTime.hour).padStart(2, '0')}:${String(
        appointment.startingTime.minute,
      ).padStart(2, '0')}:${String(appointment.startingTime.second).padStart(2, '0')}`,
    },
    headers,
  );
  return data;
}

export async function deleteAppointment(appointmentId: string) {
  const headers = putGoogleCalendarTokenInHeaders() ?? undefined;
  await api.delete(`dashboard/schedule/appointment/${appointmentId}`, headers);
}
