'use client';
import { PublicHeader } from '@/shared/components/layout/public-header';
import { EMAIL_CONTACT } from '@/shared/constants';

export default function Page() {
  return (
    <>
      <PublicHeader title="Política de Privacidade Hunter CRM" />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-4">Política de Privacidade Hunter CRM</h1>
          <p className="text-sm text-muted-foreground mb-8">Última atualização em 14/12/2025.</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Resumo da Política</h2>
            <p className="mb-4">Este resumo é uma visão rápida. Para detalhes completos, consulte as seções abaixo.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Coletamos dados cadastrais, de autenticação, técnicos e de uso, além de dados inseridos no CRM pelo
                USUÁRIO, para operar a Plataforma e prestar o serviço.
              </li>
              <li>
                Integrações opcionais com serviços de comunicação e mensageria de terceiros só tratam conteúdos e
                metadados quando o USUÁRIO habilitar e, quando aplicável, consentir, com possibilidade de revogação.
              </li>
              <li>
                Usamos dados para execução do contrato, segurança, prevenção a fraudes, suporte, melhoria do serviço e
                cumprimento de obrigações legais.
              </li>
              <li>
                Não comercializamos dados pessoais, compartilhamos apenas com fornecedores e suboperadores necessários,
                e com autoridades quando houver obrigação legal.
              </li>
              <li>
                O USUÁRIO pode exercer direitos previstos na LGPD e encaminhar solicitações ao email
                {EMAIL_CONTACT}.
              </li>
              <li>
                O USUÁRIO pode exportar os dados que possui na Plataforma, conforme recursos do plano e configurações,
                com limites técnicos e de segurança.
              </li>
              <li>
                Definimos prazos de retenção e exclusão, com exceções legais, de auditoria, segurança, prevenção a
                fraudes e exercício regular de direitos.
              </li>
              <li>
                Pode haver transferência internacional de dados para viabilizar infraestrutura, com salvaguardas
                contratuais e medidas de segurança compatíveis com a LGPD.
              </li>
              <li>
                Adotamos medidas técnicas e administrativas de segurança e utilizamos cookies no ambiente web para
                autenticação, segurança e preferências.
              </li>
              <li>
                O canal oficial para privacidade, proteção de dados e contato com o Encarregado é o email
                {EMAIL_CONTACT}.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Sobre esta Política</h2>
            <p className="mb-4">
              Esta Política descreve como a Hunter CRM, produto desenvolvido e operado pela Toc Toc Tecnologia Ltda.,
              trata dados pessoais no contexto dos serviços digitais oferecidos sob a marca Hunter CRM, incluindo
              Plataforma web, Aplicativo, sites, integrações, APIs e recursos de suporte.
            </p>
            <p className="mb-4">
              Ao utilizar a Plataforma, o USUÁRIO declara ciência e concordância com a Política vigente.
            </p>
            <p>
              A Hunter CRM é contratada por pessoas jurídicas identificadas por CNPJ e também pode ser utilizada por
              profissionais autônomos, como corretores, identificados por CPF. Os acessos são realizados por
              representantes, colaboradores e prepostos autorizados pela empresa contratante, ou pelo próprio
              profissional autônomo, conforme o documento informado no cadastro.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Direitos e controles dos seus dados pessoais</h2>
            <p className="mb-4">
              Nos termos da Lei Geral de Proteção de Dados, Lei nº 13.709/2018, os titulares podem exercer direitos como
              confirmação de tratamento, acesso, correção, anonimização, bloqueio, exclusão, portabilidade, informação
              sobre compartilhamentos, revogação de consentimento e oposição, quando aplicável.
            </p>
            <p className="mb-4">
              As solicitações devem ser encaminhadas ao email {EMAIL_CONTACT} e poderão exigir validação de identidade,
              vínculo com a empresa contratante e informações mínimas para localização da Conta.
            </p>
            <p className="mb-4">
              Poderemos recusar solicitações manifestamente excessivas, desproporcionais, ou que violem sigilo,
              segurança, direitos de terceiros ou obrigação legal.
            </p>
            <p>O titular também poderá apresentar reclamação à Autoridade Nacional de Proteção de Dados.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Dados pessoais que coletamos</h2>
            <p className="mb-4">Conforme o uso e as configurações do USUÁRIO, podemos tratar:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Dados cadastrais e de contato:</strong> como razão social, nome fantasia, CNPJ ou CPF (quando
                aplicável), endereço corporativo e dados de representantes para contato (nome, email, telefone).
              </li>
              <li>
                <strong>Dados de autenticação e segurança:</strong> como registros de login, tentativas de acesso,
                chaves de sessão e eventos de auditoria.
              </li>
              <li>
                <strong>Dados técnicos e de dispositivo:</strong> como navegador, sistema operacional, idioma, endereço
                IP e identificadores de sessão.
              </li>
              <li>
                <strong>Dados de uso:</strong> como logs, atividades, preferências e interações.
              </li>
              <li>
                <strong>Dados operacionais inseridos no CRM:</strong> como leads, imóveis, contatos, negociações,
                tarefas e histórico de atendimento.
              </li>
              <li>
                <strong>Dados de suporte:</strong> como registros de atendimento e evidências fornecidas.
              </li>
              <li>
                <strong>Dados de integrações habilitadas:</strong> como metadados e conteúdos necessários para manter
                histórico comercial na Plataforma, conforme permissões, configurações e, quando aplicável,
                consentimento.
              </li>
              <li>
                <strong>Dados de cobrança e pagamento:</strong> quando aplicável à contratação via web, processados por
                provedores terceirizados e vinculados ao documento do contratante (CNPJ ou CPF). Não armazenamos dados
                completos de cartão.
              </li>
              <li>
                <strong>Permissões e conteúdos do dispositivo:</strong> quando o USUÁRIO optar por usar recursos que
                dependam disso, como acesso a contatos, arquivos, imagens, câmera ou microfone. Nesses casos, a
                Plataforma solicitará permissão do sistema e tratará apenas o necessário para executar a funcionalidade
                escolhida.
              </li>
              <li>
                <strong>Áudio:</strong> quando o USUÁRIO optar por gravar ou enviar. Sempre que tecnicamente possível, o
                processamento poderá ocorrer de forma efêmera durante a sessão, sem armazenamento permanente, salvo se o
                USUÁRIO decidir anexar ou salvar no histórico comercial.
              </li>
            </ul>
            <p className="mt-4">
              Podemos receber dados de terceiros quando o USUÁRIO utilizar autenticação externa, habilitar integrações,
              importar bases ou conectar aplicativos, dentro das permissões e autorizações definidas pelo próprio
              USUÁRIO.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Finalidades e bases legais</h2>
            <p className="mb-4">
              Usamos dados pessoais, conforme o caso, com fundamento em execução de contrato, cumprimento de obrigação
              legal ou regulatória, legítimo interesse, exercício regular de direitos e consentimento, quando aplicável.
            </p>
            <p className="mb-4">As finalidades incluem:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prestar o serviço e executar funcionalidades contratadas.</li>
              <li>Administrar Conta, permissões, integrações e configurações.</li>
              <li>Garantir segurança, auditoria, prevenção a fraudes e integridade do serviço.</li>
              <li>Operar, manter e melhorar a Plataforma, incluindo diagnóstico de falhas.</li>
              <li>
                Enviar comunicações essenciais, operacionais e de segurança, e, quando permitido, comunicações
                comerciais, com preferências ajustáveis.
              </li>
              <li>Cumprir obrigações legais, atender determinações de autoridades e exercer direitos em processos.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Compartilhamento de dados</h2>
            <p className="mb-4">
              Não comercializamos dados pessoais. O compartilhamento ocorre apenas quando necessário, com:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Prestadores de serviço e suboperadores para hospedagem, infraestrutura, mensageria, autenticação,
                monitoramento, suporte, comunicação e processamento de pagamentos.
              </li>
              <li>
                Instituições financeiras e provedores de pagamento envolvidos no processamento de cobranças e
                antifraude.
              </li>
              <li>
                Autoridades públicas e terceiros, quando necessário para cumprir obrigação legal, atender ordem judicial
                ou exercer direitos.
              </li>
            </ul>
            <p className="mt-4">
              Sempre que possível, adotamos minimização, segurança e finalidade. Podemos utilizar dados agregados,
              anonimizados ou estatísticos para análises internas e melhoria do serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Retenção, exportação e exclusão</h2>
            <p className="mb-4">
              O USUÁRIO pode solicitar exportação ou exclusão de dados pela própria Plataforma, quando o painel da Conta
              disponibilizar esses recursos. Caso não esteja disponível, a solicitação poderá ser feita pelo email
              {EMAIL_CONTACT}, com informações mínimas para identificação da Conta e validação de identidade.
            </p>
            <p className="mb-4">
              Mantemos dados pelo tempo necessário para fornecer o serviço e cumprir finalidades legítimas e obrigações
              legais.
            </p>
            <p className="mb-4">
              O USUÁRIO poderá exportar os dados e informações que possui na Plataforma, conforme recursos disponíveis
              no plano e configurações habilitadas. A exportação poderá estar sujeita a autenticação, validação de
              identidade, prazos técnicos, limitações de volume e medidas de segurança.
            </p>
            <p className="mb-4">
              Alguns dados podem ser excluídos do exporte por motivos legais, de segurança, sigilo comercial, proteção
              de terceiros ou limitações técnicas, incluindo logs de segurança e registros de auditoria.
            </p>
            <p className="mb-4">
              Em caso de cancelamento ou encerramento da Conta, o USUÁRIO poderá solicitar exportação de seus dados pelo
              prazo de 30 dias contados do encerramento, ressalvadas restrições técnicas e de segurança.
            </p>
            <p className="mb-4">
              Decorrido esse prazo, poderemos excluir ou anonimizar dados associados à Conta em até 90 dias, salvo
              quando a retenção for necessária por obrigação legal ou regulatória, exercício regular de direitos,
              auditoria, prevenção a fraudes, segurança, ou determinação de autoridade competente.
            </p>
            <p>É responsabilidade do USUÁRIO realizar, antes do encerramento, backup de suas informações relevantes.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Transferência internacional</h2>
            <p>
              Podemos realizar transferência internacional de dados quando necessário para infraestrutura e prestação do
              serviço, adotando salvaguardas contratuais e medidas compatíveis com a LGPD, incluindo controles de
              acesso, criptografia e minimização.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Segurança</h2>
            <p className="mb-4">
              Adotamos medidas técnicas e administrativas adequadas para proteger dados contra acessos não autorizados,
              perda, alteração ou destruição, incluindo criptografia, controle de acesso, monitoramento e boas práticas
              de segurança da informação.
            </p>
            <p className="mb-4">
              Recomendamos que o USUÁRIO utilize credenciais fortes, não compartilhe logins, restrinja acessos por
              função e revogue acessos de colaboradores desligados. O USUÁRIO é responsável pela confidencialidade de
              suas credenciais e pela governança de acessos dentro de sua organização.
            </p>
            <p>
              Na hipótese de incidente de segurança que possa acarretar risco ou dano relevante aos titulares,
              adotaremos medidas de contenção e mitigação e realizaremos as comunicações cabíveis, inclusive ao USUÁRIO
              e, quando aplicável, à Autoridade Nacional de Proteção de Dados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Crianças</h2>
            <p>A Hunter CRM não é destinada a menores de idade.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Mudanças nesta Política</h2>
            <p className="mb-4">
              Podemos alterar esta Política a qualquer tempo. Quando houver alterações relevantes, poderemos comunicar o
              USUÁRIO por meios eletrônicos, incluindo avisos na Plataforma e comunicações ao email cadastrado.
            </p>
            <p>A data da última atualização permanecerá indicada no topo deste Documento.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Como entrar em contato</h2>
            <p>
              Dúvidas e solicitações relacionadas à privacidade e proteção de dados devem ser encaminhadas ao email
              {EMAIL_CONTACT}, canal oficial também destinado ao contato com o Encarregado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Papéis no tratamento de dados</h2>
            <p className="mb-4">
              Para fins da LGPD, a Toc Toc Tecnologia Ltda. atua, em regra, como operadora dos dados pessoais tratados
              na prestação do serviço ao USUÁRIO (pessoa jurídica contratante identificada pelo CNPJ cadastrado ou
              profissional autônomo identificado por CPF).
            </p>
            <p className="mb-4">
              O USUÁRIO, ao inserir dados pessoais de terceiros na Plataforma, atua como controlador desses dados,
              definindo finalidades e bases legais aplicáveis.
            </p>
            <p>
              Em situações específicas, a Toc Toc Tecnologia Ltda. poderá atuar como controladora de dados pessoais de
              representantes do USUÁRIO, quando necessário para cadastro, gestão contratual, suporte, segurança,
              prevenção a fraudes, cumprimento de obrigações legais e envio de comunicações relacionadas ao serviço.
              Informações de faturamento e identificação permanecem vinculadas ao documento do contratante informado no
              cadastro.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies e tecnologias semelhantes</h2>
            <p className="mb-4">
              Nos ambientes web, a Hunter CRM poderá utilizar cookies e tecnologias semelhantes para autenticação,
              segurança, preferências, métricas de uso e melhoria de desempenho.
            </p>
            <p>
              O USUÁRIO poderá gerenciar cookies conforme as configurações do navegador, ciente de que a desativação
              pode impactar funcionalidades.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disposições finais</h2>
            <p className="mb-4">
              A Hunter CRM poderá atualizar estes Termos a qualquer tempo. O uso continuado da Plataforma após
              alterações implica concordância com as novas condições.
            </p>
            <p className="mb-4">
              O USUÁRIO reconhece e concorda que o aceite eletrônico destes Termos, realizado por meio de clique,
              checkbox, autenticação digital ou outro meio eletrônico disponibilizado na Plataforma, possui validade
              jurídica e produz os mesmos efeitos do aceite físico.
            </p>
            <p className="mb-4">
              Caso qualquer cláusula destes Termos venha a ser considerada inválida, ilegal ou inexequível, tal
              invalidade não afetará as demais disposições, que permanecerão válidas e eficazes.
            </p>
            <p>
              Fica eleito o Foro da Comarca de Florianópolis, Estado de Santa Catarina, para dirimir controvérsias
              decorrentes deste Documento.
            </p>
          </section>

          <footer className="border-t pt-6 mt-8">
            <p className="text-sm text-muted-foreground">Florianópolis, 14/12/2025.</p>
            <p className="text-sm font-medium mt-2">Toc Toc Tecnologia Ltda.</p>
            <p className="text-sm text-muted-foreground">CNPJ/MF nº 55.170.984/0001-40</p>
          </footer>
        </article>
      </div>
    </>
  );
}
