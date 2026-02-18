import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format, startOfMonth, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface DateRangePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (range: { start: string; end: string }) => void;
  initialRange?: { start: string; end: string } | null;
}

function toDateRange(value?: { start: string; end: string } | null): DateRange | undefined {
  if (!value) return undefined;
  const from = value.start ? new Date(value.start) : undefined;
  const to = value.end ? new Date(value.end) : undefined;
  if (from && Number.isNaN(from.getTime())) return undefined;
  if (to && Number.isNaN(to.getTime())) return undefined;
  return { from, to };
}

function toIsoRange(value: DateRange | undefined): { start: string; end: string } | null {
  if (!value?.from || !value?.to) return null;
  return {
    start: value.from.toISOString(),
    end: value.to.toISOString(),
  };
}

export function DateRangePicker({ open, onOpenChange, onSelect, initialRange }: DateRangePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>(toDateRange(initialRange));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    setRange(toDateRange(initialRange));
  }, [initialRange]);

  useEffect(() => {
    if (open) {
      if (range?.from) {
        setCurrentMonth(startOfMonth(range.from));
      } else if (initialRange?.start) {
        const parsed = new Date(initialRange.start);
        if (!Number.isNaN(parsed.getTime())) {
          setCurrentMonth(startOfMonth(parsed));
        }
      } else {
        setCurrentMonth(startOfMonth(new Date()));
      }
    }
  }, [open, initialRange, range?.from]);

  const handleApply = () => {
    const isoRange = toIsoRange(range);
    if (!isoRange) return;
    onSelect(isoRange);
    onOpenChange(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const leftMonth = currentMonth;
  const rightMonth = addMonths(currentMonth, 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-fit p-0 gap-0 rounded-2xl border border-border bg-surface overflow-hidden">
        <DialogTitle className="sr-only">Selecionar período</DialogTitle>
        <DialogDescription className="sr-only">
          Selecione um período de datas usando os calendários abaixo
        </DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Selecionar período</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface2 hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Navigation */}
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="rounded-lg p-2 text-muted-foreground hover:bg-surface2 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-8">
              <span className="text-sm font-semibold text-foreground min-w-[120px] text-center">
                {format(leftMonth, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <span className="text-sm font-semibold text-foreground min-w-[120px] text-center">
                {format(rightMonth, 'MMMM yyyy', { locale: ptBR })}
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="rounded-lg p-2 text-muted-foreground hover:bg-surface2 hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calendars */}
        <div className="flex gap-4 px-5 pb-4">
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={range}
            onSelect={setRange}
            month={leftMonth}
            onMonthChange={setCurrentMonth}
            className={cn("p-0 pointer-events-auto")}
            classNames={{
              months: "flex flex-col",
              month: "space-y-3",
              caption: "hidden",
              caption_label: "hidden",
              nav: "hidden",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell: "text-muted-foreground w-10 font-medium text-xs text-center",
              row: "flex w-full mt-1",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative",
                "first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg"
              ),
              day: cn(
                "h-10 w-10 p-0 font-normal text-sm rounded-lg",
                "hover:bg-surface2 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
              ),
              day_range_start: "bg-orange-500 text-white hover:bg-orange-600 rounded-l-lg rounded-r-none",
              day_range_end: "bg-orange-500 text-white hover:bg-orange-600 rounded-r-lg rounded-l-none",
              day_selected: "bg-orange-500 text-white hover:bg-orange-600",
              day_today: "bg-orange-50 text-orange-600 font-semibold",
              day_outside: "text-muted-foreground/50",
              day_disabled: "text-muted-foreground/30",
              day_range_middle: "bg-orange-50 text-orange-700 rounded-none",
              day_hidden: "invisible",
            }}
          />
          <div className="w-px bg-border" />
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={range}
            onSelect={setRange}
            month={rightMonth}
            onMonthChange={(month) => setCurrentMonth(addMonths(month, -1))}
            className={cn("p-0 pointer-events-auto")}
            classNames={{
              months: "flex flex-col",
              month: "space-y-3",
              caption: "hidden",
              caption_label: "hidden",
              nav: "hidden",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell: "text-muted-foreground w-10 font-medium text-xs text-center",
              row: "flex w-full mt-1",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative",
                "first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg"
              ),
              day: cn(
                "h-10 w-10 p-0 font-normal text-sm rounded-lg",
                "hover:bg-surface2 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
              ),
              day_range_start: "bg-orange-500 text-white hover:bg-orange-600 rounded-l-lg rounded-r-none",
              day_range_end: "bg-orange-500 text-white hover:bg-orange-600 rounded-r-lg rounded-l-none",
              day_selected: "bg-orange-500 text-white hover:bg-orange-600",
              day_today: "bg-orange-50 text-orange-600 font-semibold",
              day_outside: "text-muted-foreground/50",
              day_disabled: "text-muted-foreground/30",
              day_range_middle: "bg-orange-50 text-orange-700 rounded-none",
              day_hidden: "invisible",
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border bg-surface2/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-4 py-2 font-medium"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleApply}
            disabled={!range?.from || !range?.to}
            className="rounded-lg px-4 py-2 font-medium bg-orange-500 hover:bg-orange-600 text-white"
          >
            Aplicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DateRangePicker;
