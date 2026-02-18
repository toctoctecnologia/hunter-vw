import { Clock, Timer } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import type { ConfigAvancadas } from '@/types/filas';

const FILA_COLORS = [
  { value: 'hsl(var(--accentSoft))', label: 'Laranja' },
  { value: '#EF4444', label: 'Vermelho' },
  { value: '#22C55E', label: 'Verde' },
  { value: '#3B82F6', label: 'Azul' },
  { value: '#8B5CF6', label: 'Roxo' },
  { value: '#EC4899', label: 'Rosa' },
  { value: '#14B8A6', label: 'Teal' },
  { value: '#F59E0B', label: 'Âmbar' },
  { value: '#6366F1', label: 'Índigo' },
  { value: '#64748B', label: 'Cinza' },
];

interface ConfigAvancadasPanelProps {
  config: ConfigAvancadas;
  onChange: (config: ConfigAvancadas) => void;
}

export default function ConfigAvancadasPanel({ config, onChange }: ConfigAvancadasPanelProps) {
  const showTimeSettings = config.destinoDistribuicao === 'roletao' || config.destinoDistribuicao === 'proximo_fila';
  const showPausaCorretores = config.destinoDistribuicao === 'proximo_fila';

  return (
    <div className="space-y-6">
      {/* Destino da Fila */}
      <div className="space-y-3 rounded-2xl border border-border bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-foreground">Destino da fila</Label>
            <p className="text-xs text-muted-foreground">
              Escolha se os leads desta fila devem entrar no roletão ou seguir para o próximo da fila.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onChange({ ...config, destinoDistribuicao: 'roletao' })}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${
              config.destinoDistribuicao === 'roletao'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-foreground/40'
            }`}
          >
            <p className="text-sm font-semibold text-foreground">Roletão</p>
            <p className="text-xs text-muted-foreground">Coloca o lead no roletão quando disponível.</p>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...config, destinoDistribuicao: 'proximo_fila' })}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${
              config.destinoDistribuicao === 'proximo_fila'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-foreground/40'
            }`}
          >
            <p className="text-sm font-semibold text-foreground">Próximo da fila</p>
            <p className="text-xs text-muted-foreground">Envia direto para o próximo corretor da fila.</p>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...config, destinoDistribuicao: 'nao_redistribui' })}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${
              config.destinoDistribuicao === 'nao_redistribui'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-foreground/40'
            }`}
          >
            <p className="text-sm font-semibold text-foreground">Lead não redistribui</p>
            <p className="text-xs text-muted-foreground">O lead fica com o usuário mesmo que ele não atenda no tempo.</p>
          </button>
        </div>
      </div>

      {/* Configurações de Tempo (só aparece para roletao ou proximo_fila) */}
      {showTimeSettings && (
        <div className="space-y-5 rounded-2xl border border-border bg-white p-5">
          {/* Janela de Atendimento */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Timer className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Janela de atendimento</p>
                <p className="text-xs text-muted-foreground">
                  Defina o tempo antes de liberar o lead para o {config.destinoDistribuicao === 'roletao' ? 'roletão' : 'próximo da fila'}.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Recomendação</p>
                  <p className="text-xs text-muted-foreground">5 minutos ou menos para maximizar conversão.</p>
                </div>
                <span className="rounded-lg border border-primary/30 bg-white px-3 py-1 text-sm font-semibold text-primary">
                  5 min
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-foreground">Tempo limite</Label>
                <span className="text-sm font-semibold text-primary">
                  {config.tempoLimiteAtendimento || 5} min
                </span>
              </div>
              <Slider
                value={[config.tempoLimiteAtendimento || 5]}
                onValueChange={([value]) => onChange({ ...config, tempoLimiteAtendimento: value })}
                min={1}
                max={120}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 min</span>
                <span>30 min</span>
                <span>60 min</span>
                <span>120 min</span>
              </div>
            </div>
          </div>

          {/* Pausa entre corretores (só para próximo da fila) */}
          {showPausaCorretores && (
            <div className="space-y-4 border-t border-border pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Tempo para ir para o próximo</p>
                  <p className="text-xs text-muted-foreground">
                    Intervalo usado entre cada passagem de lead para o próximo corretor na fila.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-foreground">Pausa entre corretores</Label>
                  <span className="text-sm font-semibold text-primary">
                    {config.pausaEntreCorretores || 2} min
                  </span>
                </div>
                <Slider
                  value={[config.pausaEntreCorretores || 2]}
                  onValueChange={([value]) => onChange({ ...config, pausaEntreCorretores: value })}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Horário de Funcionamento */}
          <div className="space-y-4 border-t border-border pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Horário de funcionamento</p>
                <p className="text-xs text-muted-foreground">
                  Defina quando o {config.destinoDistribuicao === 'roletao' ? 'roletão' : 'próximo da fila'} ficará ativo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Início</Label>
                <Input
                  type="time"
                  value={config.horarioFuncionamentoInicio || '09:00'}
                  onChange={(e) => onChange({ ...config, horarioFuncionamentoInicio: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Término</Label>
                <Input
                  type="time"
                  value={config.horarioFuncionamentoFim || '18:00'}
                  onChange={(e) => onChange({ ...config, horarioFuncionamentoFim: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cor da Fila */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Cor da fila</Label>
        <p className="text-xs text-muted-foreground mb-3">
          Escolha uma cor para identificar visualmente esta fila
        </p>
        <div className="flex flex-wrap gap-3">
          {FILA_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => onChange({ ...config, corFila: color.value })}
              className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                config.corFila === color.value
                  ? 'border-foreground ring-2 ring-offset-2 ring-primary scale-110'
                  : 'border-border hover:border-muted-foreground'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
