import { StandardLayout } from '@/layouts/StandardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, Users, TrendingUp } from 'lucide-react';

export const PesquisasPage = () => {
  return (
    <StandardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Hunter Pesquisas</h1>
            <p className="text-sm text-gray-600 mt-1">Pesquisas de mercado e análises</p>
          </div>
          
          <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pesquisas Ativas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 esta semana</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respostas Coletadas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,847</div>
              <p className="text-xs text-muted-foreground">+234 esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68.4%</div>
              <p className="text-xs text-muted-foreground">+5.2% vs média</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,701</div>
              <p className="text-xs text-muted-foreground">+145 novos</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Surveys */}
        <Card>
          <CardHeader>
            <CardTitle>Pesquisas Recentes</CardTitle>
            <CardDescription>
              Últimas pesquisas criadas e em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Satisfação do Cliente", status: "Ativa", responses: "347", completion: "68%" },
                { name: "Preferências de Imóveis", status: "Concluída", responses: "892", completion: "100%" },
                { name: "Avaliação de Serviços", status: "Rascunho", responses: "-", completion: "0%" },
                { name: "Pesquisa de Mercado Q4", status: "Ativa", responses: "156", completion: "32%" },
                { name: "Feedback de Corretores", status: "Ativa", responses: "89", completion: "45%" },
              ].map((survey, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-[var(--ui-stroke)] rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{survey.name}</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">Status: {survey.status}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{survey.responses} respostas</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">{survey.completion} completo</p>
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