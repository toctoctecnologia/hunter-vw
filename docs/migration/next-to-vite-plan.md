# Plano técnico de migração: Next.js → Vite (Fase 1)

## 1) Escopo da Fase 1

Objetivo da fase inicial: migrar para Vite apenas o fluxo com maior impacto de uso diário e menor dependência de SSR, mantendo APIs e integrações críticas operacionais.

### Rotas/telas incluídas

#### Público/Auth
- `/auth` (entrada de autenticação)
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/confirm-informations`
- `/auth/finish-register`
- `/auth/sign-up-success`
- `/auth/error`
- `/auth/mobile/confirm`
- `/auth/mobile/success`
- `/privacy-policy`

#### Protegido (núcleo operacional)
- `/dashboard`
- `/dashboard/profile`
- `/dashboard/calendar`
- `/dashboard/manage-leads`
- `/dashboard/manage-properties`
- `/dashboard/properties`
- `/dashboard/sales`
- `/dashboard/notifications`

### Fora de escopo na Fase 1
- Rotas administrativas avançadas (`/sadm-dashboard/**`)
- Módulos de distribuição e fluxos especializados (`/dashboard/distribution/**`, relatórios avançados e cadastros de alta complexidade)
- Endpoints server-only originalmente em `app/api/**` que exigem runtime Node dedicado (permanecem no backend atual durante a fase)
- Qualquer tela com dependência explícita de SSR para SEO transacional

---

## 2) Critérios de aceitação

A release da Fase 1 só pode ser aprovada quando **todos** os critérios abaixo estiverem atendidos:

### Build de produção
- `npm run build` (Vite) finaliza sem erro.
- Bundle gerado com sourcemap desabilitado em produção (ou conforme padrão do projeto).
- Não há erro crítico de tipagem/lint bloqueante no pipeline configurado para release.

### Execução via `vite preview`
- `npm run preview` sobe com sucesso na porta configurada.
- Refresh de rotas SPA não resulta em 404 (fallback de servidor validado).
- Assets estáticos e variáveis de ambiente obrigatórias carregam corretamente.

### Login
- Login com credenciais válidas gera sessão ativa.
- Login inválido exibe mensagem de erro funcional sem quebrar estado da aplicação.
- Logout remove sessão local e bloqueia acesso a páginas protegidas.

### Rotas protegidas
- Rotas em `/dashboard/**` exigem sessão válida.
- Usuário não autenticado é redirecionado para `/auth`.
- Deep-link em rota protegida funciona após autenticação (retorno ao destino esperado).

### Integrações
- Supabase Auth (ou provedor atual) funcionando para sign-in/sign-out e recuperação de sessão.
- Integrações principais de negócio na Fase 1 (ex.: leitura/escrita de dados em dashboard) operando sem regressão crítica.
- Eventos de erro de integração são registrados com observabilidade mínima (logs/monitoramento definidos pelo time).

---

## 3) Estratégia de rollback por release

### Princípios
- Cada release de migração é entregue por **feature flag de roteamento** (`MIGRATION_VITE_PHASE1=true/false`).
- Rollback deve ser **configuracional** (sem novo deploy de código, quando possível).

### Plano operacional por versão
1. **R-1 (pré-cutover)**
   - Publicar build Vite e Next em paralelo.
   - Habilitar roteamento Vite apenas para ambiente interno/staging.

2. **R0 (cutover controlado)**
   - Ativar flag para 5% dos usuários (ou tenant piloto).
   - Monitorar KPIs por 30–60 min: taxa de login, erro JS, latência de API, taxa de abandono.

3. **R+1 (expansão)**
   - Aumentar para 25% → 50% → 100% conforme estabilidade.

4. **Rollback**
   - Critérios gatilho: aumento de erro crítico acima do limite acordado, falha de autenticação, quebra em fluxo de receita.
   - Ação: desativar `MIGRATION_VITE_PHASE1`; tráfego retorna ao app Next imediatamente.
   - Pós-rollback: abrir incidente, registrar causa raiz preliminar em até 2h e plano de correção em até 24h.

---

## 4) Matriz de riscos

| Risco | Impacto | Probabilidade | Sinal de detecção | Mitigação | Plano de contingência |
|---|---|---|---|---|---|
| Perda de SSR em telas migradas | Médio/Alto | Média | Queda de performance em primeiro carregamento e/ou indexação | Priorizar páginas não dependentes de SSR na Fase 1; otimizar code-splitting e prefetch | Reverter rota afetada para Next via flag |
| Impacto de SEO | Médio | Baixa/Média | Queda em impressões/clicks orgânicos | Manter páginas SEO-sensíveis fora da Fase 1; validar metatags e sitemap | Retornar páginas públicas críticas ao Next |
| Middleware de proteção não replicado | Alto | Média | Acesso indevido a rota protegida ou redirecionamento incorreto | Implementar guardas de rota no cliente + validação de sessão no backend | Desativar fase e restaurar fluxo original |
| Regressão de autenticação | Alto | Média | Falhas de login/sessão expirada indevidamente | Testes E2E de auth; validação de refresh token; telemetria | Rollback imediato e bloqueio de rollout |
| Divergência em integrações (API/contracts) | Alto | Média | Erros 4xx/5xx em módulos do dashboard | Congelar contratos durante janela de migração; smoke tests por integração | Isolar módulo com erro e redirecionar para experiência legada |

---

## 5) Cronograma por marcos com responsáveis

> Datas ilustrativas; ajustar no planejamento oficial da squad.

| Marco | Janela | Entregável | Responsável primário | Apoio |
|---|---|---|---|---|
| M1 — Descoberta e recorte | Semana 1 | Inventário de rotas, dependências e definição final de escopo da Fase 1 | Tech Lead Front-end | PM, QA |
| M2 — Base técnica Vite | Semana 2 | Setup de build, ambiente, roteamento SPA, guards iniciais e observabilidade | Front-end Engineer A | DevOps |
| M3 — Migração Auth + Dashboard core | Semanas 3–4 | Telas de auth e dashboard núcleo migradas e funcionais | Front-end Engineer B | Front-end Engineer A |
| M4 — QA integrado e hardening | Semana 5 | Testes funcionais, regressão e correções de estabilidade | QA Engineer | Front-end, Back-end |
| M5 — Cutover progressivo | Semana 6 | Rollout controlado com feature flag e monitoramento | Tech Lead Front-end | SRE/DevOps, PM |
| M6 — Encerramento da fase | Semana 7 | Go/No-Go formal e relatório de lições aprendidas | Engineering Manager | Toda a squad |

## Responsabilidades (RACI simplificado)
- **Accountable:** Tech Lead Front-end
- **Responsible:** Engenheiros Front-end da migração
- **Consulted:** Back-end, DevOps/SRE, Segurança
- **Informed:** PM, Suporte/CS, Stakeholders de produto
