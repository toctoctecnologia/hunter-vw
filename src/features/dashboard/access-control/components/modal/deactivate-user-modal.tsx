'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Archive, CalendarIcon, Check, RefreshCcw, Thermometer } from 'lucide-react';
import { useRouter } from '@/shims/next-navigation';

import { LeadIntensityType, ModalProps } from '@/shared/types';
import { cn, getIntensityColor, getIntensityText } from '@/shared/lib/utils';

import { deactivateUser, deactivateUserMetrics } from '@/features/dashboard/access-control/api/user-management';
import { getQueues } from '@/features/dashboard/distribution/api/queue';

import {
  DeactivateUserFormData,
  deactivateUserSchema,
} from '@/features/dashboard/access-control/components/form/deactivate-user-form/schema';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Loading } from '@/shared/components/loading';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface DeactivateUserModalProps extends Omit<ModalProps, 'title' | 'description'> {
  open: boolean;
  onClose: () => void;
  userUuid: string;
}

const ALL_TEMPERATURES = Object.values(LeadIntensityType);

export function DeactivateUserModal({ open, onClose, userUuid }: DeactivateUserModalProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['deactivate-user-metrics', userUuid],
    queryFn: () => deactivateUserMetrics(userUuid),
    enabled: open && !!userUuid,
  });

  const { data: queues = [], isLoading: isLoadingQueues } = useQuery({
    queryKey: ['deactivate-user-queues'],
    queryFn: () => getQueues({ isActive: '0', search: '' }, ''),
    enabled: open,
  });

  const form = useForm<DeactivateUserFormData>({
    resolver: zodResolver(deactivateUserSchema),
    defaultValues: {
      userUuid: userUuid,
      shouldRedistributeLeads: false,
      scheduledAt: '',
      leadTemperatures: ALL_TEMPERATURES,
      queueUuid: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: DeactivateUserFormData) => deactivateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário desativado com sucesso!');
      form.reset();
      onClose();
      router.back();
    },
  });

  function onSubmit(data: DeactivateUserFormData) {
    mutate({
      ...data,
      userUuid,
      scheduledAt: data.scheduledAt || '',
      queueUuid: data.queueUuid || '',
    });
  }

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const shouldRedistribute = form.watch('shouldRedistributeLeads');
  const selectedTemperatures = form.watch('leadTemperatures');

  const toggleTemperature = (temp: LeadIntensityType) => {
    const current = form.getValues('leadTemperatures');
    if (current.includes(temp)) {
      form.setValue(
        'leadTemperatures',
        current.filter((t) => t !== temp),
      );
    } else {
      form.setValue('leadTemperatures', [...current, temp]);
    }
  };

  const isLoading = isLoadingMetrics || isLoadingQueues;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Desativar Usuário"
      description="Preencha os dados para desativar um usuário"
      className="max-w-2xl"
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {metrics && metrics.leadsTotalAmount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resumo de Leads</CardTitle>
                  <CardDescription>
                    Este usuário possui <strong>{metrics.leadsTotalAmount}</strong> leads ativos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {ALL_TEMPERATURES.map((key) => {
                      const count =
                        metrics.leadsCountByIntensity[key as keyof typeof metrics.leadsCountByIntensity] || 0;
                      const color = getIntensityColor(key);
                      return (
                        <div key={key} className="flex items-center gap-2 rounded-lg border p-3">
                          <Thermometer className="h-4 w-4" style={{ color }} />
                          <div>
                            <p className="text-xs text-muted-foreground">{getIntensityText(key)}</p>
                            <p className="text-lg font-semibold">{count}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <FormField
              control={form.control}
              name="shouldRedistributeLeads"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>O que fazer com os leads?</FormLabel>
                  <FormControl>
                    <div className="grid gap-4">
                      <div
                        onClick={() => field.onChange(true)}
                        className={cn(
                          'relative flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all hover:bg-accent',
                          field.value === true ? 'border-primary bg-primary/5' : 'border-muted',
                        )}
                      >
                        {field.value === true && (
                          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex size-9 items-center justify-center rounded-full',
                              field.value === true ? 'bg-primary/20' : 'bg-muted',
                            )}
                          >
                            <RefreshCcw
                              className={cn('size-4', field.value === true ? 'text-primary' : 'text-muted-foreground')}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">Redistribuir Leads</h4>
                            <p className="text-xs text-muted-foreground">
                              Os leads serão enviados automaticamente para uma fila
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => field.onChange(false)}
                        className={cn(
                          'relative flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all hover:bg-accent',
                          field.value === false ? 'border-primary bg-primary/5' : 'border-muted',
                        )}
                      >
                        {field.value === false && (
                          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex size-9 items-center justify-center rounded-full',
                              field.value === false ? 'bg-primary/20' : 'bg-muted',
                            )}
                          >
                            <Archive
                              className={cn('size-4', field.value === false ? 'text-primary' : 'text-muted-foreground')}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">Arquivar Leads</h4>
                            <p className="text-xs text-muted-foreground">
                              Os leads serão arquivados e não serão redistribuídos
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {shouldRedistribute && (
              <FormField
                control={form.control}
                name="queueUuid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fila de destino (opcional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma fila específica" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {queues.map((queue) => (
                          <SelectItem key={queue.uuid} value={queue.uuid}>
                            {queue.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-3">
              <Label>Temperaturas de leads para processar</Label>
              <p className="text-xs text-muted-foreground">
                Selecione quais temperaturas de leads devem ser processadas. Apenas os leads com as temperaturas
                selecionadas serão arquivados ou redistribuídos.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ALL_TEMPERATURES.map((key) => {
                  const isSelected = selectedTemperatures.includes(key);
                  const color = getIntensityColor(key);
                  return (
                    <div
                      key={key}
                      onClick={() => toggleTemperature(key)}
                      className={cn(
                        'relative flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all hover:bg-accent',
                        isSelected ? 'border-primary' : 'border-muted',
                      )}
                      style={isSelected ? { backgroundColor: `${color}15`, borderColor: color } : undefined}
                    >
                      {isSelected && (
                        <div
                          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full"
                          style={{ backgroundColor: color }}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <Thermometer className="h-5 w-5" style={{ color }} />
                      <div>
                        <p className="text-sm font-medium">{getIntensityText(key)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Agendar desativação (opcional)</FormLabel>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(new Date(field.value), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                              : 'Selecione uma data'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = field.value ? new Date(field.value) : new Date();
                              date.setHours(currentTime.getHours(), currentTime.getMinutes());
                              field.onChange(date.toISOString());
                            } else {
                              field.onChange('');
                            }
                          }}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      className="w-full sm:w-32"
                      value={field.value ? format(new Date(field.value), 'HH:mm') : ''}
                      onChange={(e) => {
                        if (e.target.value && field.value) {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const date = new Date(field.value);
                          date.setHours(hours, minutes);
                          field.onChange(date.toISOString());
                        } else if (e.target.value) {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const date = new Date();
                          date.setHours(hours, minutes);
                          field.onChange(date.toISOString());
                        }
                      }}
                      disabled={!field.value}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Se nenhuma data for selecionada, a desativação será imediata
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" isLoading={isPending}>
                Desativar Usuário
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Modal>
  );
}
