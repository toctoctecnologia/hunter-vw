# [Nome da Página]

> Template padrão de documentação de página do Hunter V2

## 1. Objetivo
Descrição clara e concisa do propósito da página.

## 2. Rota
```
/rota-da-pagina
```

## 3. Permissões
- Quem pode acessar
- Quem pode editar
- Restrições especiais

## 4. Layout e Seções

### Header
- Título da página
- Breadcrumb (se aplicável)
- Ações principais (botões)

### Corpo
- Seção 1: Descrição
- Seção 2: Descrição
- ...

### Sidebar/Filtros (se aplicável)
- Filtros disponíveis

## 5. Componentes Utilizados
| Componente | Localização | Uso |
|------------|-------------|-----|
| `SearchBar` | `@/components/ui/SearchBar` | Busca principal |
| `FilterPanel` | `@/components/ui/FilterPanel` | Painel de filtros |
| ... | ... | ... |

## 6. Estados da Página

### Loading
- Skeleton da lista/conteúdo
- Shimmer nos cards

### Vazio (Empty State)
- Ilustração
- Mensagem: "Nenhum [item] encontrado"
- CTA: "Criar primeiro [item]"

### Erro
- Mensagem de erro amigável
- Botão "Tentar novamente"

### Sucesso
- Dados carregados
- Interações habilitadas

## 7. Regras de Negócio
1. Regra 1: Descrição
2. Regra 2: Descrição
3. ...

## 8. Eventos e Ações
| Ação | Trigger | Resultado |
|------|---------|-----------|
| Criar | Botão "Novo" | Abre modal/navega |
| Editar | Clique no item | Abre modal/navega |
| Excluir | Menu "..." | Confirmação + exclusão |
| Filtrar | Seleção de filtro | Atualiza lista |
| Buscar | Input de busca | Filtra em tempo real |

## 9. Contratos de Dados

### Entidade Principal
```typescript
interface NomeDaEntidade {
  id: string;
  // campos...
}
```

### Campos Essenciais (obrigatórios para exibição)
- `id`: Identificador único
- `name`: Nome/título para exibição
- ...

### Campos Opcionais
- `description`: Descrição adicional
- ...

## 10. Mocks

### Arquivo de Mock
```
src/mocks/[dominio].ts
```

### Flag de Ativação
```typescript
USE_MOCK_[DOMINIO] = true
```

### Quantidade Mínima de Itens Mock
- X itens com dados completos
- Y itens com dados mínimos
- Z itens em estados especiais (vazio, erro, etc.)

## 11. Pontos de Troca para API

### Provider
```
src/modules/[dominio]/data/[dominio]Provider.ts
```

### Funções a Trocar
| Função | Mock Atual | API Real |
|--------|------------|----------|
| `list()` | `mockData.filter()` | `GET /api/[dominio]` |
| `getById(id)` | `mockData.find()` | `GET /api/[dominio]/:id` |
| `create(data)` | `mockData.push()` | `POST /api/[dominio]` |
| `update(id, data)` | `Object.assign()` | `PUT /api/[dominio]/:id` |
| `delete(id)` | `mockData.filter()` | `DELETE /api/[dominio]/:id` |

### O que NÃO deve mudar na troca
- Layout dos componentes
- Lógica de filtros no frontend
- Estados de loading/erro/vazio
- Navegação entre páginas

## 12. Dependências
- Outras páginas que linkam para esta
- Páginas para onde esta navega
- Módulos compartilhados

## 13. Testes Manuais Sugeridos
1. [ ] Carregar página com dados
2. [ ] Carregar página vazia
3. [ ] Simular erro de API
4. [ ] Criar novo item
5. [ ] Editar item existente
6. [ ] Excluir item
7. [ ] Filtrar lista
8. [ ] Buscar por termo
9. [ ] Navegar para detalhe
10. [ ] Testar em tema claro
11. [ ] Testar em tema escuro
12. [ ] Testar em mobile
