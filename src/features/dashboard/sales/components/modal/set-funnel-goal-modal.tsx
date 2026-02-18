'use client';

import { useEffect } from 'react';
import { Target } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { LeadFunnelStages, ModalProps } from '@/shared/types';
import { funnelStageLabels } from '@/shared/lib/utils';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { removeNonNumeric } from '@/shared/lib/masks';

const funnelGoalSchema = z.object({
  goalPercentage: z
    .string()
    .min(1, 'A meta é obrigatória')
    .refine((val) => !isNaN(Number(val)), 'Deve ser um número válido')
    .refine((val) => Number(val) >= 0 && Number(val) <= 100, 'A meta deve estar entre 0 e 100%'),
});

type FunnelGoalFormData = z.infer<typeof funnelGoalSchema>;

interface SetFunnelGoalModalProps extends Omit<ModalProps, 'title' | 'description'> {
  stage: LeadFunnelStages;
  currentGoal?: number;
  onSave: (stage: LeadFunnelStages, goalPercentage: number) => void;
  isLoading?: boolean;
}

export function SetFunnelGoalModal({ stage, currentGoal, onSave, onClose, isLoading, ...props }: SetFunnelGoalModalProps) {
  const form = useForm<FunnelGoalFormData>({
    resolver: zodResolver(funnelGoalSchema),
    defaultValues: {
      goalPercentage: currentGoal?.toString() || '',
    },
  });

  useEffect(() => {
    form.reset({
      goalPercentage: currentGoal?.toString() || '',
    });
  }, [currentGoal, form]);

  function onSubmit(formData: FunnelGoalFormData) {
    const goalValue = Number(formData.goalPercentage);
    onSave(stage, goalValue);
    form.reset();
    onClose();
  }

  const stageLabel = funnelStageLabels[stage];

  return (
    <Modal {...props} title={`Definir Meta - ${stageLabel}`} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <FormField
            control={form.control}
            name="goalPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta de Conversão (%)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: 75"
                    icon={Target}
                    {...field}
                    onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full text-sm sm:text-base py-2 sm:py-3" isLoading={isLoading}>
            {currentGoal ? 'Atualizar meta' : 'Definir meta'}
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
