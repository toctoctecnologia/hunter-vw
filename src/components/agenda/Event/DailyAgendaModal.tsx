
import { useState } from 'react';
import { debugLog } from '@/utils/debug';
import { X, Calendar, Plus } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  time: string;
  status: string;
}

interface DailyAgendaModalProps {
  onClose: () => void;
  events: Event[];
}

export const DailyAgendaModal = ({ onClose, events }: DailyAgendaModalProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAddEvent = () => {
    // Modal for adding new event
    debugLog('Add new event');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-lg w-full h-5/6 flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button onClick={onClose} className="p-2">
            <X size={24} className="text-[#666666]" />
          </button>
          <h2 className="text-xl font-semibold text-[#333333]">Agenda de Hoje</h2>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Compact Calendar */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#333333] mb-2">Junho 2025</h3>
              <div className="grid grid-cols-7 gap-1 text-xs text-[#666666] mb-2">
                <div>Dom</div>
                <div>Seg</div>
                <div>Ter</div>
                <div>Qua</div>
                <div>Qui</div>
                <div>Sex</div>
                <div>Sáb</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 flex items-center justify-center text-sm rounded ${
                      i + 1 === 5 ? 'bg-[hsl(var(--accent))] text-white' : 'text-[#333333] hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Complete Events List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[#333333] mb-4">Eventos do Dia</h3>
            {events.map((event) => (
              <div key={event.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar size={20} className="text-[hsl(var(--accent))] mr-3" />
                    <div>
                      <p className="text-sm font-medium text-[#333333]">{event.title}</p>
                      <p className="text-xs text-[#666666]">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {event.status === 'completed' && (
                      <div className="bg-[#E6F8E6] px-2 py-1 rounded-full">
                        <span className="text-xs text-[#333333]">Concluído</span>
                      </div>
                    )}
                    {event.status === 'pending' && (
                      <div className="bg-[#E6F7FF] px-2 py-1 rounded-full">
                        <span className="text-xs text-[#007AFF]">Pendente</span>
                      </div>
                    )}
                    
                    <button className="text-[hsl(var(--accent))] text-xs font-medium">
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Add Button */}
        <button 
          onClick={handleAddEvent}
          className="absolute bottom-6 right-6 w-12 h-12 bg-[hsl(var(--accent))] rounded-full flex items-center justify-center shadow-lg"
        >
          <Plus size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
};
