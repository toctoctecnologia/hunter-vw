

# Corrigir Erros de Build que Impedem o Preview

O preview nao carrega porque o build falha com 3 erros de TypeScript em `src/shared/lib/api.ts` e a ausencia do diretorio `supabase/functions`.

## Correcoes

### 1. `src/shared/lib/api.ts`

**Linha 67 (TS2322):** O spread de headers nao e compativel com o tipo `AxiosRequestHeaders`. Solucao: usar `requestConfig.headers.set()` ou fazer cast com `as any`:

```ts
// De (linha 67-71):
requestConfig.headers = {
  ...requestConfig.headers,
  Authorization: `Bearer ${refreshedToken}`,
  'x-retry-with-refresh': '1',
};

// Para:
requestConfig.headers.set('Authorization', `Bearer ${refreshedToken}`);
requestConfig.headers.set('x-retry-with-refresh', '1');
```

**Linhas 87-88 (TS18047):** `data` pode ser `null`, mas e acessado diretamente. Solucao: usar optional chaining:

```ts
// De:
if (data.details) {
  messages.push(`Detalhes: ${data.details}`);
}

// Para:
if (data?.details) {
  messages.push(`Detalhes: ${data.details}`);
}
```

### 2. Criar diretorio `supabase/functions`

Criar um arquivo placeholder para que o diretorio exista:
- `supabase/functions/.keep` (arquivo vazio)

Isso resolve o aviso de build sobre a ausencia do diretorio.

## Resultado Esperado

Apos essas correcoes, o build devera completar sem erros e o preview voltara a funcionar normalmente. Nenhuma alteracao visual ou de componente sera feita.
