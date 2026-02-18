'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/shims/next-navigation';
import { Clock, Calendar, House, Eye, Settings } from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { hasFeature } from '@/shared/lib/permissions';

import { useAuth } from '@/shared/hooks/use-auth';

import { getProperties } from '@/features/dashboard/properties/api/properties';
import {
  getQualificationTimes,
  updateQualificationTimes,
} from '@/features/dashboard/properties/api/property-qualification-times';
import {
  propertyQualificationTimesFormSchema,
  PropertyQualificationTimesFormData,
} from '@/features/dashboard/properties/components/form/property-qualification-times-form';

import { PropertyQualificationUpdateMetrics } from '@/shared/types';
import { qualificationConfig } from '@/shared/lib/utils';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Input } from '@/shared/components/ui/input';
import { removeNonNumeric } from '@/shared/lib/masks';

interface UpdateTimeQualificationProps {
  qualifications: PropertyQualificationUpdateMetrics[];
}

export function UpdateTimeQualification({ qualifications }: UpdateTimeQualificationProps) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const totalProperties = qualifications.reduce((sum, qual) => sum + qual.totalProperties, 0);
  const selected = qualifications[selectedIndex];

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', 'qualification', selected?.propertyQualification],
    queryFn: () =>
      getProperties({
        pagination: { pageIndex: 0, pageSize: 100 },
        filters: { qualificationType: selected?.propertyQualification },
      }),
    enabled: !!selected?.propertyQualification && isModalOpen,
  });

  const { data: qualificationTimes, isLoading: isLoadingTimes } = useQuery({
    queryKey: ['property-qualification-times'],
    queryFn: getQualificationTimes,
    enabled: isSettingsModalOpen,
  });

  const form = useForm<PropertyQualificationTimesFormData>({
    resolver: zodResolver(propertyQualificationTimesFormSchema),
    defaultValues: {
      recentMaxDays: '',
      attentionMinDays: '',
      attentionMaxDays: '',
      urgentMinDays: '',
    },
  });

  useEffect(() => {
    if (qualificationTimes) {
      form.reset({
        recentMaxDays: String(qualificationTimes.recentMaxDays),
        attentionMinDays: String(qualificationTimes.attentionMinDays),
        attentionMaxDays: String(qualificationTimes.attentionMaxDays),
        urgentMinDays: String(qualificationTimes.urgentMinDays),
      });
    }
  }, [qualificationTimes, form]);

  const { mutate: updateTimes, isPending: isUpdating } = useMutation({
    mutationFn: updateQualificationTimes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-qualification-times'] });
      queryClient.invalidateQueries({ queryKey: ['property-qualification-update-metrics'] });
      toast.success('Tempos de qualificação atualizados com sucesso!');
      setIsSettingsModalOpen(false);
    },
  });

  function onSubmit(data: PropertyQualificationTimesFormData) {
    if (data.attentionMinDays <= data.recentMaxDays) {
      form.setError('attentionMinDays', { message: 'Deve ser maior que o máximo de dias recentes' });
      return;
    }
    if (data.attentionMaxDays < data.attentionMinDays) {
      form.setError('attentionMaxDays', { message: 'Deve ser maior ou igual ao mínimo de dias de atenção' });
      return;
    }
    if (data.urgentMinDays <= data.attentionMaxDays) {
      form.setError('urgentMinDays', { message: 'Deve ser maior que o máximo de dias de atenção' });
      return;
    }
    updateTimes(data);
  }

  const chartConfig: ChartConfig = qualifications.reduce(
    (acc, qual, index) => ({
      ...acc,
      [index]: { label: qualificationConfig[qual.propertyQualification]?.label || qual.propertyQualification },
    }),
    {} as ChartConfig,
  );

  const chartData = qualifications.map((qual, index) => ({
    type: index.toString(),
    value: qual.totalProperties,
    color: qualificationConfig[qual.propertyQualification]?.color || '#888888',
  }));

  const calculateDaysWithoutUpdate = (lastUpdatedAt: string) => {
    const lastUpdate = new Date(lastUpdatedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const selectedConfig = qualificationConfig[selected?.propertyQualification];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Gestão de Imóveis
          </CardTitle>
          {hasFeature(user?.userInfo.profile.permissions, '1002') && (
            <Button variant="outline" size="icon" onClick={() => setIsSettingsModalOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0 relative">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const qual = qualifications[Number(name)];
                    const config = qualificationConfig[qual.propertyQualification];
                    return (
                      <div>
                        <span className="block">{config?.label || qual.propertyQualification}</span>
                        <small>
                          {value} {(value as number) > 1 ? 'imóveis' : 'imóvel'}
                        </small>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="type"
              innerRadius={60}
              paddingAngle={4}
              onClick={(_, index) => setSelectedIndex(index)}
            >
              {chartData.map(({ color }, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-4xl font-bold" style={{ color: selectedConfig?.color }}>
              {selected?.totalProperties || 0}
            </p>
            <p className="text-xs text-muted-foreground">imóveis</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-6">
        {qualifications.map((qual, index) => {
          const isSelected = selectedIndex === index;
          const percentage = totalProperties > 0 ? ((qual.totalProperties / totalProperties) * 100).toFixed(1) : '0.0';
          const config = qualificationConfig[qual.propertyQualification];

          return (
            <button
              key={qual.propertyQualification}
              className="w-full rounded-xl border p-3 transition-all hover:bg-muted/50"
              style={{
                borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
              }}
              onClick={() => {
                setSelectedIndex(index);
                setIsModalOpen(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: config?.color }} />

                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">{config?.label || qual.propertyQualification}</p>
                    <p className="text-xs text-muted-foreground">{config?.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">{qual.totalProperties}</p>
                  <p className="text-xs text-muted-foreground">{percentage}%</p>
                </div>
              </div>
            </button>
          );
        })}

        <Button onClick={() => router.push('dashboard/properties?currentTab=properties')} className="w-full">
          Ver Imóveis
        </Button>
      </CardFooter>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] w-full sm:max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Imóveis - {selectedConfig?.label || selected?.propertyQualification}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Carregando imóveis...</div>
            ) : properties?.content && properties.content.length > 0 ? (
              <div className="overflow-auto h-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="text-right">Dias sem Atualização</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.content.map((property) => {
                      const daysWithoutUpdate = calculateDaysWithoutUpdate(property.updatedAt);
                      const formattedDate = format(new Date(property.updatedAt), 'dd/MM/yyyy');

                      return (
                        <TableRow
                          key={property.uuid}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/dashboard/properties/${property.uuid}/detail`)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <House className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{property.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formattedDate}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-lg font-bold" style={{ color: selectedConfig?.color }}>
                              {daysWithoutUpdate}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">dias</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/properties/${property.uuid}/detail`);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Nenhum imóvel encontrado para esta categoria.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurar Tempos de Qualificação
            </DialogTitle>
            <DialogDescription>
              Configure os intervalos de dias para classificar os imóveis como Recente, Atenção ou Urgente.
            </DialogDescription>
          </DialogHeader>

          {isLoadingTimes ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                    <span className="font-medium text-sm">Recente</span>
                  </div>
                  <FormField
                    control={form.control}
                    name="recentMaxDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Até quantos dias?</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 7"
                            {...field}
                            onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#eab308' }} />
                    <span className="font-medium text-sm">Atenção</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="attentionMinDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>De (dias)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 8"
                              {...field}
                              onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="attentionMaxDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Até (dias)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 14"
                              {...field}
                              onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                    <span className="font-medium text-sm">Urgente</span>
                  </div>
                  <FormField
                    control={form.control}
                    name="urgentMinDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A partir de quantos dias?</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 15"
                            {...field}
                            onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsSettingsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={isUpdating}>
                    Salvar
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
