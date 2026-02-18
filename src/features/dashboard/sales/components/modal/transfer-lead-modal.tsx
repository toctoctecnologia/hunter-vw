'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

import { getCatchers, updateLead } from '@/features/dashboard/sales/api/lead';
import { ModalProps } from '@/shared/types';

const transferLeadSchema = z.object({
  catcherUuid: z.string().min(1, 'Selecione um corretor'),
});

type TransferLeadFormData = z.infer<typeof transferLeadSchema>;

interface TransferLeadModalProps extends Omit<ModalProps, 'title'> {
  leadUuid: string;
  leadName: string;
  onSuccess: () => void;
}

export function TransferLeadModal({ open, onClose, leadUuid, leadName, onSuccess }: TransferLeadModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<TransferLeadFormData>({
    resolver: zodResolver(transferLeadSchema),
    defaultValues: {
      catcherUuid: '',
    },
  });

  const { data: leadCatchers = [], isLoading: isLoadingCatchers } = useQuery({
    queryKey: ['lead-catchers'],
    queryFn: () => getCatchers(),
    enabled: open,
  });

  const transferMutation = useMutation({
    mutationFn: async (data: TransferLeadFormData) => updateLead(leadUuid, { catcherUuid: data.catcherUuid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-detail'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead transferido com sucesso!');
      form.reset();
      onSuccess();
    },
  });

  function onSubmit(data: TransferLeadFormData) {
    transferMutation.mutate(data);
  }

  return (
    <Modal open={open} onClose={onClose} title="Transferir Lead">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Você está transferindo o lead <span className="font-semibold">{leadName}</span> para outro usuário.
              </p>
            </div>

            <FormField
              control={form.control}
              name="catcherUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecione o Corretor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingCatchers}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um corretor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCatchers ? (
                        <SelectItem value="loading" disabled>
                          Carregando...
                        </SelectItem>
                      ) : leadCatchers.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Nenhum corretor disponível
                        </SelectItem>
                      ) : (
                        leadCatchers.map((catcher) => (
                          <SelectItem key={catcher.uuid} value={catcher.uuid}>
                            {catcher.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={transferMutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={transferMutation.isPending || isLoadingCatchers}>
              {transferMutation.isPending ? 'Transferindo...' : 'Transferir Lead'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
