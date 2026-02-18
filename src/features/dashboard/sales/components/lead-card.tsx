'use client';
import { Clock, Thermometer, User } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

import { captureDistributionLead, captureRouletteLead, updateLead } from '@/features/dashboard/sales/api/lead';

export type QueueType = 'roulette' | 'distribution';

import { LeadFormData } from '@/features/dashboard/sales/components/form/lead-form';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';

interface LeadCardProps {
  data: LeadDetail;
  hideActions?: boolean;
  className?: string;
  queueType?: QueueType;
  onPress?: (lead: LeadDetail) => void;
}

export function LeadCard({ data, hideActions = false, className, queueType, onPress }: LeadCardProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [elapsedTime, setElapsedTime] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!queueType || data.status !== 'ATIVO') {
      setCountdown(null);
      return;
    }

    if (data.expiresIn === undefined || data.expiresIn === null) {
      setCountdown(null);
      return;
    }

    setCountdown(Math.max(0, data.expiresIn));

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [queueType, data.status, data.expiresIn]);

  useEffect(() => {
    if (queueType || data.status !== 'ATIVO' || data.lastContactedAt) {
      setElapsedTime(null);
      return;
    }

    if (!data.createdAt) {
      setElapsedTime(null);
      return;
    }
    setElapsedTime(getElapsedTime(data.createdAt));

    const interval = setInterval(() => {
      setElapsedTime(getElapsedTime(data.createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [queueType, data.status, data.lastContactedAt, data.createdAt]);

  const formatCountdown = (seconds: number): string => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    }
    return `${seconds}s`;
  };

  const getStatusDisplay = () => {
    if (data.status !== 'ATIVO') {
      return {
        label: leadStatusTypeLabels[data.status as LeadStatusType] || data.status,
        color: 'bg-gray-500',
      };
    }

    const qualificationInfo = leadQualificationConfig[data.qualification];
    return {
      label: qualificationInfo?.label || 'Ativo',
      color: '',
      customColor: qualificationInfo?.color || '#22c55e',
    };
  };

  const statusDisplay = getStatusDisplay();

  const captureMutation = useMutation({
    mutationFn: async () => {
      if (queueType === 'roulette') {
        return captureRouletteLead(data.uuid);
      } else if (queueType === 'distribution') {
        return captureDistributionLead(data.uuid);
      }
      return updateLead(data.uuid, { catcherUuid: user?.userInfo.uuid });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-pending-offers'] });
      queryClient.invalidateQueries({ queryKey: ['distribution-pending-offers'] });
      toast.success('Lead capturado com sucesso!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: Partial<LeadFormData>) => updateLead(data.uuid, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['roulette-pending-offers'] });
      queryClient.invalidateQueries({ queryKey: ['distribution-pending-offers'] });
      toast.success('Lead capturado com sucesso!');
    },
  });

  return (
    <Card
      className={cn('w-full', onPress && 'cursor-pointer hover:shadow-lg transition-shadow', className)}
      onClick={() => onPress?.(data)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div
                className={cn('w-3 h-3 rounded-full mr-2', statusDisplay.color)}
                style={'customColor' in statusDisplay ? { backgroundColor: statusDisplay.customColor } : undefined}
              />
              <span className="text-sm font-medium">{statusDisplay.label}</span>
              {queueType && countdown !== null && (
                <div
                  className={cn('flex items-center ml-3', countdown <= 10 ? 'text-red-500' : 'text-muted-foreground')}
                >
                  <Clock className="size-3 mr-1" />
                  <span className="text-sm font-medium">{formatCountdown(countdown)}</span>
                </div>
              )}
              {!queueType && elapsedTime && (
                <div className="flex items-center ml-3 text-muted-foreground">
                  <Clock className="size-3 mr-1" />
                  <span className="text-sm">{elapsedTime}</span>
                </div>
              )}
            </div>

            <div className="flex items-center mb-3">
              <User size={22} />
              <span className="text-text font-bold text-base ml-2">{data.name}</span>
            </div>

            <div className="mb-2">
              <span className="text-sm">
                <span className="font-semibold">Etapa do Funil: </span>
                {leadFunnelStepToLabel(data.funnelStep)}
              </span>
            </div>

            <div className="mb-2">
              <span className="text-sm">
                <span className="font-semibold">Natureza da Negociação: </span>
                {negotiationTypeLabels[data.negotiationType]}
              </span>
            </div>

            <div className="mb-3">
              <span className="text-sm">
                <span className="font-semibold">Origem: </span>
                {LeadOriginTypeToLabel(data.originType)}
              </span>
            </div>

            <div className="pt-3 border-t">
              <span className="text-xs font-semibold mb-1 block">Histórico</span>
              <div className="flex items-center mb-1">
                <span className="text-xs text-muted-foreground">
                  Primeiro contato: {data.firstContactedAt ? formatLongDateHour(data.firstContactedAt) : '--/--/----'}
                </span>
              </div>
            </div>
          </div>

          <div className="ml-4 flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: getIntensityColor(data.intensityType) }}
            >
              <Thermometer className="size-6 text-white" />
            </div>
            <span className="text-xs text-center mt-1 text-muted-foreground">
              {getIntensityText(data.intensityType)}
            </span>
          </div>
        </div>

        {!hideActions && data.status === 'ATIVO' && (
          <div className="mt-4">
            <Button
              className="w-full"
              isLoading={captureMutation.isPending || updateMutation.isPending}
              onClick={() => {
                if (queueType) {
                  captureMutation.mutate();
                } else {
                  updateMutation.mutate({ catcherUuid: user?.userInfo.uuid });
                }
              }}
            >
              Pegar Lead
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
