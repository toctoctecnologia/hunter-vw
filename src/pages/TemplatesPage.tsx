import { AppLayout } from '@/components/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Layout, Image, FileText } from 'lucide-react';

export const TemplatesPage = () => {
  return (
    <AppLayout 
      title="Templates" 
      description="Modelos e designs para suas campanhas"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates Disponíveis</CardTitle>
              <Layout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+5 novos este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates Utilizados</CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mais Popular</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Newsletter Imóveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customizações</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Templates personalizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Template Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { category: "E-mail Marketing", count: 15, description: "Templates para campanhas de e-mail", color: "bg-blue-100 text-blue-800" },
            { category: "Newsletters", count: 12, description: "Modelos para boletins informativos", color: "bg-green-100 text-green-800" },
            { category: "Apresentações", count: 8, description: "Slides para apresentações comerciais", color: "bg-purple-100 text-purple-800" },
            { category: "Relatórios", count: 6, description: "Templates para relatórios de vendas", color: "bg-orange-100 text-orange-800" },
            { category: "Landing Pages", count: 4, description: "Páginas de captura de leads", color: "bg-red-100 text-red-800" },
            { category: "Social Media", count: 10, description: "Posts para redes sociais", color: "bg-pink-100 text-pink-800" },
          ].map((template, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.category}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${template.color}`}>
                    {template.count} templates
                  </span>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Layout className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-[var(--ui-text-subtle)]">
                    Visualizar todos os templates desta categoria
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};