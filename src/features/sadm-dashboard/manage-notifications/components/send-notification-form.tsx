'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

import { SendNotification } from '@/features/sadm-dashboard/manage-notifications/api/notification';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const sendNotificationSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z.string().min(1, 'A descrição é obrigatória').max(500, 'A descrição deve ter no máximo 500 caracteres'),
});

type SendNotificationFormData = z.infer<typeof sendNotificationSchema>;

export function SendNotificationForm() {
  const form = useForm<SendNotificationFormData>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SendNotificationFormData) => SendNotification(data.title, data.description),
    onSuccess: () => {
      toast.success('Notificação enviada com sucesso para todos os usuários!');
      form.reset();
    },
  });

  function onSubmit(data: SendNotificationFormData) {
    mutate(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Enviar Notificação</CardTitle>
        <CardDescription>Envie uma notificação para todos os usuários da plataforma.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da notificação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escreva a mensagem da notificação..."
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" isLoading={isPending} className="w-fit self-end">
              <Send />
              Enviar Notificação
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
