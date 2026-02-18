
# Correção de Dois Erros Críticos

## Problema 1: `Cannot read properties of undefined (reading 'showRoulettePopup')`

**Causa raiz:** Em `use-lead-notification.tsx` linha 53, o acesso está escrito como:
```
user?.userInfo.showRoulettePopup
```
O operador `?.` protege apenas o acesso a `user`, mas se `userInfo` vier `undefined` (por exemplo, durante carregamento assíncrono ou resposta parcial da API), o JavaScript ainda tenta acessar `.showRoulettePopup` em `undefined` e lança o erro.

**Correção:** Adicionar `?.` também antes de `showRoulettePopup`:
```
user?.userInfo?.showRoulettePopup
```

---

## Problema 2: `Module not found: Can't resolve 'tw-animate-css'`

**Causa raiz:** O arquivo `src/app/globals.css` contém:
```css
@import 'tw-animate-css';
```
Porém `tw-animate-css` está listado em `devDependencies` no `package.json`. Com o pipeline Tailwind CSS v4 + Vite (plugin nativo `@tailwindcss/vite`), essa dependência precisa estar disponível em tempo de build de produção. Mover para `dependencies` resolve o problema.

---

## Arquivos a Modificar

**1. `src/features/dashboard/hooks/use-lead-notification.tsx`** — linha 53:
- De: `enabled: !!user?.userInfo.showRoulettePopup,`
- Para: `enabled: !!user?.userInfo?.showRoulettePopup,`

**2. `package.json`** — mover `tw-animate-css` de `devDependencies` para `dependencies`:
- Remover `"tw-animate-css": "^1.3.8"` de `devDependencies`
- Adicionar `"tw-animate-css": "^1.3.8"` em `dependencies`

---

## Technical Details

- The optional chaining fix (`?.`) is a one-character change but prevents a runtime crash whenever `userInfo` is transiently undefined during auth context initialization.
- Moving `tw-animate-css` to production dependencies ensures the package is available when Vite bundles the CSS in build mode, since `@tailwindcss/vite` processes CSS imports at build time.
- No logic changes, no UI changes — purely defensive fixes.
