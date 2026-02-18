'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, UserCircle2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuth } from '@/shared/hooks/use-auth';

import { getRoulleteLastOffers, getRoulleteSettings, updateRoulleteSettings } from '@/features/dashboard/sales/api/roullete';

import { RoulleteSettings, WeekDays } from '@/shared/types';

import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Switch } from '@/shared/components/ui/switch';
import { Slider } from '@/shared/components/ui/slider';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { hasFeature } from '@/shared/lib/permissions';

export function RotaryLeadsSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: lastOffers, isLoading: isLoadingLastOffers } = useQuery({
    queryKey: ['roullete-last-offers'],
    queryFn: getRoulleteLastOffers,
  });

  const { data: settings, isLoading } = useQuery<RoulleteSettings>({
    queryKey: ['roullete-settings'],
    queryFn: getRoulleteSettings,
  });

  const [leadAvailability, setLeadAvailability] = useState<'ALL_COMPANY' | 'SAME_TEAM'>('ALL_COMPANY');
  const [selectedDays, setSelectedDays] = useState<WeekDays[]>([]);
  const [startTime, setStartTime] = useState('09:00:00');
  const [leadsActive, setLeadsActive] = useState(false);
  const [limiteTempo, setLimiteTempo] = useState([30]);
  const [endTime, setEndTime] = useState('18:00:00');

  useEffect(() => {
    if (settings) {
      setLeadsActive(settings.isActive);
      setLimiteTempo([settings.timeLimitMinutes]);
      setStartTime(settings.startTime);
      setEndTime(settings.endTime);
      setSelectedDays(settings.availableDays);
      setLeadAvailability(settings.onlyQueueUsersDistribution ? 'SAME_TEAM' : 'ALL_COMPANY');
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: updateRoulleteSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roullete-settings'] });
      toast.success('Configurações atualizadas com sucesso!');
    },
  });

  const toggleDay = (day: WeekDays) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleSubmit = () => {
    const formData: RoulleteSettings = {
      isActive: leadsActive,
      timeLimitMinutes: limiteTempo[0],
      startTime,
      endTime,
      availableDays: selectedDays,
      onlyQueueUsersDistribution: leadAvailability === 'SAME_TEAM',
    };

    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <Loading />;
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
              <Users className="size-4 text-primary" />
            </div>

            <div>
              <p className="text-lg font-medium">Ativar o roletão de leads?</p>
              <TypographyMuted>Habilita a distribuição automática de leads</TypographyMuted>
            </div>
          </div>

          <Switch checked={leadsActive} onCheckedChange={(value) => setLeadsActive(value)} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
              <Clock className="size-4 text-primary" />
            </div>

            <div>
              <p className="text-lg font-medium">* Limite de tempo para atendimento</p>
              <TypographyMuted>
                Esse é o tempo máximo que um usuário tem para interagir com o lead antes de ser disponibilizado no bolão.
              </TypographyMuted>
            </div>
          </div>

          <div className="mt-6">
            <TypographyMuted className="mb-2">
              Recomendamos o prazo de 30 minutos ou menos para maximizar sua taxa de conversão!
            </TypographyMuted>

            <div className="flex items-center gap-4">
              <Slider value={limiteTempo} onValueChange={setLimiteTempo} min={1} max={30} step={1} />

              <div className="min-w-[70px] text-right">
                <span className="text-sm font-medium text-primary">{formatTime(limiteTempo[0])}</span>
              </div>
            </div>

            <div className="w-[calc(100%-70px-16px)] mt-2 flex justify-between text-xs text-gray-400">
              <span>1 min</span>
              <span>10 min</span>
              <span>20 min</span>
              <span>30 min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
              <Calendar className="size-4 text-primary" />
            </div>

            <p className="text-lg font-medium">* Horário de funcionamento</p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-3">
              <Label htmlFor="start-time" className="px-1">
                Início
              </Label>
              <Input
                type="time"
                id="start-time"
                step="1"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <Label htmlFor="end-time" className="px-1">
                Término
              </Label>
              <Input
                type="time"
                id="end-time"
                step="1"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>

          <TypographyMuted>Dias disponíveis</TypographyMuted>

          <div className="grid grid-cols-2 s sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="mon">Segunda</Label>
              <Checkbox id="mon" checked={selectedDays.includes(WeekDays.MON)} onCheckedChange={() => toggleDay(WeekDays.MON)} />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="tue">Terça</Label>
              <Checkbox id="tue" checked={selectedDays.includes(WeekDays.TUE)} onCheckedChange={() => toggleDay(WeekDays.TUE)} />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="wed">Quarta</Label>
              <Checkbox id="wed" checked={selectedDays.includes(WeekDays.WED)} onCheckedChange={() => toggleDay(WeekDays.WED)} />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="thu">Quinta</Label>
              <Checkbox id="thu" checked={selectedDays.includes(WeekDays.THU)} onCheckedChange={() => toggleDay(WeekDays.THU)} />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="fri">Sexta</Label>
              <Checkbox id="fri" checked={selectedDays.includes(WeekDays.FRI)} onCheckedChange={() => toggleDay(WeekDays.FRI)} />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="sat">Sábado</Label>
              <Checkbox id="sat" checked={selectedDays.includes(WeekDays.SAT)} onCheckedChange={() => toggleDay(WeekDays.SAT)} />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="sun">Domingo</Label>
              <Checkbox id="sun" checked={selectedDays.includes(WeekDays.SUN)} onCheckedChange={() => toggleDay(WeekDays.SUN)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
              <UserCircle2 className="size-4 text-primary" />
            </div>

            <div>
              <p className="text-lg font-medium">* Disponibilidade do lead</p>
              <TypographyMuted>Escolha quem poderá receber o lead quando for liberado.</TypographyMuted>
            </div>
          </div>

          <RadioGroup
            value={leadAvailability}
            onValueChange={(value) => setLeadAvailability(value as 'ALL_COMPANY' | 'SAME_TEAM')}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="ALL_COMPANY" id="all-company" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="all-company" className="font-medium cursor-pointer">
                    Qualquer usuário de qualquer equipe da empresa
                  </Label>
                  <TypographyMuted className="mt-1">
                    Expande a disputa para toda a empresa quando o lead for liberado.
                  </TypographyMuted>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="SAME_TEAM" id="same-team" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="same-team" className="font-medium cursor-pointer">
                    Apenas usuários da equipe que recebeu o lead
                  </Label>
                  <TypographyMuted className="mt-1">Mantém o lead restrito à equipe original até ser assumido.</TypographyMuted>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
              <Users className="size-4 text-primary" />
            </div>

            <div>
              <p className="text-lg font-medium">Últimos leads distribuídos no roletão</p>
              <TypographyMuted>Acompanhe rapidamente quem recebeu cada lead liberado.</TypographyMuted>
            </div>
          </div>

          <div className="space-y-3">
            {isLoadingLastOffers ? (
              <div className="flex items-center justify-center p-8">
                <Loading />
              </div>
            ) : (
              <>
                {!lastOffers || lastOffers.content.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <TypographyMuted>Nenhum lead distribuído recentemente</TypographyMuted>
                  </div>
                ) : (
                  <>
                    {lastOffers.content.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{lead.leadName}</p>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>{lead.leadPhone}</span>
                            <span>•</span>
                            <span>{lead.leadOrigin}</span>
                            <span>•</span>
                            <span>
                              {new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={lead.status === 'ASSUMED' ? 'default' : 'secondary'} className="whitespace-nowrap">
                            {lead.status === 'ASSUMED' ? (
                              <>
                                <CheckCircle2 className="size-3 mr-1" />
                                Assumido no roletão
                              </>
                            ) : (
                              <>
                                <ArrowRight className="size-3 mr-1" />
                                Passou para próximo da fila
                              </>
                            )}
                          </Badge>
                          <TypographyMuted className="text-xs whitespace-nowrap">{lead.catcherName}</TypographyMuted>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {hasFeature(user?.userInfo.profile.permissions, '1804') && (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} isLoading={updateMutation.isPending}>
            Atualizar
          </Button>
        </div>
      )}
    </div>
  );
}
