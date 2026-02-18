'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Copy, Trash2, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';

import { QueueItemDetailUser, QueueRuleOperationTypes } from '@/shared/types';
import { APPOINTMENT_COLORS } from '@/shared/lib/constants';
import { DAYS_OF_WEEK, OPERATOR_OPTIONS, queueRuleLabels } from '@/shared/lib/utils';

import { withPermission } from '@/shared/hoc/with-permission';

import { deleteQueue, getQueue, getRules, newQueue, updateQueue } from '@/features/dashboard/distribution/api/queue';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { QueueFormData, taskSchema } from '@/features/dashboard/distribution/components/form/new-queue-schema';
import { SortableUserCard } from '@/features/dashboard/distribution/components/sortable-user-card';
import { CatcherListModal } from '@/shared/components/modal/catcher-list-modal';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { BackHeader } from '@/features/dashboard/components/back-header';
import { TypographySmall } from '@/shared/components/ui/typography';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { LoadingFull } from '@/shared/components/loading-full';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Slider } from '@/shared/components/ui/slider';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

function Page() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const queueId = params.queueId as string;
  const isNewQueue = queueId === 'new';

  const [showCatcherModal, setShowCatcherModal] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [users, setUsers] = useState<QueueItemDetailUser[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { data: queueData, isLoading: isLoadingQueue } = useQuery({
    queryKey: ['queue', queueId],
    queryFn: () => getQueue(queueId),
    enabled: !isNewQueue,
  });

  const { data: rulesData } = useQuery({
    queryKey: ['queue-rules'],
    queryFn: () => getRules(),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = users.findIndex((user) => user.userUuid === active.id);
      const newIndex = users.findIndex((user) => user.userUuid === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newUsers = [...users];
        const [movedUser] = newUsers.splice(oldIndex, 1);
        newUsers.splice(newIndex, 0, movedUser);

        // Atualizar userOrder para todos os usuários
        const reorderedUsers = newUsers.map((user, index) => ({
          ...user,
          userOrder: index + 1,
        }));

        setUsers(reorderedUsers);
      }
    }
  };

  const form = useForm<QueueFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      nextUserEnabled: false,
      timeLimitMinutes: 5,
      color: '#3b82f6',
      checkinConfig: {
        checkInRequired: false,
        timeWindowEnabled: false,
        startingTime: '00:00',
        endingTime: '23:59',
        daysOfWeek: 'MON,TUE,WED,THU,FRI',
        qrCodeEnabled: false,
      },
      rules: [],
    },
  });

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control: form.control,
    name: 'rules',
  });

  const createQueueMutation = useMutation({
    mutationFn: (data: QueueFormData & { users: QueueItemDetailUser[] }) => newQueue(data),
    onSuccess: () => {
      toast.success('Fila criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      router.push('/dashboard/distribution');
    },
  });

  const updateQueueMutation = useMutation({
    mutationFn: (data: QueueFormData & { users: QueueItemDetailUser[] }) => updateQueue(data, queueId),
    onSuccess: () => {
      toast.success('Fila atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      queryClient.invalidateQueries({ queryKey: ['queue', queueId] });
      router.push('/dashboard/distribution');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (queueId: string) => deleteQueue(queueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      toast.success('Fila excluída com sucesso');
      router.push('/dashboard/distribution');
    },
  });

  useEffect(() => {
    if (queueData && !isNewQueue) {
      form.reset({
        name: queueData.name,
        description: queueData.description || '',
        isActive: queueData.isActive,
        nextUserEnabled: queueData.nextUserEnabled,
        timeLimitMinutes: queueData.timeLimitMinutes,
        color: queueData.color,
        checkinConfig: {
          checkInRequired: queueData.checkinConfig.checkInRequired,
          timeWindowEnabled: queueData.checkinConfig.timeWindowEnabled,
          startingTime: queueData.checkinConfig.startingTime,
          endingTime: queueData.checkinConfig.endingTime,
          daysOfWeek: queueData.checkinConfig.daysOfWeek,
          qrCodeEnabled: queueData.checkinConfig.qrCodeEnabled,
        },
        rules: queueData.rules || [],
      });
      setUsers(queueData.users);
    }
  }, [queueData, isNewQueue, form]);

  function onSubmit(data: QueueFormData) {
    const payload = { ...data, users };
    if (isNewQueue) {
      createQueueMutation.mutate(payload);
    } else {
      updateQueueMutation.mutate(payload);
    }
  }

  const handleDelete = () => {
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!isNewQueue) {
      deleteMutation.mutate(queueId);
      setIsAlertOpen(false);
    }
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  };

  const toggleDay = (currentDays: string, dayId: string) => {
    const daysArray = currentDays.split(',').filter(Boolean);
    const newDays = daysArray.includes(dayId) ? daysArray.filter((d) => d !== dayId) : [...daysArray, dayId];
    return newDays.join(',');
  };

  if (isLoadingQueue) {
    return <LoadingFull title="Carregando fila..." />;
  }

  const isSaving = createQueueMutation.isPending || updateQueueMutation.isPending;

  return (
    <>
      <AlertModal
        isOpen={isAlertOpen}
        onClose={handleCloseAlert}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        title="Excluir fila"
        description={`Tem certeza que deseja excluir a fila "${queueData?.name}"? Essa ação não poderá ser desfeita.`}
      />

      <CatcherListModal
        open={showCatcherModal}
        onClose={() => setShowCatcherModal(false)}
        onConfirm={(selected) => {
          const currentMaxOrder = users.length > 0 ? Math.max(...users.map((u) => u.userOrder)) : 0;
          const newUsers = selected.map((item, index) => ({
            userUuid: item.uuid,
            userName: item.name,
            userOrder: currentMaxOrder + index + 1,
            type: 'user',
            isActive: true,
          }));
          setUsers((prev) => [...prev, ...newUsers]);
          setShowCatcherModal(false);
          toast.success(`${selected.length} ${selected.length === 1 ? 'item adicionado' : 'itens adicionados'} com sucesso!`);
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <BackHeader title={isNewQueue ? 'Nova Fila' : 'Configurar Fila'} />

          <div className="mx-auto w-full">
            <Accordion type="single" defaultValue="type" collapsible className="w-full space-y-4">
              <AccordionItem value="type" className="rounded-lg border bg-card">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <span className="text-sm md:text-lg font-semibold">Nome da fila</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da fila</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome da fila" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rules" className="rounded-lg border bg-card">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <span className="text-sm md:text-lg font-semibold">Regras</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    {ruleFields.length === 0 ? (
                      <div className="text-center py-8 rounded-lg border border-dashed">
                        <TypographySmall className="text-muted-foreground">
                          Nenhuma regra adicionada. Clique no botão abaixo para adicionar.
                        </TypographySmall>
                      </div>
                    ) : (
                      ruleFields.map((field, index) => (
                        <div key={field.id} className="space-y-3 rounded-lg border p-4 animate-in fade-in-50 slide-in-from-top-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Regra {index + 1}</span>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const rule = form.getValues(`rules.${index}`);
                                  appendRule({ ...rule, ruleUuid: rule.ruleUuid });
                                }}
                                title="Duplicar regra"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeRule(index)}
                                title="Remover regra"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-3">
                            <FormField
                              control={form.control}
                              name={`rules.${index}.ruleUuid`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Campo</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o campo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {rulesData?.map((rule) => (
                                        <SelectItem key={rule.uuid} value={rule.uuid}>
                                          {queueRuleLabels[rule.name]}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`rules.${index}.operation`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Operador</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o operador" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {OPERATOR_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`rules.${index}.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Valor</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Digite o valor" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        appendRule({
                          ruleUuid: '',
                          value: '',
                          operation: QueueRuleOperationTypes.EQUALS,
                        });
                      }}
                      disabled={!rulesData || rulesData.length === 0}
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar nova regra
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="schedule" className="rounded-lg border bg-card">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <span className="text-sm md:text-lg font-semibold">Configurações de horário e check-in</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="checkinConfig.timeWindowEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Habilitar janela de horário</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch('checkinConfig.timeWindowEnabled') && (
                      <div className="space-y-4 rounded-lg border p-4">
                        <FormField
                          control={form.control}
                          name="checkinConfig.daysOfWeek"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dias da semana</FormLabel>
                              <FormControl>
                                <div className="flex gap-2 flex-wrap">
                                  {DAYS_OF_WEEK.map((day) => (
                                    <Button
                                      key={day.id}
                                      type="button"
                                      variant={field.value.split(',').includes(day.id) ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => field.onChange(toggleDay(field.value, day.id))}
                                    >
                                      {day.label}
                                    </Button>
                                  ))}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="checkinConfig.startingTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Horário de início</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="checkinConfig.endingTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Horário de término</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="checkinConfig.checkInRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start justify-between gap-4 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Usuários selecionados precisam fazer check in</FormLabel>
                            <FormDescription>Usuários selecionados nesta fila precisam fazer o check-in.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checkinConfig.qrCodeEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start justify-between gap-4 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Gerar QRCode para check in</FormLabel>
                            <FormDescription>
                              Gere um QR Code específico desta fila para facilitar o check-in dos usuários selecionados.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="users" className="rounded-lg border bg-card">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <span className="text-sm md:text-lg font-semibold">Usuários ativos na fila</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <Button type="button" variant="outline" className="w-full" onClick={() => setShowCatcherModal(true)}>
                      <Plus className="h-4 w-4" />
                      Adicionar usuário ou equipe
                    </Button>

                    {users.length === 0 ? (
                      <div className="text-center py-8 rounded-lg border border-dashed">
                        <TypographySmall className="text-muted-foreground">
                          Nenhum usuário ou equipe adicionado. Clique no botão acima para adicionar.
                        </TypographySmall>
                      </div>
                    ) : (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={users.map((u) => u.userUuid)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-2">
                            {users.map((user, index) => (
                              <SortableUserCard
                                key={user.userUuid}
                                user={user}
                                index={index}
                                onUpdate={(idx, updates) => {
                                  setUsers((prev) => prev.map((u, i) => (i === idx ? { ...u, ...updates } : u)));
                                }}
                                onRemove={(idx) => {
                                  setUsers((prev) => {
                                    const newUsers = prev.filter((_, i) => i !== idx);
                                    // Reordenar userOrder após remoção
                                    return newUsers.map((u, i) => ({ ...u, userOrder: i + 1 }));
                                  });
                                }}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="advanced" className="rounded-lg border bg-card">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <span className="text-sm md:text-lg font-semibold">Configurações avançadas</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="nextUserEnabled"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Destino na fila</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => field.onChange(value === 'proximo')}
                              value={field.value ? 'proximo' : 'roletao'}
                            >
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start space-x-3 rounded-lg border p-4">
                                  <RadioGroupItem value="roletao" id="roletao" />
                                  <div className="flex-1 space-y-1">
                                    <Label htmlFor="roletao" className="font-medium cursor-pointer">
                                      Roletão
                                    </Label>
                                    <p className="text-sm text-muted-foreground">Coloca o lead no roletão quando disponível</p>
                                  </div>
                                </div>

                                <div className="flex items-start space-x-3 rounded-lg border p-4">
                                  <RadioGroupItem value="proximo" id="proximo" />
                                  <div className="flex-1 space-y-1">
                                    <Label htmlFor="proximo" className="font-medium cursor-pointer">
                                      Próximo da fila
                                    </Label>
                                    <p className="text-sm text-muted-foreground">Envia direto para o próximo corretor da fila</p>
                                  </div>
                                </div>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeLimitMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Janela de atendimento</FormLabel>
                            <span className="text-sm font-medium">{field.value} min</span>
                          </div>
                          <FormControl>
                            <Slider
                              value={[field.value || 0]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              max={120}
                              step={1}
                              className="w-full"
                            />
                          </FormControl>
                          <FormDescription>Recomendamos 5 minutos ou menos</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor da fila</FormLabel>
                          <FormControl>
                            <div className="flex flex-wrap gap-3">
                              {APPOINTMENT_COLORS.map((color) => (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() => field.onChange(color.value)}
                                  className="group relative"
                                >
                                  <div
                                    className="h-10 w-10 rounded-lg border-2 transition-all"
                                    style={{
                                      backgroundColor: color.value,
                                      borderColor: field.value === color.value ? color.value : 'transparent',
                                      transform: field.value === color.value ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                  />
                                  <span className="sr-only">{color.label}</span>
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row justify-end">
              {!isNewQueue && (
                <Button type="button" onClick={handleDelete} variant="destructive" className="flex-1 sm:flex-initial">
                  Remover fila
                </Button>
              )}

              <Button type="submit" className="flex-1 sm:flex-initial" isLoading={isSaving}>
                <Save className="h-4 w-4" />
                Salvar fila
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

export default withPermission(Page, ['1601']);
