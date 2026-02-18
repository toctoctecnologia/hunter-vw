import { AppLayout } from '@/components/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye, MessageSquare, Calendar } from 'lucide-react';

export const BlogPage = () => {
  return (
    <AppLayout 
      title="Blog" 
      description="Conteúdo e artigos da Hunter"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artigos Publicados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+8 este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações Totais</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">54,892</div>
              <p className="text-xs text-muted-foreground">+18.2% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comentários</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+23 novos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artigos Rascunho</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Aguardando publicação</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Artigos Recentes</CardTitle>
            <CardDescription>
              Últimos conteúdos publicados no blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  title: "Tendências do Mercado Imobiliário 2024", 
                  date: "2 dias atrás", 
                  views: "2,847",
                  comments: "23",
                  status: "Publicado" 
                },
                { 
                  title: "Como Escolher o Imóvel Ideal para Investimento", 
                  date: "5 dias atrás", 
                  views: "1,892",
                  comments: "15",
                  status: "Publicado" 
                },
                { 
                  title: "Guia Completo de Financiamento Imobiliário", 
                  date: "1 semana atrás", 
                  views: "3,456",
                  comments: "41",
                  status: "Publicado" 
                },
                { 
                  title: "Tecnologia e Inovação no Setor Imobiliário", 
                  date: "Rascunho", 
                  views: "-",
                  comments: "-",
                  status: "Rascunho" 
                },
                { 
                  title: "Dicas para Primeira Compra de Imóvel", 
                  date: "2 semanas atrás", 
                  views: "4,234",
                  comments: "67",
                  status: "Publicado" 
                },
              ].map((article, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-[var(--ui-stroke)] rounded-lg">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{article.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-[var(--ui-text-subtle)]">
                      <span>{article.date}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        article.status === 'Publicado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{article.views} visualizações</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">{article.comments} comentários</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { category: "Mercado Imobiliário", count: 34, color: "bg-blue-100 text-blue-800" },
            { category: "Dicas de Investimento", count: 28, color: "bg-green-100 text-green-800" },
            { category: "Financiamento", count: 22, color: "bg-purple-100 text-purple-800" },
            { category: "Tecnologia", count: 18, color: "bg-orange-100 text-orange-800" },
            { category: "Legislação", count: 15, color: "bg-red-100 text-red-800" },
            { category: "Decoração", count: 10, color: "bg-pink-100 text-pink-800" },
          ].map((category, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[var(--ui-text)]">{category.category}</h3>
                    <p className="text-sm text-[var(--ui-text-subtle)]">{category.count} artigos</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                    {category.count}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};