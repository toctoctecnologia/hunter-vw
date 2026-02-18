'use client';

import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

import { cn } from '@/shared/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onCreateEvent: () => void;
}

export function DateSelector({ selectedDate, onDateChange, onCreateEvent }: DateSelectorProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handlePreviousDay = () => onDateChange(subDays(selectedDate, 1));
  const handleNextDay = () => onDateChange(addDays(selectedDate, 1));

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex max-w-[450px] items-center gap-2 flex-1">
          <Button variant="outline" size="icon" onClick={handlePreviousDay} className="shrink-0">
            <span className="sr-only">Dia anterior</span>←
          </Button>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'flex-1 sm:min-w-[240px] justify-start text-left font-normal',
                  !selectedDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 shrink-0" />
                <span className="truncate">
                  {selectedDate ? (
                    <>
                      <span className="hidden sm:inline">{format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</span>
                      <span className="sm:hidden">{format(selectedDate, "EEE, d 'de' MMM", { locale: ptBR })}</span>
                    </>
                  ) : (
                    'Selecione uma data'
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                autoFocus
                selected={selectedDate}
                locale={ptBR}
                onSelect={(date) => {
                  if (date) {
                    onDateChange(date);
                    setOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" onClick={handleNextDay} className="shrink-0">
            <span className="sr-only">Próximo dia</span>→
          </Button>
        </div>

        {hasFeature(user?.userInfo.profile.permissions, '1305') && (
          <div className="flex gap-2">
            <Button onClick={onCreateEvent} className="w-full sm:w-auto shrink-0">
              <Plus />
              Novo Compromisso
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
