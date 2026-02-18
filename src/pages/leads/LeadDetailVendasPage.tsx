import React, { useState, useEffect, lazy, Suspense } from 'react';
import { debugLog } from '@/utils/debug';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Phone, Send, Clock, Archive, User, Globe, Facebook, Instagram, Tag, Thermometer, Pencil, BadgeCheck } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import EditLeadFieldDialog from '@/components/leads/EditLeadFieldDialog';
import { PropertyCharacteristicsModal, PropertyCharacteristicsData } from '@/components/leads/PropertyCharacteristicsModal';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ScheduleActivityModal } from '@/components/agenda/Event';
import { AdvanceFunnelModal } from '@/components/vendas/AdvanceFunnelModal';
import { ArchiveLeadModal } from '@/components/vendas/ArchiveLeadModal';
import { FunnelConfigModal } from '@/components/vendas/FunnelConfigModal';
import TransferLeadModal from '@/pages/leads/List/TransferLeadModal';
import { useFunnelConfig } from '@/context/FunnelConfigContext';
import { useLeadsStore, useUpdateLead } from '@/hooks/vendas';
import { STAGE_LABEL_TO_SLUG } from '@/data/stageMapping';
import type { LeadStage } from '@/types/lead';
import {
  ProfileHeader,
  StatusDropdown,
  LeadTabs,
  LeadCards,
  NextStepDialog,
} from '@/components/vendas';
import { InterestedProperties } from '@/components/leads/properties/InterestedProperties';
import { ActivitiesTab, TasksTab } from '@/features/leads';
import { PostSaleTab } from '@/components/leads/post-sale/PostSaleTab';
import { UpdatesPanel } from '@/components/shared/UpdatesPanel';
import { toast } from '@/components/ui/use-toast';
import type { LeadDeal } from '@/api/deals';
// stages provided by context

const DealsTab = lazy(() => import('@/pages/lead/DealsTab'));

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

interface ScheduleModalState {
  isOpen: boolean;
  currentLead: {
    id: number;
    nome: string;
    origem?: string;
    interesse?: string;
  } | null;
}

export default function LeadDetailVendasPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const TAB_VALUES = ['visao-geral', 'atividades', 'tarefas', 'deals', 'pos-venda'] as const;
  type TabValue = (typeof TAB_VALUES)[number];
  const tabFromUrl = searchParams.get('tab');
  const initialTab: TabValue = TAB_VALUES.includes(tabFromUrl as TabValue)
    ? (tabFromUrl as TabValue)
    : 'visao-geral';
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
  const [shouldRenderDealsTab, setShouldRenderDealsTab] = useState(initialTab === 'deals');
  const [showScheduleModal, setShowScheduleModal] = useState<ScheduleModalState>({
    isOpen: false,
    currentLead: null
  });
  const [showAdvanceFunnelModal, setShowAdvanceFunnelModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showStageConfigModal, setShowStageConfigModal] = useState(false);
  const [showTransferLeadModal, setShowTransferLeadModal] = useState(false);
  const [showFunnelDropdown, setShowFunnelDropdown] = useState(false);
  const { stages } = useFunnelConfig();
  const [currentFunnelStage, setCurrentFunnelStage] = useState(1); // Start at Em Atendimento
  const [showNextStepModal, setShowNextStepModal] = useState(false);
  const [selectedTemperature, setSelectedTemperature] = useState<number | null>(null);
  const [leadReadingEnabled, setLeadReadingEnabled] = useState(true);
  const focusedTaskId = searchParams.get('taskId');

  // All hooks must be called at the top level, before any early returns
  const { leads, error, load, move } = useLeadsStore();
  const { mutateAsync: updateLead } = useUpdateLead();
  
  const leadId = parseInt(id || '0');
  const defaultLead: any = {
    id: leadId,
    name: 'Nenhum lead encontrado',
    phone: '',
    stage: 'pré_atendimento',
    service: '',
    origin: {
      source: '',
      campaign: '',
      propertyType: '',
      connectivity: '',
      firstContact: '',
      evaluation: ''
    },
    propertyCharacteristics: {
      propertyTypes: [],
      bedrooms: '',
      suites: '',
      propertyAge: '',
      city: '',
      neighborhood: '',
      fullAddress: '',
      number: '',
      complement: '',
      complementType: '',
      minValue: '',
      maxValue: '',
      minInternalArea: '',
      maxInternalArea: '',
      minLotArea: '',
      maxLotArea: '',
      launchType: [],
      modality: [],
      constructionStage: [],
      constructionStart: '',
      constructionEnd: '',
      buildingName: '',
      condominiumName: '',
      elevators: '',
      has24hDoorman: false,
      hasIntercom: false,
      destinations: [],
      internalFeatures: [],
      leisureFeatures: [],
      commercialSituation: [],
      highlightTags: [],
    } as PropertyCharacteristicsData,
    lastUpdate: '',
    status: '',
    createdAt: '',
    capturedBy: null,
    publishedToRoleta: false,
    activities: [],
    tasks: []
  };
  const foundLead = leads.find(l => l.id === leadId) || {};
  const leadBase = { ...defaultLead, ...foundLead };
  const safeOrigin = leadBase.origin ?? {};
  const safePropertyCharacteristics = leadBase.propertyCharacteristics ?? {};
  const lead = {
    ...leadBase,
    origin: safeOrigin,
    propertyCharacteristics: safePropertyCharacteristics,
  };
  const showPostSale = ['negócio_fechado', 'pós_venda', 'receita_gerada'].includes(lead.stage);

  const [property, setProperty] = useState<PropertyCharacteristicsData>(
    lead.propertyCharacteristics as PropertyCharacteristicsData
  );
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);

  useEffect(() => {
    if (tabFromUrl && TAB_VALUES.includes(tabFromUrl as TabValue)) {
      const nextTab = tabFromUrl as TabValue;
      setActiveTab(nextTab);
      if (nextTab === 'deals') {
        setShouldRenderDealsTab(true);
      }
    }
  }, [tabFromUrl]);

  useEffect(() => {
    if (focusedTaskId) {
      setActiveTab('tarefas');
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('tab', 'tarefas');
        return next;
      });
    }
  }, [focusedTaskId, setSearchParams]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get('action') === 'agendar') {
      setShowScheduleModal({
        isOpen: true,
        currentLead: {
          id: lead.id,
          nome: lead.name,
          origem: safeOrigin.source,
          interesse: lead.interest,
        },
      })
    }
  }, [searchParams, lead]);

  useEffect(() => {
    setProperty(lead.propertyCharacteristics as PropertyCharacteristicsData);
  }, [lead.propertyCharacteristics]);

  // Early returns after all hooks have been called
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Erro ao carregar leads: {error}
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

  const handlePropertySave = async (data: PropertyCharacteristicsData) => {
    setProperty(data);

    try {
      await fetch(`/leads/${lead.id}/property`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      // TODO: persistir
    }

    setShowPropertyDialog(false);
  };
  const handleBack = () => {
    navigate('/vendas');
  };
  const handleCall = () => {
    window.open(`tel:${lead.phone}`, '_self');
  };
  const handleMessage = () => {
    const whatsappNumber = lead.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${whatsappNumber}`, '_blank');
  };
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const handleDealWon = (deal: LeadDeal) => {
    toast({
      title: 'Negócio fechado registrado',
      description: `Comissão prevista de ${formatCurrency(deal.commissionBase ?? deal.amount)}.`,
    });
    setShouldRenderDealsTab(true);
    setActiveTab('deals');
    const params = new URLSearchParams(searchParams);
    params.set('tab', 'deals');
    setSearchParams(params);
  };
  const getFunnelStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'pré-atendimento':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'em atendimento':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'agendamento':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'visita':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'proposta enviada':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'em negociação':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'negócio fechado':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'indicação':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'receita gerada':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pós-venda':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  const handleStageSelect = (stageIndex: number) => {
    setCurrentFunnelStage(stageIndex);
    setShowFunnelDropdown(false);
    const newStageLabel = stages[stageIndex];
    const newStage = (STAGE_LABEL_TO_SLUG[newStageLabel] || newStageLabel) as LeadStage;
    move(lead.id, newStage);
    if (!USE_MOCKS) {
      updateLead({ id: lead.id, stage: newStage });
    }
    debugLog(`Avançando para: ${stages[stageIndex]}`);
  };
  const handleTabChange = (value: string) => {
    if (TAB_VALUES.includes(value as TabValue)) {
      const nextValue = value as TabValue;
      setActiveTab(nextValue);
      if (nextValue === 'deals') {
        setShouldRenderDealsTab(true);
      }
      const params = new URLSearchParams(searchParams);
      params.set('tab', nextValue);
      setSearchParams(params);
    }
  };
const getSourceIcon = (source?: string) => {
  if (!source) {
    return <Globe className="w-4 h-4 text-gray-600" />;
  }

  switch (source.toLowerCase()) {
    case 'facebook leads':
    case 'facebook':
      return <Facebook className="w-4 h-4 text-blue-600" />;
    case 'instagram':
      return <Instagram className="w-4 h-4 text-pink-600" />;
    case 'indicação':
      return <User className="w-4 h-4 text-green-600" />;
    default:
      return <Globe className="w-4 h-4 text-gray-600" />;
  }
};
const getTemperatureColor = (index: number) => {
    const colors = [
      'bg-slate-300', // Mais frio
      'bg-sky-400',   
      'bg-yellow-400', 
      'bg-red-500'    // Mais quente
    ];
    return colors[index];
  };

  const getTemperatureIntensity = (index: number) => {
    const intensities = [
      'Muito Frio',
      'Frio',
      'Morno',
      'Quente'
    ];
    return intensities[index];
  };

  const visaoGeralTab = (
    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
      {/* Enhanced Service Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-gray-700 font-medium mb-3">Em Atendimento</h3>
        <p className="text-gray-900 text-sm mb-4">{lead.service}</p>

        {/* Origin Information */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {getSourceIcon(safeOrigin.source)}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{safeOrigin.source ?? ''}</p>
              <p className="text-xs text-gray-500">Origem do lead</p>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{safeOrigin.connectivity ?? ''}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-orange-600" />
              <h4 className="font-medium text-gray-900 text-sm">{safeOrigin.campaign ?? ''}</h4>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                {safeOrigin.propertyType ?? ''}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-gray-500">Primeiro contato</p>
              <p className="font-medium text-gray-900">{safeOrigin.firstContact ?? ''}</p>
            </div>
            <div>
              <p className="text-gray-500">Tipo</p>
              <p className="font-medium text-gray-900">{safeOrigin.evaluation ?? ''}</p>
              <p className="text-gray-500 mt-1">Última atualização: {lead.lastUpdate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Date and Value */}
      <LeadCards lead={lead} />

      {/* Temperature Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-gray-700 font-medium mb-3">Intensidade do Lead</h3>
        <div className="flex items-center justify-center gap-4 mb-3">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => setSelectedTemperature(index)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                getTemperatureColor(index)
              } ${
                selectedTemperature === index
                  ? 'ring-4 ring-orange-300 scale-110'
                  : 'hover:scale-105'
              }`}
            >
              <Thermometer className="w-6 h-6 text-white" />
            </button>
          ))}
        </div>
        {selectedTemperature !== null && (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              {getTemperatureIntensity(selectedTemperature)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Lead classificado como {getTemperatureIntensity(selectedTemperature).toLowerCase()}
            </p>
          </div>
        )}
      </div>

      {/* Property Characteristics */}
      <div className="bg-card dark:bg-card rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-foreground font-medium">Características do imóvel</h3>
          <button
            type="button"
            onClick={() => setShowPropertyDialog(true)}
            className="p-1"
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* Display selected characteristics */}
        <div className="space-y-4">
          {/* Types */}
          {property?.propertyTypes?.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Tipo</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {property.propertyTypes.map((type) => (
                  <span key={type} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tipologia */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {property?.bedrooms && (
              <div>
                <span className="text-sm text-muted-foreground">Quartos</span>
                <p className="font-medium text-foreground">{property.bedrooms.replace('min', 'A partir de ').replace('exact', 'Exatamente ')}</p>
              </div>
            )}
            {property?.suites && (
              <div>
                <span className="text-sm text-muted-foreground">Suítes</span>
                <p className="font-medium text-foreground">{property.suites.replace('min', 'A partir de ')}</p>
              </div>
            )}
            {property?.propertyAge && (
              <div>
                <span className="text-sm text-muted-foreground">Idade</span>
                <p className="font-medium text-foreground">Até {property.propertyAge} anos</p>
              </div>
            )}
          </div>

          {/* Location */}
          {(property?.city || property?.neighborhood) && (
            <div>
              <span className="text-sm text-muted-foreground">Localização</span>
              <p className="font-medium text-foreground">
                {[property.neighborhood, property.city].filter(Boolean).join(', ')}
              </p>
            </div>
          )}

          {/* Values */}
          {(property?.minValue || property?.maxValue) && (
            <div>
              <span className="text-sm text-muted-foreground">Valor</span>
              <p className="font-medium text-foreground">
                {property.minValue && `R$ ${property.minValue}`}
                {property.minValue && property.maxValue && ' - '}
                {property.maxValue && `R$ ${property.maxValue}`}
              </p>
            </div>
          )}

          {/* Areas */}
          {(property?.minInternalArea || property?.maxInternalArea) && (
            <div>
              <span className="text-sm text-muted-foreground">Área interna</span>
              <p className="font-medium text-foreground">
                {property.minInternalArea && `${property.minInternalArea}m²`}
                {property.minInternalArea && property.maxInternalArea && ' - '}
                {property.maxInternalArea && `${property.maxInternalArea}m²`}
              </p>
            </div>
          )}

          {/* Destinations */}
          {property?.destinations?.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Destinação</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {property.destinations.map((dest) => (
                  <span key={dest} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">
                    {dest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Internal Features */}
          {property?.internalFeatures?.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Características internas</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {property.internalFeatures.map((feat) => (
                  <span key={feat} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Leisure Features */}
          {property?.leisureFeatures?.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Lazer</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {property.leisureFeatures.map((feat) => (
                  <span key={feat} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlight Tags */}
          {property?.highlightTags?.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Destaques</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {property.highlightTags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(!property?.propertyTypes?.length && !property?.bedrooms && !property?.city && !property?.destinations?.length) && (
            <p className="text-sm text-muted-foreground italic">Clique no ícone de edição para adicionar características</p>
          )}
        </div>
      </div>

      <PropertyCharacteristicsModal
        open={showPropertyDialog}
        onOpenChange={setShowPropertyDialog}
        initialData={property}
        onSave={handlePropertySave}
      />

      {/* Lead Reading Toggle */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                leadReadingEnabled ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  leadReadingEnabled ? 'text-green-600' : 'text-red-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {leadReadingEnabled ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Leitura do Lead</h3>
              <p className="text-sm text-gray-500">Atualizar dados automaticamente</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${leadReadingEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {leadReadingEnabled ? 'Ativo' : 'Inativo'}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={leadReadingEnabled}
                onChange={(e) => setLeadReadingEnabled(e.target.checked)}
                className="sr-only"
                id="lead-reading-toggle"
              />
              <label
                htmlFor="lead-reading-toggle"
                className={`block w-11 h-6 rounded-full cursor-pointer relative transition-colors ${
                  leadReadingEnabled
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                    leadReadingEnabled ? 'translate-x-5 left-0.5' : 'translate-x-0 left-0.5'
                  }`}
                ></span>
              </label>
            </div>
          </div>
        </div>

        {leadReadingEnabled ? (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-sm font-medium">Próxima atualização:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Jun. 27 • Manhã</span>
          </div>
        ) : (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.25-7.5A2.25 2.25 0 0118 4.5H6a2.25 2.25 0 00-2.25 2.25v1.372c0 .516.235 1.004.642 1.372L12 14.25l7.608-5.256c.407-.368.642-.856.642-1.372V6.75A2.25 2.25 0 0018 4.5z"
                />
              </svg>
              <span className="text-sm text-gray-700">
                Fique tranquilo, agora não temos acesso a conversas de você e esse contato.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Updates Panel - Full Width */}
      <UpdatesPanel
        title="Atualizações do lead"
        subject={{ kind: 'lead', id: String(lead.id) }}
      />

      {/* Interested Properties */}
      <InterestedProperties leadId={lead.id} className="rounded-2xl" />
    </div>
    );



  const dealsTabContent = (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Carregando negócios...</div>}>
      {shouldRenderDealsTab ? (
        <DealsTab leadId={String(lead.id)} leadName={lead.name} onDealWon={handleDealWon} />
      ) : (
        <div className="p-6 text-sm text-muted-foreground">
          Acompanhe aqui os negócios fechados vinculados a este lead.
        </div>
      )}
    </Suspense>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="mx-auto max-w-md md:max-w-screen-xl md:px-8 bg-white min-h-screen flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ProfileHeader lead={lead} onBack={handleBack} />
        <div className="p-4 border-b border-gray-100">
          <StatusDropdown
            stages={stages}
            currentStage={currentFunnelStage}
            show={showFunnelDropdown}
            onToggle={() => setShowFunnelDropdown(!showFunnelDropdown)}
            onSelect={handleStageSelect}
          />
          {showPostSale && (
            <button
              type="button"
              onClick={() => handleTabChange('deals')}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            >
              <BadgeCheck className="w-4 h-4" /> Negócio fechado
            </button>
          )}
          <button
            onClick={() => setShowStageConfigModal(true)}
            className="mt-2 text-xs text-blue-600 underline"
          >
            Configurar etapas
          </button>
        </div>

          <div className="flex-1 bg-gray-50">
            <LeadTabs
              active={activeTab}
              onChange={handleTabChange}
              visaoGeral={visaoGeralTab}
              atividades={
                <ActivitiesTab
                  leadId={lead.id}
                  leadName={lead.name}
                  initialActivities={lead.activities}
                />
              }
              tarefas={<TasksTab leadId={lead.id} focusedTaskId={focusedTaskId} />}
              deals={dealsTabContent}
              posVenda={showPostSale ? <PostSaleTab lead={lead} /> : undefined}
            />
          </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-white border-t border-gray-100 space-y-4">
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={handleCall} className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors active:bg-orange-200 border border-orange-100">
              <Phone className="w-6 h-6 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">Ligar</span>
            </button>
            <button onClick={handleMessage} className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors active:bg-orange-200 border border-orange-100">
              <Send className="w-6 h-6 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">Responder</span>
            </button>
            <button
              onClick={() =>
                setShowScheduleModal({
                  isOpen: true,
                  currentLead: {
                    id: lead.id,
                    nome: lead.name,
                    origem: safeOrigin.source,
                    interesse: lead.interest
                  }
                })
              }
              className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors active:bg-orange-200 border border-orange-100"
            >
              <Clock className="w-6 h-6 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">Agendar</span>
            </button>
          </div>

          {/* Next Step Button */}
          <button onClick={() => setShowNextStepModal(true)} className="w-full p-4 bg-orange-600 text-white rounded-2xl font-semibold hover:bg-orange-700 transition-colors shadow-sm">
            Defina seu próximo passo
          </button>

          <button
            onClick={() => setShowTransferLeadModal(true)}
            className="flex items-center justify-center gap-3 w-full p-4 bg-white hover:bg-gray-50 rounded-2xl transition-colors active:bg-gray-100 border border-gray-200"
          >
            <User className="w-5 h-5 text-gray-700" />
            <span className="text-gray-800 font-medium">Transferir lead</span>
          </button>

          {/* Archive Button */}
          <button onClick={() => setShowArchiveModal(true)} className="flex items-center justify-center gap-3 w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors active:bg-gray-200 border border-gray-200">
            <Archive className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Arquivar</span>
          </button>
        </div>

        <NextStepDialog
          open={showNextStepModal}
          onClose={() => setShowNextStepModal(false)}
          leadId={lead.id}
          leadName={lead.name}
          leadSource={lead.source}
        />

          {/* Modals */}
          <ScheduleActivityModal
            isOpen={showScheduleModal.isOpen}
            lead={showScheduleModal.currentLead}
            onClose={() =>
              setShowScheduleModal((prev) => ({ ...prev, isOpen: false }))
            }
            onAdvanceFunnel={() => {
              setShowScheduleModal((prev) => ({ ...prev, isOpen: false }));
              setShowAdvanceFunnelModal(true);
            }}
          />
        
        <AdvanceFunnelModal
          isOpen={showAdvanceFunnelModal}
          onClose={() => setShowAdvanceFunnelModal(false)}
          currentStage={stages[currentFunnelStage]}
          stages={stages}
        />

        <ArchiveLeadModal isOpen={showArchiveModal} onClose={() => setShowArchiveModal(false)} />

        <FunnelConfigModal isOpen={showStageConfigModal} onClose={() => setShowStageConfigModal(false)} />

        <TransferLeadModal
          open={showTransferLeadModal}
          lead={{
            id: String(lead.id),
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            ownerId: lead.ownerId,
            ownerName: lead.ownerName,
            status: 'contacted',
            source: lead.source,
            createdAt: lead.createdAt || new Date().toISOString(),
            updatedAt: lead.lastUpdate,
          }}
          onClose={() => setShowTransferLeadModal(false)}
          onTransferred={() => {
            setShowTransferLeadModal(false);
          }}
          onTransferredToQueue={() => {
            setShowTransferLeadModal(false);
          }}
        />

      </motion.div>
    </div>
  );

}
