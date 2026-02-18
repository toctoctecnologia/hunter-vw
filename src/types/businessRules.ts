export type RuleCategory =
  | 'parametros'
  | 'perfis'
  | 'equipes'
  | 'formularios'
  | 'tabelas-auxiliares';

export type RuleStatus = 'active' | 'inactive';

export type RuleValueType = 'text' | 'number' | 'boolean' | 'json' | 'list';

export type BusinessRuleCategoryId =
  | 'dados'
  | 'funil'
  | 'imoveis'
  | 'tabelas-auxiliares'
  | 'formularios'
  | 'perfis'
  | 'equipes'
  | 'automacoes'
  | 'webhooks';

export interface BusinessRuleCategory {
  id: BusinessRuleCategoryId;
  title: string;
  description: string;
  order?: number;
}

export type BusinessModuleType = 'Configuração' | 'Lista' | 'Intervalo' | 'Toggle' | 'Pontuação' | 'Integração';

export interface BusinessModule {
  moduleId: string;
  title: string;
  description: string;
  tags: string[];
  updatedAt: string;
  categoryId: BusinessRuleCategoryId;
  moduleType: BusinessModuleType;
  editable: boolean;
  updatedBy?: string;
  itemsCount?: number;
  badges?: string[];
}

export interface BusinessRule {
  ruleId: string;
  moduleId: string;
  title: string;
  description: string;
  category: RuleCategory;
  status: RuleStatus;
  valueType: RuleValueType;
  value: string | number | boolean | string[] | Record<string, unknown>;
  editable: boolean;
  updatedAt: string;
  tags: string[];
  entities?: string[];
}

export type EntityType = 'profile' | 'team' | 'form' | 'lookup-table';

export interface BusinessEntity {
  entityId: string;
  type: EntityType;
  name: string;
  description: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
}
