import React from 'react';

type ActivityType =
  | 'status_change'
  | 'contact'
  | 'qualification'
  | 'visit_scheduled'
  | 'visit_completed'
  | 'proposal_sent'
  | 'proposal_accepted'
  | 'proposal_rejected'
  | 'deal_closed'
  | 'commission_recorded'
  | 'referral';

interface Activity {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  user: string;
  date: string;
}

const mockActivities: Activity[] = [
  {
    id: 1,
    type: 'status_change',
    title: 'Mudança de Status',
    description: 'Status alterado de Novo Lead para Em Atendimento por Eduardo em 13/07/2025',
    time: '14:30',
    user: 'Eduardo',
    date: '13/07/2025'
  },
  {
    id: 2,
    type: 'contact',
    title: 'Contato',
    description: 'Primeiro contato realizado via WhatsApp',
    time: '16:45',
    user: 'Eduardo',
    date: '12/07/2025'
  },
  {
    id: 3,
    type: 'proposal_sent',
    title: 'Proposta enviada',
    description: 'Proposta de financiamento enviada para revisão do cliente com validade de 7 dias',
    time: '10:15',
    user: 'Paula',
    date: '12/07/2025'
  },
  {
    id: 4,
    type: 'proposal_accepted',
    title: 'Histórico de proposta',
    description: 'Cliente solicitou contra-proposta com entrada reduzida e parcelamento em 24x',
    time: '11:05',
    user: 'Paula',
    date: '12/07/2025'
  },
  {
    id: 5,
    type: 'deal_closed',
    title: 'Negociação',
    description: 'Reunião de negociação marcada para alinhar condições finais e documentos pendentes',
    time: '15:20',
    user: 'Eduardo',
    date: '11/07/2025'
  },
  {
    id: 6,
    type: 'status_change',
    title: 'Mudança de Status',
    description: 'Status atualizado de Em Atendimento para Proposta Enviada após retorno positivo do cliente',
    time: '09:40',
    user: 'Eduardo',
    date: '11/07/2025'
  }
];

interface ActivitiesTabProps {
  leadId: number;
  leadName?: string;
  initialActivities?: any[];
}

export function ActivitiesTab({ leadId, leadName, initialActivities }: ActivitiesTabProps) {
  const activities = initialActivities && initialActivities.length ? initialActivities : mockActivities;
  return (
    <div className="p-6 space-y-6">
      {activities.map((activity: any) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2 flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[hsl(var(--accent))] text-sm">{activity.title}</span>
              <span className="text-sm text-gray-600">{activity.time}</span>
            </div>
            <p className="text-sm text-gray-900 font-medium leading-relaxed">
              {activity.description}
            </p>
            <p className="text-xs text-gray-500">
              {activity.date} por {activity.user}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
