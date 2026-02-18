import { StandardLayout } from '@/layouts/StandardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Key, Users, DollarSign } from 'lucide-react';

export const LocacoesPage = () => {
  return (
    <StandardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Hunter Locações</h1>
            <p className="text-sm text-gray-600 mt-1">Gestão de imóveis e locações</p>
          </div>
          
          <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imóveis Cadastrados</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+23 esta semana</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imóveis Alugados</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-muted-foreground">71.5% ocupação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 2.4M</div>
              <p className="text-xs text-muted-foreground">+8.2% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquilinos Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">745</div>
              <p className="text-xs text-muted-foreground">+12 novos</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Imóveis Recentes</CardTitle>
            <CardDescription>
              Últimos imóveis cadastrados na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { address: "Rua das Flores, 123 - Centro", type: "Apartamento", price: "R$ 2.500", status: "Disponível" },
                { address: "Av. Principal, 456 - Jardins", type: "Casa", price: "R$ 4.200", status: "Alugado" },
                { address: "Rua Comercial, 789 - Vila Nova", type: "Sala Comercial", price: "R$ 1.800", status: "Disponível" },
                { address: "Condomínio Premium, 101 - Centro", type: "Cobertura", price: "R$ 8.500", status: "Em Análise" },
                { address: "Rua Residencial, 234 - Bairro Alto", type: "Apartamento", price: "R$ 1.900", status: "Alugado" },
              ].map((property, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-[var(--ui-stroke)] rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{property.address}</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">{property.type}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{property.price}/mês</p>
                    <p className={`text-sm ${
                      property.status === 'Disponível' ? 'text-green-600' :
                      property.status === 'Alugado' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>{property.status}</p>
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