import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { createTeam, updateTeam } from '@/services/teams';
import type { Team, TeamAddress, TeamStatus, TeamType } from '@/types/teams';
import { getUsers, type User } from '@/services/users';

interface TeamFormDrawerProps {
  open: boolean;
  mode: 'create' | 'edit';
  team: Team | null;
  onClose: () => void;
  onSuccess?: (team: Team) => void;
}

interface TeamFormState {
  name: string;
  branch: string;
  type: TeamType;
  description: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const TEAM_TYPE_OPTIONS: Array<{ value: TeamType; label: string; helper: string }> = [
  { value: 'regional', label: 'Regional', helper: 'Cobertura por território completo.' },
  { value: 'especializada', label: 'Especializada', helper: 'Foco em verticais ou produtos específicos.' },
  { value: 'parceria', label: 'Parceria estratégica', helper: 'Times parceiros ou franquias compartilhadas.' },
  { value: 'apoio', label: 'Time de apoio', helper: 'Suporte operacional, marketing ou concierge.' },
];

const ACTIVE_STATUS_OPTIONS: Array<{ value: Extract<TeamStatus, 'active' | 'expansion'>; label: string }> = [
  { value: 'active', label: 'Operação ativa' },
  { value: 'expansion', label: 'Em expansão' },
];

function mapTeamToForm(team: Team | null): TeamFormState {
  return {
    name: team?.name ?? '',
    branch: team?.branch ?? '',
    type: team?.type ?? 'regional',
    description: team?.description ?? '',
    address: {
      street: team?.address?.street ?? '',
      number: team?.address?.number ?? '',
      complement: team?.address?.complement ?? '',
      neighborhood: team?.address?.neighborhood ?? '',
      city: team?.address?.city ?? team?.city ?? '',
      state: team?.address?.state ?? team?.state ?? '',
      zipCode: team?.address?.zipCode ?? '',
    },
  };
}

function normalizeAddress(address: TeamFormState['address']): TeamAddress | null {
  const trimmed: TeamAddress = {
    street: address.street.trim() || null,
    number: address.number.trim() || null,
    complement: address.complement.trim() || null,
    neighborhood: address.neighborhood.trim() || null,
    city: address.city.trim() || null,
    state: address.state.trim() || null,
    zipCode: address.zipCode.trim() || null,
  };

  const hasValue = Object.values(trimmed).some(value => Boolean(value));
  return hasValue ? trimmed : null;
}

function normalizeString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

type UserSummary = Pick<User, 'id' | 'name' | 'email' | 'phone'>;

export function TeamFormDrawer({ open, mode, team, onClose, onSuccess }: TeamFormDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { toast } = useToast();
  const [formState, setFormState] = useState<TeamFormState>(() => mapTeamToForm(team));
  const [status, setStatus] = useState<TeamStatus>('active');
  const [lastActiveStatus, setLastActiveStatus] = useState<Extract<TeamStatus, 'active' | 'expansion'>>('active');
  const [managerSearchTerm, setManagerSearchTerm] = useState('');
  const [managerResults, setManagerResults] = useState<UserSummary[]>([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [managerPopoverOpen, setManagerPopoverOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<UserSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  useEffect(() => {
    if (!open) return;

    const nextState = mapTeamToForm(team);
    setFormState(nextState);

    const initialStatus = team?.status ?? 'active';
    setStatus(initialStatus);
    setLastActiveStatus(initialStatus === 'inactive' ? 'active' : (initialStatus as Extract<TeamStatus, 'active' | 'expansion'>));

    if (team?.managerId && team.manager) {
      setSelectedManager({
        id: team.manager.id,
        name: team.manager.name,
        email: team.manager.email ?? '',
        phone: undefined,
      });
    } else {
      setSelectedManager(null);
    }
    setManagerSearchTerm('');
  }, [open, team]);

  const fetchManagers = useCallback(
    async (query: string) => {
      setManagerLoading(true);
      try {
        const response = await getUsers({ query, limit: 10 });
        const items = Array.isArray(response) ? response : response.items;
        setManagerResults(items);
      } catch (error) {
        console.error('Erro ao buscar responsáveis', error);
        toast({
          variant: 'destructive',
          title: 'Não foi possível carregar responsáveis',
          description: 'Tente novamente em instantes.',
        });
      } finally {
        setManagerLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    if (!open || !managerPopoverOpen) return;
    const timeout = setTimeout(() => {
      void fetchManagers(managerSearchTerm);
    }, 250);

    return () => clearTimeout(timeout);
  }, [fetchManagers, managerPopoverOpen, managerSearchTerm, open]);

  useEffect(() => {
    if (open && !managerPopoverOpen) {
      setManagerResults([]);
    }
  }, [managerPopoverOpen, open]);

  const isActive = status !== 'inactive';

  const handleToggleStatus = (checked: boolean) => {
    if (!checked) {
      if (status !== 'inactive') {
        setLastActiveStatus(status);
      }
      setShowArchiveConfirm(true);
      return;
    }

    const nextStatus = lastActiveStatus || 'active';
    setStatus(nextStatus);
  };

  const handleConfirmArchive = () => {
    setStatus('inactive');
    setShowArchiveConfirm(false);
  };

  const handleCancelArchive = () => {
    setShowArchiveConfirm(false);
  };

  const handleChangeActiveStatus = (value: string) => {
    const next = (value as Extract<TeamStatus, 'active' | 'expansion'>) ?? 'active';
    setLastActiveStatus(next);
    if (status !== 'inactive') {
      setStatus(next);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payloadName = formState.name.trim();
    if (!payloadName) {
      toast({
        variant: 'destructive',
        title: 'Informe o nome da equipe',
        description: 'O nome é obrigatório para salvar a equipe.',
      });
      return;
    }

    const payload = {
      name: payloadName,
      type: formState.type,
      branch: normalizeString(formState.branch),
      description: normalizeString(formState.description),
      address: normalizeAddress(formState.address),
      city: normalizeString(formState.address.city) ?? undefined,
      state: normalizeString(formState.address.state) ?? undefined,
      status,
      managerId: selectedManager?.id ?? null,
    } satisfies Parameters<typeof createTeam>[0];

    try {
      setIsSubmitting(true);
      const result =
        mode === 'create' || !team
          ? await createTeam(payload)
          : await updateTeam(team.id, payload);

      toast({
        title: mode === 'create' ? 'Equipe criada com sucesso' : 'Equipe atualizada',
        description:
          mode === 'create'
            ? 'A nova equipe já pode receber metas, membros e imóveis.'
            : 'As informações foram sincronizadas com sua operação.',
      });

      onSuccess?.(result);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar equipe', error);
      toast({
        variant: 'destructive',
        title: 'Não foi possível salvar a equipe',
        description: 'Verifique os dados informados e tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const managerFieldLabel = useMemo(() => {
    if (!selectedManager) return 'Buscar responsável';
    return selectedManager.name;
  }, [selectedManager]);

  const managerHelperText = selectedManager?.email ?? 'Selecione um responsável para acompanhar o time.';

  const content = (
    <div className="space-y-6 px-6 pb-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="team-form-name">Nome da equipe *</Label>
            <Input
              id="team-form-name"
              autoFocus
              required
              value={formState.name}
              onChange={event => setFormState(current => ({ ...current, name: event.target.value }))}
              placeholder="Equipe Alto Tietê"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="team-form-type">Tipo de operação</Label>
            <Select
              value={formState.type}
              onValueChange={value =>
                setFormState(current => ({ ...current, type: value as TeamType }))
              }
            >
              <SelectTrigger id="team-form-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_TYPE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-foreground">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.helper}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 md:grid-cols-2 md:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="team-form-branch">Filial ou unidade *</Label>
              <Input
                id="team-form-branch"
                required
                value={formState.branch}
                onChange={event => setFormState(current => ({ ...current, branch: event.target.value }))}
                placeholder="Filial Paulista"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-form-status">
                Status operacional
                <span className="sr-only"> (ativo ou inativo)</span>
              </Label>
              <div className="flex items-center justify-between rounded-lg border border-input px-4 py-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {isActive ? 'Equipe ativa' : 'Equipe inativa'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Controla distribuição de leads e visibilidade em dashboards.
                  </p>
                </div>
                <Switch
                  id="team-form-status"
                  checked={isActive}
                  onCheckedChange={handleToggleStatus}
                  aria-label={isActive ? 'Arquivar equipe' : 'Reativar equipe'}
                />
              </div>
              <Select
                value={lastActiveStatus}
                onValueChange={handleChangeActiveStatus}
                disabled={!isActive}
              >
                <SelectTrigger id="team-form-operational">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVE_STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 md:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="team-form-street">Endereço</Label>
              <Input
                id="team-form-street"
                value={formState.address.street}
                onChange={event =>
                  setFormState(current => ({
                    ...current,
                    address: { ...current.address, street: event.target.value },
                  }))
                }
                placeholder="Rua ou avenida"
                autoComplete="street-address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-form-number">Número</Label>
              <Input
                id="team-form-number"
                value={formState.address.number}
                onChange={event =>
                  setFormState(current => ({
                    ...current,
                    address: { ...current.address, number: event.target.value },
                  }))
                }
                placeholder="123"
                autoComplete="address-line2"
              />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 md:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="team-form-neighborhood">Bairro</Label>
              <Input
                id="team-form-neighborhood"
                value={formState.address.neighborhood}
                onChange={event =>
                  setFormState(current => ({
                    ...current,
                    address: { ...current.address, neighborhood: event.target.value },
                  }))
                }
                placeholder="Bairro"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-form-complement">Complemento</Label>
              <Input
                id="team-form-complement"
                value={formState.address.complement}
                onChange={event =>
                  setFormState(current => ({
                    ...current,
                    address: { ...current.address, complement: event.target.value },
                  }))
                }
                placeholder="Sala, torre, referência"
              />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-3 md:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="team-form-city">Cidade</Label>
              <Input
                id="team-form-city"
                value={formState.address.city}
                onChange={event =>
                  setFormState(current => ({
                    ...current,
                    address: { ...current.address, city: event.target.value },
                  }))
                }
                placeholder="São Paulo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-form-state">Estado</Label>
              <Input
                id="team-form-state"
                value={formState.address.state}
                onChange={event =>
                  setFormState(current => ({
                    ...current,
                    address: { ...current.address, state: event.target.value },
                  }))
                }
                placeholder="SP"
                maxLength={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-form-zip">CEP</Label>
              <Input
                id="team-form-zip"
                value={formState.address.zipCode}
                onChange={event =>
                  setFormState(current => ({
                    ...current,
                    address: { ...current.address, zipCode: event.target.value },
                  }))
                }
                placeholder="00000-000"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="team-form-manager">Responsável direto</Label>
            <Popover open={managerPopoverOpen} onOpenChange={setManagerPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-between"
                  aria-haspopup="listbox"
                  aria-expanded={managerPopoverOpen}
                  id="team-form-manager"
                >
                  <span className="truncate text-left">
                    {selectedManager ? managerFieldLabel : 'Selecionar responsável'}
                  </span>
                  <Search className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Buscar por nome, e-mail ou telefone"
                    value={managerSearchTerm}
                    onValueChange={setManagerSearchTerm}
                    aria-label="Buscar responsável"
                  />
                  <CommandList>
                    {managerLoading ? (
                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Carregando...
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                        <CommandGroup>
                          {managerResults.map(user => (
                            <CommandItem
                              key={user.id}
                              value={`${user.name} ${user.email ?? ''}`.trim()}
                              onSelect={() => {
                                setSelectedManager(user);
                                setManagerPopoverOpen(false);
                              }}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email ?? 'E-mail não informado'}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">{managerHelperText || 'Responsável sem e-mail cadastrado.'}</p>
            {selectedManager && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-fit px-3"
                onClick={() => setSelectedManager(null)}
              >
                Remover responsável
              </Button>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="team-form-description">Observações</Label>
            <Textarea
              id="team-form-description"
              value={formState.description}
              onChange={event =>
                setFormState(current => ({ ...current, description: event.target.value }))
              }
              placeholder="Metas, diferenciais ou acordos internos sobre o time."
              rows={4}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            {mode === 'create' ? 'Adicionar equipe' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </div>
  );

  const archiveDialog = (
    <AlertDialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Arquivar equipe</AlertDialogTitle>
          <AlertDialogDescription>
            A equipe arquivada deixa de receber leads e some dos dashboards. Você pode reativar
            quando quiser.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelArchive}>Manter ativa</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmArchive} className="bg-red-600 hover:bg-red-600/90">
            Arquivar equipe
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={openState => !openState && onClose()}>
          <DialogContent className="max-w-3xl overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>{mode === 'create' ? 'Adicionar equipe' : 'Editar equipe'}</DialogTitle>
              <DialogDescription>
                Estruture responsáveis, endereço operacional e observações estratégicas.
              </DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
        {archiveDialog}
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={openState => !openState && onClose()}>
        <DrawerContent className="max-h-[90dvh] overflow-y-auto p-0">
          <DrawerHeader className="px-6 pt-6">
            <DrawerTitle>{mode === 'create' ? 'Adicionar equipe' : 'Editar equipe'}</DrawerTitle>
            <DrawerDescription>
              Estruture responsáveis, endereço operacional e observações estratégicas.
            </DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
      {archiveDialog}
    </>
  );
}
