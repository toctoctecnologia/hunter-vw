import { useState } from 'react';
import PortalLayout from '@/layouts/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  KeyRound,
  Mail,
  Phone,
  TrendingUp,
} from 'lucide-react';

const kpis = [
  { label: 'Receita mensal', value: 'R$ 128.450', icon: TrendingUp, detail: '+4,2% vs mês anterior' },
  { label: 'Imóveis administrados', value: '22', icon: Building2, detail: '18 ocupados, 4 disponíveis' },
  { label: 'Visitas no mês', value: '142', icon: Eye, detail: '32 visitas esta semana' },
  { label: 'Solicitações', value: '5', icon: Clock, detail: '2 aguardando aprovação' },
];

const properties = [
  {
    id: 'IMV-1023',
    name: 'Apartamento Harmonia',
    status: 'Ocupado',
    address: 'Rua do Parque, 120 • Apt 84',
    rent: 'R$ 4.200',
    views: 56,
    leads: 12,
    visits: 8,
    photos: [
      '/uploads/420741d3-1afb-4cde-bd28-312f04f47e20.png',
      '/uploads/47b7063f-32d7-438c-ae6c-d63f71074c28.png',
      '/uploads/495df036-7e12-41ee-82d0-f0fff9093e78.png',
    ],
  },
  {
    id: 'IMV-0871',
    name: 'Casa Solar',
    status: 'Disponível',
    address: 'Av. Atlântica, 845 • Casa 03',
    rent: 'R$ 6.800',
    views: 38,
    leads: 9,
    visits: 6,
    photos: [
      '/uploads/1ad80c17-8c8c-4dbb-9846-293afd76d673.png',
      '/uploads/52e907a5-c21f-49b6-a88f-532955fc5075.png',
      '/uploads/5ccdfdf4-1be1-4027-814b-9ceb1482c8e9.png',
    ],
  },
  {
    id: 'IMV-0944',
    name: 'Loft Jardim',
    status: 'Ocupado',
    address: 'Rua das Acácias, 302 • Loft 7',
    rent: 'R$ 3.900',
    views: 48,
    leads: 11,
    visits: 7,
    photos: [
      '/uploads/1f3e6296-858b-4299-a58e-662dd00e91ce.png',
      '/uploads/416a0755-8f26-40f8-ab3a-0ed5d82af6d6.png',
      '/uploads/0a65a9d8-6587-49d4-8729-8a46c66b1a37.png',
    ],
  },
];

const requests = [
  { id: 'REQ-223', title: 'Reparo hidráulico', property: 'Apartamento Harmonia', status: 'Em análise' },
  { id: 'REQ-219', title: 'Pintura externa', property: 'Casa Solar', status: 'Aprovado' },
  { id: 'REQ-210', title: 'Vistoria semestral', property: 'Loft Jardim', status: 'Agendado' },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    'Ocupado': 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
    'Disponível': 'bg-amber-500/15 text-amber-200 border border-amber-500/30',
    'Em análise': 'bg-blue-500/15 text-blue-200 border border-blue-500/30',
    'Aprovado': 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
    'Agendado': 'bg-purple-500/15 text-purple-200 border border-purple-500/30',
  };
  return <Badge className={`rounded-full px-3 py-1 text-xs ${styles[status] ?? ''}`}>{status}</Badge>;
};

const PortalProprietariosPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <PortalLayout
      title="Portal do Proprietário"
      subtitle="Acompanhe imóveis administrados, desempenho de divulgação e solicitações."
    >
      {!isLoggedIn ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Acessar sua conta</CardTitle>
              <p className="text-sm text-white/60">
                Entre com suas credenciais para visualizar seus imóveis e relatórios.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/60">E-mail</label>
                <Input placeholder="seuemail@exemplo.com" className="bg-white/10 border-white/10 text-white" />
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
                <p className="font-semibold text-white">Precisa de ajuda?</p>
                <div className="mt-2 flex flex-col gap-2">
                  <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> suporte@huntercrm.com</span>
                  <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> (11) 99999-0000</span>
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
                    <p className="text-sm uppercase tracking-widest text-white/60">Portal exclusivo</p>
                    <p className="text-lg font-semibold">Tudo o que o proprietário precisa em um só lugar.</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    'Relatórios de repasse e receitas',
                    'Imóveis e fotos publicadas',
                    'Indicadores de visitas e leads',
                    'Solicitações e aprovações digitais',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
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
                    <BarChart3 className="h-4 w-4 text-orange-300" />
                    Desempenho dos imóveis
                  </div>
                  <p className="text-xs text-white/60">
                    Saiba quantas visitas e leads cada imóvel recebe.
                  </p>
                  <Progress value={72} className="bg-white/10" />
                  <p className="text-xs text-white/60">72% de ocupação média no trimestre.</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-white">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="h-4 w-4 text-orange-300" />
                    Fotos e divulgação
                  </div>
                  <p className="text-xs text-white/60">
                    Atualize galerias e acompanhe portais de anúncio.
                  </p>
                  <div className="flex gap-2">
                    {properties[0].photos.slice(0, 3).map(photo => (
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

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Imóveis administrados</CardTitle>
                <p className="text-xs text-white/60">Clique para ver detalhes completos e fotos.</p>
              </div>
              <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                Exportar relatório
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{property.name}</p>
                      <p className="text-xs text-white/60">{property.address}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
                        <Eye className="h-4 w-4" /> {property.views} visualizações
                        <span>•</span> {property.leads} leads
                        <span>•</span> {property.visits} visitas
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(property.status)}
                      <span className="text-sm font-semibold text-orange-200">{property.rent}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {property.photos.map((photo) => (
                      <img key={photo} src={photo} alt={property.name} className="h-20 w-28 rounded-lg object-cover" />
                    ))}
                    <Button variant="secondary" className="h-20 bg-white/10 text-white hover:bg-white/20">
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-base">Solicitações e aprovações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {requests.map(request => (
                  <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div>
                      <p className="text-sm font-medium">{request.title}</p>
                      <p className="text-xs text-white/60">{request.property} • {request.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(request.status)}
                      <Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                        Detalhar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-base">Documentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Extrato de repasses - Outubro',
                  'Relatório de visitas - Novembro',
                  'Contrato de administração',
                ].map(item => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                    <span className="flex items-center gap-2 text-white/80">
                      <FileText className="h-4 w-4 text-orange-300" />
                      {item}
                    </span>
                    <Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                      Baixar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default PortalProprietariosPage;
