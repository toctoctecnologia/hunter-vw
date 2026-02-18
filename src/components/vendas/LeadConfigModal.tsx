
import React, { useState } from 'react';
import { debugLog } from '@/utils/debug';
import { X, Calendar, Clock, User, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCalendar } from '@/context/CalendarContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface LeadConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
}

export const LeadConfigModal = ({ isOpen, onClose, leadName }: LeadConfigModalProps) => {
  const [selectedAction, setSelectedAction] = useState<'return' | 'visit' | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { createEvent, loading } = useCalendar();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSchedule = async () => {
    if (selectedAction && selectedDate && selectedTime) {
      try {
        const [hour, minute] = selectedTime.split(':').map(Number);
        const eventDate = new Date(selectedDate);
        const startDateTime = new Date(eventDate);
        startDateTime.setHours(hour, minute, 0, 0);
        
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(hour + 1, minute, 0, 0);

        const actionText = selectedAction === 'return' ? 'Retornar para o cliente' : 'Visita Agendada';
        
        await createEvent({
          title: `${actionText} - ${leadName}`,
          start: startDateTime,
          end: endDateTime,
          description: `Lead: ${leadName}`,
          calendar: 'personal',
          color: 'hsl(var(--accent))'
        });

        toast({
          title: "Atividade agendada",
          description: "A atividade foi adicionada à sua agenda automaticamente.",
        });

        debugLog(`Agendado: ${actionText} - ${leadName} - ${selectedDate} ${selectedTime}`);
        
        onClose();
        setSelectedAction(null);
        setSelectedDate(new Date());
        setSelectedTime('09:00');
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao agendar atividade. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  const getDateSuggestion = () => {
    if (selectedDate && selectedTime) {
      const date = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`);
      return format(date, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    }
    return '';
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-[400px] md:max-w-none max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Configurações do Lead</h2>
              <p className="text-sm text-gray-600">Lead: <span className="font-medium text-gray-900">{leadName}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Action Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade</h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group">
                <input
                  type="radio"
                  name="action"
                  value="return"
                  checked={selectedAction === 'return'}
                  onChange={() => setSelectedAction('return')}
                  className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <User className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors" />
                <span className="text-gray-900 font-medium">Retornar para o cliente</span>
              </label>

              <label className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group">
                <input
                  type="radio"
                  name="action"
                  value="visit"
                  checked={selectedAction === 'visit'}
                  onChange={() => setSelectedAction('visit')}
                  className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <CalendarCheck className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors" />
                <span className="text-gray-900 font-medium">Visita Agendada</span>
              </label>
            </div>
          </div>

          {/* Date and Time Selection */}
          {selectedAction && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Selecione a data e horário</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Data
                  </label>
                  <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                    <PopoverTrigger asChild>
                      <button className="w-full p-3 h-12 border border-gray-200 rounded-xl text-left hover:bg-gray-50 transition-colors">
                        <span className="text-gray-900 font-medium">
                          {format(selectedDate, 'dd/MM/yyyy')}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedDate(date);
                            setShowDatePicker(false);
                          }
                        }}
                        locale={ptBR}
                        initialFocus
                        className="rounded-2xl border-0 bg-white shadow-lg pointer-events-auto"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4 p-3",
                          caption: "flex justify-center pt-1 relative items-center mb-4",
                          caption_label: "text-sm font-semibold text-gray-900",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-orange-100 rounded-full transition-colors",
                          nav_button_previous: "absolute left-3",
                          nav_button_next: "absolute right-3",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex mb-2",
                          head_cell: "text-gray-500 rounded-md w-8 font-medium text-xs uppercase",
                          row: "flex w-full mt-1",
                          cell: "h-8 w-8 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                          day: "h-8 w-8 p-0 font-normal hover:bg-orange-100 rounded-full transition-colors flex items-center justify-center",
                          day_selected: "bg-orange-600 text-white hover:bg-orange-700 focus:bg-orange-600 focus:text-white rounded-full font-semibold",
                          day_today: "bg-orange-100 text-orange-600 font-semibold rounded-full",
                          day_outside: "text-gray-400 opacity-50",
                          day_disabled: "text-gray-400 opacity-50",
                          day_range_middle: "aria-selected:bg-orange-100 aria-selected:text-orange-600",
                          day_hidden: "invisible"
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Time Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Horário
                  </label>
                  <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
                    <PopoverTrigger asChild>
                      <button className="w-full p-3 h-12 border border-gray-200 rounded-xl text-left hover:bg-gray-50 transition-colors">
                        <span className="text-gray-900 font-medium">{selectedTime}</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="bg-white rounded-2xl shadow-lg max-h-64 overflow-y-auto p-2">
                        <div className="space-y-1">
                          {timeOptions.map(time => (
                            <button
                              key={time}
                              onClick={() => {
                                setSelectedTime(time);
                                setShowTimePicker(false);
                              }}
                              className={`w-full p-3 text-left rounded-xl transition-colors font-medium ${
                                selectedTime === time 
                                  ? 'bg-orange-600 text-white' 
                                  : 'hover:bg-orange-50 text-gray-900'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Suggestion */}
              {getDateSuggestion() && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-sm text-orange-700">
                    <Clock className="w-4 h-4 inline mr-2" />
                    {getDateSuggestion()} é apenas uma sugestão
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSchedule}
              disabled={!selectedAction || !selectedDate || !selectedTime || loading}
              className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Agendando...' : 'Agendar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
