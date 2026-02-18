# Guia operacional de build, preview e smoke test (Vite)

## 1) Build de produção

A configuração de build segue estas regras:

- `vite build` gera artefatos em `dist/`.
- Assets estáticos compilados ficam em `dist/assets/`.
- `manifest.json` é gerado para rastreabilidade de bundles.
- Sourcemap fica **desabilitado em produção** e **habilitado fora de produção**.

### Comando padrão

```bash
npm run build
```

---

## 2) Preview para homologação local/CI

### Subir preview local

```bash
npm run build
npm run preview
```

- O preview sobe com `--host` para permitir acesso externo (ex.: container/rede local).
- Porta padrão: `4173`.

### Subir preview em CI

```bash
npm run build
npm run preview:ci
```

- Usa `--strictPort` para falhar rápido em conflito de porta.

---

## 3) Checklist de smoke test no preview

Execute no ambiente de preview com dados válidos de homologação.

### 3.1 Login e sessão

- [ ] Login com credencial válida redireciona para dashboard esperado.
- [ ] Login inválido exibe erro e não cria sessão.
- [ ] Logout invalida sessão e bloqueia retorno por rota protegida.

### 3.2 Rotas protegidas

- [ ] Acesso direto a rota protegida sem sessão redireciona para login.
- [ ] Perfil com permissão limitada não acessa área administrativa.
- [ ] Refresh (F5) em rota protegida mantém comportamento correto de autorização.

### 3.3 Páginas críticas

- [ ] `/dashboard` carrega cards/métricas sem erro de render.
- [ ] `/dashboard/manage-condominiums` renderiza tabela e paginação.
- [ ] Fluxos críticos de receita/operação (vendas, integrações, relatórios) carregam e interagem.

### 3.4 Uploads

- [ ] Upload de arquivo válido conclui e persiste referência.
- [ ] Upload de formato inválido exibe erro amigável.
- [ ] Upload acima do limite permitido é rejeitado corretamente.

### 3.5 WebSockets / tempo real

- [ ] Canal websocket conecta sem erro após login.
- [ ] Reconexão funciona após perda de rede.
- [ ] Evento em tempo real atualiza UI sem reload manual.

### 3.6 Smoke automatizado mínimo

O gate automático no CI valida:

- disponibilidade do preview;
- carregamento do shell SPA em rotas chave.

```bash
npm run smoke:preview
```

---

## 4) Pipeline CI com gates mínimos

Workflow: `.github/workflows/ci.yml`

Ordem de gates:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm run preview:ci`
5. `npm run smoke:preview`

Se qualquer gate falhar, o job é interrompido com status de falha.

---

## 5) Depuração de falhas comuns

### Porta 4173 ocupada

Sintoma: preview não sobe.

Ação:

- encerrar processo que usa a porta; ou
- ajustar `preview:ci` para outra porta e atualizar `SMOKE_BASE_URL` no smoke.

### Build falha por variável de ambiente

Sintoma: erro de variável obrigatória no build/runtime.

Ação:

- validar `.env` da homologação;
- garantir prefixo `VITE_` para variáveis expostas ao frontend.

### Smoke falha em rota

Sintoma: script de smoke retorna status HTTP inesperado.

Ação:

- validar se preview está de pé (`curl http://127.0.0.1:4173`);
- conferir logs do processo `vite preview`;
- reexecutar smoke com base URL explícita:

```bash
SMOKE_BASE_URL=http://127.0.0.1:4173 npm run smoke:preview
```

### Upload falha somente em CI

Sintoma: upload funciona localmente e quebra em pipeline.

Ação:

- conferir endpoint de storage no ambiente de CI;
- revisar CORS/origem do preview;
- validar credenciais/segredos do ambiente de homologação.

### WebSocket desconecta em homologação

Sintoma: UI sem atualização em tempo real.

Ação:

- verificar URL de websocket no ambiente;
- revisar proxy/LB para suporte a upgrade de conexão;
- confirmar timeout de idle no balanceador.
