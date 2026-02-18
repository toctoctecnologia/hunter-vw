# Leads

> Gestão detalhada de leads com listagem e dashboard

## 1. Objetivo
Fornecer uma visão completa de todos os leads do sistema, com filtros avançados, métricas e acesso rápido aos detalhes.

## 2. Rotas
```
/leads - Lista principal
/leads/lista - Lista expandida
/leads/dashboard - Dashboard de métricas
/lead-vendas/:id - Detalhe do lead
```

## 3. Permissões
- **Corretor**: Apenas seus leads
- **Gestor**: Leads da equipe
- **Admin**: Todos os leads

## 4. Layout e Seções

### Lista de Leads (/leads, /leads/lista)

#### Header
- Título: "Leads"
- Tabs: Lista | Dashboard
- Botão: "+ Novo Lead"

#### Barra de Filtros
- SearchBar (nome, telefone, email)
- Filtro por origem
- Filtro por etapa
- Filtro por data
- Filtro por corretor

#### Lista
- Cards de lead
- Informações: Nome, Telefone, Etapa, Data
- Ações: Ver, Editar, Arquivar

### Dashboard de Leads (/leads/dashboard)

#### Métricas
- Total de leads por período
- Taxa de conversão
- Tempo médio de resposta
- Leads por origem

#### Gráficos
- Funil de conversão
- Leads por mês
- Performance por corretor

### Detalhe do Lead (/lead-vendas/:id)

#### Header
- Nome do lead
- Status/Etapa atual
- Ações: Editar, Arquivar, Mais

#### Tabs
1. **Visão Geral**: Dados básicos, origem, interesse
2. **Atividades**: Timeline de interações
3. **Tarefas**: Tarefas vinculadas ao lead
4. **Negócios**: Propostas e negociações

## 5. Componentes Utilizados
| Componente | Localização | Uso |
|------------|-------------|-----|
| `LeadCard` | `@/components/leads/LeadCard` | Card na lista |
| `LeadDetail` | `@/components/leads/LeadDetail` | Página de detalhe |
| `ActivityTimeline` | `@/components/leads/ActivityTimeline` | Timeline |
| `ProposalBlock` | `@/components/deals/ProposalBlock` | Bloco de proposta |
| `LeadMetrics` | `@/components/leads/LeadMetrics` | Cards de KPI |

## 6. Estados

### Lista
- **Loading**: Skeleton cards
- **Vazio**: "Nenhum lead encontrado" + CTA
- **Erro**: Mensagem + Retry

### Detalhe
- **Loading**: Skeleton do perfil
- **Erro**: "Lead não encontrado"
- **Sucesso**: Dados completos

## 7. Regras de Negócio
1. Lead novo deve ser contatado em até 24h
2. Lead sem contato em 7 dias é marcado como "frio"
3. Arquivar lead requer motivo
4. Lead pode ter múltiplas propostas
5. Histórico de atividades é imutável

## 8. Eventos e Ações

### Lista
| Ação | Trigger | Resultado |
|------|---------|-----------|
| Criar lead | "+ Novo Lead" | Modal de criação |
| Ver detalhes | Clique no card | Navega para detalhe |
| Filtrar | Seleção de filtro | Atualiza lista |
| Exportar | Botão exportar | Download CSV |

### Detalhe
| Ação | Trigger | Resultado |
|------|---------|-----------|
| Editar | Botão editar | Modal de edição |
| Adicionar tarefa | "+ Tarefa" | Modal de tarefa |
| Registrar atividade | "+ Atividade" | Modal de atividade |
| Criar proposta | "+ Proposta" | Modal de proposta |
| Arquivar | Menu "..." | Confirmação + arquivar |

## 9. Contratos de Dados

### Lead (completo)
```typescript
interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  stage: LeadStage;
  interest?: string;
  value?: number;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
  firstContactAt?: string;
  lastContactAt?: string;
  archived: boolean;
  archivedReason?: string;
  origin?: LeadOrigin;
  activities?: Activity[];
  tasks?: Task[];
  deals?: Deal[];
}

interface LeadOrigin {
  source: string;
  campaign?: string;
  propertyType?: string;
  connectivity?: string;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'whatsapp' | 'visit' | 'note';
  description: string;
  createdAt: string;
  createdBy: string;
}
```

## 10. Mocks

### Arquivos
```
src/mocks/leads.ts
src/mocks/activities.ts
```

### Flag
```typescript
USE_MOCK_LEADS = true
```

### Dados Mock
- 30 leads variados
- 10 com atividades registradas
- 5 com propostas ativas
- 3 arquivados

## 11. Pontos de Troca para API

### Provider
```
src/modules/leads/data/leadsProvider.ts
```

### Funções
| Função | Descrição |
|--------|-----------|
| `listLeads(filters)` | Lista com paginação e filtros |
| `getLeadById(id)` | Detalhe completo |
| `createLead(data)` | Criar novo lead |
| `updateLead(id, data)` | Atualizar dados |
| `archiveLead(id, reason)` | Arquivar com motivo |
| `addActivity(leadId, activity)` | Registrar atividade |

## 12. Dependências
- Módulo de Tarefas
- Módulo de Propostas/Negócios
- Módulo de Usuários
