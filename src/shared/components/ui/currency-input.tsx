'use client';

import { forwardRef, KeyboardEvent } from 'react';
import { Input } from './input';
import { formatValue } from '@/shared/lib/utils';
import { removeNonNumeric } from '@/shared/lib/masks';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string | null;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = '', onChange, onBlur, ...props }, ref) => {
    const displayValue = value ? formatValue(parseFloat(value) / 100) : '';

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const key = e.key;

      // Permite: backspace, delete, tab, escape, enter, setas
      if (
        ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
          key,
        )
      ) {
        return;
      }

      // Permite: Ctrl/Cmd+A, Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X
      if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(key.toLowerCase())) {
        return;
      }

      // Bloqueia se não for número
      if (!/^\d$/.test(key)) {
        e.preventDefault();
        return;
      }

      // Pega apenas os números do valor atual
      const currentNumeric = removeNonNumeric(input.value);

      // Adiciona o novo dígito
      const newNumeric = currentNumeric + key;

      // Atualiza o valor
      onChange?.(newNumeric);

      e.preventDefault();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const numericValue = removeNonNumeric(pastedText);
      onChange?.(numericValue);
    };

    const handleBackspace = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        const currentNumeric = removeNonNumeric(e.currentTarget.value);
        const newNumeric = currentNumeric.slice(0, -1);
        onChange?.(newNumeric);
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onKeyDown={(e) => {
          handleBackspace(e);
          handleKeyDown(e);
        }}
        onChange={(e) => onChange?.(removeNonNumeric(e.target.value))}
        onPaste={handlePaste}
        onBlur={onBlur}
      />
    );
  },
);

CurrencyInput.displayName = 'CurrencyInput';
