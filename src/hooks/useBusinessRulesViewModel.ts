import { useMemo, useState } from 'react';
import modulesData from '@/mocks/business-rules/modules';
import categoriesData from '@/mocks/business-rules/categories';
import rulesData from '@/mocks/business-rules/rules';
import entitiesData from '@/mocks/business-rules/entities';
import type {
  BusinessEntity,
  BusinessModule,
  BusinessModuleType,
  BusinessRule,
  BusinessRuleCategoryId,
  BusinessRuleCategory,
  RuleCategory,
  RuleStatus,
  RuleValueType,
} from '@/types/businessRules';

export interface EditableRule extends BusinessRule {
  pendingValue: BusinessRule['value'];
  pendingTitle: string;
  pendingDescription: string;
  pendingStatus: RuleStatus;
  pendingTags: string[];
  pendingEntities?: string[];
}

export interface BusinessRulesViewModel {
  modules: BusinessModule[];
  filteredModules: BusinessModule[];
  rulesByModule: Record<string, EditableRule[]>;
  entities: BusinessEntity[];
  categories: BusinessRuleCategory[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: BusinessRuleCategoryId | 'all';
  setCategoryFilter: (value: BusinessRuleCategoryId | 'all') => void;
  typeFilter: BusinessModuleType | 'all';
  setTypeFilter: (value: BusinessModuleType | 'all') => void;
  editableFilter: 'all' | 'editable' | 'readonly';
  setEditableFilter: (value: 'all' | 'editable' | 'readonly') => void;
  updateRule: (moduleId: string, ruleId: string, updater: (rule: EditableRule) => EditableRule) => void;
  addRule: (moduleId: string, category: RuleCategory) => void;
  removeRule: (moduleId: string, ruleId: string) => void;
}

const cloneRules = (rules: BusinessRule[]): EditableRule[] =>
  rules.map(rule => ({
    ...rule,
    pendingValue: rule.value,
    pendingTitle: rule.title,
    pendingDescription: rule.description,
    pendingStatus: rule.status,
    pendingTags: [...rule.tags],
    pendingEntities: rule.entities ? [...rule.entities] : [],
  }));

export function useBusinessRulesViewModel(): BusinessRulesViewModel {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<BusinessRuleCategoryId | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<BusinessModuleType | 'all'>('all');
  const [editableFilter, setEditableFilter] = useState<'all' | 'editable' | 'readonly'>('all');
  const [rules, setRules] = useState<Record<string, EditableRule[]>>(() => {
    const grouped: Record<string, EditableRule[]> = {};
    modulesData.forEach(module => {
      grouped[module.moduleId] = cloneRules(rulesData.filter(rule => rule.moduleId === module.moduleId));
    });
    return grouped;
  });

  const modules = useMemo(() => modulesData, []);
  const categories = useMemo(
    () => [...categoriesData].sort((a, b) => (a.order || 0) - (b.order || 0)),
    []
  );
  const entities = useMemo(() => entitiesData, []);

  const moduleMatchesTerm = (module: BusinessModule) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      module.title.toLowerCase().includes(term) ||
      module.description.toLowerCase().includes(term) ||
      module.tags.some(tag => tag.toLowerCase().includes(term))
    );
  };

  const ruleMatchesTerm = (module: BusinessModule, rule: EditableRule) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const inRule =
      rule.title.toLowerCase().includes(term) ||
      rule.description.toLowerCase().includes(term) ||
      rule.tags.some(tag => tag.toLowerCase().includes(term)) ||
      (rule.entities || []).some(entityId => entityId.toLowerCase().includes(term));

    return inRule || moduleMatchesTerm(module);
  };

  const filteredRules = useMemo(() => {
    const next: Record<string, EditableRule[]> = {};
    modules.forEach(module => {
      const moduleRules = rules[module.moduleId] || [];
      const matching = moduleRules.filter(rule => ruleMatchesTerm(module, rule));
      if (matching.length > 0 || !searchTerm.trim()) {
        next[module.moduleId] = matching;
      }
    });
    return next;
  }, [modules, rules, searchTerm]);

  const filteredModules = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return modules.filter(module => {
      const matchesCategory = categoryFilter === 'all' || module.categoryId === categoryFilter;
      const matchesType = typeFilter === 'all' || module.moduleType === typeFilter;
      const matchesEditable =
        editableFilter === 'all' ? true : editableFilter === 'editable' ? module.editable : !module.editable;

      const moduleMatches = !term || moduleMatchesTerm(module);
      const rulesMatch = (filteredRules[module.moduleId] || []).length > 0;

      const hasTermMatch = term ? moduleMatches || rulesMatch : true;
      return matchesCategory && matchesType && matchesEditable && hasTermMatch;
    });
  }, [modules, categoryFilter, typeFilter, editableFilter, filteredRules, searchTerm]);

  const updateRule = (moduleId: string, ruleId: string, updater: (rule: EditableRule) => EditableRule) => {
    setRules(prev => ({
      ...prev,
      [moduleId]: (prev[moduleId] || []).map(rule => (rule.ruleId === ruleId ? updater(rule) : rule)),
    }));
  };

  const addRule = (moduleId: string, category: RuleCategory) => {
    const newRule: EditableRule = {
      ruleId: `${moduleId}-${Date.now()}`,
      moduleId,
      title: 'Nova regra',
      description: 'Descrição da nova regra',
      category,
      status: 'active',
      valueType: 'text',
      value: '',
      editable: true,
      updatedAt: new Date().toISOString(),
      tags: [],
      pendingValue: '',
      pendingTitle: 'Nova regra',
      pendingDescription: 'Descrição da nova regra',
      pendingStatus: 'active',
      pendingTags: [],
      pendingEntities: [],
    };

    setRules(prev => ({
      ...prev,
      [moduleId]: [newRule, ...(prev[moduleId] || [])],
    }));
  };

  const removeRule = (moduleId: string, ruleId: string) => {
    setRules(prev => ({
      ...prev,
      [moduleId]: (prev[moduleId] || []).filter(rule => rule.ruleId !== ruleId),
    }));
  };

  return {
    modules,
    filteredModules,
    rulesByModule: filteredRules,
    entities,
    categories,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    editableFilter,
    setEditableFilter,
    updateRule,
    addRule,
    removeRule,
  };
}

export default useBusinessRulesViewModel;
