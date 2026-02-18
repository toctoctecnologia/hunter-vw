import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, AlertCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusModal } from '@/features/imoveis/components/StatusModal';
import {
  PROPERTY_STATUS_REGISTRY_EVENT,
  getAll as getStatuses,
  hasAdmin as canManageStatusRegistry,
  type PropertyStatusRegistryEventDetail,
} from '@/features/imoveis/state/statusRegistry';
import {
  getProperty,
  mergeProperty,
  type PropertyLocalState,
} from '@/features/imoveis/state/imovelLocalStore';
import { PropertyStatus } from '@/types/imovel';
import { cn } from '@/lib/utils';

interface StatusSituacaoSectionProps {
  form: UseFormReturn<any>;
  imovelId: string;
}

export function StatusSituacaoSection({ form, imovelId }: StatusSituacaoSectionProps) {
  const [statuses, setStatuses] = useState<PropertyStatus[]>(() => getStatuses());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canManageStatuses, setCanManageStatuses] = useState(false);

  const appliedLocalStatusRef = useRef(false);
  const lastPersistedStatusRef = useRef<string | undefined>();

  const watchedStatusValue = form.watch('status') as string | undefined;

  const sortedStatuses = useMemo(
    () =>
      [...statuses].sort((a, b) => {
        if (a.order === b.order) {
          return a.label.localeCompare(b.label);
        }
        return a.order - b.order;
      }),
    [statuses],
  );

  const resolvedStatusId = useMemo(
    () => resolveStatusId(watchedStatusValue, sortedStatuses),
    [watchedStatusValue, sortedStatuses],
  );

  const currentStatus = useMemo(
    () =>
      resolvedStatusId
        ? sortedStatuses.find(status => status.id === resolvedStatusId)
        : undefined,
    [resolvedStatusId, sortedStatuses],
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setCanManageStatuses(canManageStatusRegistry());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<PropertyStatusRegistryEventDetail>).detail;
      if (detail?.statuses) {
        setStatuses(detail.statuses);
      } else {
        setStatuses(getStatuses());
      }
    };

    window.addEventListener(PROPERTY_STATUS_REGISTRY_EVENT, handleChange as EventListener);
    return () =>
      window.removeEventListener(
        PROPERTY_STATUS_REGISTRY_EVENT,
        handleChange as EventListener,
      );
  }, []);

  useEffect(() => {
    setStatuses(getStatuses());
  }, [isModalOpen]);

  useEffect(() => {
    if (!sortedStatuses.length) {
      return;
    }

    const currentValue = form.getValues('status') as string | undefined;
    const resolved = resolveStatusId(currentValue, sortedStatuses);
    if (resolved && resolved !== currentValue) {
      form.setValue('status', resolved, { shouldDirty: false });
    }
  }, [sortedStatuses, form]);

  useEffect(() => {
    if (!imovelId || appliedLocalStatusRef.current) {
      return;
    }

    const localState = getProperty<PropertyLocalState & { statusSelection?: string }>(imovelId);
    const stored = localState?.statusSelection;
    if (stored) {
      const resolved = resolveStatusId(stored, sortedStatuses);
      if (resolved) {
        form.setValue('status', resolved, { shouldDirty: false });
      }
    }

    appliedLocalStatusRef.current = true;
  }, [imovelId, sortedStatuses, form]);

  useEffect(() => {
    if (!imovelId) {
      return;
    }

    if (lastPersistedStatusRef.current === resolvedStatusId) {
      return;
    }

    lastPersistedStatusRef.current = resolvedStatusId;

    if (!resolvedStatusId) {
      mergeProperty(imovelId, previous => {
        const { statusSelection, ...rest } = previous || {};
        if (typeof statusSelection === 'undefined') {
          return previous;
        }
        return { ...rest } as PropertyLocalState & { statusSelection?: string };
      });
      return;
    }

    mergeProperty(imovelId, previous => ({
      ...(previous || {}),
      statusSelection: resolvedStatusId,
    }));
  }, [imovelId, resolvedStatusId]);

  const handleStatusChange = (value: string, onChange: (value: string) => void) => {
    onChange(value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleStatusesUpdate = (nextStatuses: PropertyStatus[]) => {
    setStatuses(nextStatuses);
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">Status</h3>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => {
              const value = resolveStatusId(field.value, sortedStatuses);

              return (
                <FormItem>
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Status do Imóvel
                    </FormLabel>
                    {canManageStatuses && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsModalOpen(true)}
                        className="h-9 w-9 rounded-xl border border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Select
                      value={value ?? undefined}
                      onValueChange={selected => handleStatusChange(selected, field.onChange)}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))]">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-50 rounded-2xl border border-gray-200 bg-white shadow-lg">
                        {sortedStatuses.map(status => {
                          const isInactive = !status.isActive;
                          const disabled = isInactive && status.id !== value;
                          return (
                            <SelectItem
                              key={status.id}
                              value={status.id}
                              disabled={disabled}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <span
                                    aria-hidden
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={getStatusDotStyle(status)}
                                  />
                                  <span>{status.label}</span>
                                </div>
                                {isInactive && (
                                  <span className="text-xs font-medium text-muted-foreground">
                                    Inativo
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Status atual:</span>
                        {currentStatus ? (
                          <Badge
                            className={cn('border font-medium', !currentStatus.color && 'bg-gray-100 text-gray-700')}
                            style={getStatusBadgeStyle(currentStatus) || undefined}
                          >
                            {currentStatus.label}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Nenhum status selecionado
                          </span>
                        )}
                      </div>

                      {currentStatus?.description && (
                        <p className="text-sm text-muted-foreground">
                          {currentStatus.description}
                        </p>
                      )}

                      {currentStatus && !currentStatus.isActive && (
                        <div className="flex items-start gap-2 text-sm text-orange-600">
                          <AlertCircle className="mt-[3px] h-4 w-4" />
                          <span>
                            Este status está marcado como inativo. Ele permanece selecionado apenas para este imóvel.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>

      <StatusModal
        open={isModalOpen}
        onClose={handleModalClose}
        onChange={handleStatusesUpdate}
      />
    </>
  );
}

function resolveStatusId(
  value: string | undefined,
  statuses: PropertyStatus[],
): string | undefined {
  if (!value) {
    return undefined;
  }

  const byId = statuses.find(status => status.id === value);
  if (byId) {
    return byId.id;
  }

  const byLabel = statuses.find(status => status.label === value);
  return byLabel?.id ?? value;
}

function parseHexColor(color?: string): { r: number; g: number; b: number } | undefined {
  if (!color) {
    return undefined;
  }

  const hex = color.replace('#', '');
  if (hex.length !== 3 && hex.length !== 6) {
    return undefined;
  }

  const normalized = hex.length === 3
    ? hex
        .split('')
        .map(char => char + char)
        .join('')
    : hex;

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return undefined;
  }

  const value = parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgba({ r, g, b }: { r: number; g: number; b: number }, alpha: number) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getStatusBadgeStyle(status?: PropertyStatus) {
  if (!status?.color) {
    return undefined;
  }

  const rgb = parseHexColor(status.color);
  if (!rgb) {
    return undefined;
  }

  return {
    backgroundColor: rgba(rgb, 0.12),
    color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    borderColor: rgba(rgb, 0.4),
  } as React.CSSProperties;
}

function getStatusDotStyle(status: PropertyStatus) {
  const rgb = parseHexColor(status.color);
  if (!rgb) {
    return { backgroundColor: '#9ca3af' } as React.CSSProperties;
  }
  return { backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` } as React.CSSProperties;
}

