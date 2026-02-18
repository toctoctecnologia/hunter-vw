import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend, Tooltip } from 'recharts';
import { Filter, Phone, Calendar, Target, TrendingUp, Activity, BarChart3 } from 'lucide-react';

// Mock data baseado nos prints
const funilVendasData = [
  { semana: 'Sem 1', atendimentos: 8, visitas: 0, propostas: 0, negocios: 0, descartes: 17 },
  { semana: 'Sem 2', atendimentos: 11, visitas: 2, propostas: 0, negocios: 0, descartes: 17 },
  { semana: 'Sem 3', atendimentos: 1, visitas: 2, propostas: 0, negocios: 0, descartes: 0 },
  { semana: 'Sem 4', atendimentos: 0, visitas: 0, propostas: 0, negocios: 0, descartes: 0 },
  { semana: 'Sem 5', atendimentos: 0, visitas: 0, propostas: 0, negocios: 0, descartes: 0 },
  { semana: 'Sem 6', atendimentos: 0, visitas: 0, propostas: 0, negocios: 0, descartes: 0 },
];

const etapasAtendimento = [
  { etapa: 'PRÉ-ATENDIMENTO', valor: 0, color: '#7c2d12' },
  { etapa: 'SELEÇÃO DO PERFIL', valor: 74, color: '#9a3412' },
  { etapa: 'SELEÇÃO DOS IMÓVEIS', valor: 4, color: '#c2410c' },
  { etapa: 'LEAD QUALIFICADO', valor: 19, color: '#dc2626' },
  { etapa: 'AGENDAMENTO', valor: 1, color: '#ea580c' },
  { etapa: 'VISITA', valor: 7, color: 'hsl(var(--accentSoft))' },
  { etapa: 'PROPOSTA', valor: 0, color: '#fb923c' }
];

const midiaOrigemData = [
  { nome: 'Instagram Leads / Internet', valor: 35 },
  { nome: 'Facebook Leads / Internet', valor: 20 },
  { nome: 'Indicacao', valor: 5 },
  { nome: 'Vitrine', valor: 3 },
  { nome: 'Grupo Zap / Internet', valor: 3 },
  { nome: 'Google Ads / Internet', valor: 2 },
  { nome: 'Site Proprio - rocketimob', valor: 1 }
];

const atividadesData = [
  { tipo: 'Sem atividade programada', atendimento: 103, atividade: 0 },
  { tipo: 'Atividades vencidas', atendimento: 2, atividade: 2 },
  { tipo: 'Atividades a vencer', atendimento: 0, atividade: 0 },
  { tipo: 'Atividades com vencimento para hoje', atendimento: 0, atividade: 0 }
];

const motivosDescarte = [
  { motivo: 'Já interagiu porém não responde/atende mais', value: 41.07, color: '#3b82f6' },
  { motivo: 'Nunca atendeu ou respondeu o contato ou Bloqueou no Whats', value: 18.30, color: '#8b5cf6' },
  { motivo: 'O cliente busca imóvel fora do nosso nicho de atuação', value: 4.91, color: '#f59e0b' },
  { motivo: 'Desistiu de comprar', value: 2.23, color: '#9ca3af' },
  { motivo: 'Corretor se passando por cliente', value: 1.34, color: '#ef4444' },
  { motivo: 'Clicou por curiosidade, sem querer ou por engano', value: 18.30, color: '#10b981' },
  { motivo: 'Contato inexistente ou de outra pessoa', value: 7.59, color: '#6b7280' },
  { motivo: 'Lead ou cliente duplicado', value: 2.68, color: 'hsl(var(--accentSoft))' },
  { motivo: 'Deseja comprar em outro momento', value: 1.79, color: '#22c55e' },
  { motivo: 'Achou que o anuncio era de outra cidade', value: 0.89, color: '#a78bfa' }
];

const ultimaInteracao = [
  { periodo: 'até 25 dias', value: 66.67, color: '#22c55e' },
  { periodo: 'de 26 até 30 dias', value: 8.57, color: '#f59e0b' },
  { periodo: 'acima de 31 dias', value: 24.76, color: '#ef4444' }
];

const tipoAtendimento = [
  { tipo: 'On-line', value: 84.76, color: '#ef4444' },
  { tipo: 'Presencial', value: 15.24, color: '#9ca3af' }
];

const termometro = [
  { tipo: 'Indefinido', value: 100, color: '#9ca3af' },
  { tipo: 'Frio', value: 0, color: '#60a5fa' },
  { tipo: 'Morno', value: 0, color: '#fbbf24' },
  { tipo: 'Quente', value: 0, color: '#dc2626' }
];

export function FilterTab() {
  const [mes, setMes] = useState('setembro');
  const [ano, setAno] = useState('2025');
  const [unidade, setUnidade] = useState('BOLD');
  const [funil, setFunil] = useState('todos');

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-lg">Filtros - SETEMBRO 2025</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mês</label>
              <Select value={mes} onValueChange={setMes}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="setembro">Setembro</SelectItem>
                  <SelectItem value="outubro">Outubro</SelectItem>
                  <SelectItem value="novembro">Novembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Ano</label>
              <Select value={ano} onValueChange={setAno}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Opção período</label>
              <Select defaultValue="funil">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funil">Aplicar período somente nos indicadores dos funis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Unidade</label>
              <Select value={unidade} onValueChange={setUnidade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BOLD">BOLD</SelectItem>
                  <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Funil</label>
              <Select value={funil} onValueChange={setFunil}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Corretores</label>
              <Input placeholder="Selecione um corretor" />
            </div>
            <div className="flex items-end">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Phone className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Atendimentos ativos</p>
                <p className="text-3xl font-bold text-gray-900">105</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Etapas atendimento</h3>
              <div className="space-y-2">
                {etapasAtendimento.slice(0, 4).map((etapa, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: etapa.color }}
                      />
                      <span className="text-xs text-gray-700">{etapa.etapa}</span>
                    </div>
                    <span className="text-sm font-medium">{etapa.valor}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Visitas sem parecer</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funil de vendas e Funil de Venda */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Funil de vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Semana</th>
                    <th className="text-center p-2">Atendimentos</th>
                    <th className="text-center p-2">Visitas</th>
                    <th className="text-center p-2">Propostas</th>
                    <th className="text-center p-2">Negócios</th>
                    <th className="text-center p-2">Descartes</th>
                  </tr>
                </thead>
                <tbody>
                  {funilVendasData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{item.semana}</td>
                      <td className="text-center p-2 text-blue-600">{item.atendimentos}</td>
                      <td className="text-center p-2">{item.visitas}</td>
                      <td className="text-center p-2">{item.propostas}</td>
                      <td className="text-center p-2">{item.negocios}</td>
                      <td className="text-center p-2 text-blue-600">{item.descartes}</td>
                    </tr>
                  ))}
                  <tr className="border-b font-semibold">
                    <td className="p-2">Total</td>
                    <td className="text-center p-2 text-blue-600">20</td>
                    <td className="text-center p-2 text-blue-600">4</td>
                    <td className="text-center p-2">0</td>
                    <td className="text-center p-2">0</td>
                    <td className="text-center p-2 text-orange-600">34</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Funil de Venda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-500 to-purple-600 p-4 rounded-lg text-white">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm opacity-90">Atendimentos</p>
                    <p className="text-lg font-bold">20</p>
                    <p className="text-xs">20%</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Visitas</p>
                    <p className="text-lg font-bold">4</p>
                    <p className="text-xs">0%</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Propostas</p>
                    <p className="text-lg font-bold">0</p>
                    <p className="text-xs">0%</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Negócios</p>
                    <p className="text-lg font-bold">0</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+0%</div>
                <div className="bg-orange-500 text-white px-3 py-1 rounded text-sm">34</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Mídia de origem */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mídia de origem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={midiaOrigemData} layout="horizontal">
                  <XAxis type="number" />
                  <YAxis dataKey="nome" type="category" width={120} fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atividadesData.map((atividade, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{atividade.tipo}</span>
                  <div className="flex gap-4">
                    <span className="text-sm font-medium text-blue-600">{atividade.atendimento}</span>
                    <span className="text-sm font-medium">{atividade.atividade}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de pizza */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Motivos descarte */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Motivos descarte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={motivosDescarte}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {motivosDescarte.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Última interação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Última interação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ultimaInteracao}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {ultimaInteracao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tipo atendimento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tipo atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tipoAtendimento}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {tipoAtendimento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Termômetro */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Termômetro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={termometro}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {termometro.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}