# Segurança de rotas: frontend-only vs backend/proxy enforcement

## 1) Regras hoje implementadas em `src/middleware.ts`

> Neste repositório, o `src/middleware.ts` funciona como _entrypoint_ e delega para `updateSession` em `src/shared/lib/supabase/middleware.ts`, onde as regras de sessão/autorização já existiam.

As regras identificadas no middleware atual são:

1. **Whitelist de rotas públicas** (`/auth/*` específicas, `/public`, `/privacy-policy`, `/terms-of-service`).
2. **Usuário não autenticado** em rota protegida é redirecionado para `/`.
3. **Fluxo de convite (`inviteId`)**:
   - Se o usuário possui `inviteId` e não está em `/auth/confirm-informations`, redireciona para `/auth/confirm-informations?inviteId=...`.
   - Se já está nessa rota, permite continuar.
4. **Cadastro incompleto (`signUpCompleted = false`)**:
   - Redireciona para `/auth/finish-register` quando tenta acessar outras rotas (exceto `/`).
5. **Cadastro concluído (`signUpCompleted = true`)**:
   - Se acessar `/auth/finish-register`, redireciona para dashboard apropriado.
6. **Conta bloqueada por status de assinatura**:
   - Se status não estiver entre `ACTIVE`, `TEST_PERIOD_ACTIVE`, `OVERDUE` e não for super admin, força `/payment/confirm`.
7. **Segmentação por perfil**:
   - `SUPER_ADMIN` em `/dashboard*` é redirecionado para `/sadm-dashboard`.
8. **Tratamento de erro**:
   - Em falhas de validação de sessão/dados, redireciona para `/auth/error` com payload no query string.

## 2) Regras que devem ir para backend/proxy (obrigatório para segurança real)

As regras abaixo **não podem depender apenas de front-end**, porque usuário consegue burlar JavaScript e chamar API diretamente:

- Validação de autenticação e expiração de sessão para recursos protegidos.
- Validação de claims/perfil (`SUPER_ADMIN`, perfil, permissões) para autorização.
- Verificação de `signUpCompleted` para endpoints que exigem onboarding completo.
- Restrição por status de assinatura (`ACTIVE`, `OVERDUE`, etc.) para operações de negócio.
- Validação de `inviteId` e integridade de fluxo de convite.
- Todos os fluxos OAuth/callback e troca de token com segredos.

### Matriz de responsabilidade recomendada

| Regra | Frontend (UX) | Backend/Proxy (enforcement) |
|---|---|---|
| Usuário sem sessão não deve ver áreas protegidas | ✅ | ✅ |
| Bloquear leitura/escrita de dados protegidos | ❌ | ✅ |
| Somente SUPER_ADMIN em endpoints administrativos | ❌ | ✅ |
| Forçar pagamento para conta bloqueada | ✅ (redirecionamento) | ✅ (nega operação) |
| Impedir onboarding incompleto em operações críticas | ✅ (fluxo guiado) | ✅ (nega operação) |
| Validar convite e expiração de link | ✅ (navegação) | ✅ (validade real) |

### Recomendação de arquitetura

- **Backend/BFF ou API gateway/proxy** deve ser a fonte de verdade de autorização.
- **Frontend (React Router)** mantém guardas para UX (redirecionamento amigável, loading e consistência visual).
- Endpoints críticos devem validar token/claims/status independentemente de qualquer rota cliente.

## 3) Guardas de navegação no React Router (UX)

A camada de guardas cliente foi aplicada para manter comportamento consistente com o middleware:

- `src/shared/components/navigation-guard.tsx`:
  - obtém sessão Supabase no cliente;
  - observa mudanças de auth (`onAuthStateChange`);
  - busca `account/user/information` para aplicar regras de UX;
  - mantém tela de loading enquanto sessão e dados de usuário estão em resolução;
  - aplica redirecionamentos via `<Navigate />`.
- `src/shared/lib/auth/navigation-guards.ts`:
  - centraliza regras de rota pública;
  - resolve redirecionamento com base em `pathname`, `session` e `userInfo`.

## 4) Revisão do fluxo de refresh token/sessão em `src/shared/lib/supabase/*`

### Situação atual

- `client.ts`: usa `createBrowserClient(...)` do `@supabase/ssr`.
- `server.ts`: usa `createServerClient(...)` com cookies via `next/headers`.
- `middleware.ts`: usa claims/sessão no servidor e atualiza cookies no ciclo request/response.
- `api.ts`: agora tenta **refresh de sessão em 401** e refaz a requisição uma única vez com novo token.

### Implicações no app Vite/React Router

- No runtime SPA, não existe middleware de borda executando a cada navegação de rota cliente.
- O cliente depende do SDK Supabase para renovação de sessão e, em caso de corrida/expiração, do retry controlado no interceptor de API.

### Recomendações

1. **Backend validar JWT sempre** (sem confiar em estado de sessão da SPA).
2. **Backend opcionalmente emitir sessão HttpOnly** para hardening (BFF pattern).
3. **Frontend manter listener de sessão** para UX e fallback de refresh controlado.
4. **Evitar acoplar regras críticas ao runtime de UI** (React Router/cliente).

## 5) Diferenças de segurança: frontend-only vs backend-enforced

| Aspecto | Frontend-only guard | Backend/proxy enforcement |
|---|---|---|
| Bloqueio de rota visual | Sim | Sim |
| Bloqueio real de dados/operação | Não garantido | Sim |
| Resistência a bypass (DevTools, cURL, script) | Baixa | Alta |
| Proteção de segredo (OAuth/client secret) | Inadequada | Adequada |
| Fonte de verdade de autorização | Navegador | Servidor |
| Objetivo recomendado | UX | Segurança real |

### Resumo executivo

- Guardas no React Router são importantes para experiência de navegação.
- Segurança efetiva exige enforcement no backend/proxy para cada endpoint protegido.
