import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Clock, Phone, Timer, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConfigurationSectionProps {
  bolaoAtivo: boolean;
  setBolaoAtivo: (value: boolean) => void;
  limiteTempo: number[];
  setLimiteTempo: (value: number[]) => void;
  distribuicaoTipo: string;
  setDistribuicaoTipo: (value: string) => void;
  horarioInicio: string;
  setHorarioInicio: (value: string) => void;
  horarioFim: string;
  setHorarioFim: (value: string) => void;
  diasAtivos: {
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
    domingo: boolean;
  };
  setDiasAtivos: (dias: {
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
    domingo: boolean;
  }) => void;
}

export const ConfigurationSection = ({
  bolaoAtivo,
  setBolaoAtivo,
  limiteTempo,
  setLimiteTempo,
  distribuicaoTipo,
  setDistribuicaoTipo,
  horarioInicio,
  setHorarioInicio,
  horarioFim,
  setHorarioFim,
  diasAtivos,
  setDiasAtivos,
}: ConfigurationSectionProps) => {
  const ultimosLeads = [
    {
      id: 1,
      nome: 'Ivan José Dagnoni',
      meio: 'WhatsApp',
      telefone: '(11) 98888-1122',
      horario: 'Hoje, 10:12',
      status: 'Assumido no roletão',
      responsavel: 'Equipe Norte'
    },
    {
      id: 2,
      nome: 'João Ernesto Gross Reinke',
      meio: 'Formulário',
      telefone: '(21) 96666-0891',
      horario: 'Hoje, 09:40',
      status: 'Passou para próximo da fila',
      responsavel: 'Equipe Sul'
    },
    {
      id: 3,
      nome: 'Elizabete Machado Estercio',
      meio: 'Ligação',
      telefone: '(11) 97777-3210',
      horario: 'Ontem, 18:05',
      status: 'Reassociado no roletão',
      responsavel: 'Equipe Leste'
    }
  ];

  const dias = [
    { key: 'segunda', label: 'Segunda' },
    { key: 'terca', label: 'Terça' },
    { key: 'quarta', label: 'Quarta' },
    { key: 'quinta', label: 'Quinta' },
    { key: 'sexta', label: 'Sexta' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Configurações do roletão de lead</h1>
        <Badge variant="secondary" className="bg-orange-50 text-orange-700">
          Painel atualizado
        </Badge>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-base text-gray-800">Ativar o roletão de leads</CardTitle>
              <p className="text-sm text-gray-500">Habilite ou pause o roletão sem perder as configurações.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">{bolaoAtivo ? 'SIM' : 'NÃO'}</span>
            <Switch checked={bolaoAtivo} onCheckedChange={setBolaoAtivo} className="data-[state=checked]:bg-orange-600" />
          </div>
        </CardHeader>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Timer className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-base text-gray-800">Janela de atendimento</CardTitle>
              <p className="text-sm text-gray-500">Defina o tempo antes de liberar o lead para o roletão.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-orange-50 p-4 text-sm text-orange-800">
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Recomendação</span>
              <span className="text-xs text-orange-700">5 minutos ou menos para maximizar conversão.</span>
            </div>
            <Badge className="bg-white text-orange-700 shadow-sm">{formatTime(limiteTempo[0])}</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <Label className="font-medium">Tempo limite</Label>
              <span className="font-semibold text-orange-600">{formatTime(limiteTempo[0])}</span>
            </div>
            <Slider value={limiteTempo} onValueChange={setLimiteTempo} min={1} max={120} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1 min</span>
              <span>30 min</span>
              <span>60 min</span>
              <span>120 min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-gray-800">Disponibilidade do lead</CardTitle>
          <p className="text-sm text-gray-500">Escolha quem poderá receber o lead quando for liberado.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup value={distribuicaoTipo} onValueChange={setDistribuicaoTipo}>
            <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <RadioGroupItem value="todos" id="todos" />
              <div>
                <Label htmlFor="todos" className="text-sm font-semibold text-gray-800">
                  Qualquer usuário de qualquer equipe da empresa
                </Label>
                <p className="text-xs text-gray-500">Expande a disputa para toda a empresa quando o lead for liberado.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <RadioGroupItem value="equipe" id="equipe" />
              <div>
                <Label htmlFor="equipe" className="text-sm font-semibold text-gray-800">
                  Apenas usuários da equipe que recebeu o lead
                </Label>
                <p className="text-xs text-gray-500">Mantém o lead restrito à equipe original até ser assumido.</p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-base text-gray-800">Horário de funcionamento</CardTitle>
              <p className="text-sm text-gray-500">Defina quando o roletão pode distribuir leads.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">Início</Label>
              <Input type="time" value={horarioInicio} onChange={(e) => setHorarioInicio(e.target.value)} className="rounded-lg border-gray-300" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">Término</Label>
              <Input type="time" value={horarioFim} onChange={(e) => setHorarioFim(e.target.value)} className="rounded-lg border-gray-300" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {dias.map((dia) => (
              <Button
                key={dia.key}
                type="button"
                variant={diasAtivos[dia.key] ? "default" : "outline"}
                size="sm"
                className={`rounded-full border-gray-200 px-4 ${
                  diasAtivos[dia.key]
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setDiasAtivos({
                  ...diasAtivos,
                  [dia.key]: !diasAtivos[dia.key]
                })}
              >
                {dia.label}: {diasAtivos[dia.key] ? 'Ativo' : 'Inativo'}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-base text-gray-800">Últimos leads distribuídos no roletão</CardTitle>
              <p className="text-sm text-gray-500">Acompanhe rapidamente quem recebeu cada lead liberado.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {ultimosLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">{lead.nome}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.telefone}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-orange-700 shadow-sm">
                    {lead.meio}
                  </span>
                  <span className="text-gray-500">{lead.horario}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <Badge variant="secondary" className="bg-white text-orange-700 shadow-sm">
                  {lead.status}
                </Badge>
                <span className="text-xs text-gray-500">Responsável: {lead.responsavel}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-orange-600 px-8 py-2 hover:bg-orange-700">Atualizar</Button>
      </div>
    </div>
  );
};