import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Building2, Globe, Calendar } from 'lucide-react';
import { LeadIntensityButtons } from '@/components/vendas/LeadIntensityButtons';
import { useCountdown } from '@/hooks/ui/useCountdown';
import { STAGE_SLUG_TO_LABEL } from '@/data/stageMapping';
import { getLeadDetailPath } from '@/lib/routes/leads';
import {
  getStalenessColor,
  normalizeStalenessTimestamp,
} from '@/pages/vendas/utils/staleness';

interface LeadCardProps {
  lead: any;
}

const LeadCard = ({ lead }: LeadCardProps) => {
  const timer = useCountdown(lead.createdAt || new Date());
  const navigate = useNavigate();
  const stageLabel = STAGE_SLUG_TO_LABEL[lead.stage] || lead.stage;
  const stalenessTimestamp = normalizeStalenessTimestamp({
    lastContactAt: lead.lastContactAt,
    lastUpdate: lead.lastUpdate,
    firstInteractionAt: lead.firstInteractionAt,
    createdAt: lead.createdAt,
  });
  const stalenessColor = getStalenessColor(stalenessTimestamp);
  const stalenessLabel =
    lead.lastContact ??
    (stalenessTimestamp
      ? new Date(stalenessTimestamp).toLocaleString('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        })
      : lead.lastUpdate ?? 'Sem atualização');

  const handleClick = () => {
    navigate(getLeadDetailPath(lead.id));
  };

  return (
    <Link
      to={getLeadDetailPath(lead.id)}
      onClick={handleClick}
      className="lead-card block w-full h-full cursor-pointer bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all touch-manipulation pointer-events-auto"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-lg mb-2">{lead.name}</h4>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{stalenessLabel}</span>
          </div>
          <span className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full font-medium">
            {stageLabel}
          </span>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${stalenessColor}`}></div>
            <span className="text-sm font-semibold text-gray-600">{lead.priority}</span>
          </div>
          <div className="text-orange-600 font-mono text-sm">{timer}</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-3">
        <div className="flex items-start gap-2">
          <Building2 className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-1">{lead.service || 'Serviço não informado'}</h5>
            <p className="text-xs text-gray-600">{lead.summary || 'Sem descrição'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{lead.source || 'Origem não informada'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">{lead.source || 'Internet'}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">Intensidade do Lead</span>
          <LeadIntensityButtons leadId={lead.id} />
        </div>
      </div>

      <div className="bg-orange-50 rounded-xl p-3 mb-3 border border-orange-200">
        <div className="flex items-center gap-2 text-orange-700">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Primeiro contato - {lead.firstContact || 'Não informado'}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3">
        <div className="flex items-center gap-2 text-gray-600">
          <Building2 className="w-4 h-4" />
          <span className="text-sm">{lead.evaluation || 'Sem avaliação'}</span>
        </div>
      </div>
    </Link>
  );
};

export default LeadCard;

