import { ChevronLeft, Clock, Home, Target, Globe, Users, Smartphone, Megaphone, Building } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LeadOriginModal } from './LeadOriginModal';
import { ClientFilterModal } from './ClientFilterModal';

// Mock data for properties and clients with status categories
const mockProperties = [{
  id: 1,
  name: 'Casa no Centro',
  daysLastUpdate: 15,
  status: 'green'
}, {
  id: 2,
  name: 'Apartamento Jardins',
  daysLastUpdate: 28,
  status: 'yellow'
}, {
  id: 3,
  name: 'Sobrado Vila Nova',
  daysLastUpdate: 35,
  status: 'red'
}, {
  id: 4,
  name: 'Cobertura Premium',
  daysLastUpdate: 8,
  status: 'green'
}, {
  id: 5,
  name: 'Sala Comercial',
  daysLastUpdate: 42,
  status: 'red'
}];
const mockClients = [{
  id: 1,
  name: 'João Silva',
  daysLastUpdate: 12,
  status: 'green',
  type: 'Ativo'
}, {
  id: 2,
  name: 'Maria Santos',
  daysLastUpdate: 29,
  status: 'yellow',
  type: 'Em negociação'
}, {
  id: 3,
  name: 'Pedro Costa',
  daysLastUpdate: 38,
  status: 'red',
  type: 'Inativo'
}, {
  id: 4,
  name: 'Ana Oliveira',
  daysLastUpdate: 5,
  status: 'green',
  type: 'Ativo'
}, {
  id: 5,
  name: 'Carlos Lima',
  daysLastUpdate: 33,
  status: 'red',
  type: 'Inativo'
}];
const dataByPeriod = {
  '31 dias': {
    propertyManagement: [{
      name: '0-25 dias',
      value: 45,
      color: '#4CAF50'
    }, {
      name: '26-30 dias',
      value: 25,
      color: '#FFC107'
    }, {
      name: '31+ dias',
      value: 12,
      color: '#F44336'
    }],
    clientManagement: [{
      name: 'Ativos',
      value: 120,
      color: '#4CAF50'
    }, {
      name: 'Em negociação',
      value: 35,
      color: '#FFC107'
    }, {
      name: 'Inativos',
      value: 15,
      color: '#F44336'
    }],
    leadOrigin: [{
      name: 'Site',
      icon: Globe,
      value: 120,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Indicação',
      icon: Users,
      value: 80,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Redes Sociais',
      icon: Smartphone,
      value: 45,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Campanhas Ads',
      icon: Megaphone,
      value: 60,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Eventos/Offline',
      icon: Building,
      value: 20,
      color: 'hsl(var(--accent))'
    }]
  },
  '15 dias': {
    propertyManagement: [{
      name: '0-25 dias',
      value: 38,
      color: '#4CAF50'
    }, {
      name: '26-30 dias',
      value: 22,
      color: '#FFC107'
    }, {
      name: '31+ dias',
      value: 8,
      color: '#F44336'
    }],
    clientManagement: [{
      name: 'Ativos',
      value: 95,
      color: '#4CAF50'
    }, {
      name: 'Em negociação',
      value: 28,
      color: '#FFC107'
    }, {
      name: 'Inativos',
      value: 12,
      color: '#F44336'
    }],
    leadOrigin: [{
      name: 'Site',
      value: 95,
      icon: Globe,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Indicação',
      value: 65,
      icon: Users,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Redes Sociais',
      value: 35,
      icon: Smartphone,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Campanhas Ads',
      value: 48,
      icon: Megaphone,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Eventos/Offline',
      value: 15,
      icon: Building,
      color: 'hsl(var(--accent))'
    }]
  },
  '7 dias': {
    propertyManagement: [{
      name: '0-25 dias',
      value: 28,
      color: '#4CAF50'
    }, {
      name: '26-30 dias',
      value: 15,
      color: '#FFC107'
    }, {
      name: '31+ dias',
      value: 5,
      color: '#F44336'
    }],
    clientManagement: [{
      name: 'Ativos',
      value: 68,
      color: '#4CAF50'
    }, {
      name: 'Em negociação',
      value: 18,
      color: '#FFC107'
    }, {
      name: 'Inativos',
      value: 8,
      color: '#F44336'
    }],
    leadOrigin: [{
      name: 'Site',
      value: 68,
      icon: Globe,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Indicação',
      value: 42,
      icon: Users,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Redes Sociais',
      value: 22,
      icon: Smartphone,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Campanhas Ads',
      value: 32,
      icon: Megaphone,
      color: 'hsl(var(--accent))'
    }, {
      name: 'Eventos/Offline',
      value: 8,
      icon: Building,
      color: 'hsl(var(--accent))'
    }]
  }
};
interface GestaoTabProps {
  onNavigateToTab?: (tab: string, filter?: any) => void;
}
export const GestaoTab = ({
  onNavigateToTab
}: GestaoTabProps) => {
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    data: Array<{
      name: string;
      subtitle: string;
    }>;
  }>({
    isOpen: false,
    title: '',
    data: []
  });
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    activeTab: 'properties'
  });
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [averageResponseTime, setAverageResponseTime] = useState<string>('--');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('31 dias');
  const [leadOriginModal, setLeadOriginModal] = useState({
    isOpen: false,
    origin: ''
  });
  const [clientFilterModal, setClientFilterModal] = useState({
    isOpen: false,
    clientType: ''
  });

  // Dados para Contato com Clientes
  const clientContactData = [{
    name: '0-25 dias',
    value: 48,
    color: '#10b981',
    count: 48
  }, {
    name: '26-30 dias',
    value: 24,
    color: '#f59e0b',
    count: 24
  }, {
    name: '31+ dias',
    value: 0,
    color: '#ef4444',
    count: 0
  }];

  // Get current period data
  const currentData = dataByPeriod[selectedPeriod as keyof typeof dataByPeriod];

  // Simular cálculo do tempo médio de resposta
  useEffect(() => {
    const fetchAverageResponseTime = () => {
      // Simulando uma chamada de API com dados diferentes por período
      setTimeout(() => {
        const times = {
          '31 dias': '1 minuto',
          '15 dias': '45 segundos',
          '7 dias': '30 segundos'
        };
        setAverageResponseTime(times[selectedPeriod as keyof typeof times]);
      }, 500);
    };
    fetchAverageResponseTime();
  }, [selectedPeriod]);
  const handlePropertySegmentClick = (segment: string) => {
    // Navigate to properties tab with filter
    if (onNavigateToTab) {
      onNavigateToTab('imoveis', {
        filter: segment
      });
    }
  };
  const handleClientSegmentClick = (segment: string) => {
    // Open client filter modal directly
    setClientFilterModal({
      isOpen: true,
      clientType: segment
    });
  };
  const handleOriginClick = (origin: string) => {
    setLeadOriginModal({
      isOpen: true,
      origin: origin
    });
  };
  const closeModal = () => {
    setModalData({
      isOpen: false,
      title: '',
      data: []
    });
  };
  const handleClientContactClick = (segment: string) => {
    // Navigate to leads tab with specific filter
    if (onNavigateToTab) {
      let filterType = '';
      switch (segment) {
        case '0-25 dias':
          filterType = 'verde';
          break;
        case '26-30 dias':
          filterType = 'amarelo';
          break;
        case '31+ dias':
          filterType = 'vermelho';
          break;
      }
      onNavigateToTab('leads', {
        filter: filterType
      });
    }
  };
  const handleOriginClickWithMarketing = (origin: string) => {
    // Determinar se é Inbound ou Outbound
    const inboundSources = ['Site', 'Redes Sociais', 'Campanhas Ads'];
    const outboundSources = ['Indicação', 'Eventos/Offline'];
    let marketingType = '';
    if (inboundSources.includes(origin)) {
      marketingType = 'Inbound';
    } else if (outboundSources.includes(origin)) {
      marketingType = 'Outbound';
    }
    setLeadOriginModal({
      isOpen: true,
      origin: `${origin} (${marketingType})`
    });
  };
  return <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="h-14 bg-white flex items-center justify-center px-4 border-b border-gray-100">
        <h1 className="text-h2 text-center">Indicadores</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Contato com Clientes */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">Contato com Clientes</h3>
          
          <div className="h-40 mb-4">
            <ChartContainer config={{
            value: {
              label: "Clientes"
            }
          }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={clientContactData} cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={2} dataKey="value" onClick={data => handleClientContactClick(data.name)}>
                    {clientContactData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer hover:opacity-80" />)}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="space-y-2">
            {clientContactData.map((item, index) => <div key={index} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => handleClientContactClick(item.name)}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: item.color
              }}></div>
                  <span className="text-[#333333]">{item.name}</span>
                </div>
                <span className="text-[#333333] font-semibold">{item.count}</span>
              </div>)}
          </div>
        </div>

        {/* Response Time Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-[#333333]">Tempo de Resposta</h3>
            <div className="flex items-center text-xs text-[#666666]">
              <Clock className="w-4 h-4 mr-1" />
              Atualizado agora
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-[#333333]">{averageResponseTime}</p>
              <p className="text-sm text-[#666666]">Tempo médio de resposta</p>
            </div>
            <Target className="w-10 h-10 text-[hsl(var(--accent))]" />
          </div>
          <div className="mt-4">
            <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option>7 dias</option>
              <option>15 dias</option>
              <option>31 dias</option>
            </select>
          </div>
        </div>

        {/* Property Management Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">Gestão de Imóveis</h3>
          
          <div className="h-40 mb-4">
            <ChartContainer config={{
            value: {
              label: "Imóveis"
            }
          }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={currentData.propertyManagement} cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={2} dataKey="value" onClick={data => handlePropertySegmentClick(data.name)}>
                    {currentData.propertyManagement.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer hover:opacity-80" />)}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="space-y-2">
            {currentData.propertyManagement.map((item, index) => <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{
              backgroundColor: item.color
            }}></div>
                <span className="text-[#333333]">{item.name}: {item.value} imóveis</span>
              </div>)}
          </div>
        </div>

        {/* Client Management Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">Gestão de Clientes</h3>
          
          <div className="h-40 mb-4">
            <ChartContainer config={{
            value: {
              label: "Clientes"
            }
          }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={currentData.clientManagement} cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={2} dataKey="value" onClick={data => handleClientSegmentClick(data.name)}>
                    {currentData.clientManagement.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer hover:opacity-80" />)}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="space-y-2">
            {currentData.clientManagement.map((item, index) => <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{
              backgroundColor: item.color
            }}></div>
                <span className="text-[#333333]">{item.name}: {item.value} clientes</span>
              </div>)}
          </div>
        </div>

        {/* Lead Origin */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">Origem de Leads</h3>
          
          <div className="space-y-3">
            {currentData.leadOrigin.map((item, index) => {
            const IconComponent = item.icon;
            const inboundSources = ['Site', 'Redes Sociais', 'Campanhas Ads'];
            const marketingType = inboundSources.includes(item.name) ? 'Inbound' : 'Outbound';
            return <div key={index} className="cursor-pointer hover:bg-white hover:shadow-md p-3 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200" onClick={() => handleOriginClickWithMarketing(item.name)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[hsl(var(--accent))]/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-[hsl(var(--accent))]" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-[#333333]">{item.name}</span>
                        <div className="text-xs text-[#666666]">Marketing {marketingType}</div>
                      </div>
                    </div>
                    <span className="text-base font-semibold text-[hsl(var(--accent))]">{item.value} leads</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-[hsl(var(--accent))]" style={{
                  width: `${item.value / Math.max(...currentData.leadOrigin.map(i => i.value)) * 100}%`
                }}></div>
                  </div>
                </div>;
          })}
          </div>
        </div>
      </div>

      {/* Detailed Management Modal */}
      {detailModal.isOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <button onClick={() => setDetailModal({
            isOpen: false,
            activeTab: 'properties'
          })} className="text-orange-500 font-medium">
                <ChevronLeft className="w-5 h-5 inline mr-1" />
                Voltar
              </button>
              <h3 className="text-lg font-semibold text-gray-800">Detalhamento</h3>
              <div className="w-6"></div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <Tabs value={detailModal.activeTab} onValueChange={value => setDetailModal({
            isOpen: true,
            activeTab: value
          })}>
                <TabsList className="grid w-full grid-cols-2 m-4">
                  <TabsTrigger value="properties">Gestão de Imóveis</TabsTrigger>
                  <TabsTrigger value="clients">Gestão de Clientes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="properties" className="px-4 pb-4 overflow-y-auto max-h-[50vh]">
                  {/* Filter buttons for properties */}
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setPropertyFilter('all')} className={`px-3 py-1 rounded-full text-xs ${propertyFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      Todos
                    </button>
                    <button onClick={() => setPropertyFilter('green')} className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${propertyFilter === 'green' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      0-25 dias
                    </button>
                    <button onClick={() => setPropertyFilter('yellow')} className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${propertyFilter === 'yellow' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      26-30 dias
                    </button>
                    <button onClick={() => setPropertyFilter('red')} className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${propertyFilter === 'red' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      31+ dias
                    </button>
                  </div>
                  
                  {/* Properties list */}
                  <div className="space-y-3">
                    {mockProperties.filter(property => propertyFilter === 'all' || property.status === propertyFilter).map(property => <div key={property.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${property.status === 'green' ? 'bg-green-500' : property.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <div>
                              <p className="font-medium text-gray-800">{property.name}</p>
                              <p className="text-xs text-gray-500">{property.daysLastUpdate} dias desde última atualização</p>
                            </div>
                          </div>
                        </div>)}
                  </div>
                </TabsContent>
                
                <TabsContent value="clients" className="px-4 pb-4 overflow-y-auto max-h-[50vh]">
                  {/* Filter buttons for clients */}
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setClientFilter('all')} className={`px-3 py-1 rounded-full text-xs ${clientFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      Todos
                    </button>
                    <button onClick={() => setClientFilter('green')} className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${clientFilter === 'green' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Ativos
                    </button>
                    <button onClick={() => setClientFilter('yellow')} className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${clientFilter === 'yellow' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Negociação
                    </button>
                    <button onClick={() => setClientFilter('red')} className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${clientFilter === 'red' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Inativos
                    </button>
                  </div>
                  
                  {/* Clients list */}
                  <div className="space-y-3">
                    {mockClients.filter(client => clientFilter === 'all' || client.status === clientFilter).map(client => <div key={client.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${client.status === 'green' ? 'bg-green-500' : client.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <div>
                              <p className="font-medium text-gray-800">{client.name}</p>
                              <p className="text-xs text-gray-500">{client.type} • {client.daysLastUpdate} dias desde último contato</p>
                            </div>
                          </div>
                        </div>)}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>}

      {/* Original Modal */}
      {modalData.isOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <button onClick={closeModal} className="text-[hsl(var(--accent))] font-medium">
                <ChevronLeft className="w-5 h-5 inline mr-1" />
                Voltar
              </button>
              <h3 className="text-lg font-semibold text-[#333333]">{modalData.title}</h3>
              <div className="w-6"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {modalData.data.map((item, index) => <div key={index} className="py-3 border-b border-gray-100 last:border-b-0">
                  <p className="text-sm font-medium text-[#333333]">{item.name}</p>
                  <p className="text-xs text-[#666666] mt-1">{item.subtitle}</p>
                </div>)}
            </div>
          </div>
        </div>}
      
      {/* Lead Origin Modal */}
      <LeadOriginModal isOpen={leadOriginModal.isOpen} onClose={() => setLeadOriginModal({
      isOpen: false,
      origin: ''
    })} origin={leadOriginModal.origin} />
      
      {/* Client Filter Modal */}
      <ClientFilterModal isOpen={clientFilterModal.isOpen} onClose={() => setClientFilterModal({
      isOpen: false,
      clientType: ''
    })} clientType={clientFilterModal.clientType} />
    </div>;
};
