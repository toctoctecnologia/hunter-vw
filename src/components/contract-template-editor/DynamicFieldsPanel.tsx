import { useEffect, useState } from 'react';
import { 
  FileText, 
  User, 
  Users, 
  Home, 
  DollarSign, 
  Shield, 
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCamposDinamicosByTipo, GrupoCamposDinamicos, type TipoContratoTemplate } from '@/types/contrato-padrao';
import { PlaceholderChip } from './PlaceholderChip';
import { cn } from '@/lib/utils';

interface DynamicFieldsPanelProps {
  onInsertField: (placeholder: string) => void;
  tipoContrato?: TipoContratoTemplate;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  User,
  Users,
  Home,
  DollarSign,
  Shield,
  MoreHorizontal,
};

export const DynamicFieldsPanel = ({ onInsertField, tipoContrato = 'locacao' }: DynamicFieldsPanelProps) => {
  const camposDinamicos = getCamposDinamicosByTipo(tipoContrato);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(camposDinamicos.map((g) => g.id));
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setExpandedGroups(camposDinamicos.map((group) => group.id));
  }, [camposDinamicos]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const filteredGroups = camposDinamicos.map(group => ({
    ...group,
    campos: group.campos.filter(campo =>
      campo.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campo.placeholder.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.campos.length > 0);

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Campos dinâmicos</h3>
        <p className="text-xs text-gray-500 mb-3">
          Clique em um campo para inserir no documento
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar campo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm rounded-lg border-gray-200 focus:border-orange-300 focus:ring-orange-100"
          />
        </div>
      </div>

      {/* Groups */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredGroups.map((group) => (
            <GroupSection
              key={group.id}
              group={group}
              isExpanded={expandedGroups.includes(group.id)}
              onToggle={() => toggleGroup(group.id)}
              onInsertField={onInsertField}
            />
          ))}

          {filteredGroups.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              Nenhum campo encontrado
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

interface GroupSectionProps {
  group: GrupoCamposDinamicos;
  isExpanded: boolean;
  onToggle: () => void;
  onInsertField: (placeholder: string) => void;
}

const GroupSection = ({ group, isExpanded, onToggle, onInsertField }: GroupSectionProps) => {
  const IconComponent = iconMap[group.icone] || FileText;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2.5 text-left',
          'bg-gray-50 hover:bg-gray-100 transition-colors',
          isExpanded && 'border-b border-gray-200'
        )}
      >
        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
          <IconComponent className="w-3.5 h-3.5 text-orange-600" />
        </div>
        <span className="flex-1 text-sm font-medium text-gray-800">{group.nome}</span>
        <span className="text-xs text-gray-400 mr-1">{group.campos.length}</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-2 space-y-1.5 bg-white">
          {group.campos.map((campo) => (
            <PlaceholderChip
              key={campo.id}
              label={campo.label}
              placeholder={campo.placeholder}
              onClick={() => onInsertField(campo.placeholder)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicFieldsPanel;
