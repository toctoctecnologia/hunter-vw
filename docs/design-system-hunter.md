# Design System Hunter

Este documento define os tokens oficiais e as regras de uso para manter a UI do Hunter CRM 100% consistente em modo claro e escuro.

## Tokens oficiais

### Cor primária (única)
- `HUNTER_ORANGE`: `#FF6500`

### Modo claro
- `BG_PAGE_LIGHT`: `#FFFFFF`
- `BG_CARD_LIGHT`: `#FFFFFF`
- `BORDER_LIGHT`: `#EDEDED`
- `TEXT_PRIMARY_LIGHT`: `#111111`
- `TEXT_SECONDARY_LIGHT`: `#6B6B6B`
- `TEXT_MUTED_LIGHT`: `#9A9A9A`
- `ICON_LIGHT`: `#1C1C1C`
- `SEPARATOR_LIGHT`: `#EEEEEE`

### Modo escuro
- `BG_PAGE_DARK`: `#0E0E0E`
- `BG_CARD_DARK`: `#181818`
- `BORDER_DARK`: `#242424`
- `TEXT_PRIMARY_DARK`: `#FFFFFF`
- `TEXT_SECONDARY_DARK`: `#B3B3B3`
- `TEXT_MUTED_DARK`: `#6F6F6F`
- `ICON_DARK`: `#CFCFCF`
- `SEPARATOR_DARK`: `#242424`

### Status (fixas)
- `INFO_BLUE`: `#3B82F6`
- `SUCCESS_GREEN`: `#22C55E`
- `WARNING_AMBER`: `#F59E0B`
- `DANGER_RED`: `#EF4444`

### Estados de interação
- Hover primário: `opacity: 0.92`
- Active primário: `opacity: 0.86`
- Focus ring: `HUNTER_ORANGE` com `opacity: 0.35` e `2px`
- Disabled: `opacity: 0.5`, `cursor: not-allowed`, sem sombra

### Radius e tamanhos
- `RADIUS_MD`: `10px`
- `RADIUS_LG`: `12px`
- `RADIUS_FULL`: `999px`
- `H_INPUT`: `40px`
- `H_BUTTON`: `40px`
- `H_BADGE`: `22px`
- `H_TOGGLE`: `24px`
- `H_HEADER`: `64px`
- `CARD_PADDING`: `16px`
- `CARD_PADDING_LG`: `20px`
- `GAP_SECTION`: `16px`
- `GAP_STACK`: `12px`

### Tipografia
- Fonte: **Inter** (padrão)
- Base: **14px**
- Page title: **22px**, semibold
- Card title: **16px**, medium
- Subtitle: **14px**, regular, cor secondary
- Label: **12px**, regular, cor secondary

## Regras de uso (obrigatórias)

1. **Proibido hardcode de hex/rgb** em componentes ou páginas. Use variáveis e classes baseadas nos tokens.
2. **Não criar sombras pesadas**. Use apenas `shadow` sutil no claro e evite no escuro.
3. **Sem variações do laranja**. Hover/active do primário devem ser feitos **apenas por opacity**.
4. **Todos os componentes** devem usar as alturas, radius e paddings oficiais.

## Onde ficam os tokens

Os tokens ativos são definidos em:
- `src/index.css` (variáveis CSS do tema)
- `tailwind.config.ts` (mapeamento para classes do Tailwind)

## Convenção de lint (manual)

Antes de abrir PR, verifique se nenhum novo hex/rgb foi adicionado fora dos arquivos de tokens.

Exemplo de checagem rápida:
```bash
rg "#[0-9a-fA-F]{3,6}" src
```
