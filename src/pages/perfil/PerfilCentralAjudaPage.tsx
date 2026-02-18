import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Search, BookOpen, Video, MessageCircle, ExternalLink, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PerfilCentralAjudaPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Primeiros Passos',
      description: 'Como começar a usar a plataforma',
      icon: BookOpen,
      articleCount: 12,
      articles: [
        'Como criar sua primeira conta',
        'Configuração inicial do perfil',
        'Tour pela interface',
        'Adicionando seu primeiro imóvel'
      ]
    },
    {
      id: 'leads-management',
      title: 'Indicadores de Leads',
      description: 'Tudo sobre captura e conversão de leads',
      icon: MessageCircle,
      articleCount: 18,
      articles: [
        'Como capturar leads automaticamente',
        'Organizando leads no funil de vendas',
        'Configurando follow-up automático',
        'Métricas e relatórios de conversão'
      ]
    },
    {
      id: 'property-management',
      title: 'Gestão de Imóveis',
      description: 'Cadastro e gerenciamento de propriedades',
      icon: BookOpen,
      articleCount: 15,
      articles: [
        'Cadastrando imóveis completos',
        'Upload e organização de fotos',
        'Configurando tours virtuais',
        'Sincronização com portais'
      ]
    },
    {
      id: 'integrations',
      title: 'Integrações',
      description: 'Conectando com outras ferramentas',
      icon: BookOpen,
      articleCount: 9,
      articles: [
        'Integração com WhatsApp Business',
        'Conectando com Google Calendar',
        'Configuração de API externa',
        'Webhooks e automações'
      ]
    }
  ];

  const videoTutorials = [
    {
      title: 'Tour Completo da Plataforma',
      duration: '15:32',
      views: '2.3k',
      description: 'Visão geral de todas as funcionalidades'
    },
    {
      title: 'Configurando Leads Automáticos',
      duration: '8:45',
      views: '1.8k',
      description: 'Como automatizar a captura de leads'
    },
    {
      title: 'Criando Landing Pages Eficazes',
      duration: '12:15',
      views: '1.5k',
      description: 'Dicas para converter mais visitantes'
    }
  ];

  const faqItems = [
    {
      question: 'Como alterar o plano da minha conta?',
      answer: 'Acesse Configurações > Planos e Assinatura para gerenciar seu plano.'
    },
    {
      question: 'Posso importar contatos de outro CRM?',
      answer: 'Sim, oferecemos importação via CSV, Excel e integrações diretas.'
    },
    {
      question: 'Como configurar notificações por email?',
      answer: 'Vá em Perfil > Configurações > Notificações para personalizar.'
    },
    {
      question: 'É possível integrar com redes sociais?',
      answer: 'Sim, oferecemos integração com Facebook, Instagram e outras plataformas.'
    }
  ];

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
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
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Central de Ajuda</h1>
              <p className="text-gray-500">Encontre respostas e tutoriais</p>
            </div>
          </div>
        </div>

        {/* Search */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Como podemos ajudar?</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Digite sua dúvida ou busque por um tópico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-200 dark:border-neutral-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--accent))]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias de Ajuda</h3>
              <div className="space-y-3">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.id} className="border border-gray-200 rounded-xl p-4 hover:border-[hsl(var(--accent))] transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6 text-[hsl(var(--accent))]" />
                          <h4 className="font-medium text-gray-900">{category.title}</h4>
                        </div>
                        <span className="text-sm text-gray-500">{category.articleCount} artigos</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                      <div className="space-y-1">
                        {category.articles.slice(0, 3).map((article, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[hsl(var(--accent))] cursor-pointer">
                            <ChevronRight className="w-3 h-3" />
                            {article}
                          </div>
                        ))}
                        {category.articles.length > 3 && (
                          <div className="text-sm text-[hsl(var(--accent))] hover:underline cursor-pointer">
                            Ver todos os {category.articleCount} artigos
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Video Tutorials */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tutoriais em Vídeo</h3>
              <div className="space-y-4">
                {videoTutorials.map((video, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[hsl(var(--accent))] transition-colors cursor-pointer">
                    <div className="w-16 h-12 bg-white dark:bg-neutral-900 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{video.title}</h4>
                      <p className="text-sm text-gray-600">{video.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">{video.duration}</span>
                        <span className="text-xs text-gray-500">{video.views} visualizações</span>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <Link
                  to="/perfil/suporte"
                  className="flex items-center gap-3 p-3 bg-[hsl(var(--accent))] text-white rounded-xl hover:bg-[hsl(var(--accentHover))] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">Contatar Suporte</span>
                </Link>
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[hsl(var(--accent))] transition-colors">
                  <Video className="w-5 h-5 text-[hsl(var(--accent))]" />
                  <span className="font-medium text-gray-900">Agendar Demo</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[hsl(var(--accent))] transition-colors">
                  <BookOpen className="w-5 h-5 text-[hsl(var(--accent))]" />
                  <span className="font-medium text-gray-900">Documentação</span>
                </button>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Perguntas Frequentes</h3>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ainda precisa de ajuda?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>Nossa equipe está disponível para ajudar:</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> suporte@toctoc.com.br</p>
                  <p><strong>WhatsApp:</strong> (47) 97367-3966</p>
                  <p><strong>Horário:</strong> Seg-Sex, 8h às 18h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}