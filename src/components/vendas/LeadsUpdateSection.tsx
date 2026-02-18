
import { User, Clock, Phone, AlertTriangle } from 'lucide-react';

interface LeadsUpdateSectionProps {
  onNavigateToTab: (tab: string) => void;
}

export const LeadsUpdateSection = ({ onNavigateToTab }: LeadsUpdateSectionProps) => {
  const leadUpdates = [
    {
      id: 1,
      name: "João Silva",
      action: "Fazer follow-up",
      days: 5,
      priority: "high"
    },
    {
      id: 2,
      name: "Joane Santos",
      action: "Retornar ligação",
      days: 12,
      priority: "medium"
    },
    {
      id: 3,
      name: "Raine Costa",
      action: "Agendar visita",
      days: 8,
      priority: "high"
    },
    {
      id: 4,
      name: "Maria Oliveira",
      action: "Sem falar há 30 dias",
      days: 30,
      priority: "urgent"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-[var(--text)] bg-[hsl(var(--danger))]';
      case 'high': return 'text-[var(--text)] bg-[hsl(var(--warning))]';
      case 'medium': return 'text-[var(--text)] bg-[hsl(var(--success))]';
      default: return 'text-[var(--text)] bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle size={16} className="text-[hsl(var(--danger))]" />;
      case 'high': return <Clock size={16} className="text-[hsl(var(--warning))]" />;
      case 'medium': return <Phone size={16} className="text-[hsl(var(--success))]" />;
      default: return <Phone size={16} className="text-[var(--text)]" />;
    }
  };

  return (
    <div className="mx-4 mt-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#333333] flex items-center">
          <AlertTriangle size={20} className="text-[hsl(var(--accent))] mr-2" />
          Atualizações de Leads
        </h2>
        <button 
          onClick={() => onNavigateToTab('leads')}
          className="text-sm text-[hsl(var(--accent))] font-medium"
        >
          Ver todos
        </button>
      </div>

      {/* Leads Updates List */}
      <div className="space-y-2">
        {leadUpdates.slice(0, 3).map(lead => (
          <div 
            key={lead.id} 
            className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
            style={{ width: '320px', height: '64px' }}
            onClick={() => onNavigateToTab('leads')}
          >
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <User size={20} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#333333]">{lead.name}</p>
                <p className="text-xs text-[#666666]">{lead.action}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getPriorityIcon(lead.priority)}
              <div className={`px-2 py-1 rounded-full ${getPriorityColor(lead.priority)}`}>
                <span className="text-xs font-medium">{lead.days}d</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attention Badge */}
      <div className="mt-3 bg-[hsl(var(--danger))] border border-[hsl(var(--danger))] rounded-lg p-3">
        <div className="flex items-center">
          <AlertTriangle size={16} className="text-[var(--text)] mr-2" />
          <span className="text-sm text-[var(--text)] font-medium">
            4 leads precisam de atenção urgente
          </span>
        </div>
      </div>
    </div>
  );
};
