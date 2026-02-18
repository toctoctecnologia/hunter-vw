# Gestão de Imóveis

> Administração da carteira de imóveis com visão gerencial

## 1. Objetivo
Fornecer uma visão gerencial da carteira de imóveis, permitindo filtrar por etapa, gerenciar equipes, e acompanhar propostas ativas.

## 2. Rotas
```
/gestao-imoveis - Dashboard principal
/gestao-imoveis?tab=equipe - Gestão de equipes
/gestao-imoveis?tab=condominios - Condomínios
/gestao-imoveis?stage=proposta - Filtrado por etapa
/gestao-imoveis/equipe/novo - Criar equipe
/gestao-imoveis/equipe/:id - Detalhe da equipe
/gestao-imoveis/equipe/:id/performance - Performance
```

## 3. Permissões
- **Corretor**: Própria carteira
- **Gestor**: Carteira da equipe
- **Admin**: Todas as carteiras

## 4. Layout e Seções

### Header
- Título: "Gestão de Imóveis"
- Tabs: Imóveis | Equipes | Condomínios
- Dropdown de etapa (filtro principal)

### Filtros
- SearchBar (código, endereço)
- Dropdown de etapa (Captação, Avaliação, Ativo, Proposta, Vendido)
- Filtro por responsável
- Toggle: "Somente com proposta" / "Todos"

### Lista de Imóveis
- Cards com informações básicas
- Badge de etapa
- **Bloco de Proposta** (quando etapa = Proposta)
  - Valor da proposta
  - Status (Em análise, Negociação, Aprovada)
  - Data/hora
  - Descrição
  - Botão "Ver proposta"

### Seleção em Massa
- Checkbox circular no canto do card
- Contador de selecionados no topo
- Ações em massa (ex: mover etapa)

## 5. Componentes Utilizados
| Componente | Localização | Uso |
|------------|-------------|-----|
| `PropertyCard` | `@/components/imoveis/PropertyCard` | Card do imóvel |
| `PropertyProposalBlock` | `@/components/imoveis/PropertyProposalBlock` | Bloco de proposta |
| `StageDropdown` | `@/components/imoveis/StageDropdown` | Filtro de etapa |
| `MassSelectionBar` | `@/components/ui/MassSelectionBar` | Barra de seleção |

## 6. Estados

### Lista
- **Loading**: Skeleton de cards
- **Vazio**: "Nenhum imóvel nesta etapa"
- **Filtrado**: Mostra contador de resultados

### Bloco de Proposta
- **Com proposta**: Exibe bloco completo
- **Sem proposta**: Exibe "Sem proposta ativa" (quando mostrar todos)
- **Múltiplas propostas**: Exibe a principal + contador

## 7. Regras de Negócio
1. Etapa "Proposta" filtra imóveis com pelo menos uma proposta ativa
2. Proposta ativa = status não é "rejeitada" ou "expirada"
3. Descrição longa tem expand/collapse
4. Seleção em massa reseta ao mudar filtro
5. Clique em "Ver proposta" navega para negociação ou abre modal

## 8. Eventos e Ações
| Ação | Trigger | Resultado |
|------|---------|-----------|
| Filtrar por etapa | Dropdown | Atualiza lista |
| Toggle propostas | Switch | Filtra com/sem proposta |
| Ver proposta | Botão no bloco | Navega/abre modal |
| Selecionar imóvel | Checkbox | Adiciona à seleção |
| Ações em massa | Botão | Exibe opções |
| Editar imóvel | Botão "Editar ficha" | Abre edição |

## 9. Contratos de Dados

### PropertyWithProposal
```typescript
interface PropertyWithProposal {
  id: string;
  code: string;
  title: string;
  address: string;
  price: number;
  stage: PropertyStage;
  imageUrl?: string;
  proposals: Proposal[];
}

type PropertyStage = 
  | 'captacao'
  | 'avaliacao'
  | 'ativo'
  | 'proposta'
  | 'vendido'
  | 'locado';

interface Proposal {
  id: string;
  value: number;
  status: ProposalStatus;
  createdAt: string;
  description?: string;
  notes?: string;
  commission?: number;
  negotiationId?: string;
  leadId?: string;
  leadName?: string;
}

type ProposalStatus = 
  | 'em_analise'
  | 'em_negociacao'
  | 'reservado'
  | 'aprovada'
  | 'rejeitada'
  | 'expirada';
```

## 10. Mocks

### Arquivos
```
src/mocks/propertiesWithProposals.ts
```

### Flag
```typescript
USE_MOCK_PROPOSALS = true
```

### Dados Mock
- 6 imóveis no total
- 4 com proposta ativa
- 2 sem proposta
- 1 com múltiplas propostas

## 11. Pontos de Troca para API

### Provider
```
src/modules/imoveis/data/gestaoImoveisProvider.ts
```

### Funções
| Função | Descrição |
|--------|-----------|
| `listByStage(stage)` | Lista por etapa |
| `getPropertiesWithProposals()` | Imóveis com propostas |
| `moveStage(id, stage)` | Mover etapa |
| `massAction(ids, action)` | Ação em massa |

## 12. Dependências
- Módulo de Propostas/Negócios
- Módulo de Equipes
- Módulo de Condomínios
