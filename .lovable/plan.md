
# Correção do Erro em app-sidebar.tsx

## Causa Raiz

O operador `?.` (optional chaining) está sendo aplicado apenas no primeiro nível (`user?.signatureInfo`), mas **não** no segundo nível (`.lastExpirationDate`, `.status`). Quando `signatureInfo` é `undefined` — o que acontece durante o carregamento inicial do contexto de autenticação — o JavaScript tenta acessar propriedades em `undefined` e lança o `TypeError`.

Há **3 ocorrências** do mesmo problema no arquivo:

```
// Linha 48 - dentro do useEffect
user?.signatureInfo.status          ← signatureInfo pode ser undefined

// Linha 59 - array de dependências do useEffect  
user?.signatureInfo.lastExpirationDate   ← CRASH aqui
user?.signatureInfo.status

// Linha 110 - no JSX
user?.signatureInfo.status
```

## Sobre o Favicon 404

O erro `favicon.ico: 404` é separado e ocorre porque não há arquivo `favicon.ico` na pasta `public/`. É um erro inofensivo mas pode ser corrigido simplesmente colocando um arquivo de ícone válido em `public/favicon.ico`, ou removendo a linha `<link rel="icon" ...>` do `index.html`. Não afeta o funcionamento da aplicação.

## Arquivos a Modificar

### `src/shared/components/layout/app-sidebar.tsx`

Adicionar `?.` em todos os acessos a `signatureInfo`:

- **Linha 48:** `user?.signatureInfo.status` → `user?.signatureInfo?.status`
- **Linha 59 (dependências):** `user?.signatureInfo.lastExpirationDate` → `user?.signatureInfo?.lastExpirationDate` e `user?.signatureInfo.status` → `user?.signatureInfo?.status`
- **Linha 110 (JSX):** `user?.signatureInfo.status` → `user?.signatureInfo?.status`

Este é exatamente o mesmo padrão defensivo já aplicado em `use-lead-notification.tsx` na correção anterior.
