'use client';

import { useEffect, useState } from 'react';
import { Building2, Mail, Search, Trash2, UserPlus, Users } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { getUsers } from '@/features/dashboard/access-control/api/user';
import {
  newTeam,
  updateTeam,
  getTeamMembers,
  addTeamMember,
  deleteTeamMember,
} from '@/features/dashboard/properties/api/teams';

import { ModalProps, TeamDetail } from '@/shared/types';
import { useCEP } from '@/shared/hooks/use-cep';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { TeamFormData, teamSchema } from '@/features/dashboard/properties/components/form/team-form/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Separator } from '@/shared/components/ui/separator';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';

interface SaveTeamModalProps extends Omit<ModalProps, 'title' | 'description'> {
  team?: TeamDetail | null;
}

export function SaveTeamModal({ team, onClose, ...props }: SaveTeamModalProps) {
  const queryClient = useQueryClient();
  const { handleGetCEPData } = useCEP();
  const [activeTab, setActiveTab] = useState('details');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data: teamMembers = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['team-members', team?.uuid],
    queryFn: () => getTeamMembers(team!.uuid),
    enabled: !!team?.uuid,
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['available-users', pagination, searchTerm],
    queryFn: () => getUsers(pagination, searchTerm || undefined),
    enabled: !!team?.uuid && activeTab === 'members',
  });

  const createMutation = useMutation({
    mutationFn: (data: TeamFormData) => newTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Equipe criada com sucesso!');
      form.reset();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: TeamFormData }) => updateTeam(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Equipe atualizada com sucesso!');
      onClose();
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ teamUuid, userUuid }: { teamUuid: string; userUuid: string }) =>
      deleteTeamMember(teamUuid, userUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', team?.uuid] });
      toast.success('Membro removido com sucesso!');
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ teamUuid, userUuid }: { teamUuid: string; userUuid: string }) => addTeamMember(teamUuid, userUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', team?.uuid] });
      toast.success('Membro adicionado com sucesso!');
      setSearchTerm('');
    },
  });

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      branch: '',
      street: '',
      number: '',
      neighborhood: '',
      complement: '',
      city: '',
      state: '',
      zipCode: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (team) {
      form.reset({
        name: team.name,
        branch: team.branch,
        street: team.street,
        number: team.number,
        neighborhood: team.neighborhood,
        complement: team.complement,
        city: team.city,
        state: team.state,
        zipCode: team.zipCode,
        notes: team.notes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team]);

  async function handleZipCodeBlur() {
    const zipCode = form.getValues('zipCode');
    if (zipCode && zipCode.length === 8) {
      const data = await handleGetCEPData(zipCode);
      if (!data.error) {
        form.setValue('street', data.logradouro);
        form.setValue('neighborhood', data.bairro);
        form.setValue('city', data.localidade);
        form.setValue('state', data.uf);
      }
    }
  }

  function onSubmit(formData: TeamFormData) {
    if (team) {
      updateMutation.mutate({ uuid: team.uuid, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  function handleRemoveMember(userUuid: string) {
    if (team?.uuid) {
      removeMemberMutation.mutate({ teamUuid: team.uuid, userUuid });
    }
  }

  function handleAddMember(userUuid: number) {
    if (team?.uuid) {
      addMemberMutation.mutate({ teamUuid: team.uuid, userUuid: String(userUuid) });
    }
  }

  const availableUsers =
    usersData?.content.filter((user) => !teamMembers.some((member) => member.uuid === String(user.uuid))) || [];

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal {...props} title={team ? 'Editar Equipe' : 'Nova Equipe'} onClose={onClose}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">
            <Building2 className="mr-2 h-4 w-4" />
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="members" disabled={!team}>
            <Users className="mr-2 h-4 w-4" />
            Membros {team && teamMembers.length > 0 && `(${teamMembers.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Informações Básicas</h3>
                <div className="grid grid-cols-1 gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Equipe</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Equipe Centro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filial/Unidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Matriz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Endereço</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="00000-000" {...field} onBlur={handleZipCodeBlur} maxLength={9} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: SP" {...field} maxLength={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Centro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Rua das Flores" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Sala 201" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Observações</h3>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Adicione informações adicionais sobre a equipe..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" isLoading={isPending} className="w-full text-sm sm:text-base py-2 sm:py-3">
                {team ? 'Atualizar equipe' : 'Cadastrar equipe'}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="members" className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">Adicionar Membros</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {searchTerm && (
                <Card className="max-h-[200px] overflow-y-auto">
                  {isLoadingUsers ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Buscando usuários...</div>
                  ) : availableUsers.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Nenhum usuário encontrado</div>
                  ) : (
                    <div className="divide-y">
                      {availableUsers.map((user) => (
                        <div key={user.uuid} className="p-3 hover:bg-accent transition-colors">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-sm">{user.name}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{user.email}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddMember(user.uuid)}
                              disabled={addMemberMutation.isPending}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Membros Atuais</h3>
              <Badge variant="secondary">{teamMembers.length}</Badge>
            </div>

            {isLoadingMembers ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Carregando membros...</div>
              </div>
            ) : teamMembers.length === 0 ? (
              <Card className="p-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <Users className="h-12 w-12 text-muted-foreground" />
                  <h4 className="font-medium">Nenhum membro na equipe</h4>
                  <p className="text-sm text-muted-foreground">
                    Adicione membros para começar a gerenciar esta equipe.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <Card key={member.uuid} className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{member.name}</p>
                          <Badge variant={member.isActive ? 'default' : 'secondary'}>
                            {member.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveMember(member.uuid)}
                        disabled={removeMemberMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Modal>
  );
}
