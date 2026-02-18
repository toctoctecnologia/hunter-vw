import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface StatusSectionProps {
  form: UseFormReturn<any>;
}

export function StatusSection({ form }: StatusSectionProps) {
  const currentStatus = form.watch('status');
  
  const getStatusBadgeColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('disponível') && lowerStatus.includes('site')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (lowerStatus.includes('disponível') && lowerStatus.includes('interno')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    if (lowerStatus.includes('indisponível')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Status do Imóvel
              </FormLabel>
              <div className="space-y-3">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                    <SelectItem value="Disponível no site">Disponível no site</SelectItem>
                    <SelectItem value="Disponível interno">Disponível interno</SelectItem>
                    <SelectItem value="Indisponível">Indisponível</SelectItem>
                    <SelectItem value="Vago/Disponível">Vago/Disponível</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Status atual:</span>
                  <Badge className={`${getStatusBadgeColor(currentStatus)} font-medium`}>
                    {currentStatus}
                  </Badge>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}