
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { Search, User, Building2, Calendar, Briefcase, Filter, ChevronDown, ArrowLeft } from 'lucide-react';
import { getLeadDetailPath } from '@/lib/routes/leads';

const mockData = [{
  id: 1,
  type: 'lead',
  title: 'João Silva',
  description: 'Interesse em apartamento de 2 quartos na Vila Madalena',
  category: 'Leads',
  icon: User
}, {
  id: 2,
  type: 'property',
  title: 'Casa Luxo',
  description: 'Casa de alto padrão com piscina e 4 suítes',
  category: 'Imóveis',
  icon: Building2
}, {
  id: 3,
  type: 'service',
  title: 'Relatório semanal',
  description: 'Relatório de vendas da última semana',
  category: 'Serviços',
  icon: Briefcase
}, {
  id: 4,
  type: 'agenda',
  title: 'Reunião com cliente',
  description: 'Reunião agendada para discutir proposta',
  category: 'Agenda',
  icon: Calendar
}, {
  id: 5,
  type: 'lead',
  title: 'Maria Oliveira',
  description: 'Interesse em casa com quintal em Pinheiros',
  category: 'Leads',
  icon: User
}, {
  id: 6,
  type: 'property',
  title: 'Apartamento Moderno',
  description: 'Apartamento com design moderno e vista panorâmica',
  category: 'Imóveis',
  icon: Building2
}, {
  id: 7,
  type: 'service',
  title: 'Análise de mercado',
  description: 'Análise completa do mercado imobiliário',
  category: 'Serviços',
  icon: Briefcase
}, {
  id: 8,
  type: 'agenda',
  title: 'Visita ao imóvel',
  description: 'Visita agendada ao imóvel de interesse',
  category: 'Agenda',
  icon: Calendar
}];

const categories = [{
  id: 'todos',
  label: 'Todos',
  icon: Filter
}, {
  id: 'leads',
  label: 'Leads',
  icon: User
}, {
  id: 'imoveis',
  label: 'Imóveis',
  icon: Building2
}, {
  id: 'servicos',
  label: 'Serviços',
  icon: Briefcase
}, {
  id: 'agenda',
  label: 'Agenda',
  icon: Calendar
}];

export default function SearchPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const handleLeadClick = (leadId: number) => {
    navigate(getLeadDetailPath(leadId));
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  const handleServiceClick = (serviceId: number) => {
    navigate(`/service/${serviceId}`);
  };

  const handleAgendaClick = (eventId: number) => {
    navigate(`/agenda/${eventId}`);
  };

  const filteredResults = mockData.filter(item => {
    const matchesSearchTerm = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'todos' || item.category.toLowerCase() === activeCategory;
    return matchesSearchTerm && matchesCategory;
  });

  const selectedCategory = categories.find(cat => cat.id === activeCategory);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b border-gray-100 ${
          isMobile ? 'p-4' : 'p-6'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Pesquisa</h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {selectedCategory && <selectedCategory.icon className="w-4 h-4 text-gray-600" />}
            <span className="text-sm text-gray-700">{selectedCategory?.label}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Category Dropdown */}
          {showCategoryFilter && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[120px]">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setShowCategoryFilter(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                      activeCategory === category.id ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 ${
                        activeCategory === category.id ? 'text-orange-600' : 'text-gray-500'
                      }`}
                    />
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className={`border-b border-gray-100 ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="O que você deseja pesquisar?"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-orange-300 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Recent Searches */}
      {searchTerm === '' && (
        <div className={`border-b border-gray-100 ${isMobile ? 'p-4' : 'p-6'}`}>
          <h3 className="text-gray-700 font-medium mb-3">Pesquisas recentes</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-gray-900">João Silva - Lead</span>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-gray-900">Casa Luxo - Imóvel</span>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-gray-900">Relatório semanal</span>
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-6'}`}>
        {filteredResults.length > 0 ? (
          <div className="space-y-3">
            {filteredResults.map(result => {
              const IconComponent = result.icon;
              const handleClick = () => {
                switch (result.type) {
                  case 'lead':
                    handleLeadClick(result.id);
                    break;
                  case 'property':
                    handlePropertyClick(result.id);
                    break;
                  case 'service':
                    handleServiceClick(result.id);
                    break;
                  case 'agenda':
                    handleAgendaClick(result.id);
                    break;
                }
              };
              return (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={handleClick}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{result.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                        {result.category}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-600">Tente usar palavras-chave diferentes</p>
          </div>
        ) : null}
      </div>

      {/* Click overlay to close dropdown */}
      {showCategoryFilter && (
        <div className="fixed inset-0 z-5" onClick={() => setShowCategoryFilter(false)} />
      )}
    </div>
  );
}
