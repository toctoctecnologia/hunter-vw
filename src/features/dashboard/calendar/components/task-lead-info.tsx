'use client';

import { Clock, Thermometer } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  cn,
  formatLongDateHour,
  getElapsedTime,
  getIntensityColor,
  getIntensityText,
  leadFunnelStepToLabel,
  leadQualificationConfig,
  LeadOriginTypeToLabel,
  leadStatusTypeLabels,
  negotiationTypeLabels,
} from '@/shared/lib/utils';

import { LeadDetail, LeadStatusType } from '@/shared/types';

interface TaskLeadInfoProps {
  lead: LeadDetail;
}

export function TaskLeadInfo({ lead }: TaskLeadInfoProps) {
  const [elapsedTime, setElapsedTime] = useState<string | null>(null);

  useEffect(() => {
    if (lead.status !== 'ATIVO' || lead.lastContactedAt) {
      setElapsedTime(null);
      return;
    }

    if (!lead.createdAt) {
      setElapsedTime(null);
      return;
    }

    setElapsedTime(getElapsedTime(lead.createdAt));

    const interval = setInterval(() => {
      setElapsedTime(getElapsedTime(lead.createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [lead.status, lead.lastContactedAt, lead.createdAt]);

  const getStatusDisplay = () => {
    if (lead.status !== 'ATIVO') {
      return {
        label: leadStatusTypeLabels[lead.status as LeadStatusType] || lead.status,
        color: 'bg-gray-500',
      };
    }

    const qualificationInfo = leadQualificationConfig[lead.qualification];
    return {
      label: qualificationInfo?.label || 'Ativo',
      color: '',
      customColor: qualificationInfo?.color || '#22c55e',
    };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="mt-2 p-3 bg-muted/50 rounded-md border text-sm" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div
              className={cn('w-2.5 h-2.5 rounded-full mr-2', statusDisplay.color)}
              style={'customColor' in statusDisplay ? { backgroundColor: statusDisplay.customColor } : undefined}
            />
            <span className="text-xs font-medium">{statusDisplay.label}</span>
            {elapsedTime && (
              <div className="flex items-center ml-3 text-muted-foreground">
                <Clock className="size-3 mr-1" />
                <span className="text-xs">{elapsedTime}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div>
              <span className="text-xs">
                <span className="font-semibold">Etapa do Funil: </span>
                {leadFunnelStepToLabel(lead.funnelStep)}
              </span>
            </div>

            <div>
              <span className="text-xs">
                <span className="font-semibold">Natureza da Negociação: </span>
                {negotiationTypeLabels[lead.negotiationType]}
              </span>
            </div>

            <div>
              <span className="text-xs">
                <span className="font-semibold">Origem: </span>
                {LeadOriginTypeToLabel(lead.originType)}
              </span>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t">
            <span className="text-xs font-semibold mb-1 block">Histórico</span>
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground">
                Primeiro contato: {lead.firstContactedAt ? formatLongDateHour(lead.firstContactedAt) : '--/--/----'}
              </span>
            </div>
          </div>
        </div>

        <div className="ml-3 flex flex-col items-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: getIntensityColor(lead.intensityType) }}
          >
            <Thermometer className="size-4 text-white" />
          </div>
          <span className="text-[10px] text-center mt-1 text-muted-foreground">
            {getIntensityText(lead.intensityType)}
          </span>
        </div>
      </div>
    </div>
  );
}
