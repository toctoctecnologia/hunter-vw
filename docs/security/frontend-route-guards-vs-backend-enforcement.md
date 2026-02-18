# Segurança de rotas: frontend-only vs backend/proxy enforcement

## 1) Regras atualmente implementadas no middleware de sessão

> Observação: o projeto não possui `src/middleware.ts` nem `middleware.ts` na raiz. A lógica central de sessão/redirecionamento está em `src/shared/lib/supabase/middleware.ts`.

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

### Recomendação de arquitetura

- **Backend/BFF ou API gateway/proxy** deve ser a fonte de verdade de autorização.
- **Frontend (React Router)** mantém guardas apenas para UX (redirecionamento amigável, loading, evitar “flash” de tela).
- Endpoints críticos devem validar token/claims/status independentemente de qualquer rota cliente.

## 3) Guardas de navegação no React Router (UX)

Foi implementada uma camada de guardas cliente para manter comportamento consistente com o middleware legado:

- `src/shared/components/navigation-guard.tsx`:
  - obtém sessão Supabase no cliente;
  - observa mudanças de auth (`onAuthStateChange`);
  - busca `account/user/information` para aplicar regras de UX;
  - aplica redirecionamentos via `<Navigate />`.
- `src/shared/lib/auth/navigation-guards.ts`:
  - centraliza regras de rota pública;
  - resolve redirecionamento com base em `pathname`, `session` e `userInfo`.

## 4) Revisão do fluxo de refresh token/sessão (`src/shared/lib/supabase/*`)

### Situação atual

- `client.ts`: usa `createBrowserClient(...)` do `@supabase/ssr`.
- `server.ts`: usa `createServerClient(...)` com cookies via `next/headers` (legado Next).
- `middleware.ts`: faz leitura de claims/sessão e atualiza cookies no response/request.

### Implicações no app Vite/React Router

- Não existe `middleware.ts` de edge no runtime SPA, então não há refresh por request no front.
- O refresh de access token fica dependente do comportamento do SDK no cliente e do ciclo de vida da aba.

### Recomendações

1. **Backend validar JWT sempre** (sem confiar em estado de sessão da SPA).
2. **Backend opcionalmente emitir sessão HttpOnly** para hardening (BFF pattern).
3. **Frontend manter listener de sessão** para UX e retry controlado.
4. **Evitar acoplar regras críticas ao `next/headers`** no caminho SPA final.

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
