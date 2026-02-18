import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Palette, MapPinIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface EventFormData {
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  guests: string;
  location: string;
  description: string;
  color: string;
}

interface EventFormFieldsProps {
  formData: EventFormData;
  setFormData: (data: Partial<EventFormData>) => void;
}

const mockLocations = [
  'Rua das Flores, 123 - Ribeira',
  'Avenida Paulista, 1000 - São Paulo',
  'Rua Oscar Freire, 500 - Jardins',
  'Alameda Santos, 200 - Bela Vista'
];

const colorOptions = [
  'hsl(var(--accent))',
  '#3b82f6',
  '#ef4444',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16'
];

const calculateEndTime = (startTime: string): string => {
  const [hour, minute] = startTime.split(':').map(Number);
  const endHour = hour + 1;
  return `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const EventFormFields = ({ formData, setFormData }: EventFormFieldsProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  const handleStartTimeChange = (value: string) => {
    setFormData({ startTime: value, endTime: calculateEndTime(value) });
  };

  const handleLocationChange = (value: string) => {
    setFormData({ location: value });
    if (value.length > 2) {
      const filtered = mockLocations.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
    } else {
      setLocationSuggestions([]);
    }
  };

  return (
    <div className="p-6 space-y-6 max-h-[calc(90vh-220px)] overflow-y-auto">
      <div className="space-y-2">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ title: e.target.value })}
          placeholder="Adicionar título"
          className="w-full text-xl font-medium bg-gray-100 border-none outline-none placeholder-gray-400 px-4 py-3 rounded-2xl"
        />
      </div>

      <div className="space-y-2">
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <button className="w-full p-3 border border-gray-300 rounded-2xl flex items-center space-x-3 hover:bg-gray-50 text-left">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">
                {format(formData.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={formData.date}
              onSelect={(newDate) => {
                if (newDate) {
                  setFormData({ date: newDate });
                  setShowDatePicker(false);
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Início</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Fim</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ endTime: e.target.value })}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 relative">
        <label className="block text-sm font-medium text-gray-900">Local</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            placeholder="Digite o endereço"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        {locationSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 mt-1">
            {locationSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setFormData({ location: suggestion });
                  setLocationSuggestions([]);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">Convidados</label>
        <div className="relative">
          <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.guests}
            onChange={(e) => setFormData({ guests: e.target.value })}
            placeholder="exemplo@email.com, outro@email.com"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500">Separe os emails com vírgulas. Convites serão enviados automaticamente.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">Cor do evento</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center"
            style={{ backgroundColor: formData.color }}
          >
            <Palette className="w-5 h-5 text-white" />
          </button>
          <span className="text-sm text-gray-600">Cor padrão</span>
        </div>
        {showColorPicker && (
          <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 rounded-2xl">
            {colorOptions.map(color => (
              <button
                key={color}
                onClick={() => {
                  setFormData({ color });
                  setShowColorPicker(false);
                }}
                className={`w-10 h-10 rounded-full border-2 transition-all ${formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">Descrição (opcional)</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ description: e.target.value })}
          placeholder="Adicione detalhes sobre o evento..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};
