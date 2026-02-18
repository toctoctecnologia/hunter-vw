import { useEffect, useMemo, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Paperclip, Send, ShieldCheck, ArchiveRestore } from 'lucide-react';
import type { Ticket, UpdateTicketInput, User } from '@/types/service-management';
import { ORIGIN_LABELS, PRIORITY_LABELS, STATUS_CONFIG } from './serviceUtils';

interface TicketDrawerProps {
  ticket: Ticket | null;
  open: boolean;
  focus?: 'details' | 'comments' | 'schedule' | 'assignee';
  users: User[];
  onOpenChange: (open: boolean) => void;
  onSave: (ticketId: string, payload: UpdateTicketInput) => Promise<void>;
  onMoveStatus: (ticketId: string, status: Ticket['status']) => Promise<void>;
  onAddComment: (ticketId: string, message: string) => Promise<void>;
  onUploadAttachment: (ticketId: string, files: File[]) => Promise<void>;
  onResolve: (ticket: Ticket) => void;
  onArchive: (ticket: Ticket) => void;
  onReopen: (ticket: Ticket) => void;
}

const toLocalInputValue = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const TicketDrawer = ({
  ticket,
  open,
  focus = 'details',
  users,
  onOpenChange,
  onSave,
  onMoveStatus,
  onAddComment,
  onUploadAttachment,
  onResolve,
  onArchive,
  onReopen
}: TicketDrawerProps) => {
  const [formState, setFormState] = useState<UpdateTicketInput>({});
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'attachments' | 'history' | 'schedule'>('details');

  useEffect(() => {
    if (ticket) {
      setFormState({
        title: ticket.title,
        description: ticket.description,
        clientId: ticket.clientId,
        clientName: ticket.clientName,
        category: ticket.category,
        priority: ticket.priority,
        origin: ticket.origin,
        slaHours: ticket.slaHours,
        status: ticket.status,
        tags: ticket.tags,
        assigneeId: ticket.assigneeId,
        assigneeName: ticket.assigneeName,
        hasSchedule: ticket.hasSchedule,
        scheduleStart: ticket.scheduleStart,
        scheduleEnd: ticket.scheduleEnd,
        scheduleLocation: ticket.scheduleLocation,
        scheduleNotes: ticket.scheduleNotes
      });
      setActiveTab(
        focus === 'comments'
          ? 'comments'
          : focus === 'schedule'
            ? 'schedule'
            : 'details'
      );
    }
  }, [ticket, focus]);

  const selectedAssignee = useMemo(() => {
    if (!formState.assigneeId) return undefined;
    return users.find(user => user.id === formState.assigneeId) ?? {
      id: formState.assigneeId,
      name: formState.assigneeName ?? 'Responsável'
    };
  }, [formState.assigneeId, formState.assigneeName, users]);

  if (!ticket) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="px-6 pt-6 text-left">
          <DrawerTitle className="text-xl font-semibold">Ticket {ticket.code}</DrawerTitle>
          <DrawerDescription>Edite as informações principais, acompanhe o histórico e registre interações.</DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-6">
          <div className="mb-6 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-border bg-card p-4">
              <h4 className="text-sm font-semibold">Resumo</h4>
              <p className="mt-2 text-sm text-muted-foreground">{ticket.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{ticket.category}</Badge>
                <Badge variant="secondary">{PRIORITY_LABELS[ticket.priority]}</Badge>
                {ticket.hasTask ? <Badge variant="secondary">Task vinculada</Badge> : null}
                {ticket.hasSchedule ? <Badge variant="secondary">Agenda vinculada</Badge> : null}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <h4 className="text-sm font-semibold">Ações rápidas</h4>
              <div className="mt-3 grid gap-2">
                <Button type="button" variant="secondary" onClick={() => onResolve(ticket)}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Marcar como resolvido
                </Button>
                <Button type="button" variant="secondary" onClick={() => onArchive(ticket)}>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Arquivar / descartar
                </Button>
                {ticket.status === 'arquivado' ? (
                  <Button type="button" variant="secondary" onClick={() => onReopen(ticket)}>
                    Reabrir ticket
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {(['details', 'comments', 'attachments', 'history', 'schedule'] as const).map(tab => (
                  <Button
                    key={tab}
                    type="button"
                    variant={activeTab === tab ? 'default' : 'outline'}
                    onClick={() => setActiveTab(tab)}
                  >
                    {
                      {
                        details: 'Detalhes',
                        comments: 'Comentários',
                        attachments: 'Anexos',
                        history: 'Histórico',
                        schedule: 'Agendamento'
                      }[tab]
                    }
                  </Button>
                ))}
              </div>

              {activeTab === 'details' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="ticket-title">Título</Label>
                    <Input
                      id="ticket-title"
                      value={formState.title ?? ''}
                      onChange={event => setFormState(prev => ({ ...prev, title: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticket-client">Cliente</Label>
                    <Input
                      id="ticket-client"
                      value={formState.clientName ?? ''}
                      onChange={event => setFormState(prev => ({ ...prev, clientName: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticket-category">Categoria</Label>
                    <Input
                      id="ticket-category"
                      value={formState.category ?? ''}
                      onChange={event => setFormState(prev => ({ ...prev, category: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticket-tags">Tags</Label>
                    <Input
                      id="ticket-tags"
                      value={(formState.tags ?? []).join(', ')}
                      onChange={event =>
                        setFormState(prev => ({
                          ...prev,
                          tags: event.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select
                      value={formState.priority ?? ticket.priority}
                      onValueChange={value => setFormState(prev => ({ ...prev, priority: value as Ticket['priority'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formState.status ?? ticket.status}
                      onValueChange={value => setFormState(prev => ({ ...prev, status: value as Ticket['status'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_CONFIG.map(status => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Responsável</Label>
                    <Select
                      value={selectedAssignee?.id}
                      onValueChange={value => {
                        const selected = users.find(user => user.id === value);
                        setFormState(prev => ({
                          ...prev,
                          assigneeId: selected?.id,
                          assigneeName: selected?.name
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Origem</Label>
                    <Select
                      value={formState.origin ?? ticket.origin}
                      onValueChange={value => setFormState(prev => ({ ...prev, origin: value as Ticket['origin'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ORIGIN_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticket-sla">SLA (horas)</Label>
                    <Input
                      id="ticket-sla"
                      type="number"
                      min={1}
                      value={formState.slaHours ?? ticket.slaHours}
                      onChange={event => setFormState(prev => ({ ...prev, slaHours: Number(event.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="ticket-description">Descrição</Label>
                    <Textarea
                      id="ticket-description"
                      rows={4}
                      value={formState.description ?? ''}
                      onChange={event => setFormState(prev => ({ ...prev, description: event.target.value }))}
                    />
                  </div>
                </div>
              ) : null}

              {activeTab === 'comments' ? (
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold">Comentários internos</h4>
                      <p className="text-xs text-muted-foreground">Visível apenas para o time.</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="Escreva um comentário"
                      value={comment}
                      onChange={event => setComment(event.target.value)}
                      onKeyDown={event => {
                        if (event.key === 'Enter' && comment.trim()) {
                          onAddComment(ticket.id, comment.trim());
                          setComment('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (!comment.trim()) return;
                        onAddComment(ticket.id, comment.trim());
                        setComment('');
                      }}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {ticket.comments.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Nenhum comentário registrado.</p>
                    ) : (
                      ticket.comments.map(commentItem => (
                        <div key={commentItem.id} className="rounded-xl border border-border bg-card p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold">{commentItem.author.name}</p>
                            <span className="text-[11px] text-muted-foreground">
                              {new Date(commentItem.createdAt).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-foreground">{commentItem.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : null}

              {activeTab === 'attachments' ? (
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Anexos</h4>
                    <Button asChild variant="ghost" size="sm">
                      <label htmlFor="ticket-attachment" className="cursor-pointer">
                        <Paperclip className="mr-2 h-4 w-4" />
                        Upload
                      </label>
                    </Button>
                    <input
                      id="ticket-attachment"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={event => {
                        if (!event.target.files?.length) return;
                        onUploadAttachment(ticket.id, Array.from(event.target.files));
                      }}
                    />
                  </div>
                  <div className="mt-3 space-y-2">
                    {ticket.attachments.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Nenhum anexo enviado.</p>
                    ) : (
                      ticket.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-xs">
                          <span className="truncate">{attachment.name}</span>
                          <Badge variant="secondary">{Math.round(attachment.size / 1024)}kb</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : null}

              {activeTab === 'history' ? (
                <div className="rounded-2xl border border-border bg-card p-4">
                  <h4 className="text-sm font-semibold">Linha do tempo</h4>
                  <ScrollArea className="mt-3 h-64 pr-2">
                    <div className="space-y-3">
                      {ticket.history.map(entry => (
                        <div key={entry.id} className="rounded-xl border border-border bg-muted/30 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold">{entry.description}</p>
                            <span className="text-[11px] text-muted-foreground">
                              {new Date(entry.createdAt).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          {entry.author ? (
                            <p className="mt-1 text-[11px] text-muted-foreground">{entry.author.name}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : null}

              {activeTab === 'schedule' ? (
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold">Agendamento</h4>
                      <p className="text-xs text-muted-foreground">Crie ou atualize evento na agenda.</p>
                    </div>
                    <Switch
                      checked={formState.hasSchedule ?? false}
                      onCheckedChange={checked =>
                        setFormState(prev => ({
                          ...prev,
                          hasSchedule: checked,
                          scheduleStart: checked ? prev.scheduleStart : undefined,
                          scheduleEnd: checked ? prev.scheduleEnd : undefined
                        }))
                      }
                    />
                  </div>
                  {formState.hasSchedule ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="ticket-schedule-start">Início</Label>
                        <Input
                          id="ticket-schedule-start"
                          type="datetime-local"
                          value={toLocalInputValue(formState.scheduleStart)}
                          onChange={event =>
                            setFormState(prev => ({
                              ...prev,
                              scheduleStart: event.target.value ? new Date(event.target.value).toISOString() : undefined
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticket-schedule-end">Fim</Label>
                        <Input
                          id="ticket-schedule-end"
                          type="datetime-local"
                          value={toLocalInputValue(formState.scheduleEnd)}
                          onChange={event =>
                            setFormState(prev => ({
                              ...prev,
                              scheduleEnd: event.target.value ? new Date(event.target.value).toISOString() : undefined
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="ticket-schedule-location">Local</Label>
                        <Input
                          id="ticket-schedule-location"
                          value={formState.scheduleLocation ?? ''}
                          onChange={event => setFormState(prev => ({ ...prev, scheduleLocation: event.target.value }))}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="ticket-schedule-notes">Observações</Label>
                        <Textarea
                          id="ticket-schedule-notes"
                          rows={3}
                          value={formState.scheduleNotes ?? ''}
                          onChange={event => setFormState(prev => ({ ...prev, scheduleNotes: event.target.value }))}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">Ative o agendamento para criar evento na agenda.</p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-4">
                <h4 className="text-sm font-semibold">Status atual</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STATUS_CONFIG.map(status => (
                    <Button
                      key={status.id}
                      type="button"
                      size="sm"
                      variant={ticket.status === status.id ? 'default' : 'outline'}
                      onClick={() => onMoveStatus(ticket.id, status.id)}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <h4 className="text-sm font-semibold">Vínculos</h4>
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <p>Task vinculada: {ticket.hasTask ? 'Sim' : 'Não'}</p>
                  <p>Evento na agenda: {ticket.hasSchedule ? 'Sim' : 'Não'}</p>
                  <p>Prazo calculado: {new Date(ticket.dueAt).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <DrawerFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {ticket.tags?.map(tag => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => onSave(ticket.id, formState)}>
              Salvar alterações
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
