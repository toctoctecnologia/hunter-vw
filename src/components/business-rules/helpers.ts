import type { EditableRule } from '@/hooks/useBusinessRulesViewModel';

export const businessRuleValueLabel = (rule: EditableRule) => {
  switch (rule.valueType) {
    case 'boolean':
      return rule.value ? 'Ativo' : 'Inativo';
    case 'number':
      return rule.value.toString();
    case 'list':
      return Array.isArray(rule.value) ? `${rule.value.length} itens` : 'Lista';
    case 'json':
      return 'JSON estruturado';
    default:
      return typeof rule.value === 'string' ? rule.value : 'Texto';
  }
};

export const categoryLabels: Record<string, string> = {
  parametros: 'Parâmetros',
  perfis: 'Perfis',
  equipes: 'Equipes',
  formularios: 'Formulários',
  'tabelas-auxiliares': 'Tabelas auxiliares',
};
