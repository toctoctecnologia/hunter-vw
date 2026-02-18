'use client';
import { forwardRef, useEffect, useState } from 'react';
import { Clock, Thermometer } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  cn,
  formatDate,
  getElapsedTime,
  getIntensityColor,
  LeadOriginTypeToLabel,
  leadQualificationConfig,
  leadStatusTypeLabels,
  negotiationTypeLabels,
} from '@/shared/lib/utils';

import { LeadDetail, LeadStatusType } from '@/shared/types';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/components/ui/tooltip';
import { Card, CardContent } from '@/shared/components/ui/card';

interface KanbanLeadCardProps {
  className?: string;
  isDragging?: boolean;
  leadDetail: LeadDetail;
}

export const KanbanLeadCard = forwardRef<HTMLDivElement, KanbanLeadCardProps>(
  ({ isDragging = false, className, leadDetail }, ref) => {
    const router = useRouter();
    const {
      negotiationType,
      originType,
      intensityType,
      name,
      lastContactedAt,
      createdAt,
      uuid,
      qualification,
      firstContactedAt,
      status,
    } = leadDetail;

    const [elapsedTime, setElapsedTime] = useState<string | null>(null);

    useEffect(() => {
      if (status !== 'ATIVO' || lastContactedAt) {
        setElapsedTime(null);
        return;
      }

      if (!createdAt) {
        setElapsedTime(null);
        return;
      }
      setElapsedTime(getElapsedTime(createdAt));

      const interval = setInterval(() => {
        setElapsedTime(getElapsedTime(createdAt));
      }, 1000);

      return () => clearInterval(interval);
    }, [status, lastContactedAt, createdAt]);

    const getStatusDisplay = () => {
      if (status !== 'ATIVO') {
        return {
          label: leadStatusTypeLabels[status as LeadStatusType] || status,
          color: 'bg-gray-500',
        };
      }

      const qualificationInfo = leadQualificationConfig[qualification];
      return {
        label: qualificationInfo?.label || 'Ativo',
        color: '',
        customColor: qualificationInfo?.color || '#22c55e',
      };
    };

    const statusDisplay = getStatusDisplay();

    return (
      <Card
        ref={ref}
        className={cn('w-full cursor-grab active:cursor-grabbing py-4', isDragging && 'opacity-50', className)}
        onClick={() => router.push(`/dashboard/sales/${uuid}/details`)}
      >
        <CardContent className="px-4">
          <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-2 flex-1 overflow-hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-base font-medium text-text">{name}</span>
                </TooltipTrigger>

                <TooltipContent>{name}</TooltipContent>
              </Tooltip>

              <div className="flex items-center mb-3">
                <div
                  className={cn('w-2 h-2 rounded-full mr-1', statusDisplay.color)}
                  style={'customColor' in statusDisplay ? { backgroundColor: statusDisplay.customColor } : undefined}
                />

                <strong className="text-xs font-medium">{statusDisplay.label}</strong>

                {elapsedTime && (
                  <div className="flex items-center ml-3 text-muted-foreground">
                    <Clock className="w-2 h-2 mr-1" />
                    <span className="text-xs">{elapsedTime}</span>
                  </div>
                )}
              </div>

              <span className="text-xs space-x-1">
                <span className="font-bold">Natureza da negociação:</span>
                <span className="truncate">{negotiationTypeLabels[negotiationType]}</span>
              </span>

              <span className="text-xs">
                <span className="font-bold">Origem: </span>
                <span className="truncate">{LeadOriginTypeToLabel(originType)}</span>
              </span>

              <div className="pt-2 mt-2 border-t">
                <span className="text-[10px] font-semibold mb-0.5 block">Histórico</span>
                <span className="text-[10px] text-muted-foreground truncate block">
                  Primeiro contato: {firstContactedAt ? formatDate(firstContactedAt) : '--/--/----'}
                </span>
              </div>
            </div>

            <div
              className="flex flex-row justify-center items-center gap-1 size-6 rounded-full"
              style={{ backgroundColor: getIntensityColor(intensityType) }}
            >
              <Thermometer className="size-3 text-black" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

KanbanLeadCard.displayName = 'KanbanLeadCard';
