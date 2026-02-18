import { AppLayout } from '@/components/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Eye, MousePointer } from 'lucide-react';

export const AnalyticsPage = () => {
  return (
    <AppLayout 
      title="Analytics" 
      description="Métricas e análises de performance"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,847</div>
              <p className="text-xs text-muted-foreground">+12.5% vs mês anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,892</div>
              <p className="text-xs text-muted-foreground">+8.3% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.24%</div>
              <p className="text-xs text-muted-foreground">+0.8% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cliques em CTAs</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">+15.2% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tráfego por Período</CardTitle>
              <CardDescription>Visitantes únicos nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-[var(--ui-text-subtle)]">Gráfico de linha temporal</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fontes de Tráfego</CardTitle>
              <CardDescription>De onde vêm seus visitantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { source: "Busca Orgânica", percentage: 45, color: "bg-blue-500" },
                  { source: "Direto", percentage: 25, color: "bg-green-500" },
                  { source: "Redes Sociais", percentage: 15, color: "bg-purple-500" },
                  { source: "Referências", percentage: 10, color: "bg-orange-500" },
                  { source: "E-mail", percentage: 5, color: "bg-red-500" },
                ].map((source, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--ui-text)]">{source.source}</span>
                        <span className="text-[var(--ui-text-subtle)]">{source.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${source.color} h-2 rounded-full`} 
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Páginas Mais Visitadas</CardTitle>
            <CardDescription>
              Conteúdo com melhor performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { page: "/", title: "Página Inicial", views: "12,847", time: "3:24" },
                { page: "/imoveis", title: "Listagem de Imóveis", views: "8,234", time: "5:12" },
                { page: "/sobre", title: "Sobre Nós", views: "4,567", time: "2:45" },
                { page: "/contato", title: "Contato", views: "3,892", time: "1:58" },
                { page: "/blog", title: "Blog", views: "2,156", time: "4:33" },
              ].map((page, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-[var(--ui-stroke)] rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{page.title}</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">{page.page}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{page.views} visualizações</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">{page.time} tempo médio</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};