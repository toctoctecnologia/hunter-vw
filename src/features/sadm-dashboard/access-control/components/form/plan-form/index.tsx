'use client';

import { useCallback } from 'react';
import { Building, DollarSign, FileText, Users } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

import { Plan } from '@/shared/types';

import { formatValue } from '@/shared/lib/utils';

import { removeNonNumeric } from '@/shared/lib/masks';

import { savePlan } from '@/features/sadm-dashboard/access-control/api/save-plan';
import { SavePlan } from '@/features/sadm-dashboard/access-control/types';

import { planSchema, PlanFormData } from '@/features/sadm-dashboard/access-control/components/form/plan-form/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface PlanFormProps {
  plan: Plan;
}

export function PlanForm({ plan }: PlanFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SavePlan) => savePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sadm-saas-plans'] });
      toast.success('Plano atualizado com sucesso!');
    },
  });

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      ...plan,
      annualPrice: formatValue(plan.annualPrice),
      monthlyPrice: formatValue(plan.monthlyPrice),
      activePropertiesAmount: String(plan.activePropertiesAmount),
      activeUsersAmount: String(plan.activeUsersAmount),
    },
  });

  const formatCurrency = useCallback((value: string) => {
    if (!value) return '';
    const numeric = removeNonNumeric(value);
    const number = Number(numeric) / 100;
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }, []);

  function onSubmit(formData: PlanFormData) {
    mutate({ ...formData, uuid: plan.uuid });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Breve descrição do perfil e suas permissões" icon={FileText} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="monthlyPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Mensal</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Preço mensal do plano"
                    icon={DollarSign}
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      field.onChange(formatted);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annualPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Anual</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Preço anual do plano"
                    icon={DollarSign}
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      field.onChange(formatted);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="activeUsersAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Usuários Ativos</FormLabel>
              <FormControl>
                <Input
                  placeholder="Quantidade de usuários ativos"
                  icon={Users}
                  {...field}
                  onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activePropertiesAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Propriedades Ativas</FormLabel>
              <FormControl>
                <Input
                  placeholder="Quantidade de propriedades ativas"
                  icon={Building}
                  {...field}
                  onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={isPending} className="w-full text-sm sm:text-base py-2 sm:py-3">
          Atualizar plano
        </Button>
      </form>
    </Form>
  );
}
