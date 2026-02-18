import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { LeadFunnelItem, LeadFunnelStages } from '@/shared/types';

import { funnelStageLabels } from '@/shared/lib/utils';

import { updateFunnelStepTargetPercentage } from '@/features/dashboard/sales/api/lead';
import { SetFunnelGoalModal } from '@/features/dashboard/sales/components/modal/set-funnel-goal-modal';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';

interface FunnelChartProps {
  data: LeadFunnelItem[];
  onStageClick: (stage: LeadFunnelStages, label: string) => void;
}

export function FunnelChart({ data, onStageClick }: FunnelChartProps) {
  const queryClient = useQueryClient();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedStageForGoal, setSelectedStageForGoal] = useState<LeadFunnelStages | null>(null);

  const updateGoalMutation = useMutation({
    mutationFn: ({ stage, targetPercentage }: { stage: LeadFunnelStages; targetPercentage: number }) =>
      updateFunnelStepTargetPercentage(stage, targetPercentage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funnel-leads'] });
      toast.success('Meta atualizada com sucesso!');
    },
  });

  const getGoalForStage = (stage: LeadFunnelStages): number => {
    const item = data.find((d) => d.funnelStep === stage);
    return item?.targetPercentage ?? 0;
  };

  const totalLeads = data.reduce((sum, item) => sum + item.leadsAmount, 0);

  const getStageData = (stage: LeadFunnelStages) => {
    const item = data.find((d) => d.funnelStep === stage);
    const leads = item?.leadsAmount || 0;
    const percentage = totalLeads > 0 ? Math.round((leads / totalLeads) * 100) : 0;
    return { leads, percentage };
  };

  const getConversionRate = (currentStage: LeadFunnelStages, nextStage?: LeadFunnelStages) => {
    if (!nextStage) return null;

    const currentItem = data.find((d) => d.funnelStep === currentStage);
    const nextItem = data.find((d) => d.funnelStep === nextStage);

    if (!currentItem || !nextItem || currentItem.leadsAmount === 0) return null;

    const rate = Math.round((nextItem.leadsAmount / currentItem.leadsAmount) * 100);
    return rate;
  };

  const handleSetGoal = (stage: LeadFunnelStages) => {
    setSelectedStageForGoal(stage);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (stage: LeadFunnelStages, goalPercentage: number) => {
    updateGoalMutation.mutate({ stage, targetPercentage: goalPercentage });
  };

  const funnelStages = [
    {
      label: funnelStageLabels[LeadFunnelStages.PRE_ATENDIMENTO],
      stage: LeadFunnelStages.PRE_ATENDIMENTO,
      type: 'top',
      conversionRate: getConversionRate(LeadFunnelStages.PRE_ATENDIMENTO, LeadFunnelStages.EM_ATENDIMENTO),
      goal: getGoalForStage(LeadFunnelStages.PRE_ATENDIMENTO),
      ...getStageData(LeadFunnelStages.PRE_ATENDIMENTO),
    },
    {
      label: funnelStageLabels[LeadFunnelStages.EM_ATENDIMENTO],
      stage: LeadFunnelStages.EM_ATENDIMENTO,
      type: 'top',
      conversionRate: getConversionRate(LeadFunnelStages.EM_ATENDIMENTO, LeadFunnelStages.AGENDAMENTO),
      goal: getGoalForStage(LeadFunnelStages.EM_ATENDIMENTO),
      ...getStageData(LeadFunnelStages.EM_ATENDIMENTO),
    },
    {
      label: funnelStageLabels[LeadFunnelStages.AGENDAMENTO],
      stage: LeadFunnelStages.AGENDAMENTO,
      type: 'top',
      conversionRate: getConversionRate(LeadFunnelStages.AGENDAMENTO, LeadFunnelStages.VISITA),
      goal: getGoalForStage(LeadFunnelStages.AGENDAMENTO),
      ...getStageData(LeadFunnelStages.AGENDAMENTO),
    },
    {
      label: funnelStageLabels[LeadFunnelStages.VISITA],
      stage: LeadFunnelStages.VISITA,
      type: 'top',
      conversionRate: getConversionRate(LeadFunnelStages.VISITA, LeadFunnelStages.PROPOSTA_ENVIADA),
      goal: getGoalForStage(LeadFunnelStages.VISITA),
      ...getStageData(LeadFunnelStages.VISITA),
    },
    {
      label: funnelStageLabels[LeadFunnelStages.PROPOSTA_ENVIADA],
      stage: LeadFunnelStages.PROPOSTA_ENVIADA,
      type: 'top',
      conversionRate: getConversionRate(LeadFunnelStages.PROPOSTA_ENVIADA, LeadFunnelStages.EM_NEGOCIACAO),
      goal: getGoalForStage(LeadFunnelStages.PROPOSTA_ENVIADA),
      ...getStageData(LeadFunnelStages.PROPOSTA_ENVIADA),
    },
    {
      label: funnelStageLabels[LeadFunnelStages.EM_NEGOCIACAO],
      stage: LeadFunnelStages.EM_NEGOCIACAO,
      type: 'top',
      conversionRate: getConversionRate(LeadFunnelStages.EM_NEGOCIACAO, LeadFunnelStages.NEGOCIO_FECHADO),
      goal: getGoalForStage(LeadFunnelStages.EM_NEGOCIACAO),
      ...getStageData(LeadFunnelStages.EM_NEGOCIACAO),
    },
    {
      label: funnelStageLabels[LeadFunnelStages.NEGOCIO_FECHADO],
      stage: LeadFunnelStages.NEGOCIO_FECHADO,
      type: 'highlight',
      conversionRate: getConversionRate(LeadFunnelStages.NEGOCIO_FECHADO, LeadFunnelStages.INDICACAO),
      goal: getGoalForStage(LeadFunnelStages.NEGOCIO_FECHADO),
      ...getStageData(LeadFunnelStages.NEGOCIO_FECHADO),
    },
    {
      label: funnelStageLabels[LeadFunnelStages.INDICACAO],
      stage: LeadFunnelStages.INDICACAO,
      type: 'bottom',
      conversionRate: getConversionRate(LeadFunnelStages.INDICACAO, LeadFunnelStages.RECEITA_GERADA),
      goal: getGoalForStage(LeadFunnelStages.INDICACAO),
      ...getStageData(LeadFunnelStages.INDICACAO),
    },
    {
      label: funnelStageLabels[LeadFunnelStages.RECEITA_GERADA],
      stage: LeadFunnelStages.RECEITA_GERADA,
      type: 'bottom',
      conversionRate: getConversionRate(LeadFunnelStages.RECEITA_GERADA, LeadFunnelStages.POS_VENDA),
      goal: getGoalForStage(LeadFunnelStages.RECEITA_GERADA),
      ...getStageData(LeadFunnelStages.RECEITA_GERADA),
    },
    {
      label: funnelStageLabels[LeadFunnelStages.POS_VENDA],
      stage: LeadFunnelStages.POS_VENDA,
      type: 'bottom',
      conversionRate: null,
      goal: getGoalForStage(LeadFunnelStages.POS_VENDA),
      ...getStageData(LeadFunnelStages.POS_VENDA),
    },
  ];

  return (
    <>
      {selectedStageForGoal && (
        <SetFunnelGoalModal
          open={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          stage={selectedStageForGoal}
          currentGoal={getGoalForStage(selectedStageForGoal)}
          onSave={handleSaveGoal}
          isLoading={updateGoalMutation.isPending}
        />
      )}

      <div className="relative flex flex-col items-center">
        <div className="relative flex items-start gap-4">
          <div
            className="bg-linear-to-b from-red-500 to-orange-500 text-white font-semibold text-sm sm:text-lg"
            style={{
              width: '300px',
              height: '375px',
              clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingTop: '20px',
              paddingBottom: '40px',
              borderRadius: '16px',
            }}
          >
            {funnelStages.slice(0, 6).map((stage, index) => (
              <div
                key={index}
                className="text-center px-2 sm:px-4 text-xs sm:text-base flex flex-col items-center mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onStageClick(stage.stage, stage.label)}
              >
                <div className="font-bold">{stage.label}</div>
                <div className="text-xs opacity-90 mt-1">
                  {stage.leads} Lead(s) ({stage.percentage}%)
                </div>
              </div>
            ))}
          </div>

          {/* Metrics Column */}
          <div className="flex flex-col justify-around" style={{ height: '375px' }}>
            {funnelStages.slice(0, 6).map((stage, index) => (
              <div key={index} className="mb-2 flex items-center">
                <button
                  className="flex gap-2 relative items-center bg-secondary rounded-full px-3 py-1 shadow-md border border-secondary cursor-pointer min-w-[234px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetGoal(stage.stage);
                  }}
                >
                  <div className="flex gap-1 items-center">
                    <TypographyMuted>Taxa Média:</TypographyMuted>
                    <div className="text-md font-bold text-primary">
                      {stage.conversionRate !== null ? `${stage.conversionRate}%` : '-'}
                    </div>
                  </div>

                  <div className="flex gap-1 items-center">
                    <TypographyMuted>Meta:</TypographyMuted>
                    <TypographySmall>{stage.goal > 0 ? `${stage.goal}%` : 'N/A'}</TypographySmall>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div
            className="bg-green-500 text-white font-bold text-lg sm:text-xl flex flex-col items-center justify-center -mt-1 relative z-10 cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              width: '300px',
              height: '60px',
              borderRadius: '16px',
            }}
            onClick={() => onStageClick(funnelStages[6].stage, funnelStages[6].label)}
          >
            <span className="text-sm sm:text-xl font-bold">Negócio Fechado</span>
            <div className="text-xs opacity-90 mt-1">
              {funnelStages[6].leads} Lead(s) ({funnelStages[6].percentage}%)
            </div>
          </div>

          {/* Metrics for Negócio Fechado */}
          <div className="my-2 flex items-center">
            <button
              className="flex gap-2 relative items-center bg-secondary rounded-full px-3 py-1 shadow-md border border-secondary cursor-pointer min-w-[234px]"
              onClick={(e) => {
                e.stopPropagation();
                handleSetGoal(funnelStages[6].stage);
              }}
            >
              <div className="flex gap-1 items-center">
                <TypographyMuted>Taxa Média:</TypographyMuted>
                <div className="text-lg font-bold text-primary">
                  {funnelStages[6].conversionRate !== null ? `${funnelStages[6].conversionRate}%` : '-'}
                </div>
              </div>

              <div className="flex gap-1 items-center">
                <TypographyMuted>Meta:</TypographyMuted>
                <TypographySmall>{funnelStages[6].goal > 0 ? `${funnelStages[6].goal}%` : 'N/A'}</TypographySmall>
              </div>
            </button>
          </div>
        </div>

        <div className="relative flex items-start gap-4 -mt-1">
          <div
            className="bg-linear-to-b from-orange-500 to-red-500 text-white font-semibold text-sm sm:text-lg"
            style={{
              width: '300px',
              height: '220px',
              clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0% 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingTop: '25px',
              paddingBottom: '15px',
              borderRadius: '20px',
            }}
          >
            {funnelStages.slice(7).map((stage, index) => (
              <div
                key={index}
                className="text-center px-2 sm:px-4 text-xs sm:text-base flex flex-col items-center mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onStageClick(stage.stage, stage.label)}
              >
                <div className="font-bold">{stage.label}</div>
                <div className="text-xs opacity-90 mt-1">
                  {stage.leads} Lead(s) ({stage.percentage}%)
                </div>
              </div>
            ))}
          </div>

          {/* Metrics Column for bottom stages */}
          <div
            className="flex flex-col justify-around"
            style={{ height: '220px', paddingTop: '25px', paddingBottom: '15px' }}
          >
            {funnelStages.slice(7).map((stage, index) => (
              <div key={index} className="mb-2 flex items-center">
                <button
                  className="flex gap-2 relative items-center bg-secondary rounded-full px-3 py-1 shadow-md border border-secondary cursor-pointer min-w-[234px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetGoal(stage.stage);
                  }}
                >
                  <div className="flex gap-1 items-center">
                    <TypographyMuted>Taxa Média:</TypographyMuted>
                    <div className="text-lg font-bold text-primary">
                      {stage.conversionRate !== null ? `${stage.conversionRate}%` : '-'}
                    </div>
                  </div>

                  <div className="flex gap-1 items-center">
                    <TypographyMuted>Meta:</TypographyMuted>
                    <TypographySmall>{stage.goal > 0 ? `${stage.goal}%` : 'N/A'}</TypographySmall>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
