import { StandardLayout } from '@/layouts/StandardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Mail, Users, TrendingUp } from 'lucide-react';

export const DisparadorPage = () => {
  return (
    <StandardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Disparador</h1>
            <p className="text-sm text-gray-600 mt-1">Campanhas de marketing e comunicação</p>
          </div>
          
          <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 esta semana</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">E-mails Enviados</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,542</div>
              <p className="text-xs text-muted-foreground">+15% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.8%</div>
              <p className="text-xs text-muted-foreground">+2.1% vs média</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contatos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">+127 novos</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Campanhas Recentes</CardTitle>
            <CardDescription>
              Últimas campanhas de marketing criadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Promoção Imóveis", status: "Ativa", sent: "1,234", opens: "24.5%" },
                { name: "Newsletter Semanal", status: "Concluída", sent: "2,847", opens: "18.2%" },
                { name: "Novos Lançamentos", status: "Agendada", sent: "-", opens: "-" },
                { name: "Black Friday", status: "Ativa", sent: "5,632", opens: "31.7%" },
              ].map((campaign, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-[var(--ui-stroke)] rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{campaign.name}</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">Status: {campaign.status}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{campaign.sent} enviados</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">{campaign.opens} abertura</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};