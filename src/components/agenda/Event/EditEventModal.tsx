
import React, { useState } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { X, Calendar, Clock, MapPin, User, Phone, Trash2, Save, Check, Wrench, Home, FileText, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@/types/event';
import { useQueryClient } from '@tanstack/react-query';
import { appendBillingLog, updateBillingTimelineFromAgenda } from '@/services/billingAgenda';

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
  onEventUpdated: (event: Event) => void;
}

export const EditEventModal = ({ event, onClose, onEventUpdated }: EditEventModalProps) => {
  const [draftEvent, setDraftEvent] = useState<Event>({ ...event });

  const { updateEvent } = useCalendar();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    updateEvent(event.id, {
      title: draftEvent.title,
      description: draftEvent.description,
      location: draftEvent.location,
      client: draftEvent.client,
      phone: draftEvent.phone,
      color: draftEvent.color,
      start: draftEvent.start,
      end: draftEvent.end
    });
    if (event.sourceType === 'BillingRule') {
      updateBillingTimelineFromAgenda(event.id, {
        scheduledAt: draftEvent.start.toISOString(),
        status: 'reagendado'
      });
      appendBillingLog(event.id, 'Reagendado via edição de evento.');
    }
    await queryClient.invalidateQueries({ queryKey: ['events'] });
    onEventUpdated(draftEvent);
    onClose();
  };

  const getEventTypeColor = (type?: string) => {
    switch (type) {
      case 'service': return '#4285F4';
      case 'visit': return '#34A853';
      case 'task': return '#FF3B30';
      default: return 'hsl(var(--accent))';
    }
  };

  const getEventTypeLabel = (type?: string) => {
    switch (type) {
      case 'service': return 'Serviço';
      case 'visit': return 'Visita';
      case 'task': return 'Tarefa';
      default: return 'Informação';
    }
  };

  const getEventTypeIcon = (type?: string) => {
    switch (type) {
      case 'service': return Wrench;
      case 'visit': return Home;
      case 'task': return CheckSquare;
      default: return FileText;
    }
  };

  const EventIcon = getEventTypeIcon(event.type);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="modal-content bg-white rounded-t-3xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${getEventTypeColor(event.type)}15` }}
              >
                <EventIcon className="w-6 h-6" style={{ color: getEventTypeColor(event.type) }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Editar Evento</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {getEventTypeLabel(event.type)}
                  </span>
                  {event.status === 'overdue' && (
                    <span className="text-xs text-red-600 font-semibold bg-red-100 px-2 py-1 rounded-full">
                      Atrasada
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Título do Evento
            </label>
            <div className="relative">
              <input
                type="text"
                value={draftEvent.title}
                onChange={(e) => setDraftEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent transition-all text-gray-900 font-medium"
                placeholder="Digite o título do evento"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Data
            </label>
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200">
              <Calendar size={18} className="text-[hsl(var(--accent))]" />
              <span className="text-sm font-medium text-gray-700">
                {format(event.start, 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
              </span>
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Início
              </label>
              <div className="relative">
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-[hsl(var(--accent))] focus-within:border-transparent transition-all">
                  <Clock size={18} className="text-[hsl(var(--accent))]" />
                  <input
                    type="time"
                    value={format(draftEvent.start, 'HH:mm')}
                    onChange={(e) => {
                      const [h, m] = e.target.value.split(':').map(Number);
                      setDraftEvent(prev => ({
                        ...prev,
                        start: new Date(prev.start.getFullYear(), prev.start.getMonth(), prev.start.getDate(), h, m)
                      }));
                    }}
                    className="flex-1 bg-transparent focus:outline-none text-gray-900 font-medium [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:bg-[hsl(var(--accent))] [&::-webkit-calendar-picker-indicator]:rounded-lg [&::-webkit-calendar-picker-indicator]:p-1"
                    style={{
                      colorScheme: 'light'
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Fim
              </label>
              <div className="relative">
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-[hsl(var(--accent))] focus-within:border-transparent transition-all">
                  <Clock size={18} className="text-[hsl(var(--accent))]" />
                  <input
                    type="time"
                    value={format(draftEvent.end, 'HH:mm')}
                    onChange={(e) => {
                      const [h, m] = e.target.value.split(':').map(Number);
                      setDraftEvent(prev => ({
                        ...prev,
                        end: new Date(prev.end.getFullYear(), prev.end.getMonth(), prev.end.getDate(), h, m)
                      }));
                    }}
                    className="flex-1 bg-transparent focus:outline-none text-gray-900 font-medium [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:bg-[hsl(var(--accent))] [&::-webkit-calendar-picker-indicator]:rounded-lg [&::-webkit-calendar-picker-indicator]:p-1"
                    style={{
                      colorScheme: 'light'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Local
            </label>
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-[hsl(var(--accent))] focus-within:border-transparent transition-all">
              <MapPin size={18} className="text-[hsl(var(--accent))]" />
              <input
                type="text"
                value={draftEvent.location || ''}
                onChange={(e) => setDraftEvent(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Adicionar local"
                className="flex-1 bg-transparent focus:outline-none text-gray-900 font-medium placeholder-gray-400"
              />
            </div>
          </div>

          {/* Client */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Cliente
            </label>
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-[hsl(var(--accent))] focus-within:border-transparent transition-all">
              <User size={18} className="text-[hsl(var(--accent))]" />
              <input
                type="text"
                value={draftEvent.client || ''}
                onChange={(e) => setDraftEvent(prev => ({ ...prev, client: e.target.value }))}
                placeholder="Nome do cliente"
                className="flex-1 bg-transparent focus:outline-none text-gray-900 font-medium placeholder-gray-400"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Telefone
            </label>
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-[hsl(var(--accent))] focus-within:border-transparent transition-all">
              <Phone size={18} className="text-[hsl(var(--accent))]" />
              <input
                type="tel"
                value={draftEvent.phone || ''}
                onChange={(e) => setDraftEvent(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(00) 00000-0000"
                className="flex-1 bg-transparent focus:outline-none text-gray-900 font-medium placeholder-gray-400"
              />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Descrição
          </label>
          <textarea
            value={draftEvent.description || ''}
            onChange={(e) => setDraftEvent(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Adicionar descrição"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent transition-all text-gray-900 font-medium resize-none"
            rows={3}
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Cor do Evento
          </label>
          <input
            type="color"
            value={draftEvent.color || 'hsl(var(--accent))'}
            onChange={(e) => setDraftEvent(prev => ({ ...prev, color: e.target.value }))}
            className="w-12 h-12 p-0 border border-gray-200 rounded-2xl"
          />
        </div>

        {/* Calendar */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Calendário
            </label>
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getEventTypeColor(event.type) }}
              />
              <span className="text-sm font-medium text-gray-700 capitalize">
                {event.calendar}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center space-x-2 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-sm"
          >
            <Save size={18} />
            <span>Salvar Alterações</span>
          </button>
          
          {event.type === 'task' && (
            <button
              onClick={() => {
                // Handle task completion
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-sm"
            >
              <Check size={18} />
              <span>Marcar como Concluída</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
