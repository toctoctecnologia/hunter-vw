# Arquitetura alvo do frontend em Vite

## 1) Estrutura de pastas proposta

A estrutura abaixo organiza a aplicação por responsabilidade (app shell, rotas, domínio e compartilháveis), reduz acoplamento entre módulos e facilita migração incremental do padrão atual (`src/app/**`) para um modelo mais explícito em React Router.

```text
src/
  app/
    providers/
      query-client-provider.tsx
      theme-provider.tsx
      auth-provider.tsx
    router/
      index.tsx
      guards/
        auth-guard.tsx
        role-guard.tsx
    layouts/
      dashboard-layout.tsx
      sadm-dashboard-layout.tsx
      public-layout.tsx
    bootstrap/
      main.tsx

  pages/
    auth/
      login-page.tsx
      register-page.tsx
      forgot-password-page.tsx
      reset-password-page.tsx
      confirm-informations-page.tsx
      finish-register-page.tsx
      sign-up-success-page.tsx
      error-page.tsx
      mobile-confirm-page.tsx
      mobile-success-page.tsx
    dashboard/
      dashboard-home-page.tsx
      sales-page.tsx
      sale-details-page.tsx
      calendar-page.tsx
      properties-page.tsx
      property-detail-page.tsx
      property-update-page.tsx
      users-page.tsx
      user-detail-page.tsx
      distribution-page.tsx
      queue-detail-page.tsx
      sale-action-page.tsx
      access-control-page.tsx
      manage-rotary-leads-page.tsx
      manage-api-page.tsx
      payments-page.tsx
      manage-reports-page.tsx
      manage-reports-files-page.tsx
      manage-properties-page.tsx
      manage-condominiums-page.tsx
      condominium-detail-page.tsx
      manage-leads-page.tsx
      notifications-page.tsx
      profile-page.tsx
      whatsapp-setup-page.tsx
    sadm/
      sadm-dashboard-page.tsx
      sadm-clients-page.tsx
      sadm-access-control-page.tsx
      sadm-plans-control-page.tsx
      sadm-manage-notifications-page.tsx
      sadm-notification-reminders-page.tsx
      sadm-notifications-page.tsx
      sadm-profile-page.tsx
    public/
      check-in-page.tsx
      remove-account-page.tsx
    common/
      payment-confirm-page.tsx
      privacy-policy-page.tsx
      unauthorized-page.tsx
      not-found-page.tsx

  features/
    auth/
      api/
      hooks/
      components/
      model/
    sales/
      api/
      hooks/
      components/
      model/
    properties/
      api/
      hooks/
      components/
      model/
    notifications/
      ...
    payments/
      ...

  shared/
    api/
      http-client.ts
      endpoints.ts
    config/
      env.ts
      runtime-flags.ts
    auth/
      token-storage.ts
      session.ts
    ui/
      components/
      layouts/
    hooks/
    lib/
    types/
    utils/
```

### Regras práticas

- `src/app`: composição global (providers, roteador, layouts, guards).
- `src/pages`: entrypoints de rota (componentes de página sem regra de negócio pesada).
- `src/features`: regra de negócio por domínio (API, hooks, componentes e estado do domínio).
- `src/shared`: infraestrutura e código reutilizável transversal.

---

## 2) Estratégia de roteamento (React Router) equivalente às rotas atuais

A estratégia recomendada é usar `createBrowserRouter` + `createRoutesFromElements` (ou objeto de rotas), preservando os mesmos caminhos já existentes para evitar quebra de deep-links e bookmarks.

### Mapa de rotas alvo (equivalente ao estado atual)

#### Auth
- `/` (login)
- `/auth/register`
- `/auth/forgot-password`
- `/auth/finish-register`
- `/auth/error`
- `/auth/reset-password`
- `/auth/confirm-informations`
- `/auth/sign-up-success`
- `/auth/mobile/confirm`
- `/auth/mobile/success`

#### Dashboard (protegido)
- `/dashboard`
- `/dashboard/sales`
- `/dashboard/sales/:uuid/details`
- `/dashboard/calendar`
- `/dashboard/properties`
- `/dashboard/properties/:uuid/detail`
- `/dashboard/properties/:uuid/update`
- `/dashboard/users`
- `/dashboard/users/:uuid`
- `/dashboard/distribution`
- `/dashboard/distribution/queue/:queueId`
- `/dashboard/distribution/sale-action/:actionId`
- `/dashboard/access-control`
- `/dashboard/manage-rotary-leads`
- `/dashboard/manage-api`
- `/dashboard/payments`
- `/dashboard/manage-reports`
- `/dashboard/manage-reports/files`
- `/dashboard/manage-properties`
- `/dashboard/manage-condominiums`
- `/dashboard/manage-condominiums/condominium/:uuid`
- `/dashboard/manage-leads`
- `/dashboard/notifications`
- `/dashboard/profile`
- `/dashboard/whatsapp/setup`

#### SADM (protegido)
- `/sadm-dashboard`
- `/sadm-dashboard/clients`
- `/sadm-dashboard/access-control`
- `/sadm-dashboard/plans-control`
- `/sadm-dashboard/manage-notifications`
- `/sadm-dashboard/notification-reminders`
- `/sadm-dashboard/notifications`
- `/sadm-dashboard/profile`

#### Público e utilitárias
- `/public/check-in`
- `/public/remove-account`
- `/payment/confirm`
- `/privacy-policy`
- `/unauthorized`
- `*` (not-found)

### Diretrizes de implementação

- Definir **guards por branch de rota**:
  - `AuthGuard` para `/dashboard/**` e `/sadm-dashboard/**`.
  - `RoleGuard` para distinções de permissões (ex.: SADM vs usuário padrão).
- Manter **layouts aninhados** (`<Outlet />`) para dashboard, sadm e público.
- Usar `lazy()` + `Suspense` por página para code-splitting, como já ocorre hoje.
- Centralizar rotas em `src/app/router/index.tsx`, removendo dependência do padrão filesystem do Next.

---

## 3) Política de estado (React Query + estado local/global)

### Fonte de verdade de dados remotos

- **React Query é obrigatório para dados de servidor** (leitura e mutação).
- Definir `queryKey` padronizada por domínio (`['sales', filters]`, `['properties', id]`, etc.).
- Invalidar cache com granularidade por recurso após mutações.
- Aplicar `staleTime`/`gcTime` por criticidade:
  - telas operacionais em tempo real: `staleTime` baixo;
  - dados estáveis (catálogos): `staleTime` maior.

### Estado local (UI)

- Usar `useState`/`useReducer` para estado efêmero de tela (modal aberto, tab selecionada, filtro local, paginação visual).
- Não duplicar no React Query estados puramente visuais.

### Estado global (somente quando necessário)

- Manter global apenas para contexto transversal:
  - sessão/autenticação do usuário;
  - tema/preferências globais;
  - feature flags de frontend.
- Se houver necessidade de store, priorizar solução leve (Context + reducer ou Zustand), com fronteira clara para não substituir React Query.

### Tratamento de erro e observabilidade

- Preservar pipeline de erro centralizado (cache de query/mutation emitindo erro global).
- Padronizar estrutura de erro de API (`title`, `messages`, `code`) para feedback consistente no UI.

---

## 4) Convenções de ambiente

Todas as variáveis de frontend devem usar prefixo `VITE_`, ser tipadas em `vite-env.d.ts` e validadas no bootstrap (`shared/config/env.ts`).

### Variáveis obrigatórias

- `VITE_API_URL`: base da API principal.
- `VITE_SUPABASE_URL`: URL do projeto Supabase.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: chave pública (anon) do Supabase.
- `VITE_SITE_URL`: URL pública do frontend (links de callback/redirecionamento).

### Variáveis opcionais por feature

- `VITE_WS_URL`: endpoint websocket/realtime.
- `VITE_FACEBOOK_APP_ID`: integração Meta/WhatsApp Embedded Signup.
- `VITE_WHATSAPP_CONFIG_ID`: ID de configuração do WhatsApp.

### Padrão de arquivos

- `.env.example`: somente chaves (sem segredos reais), com comentários de uso.
- `.env.development`, `.env.staging`, `.env.production`: valores por ambiente (injetados no pipeline).
- Nunca commitar segredos operacionais fora do mecanismo de secret do CI/CD.

### Normalização

- Não acessar `import.meta.env` diretamente em features: usar wrapper `shared/config/env.ts`.
- Falha de variável obrigatória deve abortar inicialização em dev/staging com mensagem explícita.

---

## 5) Estratégia de autenticação e persistência

### Provedor de autenticação

- Manter Supabase Auth no frontend para obtenção/renovação de sessão.
- API principal continua sendo consumida com `Authorization: Bearer <access_token>` via interceptor HTTP.

### Persistência de sessão

- Sessão primária: mantida pelo client do Supabase (persistência local do SDK).
- Dados complementares de sessão (perfil resumido/claims derivadas): cache em React Query e/ou contexto de auth.
- Evitar persistir dados sensíveis adicionais em `localStorage` manualmente.

### Política de armazenamento

- **Preferência**: tokens de integração de terceiros permanecem no backend quando envolverem segredo.
- `localStorage/sessionStorage` no frontend apenas para:
  - estado de UX não sensível;
  - tokens de integrações explicitamente client-side e de baixo risco, com expiração controlada.
- Cookies no frontend apenas para preferências não sensíveis (ex.: estado de sidebar).

### Fluxo de proteção de rotas

- Guard client-side valida sessão antes de renderizar áreas protegidas.
- Sem sessão: redirecionar para `/` (login), preservando destino pretendido (`returnTo`) quando aplicável.
- Sem permissão: redirecionar para `/unauthorized`.

### Logout e revogação

- Logout deve:
  1. chamar `supabase.auth.signOut()`;
  2. limpar caches do React Query (`queryClient.clear()` ou invalidação ampla);
  3. limpar estados globais de sessão;
  4. remover artefatos locais não essenciais;
  5. redirecionar para login.

### OAuth e callbacks

- Fluxos OAuth com `client_secret`, validação de `state` e troca de `code` por token devem permanecer server-side (BFF/API), não no bundle do Vite.
- Frontend recebe apenas resultado final da autenticação/integração, sem acesso a segredos.
