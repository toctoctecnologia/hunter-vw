import React, { useState } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { X, MapPin, User, Phone, Calendar, Clock, CheckCircle2, Wrench, Home, CheckSquare, FileText, Bell, Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@/types/event';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { appendBillingLog, updateBillingTimelineFromAgenda } from '@/services/billingAgenda';
interface EventViewModalProps {
  event: Event;
  onClose: () => void;
  onEdit: () => void;
}
export const EventViewModal = ({
  event,
  onClose,
  onEdit
}: EventViewModalProps) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showNotificationOptions, setShowNotificationOptions] = useState(false);
  const [draftEvent, setDraftEvent] = useState<Event>({ ...event });
  const [selectedColor, setSelectedColor] = useState(draftEvent.color || 'hsl(var(--accent))');
  const [notificationTime, setNotificationTime] = useState(draftEvent.notificationTime || '2 horas antes');
  const { updateEvent } = useCalendar();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isBillingEvent = event.sourceType === 'BillingRule';

  const handleSave = async () => {
    updateEvent(event.id, {
      color: draftEvent.color,
      notificationTime: draftEvent.notificationTime
    });
    await queryClient.invalidateQueries({ queryKey: ['events'] });
    onClose();
  };
  const getEventTypeIcon = (type?: string) => {
    switch (type) {
      case 'service':
        return Wrench;
      case 'visit':
        return Home;
      case 'task':
        return CheckSquare;
      default:
        return FileText;
    }
  };
  const getEventTypeLabel = (type?: string) => {
    switch (type) {
      case 'service':
        return 'Serviço';
      case 'visit':
        return 'Visita';
      case 'task':
        return 'Tarefa';
      default:
        return 'Evento';
    }
  };
  const colors = [{
    name: 'Tomate',
    color: '#FF3B30'
  }, {
    name: 'Tangerina',
    color: '#FF9500'
  }, {
    name: 'Banana',
    color: '#FFCC00'
  }, {
    name: 'Manjericão',
    color: '#34C759'
  }, {
    name: 'Sálvia',
    color: '#30D158'
  }, {
    name: 'Pavão',
    color: '#007AFF'
  }, {
    name: 'Mirtilo',
    color: '#5856D6'
  }, {
    name: 'Lavanda',
    color: '#AF52DE'
  }, {
    name: 'Uva',
    color: '#FF2D92'
  }, {
    name: 'Flamingo',
    color: '#FF3B30'
  }, {
    name: 'Grafite',
    color: '#8E8E93'
  }, {
    name: 'Cor padrão',
    color: 'hsl(var(--accent))'
  }];
  const EventIcon = getEventTypeIcon(event.type);
  const eventColor = selectedColor;

  const handleStatusUpdate = async (status: 'completed' | 'cancelled') => {
    updateEvent(event.id, { status });
    if (isBillingEvent) {
      updateBillingTimelineFromAgenda(event.id, {
        status: status === 'completed' ? 'executado' : 'cancelado'
      });
      appendBillingLog(
        event.id,
        status === 'completed' ? 'Evento marcado como executado.' : 'Evento cancelado na Agenda.'
      );
    }
    await queryClient.invalidateQueries({ queryKey: ['events'] });
    onClose();
  };

  const handleOpenBillingRule = () => {
    navigate('/gestao-locacao/regua-cobranca');
  };

  return <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-content bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-scale-in">
        {/* Header with solid color background */}
        <div className="relative p-6 text-white" style={{
        backgroundColor: eventColor
      }}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                <EventIcon size={28} className="text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-white/80" />
                  <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">
                    {getEventTypeLabel(event.type)}
                  </span>
                  {event.status === 'overdue' && (
                    <span className="text-xs bg-red-500/90 text-white px-2 py-1 rounded-full font-semibold backdrop-blur-sm">
                      Atrasada
                    </span>
                  )}
                  {event.source && (
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-semibold backdrop-blur-sm">
                      {event.source}
                    </span>
                  )}
                  {isBillingEvent && (
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-semibold backdrop-blur-sm">
                      Cobrança automática
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white leading-tight">
                  {event.title}
                </h2>
              </div>
            </div>
            
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 mx-0 px-[22px] py-[5px]">
          {/* Date & Time */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                backgroundColor: `${eventColor}15`
              }}>
                  <Calendar size={18} style={{
                  color: eventColor
                }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Data e Horário</h3>
                  <p className="text-sm text-gray-600">Quando acontece</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Data</span>
                <span className="font-medium text-gray-900">
                  {format(event.start, 'dd \'de\' MMMM', {
                  locale: ptBR
                })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Horário</span>
                <span className="font-medium text-gray-900">
                  {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                </span>
              </div>
          </div>
        </div>

        {/* Description */}
        {(event.description || event.organizer) && (
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
            {event.description && (
              <p className="text-sm text-gray-600 mb-1">{event.description}</p>
            )}
            {event.organizer && (
              <p className="text-sm text-gray-600 mb-1">
                Organizador: <span className="font-medium text-gray-900">{event.organizer}</span>
              </p>
            )}
          </div>
        )}

        {/* Location */}
          {event.location && <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <MapPin size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Local</h3>
                  <p className="text-sm text-gray-600">{event.location}</p>
                </div>
              </div>
            </div>}

          {/* Client Info */}
          {(event.client || event.phone) && <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <User size={18} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Contato</h3>
                  <p className="text-sm text-gray-600">Informações do cliente</p>
                </div>
              </div>
              <div className="space-y-2">
                {event.client && <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nome</span>
                    <span className="font-medium text-gray-900">{event.client}</span>
                  </div>}
                {event.phone && <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Telefone</span>
                    <span className="font-medium text-gray-900">{event.phone}</span>
                  </div>}
              </div>
            </div>}

          {isBillingEvent && (
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Cobrança automática</h3>
              <p className="text-sm text-gray-600">
                Contrato: <span className="font-medium text-gray-900">{event.contractId ?? '-'}</span>
              </p>
              <p className="text-sm text-gray-600">
                Fatura: <span className="font-medium text-gray-900">{event.invoiceId ?? '-'}</span>
              </p>
              {event.billingLogs?.length ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500">Logs</p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {event.billingLogs.map((log, index) => (
                      <li key={`${log}-${index}`}>• {log}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Sem logs registrados.</p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  className="rounded-full bg-green-500 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Marcar executado
                </button>
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={onEdit}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  Reagendar
                </button>
              </div>
              <button
                onClick={handleOpenBillingRule}
                className="mt-2 w-full rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700"
              >
                Voltar para Agenda de cobrança
              </button>
            </div>
          )}

          {/* More Options Button */}
          <button onClick={() => setShowMoreOptions(!showMoreOptions)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
            <span className="text-sm font-medium text-gray-700">Mais opções</span>
            {showMoreOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Expanded Options */}
          {showMoreOptions && <div className="space-y-4 animate-in slide-in-from-top-2">
              {/* Notification Settings */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <button onClick={() => setShowNotificationOptions(!showNotificationOptions)} className="w-full flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                      <Bell size={18} className="text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-900">Notificação</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{notificationTime}</span>
                    {showNotificationOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {showNotificationOptions && <div className="mt-3 space-y-2">
                {['2 horas antes', '1 hora antes', '30 minutos antes', '15 minutos antes', '5 minutos antes'].map(time => <button key={time} onClick={() => {
                setNotificationTime(time);
                setDraftEvent(prev => ({ ...prev, notificationTime: time }));
                setShowNotificationOptions(false);
              }} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${notificationTime === time ? 'bg-orange-100 text-orange-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}>
                        {time}
                      </button>)}
                  </div>}
              </div>

              {/* Color Picker */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <button onClick={() => setShowColorPicker(!showColorPicker)} className="w-full flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Palette size={18} className="text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">Cor padrão</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{
                  backgroundColor: selectedColor
                }} />
                    {showColorPicker ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {showColorPicker && <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {colors.map(colorOption => <button key={colorOption.name} onClick={() => {
                setSelectedColor(colorOption.color);
                setDraftEvent(prev => ({ ...prev, color: colorOption.color }));
                setShowColorPicker(false);
              }} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${selectedColor === colorOption.color ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                        <span className="text-gray-900">{colorOption.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full border border-gray-300" style={{
                    backgroundColor: colorOption.color
                  }} />
                          {selectedColor === colorOption.color && <CheckCircle2 size={16} className="text-blue-600" />}
                        </div>
                      </button>)}
                  </div>}
              </div>
            </div>}
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          <button
            onClick={handleSave}
            className="w-full text-white py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-sm"
            style={{ backgroundColor: eventColor }}
          >
            Salvar
          </button>

          <button
            onClick={onEdit}
            className="w-full text-white py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-sm"
            style={{ backgroundColor: eventColor }}
          >
            Editar Evento
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-medium transition-all duration-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>;
};
