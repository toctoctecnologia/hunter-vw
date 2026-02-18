# Investigação local — build, tela branca e delays

## Ambiente
- Node: `v20.19.6`
- npm: `11.4.2`
- Bundler/framework: Vite `5.4.10` (script `vite` / `vite build`)

## Reprodução inicial (antes da correção)
### `npm run dev`
Erro reproduzido:
- `Could not resolve "pako/lib/zlib/zstream.js"`
- `Could not resolve "pako/lib/zlib/deflate.js"`
- `Could not resolve "pako/lib/zlib/inflate.js"`
- `Could not resolve "pako/lib/zlib/constants.js"`

Origem reportada no log:
- `node_modules/@react-pdf/pdfkit/lib/pdfkit.browser.js`

### `npm run build`
Erro reproduzido:
- `Rollup failed to resolve import "pako/lib/zlib/zstream.js" from "node_modules/@react-pdf/pdfkit/lib/pdfkit.browser.js"`

## Investigação de dependência
### `npm ls pako`
Árvore encontrada:
- `@react-pdf/renderer -> @react-pdf/pdfkit -> browserify-zlib -> pako@1.0.11`
- `jszip -> pako@1.0.11`
- `unicode-trie -> pako@0.2.9`

Observação:
- não existe `node_modules/pako` no topo, então imports absolutos `pako/lib/zlib/*` falham na resolução do Vite.

## Correções aplicadas
1) Import de `@react-pdf/renderer` movido para `dynamic import` dentro de `generateUserReportPDF` para reduzir acoplamento de bootstrap.
2) Alias explícito no `vite.config.ts` para mapear `pako/lib/zlib/*` para a cópia disponível em `node_modules/browserify-zlib/node_modules/pako/lib/zlib/*`.

## Validação pós-correção
### `npm run dev`
- Servidor sobe sem erro de resolução de `pako`.

### `npm run build`
- Build concluído com sucesso.
- Saída relevante:
  - `dist/assets/react-pdf.browser-*.js` ≈ `1,499.48 kB`
  - `dist/assets/AppRoutes-*.js` ≈ `4,184.46 kB`
  - aviso de chunks > 500 kB.

## Evidências de runtime/navegação
### Browser console/network (Playwright)
- Sem `pageerror` fatal após correção.
- Página principal renderiza (screenshot gerado).
- Requisições com 404/abort observadas:
  - `/api/dashboard-layout`
  - `/api/dashboard-visibility`

### Navegação + refresh
- Navegação para `/vendas` funciona e refresh mantém rota.
- Texto de erro funcional observado em página: `Erro ao carregar clientes` (indica dependência de API indisponível no ambiente local).

## Delays / gargalos observados
1) `AppRoutes` com import estático de grande número de páginas aumenta custo inicial de parse/exec.
2) Chunk de produção `AppRoutes` muito grande (≈4.1MB minificado), alto impacto de TTI.
3) Chunk de `react-pdf` muito grande (≈1.5MB), relevante para custo de download/parse quando carregado.
4) Falhas/404 em endpoints de dashboard introduzem retries/fluxos de fallback e percepção de lentidão.
