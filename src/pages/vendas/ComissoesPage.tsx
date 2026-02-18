import { useState } from 'react';
import { StandardLayout } from '@/layouts/StandardLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Filter,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDeals } from '@/hooks/deals/useDeals';
import { formatCurrency } from '@/utils/format';

export default function ComissoesPage() {
  const { deals } = useDeals();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Calcular métricas
  const totalCommission = deals.reduce((sum, deal) => {
    return sum + (deal.proposal.value * 0.03); // 3% de comissão padrão
  }, 0);

  const thisMonthCommission = deals
    .filter(deal => {
      const dealDate = new Date(deal.closedAt);
      const now = new Date();
      return dealDate.getMonth() === now.getMonth() && 
             dealDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, deal) => sum + (deal.proposal.value * 0.03), 0);

  const totalDeals = deals.length;
  const avgCommission = totalDeals > 0 ? totalCommission / totalDeals : 0;

  const stats = [
    {
      title: 'Total em Comissões',
      value: formatCurrency(totalCommission),
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      description: 'vs. mês anterior'
    },
    {
      title: 'Comissões deste Mês',
      value: formatCurrency(thisMonthCommission),
      icon: Calendar,
      trend: '+8.2%',
      trendUp: true,
      description: 'vs. mês anterior'
    },
    {
      title: 'Número de Vendas',
      value: totalDeals.toString(),
      icon: TrendingUp,
      trend: '+15.3%',
      trendUp: true,
      description: 'vendas fechadas'
    },
    {
      title: 'Comissão Média',
      value: formatCurrency(avgCommission),
      icon: Users,
      trend: '+5.1%',
      trendUp: true,
      description: 'por venda'
    }
  ];

  return (
    <StandardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rastreamento de Comissões</h1>
            <p className="text-sm text-gray-600 mt-1">Acompanhe suas comissões e ganhos</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="team">Por Equipe</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    {stat.trend && (
                      <Badge variant={stat.trendUp ? 'default' : 'secondary'} className="gap-1">
                        <ArrowUpRight className="h-3 w-3" />
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Gráfico de Comissões Mensais */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Comissões Mensais</h3>
              <div className="h-[300px] flex items-end justify-between gap-2">
                {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((month, idx) => {
                  const height = Math.random() * 100;
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-primary rounded-t-md transition-all hover:bg-primary/80 cursor-pointer"
                        style={{ height: `${height}%`, minHeight: '20px' }}
                      />
                      <span className="text-xs text-muted-foreground">{month}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Últimas Vendas */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Últimas Vendas com Comissão</h3>
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor da Venda</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.slice(0, 5).map((deal) => {
                    const commission = deal.proposal.value * 0.03;
                    return (
                      <TableRow key={deal.id}>
                        <TableCell>
                          {new Date(deal.closedAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(deal.proposal.value)}
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {formatCurrency(commission)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Pago</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* Filtros */}
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por cliente, propriedade..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os períodos</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                    <SelectItem value="year">Este ano</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </Card>

            {/* Tabela Detalhada */}
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data de Fechamento</TableHead>
                    <TableHead>Valor da Venda</TableHead>
                    <TableHead>% Comissão</TableHead>
                    <TableHead>Valor Comissão</TableHead>
                    <TableHead>Divisão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.map((deal) => {
                    const commissionPercent = 3;
                    const commission = deal.proposal.value * (commissionPercent / 100);
                    
                    return (
                      <TableRow key={deal.id}>
                        <TableCell className="font-mono text-xs">
                          #{deal.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          {new Date(deal.closedAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(deal.proposal.value)}
                        </TableCell>
                        <TableCell>{commissionPercent}%</TableCell>
                        <TableCell className="text-green-600 font-bold">
                          {formatCurrency(commission)}
                        </TableCell>
                        <TableCell>
                          {deal.commission.length > 0 ? (
                            <div className="flex gap-1">
                              {deal.commission.map((split) => (
                                <Badge key={split.userId} variant="outline">
                                  {split.percentage}%
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">100%</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Pago</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Divisão de Comissões por Membro</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membro</TableHead>
                    <TableHead>Vendas Participadas</TableHead>
                    <TableHead>Total Recebido</TableHead>
                    <TableHead>Média por Venda</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Você</TableCell>
                    <TableCell>{totalDeals}</TableCell>
                    <TableCell className="font-bold text-green-600">
                      {formatCurrency(totalCommission)}
                    </TableCell>
                    <TableCell>{formatCurrency(avgCommission)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </StandardLayout>
  );
}
