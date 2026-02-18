# Negociações (Vendas)

> Gestão do funil de vendas com leads e negociações

## 1. Objetivo
Centralizar a gestão de leads e negociações em um funil visual, permitindo acompanhar o progresso de cada oportunidade de venda.

## 2. Rota
```
/vendas
/vendas/comissoes (subpágina)
```

## 3. Permissões
- **Corretor**: Vê apenas seus leads
- **Gestor**: Vê leads da equipe
- **Admin**: Vê todos os leads

## 4. Layout e Seções

### Header
- Título: "Vendas"
- Tabs: Leads | Negociações | Comissões
- Botão: "+ Novo Lead"

### Barra de Filtros
- SearchBar (busca por nome, telefone, email)
- Filtro por etapa do funil
- Filtro por corretor (para gestores)
- Filtro por período
- Botão "Filtros" com painel expandido

### Lista/Funil
- Visão em lista (padrão mobile)
- Visão Kanban (desktop)
- Cards de lead com status visual

### Contador
- Total de leads por etapa
- Valor total em negociação

## 5. Componentes Utilizados
| Componente | Localização | Uso |
|------------|-------------|-----|
| `SearchBar` | `@/components/ui/SearchBar` | Busca |
| `FilterPanel` | `@/components/ui/FilterPanel` | Filtros avançados |
| `LeadCard` | `@/components/leads/LeadCard` | Card do lead |
| `FunnelKanban` | `@/components/vendas/FunnelKanban` | Visão Kanban |
| `StageCounter` | `@/components/vendas/StageCounter` | Contadores |

## 6. Estados da Página

### Loading
- Skeleton nos cards
- Shimmer no Kanban

### Vazio
- "Nenhum lead encontrado"
- CTA: "Criar primeiro lead"

### Erro
- "Erro ao carregar leads"
- Botão "Tentar novamente"

## 7. Regras de Negócio
1. Leads são organizados por etapa do funil (stages)
2. Mover lead entre etapas atualiza status automaticamente
3. Lead arquivado sai do funil principal
4. Negociação é criada quando lead avança para etapa de proposta
5. Comissão é calculada ao fechar negócio

## 8. Eventos e Ações
| Ação | Trigger | Resultado |
|------|---------|-----------|
| Criar lead | Botão "+ Novo Lead" | Abre modal de criação |
| Mover etapa | Drag & drop (Kanban) | Atualiza stage do lead |
| Ver detalhes | Clique no card | Navega para `/lead-vendas/:id` |
| Arquivar | Menu "..." | Move para arquivados |
| Filtrar | Seleção de filtro | Atualiza lista |

## 9. Contratos de Dados

### Lead (para listagem)
```typescript
interface LeadListItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  stage: LeadStage;
  value?: number;
  createdAt: string;
  lastContactAt?: string;
  ownerId: string;
  ownerName?: string;
}
```

### LeadStage
```typescript
type LeadStage = 
  | 'novo'
  | 'primeiro_contato'
  | 'qualificado'
  | 'visita_agendada'
  | 'proposta'
  | 'negociacao'
  | 'fechado'
  | 'perdido';
```

## 10. Mocks

### Arquivo de Mock
```
src/mocks/leads.ts
```

### Flag de Ativação
```typescript
USE_MOCK_LEADS = true
```

### Itens Mock
- 20 leads em diferentes etapas
- 5 leads com proposta ativa
- 3 leads arquivados
- 2 leads com múltiplas interações

## 11. Pontos de Troca para API

### Provider
```
src/modules/leads/data/leadsProvider.ts
```

### Funções
| Função | Mock | API |
|--------|------|-----|
| `listLeads(filters)` | `mockLeads.filter()` | `GET /api/leads` |
| `getLeadById(id)` | `mockLeads.find()` | `GET /api/leads/:id` |
| `createLead(data)` | `mockLeads.push()` | `POST /api/leads` |
| `updateLead(id, data)` | `Object.assign()` | `PUT /api/leads/:id` |
| `moveStage(id, stage)` | Atualiza mock | `PATCH /api/leads/:id/stage` |

## 12. Dependências
- Módulo de Leads
- Módulo de Propostas
- Módulo de Usuários (para filtro por corretor)
