
import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@/types/event';

interface EventSearchPageProps {
  onClose: () => void;
  events: Event[];
}

export const EventSearchPage = ({ onClose, events }: EventSearchPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.attendees?.some(attendee => 
      attendee.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="bg-white min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center space-x-3 mb-4">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Buscar Eventos</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        {searchQuery === '' ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Digite algo para buscar eventos</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum evento encontrado</p>
            <p className="text-sm text-gray-400 mt-2">
              Tente buscar por título, local ou participante
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
            </p>
            
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-3 h-16 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color || 'hsl(var(--accent))' }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {format(event.start, "dd 'de' MMMM, HH:mm", { locale: ptBR })} - 
                        {format(event.end, " HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-1" />
                        <span>{event.attendees.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
