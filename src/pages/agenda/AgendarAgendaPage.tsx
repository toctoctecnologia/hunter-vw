import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCalendar } from '@/context/CalendarContext';
import { useToast } from '@/hooks/use-toast';
import { EventFormContainer, type EventFormData } from '@/components/agenda/Event';
import { DesktopLayout } from '@/components/shell/DesktopLayout';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

const AgendarAgendaPage = () => {
  const navigate = useNavigate();
  const { createEvent } = useCalendar();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSubmit = async (data: EventFormData) => {
    const { title, date, startTime, endTime, description, location, color, guests } = data;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const start = new Date(date);
    start.setHours(sh, sm, 0, 0);
    const end = new Date(date);
    end.setHours(eh, em, 0, 0);

    await createEvent({
      title,
      start,
      end,
      description,
      location,
      color,
      calendar: 'personal',
      attendees: guests ? [guests] : []
    });

    toast({ title: 'Evento agendado!', description: 'O evento foi adicionado à sua agenda.' });
    navigate('/agenda', { state: { date: start.toISOString() } });
  };

  const handleBack = () => navigate('/');

  const content = (
    <EventFormContainer onCancel={handleBack} onSubmit={handleSubmit} submitLabel="Salvar" />
  );

  return isMobile ? (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full md:max-w-2xl h-full flex flex-col">
        <div className="bg-white rounded-lg shadow-sm min-h-[640px]">
          <div className="bg-white p-4 rounded-t-2xl border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-[hsl(var(--accent))]" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-[hsl(var(--accent))]">Agendar na Agenda</h1>
              </div>
            </div>
          </div>
          {content}
        </div>
      </div>
    </div>
  ) : (
    <DesktopLayout activeTab="agenda">
      <div className="flex justify-center w-full py-8">
        <div className="bg-white rounded-lg shadow-sm w-full max-w-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 z-10 bg-white">
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 font-medium">
              Cancelar
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Agendar na Agenda</h1>
            <div className="w-10"></div>
          </div>
          {content}
        </div>
      </div>
    </DesktopLayout>
  );
};

export default AgendarAgendaPage;
