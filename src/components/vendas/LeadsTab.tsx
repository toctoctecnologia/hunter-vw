import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Building2, Wifi, Phone, Target, Globe, Facebook, Instagram } from 'lucide-react';
import { LeadIntensityButtons } from '@/components/vendas/LeadIntensityButtons';
import { useLeadsStore } from '@/hooks/vendas';
import { getLeadDetailPath } from '@/lib/routes/leads';

const filters = [
  { id: 'todo', label: 'A fazer', count: 19, active: true },
  { id: 'visitas', label: 'Visitas', count: 0 },
  { id: 'futuras', label: 'Futuras', count: 1 },
  { id: 'favoritos', label: 'Favoritos', count: 0 },
  { id: 'todos', label: 'Todos', count: 922 }
];

// Filtros de cor para contato com clientes
const colorFilters = [
  { id: 'verde', label: '0-25 dias', color: 'bg-green-500', count: 48 },
  { id: 'amarelo', label: '26-30 dias', color: 'bg-yellow-500', count: 24 },
  { id: 'vermelho', label: '31+ dias', color: 'bg-red-500', count: 0 }
];

interface LeadsTabProps {
  filter?: { filter: string };
}

export const LeadsTab = ({ filter }: LeadsTabProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { leads, error, load } = useLeadsStore();
  const [activeFilter, setActiveFilter] = useState(filter?.filter || 'todo');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeColorFilter, setActiveColorFilter] = useState<string | null>(
    filter?.filter && ['verde', 'amarelo', 'vermelho'].includes(filter.filter) 
      ? filter.filter 
      : null
  );
  const [activeOriginFilter, setActiveOriginFilter] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Erro ao carregar leads: {error}
      </div>
    );
  }

  // Handle URL parameters for filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const colorFilter = urlParams.get('filter');
    const originFilter = urlParams.get('origin');
    
    if (colorFilter && ['verde', 'amarelo', 'vermelho'].includes(colorFilter)) {
      setActiveColorFilter(colorFilter);
    }
    
    if (originFilter) {
      setActiveOriginFilter(originFilter);
    }
  }, [location.search]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Atendimento': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Em espera': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Arquivado': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getContactDaysColor = (leadId: number) => {
    // Simular dias desde último contato baseado no ID
    const daysSinceContact = leadId * 10; // Exemplo: lead 1 = 10 dias, lead 2 = 20 dias, etc.
    
    if (daysSinceContact <= 25) return 'verde';
    if (daysSinceContact <= 30) return 'amarelo';
    return 'vermelho';
  };

  const getSourceIcon = (source: string) => {
    if (source.includes('Facebook')) {
      return <Facebook className="w-4 h-4 text-blue-600" />;
    }
    if (source.includes('Instagram')) {
      return <Instagram className="w-4 h-4 text-pink-600" />;
    }
    if (source.includes('Indicação')) {
      return <User className="w-4 h-4 text-green-600" />;
    }
    return <Globe className="w-4 h-4 text-gray-600" />;
  };

  const allLeads = leads;

  const filteredLeads = allLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    
    // Se há um filtro de cor ativo, filtrar por dias de contato
    if (activeColorFilter) {
      const leadColorCategory = getContactDaysColor(lead.id);
      return matchesSearch && leadColorCategory === activeColorFilter;
    }
    
    // Se há um filtro de origem ativo
    if (activeOriginFilter) {
      return matchesSearch && ((lead as any).origin?.source || (lead as any).source) === activeOriginFilter;
    }
    
    if (filter?.filter && ['verde', 'amarelo', 'vermelho'].includes(filter.filter)) {
      const leadColorCategory = getContactDaysColor(lead.id);
      return matchesSearch && leadColorCategory === filter.filter;
    }
    
    return matchesSearch;
  });

  const handleLeadClick = (leadId: number) => {
    navigate(getLeadDetailPath(leadId));
  };

  const handleColorFilterClick = (colorId: string) => {
    if (activeColorFilter === colorId) {
      setActiveColorFilter(null); // Desativar filtro se já estiver ativo
      // Remove filter from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('filter');
      window.history.replaceState({}, '', newUrl.toString());
    } else {
      setActiveColorFilter(colorId); // Ativar novo filtro
      setActiveOriginFilter(null); // Clear origin filter
      // Update URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('filter', colorId);
      newUrl.searchParams.delete('origin');
      window.history.replaceState({}, '', newUrl.toString());
    }
  };

  const isColorFilterActive = (filter?.filter && ['verde', 'amarelo', 'vermelho'].includes(filter.filter)) || activeColorFilter;
  const isOriginFilterActive = activeOriginFilter;

  return (
    <div className="bg-white min-h-full flex flex-col">
      {/* Header with Search */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        {(filter?.filter || activeColorFilter || activeOriginFilter) && (
          <div className="mb-2">
            <span className="text-sm bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentSoft))] bg-clip-text text-transparent font-medium">
              Filtro ativo: {
                activeColorFilter 
                  ? colorFilters.find(f => f.id === activeColorFilter)?.label
                  : activeOriginFilter 
                    ? `Origem: ${activeOriginFilter}`
                    : filter?.filter
              }
            </span>
          </div>
        )}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Busque por nome, telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Color Filters (only show if color filter is active) */}
      {isColorFilterActive && (
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {colorFilters.map((colorFilter) => (
              <button
                key={colorFilter.id}
                onClick={() => handleColorFilterClick(colorFilter.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  activeColorFilter === colorFilter.id
                    ? 'bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentSoft))] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${colorFilter.color}`}></div>
                <span className="text-sm font-semibold">{colorFilter.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeColorFilter === colorFilter.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-gray-600'
                }`}>
                  {colorFilter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filter Button */}
      {(activeColorFilter || activeOriginFilter) && (
        <div className="px-4 py-2 bg-white border-b border-gray-100">
          <button
            onClick={() => {
              setActiveColorFilter(null);
              setActiveOriginFilter(null);
              // Clear URL parameters
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.delete('filter');
              newUrl.searchParams.delete('origin');
              window.history.replaceState({}, '', newUrl.toString());
            }}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Standard Filters (only show if no active filters) */}
      {!isColorFilterActive && !isOriginFilterActive && (
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {filters.map((filterItem) => (
              <button
                key={filterItem.id}
                onClick={() => setActiveFilter(filterItem.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  activeFilter === filterItem.id
                    ? 'bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentSoft))] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span className="text-sm font-semibold">{filterItem.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeFilter === filterItem.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-gray-600'
                }`}>
                  {filterItem.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="px-4 py-4 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          {isColorFilterActive || activeColorFilter 
            ? `Contato com Clientes (${filteredLeads.length})`
            : isOriginFilterActive
              ? `${activeOriginFilter} (${filteredLeads.length})`
              : `Pendentes (${filteredLeads.length})`
          }
        </h2>
      </div>

      {/* Leads List */}
      <div className="flex-1 px-4 pb-4 space-y-4">
        {filteredLeads.map((lead) => {
          const leadColorCategory = getContactDaysColor(lead.id);
          const colorIndicator = leadColorCategory === 'verde' ? 'bg-green-500' : 
                                leadColorCategory === 'amarelo' ? 'bg-yellow-500' : 'bg-red-500';
          
          return (
            <button
              key={lead.id}
              onClick={() => handleLeadClick(lead.id)}
              className="w-full bg-white rounded-3xl border border-gray-100 p-4 text-left shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 relative">
                    {(lead as any).profileImage ? (
                      <img src={(lead as any).profileImage} alt={lead.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <User className="text-gray-500" size={20} />
                    )}
                    {/* Indicador de cor para contato */}
                    {(isColorFilterActive || activeColorFilter) && (
                      <div className={`absolute -top-1 -right-1 w-4 h-4 ${colorIndicator} rounded-full border-2 border-white`}></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{lead.name}</h3>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor((lead as any).status || 'Ativo')}`}>
                      {(lead as any).status || 'Ativo'}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-600">{(lead as any).code || `L${lead.id}`}</span>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-3 mb-3 border border-gray-200">
                <div className="flex items-center mb-2">
                  <Building2 size={16} className="text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">{(lead as any).propertyCharacteristics?.type || (lead as any).type || 'Imóvel'}</span>
                </div>
                
                <div className="flex items-center">
                  <Target size={16} className="text-orange-600 mr-2" />
                  <span className="text-sm text-gray-700">{(lead as any).category || 'Categoria'}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm mb-3">
                <div className="flex items-center bg-white rounded-full px-3 py-2 border border-gray-200">
                  {getSourceIcon((lead as any).origin?.source || (lead as any).source || 'website')}
                  <span className="ml-2 text-gray-700">{(lead as any).origin?.source || (lead as any).source || 'Website'}</span>
                </div>
                <div className="flex items-center bg-orange-50 rounded-full px-3 py-2 border border-orange-200">
                  <Wifi size={16} className="text-orange-500 mr-1" />
                  <span className="text-orange-700">{(lead as any).medium || 'Online'}</span>
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-2xl p-3 mb-3 border border-orange-200">
                <div className="flex items-center text-sm text-orange-700">
                  <span className="font-medium">Primeiro contato - {(lead as any).origin?.firstContact || (lead as any).firstContact || 'Não informado'}</span>
                </div>
              </div>

              {/* Lead Intensity Buttons */}
              <div className="bg-white rounded-2xl p-3 mb-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Intensidade do Lead</span>
                  <LeadIntensityButtons leadId={lead.id} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-gray-200">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Building2 size={14} className="mr-1" />
                  <span>{(lead as any).origin?.evaluation || (lead as any).evaluation || 'Não avaliado'}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                <span className="text-xs text-gray-500">
                  Retornar para o cliente - {(lead as any).returnDate || 'Não definido'}
                </span>
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-900">{(lead as any).responsible || 'Não atribuído'}</div>
                  <div className="text-xs text-gray-500">{(lead as any).role || 'Sem função'}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
