import React, { useState, useEffect } from 'react';
import { debugLog } from '@/utils/debug';
import { ChevronLeft, Clock, Calendar, User, CalendarCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toISOWithTZ } from '@/utils/date';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAgendaStore } from '@/hooks/agenda/useAgendaStore';
import type { TaskReminder } from '@/types/agenda';
import { useNavigate } from 'react-router-dom';
import PropertyCard, { type PropertyCardProps } from '@/components/imoveis/PropertyCard';
import { useVisitScheduler } from '@/hooks/agenda';
interface ScheduleActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdvanceFunnel: () => void;
  lead: {
    id: number;
    nome: string;
    origem?: string;
    interesse?: string;
  } | null;
}
export const ScheduleActivityModal = ({
  isOpen,
  onClose,
  onAdvanceFunnel,
  lead
}: ScheduleActivityModalProps) => {
  const [selectedActivity, setSelectedActivity] = useState('retornar-cliente');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('60');
  const [reminders, setReminders] = useState<number[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [color, setColor] = useState('hsl(var(--accent))');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PropertyCardProps[]>([]);
  const { cart, add: addVisit, remove: removeVisit, update: updateVisit, clear: clearCart, scheduleAll } =
    useVisitScheduler();
  const [cartProps, setCartProps] = useState<Record<number, PropertyCardProps>>({});
  const navigate = useNavigate();
  const { add: addTask } = useAgendaStore();
  const { toast } = useToast();
  const reminderOptions = [
    { label: '5 min antes', value: 5 },
    { label: '15 min antes', value: 15 },
    { label: '30 min antes', value: 30 },
    { label: '1 h antes', value: 60 }
  ];
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(
          `/api/imoveis/search?q=${encodeURIComponent(searchTerm)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('failed');
        setSearchResults((await res.json()) as PropertyCardProps[]);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchTerm]);
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
      clearCart();
      setCartProps({});
    }
  }, [isOpen, clearCart]);
  const leadId = lead?.id;
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  if (!isOpen) return null;
  const handleScheduleCallback = () => {
    if (!leadId) return;
    const { title: taskTitle, type } =
      selectedActivity === 'retornar-cliente'
        ? { title: 'Retornar para o cliente', type: 'callback' as const }
        : { title: 'Visita agendada', type: 'visit' as const };

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dueAt = toISOWithTZ(
      format(selectedDate, 'yyyy-MM-dd'),
      selectedTime,
      timeZone
    );

    (window as any).analytics?.track('task_create_from_lead', {
      type,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      leadId,
    });
    const task = {
      id: Date.now().toString(),
      title: taskTitle,
      type,
      leadId: String(leadId),
      color,
      dueAt,
      notes,
      done: false,
      status: 'todo' as const,
      reminders: [] as TaskReminder[],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as const;
    addTask(task);
    toast({ title: 'Tarefa criada' });
    debugLog('Tarefa criada:', {
      activity: selectedActivity,
      date: selectedDate,
      time: selectedTime,
      notes,
    });
    onClose();
    navigate(
      `/agenda?date=${formattedDate}&time=${selectedTime}&source=lead&taskId=${task.id}`,
    );
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-task-id="${task.id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };
  const handleAddProperty = (property: PropertyCardProps) => {
    if (!leadId) return;
    addVisit({
      leadId,
      propertyId: property.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      durationMin: Number(duration),
      transport: 'car',
    });
    setCartProps(prev => ({ ...prev, [property.id]: property }));
  };
  const handleRemoveProperty = (id: string, propertyId: number | string) => {
    removeVisit(id);
    setCartProps(prev => {
      const next = { ...prev };
      delete next[Number(propertyId)];
      return next;
    });
  };
  const handleScheduleVisits = async () => {
    if (!leadId) return;
    await scheduleAll(leadId);
    toast({ title: 'Visitas agendadas' });
    clearCart();
    setCartProps({});
    onClose();
    onAdvanceFunnel();
    navigate('/agenda?tab=tasks');
  };
  const isSaveDisabled = selectedActivity === 'retornar-cliente' && !leadId;
  const getFormattedDate = () => {
    if (selectedDate && selectedTime) {
      const date = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`);
      return format(date, "d 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR
      });
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
    <>
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
        <div className="w-full max-w-[390px] md:max-w-none bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Agendar atividade
          </h2>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Activity Type */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade</h3>
              <RadioGroup value={selectedActivity} onValueChange={setSelectedActivity} className="space-y-3">
                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors min-h-[64px]">
                  <RadioGroupItem value="retornar-cliente" id="retornar-cliente" className="border-gray-300 text-orange-600 w-5 h-5" />
                  <User className="w-6 h-6 text-gray-500" />
                  <Label htmlFor="retornar-cliente" className="flex-1 text-gray-900 font-medium cursor-pointer text-base">
                    Retornar para o cliente
                  </Label>
                </div>
                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors min-h-[64px]">
                  <RadioGroupItem value="visita-agendada" id="visita-agendada" className="border-gray-300 text-orange-600 w-5 h-5" />
                  <CalendarCheck className="w-6 h-6 text-gray-500" />
                  <Label htmlFor="visita-agendada" className="flex-1 text-gray-900 font-medium cursor-pointer text-base">
                    Visita Agendada
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {selectedActivity === 'retornar-cliente' && (
              <>
                {/* Date and Time */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Selecione a data e horário
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Date Picker */}
                    <div className="relative">
                      <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                        <PopoverTrigger asChild>
                          <button className="w-full pl-14 pr-4 py-4 h-14 border border-gray-200 rounded-2xl text-left hover:bg-gray-50 transition-colors">
                            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <span className="text-gray-900 font-medium">
                              {format(selectedDate, 'dd/MM/yyyy')}
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={date => {
                              if (date) {
                                setSelectedDate(date);
                                setShowDatePicker(false);
                              }
                            }}
                            locale={ptBR}
                            initialFocus
                            className="rounded-2xl border-0 bg-white shadow-lg pointer-events-auto"
                            classNames={{
                              months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                              month: 'space-y-4 p-3',
                              caption: 'flex justify-center pt-1 relative items-center mb-4',
                              caption_label: 'text-sm font-semibold text-gray-900',
                              nav: 'space-x-1 flex items-center',
                              nav_button: 'h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-orange-100 rounded-full transition-colors',
                              nav_button_previous: 'absolute left-3',
                              nav_button_next: 'absolute right-3',
                              table: 'w-full border-collapse space-y-1',
                              head_row: 'flex mb-2',
                              head_cell: 'text-gray-500 rounded-md w-8 font-medium text-xs uppercase',
                              row: 'flex w-full mt-1',
                              cell: 'h-8 w-8 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
                              day: 'h-8 w-8 p-0 font-normal hover:bg-orange-100 rounded-full transition-colors flex items-center justify-center',
                              day_selected: 'bg-orange-600 text-white hover:bg-orange-700 focus:bg-orange-600 focus:text-white rounded-full font-semibold',
                              day_today: 'bg-orange-100 text-orange-600 font-semibold rounded-full',
                              day_outside: 'text-gray-400 opacity-50',
                              day_disabled: 'text-gray-400 opacity-50',
                              day_range_middle: 'aria-selected:bg-orange-100 aria-selected:text-orange-600',
                              day_hidden: 'invisible',
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time Picker */}
                    <div className="relative">
                      <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
                        <PopoverTrigger asChild>
                          <button className="w-full pl-14 pr-4 py-4 h-14 border border-gray-200 rounded-2xl text-left hover:bg-gray-50 transition-colors">
                            <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
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
                                  className={`w-full p-3 text-left rounded-xl transition-colors font-medium ${selectedTime === time ? 'bg-orange-600 text-white' : 'hover:bg-orange-50 text-gray-900'}`}
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

                  {getFormattedDate()}
                </div>

                {/* Additional Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informações adicionais
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Duração</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="w-full h-14 border-gray-200 rounded-2xl text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="45">45 minutos</SelectItem>
                          <SelectItem value="60">60 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Cor</Label>
                      <Input
                        type="color"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        className="h-14 border-gray-200 rounded-2xl"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Lembretes</Label>
                      <div className="flex flex-col gap-2">
                        {reminderOptions.map(option => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`reminder-${option.value}`}
                              checked={reminders.includes(option.value)}
                              onCheckedChange={checked => {
                                setReminders(prev =>
                                  checked ? [...prev, option.value] : prev.filter(r => r !== option.value)
                                );
                              }}
                            />
                            <Label htmlFor={`reminder-${option.value}`} className="text-sm">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Notas
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Escreva do que deseja se lembrar"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="min-h-[80px] border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-orange-500/20 text-base"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedActivity === 'visita-agendada' && (
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Código, endereço ou cidade"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full h-14 pl-4 pr-10 border border-gray-200 rounded-2xl"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {searchResults.map(property => (
                    <PropertyCard
                      key={property.id}
                      {...property}
                      compact
                      actions={
                        <button
                          onClick={() => handleAddProperty(property)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                        >
                          Adicionar ao carrinho
                        </button>
                      }
                    />
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Carrinho</h4>
                    {cart.map(item => {
                      const property = cartProps[item.propertyId as number];
                      return (
                        <div key={item.id} className="p-4 bg-white rounded-2xl shadow space-y-4">
                          <div className="text-gray-900 font-medium">
                            {property?.title ?? `Imóvel ${item.propertyId}`}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              type="date"
                              value={item.date}
                              onChange={e => updateVisit(item.id, { date: e.target.value })}
                              className="h-12 border-gray-200 rounded-xl"
                            />
                            <Input
                              type="time"
                              value={item.time}
                              onChange={e => updateVisit(item.id, { time: e.target.value })}
                              className="h-12 border-gray-200 rounded-xl"
                            />
                            <Input
                              type="number"
                              value={item.durationMin ?? 60}
                              onChange={e => updateVisit(item.id, { durationMin: Number(e.target.value) })}
                              className="h-12 border-gray-200 rounded-xl"
                            />
                            <Select
                              value={item.transport ?? 'car'}
                              onValueChange={val => updateVisit(item.id, { transport: val as any })}
                            >
                              <SelectTrigger className="h-12 border-gray-200 rounded-xl">
                                <SelectValue placeholder="Transporte" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="car">Carro</SelectItem>
                                <SelectItem value="bus">Ônibus</SelectItem>
                                <SelectItem value="walk">A pé</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <button
                            onClick={() => handleRemoveProperty(item.id, item.propertyId)}
                            className="text-sm text-red-600"
                          >
                            Remover
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          {selectedActivity === 'retornar-cliente' ? (
            <Button
              onClick={handleScheduleCallback}
              disabled={isSaveDisabled}
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold disabled:opacity-50 transition-all duration-200 text-base"
            >
              Agendar atividade
            </Button>
          ) : (
            <Button
              onClick={handleScheduleVisits}
              disabled={cart.length === 0}
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold disabled:opacity-50 transition-all duration-200 text-base"
            >
              Agendar todas
            </Button>
          )}
        </div>
      </div>
      </div>
    </>
  );
};