
import React, { useState } from 'react';
import { debugLog } from '@/utils/debug';
import { useCalendar } from '@/context/CalendarContext';
import { useToast } from '@/hooks/use-toast';
import { X, Calendar, Clock, MapPin, User, Users, Video, Bell, Palette, FileText, Paperclip, Eye, Briefcase } from 'lucide-react';

interface NewEventModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const NewEventModal = ({ isVisible, onClose }: NewEventModalProps) => {
  const [eventType, setEventType] = useState<'evento' | 'tarefa' | 'aniversario'>('evento');
  const [title, setTitle] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('13:00');
  const [endTime, setEndTime] = useState('14:00');
  const [calendar, setCalendar] = useState('minha-agenda');
  const [guests, setGuests] = useState('');
  const [videoCall, setVideoCall] = useState(false);
  const [location, setLocation] = useState('');
  const [notification, setNotification] = useState('2-horas-antes');
  const [color, setColor] = useState('hsl(var(--accent))');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState('');
  const [visibility, setVisibility] = useState('padrao');
  const [showBusy, setShowBusy] = useState(true);

  const { createEvent } = useCalendar();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const parseDateTime = (dateStr: string, timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        const d = dateStr ? new Date(dateStr) : new Date();
        d.setHours(h, m, 0, 0);
        return d;
      };

      const start = parseDateTime(startDate, startTime);
      const end = parseDateTime(endDate || startDate, endTime);

      await createEvent({
        title: title || 'Novo evento',
        start,
        end,
        description,
        location,
        attendees: guests ? guests.split(',').map(g => g.trim()).filter(Boolean) : [],
        calendar: calendar === 'minha-agenda' ? 'personal' : 'work',
        color,
        notificationTime: notification
      });

      toast({ title: 'Sucesso', description: 'Evento criado com sucesso!' });
      debugLog('Evento salvo:', {
        eventType,
        title,
        start,
        end
      });
      onClose();
    } catch (error) {
      debugLog('Erro ao salvar evento:', error);
      toast({ title: 'Erro', description: 'Não foi possível salvar o evento.', variant: 'destructive' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <div className="modal-content bg-white rounded-3xl w-full max-w-sm flex flex-col">
        {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentHover))] p-4 text-white">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
          
          <h1 className="font-semibold text-lg">
            Agendar Serviço
          </h1>
          
          <button 
            onClick={handleSave}
            className="text-white font-semibold text-lg hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
          >
            Salvar
          </button>
        </div>
        
        <p className="text-white/80 text-sm mt-1">
          Enviar mensagem para [C2S]
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <input
              type="text"
              className="w-full text-xl font-medium bg-transparent border-none outline-none placeholder-gray-400"
              placeholder="Adicionar título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Tipo de Evento */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setEventType('evento')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                eventType === 'evento' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Evento
            </button>
            <button
              onClick={() => setEventType('tarefa')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                eventType === 'tarefa' 
                  ? 'bg-gray-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tarefa
            </button>
            <button
              onClick={() => setEventType('aniversario')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                eventType === 'aniversario' 
                  ? 'bg-gray-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Aniversário
            </button>
          </div>

          {/* Data e Horário */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar size={20} className="text-[hsl(var(--accent))]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data e Horário</h3>
                <p className="text-sm text-gray-600">Quando acontece</p>
              </div>
            </div>

            {/* Dia inteiro toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Dia inteiro</span>
              </div>
              <button
                onClick={() => setIsAllDay(!isAllDay)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isAllDay ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAllDay ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Data */}
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">Data</div>
              <div className="text-lg font-medium text-gray-900">
                09 de julho
              </div>
            </div>

            {/* Horário */}
            {!isAllDay && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Horário</div>
                <div className="text-lg font-medium text-gray-900">
                  12:10 - 12:40
                </div>
              </div>
            )}
          </div>

          {/* Local */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Local</h3>
                <p className="text-sm text-gray-600">Remoto</p>
              </div>
            </div>
            <button className="w-full text-left py-2 px-3 bg-white rounded-lg border border-gray-200 text-sm">
              <span className="text-gray-400">Adicionar local</span>
            </button>
          </div>

          {/* Contato */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Contato</h3>
                <p className="text-sm text-gray-600">Informações do cliente</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nome</span>
                <span className="font-medium text-gray-900">[C2S]</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Telefone</span>
                <span className="font-medium text-gray-900">(11) 99812-7753</span>
              </div>
            </div>
          </div>

          {/* Calendário */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar size={16} className="text-[hsl(var(--accent))]" />
              </div>
              <span className="text-sm text-gray-600">danielcapelani@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3 ml-11">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-600 font-medium">Minha agenda</span>
              <Users size={16} className="text-blue-600" />
            </div>
          </div>

          {/* Convidados */}
          <div className="flex items-center space-x-3 py-3">
            <Users size={20} className="text-gray-500" />
            <span className="text-gray-600">Adicionar convidados</span>
          </div>

          {/* Videoconferência */}
          <div className="flex items-center space-x-3 py-3">
            <Video size={20} className="text-gray-500" />
            <span className="text-gray-600">Adicionar videoconferência</span>
          </div>

          {/* Notificação */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Bell size={20} className="text-gray-500" />
              <span className="text-gray-600">2 horas antes</span>
            </div>
            <button className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Adicionar outra notificação */}
          <div className="flex items-center space-x-3 py-3">
            <Bell size={20} className="text-gray-500" />
            <span className="text-gray-600">Adicionar outra notificação</span>
            <button className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Cor padrão */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Palette size={20} className="text-gray-500" />
              <span className="text-gray-600">Cor padrão</span>
            </div>
            <button className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Descrição */}
          <div className="flex items-center space-x-3 py-3">
            <FileText size={20} className="text-gray-500" />
            <span className="text-gray-600">Adicionar descrição</span>
          </div>

          {/* Anexo */}
          <div className="flex items-center space-x-3 py-3">
            <Paperclip size={20} className="text-gray-500" />
            <span className="text-gray-600">Adicionar um anexo do Google Drive</span>
          </div>

          {/* Visibilidade */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Eye size={20} className="text-gray-500" />
              <span className="text-gray-600">Visibilidade padrão</span>
            </div>
            <button className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Ocupado */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Briefcase size={20} className="text-gray-500" />
              <span className="text-gray-600">Ocupado</span>
            </div>
            <button className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
