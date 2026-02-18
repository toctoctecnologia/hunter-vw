# Auditoria Visual - Hunter V2

> Checklist de consistência visual e cores do tema

## Regras de Cores

### ✅ Permitido
- **Tema Claro**: Detalhes em preto/cinza escuro (`--text`, `--textMuted`)
- **Tema Escuro**: Detalhes em branco/cinza claro (`--text`, `--textMuted`)
- **Laranja**: Apenas como cor de marca onde já existe (`--brandPrimary`)
- **Verde**: Status de sucesso (`--success`)
- **Vermelho**: Status de erro/perigo (`--danger`)
- **Azul**: Status de informação (`--info`)

### ❌ Proibido
- **Amarelo**: Nunca usar como cor principal
- **Cores fora do design system**: Sem hex/rgb diretos
- **Cores de texto incompatíveis**: Sem `text-white` em fundo claro

## Tokens do Design System

```css
/* Backgrounds */
--background: Fundo principal
--surface: Superfície elevada
--surface2: Cards e popovers
--surface3: Superfície terciária

/* Textos */
--text: Texto principal
--textMuted: Texto secundário

/* Interações */
--brandPrimary: Cor de ação principal (laranja)
--border: Bordas
--focusRing: Anel de foco
```

## Checklist por Área

### [ ] Sidebar
- [ ] Ícones usam `--icon` / `--iconMuted`
- [ ] Fundo usa `--sidebar-background`
- [ ] Hover usa `--sidebar-accent`

### [ ] Cards
- [ ] Fundo usa `--card`
- [ ] Texto usa `--card-foreground`
- [ ] Borda usa `--border`

### [ ] Botões
- [ ] Primary usa `--primary` / `--primary-foreground`
- [ ] Secondary usa `--secondary` / `--secondary-foreground`
- [ ] Destructive usa `--destructive`

### [ ] Inputs
- [ ] Fundo usa `--inputBg`
- [ ] Borda usa `--inputBorder`
- [ ] Focus ring usa `--focusRing`

### [ ] Badges/Status
- [ ] Sucesso: `--success`
- [ ] Erro: `--danger`
- [ ] Aviso: `--warning` (com cuidado, não amarelo puro)
- [ ] Info: `--info`

## Problemas Conhecidos a Corrigir

| Componente | Problema | Solução |
|------------|----------|---------|
| - | - | - |

## Como Testar

1. Alternar entre tema claro e escuro
2. Verificar contraste de texto
3. Confirmar que não há amarelo
4. Verificar badges e status
5. Testar em mobile
