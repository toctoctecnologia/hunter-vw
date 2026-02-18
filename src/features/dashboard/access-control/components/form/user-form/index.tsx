'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Profile } from '@/features/dashboard/access-control/types';
import { createUser } from '@/features/dashboard/access-control/api/user';

import { userSchema, UserFormData } from '@/features/dashboard/access-control/components/form/user-form/schema';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { normalizePhoneNumber } from '@/shared/lib/masks';

interface UserFormProps {
  profiles: Profile[];
  onSuccess?: () => void;
}

export function UserForm({ profiles, onSuccess }: UserFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UserFormData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário criado com sucesso, ele irá receber um link de confirmação por e-mail.');
      onSuccess?.();
    },
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      profileCode: '',
    },
  });

  function onSubmit(data: UserFormData) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo do usuário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="usuario@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(19) 99999-9999" {...field} value={normalizePhoneNumber(field.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profileCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perfil</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <SelectValue placeholder="Selecione um perfil" />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.code} value={profile.code}>
                      <div className="flex flex-col">
                        <span className="font-medium">{profile.name}</span>
                        {profile.description && (
                          <span className="text-xs text-muted-foreground">{profile.description}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isPending} isLoading={isPending}>
            Criar Usuário
          </Button>
        </div>
      </form>
    </Form>
  );
}
