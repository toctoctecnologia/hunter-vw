# Plano Profundo de Estabilização da Plataforma (Vite)

## Contexto
Este plano consolida diagnóstico técnico e tarefas práticas para garantir que o projeto rode de forma estável em build/preview/deploy.

## Evidências levantadas

### 1) Build de produção
- `pnpm build` concluiu com sucesso (Vite build ok).
- Observação: há chunks muito grandes (`>500 kB`) e isso pode degradar tempo de carregamento inicial.

### 2) Lint
- `pnpm lint` falhou com alto volume de erros/avisos.
- Diagnóstico principal:
  - O ESLint está analisando `dist/**` (artefatos compilados), gerando milhares de alertas irrelevantes.
  - Existem erros reais em `src/**` (ex.: `no-explicit-any` em arquivos críticos de infraestrutura).

### 3) Ambiente e runtime
- O cliente Supabase usa fallback quando variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` não estão configuradas.
- Isso evita crash imediato, mas mascara falha de configuração de ambiente e pode causar comportamento inconsistente no preview.

### 4) Deploy/Preview
- O projeto usa `vite build` + `vite preview`.
- O sintoma "Preview has not been built yet" em plataformas externas normalmente ocorre por:
  - comando de build não executado no ambiente remoto;
  - artefatos ausentes no diretório esperado;
  - variáveis de ambiente obrigatórias ausentes;
  - falha silenciosa em etapa anterior do pipeline.

### 5) Lovable "project out of date"
- Quando o editor mostra o aviso **"Update Project"** e o preview à direita diz **"Preview has not been built yet"**, geralmente o problema não é o código em si.
- Nesse estado, o container/projeto remoto ainda não foi sincronizado com a última versão do repositório.
- Resultado: o preview antigo não encontra os artefatos esperados e exibe mensagem de build ausente.
- Mitigação imediata:
  1) clicar em **Update project** no Lovable;
  2) aguardar a sincronização;
  3) disparar novo build/preview.

---

## Tarefas priorizadas para colocar tudo funcionando

## Fase 0 — Correções imediatas de esteira (alta prioridade)

1. **Parar de lintar código compilado (`dist/**`)**
   - Ação: adicionar `dist/**` em `ignores` do `eslint.config.mjs`.
   - Critério de aceite: `pnpm lint` deixa de produzir erros massivos oriundos de `dist/assets/*.js`.

2. **Separar lint de qualidade real x lint de build local**
   - Ação: criar scripts:
     - `lint`: escopo completo do código fonte.
     - `lint:ci`: estrito para CI (falha em erros).
   - Critério de aceite: pipeline aponta apenas pendências reais de `src/**`.

3. **Padronizar pipeline de preview/deploy**
   - Ação: configurar esteira com sequência explícita:
     1) `pnpm install --frozen-lockfile`
     2) `pnpm build`
     3) `pnpm start`
   - Critério de aceite: preview remoto sobe sem mensagem "has not been built yet".

## Fase 1 — Configuração de ambiente e observabilidade (alta prioridade)

4. **Checklist obrigatório de variáveis VITE_ no startup**
   - Ação: validar em bootstrap as envs mínimas (`VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SITE_URL`).
   - Critério de aceite: app falha com erro claro em ambiente inválido (ao invés de comportamento parcial).

5. **Runbook de deploy e preview**
   - Ação: documentar no repositório:
     - comandos corretos de build/start;
     - variáveis obrigatórias;
     - troubleshooting de preview em branco.
   - Critério de aceite: qualquer pessoa do time consegue reproduzir local e ambiente remoto em até 10 minutos.

6. **Logs mínimos de diagnóstico no boot**
   - Ação: registrar versão, modo (`development/production`), presença de envs críticas e status de inicialização de auth.
   - Critério de aceite: incidentes de preview passam a ter telemetria básica para investigação.

## Fase 2 — Estabilidade de runtime de autenticação/rotas (alta prioridade)

7. **Blindar fluxo de sessão/autenticação para falhas de API**
   - Ação: garantir estados de carregamento/erro sem loop infinito em providers/guards de auth.
   - Critério de aceite: dashboard não fica preso em loading quando endpoint de user falhar.

8. **Revisar redirecionamentos condicionais com dados parciais**
   - Ação: bloquear redirects prematuros enquanto `userInfo/signatureInfo` estiverem incompletos.
   - Critério de aceite: ausência de loops de redirect e de "Maximum update depth exceeded".

9. **Error Boundary global de fallback**
   - Ação: fallback amigável para erros de renderização, com botão de recarregar.
   - Critério de aceite: usuário não vê "tela branca" em crash de runtime.

## Fase 3 — Qualidade contínua e performance (média prioridade)

10. **Eliminar erros reais de lint em `src/**`**
    - Ação: atacar primeiro arquivos de base (`queryClient`, `supabase/middleware`, `shims`, `utils`).
    - Critério de aceite: `pnpm lint` finaliza sem erros.

11. **Reduzir bundle inicial**
    - Ação: mapear páginas/componentes pesados e aplicar `lazy/dynamic import` + split por domínio.
    - Critério de aceite: reduzir chunk principal e melhorar métricas de carregamento.

12. **Quality gate de PR**
    - Ação: CI obrigatória com `build`, `lint`, e smoke test de rotas públicas/protegidas.
    - Critério de aceite: merge bloqueado quando regressão impedir preview/deploy.

---

## Backlog técnico sugerido (execução em paralelo)

- [ ] Remover dependências e artefatos legados de migração não utilizados.
- [ ] Revisar shim de APIs `next/*` e planejar substituição gradual por APIs nativas Vite/React Router.
- [ ] Criar smoke test E2E para login, dashboard e fluxo de pagamento.
- [ ] Definir SLO de disponibilidade de preview e SLA de correção.

## Definição de pronto (DoD) da estabilização

A plataforma será considerada estável quando:

- `pnpm build` passar no CI e no ambiente de deploy.
- `pnpm start` publicar preview funcional sem erro de build ausente.
- `pnpm lint` não reportar erros em `src/**`.
- Fluxo de login + redirecionamento para dashboard ocorrer sem loop/blank screen.
- Variáveis de ambiente obrigatórias estiverem validadas e documentadas.
