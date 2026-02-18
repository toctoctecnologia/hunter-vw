'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { updateIntegrationSettings } from '../../api/imoview';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

const imoviewConfigSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  apiKey: z.string().min(1, 'API Key é obrigatória'),
});

type ImoviewConfigFormData = z.infer<typeof imoviewConfigSchema>;

interface ImoviewConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: {
    email?: string;
    apiKey?: string;
  };
}

export function ImoviewConfigModal({ open, onOpenChange, defaultValues }: ImoviewConfigModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<ImoviewConfigFormData>({
    resolver: zodResolver(imoviewConfigSchema),
    defaultValues: {
      email: defaultValues?.email || '',
      password: '',
      apiKey: defaultValues?.apiKey || '',
    },
  });

  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: (data: ImoviewConfigFormData) => updateIntegrationSettings({ ...data, isActive: true }),
    onSuccess: () => {
      toast.success('Configurações do Imoview atualizadas com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['imoview-integration'] });
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['imoview-config'] });
      onOpenChange(false);
      form.reset();
    },
  });

  function onSubmit(data: ImoviewConfigFormData) {
    updateSettings(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Imoview</DialogTitle>
          <DialogDescription>
            Configure as credenciais de acesso ao Imoview CRM para iniciar a integração.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua chave de API" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
