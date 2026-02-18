# HUNTER V2

## Sobre o projeto

CRM mobile desenvolvido com Vite, React, TypeScript, shadcn-ui e Tailwind CSS.

## Como editar este código?

### Usar seu IDE preferido

Clone o repositório, instale as dependências e inicie o servidor de desenvolvimento:

```sh
git clone <SEU_GIT_URL>
cd <NOME_DO_PROJETO>
npm install
npm run dev
```

### Editar arquivos diretamente no GitHub

- Navegue até o(s) arquivo(s) desejado(s).
- Clique no botão "Edit" (ícone de lápis) no canto superior direito da visualização do arquivo.
- Faça suas alterações e confirme o commit.

### Usar GitHub Codespaces

- Acesse a página principal do repositório.
- Clique no botão "Code" (verde) próximo ao canto superior direito.
- Selecione a aba "Codespaces".
- Clique em "New codespace" para iniciar um novo ambiente.
- Edite os arquivos dentro do Codespace e faça commit e push quando terminar.

## Variáveis de ambiente

Crie um arquivo `.env` com base em `.env.example` e preencha os valores para:

- `VITE_GOOGLE_API_KEY` – Google API key usada para inicializar a Calendar API
- `VITE_GOOGLE_CLIENT_ID` – OAuth client ID do Google Calendar
- `VITE_APPLE_CALENDAR_SERVER` – URL do servidor Apple CalDAV
- `VITE_APPLE_CALENDAR_USERNAME` – Apple ID para acesso ao CalDAV
- `VITE_APPLE_CALENDAR_PASSWORD` – Senha específica de app para o CalDAV
- `VITE_CALENDAR_SYNC_INTERVAL` – intervalo padrão (em minutos) entre sincronizações
- `VITE_CALENDAR_AUTO_SYNC` – defina como `true` para habilitar sincronização automática
- `VITE_DEBUG` – habilita logs detalhados quando definido como `true`

## Alternando entre mock e backend real

Durante o desenvolvimento você pode optar por usar o backend mockado ou o backend real. Defina as variáveis em `.env.local`:

```
NEXT_PUBLIC_MOCK=1
NEXT_PUBLIC_FILES_BASEURL=http://localhost:3000
```

- Para habilitar o mock, defina `NEXT_PUBLIC_MOCK=1`.
- Para usar o backend real, defina `NEXT_PUBLIC_MOCK=0` ou remova essa variável do arquivo.
- `NEXT_PUBLIC_FILES_BASEURL` deve apontar para a URL base onde os arquivos estão hospedados.

## Linting

Antes de rodar as verificações, instale as dependências de desenvolvimento:

```sh
npm install
```

Depois execute:

```sh
npm run lint
```

## Ambiente de sandbox (testes externos)

Para permitir que outras plataformas validem os fluxos da Hunter sem serviços reais, existe um modo sandbox
que expõe o servidor na rede e habilita mocks automaticamente.

```sh
npm run dev:sandbox
```

Consulte o guia completo em [docs/SANDBOX.md](docs/SANDBOX.md).

## Cloudflare SSL Configuration

- Defina o modo SSL/TLS como **Full (strict)** no painel do Cloudflare para validar o certificado do servidor.
- Instale um certificado de origem (Origin Certificate) no servidor de aplicação para garantir a conexão segura entre o Cloudflare e a origem.
- Comandos de verificação:
  - `npm run health:ssl` — executa o script de verificação de SSL do projeto.
  - `curl -I https://seu-dominio` — confirma o status `HTTP/2` e detalhes do certificado.
- Faixas de IP da Cloudflare:
  - https://www.cloudflare.com/ips-v4
  - https://www.cloudflare.com/ips-v6
- Para troubleshooting, consulte [diagnostics/AGENDA_SSL.md](diagnostics/AGENDA_SSL.md).

## Notas de refatoração do campo “Valor”

O componente `EditLeadFieldDialog` proporciona a mesma experiência em desktop e mobile ao alternar automaticamente entre **Dialog** e **Drawer**. O exemplo abaixo mostra como o campo “Valor” foi refatorado para usar esse componente:

```diff
-<Input
-  value={value}
-  onChange={(e) => setValue(e.target.value)}
-  placeholder="R$ 0,00"
-/>
+<EditLeadFieldDialog
+  open={isOpen}
+  onOpenChange={setIsOpen}
+  title="Editar valor"
+  form={form}
+  onSubmit={onSubmit}
+>
+  <FormField
+    control={form.control}
+    name="value"
+    render={({ field }) => (
+      <FormItem>
+        <FormControl>
+          <Input
+            {...field}
+            onChange={(e) => field.onChange(formatCurrency(e.target.value))}
+            placeholder="R$ 0,00"
+          />
+        </FormControl>
+        <FormMessage />
+      </FormItem>
+    )}
+  />
+</EditLeadFieldDialog>
```

`EditLeadFieldDialog` detecta a largura da viewport e alterna entre modal e drawer, permitindo que o mesmo código funcione em telas grandes e pequenas.
