
# Correcao da Tela Branca no /dashboard

## Diagnostico

A tela branca e causada por **3 problemas que se combinam**:

### Problema 1: AuthProvider fica travado eternamente
Em `src/shared/hooks/use-auth.tsx` (linha 52), quando a chamada API `account/user/information` falha, o `user` permanece `null` e o componente retorna `<LoadingFull>` para sempre. O `useEffect` na linha 46-50 nao re-executa porque `user` continua `null` (a dependencia nao muda). Resultado: tela presa no loading ou branca.

### Problema 2: NavigationGuard causa loop infinito de redirects
O erro "Maximum update depth exceeded" nos console logs vem do `NavigationGuard`. Quando `userInfo` carrega mas `signatureInfo` tem status vazio/undefined (por causa dos optional chaining que adicionamos), o status `''` nao esta na lista `AUTHENTICATED_ACCOUNT_ALLOWED_STATUSES`, o que redireciona para `/payment/confirm`. Porem, a cada re-render do `onAuthStateChange`, um novo objeto `session` e criado, forçando recalculo do `useMemo` e potencialmente cascateando re-renders.

### Problema 3: Sem ErrorBoundary
Nao existe nenhum ErrorBoundary no projeto. Quando um erro de runtime ocorre (como os que corrigimos anteriormente), React simplesmente desmonta tudo e mostra tela branca, sem feedback para o usuario.

## Correcoes

### 1. `src/shared/hooks/use-auth.tsx` - AuthProvider com tratamento de erro

- Adicionar estado `isLoading` e `hasError`
- Quando a API falha, mostrar mensagem de erro em vez de ficar no loading eterno
- Adicionar retry com limite (nao usar `[user]` como dependencia do useEffect, usar `[]`)
- Se falhar apos tentativas, renderizar children com user null ou mensagem de erro

### 2. `src/shared/components/navigation-guard.tsx` - Corrigir race condition

- Garantir que `resolveNavigationRedirect` so executa quando `userInfo` esta completamente carregado (nao null)
- Evitar que `onAuthStateChange` cause re-renders desnecessarios adicionando comparacao de referencia no `setSession`
- Mover a logica de redirect para que so execute quando os dados estao prontos

### 3. `src/shared/lib/auth/navigation-guards.ts` - Proteger contra dados parciais

- Quando `userInfo` e fornecido mas `signatureInfo` ou `userInfo.userInfo` sao undefined, tratar como "dados incompletos" e nao redirecionar (retornar null)
- Isso evita redirects incorretos quando os dados estao parcialmente carregados

### 4. `src/App.tsx` - Adicionar ErrorBoundary

- Criar componente `ErrorBoundary` que captura erros de runtime
- Envolver o App com ErrorBoundary para evitar tela branca em caso de crash
- Mostrar mensagem amigavel com opcao de recarregar

## Detalhes Tecnicos das Alteracoes

### `src/shared/hooks/use-auth.tsx`
```typescript
// Trocar useEffect([user]) por useEffect([]) para evitar re-execucoes
// Adicionar estado de erro e loading
// Se API falhar, nao travar no loading forever
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  handleGetUserInformation().finally(() => setIsLoading(false));
}, []);

if (isLoading) {
  return <LoadingFull title="Carregando..." />;
}
// Se user for null apos loading, renderizar children mesmo assim
// (o NavigationGuard ja lida com redirect)
```

### `src/shared/components/navigation-guard.tsx`
```typescript
// No onAuthStateChange, evitar set desnecessario:
supabase.auth.onAuthStateChange((_event, authSession) => {
  setSession((prev) => {
    if (prev?.access_token === authSession?.access_token) return prev;
    return authSession;
  });
  // ...
});
```

### `src/shared/lib/auth/navigation-guards.ts`
```typescript
// Apos "if (!userInfo) return null;", adicionar:
if (!userInfo.userInfo || !userInfo.signatureInfo) {
  return null; // dados incompletos, nao redirecionar
}
```

### Novo: `src/shared/components/error-boundary.tsx`
- Componente class-based (React ErrorBoundary requer class component)
- Captura erros de render e mostra UI de fallback
- Botao para recarregar a pagina
