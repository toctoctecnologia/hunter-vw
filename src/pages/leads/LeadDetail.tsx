import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFunnelConfig } from '@/context/FunnelConfigContext';
import { ChevronLeft, Phone, MessageCircle, Building, Home, Calendar, Clock, CheckCircle, Globe, MapPin, DollarSign, Users, Briefcase, Mail, Star, User, BarChart3, Activity, Target, TrendingUp, Award, Zap, Heart, ToggleLeft, ToggleRight, Share2 } from 'lucide-react';
import { LEAD_DETAIL_TABS, LeadDetailTab } from '@/types/lead';
import { PostSaleTab } from '@/components/leads/post-sale/PostSaleTab';
import { InterestedProperties } from '@/components/leads/properties/InterestedProperties';
import { useLeadsStore } from '@/hooks/vendas';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivitiesTab } from '@/features/leads/tabs/ActivitiesTab';
import { TasksTab } from '@/features/leads/tabs/TasksTab';

// Mock interactions data
const mockInteractions = [
  {
    id: 1,
    type: 'call',
    description: 'Ligação realizada - Cliente interessado',
    date: '2025-07-18',
    time: '14:30'
  },
  {
    id: 2,
    type: 'message',
    description: 'WhatsApp enviado com informações do imóvel',
    date: '2025-07-17',
    time: '09:15'
  }
];

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stages } = useFunnelConfig();
  const { leads, error, load } = useLeadsStore();
  useEffect(() => {
    load();
  }, [load]);
  const [activeTab, setActiveTab] = useState<LeadDetailTab['id']>('atividades');
  const [isQualified, setIsQualified] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Erro ao carregar lead: {error}
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum lead encontrado
      </div>
    );
  }

  const lead = leads.find((l) => l.id === parseInt(id || '1')) || leads[0];

  const showPostSale = ['negócio_fechado', 'pós_venda', 'receita_gerada'].includes(lead.stage);
  const tabs = LEAD_DETAIL_TABS.filter(tab => tab.id !== 'pos-venda' || showPostSale);

  const amenities = [
    'Ar condicionado', 'Churrasqueira', 'Piscina', 'Academia', 'Playground',
    'Sauna', 'Salão de festas', 'Quadra de tênis', 'Jardim', 'Portaria 24h'
  ];

  const renderInteracoesTab = () => (
    <ActivitiesTab leadId={lead.id} leadName={lead.name} />
  );

  const renderPerfilTab = () => (
    <div className="space-y-4">
      {/* Características do imóvel */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-black mb-3 flex items-center">
          <Home className="w-5 h-5 mr-2 text-gray-600" />
          Características do imóvel
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Tipo de imóvel</label>
            <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
              <option>Apartamento</option>
              <option>Casa</option>
              <option>Sobrado</option>
              <option>Cobertura</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-600">Quartos</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Banheiros</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Suítes</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3+</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Vagas</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Unidades por andar</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Interested Properties */}
      <InterestedProperties leadId={lead.id} />

      {/* Property Details */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-black mb-3 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-gray-600" />
          Detalhes do Imóvel
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Interesse</label>
            <input type="text" value={lead.interest} className="w-full p-3 border border-gray-200 rounded-lg mt-1" readOnly />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Valor mínimo</label>
              <input type="text" placeholder="R$ 0,00" className="w-full p-3 border border-gray-200 rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Valor máximo</label>
              <input type="text" placeholder="R$ 0,00" className="w-full p-3 border border-gray-200 rounded-lg mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-black mb-3">Comodidades Desejadas</h4>
        <div className="grid grid-cols-2 gap-2">
          {amenities.map((amenity, index) => (
            <label key={index} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

    const renderGestaoTab = () => (
      <TasksTab leadId={lead.id} />
    );

  return (
    <div className="fixed top-0 right-0 w-full md:max-w-2xl h-screen bg-gray-50 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/vendas')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{lead.name}</h1>
              <p className="text-sm text-gray-600">{lead.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
              </button>
            ))}
          </div>
        </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'visao-geral' && renderPerfilTab()}
            {activeTab === 'atividades' && renderInteracoesTab()}
            {activeTab === 'tarefas' && renderGestaoTab()}
            {activeTab === 'pos-venda' && <PostSaleTab lead={lead} />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}