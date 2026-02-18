import type { BusinessRuleCategory } from '@/types/businessRules';

export const businessRuleCategories: BusinessRuleCategory[] = [
  {
    id: 'dados',
    title: 'Dados',
    description: 'Parâmetros globais, avaliação e padrões operacionais.',
    order: 1,
  },
  {
    id: 'funil',
    title: 'Funil',
    description: 'Etapas, nomes, limites e regras do pipeline.',
    order: 2,
  },
  {
    id: 'imoveis',
    title: 'Imóveis',
    description: 'Cadastro, vitrine, visitas e publicação.',
    order: 3,
  },
  {
    id: 'tabelas-auxiliares',
    title: 'Tabelas auxiliares',
    description: 'Listas de apoio para cadastros e automações.',
    order: 4,
  },
  {
    id: 'formularios',
    title: 'Formulários',
    description: 'Formulários, campos e fluxos de preenchimento.',
    order: 5,
  },
  {
    id: 'perfis',
    title: 'Perfis',
    description: 'Perfis, visibilidade e permissões simples.',
    order: 6,
  },
  {
    id: 'equipes',
    title: 'Equipes',
    description: 'Times responsáveis por módulos e etapas.',
    order: 7,
  },
  {
    id: 'automacoes',
    title: 'Automações',
    description: 'Fluxos automáticos e acionamentos.',
    order: 8,
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    description: 'Envios, assinaturas e auditoria.',
    order: 9,
  },
];

export default businessRuleCategories;
