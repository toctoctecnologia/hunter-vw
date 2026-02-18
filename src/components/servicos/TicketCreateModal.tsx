import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { CreateTicketInput, Ticket, User } from '@/types/service-management';
import { ORIGIN_LABELS, PRIORITY_LABELS } from './serviceUtils';

interface TicketCreateModalProps {
  open: boolean;
  users: User[];
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: CreateTicketInput, files: File[]) => Promise<void>;
}

const toLocalInputValue = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const TicketCreateModal = ({ open, onOpenChange, users, onCreate }: TicketCreateModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [formState, setFormState] = useState<CreateTicketInput>({
    title: '',
    description: '',
    clientName: '',
    category: '',
    priority: 'media',
    assigneeId: users[0]?.id,
    assigneeName: users[0]?.name,
    origin: 'plataforma',
    slaHours: 48,
    tags: [],
    hasSchedule: false,
    scheduleStart: undefined,
    scheduleEnd: undefined,
    scheduleLocation: '',
    scheduleNotes: ''
  });

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setFormState(prev => ({
        ...prev,
        title: '',
        description: '',
        clientName: '',
        category: '',
        tags: [],
        hasSchedule: false,
        scheduleStart: undefined,
        scheduleEnd: undefined,
        scheduleLocation: '',
        scheduleNotes: ''
      }));
    }
  }, [open]);

  const canSubmit = formState.title.trim().length > 0 && formState.description.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo ticket</DialogTitle>
          <DialogDescription>Registre uma nova solicitação para a equipe de serviços.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="new-title">Título *</Label>
            <Input
              id="new-title"
              value={formState.title}
              onChange={event => setFormState(prev => ({ ...prev, title: event.target.value }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="new-description">Descrição *</Label>
            <Textarea
              id="new-description"
              rows={4}
              value={formState.description}
              onChange={event => setFormState(prev => ({ ...prev, description: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-client">Cliente</Label>
            <Input
              id="new-client"
              value={formState.clientName}
              onChange={event => setFormState(prev => ({ ...prev, clientName: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-category">Categoria</Label>
            <Input
              id="new-category"
              value={formState.category}
              onChange={event => setFormState(prev => ({ ...prev, category: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-tags">Tags</Label>
            <Input
              id="new-tags"
              placeholder="ex: contrato, vip"
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
              value={formState.priority}
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
            <Label>Responsável</Label>
            <Select
              value={formState.assigneeId}
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
              value={formState.origin}
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
            <Label htmlFor="new-sla">SLA (horas)</Label>
            <Input
              id="new-sla"
              type="number"
              min={1}
              value={formState.slaHours}
              onChange={event => setFormState(prev => ({ ...prev, slaHours: Number(event.target.value) }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label>Agendamento</Label>
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
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-schedule-start">Início</Label>
                  <Input
                    id="new-schedule-start"
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
                  <Label htmlFor="new-schedule-end">Fim</Label>
                  <Input
                    id="new-schedule-end"
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
                  <Label htmlFor="new-schedule-location">Local</Label>
                  <Input
                    id="new-schedule-location"
                    value={formState.scheduleLocation ?? ''}
                    onChange={event => setFormState(prev => ({ ...prev, scheduleLocation: event.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="new-schedule-notes">Observações</Label>
                  <Textarea
                    id="new-schedule-notes"
                    rows={3}
                    value={formState.scheduleNotes ?? ''}
                    onChange={event => setFormState(prev => ({ ...prev, scheduleNotes: event.target.value }))}
                  />
                </div>
              </div>
            ) : null}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="new-attachments">Anexos</Label>
            <Input
              id="new-attachments"
              type="file"
              multiple
              onChange={event => setFiles(event.target.files ? Array.from(event.target.files) : [])}
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-2">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() => onCreate(formState, files)}
          >
            Criar ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
