# Relatório de Movimentações

## Componentes
- `ErrorBoundary` movido para `components/common`
- Layout e navegação movidos para `components/shell`
- Componentes móveis reagrupados:
  - Home: `HomeTab`, `GestaoTab`, `LoginScreen`
  - Agenda: pasta `agenda/` e relacionados (`ServicosTab`, `ScheduleActivityModal`)
  - Vendas: pasta `vendas/` com antigos componentes de `lead`, `funnel` e modais de vendas
  - Imóveis: pasta `imoveis/` com tabs e seções de cadastro/atualização
  - Perfil: pasta `perfil/` com `LayoutPerfil`, `ConfiguracoesTab` e modais de perfil
- Layouts e navegação antigos mantidos como shims para remoção futura

## Hooks
- `useLeads` → `useLead` em `hooks/vendas`
- `useLeadSync` → `hooks/vendas`
- `useInterestedProperties` movido para `hooks/imoveis`
- `usePushNotifications` movido para `hooks/perfil`
- Adicionados barrels (`index.ts`) em todas as pastas de hooks

## Shims
Reexports criados nos caminhos antigos para compatibilidade temporária.

## Rotas
- Adicionadas páginas `/about`, `/contact` e `/funnel` com fundo branco e rotas registradas em `AppRoutes.tsx`.
- Validadas rotas com contêiner `bg-white`:
  - `/` utilizando `ResponsiveLayout`.
  - `/agendar-servicos` ajustada para `bg-white`.
  - `/agenda/agendar` corrigida a partir de `/agendar-agenda`.
- Pendências: revisar demais rotas do checklist.

## Cache
- Invalidação do cache de eventos do React Query após criar ou editar eventos para refletir imediatamente mudanças de cor.
