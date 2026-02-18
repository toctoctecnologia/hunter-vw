import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ymdLocal } from '@/lib/datetime';

export default function PerfilTermosPage() {
  const [activeSection, setActiveSection] = useState('terms');

  const sections = [
    { id: 'terms', title: 'Termos de Uso', version: '2.1' },
    { id: 'privacy', title: 'Política de Privacidade', version: '1.8' },
    { id: 'cookies', title: 'Política de Cookies', version: '1.2' },
    { id: 'data', title: 'Proteção de Dados', version: '1.5' }
  ];

  const updates = [
    {
      date: '15/01/2024',
      version: '2.1',
      title: 'Termos de Uso',
      changes: [
        'Atualização nas políticas de cancelamento',
        'Novos termos para integração com IA',
        'Clarificação sobre uso de dados'
      ]
    },
    {
      date: '03/12/2023',
      version: '1.8',
      title: 'Política de Privacidade',
      changes: [
        'Adequação à LGPD',
        'Novos direitos do usuário',
        'Processos de exclusão de dados'
      ]
    }
  ];

  const termsContent = {
    terms: {
      title: 'Termos de Uso',
      lastUpdate: '15/01/2024',
      content: [
        {
          section: '1. Aceitação dos Termos',
          content: 'Ao acessar e usar a plataforma TocToc, você aceita estar vinculado a estes Termos de Uso. A plataforma é direcionada exclusivamente para pessoas jurídicas com CNPJ válido. Se você não concordar com qualquer parte destes termos ou procura um serviço para atuação individual como corretor autônomo, não deverá usar nossos serviços.'
        },
        {
          section: '2. Descrição do Serviço',
          content: 'A TocToc oferece uma plataforma completa para gestão imobiliária para empresas com CNPJ, incluindo CRM, gestão de leads, marketing digital e automação de processos para times e operações corporativas. A plataforma não é destinada a cadastros pessoais com CPF ou uso individual por corretores autônomos.'
        },
        {
          section: '3. Conta de Usuário',
          content: 'Para utilizar nossos serviços, você deve criar uma conta fornecendo informações empresariais precisas e completas, incluindo razão social e CNPJ. Contas registradas apenas com CPF ou em nome de corretores autônomos não são elegíveis. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta.'
        },
        {
          section: '4. Uso Aceitável',
          content: 'Você concorda em usar nossos serviços apenas para fins legítimos e de acordo com todas as leis aplicáveis. É proibido usar a plataforma para atividades ilegais, spam, qualquer forma de abuso ou finalidades diferentes da operação empresarial imobiliária para a qual o CNPJ foi cadastrado.'
        },
        {
          section: '5. Propriedade Intelectual',
          content: 'Todos os direitos de propriedade intelectual da plataforma TocToc pertencem a nós ou aos nossos licenciadores. Você não pode copiar, modificar ou distribuir nosso conteúdo sem autorização expressa.'
        },
        {
          section: '6. Cancelamento',
          content: 'Você pode cancelar sua conta a qualquer momento através das configurações da plataforma. O cancelamento será efetivo ao final do período de cobrança atual.'
        }
      ]
    },
    privacy: {
      title: 'Política de Privacidade',
      lastUpdate: '03/12/2023',
      content: [
        {
          section: '1. Informações que Coletamos',
          content: 'Coletamos informações que você nos fornece diretamente, com foco em dados empresariais, como razão social, CNPJ, informações de contato corporativas e dados de uso da plataforma.'
        },
        {
          section: '2. Como Usamos suas Informações',
          content: 'Utilizamos suas informações para fornecer, manter e melhorar nossos serviços, processar transações e comunicar com você sobre sua conta empresarial. Não utilizamos dados pessoais de CPF para fins de identificação principal e não ofertamos o serviço para corretores autônomos ou pessoas físicas.'
        },
        {
          section: '3. Compartilhamento de Informações',
          content: 'Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto conforme descrito nesta política ou com seu consentimento. Quando há compartilhamento com parceiros, ele se limita a dados corporativos vinculados ao CNPJ cadastrado.'
        },
        {
          section: '4. Seus Direitos (LGPD)',
          content: 'Você tem direito de acessar, corrigir, excluir ou portar seus dados pessoais. Também pode solicitar a limitação do processamento ou se opor ao tratamento de seus dados, inclusive quanto a qualquer dado pessoal eventualmente coletado além do necessário para a operação empresarial com CNPJ.'
        }
      ]
    },
    cookies: {
      title: 'Política de Cookies',
      lastUpdate: '20/11/2023',
      content: [
        {
          section: '1. O que são Cookies',
          content: 'Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita nosso site. Eles nos ajudam a melhorar sua experiência.'
        },
        {
          section: '2. Tipos de Cookies que Usamos',
          content: 'Utilizamos cookies essenciais para o funcionamento do site, cookies de desempenho para análise de uso e cookies de funcionalidade para personalização.'
        },
        {
          section: '3. Gerenciamento de Cookies',
          content: 'Você pode controlar e gerenciar cookies através das configurações do seu navegador. Note que desabilitar cookies pode afetar a funcionalidade do site.'
        }
      ]
    },
    data: {
      title: 'Proteção de Dados',
      lastUpdate: '10/01/2024',
      content: [
        {
          section: '1. Compromisso com a Segurança',
          content: 'Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.'
        },
        {
          section: '2. Retenção de Dados',
          content: 'Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados ou conforme exigido por lei.'
        },
        {
          section: '3. Transferência Internacional',
          content: 'Quando necessário, podemos transferir seus dados para outros países, sempre garantindo nível adequado de proteção conforme a legislação aplicável.'
        }
      ]
    }
  };

  const downloadDocument = (type: string) => {
    // Simular download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${type}-toctoc-${ymdLocal()}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/perfil" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Termos e Políticas</h1>
              <p className="text-gray-500">Documentos legais e políticas da plataforma</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${
                      activeSection === section.id
                        ? 'bg-[hsl(var(--accent))] text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section.title}</span>
                      <span className={`text-xs ${
                        activeSection === section.id ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        v{section.version}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atualizações Recentes</h3>
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <div key={index} className="border-l-2 border-[hsl(var(--accent))] pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{update.date}</span>
                    </div>
                    <h4 className="font-medium text-gray-900">{update.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">Versão {update.version}</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {update.changes.map((change, changeIndex) => (
                        <li key={changeIndex}>• {change}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
              <div className="space-y-3">
                <button
                  onClick={() => downloadDocument(activeSection)}
                  className="w-full flex items-center gap-3 p-3 bg-[hsl(var(--accent))] text-white rounded-xl hover:bg-[hsl(var(--accentHover))] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Baixar PDF</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[hsl(var(--accent))] transition-colors">
                  <ExternalLink className="w-4 h-4 text-[hsl(var(--accent))]" />
                  <span className="text-sm font-medium text-gray-900">Versão Web</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {termsContent[activeSection as keyof typeof termsContent].title}
                  </h2>
                  <p className="text-gray-400">
                    Última atualização: {termsContent[activeSection as keyof typeof termsContent].lastUpdate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Versão</span>
                  <span className="px-2 py-1 bg-[hsl(var(--accent))] text-white text-xs rounded-lg">
                    {sections.find(s => s.id === activeSection)?.version}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {termsContent[activeSection as keyof typeof termsContent].content.map((item, index) => (
                  <div key={index} className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{item.section}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>

              {/* Footer Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-800">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[hsl(var(--accent))]" />
                    <p className="text-sm text-white font-medium">Informações Importantes</p>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• Estes documentos são regidos pelas leis brasileiras</p>
                    <p>• Alterações entram em vigor após notificação de 30 dias</p>
                    <p>• Para dúvidas, entre em contato: juridico@toctoc.com.br</p>
                    <p>• Estes termos foram atualizados para conformidade com a LGPD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
