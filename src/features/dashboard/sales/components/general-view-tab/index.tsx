'use client';

import { useState } from 'react';
import { Phone, MessageCircle, Calendar, Edit, UserPlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { formatLongDateHour, leadFunnelStepToLabel, LeadOriginTypeToLabel } from '@/shared/lib/utils';
import { LeadDetail, LeadFunnelStages } from '@/shared/types';

import { SaveTaskModal } from '@/features/dashboard/calendar/components/modal/save-task';

import { unarchiveLead, updateLeadFunnelStep } from '@/features/dashboard/sales/api/lead';
import { createTask, getTasks, completeTask } from '@/features/dashboard/calendar/api/tasks';

import { NextStepActionsModal } from '@/features/dashboard/sales/components/modal/next-step-actions-modal';
import { MakeProposalModal } from '@/features/dashboard/sales/components/modal/make-proposal-modal';
import { ClosedDealModal } from '@/features/dashboard/sales/components/modal/closed-deal-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

import { LeadAssistantReaderAvailable } from '@/features/dashboard/sales/components/general-view-tab/lead-assistant-reader-available';
import { PropertyCharacteristics } from '@/features/dashboard/sales/components/general-view-tab/property-characteristics';
import { ConversationSummary } from '@/features/dashboard/sales/components/general-view-tab/conversation-summary';
import { LeadProperties } from '@/features/dashboard/sales/components/general-view-tab/lead-properties';
import { AdditionalInfo } from '@/features/dashboard/sales/components/general-view-tab/additional-info';
import { CreditAnalyse } from '@/features/dashboard/sales/components/general-view-tab/credit-analyse';
import { IntensityLead } from '@/features/dashboard/sales/components/general-view-tab/lead-intensity';
import { LeadQualified } from '@/features/dashboard/sales/components/general-view-tab//lead-qualified';
import { LeadProposal } from '@/features/dashboard/sales/components/general-view-tab/lead-proposal';
import { TransferLeadModal } from '@/features/dashboard/sales/components/modal/transfer-lead-modal';
import { LeadUpdates } from '@/features/dashboard/sales/components/general-view-tab/lead-updates';
import { ArchiveLeadModal } from '@/features/dashboard/sales/components/modal/archive-lead-modal';
import { SaveLeadModal } from '@/features/dashboard/sales/components/modal/save-lead-modal';
import { Badge } from '@/shared/components/ui/badge';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface GeneralViewTabProps {
  lead: LeadDetail;
}

export function GeneralViewTab({ lead }: GeneralViewTabProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuth();

  const [isNextStepModalOpen, setIsNextStepModalOpen] = useState(false);
  const [isMakeProposalModalOpen, setIsMakeProposalModalOpen] = useState(false);
  const [isCloseDealModalOpen, setIsCloseDealModalOpen] = useState(false);
  const [isSaveLeadModalOpen, setIsSaveLeadModalOpen] = useState(false);
  const [isTransferLeadModalOpen, setIsTransferLeadModalOpen] = useState(false);
  const [isArchiveLeadModalOpen, setIsArchiveLeadModalOpen] = useState(false);

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const leadPropertyVisited = useMutation({
    mutationFn: (funnelStage: LeadFunnelStages) => updateLeadFunnelStep(lead?.uuid, funnelStage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-detail'] });
      toast.success('Status de qualificação do lead atualizado com sucesso!');
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
      toast.success('Tarefa criada com sucesso!');
      setTaskDialogOpen(false);

      if (data.lead && data.taskType.code === 'PROPERTY_VISIT') {
        const stagesToChange = [LeadFunnelStages.PRE_ATENDIMENTO, LeadFunnelStages.EM_ATENDIMENTO];
        if (stagesToChange.includes(lead.funnelStep)) {
          leadPropertyVisited.mutate(LeadFunnelStages.AGENDAMENTO);
        }
      }
    },
  });

  const unArchiveLeadMutation = useMutation({
    mutationFn: () => unarchiveLead(lead.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-detail'] });
      toast.success('Lead desarquivado com sucesso!');
    },
  });

  const handleCloseDeal = () => {
    setIsCloseDealModalOpen(true);
  };

  const handleArchiveLead = () => {
    setIsArchiveLeadModalOpen(true);
  };

  const completePendingTasksByType = async (taskTypeCode: string) => {
    try {
      const tasks = await getTasks({ leadUuid: lead.uuid, taskTypeCode });
      const pendingTasks = tasks.filter((task) => !task.completed);

      for (const task of pendingTasks) {
        await completeTask(task.uuid);
      }

      if (pendingTasks.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
      }
    } catch {}
  };

  const handlePhoneCall = () => {
    completePendingTasksByType('PHONE_CALL');
    window.location.href = `tel:${lead.phone1}`;
  };

  const handleWhatsAppMessage = () => {
    completePendingTasksByType('WHATSAPP_MESSAGE');
    const message = `Olá ${lead.name}! Tudo bem? Sou corretor da Hunter Imóveis e gostaria de falar com você sobre nossos imóveis disponíveis.`;
    const whatsappUrl = `https://wa.me/${lead.phone1}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <MakeProposalModal
        open={isMakeProposalModalOpen}
        onClose={() => setIsMakeProposalModalOpen(false)}
        leadUuid={lead.uuid}
        leadName={lead.name}
      />

      <SaveLeadModal open={isSaveLeadModalOpen} onClose={() => setIsSaveLeadModalOpen(false)} uuid={lead.uuid} />

      <ArchiveLeadModal
        open={isArchiveLeadModalOpen}
        onClose={() => setIsArchiveLeadModalOpen(false)}
        leadUuid={lead.uuid}
        leadName={lead.name}
      />

      <TransferLeadModal
        open={isTransferLeadModalOpen}
        onClose={() => setIsTransferLeadModalOpen(false)}
        onSuccess={() => router.push('/dashboard/sales')}
        leadUuid={lead.uuid}
        leadName={lead.name}
      />

      <SaveTaskModal
        open={taskDialogOpen}
        onClose={() => {
          setTaskDialogOpen(false);
        }}
        onSubmit={(data) => createTaskMutation.mutate(data)}
        isLoading={createTaskMutation.isPending}
        lead={{ name: lead.name, uuid: lead.uuid }}
      />

      <NextStepActionsModal
        open={isNextStepModalOpen}
        onClose={() => setIsNextStepModalOpen(false)}
        onMakeProposal={() => setIsMakeProposalModalOpen(true)}
        onCloseDeal={handleCloseDeal}
        leadUuid={lead.uuid}
      />

      <ClosedDealModal
        open={isCloseDealModalOpen}
        onClose={() => setIsCloseDealModalOpen(false)}
        leadName={lead.name}
        leadUuid={lead.uuid}
      />

      {hasFeature(user?.userInfo.profile.permissions, '1208') ? (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(lead.status)}`} />
                    <CardTitle>Informações Gerais</CardTitle>
                    <Badge variant="secondary">{lead.status}</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setIsTransferLeadModalOpen(true)}>
                      <UserPlus className="size-4" />
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => setIsSaveLeadModalOpen(true)}>
                      <Edit className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold opacity-60 mb-1">Nome do Lead</p>
                    <p className="text-base font-semibold">{lead.name}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold opacity-60 mb-1">Etapa do Funil</p>
                    <p className="text-sm">{leadFunnelStepToLabel(lead.funnelStep)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold opacity-60 mb-1">Natureza da negociação</p>
                    <p className="text-sm">{lead.negotiationType}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold opacity-60 mb-1">Origem do Lead</p>
                    <p className="text-sm">{LeadOriginTypeToLabel(lead.originType)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold opacity-60 mb-1">Primeiro Contato</p>
                    <p className="text-sm">{formatLongDateHour(lead.firstContactedAt)}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold opacity-60 mb-1">Último Contato</p>
                    <p className="text-sm">{formatLongDateHour(lead.lastContactedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PropertyCharacteristics leadUuid={lead.uuid} />
          </div>

          <LeadProposal leadUuid={lead.uuid} />

          <ConversationSummary conversationSummary={lead.conversationSummary} />

          <div className="grid md:grid-cols-2 gap-4">
            <LeadUpdates leadUuid={lead.uuid} />
            <AdditionalInfo leadUuid={lead.uuid} />
          </div>

          <CreditAnalyse leadName={lead.name} leadUuid={lead.uuid} />

          <div className="grid md:grid-cols-2 gap-4">
            <LeadQualified leadUuid={lead.uuid} funnelStep={lead.funnelStep} />
            <LeadAssistantReaderAvailable leadUuid={lead.uuid} isAvailable={lead.isAccessorEnabled} />
          </div>

          <IntensityLead lead={lead} />

          <LeadProperties leadUuid={lead.uuid} />

          <Card>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={handlePhoneCall}
                  className="flex flex-col cursor-pointer items-center justify-center rounded-xl py-3 bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <div className="size-10 rounded-full bg-primary flex items-center justify-center mb-2">
                    <Phone className="size-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold">Ligar</span>
                </button>

                <button
                  onClick={handleWhatsAppMessage}
                  className="flex flex-col cursor-pointer items-center justify-center rounded-xl py-3 bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <div className="size-10 rounded-full bg-[#25D366] flex items-center justify-center mb-2">
                    <MessageCircle className="size-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold">Responder</span>
                </button>

                <button
                  onClick={() => setTaskDialogOpen(true)}
                  className="flex flex-col cursor-pointer items-center justify-center rounded-xl py-3 bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <div className="size-10 rounded-full bg-primary flex items-center justify-center mb-2">
                    <Calendar className="size-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold">Agendar</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Button className="w-full" onClick={() => setIsNextStepModalOpen(true)}>
                Defina seu próximo passo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => (lead.status === 'ARQUIVADO' ? unArchiveLeadMutation.mutate() : handleArchiveLead())}
                isLoading={unArchiveLeadMutation.isPending}
              >
                {lead.status === 'ARQUIVADO' ? 'Desarquivar Lead' : 'Arquivar Lead'}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(lead.status)}`} />
                  <CardTitle>Informações Gerais</CardTitle>
                  <Badge variant="secondary">{lead.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold opacity-60 mb-1">Nome do Lead</p>
                  <p className="text-base font-semibold">{lead.name}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold opacity-60 mb-1">Etapa do Funil</p>
                  <p className="text-sm">{leadFunnelStepToLabel(lead.funnelStep)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold opacity-60 mb-1">Natureza da negociação</p>
                  <p className="text-sm">{lead.negotiationType}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold opacity-60 mb-1">Origem do Lead</p>
                  <p className="text-sm">{LeadOriginTypeToLabel(lead.originType)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold opacity-60 mb-1">Primeiro Contato</p>
                  <p className="text-sm">{formatLongDateHour(lead.firstContactedAt)}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold opacity-60 mb-1">Último Contato</p>
                  <p className="text-sm">{formatLongDateHour(lead.lastContactedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
