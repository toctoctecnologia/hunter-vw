import { useEffect, useMemo, useCallback } from 'react';
import { useLeadsStore } from '@/hooks/vendas';
import { useRoletaoStore } from '@/hooks/distribuicao';
import { useToast } from '@/hooks/use-toast';
import LeadCard from './LeadCard';
import type { Lead } from '@/hooks/vendas';
import { STAGE_LABEL_TO_SLUG } from '@/data/stageMapping';

interface RoletaTabProps {
  leads?: Lead[];
  publishToRoleta: (leadId: number) => void;
}

export const RoletaTab = ({
  leads,
  publishToRoleta
}: RoletaTabProps) => {
  const { leads: storeLeads, all, load, error } = useLeadsStore();
  const { leads: roletaLeads, config, claim } = useRoletaoStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!leads?.length && !storeLeads.length) {
      load();
    }
  }, [leads, storeLeads.length, load]);

  const availableLeads = useMemo(() => {
    const srcLeads = leads ?? all();
    return srcLeads.filter(
      (lead) =>
        lead.stage === 'pré_atendimento' && !lead.capturedBy
    );
  }, [leads, all]);

  useEffect(() => {
    const timers = availableLeads.map((lead) => {
      const created = lead.createdAt
        ? new Date(lead.createdAt).getTime()
        : Date.now();
      const elapsed = Date.now() - created;
      const remaining = Math.max(
        0,
        config.timeoutMin * 60 * 1000 - elapsed
      );

      return setTimeout(() => {
        publishToRoleta(lead.id);
      }, remaining);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [availableLeads, publishToRoleta, config.timeoutMin]);
  const exemplo = availableLeads[0] || {
    id: 0,
    name: 'Lead Exemplo',
    lastUpdate: 'Agora',
    lastContactAt: new Date().toISOString(),
    stage: STAGE_LABEL_TO_SLUG['Pré-Atendimento'],
    service: 'Serviço Exemplo',
    summary: 'Subtítulo do lead',
    source: 'Origem Exemplo',
    priority: 'Alta',
    updateStatus: 'green',
    createdAt: new Date().toISOString(),
    firstContact: 'Contato Exemplo',
    evaluation: 'Avaliação Exemplo'
  };

  const currentLead = roletaLeads[0];
  const displayLead = currentLead || exemplo;

  const handleClaim = useCallback(async () => {
    if (!currentLead) return;
    try {
      const result = await claim(currentLead.id);
      if (result === 'ok') {
        toast({ title: 'Lead pego com sucesso' });
      } else {
        toast({ title: 'Ops, não foi dessa vez' });
      }
    } catch {
      toast({ title: 'Erro ao pegar lead' });
    }
  }, [currentLead, claim, toast]);

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">Erro ao carregar leads: {error}</div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Roletão</h2>
      <div className="relative">
        <LeadCard lead={displayLead} />
        <button
          onClick={handleClaim}
          disabled={!currentLead}
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          Pegar Lead
        </button>
      </div>
    </div>
  );
};
