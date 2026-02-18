# Hunter V2 - Sitemap Completo

> Mapa de todas as rotas e módulos do sistema Hunter V2

## Visão Geral dos Módulos

| Módulo | Descrição | Rota Base |
|--------|-----------|-----------|
| Home/Dashboard | Painel principal com métricas | `/` |
| Vendas | Leads e Negociações | `/vendas` |
| Leads | Gestão detalhada de leads | `/leads` |
| Agenda | Tarefas e Calendário | `/agenda` |
| Imóveis | Listagem de imóveis | `/imoveis` |
| Gestão de Imóveis | Administração de carteira | `/gestao-imoveis` |
| Gestão de Locação | Contratos, Faturas, Repasses | `/gestao-locacao` |
| Portais Externos | Portais de acesso para proprietários e locatários | `/apps/portal-proprietarios` |
| Distribuição | Filas e Roletão | `/distribuicao` |
| Usuários | Gestão de usuários | `/usuarios` |
| Gestão de Acessos | Permissões e Papéis | `/gestao-acessos` |
| Gestão Roletão | Configuração de distribuição | `/gestao-roletao` |
| Relatórios | Dashboards e Exportação | `/gestao-relatorios` |
| Automações | Regras automáticas | `/automacoes` |

---

## Rotas Detalhadas

### 1. Autenticação
| Rota | Página | Permissão |
|------|--------|-----------|
| `/auth` | Login | Público |
| `/onboarding/cadastro` | Criar Conta | Público |

### 2. Home / Dashboard
| Rota | Página | Objetivo | Dependências |
|------|--------|----------|--------------|
| `/` | Home | Dashboard principal com KPIs, tarefas do dia, leads recentes | User, Tasks, Leads |
| `/dashboard` | Dashboard | Alias para Home | User, Tasks, Leads |

### 3. Vendas
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/vendas` | Vendas | Lista de leads e negociações com funil | Filtrar, Buscar, Criar Lead |
| `/vendas/comissoes` | Comissões | Gestão de comissões de vendas | Ver, Calcular |

### 4. Leads
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/leads` | Lista de Leads | Listagem completa de leads | Filtrar, Buscar, Criar |
| `/leads/lista` | Lista Detalhada | Visão em lista expandida | Filtrar, Ordenar |
| `/leads/dashboard` | Dashboard Leads | Métricas e funil de leads | Analisar |
| `/lead-vendas/:id` | Detalhe do Lead | Visão completa do lead com abas | Editar, Tarefas, Negócios, Arquivar |

### 5. Agenda
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/agenda` | Agenda | Tarefas e Calendário (tabs) | Criar, Editar, Concluir, Filtrar |
| `/agenda?tab=tasks` | Tarefas | Lista de tarefas | CRUD Tarefas |
| `/agenda?tab=calendar` | Calendário | Visão calendário | Agendar, Mover |
| `/agenda/agendar` | Nova Tarefa | Criar evento/tarefa | Salvar |
| `/agenda/novo` | Nova Tarefa | Alias | Salvar |

### 6. Imóveis
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/imoveis` | Lista de Imóveis | Catálogo de imóveis | Buscar, Filtrar, Ver Detalhes |
| `/property/:id` | Detalhe do Imóvel | Ficha completa do imóvel | Editar, Compartilhar |

### 7. Gestão de Imóveis
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/gestao-imoveis` | Dashboard Imóveis | Visão gerencial da carteira | Filtrar por etapa, Buscar |
| `/gestao-imoveis?tab=equipe` | Equipes | Gestão de equipes | Criar, Editar |
| `/gestao-imoveis?tab=condominios` | Condomínios | Lista de condomínios | CRUD |
| `/gestao-imoveis/equipe/novo` | Nova Equipe | Criar equipe | Salvar |
| `/gestao-imoveis/equipe/:id` | Detalhe Equipe | Ver equipe | Editar, Ver membros |
| `/gestao-imoveis/equipe/:id/performance` | Performance | Métricas da equipe | Analisar |
| `/condominios/novo` | Novo Condomínio | Cadastrar condomínio | Salvar |
| `/condominios/:id/editar` | Editar Condomínio | Editar condomínio | Salvar |

### 8. Gestão de Locação (Aluguéis)
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/gestao-locacao` | Dashboard Locação | Visão geral de locação | Navegar |
| `/gestao-locacao/contratos` | Contratos | Lista de contratos | Criar, Editar, Ver |
| `/gestao-locacao/contratos/:id` | Detalhe Contrato | Contrato completo | Editar, Renovar |
| `/gestao-locacao/faturas` | Faturas | Gestão de faturas | Criar, Pagar, Exportar |
| `/gestao-locacao/faturas/nova` | Nova Fatura | Criar fatura | Salvar |
| `/gestao-locacao/faturas/:id` | Detalhe Fatura | Ver fatura | Editar, Baixar PDF |
| `/gestao-locacao/repasses` | Repasses | Repasses a proprietários | Calcular, Pagar |
| `/gestao-locacao/repasses/:id` | Detalhe Repasse | Ver repasse | Confirmar |
| `/gestao-locacao/analises` | Análises | Análise de crédito | Aprovar, Reprovar |
| `/gestao-locacao/regua-cobranca` | Agenda de cobrança | Configurar cobranças | Editar regras |
| `/gestao-locacao/reajustes` | Reajustes | Gestão de reajustes | Calcular, Aplicar |
| `/gestao-locacao/seguros` | Seguros | Seguros de locação | Ver, Renovar |
| `/gestao-locacao/padroes-contrato` | Padrões de Contrato | Templates | Criar, Editar |
| `/gestao-locacao/dimob` | DIMOB | Declaração DIMOB | Gerar, Exportar |

### 9. Portais Externos
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/apps/portal-proprietarios` | Portal do Proprietário | Login e dashboard do proprietário | Entrar, Gerenciar imóveis |
| `/apps/portal-locatarios` | Portal do Locatário | Login e dashboard do locatário | Entrar, Pagar, Solicitar |

### 10. Distribuição
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/distribuicao` | Dashboard Distribuição | Visão geral das filas | Navegar |
| `/distribuicao?tab=filas` | Filas | Gestão de filas | Criar, Editar |
| `/distribuicao?tab=auditoria` | Auditoria | Log de distribuições | Filtrar, Exportar |
| `/distribuicao?tab=captacoes` | Captações | Leads captados | Ver, Atribuir |
| `/distribuicao?tab=cadencia` | Cadência | Regras de cadência | Configurar |
| `/distribuicao?tab=acoes` | Ações | Ações de check-in | Ver, Criar |
| `/distribuicao/acoes/nova` | Nova Ação | Criar ação check-in | Salvar |
| `/distribuicao/acoes/:id` | Detalhe Ação | Ver ação | Editar |
| `/distribuicao/acoes/:id/historico` | Histórico Ação | Log da ação | Analisar |
| `/distribuicao/redistribuicao` | Redistribuição | Redistribuir leads | Mover leads |
| `/distribuicao/:id` | Config Fila | Configurar fila específica | Editar regras |

### 11. Usuários
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/usuarios` | Lista de Usuários | Todos os usuários | Criar, Editar, Desativar |
| `/usuarios/:id` | Detalhe Usuário | Perfil do usuário | Editar, Ver performance |

### 11. Gestão e Configurações
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/gestao-acessos` | Gestão de Acessos | Permissões e papéis | Criar papel, Atribuir |
| `/gestao-roletao` | Gestão Roletão | Config de roletão | Editar regras |
| `/gestao-relatorios` | Relatórios | Dashboards e exports | Gerar, Exportar |
| `/indicadores` | Indicadores | KPIs de gestão | Analisar |

### 12. Automações
| Rota | Página | Objetivo | Ações |
|------|--------|----------|-------|
| `/automacoes` | Automações | Lista de automações | Criar, Ativar/Desativar |
| `/automacoes/recebimento` | Automação Recebimento | Config de recebimento | Editar |

### 13. Outros
| Rota | Página | Objetivo |
|------|--------|----------|
| `/perfil` | Perfil | Dados do usuário logado |
| `/configuracoes` | Configurações | Preferências do sistema |
| `/notificacoes` | Notificações | Central de notificações |
| `/suporte` | Suporte | Ajuda e documentação |
| `/pagamentos` | Pagamentos | Gestão de billing |
| `/billing` | Billing | Alias para Pagamentos |

---

## Navegação Principal

### Desktop (Sidebar)
1. Dashboard
2. Vendas (Leads/Negociações)
3. Agenda
4. Imóveis
5. Gestão de Imóveis
6. Gestão de Locação
7. Distribuição
8. Usuários
9. Relatórios
10. Configurações

### Mobile (Bottom Bar)
1. Home
2. Vendas
3. + (Ação rápida)
4. Agenda
5. Menu (drawer com demais opções)

---

## Permissões por Rota

| Permissão | Rotas Permitidas |
|-----------|------------------|
| `user` | Home, Vendas, Leads, Agenda, Imóveis, Perfil |
| `broker` | + Gestão de Imóveis, Distribuição (própria fila) |
| `manager` | + Usuários da equipe, Relatórios da equipe |
| `admin` | + Gestão de Acessos, Roletão, Todos os usuários |
| `superadmin` | Acesso total |

---

## Deep Links e Navegação

### Lead -> Negociação
- `/lead-vendas/:id?tab=negocios` -> Aba de negócios do lead

### Tarefa -> Lead
- Clicar em tarefa com `leadId` navega para `/lead-vendas/:leadId`

### Imóvel -> Propostas
- `/gestao-imoveis?stage=proposta` -> Filtrar imóveis com propostas ativas
