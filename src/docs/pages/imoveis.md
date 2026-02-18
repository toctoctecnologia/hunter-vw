# Imóveis

> Catálogo e listagem de imóveis disponíveis

## 1. Objetivo
Exibir o catálogo de imóveis com busca, filtros e acesso aos detalhes de cada imóvel.

## 2. Rotas
```
/imoveis - Lista de imóveis
/property/:id - Detalhe do imóvel
```

## 3. Permissões
- **Corretor**: Todos os imóveis (visualização)
- **Gestor**: Todos os imóveis + métricas
- **Admin**: Todos os imóveis + edição

## 4. Layout e Seções

### Lista (/imoveis)

#### Header
- Título: "Imóveis"
- Botão: "+ Novo Imóvel" (se permitido)

#### Filtros
- SearchBar (código, título, endereço)
- Tipo (apartamento, casa, comercial)
- Cidade/Bairro
- Faixa de preço
- Quartos, vagas
- Status (ativo, vendido, locado)

#### Grid/Lista
- Cards de imóvel com foto
- Informações: Código, Preço, Área, Quartos
- Badge de status

### Detalhe (/property/:id)

#### Galeria
- Carrossel de fotos
- Vídeo (se houver)

#### Informações
- Dados básicos
- Características
- Localização (mapa)
- Valores

#### Ações
- Compartilhar
- Agendar visita
- Ver propostas

## 5. Componentes Utilizados
| Componente | Localização | Uso |
|------------|-------------|-----|
| `PropertyCard` | `@/components/imoveis/PropertyCard` | Card na lista |
| `PropertyDetail` | `@/components/imoveis/PropertyDetail` | Página detalhe |
| `PropertyGallery` | `@/components/imoveis/PropertyGallery` | Galeria de fotos |
| `PropertyFilters` | `@/components/imoveis/PropertyFilters` | Painel de filtros |

## 6. Estados

### Lista
- **Loading**: Skeleton de cards
- **Vazio**: "Nenhum imóvel encontrado" + sugestão de ajustar filtros
- **Erro**: Mensagem + Retry

### Detalhe
- **Loading**: Skeleton de página
- **Erro**: "Imóvel não encontrado"

## 7. Regras de Negócio
1. Imóvel vendido/locado não aparece na busca padrão
2. Preço pode ser ocultado ("Sob consulta")
3. Imóvel exclusivo tem badge especial
4. Fotos são ordenadas por relevância
5. Compartilhamento gera link público

## 8. Eventos e Ações

### Lista
| Ação | Trigger | Resultado |
|------|---------|-----------|
| Buscar | Input de busca | Filtra lista |
| Filtrar | Seleção de filtro | Atualiza grid |
| Ver detalhes | Clique no card | Navega para detalhe |

### Detalhe
| Ação | Trigger | Resultado |
|------|---------|-----------|
| Compartilhar | Botão | Copia link / Share sheet |
| Agendar visita | Botão | Abre form de agendamento |
| Ver no mapa | Tab mapa | Exibe localização |

## 9. Contratos de Dados

### Property
```typescript
interface Property {
  id: string;
  code: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  priceVisible: boolean;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  address: Address;
  description?: string;
  features: string[];
  images: PropertyImage[];
  createdAt: string;
  updatedAt: string;
}

type PropertyType = 'apartment' | 'house' | 'commercial' | 'land' | 'other';
type PropertyStatus = 'active' | 'sold' | 'rented' | 'inactive';

interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  lat?: number;
  lng?: number;
}

interface PropertyImage {
  id: string;
  url: string;
  order: number;
  caption?: string;
}
```

## 10. Mocks

### Arquivos
```
src/mocks/properties.ts
```

### Flag
```typescript
USE_MOCK_PROPERTIES = true
```

### Dados Mock
- 20 imóveis ativos
- 5 vendidos
- 3 inativos
- Variação de tipos e faixas de preço

## 11. Pontos de Troca para API

### Provider
```
src/modules/imoveis/data/propertiesProvider.ts
```

### Funções
| Função | Descrição |
|--------|-----------|
| `listProperties(filters)` | Lista com filtros |
| `getPropertyById(id)` | Detalhe completo |
| `searchProperties(query)` | Busca textual |

## 12. Dependências
- Módulo de Propostas (para ver propostas do imóvel)
- Módulo de Agenda (para agendar visitas)
