# Ambiente de sandbox (testes externos)

Este ambiente serve para que outras plataformas consigam validar fluxos da Hunter sem depender de serviços reais.
Ele utiliza apenas mocks locais e expõe o servidor para acesso externo na rede.

## Como iniciar

1. Instale as dependências:

   ```sh
   npm install
   ```

2. Suba o ambiente sandbox (expondo o host):

   ```sh
   npm run dev:sandbox
   ```

3. Acesse a aplicação a partir de outra máquina na mesma rede usando o IP do host:

   ```text
   http://<ip-da-maquina>:5173
   ```

> Se precisar mudar a porta, defina `--port` no script ou use a variável `VITE_PORT`.

## Variáveis utilizadas

O modo sandbox carrega o arquivo `.env.sandbox` automaticamente, garantindo que:

- mocks estejam habilitados para todas as entidades principais
- logs de debug fiquem ativos
- menus de login e cadastro apareçam para facilitar a validação de telas

Caso queira customizar algo, copie o conteúdo para `.env.sandbox.local` (não versionado) e ajuste.

## Checklist rápido de validação

- Login e criação de conta disponíveis
- Cadastro e edição de leads em modo mock
- Calendário com dados mockados
- Dashboard preenchido com dados simulados

## Dicas para plataformas externas

- Execute a suíte de smoke test (se disponível) apontando para o host exposto.
- Use o navegador ou ferramentas automatizadas para validar as telas principais.

