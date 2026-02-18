import { useState } from 'react';
import PortalLayout from '@/layouts/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CalendarClock,
  CreditCard,
  FileText,
  Home,
  KeyRound,
  Mail,
  MessageSquare,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

const kpis = [
  { label: 'Faturas pendentes', value: '1', detail: 'Vence em 10/12', icon: CalendarClock },
  { label: 'Pagamentos em dia', value: '98%', detail: 'Últimos 6 meses', icon: CreditCard },
  { label: 'Chamados abertos', value: '2', detail: 'Manutenção em andamento', icon: Wrench },
  { label: 'Contrato ativo', value: '1', detail: 'Renovação em 2025', icon: FileText },
];

const invoices = [
  { id: 'FAT-2401', period: 'Dezembro/2024', value: 'R$ 2.950', due: '10/12/2024', status: 'Pendente' },
  { id: 'FAT-2394', period: 'Novembro/2024', value: 'R$ 2.950', due: '10/11/2024', status: 'Pago' },
];

const tickets = [
  { id: 'CH-102', title: 'Ar-condicionado', status: 'Em andamento', updated: 'Hoje, 09:20' },
  { id: 'CH-097', title: 'Pintura da sala', status: 'Agendado', updated: 'Ontem, 15:05' },
  { id: 'CH-091', title: 'Troca de lâmpada', status: 'Concluído', updated: '03/11' },
];

const property = {
  name: 'Apartamento Harmonia',
  address: 'Rua do Parque, 120 • Apt 84 • Bloco B',
  status: 'Locado',
  photos: [
    '/uploads/420741d3-1afb-4cde-bd28-312f04f47e20.png',
    '/uploads/47b7063f-32d7-438c-ae6c-d63f71074c28.png',
    '/uploads/495df036-7e12-41ee-82d0-f0fff9093e78.png',
  ],
};

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    'Pendente': 'bg-amber-500/15 text-amber-200 border border-amber-500/30',
    'Pago': 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
    'Em andamento': 'bg-blue-500/15 text-blue-200 border border-blue-500/30',
    'Agendado': 'bg-purple-500/15 text-purple-200 border border-purple-500/30',
    'Concluído': 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
    'Locado': 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
  };
  return <Badge className={`rounded-full px-3 py-1 text-xs ${styles[status] ?? ''}`}>{status}</Badge>;
};

const PortalLocatariosPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <PortalLayout
      title="Portal do Locatário"
      subtitle="Acesse faturas, solicitações e informações do seu imóvel."
    >
      {!isLoggedIn ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Entrar no portal</CardTitle>
              <p className="text-sm text-white/60">
                Use o e-mail cadastrado para visualizar seu contrato e cobranças.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/60">E-mail</label>
                <Input placeholder="locatario@exemplo.com" className="bg-white/10 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/60">Senha</label>
                <Input type="password" placeholder="••••••••" className="bg-white/10 border-white/10 text-white" />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-400" onClick={() => setIsLoggedIn(true)}>
                Entrar no portal
              </Button>
              <div className="flex items-center justify-between text-xs text-white/60">
                <button className="underline underline-offset-4">Esqueci minha senha</button>
                <button className="underline underline-offset-4">Criar acesso</button>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
                <p className="font-semibold text-white">Atendimento digital</p>
                <div className="mt-2 flex flex-col gap-2">
                  <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> atendimento@huntercrm.com</span>
                  <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> WhatsApp disponível 24h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-white/10 bg-gradient-to-br from-orange-500/20 via-white/5 to-white/5 text-white">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <div className="rounded-full bg-white/10 p-2">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-widest text-white/60">Portal seguro</p>
                    <p className="text-lg font-semibold">Tudo que você precisa para viver tranquilo.</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    '2ª via de boletos e recibos',
                    'Acompanhamento de chamados',
                    'Comunicados e alertas',
                    'Checklist e documentos do imóvel',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                      <ShieldCheck className="h-4 w-4 text-emerald-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-white/10 bg-white/5 text-white">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-orange-300" />
                    Pagamentos em dia
                  </div>
                  <p className="text-xs text-white/60">Receba lembretes e acompanhe vencimentos.</p>
                  <Progress value={92} className="bg-white/10" />
                  <p className="text-xs text-white/60">92% de pontualidade nos últimos meses.</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-white">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4 text-orange-300" />
                    Informações do imóvel
                  </div>
                  <p className="text-xs text-white/60">Acesse detalhes, fotos e checklist.</p>
                  <div className="flex gap-2">
                    {property.photos.map(photo => (
                      <img key={photo} src={photo} alt="Imóvel" className="h-14 w-20 rounded-lg object-cover" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className="border-white/10 bg-white/5 text-white">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-widest text-white/60">{kpi.label}</p>
                    <kpi.icon className="h-5 w-5 text-orange-300" />
                  </div>
                  <p className="text-2xl font-semibold">{kpi.value}</p>
                  <p className="text-xs text-white/60">{kpi.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-base">Faturas e cobranças</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div>
                      <p className="text-sm font-medium">{invoice.period}</p>
                      <p className="text-xs text-white/60">{invoice.id} • Vencimento {invoice.due}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-orange-200">{invoice.value}</span>
                      {getStatusBadge(invoice.status)}
                      <Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                        Ver boleto
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-base">Meu imóvel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-semibold">{property.name}</p>
                  <p className="text-xs text-white/60">{property.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(property.status)}
                  <Badge className="rounded-full bg-white/10 text-white/70">Contrato ativo</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {property.photos.map(photo => (
                    <img key={photo} src={photo} alt={property.name} className="h-20 w-full rounded-lg object-cover" />
                  ))}
                </div>
                <Button variant="secondary" className="w-full bg-white/10 text-white hover:bg-white/20">
                  Ver contrato completo
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-base">Chamados de manutenção</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {tickets.map(ticket => (
                <div key={ticket.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium">{ticket.title}</p>
                  <p className="text-xs text-white/60">{ticket.updated}</p>
                  <div className="mt-3 flex items-center justify-between">
                    {getStatusBadge(ticket.status)}
                    <Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                      Detalhar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </PortalLayout>
  );
};

export default PortalLocatariosPage;
