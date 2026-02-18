import { useEffect, useMemo, useState } from 'react';
import { Loader2, Check, ShieldAlert } from 'lucide-react';

import { Lead } from '@/data/leads/leadTypes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { httpJSON, HttpError } from '@/lib/http';
import { getUsers, type User } from '@/services/users';
import { useToast } from '@/hooks/use-toast';
import { REDISTRIBUICAO_FILAS } from '@/data/redistribuicaoFilters';

type TransferMode = 'corretor' | 'fila';

interface TransferLeadModalProps {
  open: boolean;
  lead: Lead | null;
  currentUserId?: string | null;
  onClose: () => void;
  onTransferred: (leadId: string, owner: { id: string; name: string }) => void;
  onTransferredToQueue?: (leadId: string, queue: { id: string; name: string }) => void;
}

export function TransferLeadModal({
  open,
  lead,
  currentUserId,
  onClose,
  onTransferred,
  onTransferredToQueue
}: TransferLeadModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [transferMode, setTransferMode] = useState<TransferMode>('corretor');
  const [selectedQueueId, setSelectedQueueId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    setLoadingUsers(true);
    getUsers({ status: 'active' })
      .then(data => {
        if (!isMounted) return;
        const items = Array.isArray(data) ? data : data.items;
        setUsers(items);
      })
      .catch(error => {
        console.error('Erro ao buscar usuários para transferência', error);
        if (!isMounted) return;
        toast({
          variant: 'destructive',
          title: 'Não foi possível carregar os corretores',
          description: 'Tente novamente em instantes.'
        });
      })
      .finally(() => {
        if (isMounted) setLoadingUsers(false);
      });

    return () => {
      isMounted = false;
    };
  }, [open, toast]);

  useEffect(() => {
    if (!open) {
      setSelectedUser(null);
      setSelectedQueueId('');
      setTransferMode('corretor');
      return;
    }
    setSelectedUser(null);
    setSelectedQueueId('');
    setTransferMode('corretor');
  }, [open, lead?.id]);

  const queueOptions = useMemo(
    () => [
      ...REDISTRIBUICAO_FILAS,
      { value: 'fila-locacao', label: 'Fila de Locação' },
      { value: 'fila-vendas', label: 'Fila de Vendas' },
    ],
    []
  );

  const filteredUsers = useMemo(() => {
    if (!users.length) return [] as User[];
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  const handleSelectUser = (user: User) => {
    if (lead?.ownerId === user.id) return;
    setSelectedUser(user);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (!lead) return;

    if (transferMode === 'corretor' && !selectedUser) {
      return;
    }

    if (transferMode === 'fila' && !selectedQueueId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedQueue = queueOptions.find(queue => queue.value === selectedQueueId);

      await httpJSON(`/leads/${lead.id}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          fromUserId: lead.ownerId ?? '',
          transferType: transferMode,
          toUserId: transferMode === 'corretor' ? selectedUser?.id : undefined,
          toQueueId: transferMode === 'fila' ? selectedQueueId : undefined,
          transferredBy: currentUserId ?? 'system',
        })
      });

      if (transferMode === 'fila' && selectedQueue) {
        toast({
          title: 'Transferência concluída',
          description: `Lead transferido para ${selectedQueue.label}`,
        });
        onTransferredToQueue?.(lead.id, { id: selectedQueue.value, name: selectedQueue.label });
      } else if (selectedUser) {
        toast({
          title: 'Transferência concluída',
          description: `Lead transferido para ${selectedUser.name}`,
        });
        onTransferred(lead.id, { id: selectedUser.id, name: selectedUser.name });
      }
      onClose();
    } catch (error) {
      const message = error instanceof HttpError ? error.message : 'Não foi possível transferir o lead.';
      toast({
        variant: 'destructive',
        title: 'Erro ao transferir lead',
        description: message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledIds = useMemo(() => new Set(lead?.ownerId ? [lead.ownerId] : []), [lead?.ownerId]);

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!nextOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transferir lead</DialogTitle>
          <DialogDescription>
            Escolha um novo responsável para o lead selecionado. A transferência é imediata.
          </DialogDescription>
        </DialogHeader>
        {lead && (
          <div className="rounded-md border bg-muted/60 p-4 space-y-3 text-sm">
            <div>
              <span className="text-xs uppercase text-muted-foreground">Lead</span>
              <p className="text-base font-semibold text-foreground">{lead.name}</p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">E-mail</span>
                <p className="font-medium text-foreground">{lead.email || '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Telefone</span>
                <p className="font-medium text-foreground">{lead.phone || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Responsável atual</span>
              <Badge variant="outline">{lead.ownerName || 'Não atribuído'}</Badge>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Destino da transferência</span>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-1">
            <Button
              type="button"
              variant={transferMode === 'corretor' ? 'default' : 'ghost'}
              className="h-9"
              onClick={() => setTransferMode('corretor')}
            >
              Corretor
            </Button>
            <Button
              type="button"
              variant={transferMode === 'fila' ? 'default' : 'ghost'}
              className="h-9"
              onClick={() => setTransferMode('fila')}
            >
              Fila
            </Button>
          </div>
        </div>

        {transferMode === 'corretor' ? (
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Selecionar corretor</span>
          <Command>
            <CommandInput placeholder="Buscar por nome, e-mail ou telefone" disabled={loadingUsers} />
            <CommandList>
              {loadingUsers ? (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando corretores...
                </div>
              ) : (
                <>
                  <CommandEmpty>Nenhum corretor encontrado.</CommandEmpty>
                  <CommandGroup>
                    {filteredUsers.map(user => {
                      const isCurrentOwner = disabledIds.has(user.id);
                      return (
                        <CommandItem
                          key={user.id}
                          value={`${user.name} ${user.email ?? ''}`.trim()}
                          onSelect={() => handleSelectUser(user)}
                          disabled={isCurrentOwner}
                        >
                          <div className="flex w-full items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {user.active === false && (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                  <ShieldAlert className="h-3 w-3" /> Inativo
                                </Badge>
                              )}
                              {selectedUser?.id === user.id && <Check className="h-4 w-4 text-primary" />}
                              {isCurrentOwner && (
                                <Badge variant="secondary">Atual</Badge>
                              )}
                            </div>
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
        ) : (
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Selecionar fila</span>
            <Select value={selectedQueueId} onValueChange={setSelectedQueueId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma fila" />
              </SelectTrigger>
              <SelectContent>
                {queueOptions.map(queue => (
                  <SelectItem key={queue.value} value={queue.value}>
                    {queue.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={(transferMode === 'corretor' ? !selectedUser : !selectedQueueId) || isSubmitting}
            className="bg-[#FF5506] text-white hover:bg-[#e64d05] focus-visible:ring-[#FF5506]"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Transferir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TransferLeadModal;
