'use client';

import { Clock, Cog, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { RoulleteNextQueueSettings } from '@/shared/types';
import { getUserNameInitials } from '@/shared/lib/utils';

import {
  getNextQueueSettings,
  getNextQueueUsers,
  updateNextQueueSettings,
} from '@/features/dashboard/sales/api/next-queue';

import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Switch } from '@/shared/components/ui/switch';
import { Slider } from '@/shared/components/ui/slider';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Input } from '@/shared/components/ui/input';

export function RotaryLeadsNextInLine() {
  const queryClient = useQueryClient();

  const [limiteTempo, setLimiteTempo] = useState([30]);
  const [horarioInicio, setHorarioInicio] = useState('09:00');
  const [horarioTermino, setHorarioTermino] = useState('18:00');
  const [nextUserEnabled, setNextUserEnabled] = useState(false);
  const [tempoProximo, setTempoProximo] = useState([30]);

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['next-queue-settings'],
    queryFn: getNextQueueSettings,
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['next-queue-users'],
    queryFn: getNextQueueUsers,
  });

  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: (data: RoulleteNextQueueSettings) => updateNextQueueSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['next-queue-settings'] });
      toast.success('Configurações salvas com sucesso!');
    },
  });

  useEffect(() => {
    if (settings) {
      setLimiteTempo([settings.timeLimitMinutes]);
      setHorarioInicio(settings.startTime);
      setHorarioTermino(settings.endTime);
      setNextUserEnabled(settings.nextUserEnabled);
    }
  }, [settings]);

  const handleSave = () => {
    if (!settings) return;

    updateSettings({
      timeLimitMinutes: limiteTempo[0],
      startTime: horarioInicio,
      endTime: horarioTermino,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
      nextUserEnabled,
    });
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
  };

  const formatWaitTime = (isoDate: string) => {
    if (!isoDate) return '--:--';
    const now = new Date();
    const lastUpdate = new Date(isoDate);
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  if (isLoadingSettings || isLoadingUsers) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
              <Cog className="size-4 text-primary" />
            </div>

            <div>
              <p className="text-lg font-medium">Configuração do próximo da fila</p>
              <TypographyMuted>
                Controle o tempo de atendimento antes de passar o lead para o próximo corretor.
              </TypographyMuted>
            </div>
          </div>

          <Switch checked={nextUserEnabled} onCheckedChange={(value) => setNextUserEnabled(value)} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
              <Clock className="size-4 text-primary" />
            </div>

            <div>
              <p className="text-lg font-medium">* Tempo para atendimento</p>
              <TypographyMuted>
                Janela máxima de atendimento antes de enviar o lead ao próximo corretor da fila.
              </TypographyMuted>
            </div>
          </div>

          <div className="mt-6">
            <TypographyMuted className="mb-2">Tempo de atendimento</TypographyMuted>

            <div className="flex items-center gap-4">
              <Slider value={limiteTempo} onValueChange={setLimiteTempo} min={1} max={60} step={1} />

              <div className="min-w-[70px] text-right">
                <span className="text-sm font-medium text-primary">{formatTime(limiteTempo[0])}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
                <Clock className="size-4 text-primary" />
              </div>

              <div>
                <p className="text-lg font-medium">Horário de funcionamento</p>
                <TypographyMuted>Defina quando o próximo da fila ficará ativo.</TypographyMuted>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <TypographyMuted className="mb-2">Horário de início</TypographyMuted>
                <Input type="time" value={horarioInicio} onChange={(e) => setHorarioInicio(e.target.value)} />
              </div>

              <div>
                <TypographyMuted className="mb-2">Horário de término</TypographyMuted>
                <Input type="time" value={horarioTermino} onChange={(e) => setHorarioTermino(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
                <Timer className="size-4 text-primary" />
              </div>

              <div>
                <p className="text-lg font-medium">Tempo para ir para o próximo</p>
                <TypographyMuted>Defina o tempo antes de passar para o próximo corretor.</TypographyMuted>
              </div>
            </div>

            <div className="mt-6">
              <TypographyMuted className="mb-2">Tempo de espera</TypographyMuted>

              <div className="flex items-center gap-4">
                <Slider value={tempoProximo} onValueChange={setTempoProximo} min={1} max={60} step={1} />

                <div className="min-w-[70px] text-right">
                  <span className="text-sm font-medium text-primary">{formatTime(tempoProximo[0])}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
              <Timer className="size-4 text-primary" />
            </div>

            <div>
              <p className="text-lg font-medium">Quem será o próximo a receber um lead</p>
              <TypographyMuted>
                O sistema irá considerar o tempo de atendimento e a disponibilidade dos corretores para definir quem
                será o próximo.
              </TypographyMuted>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {users.length === 0 ? (
              <div className="text-center py-8">
                <TypographyMuted>Nenhum corretor na fila</TypographyMuted>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.userUuid}
                  className="flex items-center justify-between border bg-secondary/20 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarFallback>{getUserNameInitials(user.userName)}</AvatarFallback>
                    </Avatar>

                    <div>
                      <span className="font-bold">{user.userName}</span>
                      <TypographyMuted>{user.userEmail}</TypographyMuted>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="size-4 text-muted-foreground inline-block mr-1" />
                      <TypographySmall className="text-muted-foreground">
                        Espera: <span className="font-medium">{formatWaitTime(user.lastOfferUpdate)}</span>
                      </TypographySmall>
                    </div>
                    {user.isNextToReceive && (
                      <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded">Próximo</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={isPending}>
          Salvar configurações
        </Button>
      </div>
    </div>
  );
}
