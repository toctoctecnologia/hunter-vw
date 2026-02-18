
# Correção Definitiva do app-sidebar.tsx

## Por que o erro persiste?

O diff anterior corrigiu a condição do `if` (linha 48) e o array de dependências (linha 59), mas **deixou dois acessos diretos** sem optional chaining:

- **Linha 49** — dentro do `useEffect`, após o `if`:
  ```ts
  const expirationDate = new Date(user.signatureInfo.lastExpirationDate);
  //                               ^^^^ sem optional chaining aqui
  ```

- **Linha 117** — no JSX, dentro do bloco que já verifica `signatureInfo?.status`:
  ```tsx
  {` ${getHumanExpirationDate(user.signatureInfo.lastExpirationDate)}`}
  //                           ^^^^ sem optional chaining aqui
  ```

Mesmo que a condição `user?.signatureInfo?.status === 'TEST_PERIOD_ACTIVE'` seja verdadeira no momento do render, um re-render assíncrono pode tornar `signatureInfo` undefined antes de a linha 49 ou 117 executar, causando o crash.

## Correções

### `src/shared/components/layout/app-sidebar.tsx`

**Linha 49** — Dentro do `useEffect`:
- De: `const expirationDate = new Date(user.signatureInfo.lastExpirationDate);`
- Para: `const expirationDate = new Date(user?.signatureInfo?.lastExpirationDate ?? '');`

**Linha 117** — No JSX:
- De: `{' ' + getHumanExpirationDate(user.signatureInfo.lastExpirationDate)}`
- Para: `{' ' + getHumanExpirationDate(user?.signatureInfo?.lastExpirationDate ?? '')}`

Essas duas são as únicas ocorrências restantes de acesso direto sem proteção. Após essa correção, todos os acessos a `signatureInfo` no arquivo estarão protegidos com optional chaining.
