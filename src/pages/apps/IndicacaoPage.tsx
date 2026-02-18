import { useState } from 'react';
import { StandardLayout } from '@/layouts/StandardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Gift, 
  Users, 
  DollarSign, 
  Shield, 
  Server, 
  Mail, 
  Briefcase, 
  Globe,
  ChevronDown,
  Edit,
  HelpCircle
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';

export default function IndicacaoPage() {
  const [activeTab, setActiveTab] = useState('indique');
  const { toast } = useToast();

  const referralLink = 'https://hostinger.com.br?REFERRALCODE=ESMTOCTOCHS5';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Link copiado!',
      description: 'O link de indicação foi copiado para a área de transferência.',
    });
  };

  const services = [
    {
      title: 'Hospedagem de sites',
      description: 'A hospedagem de sites é ideal para sites pessoais, de negócios e lojas virtuais. Inclui domínio grátis, e-mail profissional e migração de site. Além disso, aproveite os backups semanais automáticos para recuperar seus dados com facilidade.',
      commission: '50%',
      maxValue: '$70',
      discount: '20%',
      badge: 'BLACK FRIDAY ANTECIPADA',
      categories: ['Hospedagem'],
      items: [
        { name: 'Hospedagem de sites', icon: Globe },
        { name: 'Hospedagem Cloud', icon: Server },
        { name: 'Hospedagem para agências', icon: Briefcase },
        { name: 'Servidor VPS', icon: Server },
      ]
    },
    {
      title: 'Sites',
      categories: ['Sites'],
      items: [
        { name: 'Criador de sites', icon: Globe },
        { name: 'Hostinger Hosting', icon: Server },
      ]
    },
    {
      title: 'E-mail',
      categories: ['E-mail'],
      items: [
        { name: 'E-mail Business', icon: Mail },
        { name: 'E-mail marketing com a Reach', icon: Mail },
      ]
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Você envia um convite',
      description: 'Envie um link de indicação para seu contato para que ele(a) possa escolher um plano. Ou você pode escolher para ele(a).'
    },
    {
      number: 2,
      title: 'Eles compram um plano',
      description: 'Ganhe recompensas quando eles comprarem planos de hospedagem, VPS e de e-mail.'
    },
    {
      number: 3,
      title: 'Você recebe pagamento',
      description: 'Escolha entre PayPal, transferência bancária ou créditos na Hostinger.'
    }
  ];

  const faqs = [
    {
      question: 'Quais serviços são aplicáveis para comissões de indicação?',
      answer: 'Você pode ganhar comissões indicando planos de hospedagem compartilhada, VPS, Cloud, e-mail business e e-mail marketing.'
    },
    {
      question: 'Posso indicar um cliente existente?',
      answer: 'Não, apenas novos clientes que nunca tiveram uma conta conosco são elegíveis para o programa de indicação.'
    },
    {
      question: 'Qual é a diferença entre o programa de indicação e o programa de afiliados?',
      answer: 'O programa de indicação é para clientes que querem compartilhar com amigos. O programa de afiliados é para criadores de conteúdo e profissionais de marketing.'
    },
    {
      question: 'Por que meu código de indicação não funciona?',
      answer: 'Verifique se o código foi copiado corretamente e se a pessoa ainda não possui uma conta. Entre em contato com o suporte se o problema persistir.'
    },
    {
      question: 'Por que demora 45 dias para receber minha comissão?',
      answer: 'O período de 45 dias garante que não haja chargebacks ou reembolsos, protegendo tanto você quanto a empresa.'
    },
    {
      question: 'Quanto preciso receber em comissões para me qualificar para os pagamentos?',
      answer: 'O valor mínimo para saque é de $50 USD em comissões acumuladas.'
    },
    {
      question: 'Quando vou receber minhas comissões?',
      answer: 'As comissões são processadas mensalmente após o período de confirmação de 45 dias.'
    },
    {
      question: 'Meu pagamento foi recusado pelo PayPal. Por que isso aconteceu e o que devo fazer?',
      answer: 'Verifique se sua conta PayPal está ativa e verificada. Entre em contato com o suporte do PayPal e depois com nosso time se o problema continuar.'
    },
    {
      question: 'Como meus amigos podem receber descontos com meu link de indicação?',
      answer: 'Automaticamente! Quando eles clicarem no seu link, receberão 20% de desconto na primeira compra.'
    }
  ];

  return (
    <StandardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Programa de Indicação</h1>
            <p className="text-sm text-gray-600 mt-1">Indique amigos e ganhe recompensas</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="indique">Indique e lucre</TabsTrigger>
            <TabsTrigger value="ganhos">Meus ganhos</TabsTrigger>
          </TabsList>

          <TabsContent value="indique" className="space-y-8">
            {/* Banner Black Friday */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 text-white">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">
                  Oferta antecipada de Black Friday: ganhe 50% de comissão. Receba até US$500 hoje mesmo!
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <p className="text-sm text-white/80">{referralLink}</p>
                  </div>
                  <Button onClick={copyLink} className="bg-purple-600 hover:bg-purple-700 px-6">
                    <Edit className="h-4 w-4 mr-2" />
                    Copiar link
                  </Button>
                </div>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
                <div className="text-[200px] font-bold">%</div>
              </div>
            </div>

            {/* Serviços */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Sabe o que seu amigo(a) precisa? Indique o serviço exato.</h3>
              
              <div className="grid gap-6">
                {services.map((service, idx) => (
                  <div key={idx} className="rounded-2xl border border-[var(--ui-stroke)] bg-[var(--ui-surface)] p-6">
                    <div className="grid md:grid-cols-[1fr,300px] gap-6">
                      <div className="space-y-4">
                        {service.badge && (
                          <div className="flex items-center gap-3">
                            <span className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                              {service.badge}
                            </span>
                            <span className="text-sm text-[var(--ui-text-subtle)]">{service.title}</span>
                          </div>
                        )}
                        
                        <h4 className="text-xl font-semibold">Seguro, rápido e confiável</h4>
                        
                        {service.description && (
                          <p className="text-[var(--ui-text-subtle)]">{service.description}</p>
                        )}

                        {service.commission && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-purple-600">
                              <Gift className="h-5 w-5" />
                              <span className="font-medium">
                                Ganhe <strong>{service.commission}</strong> por indicação - até <strong>{service.maxValue}</strong> USD
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--ui-text-subtle)]">
                              <Gift className="h-5 w-5" />
                              <span>Sua indicação recebe <strong>{service.discount}</strong> de desconto também</span>
                            </div>
                          </div>
                        )}

                        {idx === 0 && (
                          <Button className="bg-black text-white hover:bg-black/90">
                            Indicar hospedagem de sites
                          </Button>
                        )}

                        <p className="text-sm text-[var(--ui-text-subtle)]">
                          Você ganha recompensas se seu amigo comprar o <strong>plano de e-mail profissional por 12 meses ou mais pela primeira vez</strong>. As comissões são confirmadas após <strong>45 dias</strong> e pagas assim que o valor mínimo de pagamento for atingido.{' '}
                          <a href="#" className="text-purple-600 hover:underline">Leia nossos termos de serviço</a>
                        </p>
                      </div>

                      <div className="space-y-3">
                        {service.categories.map((category) => (
                          <div key={category}>
                            <h5 className="text-sm font-medium text-[var(--ui-text-subtle)] mb-3">{category}</h5>
                            <div className="space-y-2">
                              {service.items.map((item) => (
                                <button
                                  key={item.name}
                                  className="w-full flex items-center justify-between p-3 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors"
                                >
                                  <span className="font-medium text-sm">{item.name}</span>
                                  <Shield className="h-4 w-4 text-green-600" />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Como funciona */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Como funcionam as indicações?</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {steps.map((step) => (
                  <div key={step.number} className="rounded-2xl border border-[var(--ui-stroke)] bg-[var(--ui-surface)] p-6 space-y-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">
                      {step.number}
                    </div>
                    <h4 className="text-lg font-semibold">{step.title}</h4>
                    <p className="text-[var(--ui-text-subtle)]">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Estatísticas */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-purple-800 p-8 text-white">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-lg mb-2">Mais de 120 mil pessoas <span className="text-yellow-300 font-semibold">indicaram nossos serviços</span></p>
                </div>
                <div>
                  <p className="text-lg mb-2">Mais de US$ 4 milhões em <span className="text-yellow-300 font-semibold">comissões pagas</span></p>
                </div>
                <div>
                  <p className="text-lg">Ganhe <span className="text-yellow-300 font-semibold">US$395 em média por ano</span></p>
                </div>
              </div>
            </div>

            {/* CTA Final */}
            <div className="rounded-2xl border border-[var(--ui-stroke)] bg-[var(--ui-surface)] p-8 text-center space-y-6">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="relative inline-block">
                  <DollarSign className="h-24 w-24 text-purple-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold">
                  Indique seu primeiro cliente agora e ganhe uma comissão de 20%
                </h3>
                <p className="text-[var(--ui-text-subtle)]">
                  Eles também ganharão um desconto de 20%.
                </p>
                <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
                  <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                    <p className="text-sm text-gray-600">{referralLink}</p>
                  </div>
                  <Button onClick={copyLink} className="bg-purple-600 hover:bg-purple-700">
                    Copiar link
                  </Button>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Perguntas frequentes sobre Indique e Ganhe</h3>
              
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, idx) => (
                  <AccordionItem 
                    key={idx} 
                    value={`item-${idx}`}
                    className="rounded-xl border border-[var(--ui-stroke)] bg-[var(--ui-surface)] px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-[var(--ui-text-subtle)] pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="ganhos" className="space-y-8">
            {/* Header com saldo */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Recompensas</h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--ui-stroke)] bg-[var(--ui-surface)]">
                <Gift className="h-5 w-5" />
                <span className="font-medium">Saldo Hostinger:</span>
                <span className="font-bold">R$0.00</span>
                <HelpCircle className="h-4 w-4 text-[var(--ui-text-subtle)]" />
              </div>
            </div>

            {/* Card de Recompensas */}
            <div className="rounded-2xl border border-[var(--ui-stroke)] bg-[var(--ui-surface)] p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">Recompensas</h3>
                  <HelpCircle className="h-5 w-5 text-[var(--ui-text-subtle)]" />
                </div>
                <span className="text-sm text-[var(--ui-text-subtle)]">$50</span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-purple-600">US$ 0</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600" style={{ width: '0%' }} />
                </div>
              </div>

              <p className="text-[var(--ui-text-subtle)] mb-6">
                Você ainda não tem comissões aprovadas
              </p>

              <p className="text-sm text-[var(--ui-text-subtle)]">
                Adicionar método de pagamento:{' '}
                <a href="#" className="text-purple-600 hover:underline font-medium">PayPal</a> ou{' '}
                <a href="#" className="text-purple-600 hover:underline font-medium">Transferência bancária</a> ou{' '}
                <a href="#" className="text-purple-600 hover:underline font-medium">Saldo Hostinger</a>
              </p>
            </div>

            {/* Cards laterais */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[var(--ui-stroke)] bg-[var(--ui-surface)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">$0</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">Total pago</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--ui-stroke)] bg-[var(--ui-surface)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">Total de indicados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ilustração e CTA */}
            <div className="rounded-2xl border border-[var(--ui-stroke)] bg-[var(--ui-surface)] p-12 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-purple-100 rounded-full blur-3xl opacity-50" />
                  <DollarSign className="relative h-32 w-32 text-purple-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold">
                  Indique seu primeiro cliente agora e ganhe uma comissão de 20%
                </h3>
                <p className="text-[var(--ui-text-subtle)]">
                  Eles também ganharão um desconto de 20%.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex-1 max-w-xl bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                    <p className="text-sm text-gray-600">{referralLink}</p>
                  </div>
                  <Button onClick={copyLink} className="bg-purple-600 hover:bg-purple-700">
                    Copiar link
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </StandardLayout>
  );
}
