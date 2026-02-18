'use client';

import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import Pill from '@/components/ui/pill';
import type { UserAutomationsSnapshot } from '@/features/users/types';

interface AutomationToggleCardProps {
  automations: UserAutomationsSnapshot;
  onToggle?: (toggleId: string, nextValue: boolean) => void | Promise<void>;
  busyToggleId?: string | null;
}

function getAutomationPill(snapshot: UserAutomationsSnapshot, toggleId: string) {
  return snapshot.pills.find(pill => pill.id === toggleId) ?? null;
}

function isToggleAutoEnforced(snapshot: UserAutomationsSnapshot, toggleId: string) {
  if (toggleId === 'auto-receive-leads') {
    return snapshot.autoEnforceHealthLeads;
  }
  if (toggleId === 'roletao-auto-claim') {
    return snapshot.autoEnforceRoletao;
  }
  return false;
}

export default function AutomationToggleCard({ automations, onToggle, busyToggleId }: AutomationToggleCardProps) {
  const toggles = Array.isArray(automations?.toggles) ? automations.toggles : [];

  const handleToggle = (toggleId: string) => (checked: boolean) => {
    if (!onToggle) return;
    onToggle(toggleId, checked);
  };

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold text-gray-900">Automação de recebimento</CardTitle>
        <CardDescription>
          Ative ou desative o recebimento automático de leads e defina se o corretor disputa no roletão ou
          passa o lead para o próximo da fila.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {toggles.map(toggle => (
          <div
            key={toggle.id}
            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">{toggle.title}</p>
              <p className="text-sm text-muted-foreground">{toggle.description}</p>
              <a
                href={toggle.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Abrir configuração
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              {(() => {
                const pill = getAutomationPill(automations, toggle.id);
                if (!pill) return null;
                return (
                  <div className="mt-1 flex flex-col gap-1">
                    <Pill variant={pill.variant}>{pill.message}</Pill>
                    {pill.reason ? (
                      <p className="text-xs leading-snug text-muted-foreground">{pill.reason}</p>
                    ) : null}
                  </div>
                );
              })()}
              {isToggleAutoEnforced(automations, toggle.id) ? (
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Ajuste automático ativo
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {toggle.enabled ? 'ATIVO' : 'INATIVO'}
              </span>
              <Switch
                checked={toggle.enabled}
                onCheckedChange={handleToggle(toggle.id)}
                aria-readonly={onToggle ? undefined : true}
                aria-busy={busyToggleId === toggle.id}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
