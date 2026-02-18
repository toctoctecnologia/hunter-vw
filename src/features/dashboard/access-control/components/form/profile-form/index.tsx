'use client';

import { useEffect, useMemo } from 'react';
import { FileText, User } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Profile } from '@/features/dashboard/access-control/types';
import { Permission } from '@/shared/types';

import { createProfile, updateProfile, getProfilePermissions } from '@/features/dashboard/access-control/api/profile';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  profileSchema,
  ProfileFormData,
} from '@/features/dashboard/access-control/components/form/profile-form/schema';

interface ProfileFormProps {
  editingProfile?: Profile | null;
  availablePermissions: Permission[];
  onSuccess?: () => void;
}

export function ProfileForm({ editingProfile, availablePermissions, onSuccess }: ProfileFormProps) {
  const queryClient = useQueryClient();

  const { data: profilePermissions = [] } = useQuery({
    queryKey: ['profile-permissions', editingProfile?.code],
    queryFn: () => getProfilePermissions(editingProfile!.code),
    enabled: !!editingProfile,
  });

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    availablePermissions.forEach((permission) => {
      const groupName = permission.groupName || 'Outras';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(permission);
    });
    return groups;
  }, [availablePermissions]);

  const createMutation = useMutation({
    mutationFn: (data: ProfileFormData) => createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Perfil criado com sucesso!');
      onSuccess?.();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ code, data }: { code: string; data: ProfileFormData }) => updateProfile(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Perfil atualizado com sucesso!');
      onSuccess?.();
    },
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  useEffect(() => {
    if (editingProfile && profilePermissions.length > 0) {
      form.reset({
        name: editingProfile.name,
        description: editingProfile.description,
        permissions: profilePermissions.map((p) => ({ code: p.code })),
      });
    } else if (!editingProfile) {
      form.reset({
        name: '',
        description: '',
        permissions: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProfile?.code, profilePermissions.length]);

  function onSubmit(formData: ProfileFormData) {
    if (editingProfile) {
      updateMutation.mutate({ code: editingProfile.code, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de Exibição</FormLabel>
              <FormControl>
                <Input placeholder="Nome para exibição (ex: Administrador)" icon={User} {...field} />
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
                <Input placeholder="Breve descrição do perfil e suas permissões" icon={FileText} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permissions"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Permissões</FormLabel>
                <FormDescription>Selecione as permissões que este perfil terá acesso</FormDescription>
              </div>
              <Accordion type="multiple" className="w-full">
                {Object.entries(groupedPermissions).map(([groupName, permissions]) => {
                  const selectedCount = permissions.filter((p) =>
                    form.watch('permissions')?.some((selected) => selected.code === p.code),
                  ).length;
                  const hasSelected = selectedCount > 0;

                  return (
                    <AccordionItem key={groupName} value={groupName}>
                      <AccordionTrigger>
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className="text-sm font-medium">{groupName}</span>
                          <Badge variant="secondary">
                            {permissions.length} {permissions.length === 1 ? 'permissão' : 'permissões'}
                          </Badge>
                          {hasSelected && (
                            <Badge variant="default" className="bg-primary">
                              {selectedCount} selecionada{selectedCount !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          {permissions.map((permission) => (
                            <FormField
                              key={permission.code}
                              control={form.control}
                              name="permissions"
                              render={({ field }) => {
                                const isChecked = field.value?.some((p) => p.code === permission.code) ?? false;
                                return (
                                  <FormItem
                                    key={permission.code}
                                    className="flex flex-row items-start space-x-3 space-y-0 py-2"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange([...field.value, { code: permission.code }]);
                                          } else {
                                            field.onChange(field.value?.filter((p) => p.code !== permission.code));
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        {permission.name}
                                      </FormLabel>
                                      <FormDescription className="text-xs">{permission.description}</FormDescription>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={isPending} className="w-full text-sm sm:text-base py-2 sm:py-3">
          {editingProfile ? 'Atualizar perfil' : 'Cadastrar perfil'}
        </Button>
      </form>
    </Form>
  );
}
