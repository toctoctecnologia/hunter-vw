
import { useEffect, useState } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { debugLog } from '@/utils/debug';
import { X, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EventFormContainer, EventFormData } from './EventFormContainer';
import { EventFormFields } from './EventFormFields';
import { useLeadsStore } from '@/hooks/vendas';
import type { Lead as BaseLead } from '@/types/lead';
import { useQueryClient } from '@tanstack/react-query';

interface Property {
  id: number;
  name: string;
  address: string;
  image: string;
  value: string;
}


interface CreateEventModalProps {
  onClose: () => void;
  onEventCreated: (event: any) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

const mockProperties: Property[] = [
  {
    id: 1,
    name: 'Casa no Ribeira',
    address: 'Rua das Flores, 123 - Ribeira',
    image: '/uploads/9030858f-de63-4a42-9048-a669f685b2db.png',
    value: 'R$ 850.000'
  },
  {
    id: 2,
    name: 'Lagom Perequê',
    address: 'Avenida Colombo Machado Sales, Perequê, Porto Belo – SC',
    image: '/uploads/9030858f-de63-4a42-9048-a669f685b2db.png',
    value: 'R$ 10.000.000'
  },
];

type Lead = BaseLead & {
  email?: string;
};


const calculateEndTime = (startTime: string): string => {
  const [hour, minute] = startTime.split(':').map(Number);
  const endHour = hour + 1; // Add 1 hour
  return `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const CreateEventModal = ({ onClose, onEventCreated, selectedDate, selectedTime }: CreateEventModalProps) => {
  const [associatedProperty, setAssociatedProperty] = useState<Property | null>(null);
  const [associatedLead, setAssociatedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState('evento');
  const { toast } = useToast();
  const { createEvent } = useCalendar();
  const queryClient = useQueryClient();
  const { leads: leadsData, error, load } = useLeadsStore();
  useEffect(() => {
    load();
  }, [load]);
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Erro ao carregar leads: {error}
      </div>
    );
  }
  const leads: Lead[] = leadsData.map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    stage: lead.stage,
    status: lead.status,
    createdAt: lead.createdAt,
    capturedBy: lead.capturedBy,
    publishedToRoleta: lead.publishedToRoleta,
    email: (lead as any).email,
    qualified: lead.qualified,
    qualifiedAt: lead.qualifiedAt,
  }));


  const handleSendInvites = async (guestEmails: string[]) => {
    // Simular envio de convites por email
    for (const email of guestEmails) {
      debugLog(`Enviando convite para: ${email}`);
      // Aqui seria implementada a lógica real de envio de email
    }
    
    toast({
      title: "Convites enviados",
      description: `${guestEmails.length} convite(s) enviado(s) com sucesso!`,
    });
  };

  const handleCreateEvent = async (data: EventFormData) => {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      color,
      guests
    } = data;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDateTime = new Date(date);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(date);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    const newEvent = {
      id: Date.now(),
      title: associatedProperty
        ? associatedProperty.name
        : associatedLead
          ? `Reunião com ${associatedLead.name}`
          : title,
      description,
      start: startDateTime,
      end: endDateTime,
      location: associatedProperty ? associatedProperty.address : location,
      color,
      calendar: 'Minha agenda',
      guests: guests.split(',').map(g => g.trim()).filter(g => g),
      associatedProperty,
      associatedLead,
      originalTitle: title
    };

    if (guests.trim()) {
      const guestEmails = guests.split(',').map(g => g.trim()).filter(g => g);
      handleSendInvites(guestEmails);
    }

    await createEvent({
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      description: newEvent.description,
      location: newEvent.location,
      color: newEvent.color,
      calendar: 'personal',
      attendees: newEvent.guests
    });

    await queryClient.invalidateQueries({ queryKey: ['events'] });

    onEventCreated(newEvent);
    onClose();

    toast({
      title: 'Sucesso',
      description: 'Evento criado com sucesso!',
      variant: 'default'
    });
  };


  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Novo evento</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Custom Tab Navigation */}
          <div className="bg-gray-50 p-1 m-4 rounded-2xl">
            <div className="flex bg-gray-50 rounded-2xl">
              <button
                onClick={() => setActiveTab('evento')}
                className={`flex-1 py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'evento' 
                    ? 'bg-[hsl(var(--accent))] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Evento
              </button>
              <button
                onClick={() => setActiveTab('imoveis')}
                className={`flex-1 py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'imoveis' 
                    ? 'bg-[hsl(var(--accent))] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Imóveis
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`flex-1 py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'leads' 
                    ? 'bg-[hsl(var(--accent))] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Leads
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <EventFormContainer
            initialData={{
              date: selectedDate || new Date(),
              startTime: selectedTime || '09:00',
              endTime: calculateEndTime(selectedTime || '09:00'),
              color: 'hsl(var(--accent))'
            }}
            onCancel={onClose}
            onSubmit={handleCreateEvent}
          >
            {({ formData, setFormData }) => (
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'evento' && (
                  <>
                    {associatedProperty && (
                      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3">
                        <div className="flex items-center space-x-3">
                          <img src={associatedProperty.image} alt={associatedProperty.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{associatedProperty.name}</h4>
                            <p className="text-xs text-gray-600">{associatedProperty.address}</p>
                          </div>
                          <button onClick={() => setAssociatedProperty(null)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-orange-200">
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    )}
                    {associatedLead && (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{associatedLead.name}</h4>
                            <p className="text-xs text-gray-600">{associatedLead.email}</p>
                          </div>
                          <button onClick={() => setAssociatedLead(null)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-200">
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    )}
                    <EventFormFields formData={formData} setFormData={setFormData} />
                  </>
                )}

            {activeTab === 'imoveis' && (
              <div className="p-4 space-y-3 max-h-[calc(90vh-220px)] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecionar imóvel</h3>
                {mockProperties.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => {
                      setAssociatedProperty(property);
                      setFormData({ title: property.name, location: property.address });
                      setAssociatedLead(null);
                      setActiveTab('evento');
                    }}
                    className="w-full p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={property.image} 
                        alt={property.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{property.name}</h4>
                        <p className="text-sm text-gray-600">{property.address}</p>
                        <p className="text-sm font-medium text-orange-600">{property.value}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'leads' && (
                <div className="p-4 space-y-3 max-h-[calc(90vh-220px)] overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecionar lead</h3>
                  {leads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setAssociatedLead(lead);
                      setFormData({ title: `Reunião com ${lead.name}`, guests: lead.email });
                      setAssociatedProperty(null);
                      setActiveTab('evento');
                    }}
                    className="w-full p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{lead.name}</h4>
                        <p className="text-sm text-gray-600">{lead.email}</p>
                        <p className="text-xs text-blue-600">{lead.status}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </EventFormContainer>
        </div>
      </div>
    </>
  );
};
