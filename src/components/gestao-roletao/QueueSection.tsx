import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Clock, Settings, Timer, Users } from 'lucide-react';

interface QueueItem {
  id: number;
  nome: string;
  equipe: string;
  tempoEspera: string;
}

const fila: QueueItem[] = [
  { id: 1, nome: 'Marcos Silva', equipe: 'Equipe Leste', tempoEspera: '02:15' },
  { id: 2, nome: 'Helena Costa', equipe: 'Equipe Norte', tempoEspera: '05:43' },
  { id: 3, nome: 'Rodrigo Prado', equipe: 'Equipe Sul', tempoEspera: '08:10' },
];

export const QueueSection = () => {
  const [proximoFilaAtivo, setProximoFilaAtivo] = useState(true);
  const [tempoAtendimento, setTempoAtendimento] = useState<number[]>([10]);
  const [tempoTrocaCorretor, setTempoTrocaCorretor] = useState<number[]>([2]);
  const [horarioInicio, setHorarioInicio] = useState('09:00');
  const [horarioFim, setHorarioFim] = useState('18:00');

  const formatMinutes = (value: number) => {
    if (value < 60) return `${value} min`;
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return minutes > 0 ? `${hours}h${minutes.toString().padStart(2, '0')}min` : `${hours}h`;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Próximo da fila</h1>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          <Users className="mr-1 h-4 w-4" />
          {fila.length} usuários na fila
        </Badge>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-base text-gray-800">Configuração do próximo da fila</CardTitle>
              <p className="text-sm text-gray-500">
                Controle o tempo de atendimento antes de passar o lead para o próximo corretor.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              {proximoFilaAtivo ? 'Ativado' : 'Desativado'}
            </span>
            <Switch
              checked={proximoFilaAtivo}
              onCheckedChange={setProximoFilaAtivo}
              className="data-[state=checked]:bg-orange-600"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Timer className="h-4 w-4 text-orange-600" />
              <span>Tempo para atendimento</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Janela máxima de atendimento antes de enviar o lead ao próximo corretor da fila.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <Label className="font-medium">Tempo de atendimento</Label>
                <span className="font-semibold text-orange-600">{formatMinutes(tempoAtendimento[0])}</span>
              </div>
              <Slider
                value={tempoAtendimento}
                onValueChange={setTempoAtendimento}
                min={5}
                max={60}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>Horário de funcionamento</span>
              </div>
              <p className="text-xs text-gray-500">Defina quando o próximo da fila ficará ativo.</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-gray-700">Início</Label>
                  <Input
                    type="time"
                    value={horarioInicio}
                    onChange={(event) => setHorarioInicio(event.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-700">Término</Label>
                  <Input
                    type="time"
                    value={horarioFim}
                    onChange={(event) => setHorarioFim(event.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>Tempo para ir para o próximo</span>
              </div>
              <p className="text-xs text-gray-500">
                Intervalo usado entre cada passagem de lead para o próximo corretor na fila.
              </p>

              <div className="flex items-center justify-between text-sm text-gray-700">
                <Label className="font-medium">Pausa entre corretores</Label>
                <span className="font-semibold text-orange-600">{formatMinutes(tempoTrocaCorretor[0])}</span>
              </div>
              <Slider
                value={tempoTrocaCorretor}
                onValueChange={setTempoTrocaCorretor}
                min={1}
                max={30}
                step={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-gray-800">Quem será o próximo a receber um lead</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fila.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-orange-600 text-white">
                    {item.nome
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.nome}</p>
                  <p className="text-xs text-gray-500">{item.equipe}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span>Espera: {item.tempoEspera}</span>
                </div>
                <Button variant="outline" size="sm" className="border-orange-200 text-orange-700">
                  Priorizar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
