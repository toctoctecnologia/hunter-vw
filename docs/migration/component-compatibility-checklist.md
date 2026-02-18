# Checklist de compatibilidade por componente (Next.js → Vite)

## Objetivo
Garantir que cada componente migrado para Vite continue funcional, acessível e sem dependência direta de `next/*`.

## Como usar
- Aplique este checklist em toda PR de migração.
- Marque cada item com `✅`, `⚠️` ou `❌`.
- Registre evidências (print, teste automatizado, gravação curta ou log).
- Comece pelos módulos **sem dependência de `next/server`, `next/headers` ou handlers `route.ts`**.

## Checklist padrão por componente

### 1) Renderização
- [ ] O componente monta sem erro em `npm run dev`.
- [ ] Não há import direto de `next/navigation`, `next/link` ou `next/image`.
- [ ] Layout e espaçamento permanecem consistentes com o design base.
- [ ] Estados visuais foram validados: default, loading, erro, vazio.

### 2) Eventos e navegação
- [ ] Clique/submit/disparo principal funciona como antes.
- [ ] Navegação usa alternativa do React Router (`Link`, `navigate`) ou API de browser quando aplicável.
- [ ] Parâmetros de rota/querystring continuam sendo lidos/escritos corretamente.
- [ ] Não há regressão em callbacks assíncronos (toast, modal, mutation, refresh de dados).

### 3) Acessibilidade
- [ ] Elementos interativos são alcançáveis por teclado.
- [ ] `aria-label`, `aria-describedby` e roles relevantes estão preservados.
- [ ] Imagens possuem `alt` significativo.
- [ ] Contraste e foco visível permanecem adequados.

### 4) Estilos e assets (`public/`)
- [ ] Assets referenciados no componente carregam corretamente via Vite (`/arquivo.ext`).
- [ ] Não há referência a caminhos específicos do Next (`/_next`, loaders do `next/image`).
- [ ] CSS utilitário/Tailwind continua aplicando classes esperadas após build.
- [ ] Ícones, fontes e mídia (imagem/áudio) renderizam no ambiente de preview.

## Onda 1 (módulos client-first sem dependência server)

### Status
- ✅ Imports `next/navigation` substituídos por alternativa baseada em React Router (`@/shims/next-navigation`) nos módulos client priorizados.
- ✅ Imports `next/image` substituídos por wrapper local (`@/shims/next-image`) em componentes de UI client-side.
- ✅ Imports `next/link` substituídos por `Link` de `react-router-dom` em componentes migrados.

### Checklist de compatibilidade por componente (modelo de preenchimento)

| Componente | Renderização | Eventos/Navegação | Acessibilidade | Estilos/Assets (`public/`) | Evidência |
|---|---|---|---|---|---|
| `src/app/(public)/public/check-in/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + revisão manual em `npm run dev` |
| `src/app/(protected)/google-ads/success/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + validação de querystring (`tokens`) |
| `src/app/(protected)/calendar/success/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + validação de querystring (`tokens`) |
| `src/app/(protected)/meta/success/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + callback/popup manual |
| `src/app/(auth)/auth/forgot-password/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + navegação via formulário |
| `src/app/(auth)/auth/reset-password/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + fluxo de senha manual |
| `src/app/(auth)/auth/mobile/confirm/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + leitura de parâmetros |
| `src/app/(protected)/dashboard/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + entrada por URL direta |
| `src/app/(protected)/dashboard/properties/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + filtros/query params |
| `src/app/(protected)/dashboard/sales/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + filtros/query params |
| `src/app/(protected)/dashboard/manage-reports/page.tsx` | ✅ | ✅ | ✅ | ✅ | `npm run build` + navegação de abas |

### Componentes incluídos nesta onda
- `src/shared/hoc/with-permission.tsx`
- Componentes de dashboard em `src/features/dashboard/**` (auth, propriedades, vendas, notificações, calendário, controle de acesso, distribuição)
- `src/features/payment/components/payment-confirm-status.tsx`
- `src/features/sadm-dashboard/profile/components/profile-info.tsx`

## Observações
- Handlers `route.ts`, `next/server` e `next/headers` permanecem fora desta onda por dependência de runtime server.
- A remoção completa de shims é etapa posterior, após estabilização das rotas e guards no React Router.
