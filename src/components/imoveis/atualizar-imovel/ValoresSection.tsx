import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Info, DollarSign } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ValoresSectionProps {
  form: UseFormReturn<any>;
}

export function ValoresSection({ form }: ValoresSectionProps) {
  const formatCurrency = (value: string) => {
    // Remove non-numeric characters
    const number = value.replace(/\D/g, '');
    
    if (!number) return '';
    
    // Convert to cents and format
    const cents = parseInt(number);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const handleCurrencyChange = (value: string, field: any) => {
    const formatted = formatCurrency(value);
    field.onChange(formatted);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <DollarSign className="w-5 h-5 text-gray-600" />
        <span>Valores</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Venda */}
        <FormField
          control={form.control}
          name="valores.venda"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Venda
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => handleCurrencyChange(e.target.value, field)}
                  placeholder="R$ 0,00"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Valor Anterior */}
        <FormField
          control={form.control}
          name="valores.valorAnterior"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span>Valor anterior</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-700">
                        Valor anterior do imóvel para comparação de preços
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => handleCurrencyChange(e.target.value, field)}
                  placeholder="R$ 0,00"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Condomínio */}
        <FormField
          control={form.control}
          name="valores.condominio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Condomínio
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => handleCurrencyChange(e.target.value, field)}
                  placeholder="R$ 0,00"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IPTU Mensal */}
        <FormField
          control={form.control}
          name="valores.iptuMensal"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                IPTU (mensal)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => handleCurrencyChange(e.target.value, field)}
                  placeholder="R$ 0,00"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IPTU Anual */}
        <FormField
          control={form.control}
          name="valores.iptuAnual"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                IPTU (anual)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => handleCurrencyChange(e.target.value, field)}
                  placeholder="R$ 0,00"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rentabilidade */}
        <FormField
          control={form.control}
          name="valores.rentabilidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Rentabilidade
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="0%"
                  type="number"
                  min="0"
                  max="100"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Comissão Venda */}
        <FormField
          control={form.control}
          name="valores.comissaoVenda"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Comissão venda
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="0%"
                  type="number"
                  min="0"
                  max="100"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Valor sob consulta */}
        <FormField
          control={form.control}
          name="valores.valorSobConsulta"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Valor sob consulta
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}