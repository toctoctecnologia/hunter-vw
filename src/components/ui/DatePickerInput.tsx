import { useState, type InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { ymdLocal } from '@/lib/datetime'

interface DatePickerInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: Date | null
  onChange: (date: Date | null) => void
}

export function DatePickerInput({ value, onChange, className, required, ...props }: DatePickerInputProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          type="text"
          readOnly
          className={className}
          value={value ? ymdLocal(value) : ''}
          required={required}
          onKeyDown={e => {
            if (e.key === 'Tab') {
              setOpen(false)
            }
          }}
          {...props}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onKeyDown={e => {
          if (e.key === 'Tab') {
            setOpen(false)
          }
        }}
      >
        <CalendarComponent
          mode="single"
          selected={value ?? undefined}
          onSelect={date => {
            onChange(date ?? null)
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePickerInput
