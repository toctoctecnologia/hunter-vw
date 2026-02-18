# Mapeamento de chamadas cliente-servidor (estado atual e alvo)

## 1) Chamadas atuais via backend principal (`VITE_API_URL`)

A maior parte do app já usa `api` (`axios`) apontando para `VITE_API_URL`, com autenticação via bearer token do Supabase e refresh automático em 401.

Principais domínios consumidos:

- `dashboard/**` (leads, propriedades, agenda, distribuição, notificações, relatórios)
- `user/**` (perfil, sessões, convites)
- `subscription/**`, `account/**`, `payment/**`
- `dashboard/external/integration/**`

## 2) Chamadas legadas Next API (BFF embutido no frontend)

Antes desta alteração, ainda existiam chamadas dependentes de `src/app/api/**`:

- `GET /api/google/ads`
- `GET /api/meta/leads`
- `GET /api/google/oauth/start`
- `GET /api/meta/oauth/start`
- `GET /api/whatsapp/oauth/callback`

## 3) Equivalentes em backend dedicado (novo alvo)

As chamadas acima passam a apontar para backend dedicado (mesmo host-base de `VITE_API_URL`):

- `GET /integrations/google/ads`
- `GET /integrations/meta/leads`
- `GET /integrations/google/oauth/start`
- `GET /integrations/meta/oauth/start`
- `GET /integrations/whatsapp/oauth/callback`

## 4) Regras de transporte e segurança validadas no cliente

- CORS: requests passam com `withCredentials: true` no `axios` compartilhado.
- Auth header: `Authorization: Bearer <supabase_access_token>` injetado em interceptor.
- Sessão: enviado `x-session-expires-at` (epoch) para backend auditar validade da sessão.
- Timeout: `VITE_API_TIMEOUT_MS` (fallback 15s) aplicado globalmente.
- Erros: todas as chamadas feitas por `api` convergem para o formato `AppError`.

## 5) React Query (integrações migradas)

- Keys antigas:
  - `['google-ads-metrics']`
  - `['meta-leads-metrics']`
- Keys novas (namespaced):
  - `['integrations', 'google-ads', 'metrics']`
  - `['integrations', 'meta-leads', 'metrics']`
- Política:
  - `staleTime: 2 minutos`
  - `gcTime: 10 minutos`
  - `retry: 1`
