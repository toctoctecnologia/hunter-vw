# Matriz de compatibilidade Next.js → Vite

## Escopo do levantamento

Este inventário cobre:
1. Uso de `next/*`, `middleware.ts`, hooks e componentes server/client no código atual.
2. Rotas e recursos que exigem execução em servidor.
3. Classificação por item em:
   - **equivalente direto no Vite**
   - **exige backend separado**
   - **reprojeto necessário**

## Resumo executivo

- O projeto já roda com Vite e possui **shims** para `next/navigation`, `next/link` e `next/image` (compatibilidade de curto prazo).
- O diretório `src/app/**` ainda preserva convenções do App Router (`page.tsx`, `layout.tsx`, `route.ts`), o que indica migração em andamento.
- O que ainda depende de servidor está concentrado em:
  - handlers `route.ts` (OAuth, callbacks, proxy de APIs externas),
  - sessão/cookies no Supabase server client,
  - lógica de middleware de autenticação/redirecionamento.

## Matriz por arquivo/feature

| Arquivo/Feature | Uso atual observado | Recurso que exige servidor? | Classificação | Observação de migração |
|---|---|---|---|---|
| `vite.config.ts` (aliases para `next/*`) | Alias de `next/navigation`, `next/image`, `next/link`, `next/server`, `next/headers` para `src/shims/*` | Não (camada de build) | equivalente direto no Vite | Estratégia válida para compatibilidade incremental; idealmente remover imports `next/*` ao final da migração. |
| `src/shims/next-navigation.ts` | Implementa `useRouter`, `useSearchParams`, `useParams` sobre `react-router-dom` | Não | equivalente direto no Vite | Atende a maior parte dos casos de navegação client-side. |
| `src/shims/next-link.tsx` | Reimplementa `next/link` usando `react-router-dom/Link` | Não | equivalente direto no Vite | Funcional para navegação SPA e links externos. |
| `src/shims/next-image.tsx` | Substitui `next/image` por `<img>` com props compatíveis | Não | equivalente direto no Vite | Funciona no Vite, mas perde otimizações automáticas de imagem do Next. |
| `src/shims/next-server.ts` | Stub de `NextRequest/NextResponse` para ambiente client | Sim, na API real | reprojeto necessário | O shim evita quebra de build, mas não substitui runtime server real. |
| `src/shims/next-headers.ts` | Stub de `cookies()`/`headers()` | Sim, na API real | reprojeto necessário | Útil para compatibilidade, porém sem semântica de request/response de servidor. |
| Imports `next/navigation` em páginas/componentes (`src/app/**` e `src/features/**`) | `useRouter` (~36 arquivos), `useSearchParams` (~7), `useParams` (~7) | Não necessariamente | equivalente direto no Vite | Pode migrar para import direto de `react-router-dom` e remover dependência do shim. |
| Imports `next/link` em componentes | Uso em componentes de autenticação/pagamento | Não | equivalente direto no Vite | Troca direta por `Link` de `react-router-dom`. |
| Imports `next/image` em componentes | Uso em cards, galeria, perfil, pagamentos etc. | Não | equivalente direto no Vite | Troca por `<img>` ou biblioteca de otimização via CDN (se necessário). |
| `src/app/layout.tsx` (`next/font/google`, `Metadata`) | Usa API de fonte do Next e exporta `metadata` | Parcial (font/metadata são recursos de framework) | reprojeto necessário | Em Vite, mover metadados para `react-helmet-async` (ou equivalente) e fonte para CSS/fontsource. |
| Estrutura App Router (`src/app/**/page.tsx` e `layout.tsx`) | Rotas definidas por filesystem routing do Next | Não no runtime final, mas depende do framework Next | reprojeto necessário | Converter para tabela declarativa de rotas do React Router (ou TanStack Router). |
| Componentes com `"use client"` | Forte predominância de componentes client (inclusive páginas protegidas) | Não | equivalente direto no Vite | A maior parte já está alinhada com SPA. |
| Páginas server-default em `src/app/**` sem `"use client"` | Minoria de páginas/layouts ainda sem diretiva | Depende do conteúdo interno | reprojeto necessário | Validar caso a caso; várias já são renderizáveis no cliente, mas precisam sair do contrato Next App Router. |
| `src/shared/lib/supabase/server.ts` | `createServerClient` + `cookies()` de `next/headers` | Sim (cookies HttpOnly por request) | exige backend separado | Em Vite SPA, manter no backend/BFF ou edge function; cliente deve usar client SDK sem cookies server-side. |
| `src/shared/lib/supabase/middleware.ts` | Lógica de sessão, claims, redirects e regras de acesso | Sim (interceptação por request e cookies) | exige backend separado | Pode virar middleware do backend/reverse proxy; no front, manter guards apenas para UX. |
| `middleware.ts` raiz do Next (não encontrado no repositório) | Não existe arquivo `middleware.ts` no root atual | Sim, se quiser interceptação global | reprojeto necessário | Se necessário, replicar no gateway/backend (Nginx, BFF, edge). |
| `src/app/(auth)/auth/confirm/route.ts` | Troca `code` por sessão Supabase e faz redirect | Sim | exige backend separado | Endpoint de callback deve permanecer server-side (BFF/Node/edge). |
| `src/app/(auth)/auth/mobile/confirm/process/route.ts` | Valida query de tokens e redireciona | Sim (atual implementação é server handler) | reprojeto necessário | Pode ser simplificado para rota client se não houver segredo, senão mover para backend. |
| `src/app/api/google/oauth/start/route.ts` | Monta URL OAuth e grava cookie de estado | Sim (cookie assinado/HttpOnly e segredo) | exige backend separado | Manter em backend para segurança do state e credenciais. |
| `src/app/api/google/oauth/callback/route.ts` | Valida state, troca code por token, redireciona | Sim | exige backend separado | Fluxo OAuth deve continuar server-side. |
| `src/app/api/google/ads/route.ts` | Proxy para API Google Ads com credenciais | Sim | exige backend separado | Não expor credenciais no frontend. |
| `src/app/api/meta/oauth/start/route.ts` | Inicia OAuth Meta e persiste state em cookie | Sim | exige backend separado | Mesmo padrão dos demais provedores OAuth. |
| `src/app/api/meta/oauth/callback/route.ts` | Callback OAuth Meta com troca/validação de token | Sim | exige backend separado | Requer backend para segredo e proteção de fluxo. |
| `src/app/api/meta/leads/route.ts` | Endpoint para integração Meta Leads | Sim | exige backend separado | Deve ser mantido em API backend. |
| `src/app/api/whatsapp/oauth/start/route.ts` | Início de OAuth/Embedded Signup WhatsApp | Sim | exige backend separado | Requer credenciais sensíveis. |
| `src/app/api/whatsapp/oauth/callback/route.ts` | Troca de tokens e chamadas Graph API | Sim | exige backend separado | Handler claramente server-only (tokens, chamadas externas e validações). |

## Catálogo de rotas e recursos que exigem servidor

### Rotas HTTP server-side (Next `route.ts`)

- `/auth/confirm` → `src/app/(auth)/auth/confirm/route.ts`
- `/auth/mobile/confirm/process` → `src/app/(auth)/auth/mobile/confirm/process/route.ts`
- `/api/google/oauth/start` → `src/app/api/google/oauth/start/route.ts`
- `/api/google/oauth/callback` → `src/app/api/google/oauth/callback/route.ts`
- `/api/google/ads` → `src/app/api/google/ads/route.ts`
- `/api/meta/oauth/start` → `src/app/api/meta/oauth/start/route.ts`
- `/api/meta/oauth/callback` → `src/app/api/meta/oauth/callback/route.ts`
- `/api/meta/leads` → `src/app/api/meta/leads/route.ts`
- `/api/whatsapp/oauth/start` → `src/app/api/whatsapp/oauth/start/route.ts`
- `/api/whatsapp/oauth/callback` → `src/app/api/whatsapp/oauth/callback/route.ts`

### Recursos server-only adicionais

- Sessão/cookies e client Supabase server-side: `src/shared/lib/supabase/server.ts`
- Middleware de autenticação/redirect por request: `src/shared/lib/supabase/middleware.ts`
- Interceptação global estilo `middleware.ts` do Next: **ausente no root**, demandando alternativa no backend/gateway.


## Atualização da onda inicial (módulos sem dependência de runtime Next)

- Foram priorizados componentes client-side fora de handlers server (`route.ts`) e fora de APIs de `next/server`/`next/headers`.
- Em módulos de interface client-first, imports diretos de `next/navigation` e `next/image` foram trocados para alternativas baseadas em React Router/browser APIs (`@/shims/next-navigation` e `@/shims/next-image`) para reduzir o acoplamento ao namespace `next/*`.
- Casos com `next/link` foram convertidos para `Link` de `react-router-dom`.
- A validação de estilos e assets estáticos foi formalizada no checklist `docs/migration/component-compatibility-checklist.md`, incluindo critérios e evidências para recursos em `public/` no contexto do Vite.

### Módulos priorizados nesta rodada

- `src/app/(public)/public/check-in/page.tsx`
- `src/app/(protected)/google-ads/success/page.tsx`
- `src/app/(protected)/calendar/success/page.tsx`
- `src/app/(protected)/meta/success/page.tsx`
- `src/app/(auth)/auth/forgot-password/page.tsx`
- `src/app/(auth)/auth/reset-password/page.tsx`
- `src/app/(auth)/auth/mobile/confirm/page.tsx`
- `src/app/(protected)/dashboard/page.tsx`
- `src/app/(protected)/dashboard/manage-reports/page.tsx`
- `src/app/(protected)/dashboard/properties/page.tsx`
- `src/app/(protected)/dashboard/sales/page.tsx`
- `src/app/(protected)/dashboard/manage-condominiums/condominium/[uuid]/page.tsx`
- `src/app/(protected)/dashboard/properties/[uuid]/detail/page.tsx`
- `src/app/(protected)/dashboard/properties/[uuid]/update/page.tsx`
- `src/app/(protected)/dashboard/users/[uuid]/page.tsx`
- `src/app/(protected)/dashboard/distribution/sale-action/[actionId]/page.tsx`
- `src/app/(protected)/dashboard/sales/[uuid]/details/page.tsx`
- `src/app/(protected)/dashboard/distribution/queue/[queueId]/page.tsx`

## Notas práticas para a migração

1. **Curto prazo (baixo risco):** manter aliases/shims para continuidade do desenvolvimento em Vite.
2. **Médio prazo:** remover dependência semântica de `next/*` nos componentes client e adotar imports nativos (`react-router-dom`, `<img>`, etc.).
3. **Longo prazo:** consolidar um **backend dedicado** para todos os handlers `route.ts` (OAuth, callbacks, integrações externas, sessão/cookies).
4. **Segurança:** qualquer fluxo com `client_secret`, validação de `state`, troca de code por token e manipulação de cookies sensíveis deve permanecer fora do frontend.
