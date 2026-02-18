import { StandardLayout } from '@/layouts/StandardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Key, 
  Users, 
  DollarSign, 
  FileText, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Building2,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const stats = [
  { label: 'Imóveis Alugados', value: '892', icon: Key, change: '+12 este mês', color: 'text-green-600' },
  { label: 'Contratos de locação ativos', value: '847', icon: FileText, change: '94.9% do total', color: 'text-blue-600' },
  { label: 'Receita Mensal', value: 'R$ 2.4M', icon: DollarSign, change: '+8.2%', color: 'text-orange-600' },
  { label: 'Inquilinos', value: '745', icon: Users, change: '+23 novos', color: 'text-purple-600' },
];

const contracts = [
  { 
    id: 1, 
    tenant: 'Maria Silva', 
    property: 'Apt 302 - Ed. Solar', 
    value: 'R$ 2.500', 
    status: 'Ativo', 
    dueDate: '10/12/2025',
    statusColor: 'bg-green-100 text-green-700'
  },
  { 
    id: 2, 
    tenant: 'João Santos', 
    property: 'Casa 15 - Cond. Verde', 
    value: 'R$ 4.200', 
    status: 'Vencendo', 
    dueDate: '05/12/2025',
    statusColor: 'bg-yellow-100 text-yellow-700'
  },
  { 
    id: 3, 
    tenant: 'Ana Costa', 
    property: 'Sala 1001 - Centro Emp.', 
    value: 'R$ 1.800', 
    status: 'Ativo', 
    dueDate: '15/12/2025',
    statusColor: 'bg-green-100 text-green-700'
  },
  { 
    id: 4, 
    tenant: 'Pedro Lima', 
    property: 'Cobertura - Ed. Luxo', 
    value: 'R$ 8.500', 
    status: 'Pendente', 
    dueDate: '20/12/2025',
    statusColor: 'bg-red-100 text-red-700'
  },
  { 
    id: 5, 
    tenant: 'Carla Mendes', 
    property: 'Apt 105 - Ed. Central', 
    value: 'R$ 1.900', 
    status: 'Ativo', 
    dueDate: '25/12/2025',
    statusColor: 'bg-green-100 text-green-700'
  },
];

const pendingTasks = [
  { id: 1, task: 'Renovar contrato - Maria Silva', type: 'Contrato', deadline: '2 dias', icon: FileText },
  { id: 2, task: 'Vistoria de entrada - Apt 205', type: 'Vistoria', deadline: 'Hoje', icon: Home },
  { id: 3, task: 'Cobrança pendente - João Santos', type: 'Financeiro', deadline: 'Atrasado', icon: DollarSign },
  { id: 4, task: 'Manutenção solicitada - Ed. Solar', type: 'Manutenção', deadline: '5 dias', icon: AlertCircle },
];

export const GestaoLocacaoPage = () => {
  return (
    <StandardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Locação</h1>
            <p className="text-sm text-gray-600 mt-1">Gerencie contratos de locação, inquilinos e cobranças</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">Tarefas Pendentes</span>
                    </div>
                    <p className="text-sm opacity-90 mb-4">4 tarefas aguardando ação</p>
                    <Button variant="secondary" size="sm" className="bg-white text-orange-600 hover:bg-orange-50">
                      Ver Tarefas
                    </Button>
                  </div>
                  <span className="text-3xl font-bold">4</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold">Cobranças do Mês</span>
                    </div>
                    <p className="text-sm opacity-90 mb-4">R$ 156.800 a receber</p>
                    <Button variant="secondary" size="sm" className="bg-white text-orange-600 hover:bg-orange-50">
                      Ver Cobranças
                    </Button>
                  </div>
                  <span className="text-3xl font-bold">89</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contracts Table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Contratos de locação recentes</CardTitle>
                      <CardDescription>Últimos contratos de locação e seu status</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Buscar..." className="pl-9 w-48" />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contracts.map((contract) => (
                      <div 
                        key={contract.id} 
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{contract.tenant}</p>
                            <p className="text-sm text-gray-500">{contract.property}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="font-medium text-gray-900">{contract.value}/mês</p>
                            <p className="text-xs text-gray-500">Vence: {contract.dueDate}</p>
                          </div>
                          <Badge className={contract.statusColor}>{contract.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 text-orange-600 border-orange-200 hover:bg-orange-50">
                    Ver Todos os Contratos de locação
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Pending Tasks */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Tarefas Pendentes</CardTitle>
                  <CardDescription>Ações que precisam de atenção</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          task.deadline === 'Atrasado' ? 'bg-red-100' : 
                          task.deadline === 'Hoje' ? 'bg-yellow-100' : 'bg-orange-100'
                        }`}>
                          <task.icon className={`w-4 h-4 ${
                            task.deadline === 'Atrasado' ? 'text-red-600' : 
                            task.deadline === 'Hoje' ? 'text-yellow-600' : 'text-orange-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{task.task}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{task.type}</Badge>
                            <span className={`text-xs ${
                              task.deadline === 'Atrasado' ? 'text-red-600' : 
                              task.deadline === 'Hoje' ? 'text-yellow-600' : 'text-gray-500'
                            }`}>
                              {task.deadline}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 text-orange-600 border-orange-200 hover:bg-orange-50">
                    Ver Todas as Tarefas
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-orange-500 hover:bg-orange-600 text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Novo Contrato
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50">
                    <Users className="w-4 h-4 mr-2" />
                    Cadastrar Inquilino
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Vistoria
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Gerar Cobrança
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default GestaoLocacaoPage;
