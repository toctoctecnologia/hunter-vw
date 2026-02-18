import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Save, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  DEFAULT_PROPERTY_LOGO_OVERLAY_STATE,
  emitPropertyLogoOverlayChange,
  getProperty,
  mergeProperty,
  normalizePropertyLogoOverlayState,
  type PropertyLogoOverlayApplyMode,
  type PropertyLogoOverlayState,
} from '@/features/imoveis/state/imovelLocalStore';
import { getLogoOverlayStyles, shouldRenderLogoOverlay } from '@/features/imoveis/utils/logoOverlay';
import { cn } from '@/lib/utils';

const ACCEPTED_FILE_TYPES = ['image/png', 'image/svg+xml', 'image/jpeg'];

const POSITION_OPTIONS: Array<PropertyLogoOverlayState['position']> = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

const APPLY_MODE_LABEL: Record<PropertyLogoOverlayApplyMode, string> = {
  all: 'Aplicar em todas',
  new: 'Somente novas',
};

async function applyLogoOverlayOnExport(
  propertyId: string,
  overlay: PropertyLogoOverlayState,
): Promise<void> {
  console.info('[LogoOverlayPanel] applyLogoOverlayOnExport (stub)', { propertyId, overlay });
}

const createDefaultState = (): PropertyLogoOverlayState => ({
  ...DEFAULT_PROPERTY_LOGO_OVERLAY_STATE,
});

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Falha ao processar o arquivo selecionado.'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });

export interface LogoOverlayPanelProps {
  propertyId?: string;
  className?: string;
}

export const LogoOverlayPanel: React.FC<LogoOverlayPanelProps> = ({ propertyId, className }) => {
  const [state, setState] = useState<PropertyLogoOverlayState>(() => createDefaultState());
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const persistState = useCallback(
    (next: PropertyLogoOverlayState) => {
      if (!propertyId) {
        return;
      }

      mergeProperty(propertyId, previous => ({
        ...previous,
        logoOverlay: next,
      }));
      emitPropertyLogoOverlayChange(propertyId, next);
    },
    [propertyId],
  );

  const applyState = useCallback(
    (updater: (previous: PropertyLogoOverlayState) => PropertyLogoOverlayState) => {
      setState(previous => {
        const next = updater(previous);
        persistState(next);
        return next;
      });
    },
    [persistState],
  );

  useEffect(() => {
    if (!propertyId) {
      setState(createDefaultState());
      return;
    }

    const stored = getProperty(propertyId)?.logoOverlay;
    if (stored) {
      setState(normalizePropertyLogoOverlayState(stored));
      return;
    }

    setState(createDefaultState());
  }, [propertyId]);

  const disabled = !propertyId;
  const hasLogoAsset = Boolean(state.src);
  const controlsDisabled = disabled || !state.enabled || !hasLogoAsset;
  const previewOverlay = useMemo(() => {
    const hasSrc = Boolean(state.src);

    if (!hasSrc) {
      return undefined;
    }

    if (shouldRenderLogoOverlay(state)) {
      return state;
    }

    return Object.assign({}, state, { enabled: true });
  }, [state]);

  const handleToggleEnabled = (checked: boolean) => {
    applyState(previous => ({ ...previous, enabled: checked }));
  };

  const handleApplyModeChange = (value: string) => {
    if (!value) {
      return;
    }

    applyState(previous => ({
      ...previous,
      applyMode: value as PropertyLogoOverlayApplyMode,
    }));
  };

  const handlePositionChange = (position: PropertyLogoOverlayState['position']) => {
    applyState(previous => ({ ...previous, position }));
  };

  const handleOverlayIdChange = (value: string) => {
    applyState(previous => ({ ...previous, overlayId: value }));
  };

  const handleSliderChange = (key: 'sizePct' | 'opacity' | 'margin') => (values: number[]) => {
    if (!values.length) {
      return;
    }

    const [value] = values;
    applyState(previous => ({ ...previous, [key]: value } as PropertyLogoOverlayState));
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      console.warn('[LogoOverlayPanel] Tipo de arquivo não suportado:', file.type);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      applyState(previous => ({
        ...previous,
        src: dataUrl,
        enabled: true,
        overlayId: previous.overlayId || file.name.replace(/\.[^.]+$/, ''),
      }));
    } catch (error) {
      console.error('[LogoOverlayPanel] Falha ao carregar arquivo de logo', error);
    }
  };

  const handleRemoveLogo = () => {
    applyState(previous => ({
      ...previous,
      enabled: false,
      src: undefined,
    }));
  };

  const handleSave = async () => {
    if (!propertyId) {
      return;
    }

    setIsSaving(true);
    try {
      await applyLogoOverlayOnExport(propertyId, state);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sobreposição de logo</CardTitle>
        <CardDescription>
          Defina um logo e como ele será inserido nas imagens exportadas do imóvel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="space-y-1">
            <Label htmlFor="logo-overlay-enabled" className="text-base font-medium">
              Ativar sobreposição
            </Label>
            <p className="text-sm text-muted-foreground">
              Quando ativo, o logo será renderizado automaticamente nas exportações.
            </p>
          </div>
          <Switch
            id="logo-overlay-enabled"
            checked={state.enabled && hasLogoAsset}
            onCheckedChange={handleToggleEnabled}
            disabled={disabled || !hasLogoAsset}
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium">Modo de aplicação</Label>
          <ToggleGroup
            type="single"
            value={state.applyMode}
            onValueChange={handleApplyModeChange}
            disabled={disabled}
            className="grid grid-cols-2 gap-2"
          >
            {Object.entries(APPLY_MODE_LABEL).map(([value, label]) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className="h-9 rounded-lg text-sm"
                aria-label={label}
              >
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="text-xs text-muted-foreground">
            Escolha se o logo será aplicado em toda a biblioteca ou apenas em novas exportações.
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Arquivo do logo</Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleFileButtonClick}
              disabled={disabled}
              className="h-10 w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              {hasLogoAsset ? 'Atualizar logo' : 'Enviar logo'}
            </Button>
            <Input
              value={state.overlayId ?? ''}
              onChange={event => handleOverlayIdChange(event.target.value)}
              onBlur={event => handleOverlayIdChange(event.target.value.trim())}
              placeholder="Identificador opcional"
              disabled={disabled}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Aceita arquivos PNG, SVG ou JPG. A identificação ajuda a rastrear o logo aplicado.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES.join(',')}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tamanho</Label>
            <Slider
              value={[state.sizePct]}
              min={8}
              max={45}
              step={1}
              onValueChange={handleSliderChange('sizePct')}
              disabled={controlsDisabled}
            />
            <p className="text-xs text-muted-foreground">{state.sizePct}% da largura da imagem.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Opacidade</Label>
            <Slider
              value={[state.opacity]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleSliderChange('opacity')}
              disabled={controlsDisabled}
            />
            <p className="text-xs text-muted-foreground">{state.opacity}% de opacidade.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Margem</Label>
            <Slider
              value={[state.margin]}
              min={0}
              max={10}
              step={0.5}
              onValueChange={handleSliderChange('margin')}
              disabled={controlsDisabled}
            />
            <p className="text-xs text-muted-foreground">{state.margin}% de distância das bordas.</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Posição do logo</Label>
          <div className="grid grid-cols-2 gap-2">
            {POSITION_OPTIONS.map(position => {
              const isActive = state.position === position;

              return (
                <button
                  key={position}
                  type="button"
                  disabled={controlsDisabled}
                  onClick={() => handlePositionChange(position)}
                  className={cn(
                    'relative flex h-16 items-center justify-center rounded-lg border text-sm transition-colors',
                    isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-muted/50 text-muted-foreground hover:bg-muted',
                    controlsDisabled && 'opacity-60 hover:bg-muted/50',
                  )}
                >
                  {position === 'top-left' && 'Superior esquerda'}
                  {position === 'top-right' && 'Superior direita'}
                  {position === 'bottom-left' && 'Inferior esquerda'}
                  {position === 'bottom-right' && 'Inferior direita'}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Pré-visualização</Label>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted/40">
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" aria-hidden="true" />
            <div className="relative flex h-full w-full items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">Imagem de exemplo</span>
            </div>
            {previewOverlay && (
              <img
                src={previewOverlay.src}
                alt="Prévia do logo"
                style={getLogoOverlayStyles(previewOverlay)}
                className="pointer-events-none select-none"
                draggable={false}
              />
            )}
          </div>
          {!hasLogoAsset && (
            <p className="text-xs text-muted-foreground">
              Faça upload de um logo para visualizar como ele será aplicado.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleRemoveLogo}
            disabled={!hasLogoAsset || disabled}
            className="justify-start text-red-500 hover:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remover logo
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={disabled || !hasLogoAsset || !state.enabled}
            className="sm:ml-auto"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
