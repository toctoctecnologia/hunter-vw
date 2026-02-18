import { useEffect, useMemo } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ConfigHorarioCheckin } from '@/types/filas';
import { DIAS_SEMANA } from '@/types/filas';

interface HorarioCheckinConfigProps {
  config: ConfigHorarioCheckin;
  onChange: (config: ConfigHorarioCheckin) => void;
  filaId?: string;
}

export default function HorarioCheckinConfig({ config, onChange, filaId }: HorarioCheckinConfigProps) {
  const checkinLink = useMemo(() => {
    if (filaId) {
      return `https://app.hunter.com/checkin?fila=${filaId}`;
    }
    return 'https://app.hunter.com/checkin';
  }, [filaId]);

  const handleDiaToggle = (dias: string[]) => {
    onChange({
      ...config,
      diasSemana: dias as ConfigHorarioCheckin['diasSemana']
    });
  };

  const gerarQrCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(checkinLink)}&size=240x240&margin=10`;
    onChange({
      ...config,
      habilitarQrCode: true,
      qrCodeUrl: qrUrl
    });
  };

  useEffect(() => {
    if (config.habilitarQrCode && !config.qrCodeUrl) {
      void gerarQrCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.habilitarQrCode, config.qrCodeUrl, checkinLink]);

  return (
    <div className="space-y-6">
      {/* Habilitar Janela de Horário */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium text-foreground">Habilitar janela de horário</Label>
          <p className="text-xs text-muted-foreground">
            Define um intervalo de horário para recebimento de leads
          </p>
        </div>
        <Switch
          checked={config.habilitarJanela}
          onCheckedChange={(checked) => onChange({ ...config, habilitarJanela: checked })}
        />
      </div>

      {config.habilitarJanela && (
        <>
          {/* Dias da Semana */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Dias da semana</Label>
            <ToggleGroup 
              type="multiple" 
              value={config.diasSemana}
              onValueChange={handleDiaToggle}
              className="flex flex-wrap gap-2"
            >
              {DIAS_SEMANA.map((dia) => (
                <ToggleGroupItem
                  key={dia.value}
                  value={dia.value}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary hover:bg-muted transition-colors"
                >
                  {dia.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Horários */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horaInicio" className="text-sm font-medium text-foreground">
                Horário de início
              </Label>
              <Input
                id="horaInicio"
                type="time"
                value={config.horaInicio}
                onChange={(e) => onChange({ ...config, horaInicio: e.target.value })}
                className="rounded-xl border-border h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaFim" className="text-sm font-medium text-foreground">
                Horário de fim
              </Label>
              <Input
                id="horaFim"
                type="time"
                value={config.horaFim}
                onChange={(e) => onChange({ ...config, horaFim: e.target.value })}
                className="rounded-xl border-border h-12"
              />
            </div>
          </div>
        </>
      )}

      {/* Exigir Check-in */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium text-foreground">Usuários selecionados precisam fazer check-in</Label>
          <p className="text-xs text-muted-foreground">Usuários selecionados nesta fila precisam fazer o check-in.</p>
        </div>
        <Switch
          checked={config.exigeCheckin}
          onCheckedChange={(checked) => onChange({ ...config, exigeCheckin: checked })}
        />
      </div>

      {config.exigeCheckin && (
        <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-foreground">Gerar QR Code para check-in</Label>
              <p className="text-xs text-muted-foreground">
                Gere um QR Code específico desta fila para facilitar o check-in dos usuários selecionados.
              </p>
            </div>
            <Switch
              checked={config.habilitarQrCode}
              onCheckedChange={(checked) => {
                if (!checked) {
                  onChange({ ...config, habilitarQrCode: false });
                  return;
                }
                if (config.qrCodeUrl) {
                  onChange({ ...config, habilitarQrCode: true });
                  return;
                }
                gerarQrCode();
              }}
            />
          </div>

          {config.habilitarQrCode && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-background p-4">
              {config.qrCodeUrl ? (
                <img
                  src={config.qrCodeUrl}
                  alt="QR Code de check-in da fila"
                  className="h-40 w-40 rounded-md border border-border bg-white"
                />
              ) : (
                <div className="text-xs text-muted-foreground">Gerando QR Code...</div>
              )}
              <p className="text-xs text-muted-foreground text-center">
                Escaneie o QR Code para realizar o check-in direto nesta fila.
              </p>
              <p className="text-[11px] text-muted-foreground text-center break-all">
                Link do check-in: {checkinLink}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
