import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  addTeamMembers,
  listTeamMembers,
  removeTeamMember,
  updateTeam,
  updateTeamMember,
} from '@/services/teams';
import type { Team, TeamMember } from '@/types/teams';
import { getUsers, type User } from '@/services/users';
import { Building2, Crown, Loader2, UsersRound, ListChecks } from 'lucide-react';

interface TeamMembersDrawerProps {
  open: boolean;
  team: Team | null;
  onClose: () => void;
  onTeamUpdated?: (team: Team) => void;
  onRequestRefresh?: () => void;
}

type PendingMember = { user: User; role: string };

type RoleDialogState = { member: TeamMember; value: string } | null;

type QuickStats = { total: number; active: number };

export function TeamMembersDrawer({
  open,
  team,
  onClose,
  onTeamUpdated,
  onRequestRefresh,
}: TeamMembersDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [userResults, setUserResults] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [actionMemberId, setActionMemberId] = useState<string | null>(null);
  const [roleDialog, setRoleDialog] = useState<RoleDialogState>(null);

  const teamId = team?.id;

  const refreshMembers = useCallback(
    async (showLoader = true) => {
      if (!teamId) return;
      if (showLoader) {
        setMembersLoading(true);
      }
      try {
        const response = await listTeamMembers(teamId);
        setMembers(response.items);
      } catch (error) {
        console.error('Erro ao buscar membros da equipe', error);
        toast({
          variant: 'destructive',
          title: 'Não foi possível carregar os membros',
          description: 'Tente novamente em instantes.',
        });
      } finally {
        if (showLoader) {
          setMembersLoading(false);
        }
      }
    },
    [teamId, toast],
  );

  useEffect(() => {
    if (open && teamId) {
      void refreshMembers();
      setPendingMembers([]);
      setUserSearchTerm('');
    }
    if (!open) {
      setUserResults([]);
      setPendingMembers([]);
    }
  }, [open, refreshMembers, teamId]);

  const memberUserIds = useMemo(() => new Set(members.map(member => member.userId)), [members]);
  const pendingUserIds = useMemo(() => new Set(pendingMembers.map(item => item.user.id)), [pendingMembers]);

  const fetchUsers = useCallback(
    async (query: string) => {
      setIsSearchingUsers(true);
      try {
        const response = await getUsers({ query, limit: 12, status: 'active' });
        const items = Array.isArray(response) ? response : response.items;
        setUserResults(items);
      } catch (error) {
        console.error('Erro ao buscar usuários', error);
        toast({
          variant: 'destructive',
          title: 'Não foi possível carregar usuários',
          description: 'Tente novamente em instantes.',
        });
      } finally {
        setIsSearchingUsers(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => {
      void fetchUsers(userSearchTerm);
    }, 250);

    return () => clearTimeout(timeout);
  }, [fetchUsers, open, userSearchTerm]);

  const handleTogglePending = (user: User) => {
    setPendingMembers(current => {
      const exists = current.some(item => item.user.id === user.id);
      if (exists) {
        return current.filter(item => item.user.id !== user.id);
      }
      return [...current, { user, role: '' }];
    });
  };

  const handleRoleChange = (memberId: string, value: string) => {
    setPendingMembers(current =>
      current.map(item =>
        item.user.id === memberId
          ? {
              ...item,
              role: value,
            }
          : item,
      ),
    );
  };

  const handleAddMembers = async () => {
    if (!teamId || pendingMembers.length === 0) return;

    setIsAddingMembers(true);
    try {
      const payload = pendingMembers.map(item => ({
        userId: item.user.id,
        role: item.role.trim() || undefined,
      }));

      const response = await addTeamMembers(teamId, payload);
      setMembers(response.items);
      setPendingMembers([]);
      toast({
        title: 'Membros adicionados',
        description: 'Os colaboradores já podem atuar na equipe.',
      });

      if (team) {
        const activeCount = response.items.filter(item => item.status !== 'inactive').length;
        onTeamUpdated?.({
          ...team,
          membersCount: response.total,
          activeMembersCount: activeCount,
        });
      }
      onRequestRefresh?.();
    } catch (error) {
      console.error('Erro ao adicionar membros', error);
      toast({
        variant: 'destructive',
        title: 'Não foi possível adicionar os membros',
        description: 'Verifique os usuários selecionados e tente novamente.',
      });
    } finally {
      setIsAddingMembers(false);
    }
  };

  const handlePromoteManager = async (member: TeamMember) => {
    if (!teamId) return;
    setActionMemberId(member.id);
    try {
      await updateTeamMember(teamId, member.id, { isManager: true });
      await updateTeam(teamId, { managerId: member.userId });
      toast({
        title: 'Responsável atualizado',
        description: `${member.name} agora gerencia a equipe.`,
      });
      await refreshMembers(false);
      if (team) {
        onTeamUpdated?.({
          ...team,
          managerId: member.userId,
          manager: {
            id: member.userId,
            name: member.name,
            email: member.email ?? null,
          },
        });
      }
      onRequestRefresh?.();
    } catch (error) {
      console.error('Erro ao promover responsável', error);
      toast({
        variant: 'destructive',
        title: 'Não foi possível atualizar o responsável',
        description: 'Tente novamente em instantes.',
      });
    } finally {
      setActionMemberId(null);
    }
  };

  const handleRemoveMember = async (member: TeamMember) => {
    if (!teamId) return;
    const previousMembers = members;
    setActionMemberId(member.id);
    try {
      await removeTeamMember(teamId, member.id);
      toast({
        title: 'Membro removido',
        description: `${member.name} não faz mais parte da equipe.`,
      });
      await refreshMembers(false);
      if (team) {
        const nextMembers = previousMembers.filter(item => item.id !== member.id);
        const activeCount = nextMembers.filter(item => item.status !== 'inactive').length;
        onTeamUpdated?.({
          ...team,
          membersCount: nextMembers.length,
          activeMembersCount: activeCount,
        });
      }
      onRequestRefresh?.();
    } catch (error) {
      console.error('Erro ao remover membro', error);
      toast({
        variant: 'destructive',
        title: 'Não foi possível remover o membro',
        description: 'Tente novamente em instantes.',
      });
    } finally {
      setActionMemberId(null);
    }
  };

  const handleUpdateRole = async () => {
    if (!teamId || !roleDialog) return;
    setActionMemberId(roleDialog.member.id);
    try {
      const updated = await updateTeamMember(teamId, roleDialog.member.id, {
        role: roleDialog.value.trim() || null,
      });
      toast({
        title: 'Função atualizada',
        description: `${updated.name} agora atua como ${updated.role ?? 'membro da equipe'}.`,
      });
      await refreshMembers(false);
      setRoleDialog(null);
      onRequestRefresh?.();
    } catch (error) {
      console.error('Erro ao atualizar função', error);
      toast({
        variant: 'destructive',
        title: 'Não foi possível atualizar a função',
        description: 'Tente novamente em instantes.',
      });
    } finally {
      setActionMemberId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!userResults.length) return [] as User[];
    return userResults.filter(user => !memberUserIds.has(user.id));
  }, [memberUserIds, userResults]);

  const stats: QuickStats = useMemo(() => {
    const active = members.filter(member => member.status !== 'inactive').length;
    return { total: members.length, active };
  }, [members]);

  const content = (
    <div className="space-y-6 px-6 pb-6">
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Adicionar membros</h3>
          <p className="text-xs text-muted-foreground">
            Pesquise por corretores ativos na base para compor o time. Você pode selecionar vários
            usuários antes de confirmar.
          </p>
        </div>
        <div className="rounded-xl border border-dashed border-muted-foreground/30">
          <Command>
            <CommandInput
              placeholder="Buscar por nome, e-mail ou telefone"
              value={userSearchTerm}
              onValueChange={setUserSearchTerm}
              aria-label="Buscar usuários"
            />
            <CommandList>
              {isSearchingUsers ? (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Carregando corretores...
                </div>
              ) : (
                <>
                  <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                  <CommandGroup>
                    {filteredUsers.map(user => {
                      const isSelected = pendingUserIds.has(user.id);
                      return (
                      <CommandItem
                        key={user.id}
                        value={`${user.name} ${user.email}`.trim()}
                        onSelect={() => handleTogglePending(user)}
                      >
                        <div className="flex w-full items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isSelected}
                              aria-hidden="true"
                              className="pointer-events-none"
                            />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </div>
                            {user.role && (
                              <Badge variant="secondary" className="text-xs">
                                {user.role}
                              </Badge>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </div>
        {pendingMembers.length > 0 && (
          <div className="space-y-3 rounded-xl border border-muted bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Selecionados ({pendingMembers.length})</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPendingMembers([])}
              >
                Limpar seleção
              </Button>
            </div>
            <div className="space-y-3">
              {pendingMembers.map(item => (
                <div
                  key={item.user.id}
                  className="grid gap-3 rounded-lg border border-border bg-background p-3 md:grid-cols-[minmax(0,1fr)_180px]"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{item.user.name}</p>
                    <p className="text-xs text-muted-foreground">{item.user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`pending-role-${item.user.id}`} className="text-xs">
                      Função na equipe
                    </Label>
                    <Input
                      id={`pending-role-${item.user.id}`}
                      value={item.role}
                      onChange={event => handleRoleChange(item.user.id, event.target.value)}
                      placeholder="Consultor, Captador..."
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={handleAddMembers} disabled={isAddingMembers}>
                {isAddingMembers && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                Adicionar membros
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">Membros atuais</h3>
            <p className="text-xs text-muted-foreground">
              {stats.total === 0
                ? 'Sem membros cadastrados no momento.'
                : `${stats.active} de ${stats.total} participantes estão ativos.`}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Crown className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" /> Responsável
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="px-2 py-0 text-[11px]">
                Inativo
              </Badge>
              Status do corretor
            </div>
          </div>
        </div>
        <ScrollArea className="max-h-[38vh] rounded-xl border border-muted">
          <div className="space-y-3 p-4">
            {membersLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Carregando membros...
              </div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-muted-foreground">
                <UsersRound className="h-5 w-5" aria-hidden="true" />
                <span>Cadastre corretores para acompanhar resultados e distribuição.</span>
              </div>
            ) : (
              members.map(member => (
                <div key={member.id} className="space-y-3 rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{member.name}</p>
                        {member.isManager && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                            <Crown className="h-3 w-3" aria-hidden="true" /> Responsável
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{member.email ?? 'E-mail não informado'}</p>
                      <p className="text-xs text-muted-foreground">
                        Função: {member.role ?? '—'}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant={member.status === 'inactive' ? 'secondary' : 'default'} className="rounded-full px-2 py-0 text-[11px]">
                        {member.status === 'inactive' ? 'Inativo' : 'Ativo'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={member.isManager || actionMemberId === member.id}
                      onClick={() => handlePromoteManager(member)}
                    >
                      {actionMemberId === member.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        'Tornar responsável'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setRoleDialog({ member, value: member.role ?? '' })}
                      disabled={actionMemberId === member.id}
                    >
                      Alterar função
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-600"
                          disabled={actionMemberId === member.id}
                        >
                          Remover
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover {member.name} da equipe?</AlertDialogTitle>
                          <AlertDialogDescription>
                            O histórico permanece salvo, mas o corretor deixa de visualizar os imóveis e leads deste time.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveMember(member)} className="bg-red-600 hover:bg-red-600/90">
                            Confirmar remoção
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <div className="ml-auto flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        asChild
                        aria-label={`Ver imóveis associados a ${member.name}`}
                      >
                        <Link to={`/gestao-imoveis?tab=imoveis&responsavel=${member.userId}`}>
                          <Building2 className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        asChild
                        aria-label={`Ver leads associados a ${member.name}`}
                      >
                        <Link to={`/leads?responsavel=${member.userId}`}>
                          <ListChecks className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </section>
    </div>
  );

  const roleDialogMarkup = roleDialog ? (
    <Dialog open onOpenChange={openState => !openState && setRoleDialog(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar função</DialogTitle>
          <DialogDescription>
            Atualize a função interna do corretor para alinhar expectativas de atuação.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{roleDialog.member.name}</p>
          <Input
            value={roleDialog.value}
            onChange={event => setRoleDialog(current => (current ? { ...current, value: event.target.value } : null))}
            placeholder="Ex.: Coordenador de vendas"
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setRoleDialog(null)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleUpdateRole} disabled={actionMemberId === roleDialog.member.id}>
            {actionMemberId === roleDialog.member.id && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            Salvar função
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  ) : null;

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={openState => !openState && onClose()}>
          <DialogContent className="max-w-4xl overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Gerenciar membros</DialogTitle>
              <DialogDescription>
                Adicione corretores, ajuste funções e defina o responsável pela equipe.
              </DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
        {roleDialogMarkup}
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={openState => !openState && onClose()}>
        <DrawerContent className="max-h-[90dvh] overflow-y-auto p-0">
          <DrawerHeader className="px-6 pt-6">
            <DrawerTitle>Gerenciar membros</DrawerTitle>
            <DrawerDescription>
              Adicione corretores, ajuste funções e defina o responsável pela equipe.
            </DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
      {roleDialogMarkup}
    </>
  );
}
