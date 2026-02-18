# frontend-vite

Bootstrap de projeto **React + TypeScript** com **Vite**, pensado para facilitar a migração e o desenvolvimento paralelo do time.

## Requisitos

- Node.js 20+
- npm 10+

## Como usar

```bash
cd frontend-vite
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`.

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: valida TypeScript e gera build de produção
- `npm run preview`: sobe servidor local para validar o build
- `npm run lint`: executa ESLint
- `npm run format`: valida formatação com Prettier
- `npm run format:write`: aplica formatação com Prettier

## Aliases de import

Mantido o mesmo padrão do repositório atual:

- `@/*` -> `./src/*`

Exemplo:

```ts
import { App } from '@/App';
```

## Estrutura sugerida

```text
frontend-vite/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── eslint.config.js
├── tsconfig.json
└── vite.config.ts
```
