import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Pencil } from 'lucide-react';

import { QualifyLeadToggle } from '@/components/leads/QualifyLeadToggle';
import EditLeadFieldDialog from '@/components/leads/EditLeadFieldDialog';
import { Lead } from '@/types/lead';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface LeadCardsProps {
  lead: Lead;
}

const formSchema = z.object({
  value: z.string().min(1, 'Informe o valor'),
});

export function LeadCards({ lead }: LeadCardsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(() => {
    const num = lead.value ? Number(lead.value) : 0;
    return isNaN(num) ? 0 : num;
  });

  const formattedValue = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const formatCurrency = (val: string) => {
    const numbers = val.replace(/\D/g, '');
    if (!numbers) return '';
    const cents = parseInt(numbers, 10);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: formatCurrency(String(value)) },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const numeric = Number(data.value.replace(/\D/g, '')) / 100;
    setValue(numeric);

    try {
      await fetch(`/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: numeric }),
      });
    } catch (e) {
      // TODO: persistir
    }

    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-gray-700 font-medium mb-1">Data solicitada</h3>
        <p className="text-gray-900 text-sm">{lead.requestedDate}</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-700 font-medium">Valor</h3>
          <button
            type="button"
            onClick={() => {
              form.reset({ value: formatCurrency(String(value)) });
              setIsOpen(true);
            }}
            className="p-1"
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-gray-900 text-sm">{formattedValue}</p>
        <div className="mt-2">
          <QualifyLeadToggle
            leadId={String(lead.id)}
            initialQualified={Boolean(lead.qualified)}
            currentStage={lead.stage}
          />
        </div>
      </div>
      {lead.summary && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-gray-700 font-medium mb-2">Resumo</h3>
          <p className="text-gray-900 text-sm leading-relaxed">{lead.summary}</p>
        </div>
      )}

      <EditLeadFieldDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Editar valor"
        form={form}
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) =>
                    field.onChange(formatCurrency(e.target.value))
                  }
                  placeholder="R$ 0,00"
                  className="h-11 rounded-2xl bg-white text-neutral-900 placeholder:text-neutral-500 dark:bg-white dark:text-neutral-900 dark:placeholder:text-neutral-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditLeadFieldDialog>
    </div>
  );
}
