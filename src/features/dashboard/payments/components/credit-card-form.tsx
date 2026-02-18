'use client';

import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

import { PlanChangeFormData } from '@/features/dashboard/payments/components/form/plan-change-schema';

interface CreditCardFormProps {
  form: UseFormReturn<PlanChangeFormData>;
}

export function CreditCardForm({ form }: CreditCardFormProps) {
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ').substring(0, 19) : '';
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
    }
    return numbers;
  };

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ: 00.000.000/0000-00
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="cardHolderName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome no cartão</FormLabel>
            <FormControl>
              <Input
                placeholder="NOME COMPLETO"
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número do cartão</FormLabel>
            <FormControl>
              <Input
                placeholder="0000 0000 0000 0000"
                {...field}
                onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cardExpiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validade</FormLabel>
              <FormControl>
                <Input
                  placeholder="MM/AA"
                  {...field}
                  onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardCvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input
                  placeholder="000"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').substring(0, 4))}
                  maxLength={4}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="cardHolderCpfCnpj"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF/CNPJ do titular</FormLabel>
            <FormControl>
              <Input
                placeholder="000.000.000-00"
                {...field}
                onChange={(e) => field.onChange(formatCpfCnpj(e.target.value))}
                maxLength={18}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-sm">
        <p>Seus dados de cartão são enviados de forma segura e criptografada diretamente para processamento.</p>
      </div>
    </div>
  );
}
