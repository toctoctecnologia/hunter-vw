# Onboarding wizard mock API

The onboarding wizard uses mocked APIs under `src/api/onboarding.ts` so the flows can be exercised end-to-end while the real
services are still under development. Replace these mocks when the backend endpoints are available.

## Available helpers

- `checkCnpjUnique(cnpj: string)` – simulates a backoffice validation that ensures a CNPJ can open a new account.
  - Returns `{ isUnique: boolean, reason?: string }`.
  - Uses a 600ms artificial latency.
- `lookupCnpj(cnpj: string)` – mocks a Receita Federal lookup to pre-fill the company form.
  - Returns company data when the CNPJ exists in the mock dataset, otherwise `null` after ~700ms.
- `register(draft: OnboardingDraft)` – mocks the final onboarding submission.
  - Throws `OnboardingRegistrationError` with codes `CNPJ_CONFLICT` or `EMAIL_CONFLICT` when the draft violates a rule.
  - Resolves after ~1.2s with `{ ok: true, protocol, activationEta }` when successful.

The module also exports the internal `__mockOnboarding` map which centralises the in-memory fixtures and can be reused by
tests.

## Fixtures and guardrails

The following identifiers are reserved inside the mock layer:

| Type | Value | Behaviour |
| ---- | ----- | --------- |
| Blocked CNPJ | `11.222.333/0001-81` | Fails the uniqueness check with the message _"Cadastro ativo na TocToc..."_. |
| Lookup CNPJ | `27.865.757/0001-02` | Auto-preenche razão social, IE, IM, número de unidades e site. |
| Lookup CNPJ (filial) | `48.799.532/0001-44` | Retorna uma filial com dados da matriz (`27.865.757/0001-02`). |
| Duplicated email | `contato@vivalarimoveis.com.br` | Faz o `register` lançar `EMAIL_CONFLICT`. |
| Duplicated email | `admin@toctoc.com` | Também bloqueado pelo mock. |

When connecting to the real services, replace the datasets above with live calls while preserving the interfaces exposed
by the helpers para que a interface continue funcionando sem alterações.
