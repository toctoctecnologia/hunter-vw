import { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Share2, ChevronLeft, Star, Edit, User, Mail, MapPin, DollarSign, Calendar, Building, Briefcase, Heart, Award, Clock, Users, Phone as PhoneIcon, Send, Home, Bed, Bath, Car, Square, Wifi, Shield, Zap, Sparkles, TreePine, Waves, Dumbbell, Music, CircleUserRound, Target, BarChart3, Activity, FileText, Plus, ToggleLeft, ToggleRight, NotebookPen, Instagram, Facebook, Linkedin, Youtube, Globe, ArrowLeft, ChevronRight } from 'lucide-react';
import { LEAD_DETAIL_TABS, LeadDetailTab, type Lead } from '@/types/lead';
import { PostSaleTab } from '@/components/leads/post-sale/PostSaleTab';
import { InterestedProperties } from '@/components/leads/properties/InterestedProperties';
import { ActivitiesTab } from '@/features/leads/tabs/ActivitiesTab';
import { TasksTab } from '@/features/leads/tabs/TasksTab';
import { useSearchParams } from 'react-router-dom';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onEdit?: () => void;
  isPage?: boolean;
}

type ActionType = 'agendar' | 'proposta' | 'fechado' | 'arquivar';

export const LeadDetailModal = ({ lead, onClose, onEdit, isPage = false }: LeadDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<LeadDetailTab['id']>('atividades');
  const [isQualified, setIsQualified] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [currentActionPage, setCurrentActionPage] = useState<ActionType | null>(null);
  const [currentFunnelStep, setCurrentFunnelStep] = useState(2);
  const [showFunnelAdvancement, setShowFunnelAdvancement] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('action') === 'agendar') {
      setCurrentActionPage('agendar');
    }
  }, [searchParams]);

  const mockInteractions = [
    {
      id: 1,
      date: '28/05/2025',
      type: 'note',
      user: 'Kemilly da Silva Peixoto',
      content: 'CORRETOR alterado de Guilherme Francis da Veiga para Daniel Capelani Custódio, unidade alterada de BALNEÁRIO CAMBORIÚ - AV. BRASIL para BOLD',
      source: 'instagram',
      isAI: false
    },
    {
      id: 2,
      date: '25/05/2025',
      type: 'note',
      user: 'IA Assistant',
      content: 'Cliente demonstrou interesse em apartamentos de 2 quartos na região da Vila Madalena. Orçamento estimado entre R$ 400.000 - R$ 600.000. Preferência por imóveis prontos para morar.',
      source: 'instagram',
      isAI: true
    }
  ];

  const mockProperties = [
    'Falcon Tower Ap 2401 - Vila Madalena',
    'Scenarium FG - Pinheiros', 
    'Bold Tower - Centro',
    'Vista Park - Itaim Bibi'
  ];

  const funnelSteps = [
    'Qualificação',
    'Diagnóstico', 
    'Solução',
    'Proposta',
    'Negociação',
    'Venda',
    'Fidelidade',
    'Receita',
    'Indicação'
  ];

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'linkedin': return Linkedin;
      case 'youtube': return Youtube;
      case 'google': return Globe;
      default: return Globe;
    }
  };

  const uniqueSources = [...new Set(mockInteractions.map(i => i.source))];

  const amenities = [
    'Interfone', 'Portaria 24 hrs', 'Piscina', 'Playground', 'Salão de festas',
    'Quadra de tênis', 'Mobiliado', 'Armário quarto', 'Armário cozinha',
    'Box despejo', 'Aceita permuta', 'Academia', 'Sauna', 'Churrasqueira',
    'Jardim', 'Varanda', 'Garagem coberta'
  ];

  const showPostSale = ['negócio_fechado', 'pós_venda', 'receita_gerada'].includes(lead.stage);
  const tabs = LEAD_DETAIL_TABS.filter(t => t.id !== 'pos-venda' || showPostSale);

  const handleActionClick = (action: ActionType) => {
    setCurrentActionPage(action);
  };

  const handleAdvanceFunnel = () => {
    if (currentFunnelStep < funnelSteps.length - 1) {
      setCurrentFunnelStep(currentFunnelStep + 1);
      setShowFunnelAdvancement(false);
      setSelectedProperty('');
    }
  };

  const renderActionPage = () => {
    if (!currentActionPage) return null;

    const actionConfigs = {
      agendar: {
        title: 'Agendar atividade',
        content: (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Atividade</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="radio" name="activity" className="w-4 h-4 text-orange-600" defaultChecked />
                  <span className="text-sm text-gray-900">Retornar para o cliente</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="activity" className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-900">Visita Agendada</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Selecione a data e horário</h4>
              <div className="flex space-x-3 mb-2">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">08/06/2025</span>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">09:00</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">8 de junho de 2025 às 09:00 é apenas uma sugestão</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Informações adicionais</h4>
              <textarea 
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                placeholder="Escreva do que deseja se lembrar"
                rows={3}
              />
            </div>

            <button className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg font-medium text-sm">
              Agendar atividade
            </button>
          </div>
        )
      },
      proposta: {
        title: 'Cadastrar nova proposta',
        content: (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">{lead.name}</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Building className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">[{lead.phone}] SCENARIUM FG - FILTRO - LANÇAMENTO</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">*Valor total da proposta</label>
              <input 
                type="text" 
                placeholder="Insira o valor da proposta"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código do imóvel</label>
              <input 
                type="text" 
                value="554399972080802"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forma de pagamento</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-900">Recursos próprios</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-900">Financiamento</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-900">Outros</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
              <textarea 
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                placeholder="Alguma observação?"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => setCurrentActionPage(null)}
                className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 rounded-lg font-medium text-sm"
              >
                Cancelar
              </button>
              <button className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-lg font-medium text-sm">
                Confirmar
              </button>
            </div>
          </div>
        )
      },
      fechado: {
        title: 'Marcar negócio fechado',
        content: (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selecione a data</label>
              <input 
                type="text" 
                value="07/06/2025"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor real do negócio fechado</label>
              <input 
                type="text" 
                placeholder="Informe o valor real do negócio fechado"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">*Natureza de negociação</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="radio" name="natureza" className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-900">Compra</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="natureza" className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-900">Aluguel</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="natureza" className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-900">Lançamento</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="natureza" className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-900">Captação</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código do imóvel</label>
              <input 
                type="text" 
                value="554399972080802"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Informações adicionais</label>
              <textarea 
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                placeholder="Insira aqui a nota fiscal, número do pedido ou qualquer outra informação que desejar"
                rows={3}
              />
            </div>

            <button className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg font-medium text-sm">
              Marcar negócio fechado
            </button>
          </div>
        )
      },
      arquivar: {
        title: 'Arquivar lead',
        content: (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selecione o motivo</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg text-sm">
                <option>Pesquisar um motivo...</option>
                <option>Não tem interesse</option>
                <option>Fora do orçamento</option>
                <option>Não atende</option>
                <option>Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Informações adicionais</label>
              <textarea 
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                placeholder="Explique por que o atendimento terminou"
                rows={4}
              />
            </div>

            <button className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg font-medium text-sm">
              Arquivar lead
            </button>
          </div>
        )
      }
    };

    const config = actionConfigs[currentActionPage];

    return (
      <div className="bg-white w-full h-full flex flex-col">
        <div className="flex-shrink-0 p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setCurrentActionPage(null)}
              className="text-orange-600 hover:bg-orange-50 rounded-lg p-2 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-orange-600">{config.title}</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {config.content}
        </div>
      </div>
    );
  };

  const renderInteracoesTab = () => (
    <ActivitiesTab leadId={lead.id} leadName={lead.name} />
  );

  const renderPerfilTab = () => (
    <div className="space-y-4">
      {/* Anotações do Cliente */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-black mb-3">Anotações do Cliente</h4>
        <textarea 
          value={clientNotes}
          onChange={(e) => setClientNotes(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg h-32"
          placeholder="Digite anotações sobre o cliente..."
        />
      </div>

      {/* Dados do lead */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-black mb-3 flex items-center">
          <User className="w-5 h-5 mr-2 text-gray-600" />
          Dados do lead
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Nome</label>
            <input type="text" value={lead.name} className="w-full p-3 border border-gray-200 rounded-lg mt-1" readOnly />
          </div>
          <div>
            <label className="text-sm text-gray-600">E-mail</label>
            <input type="email" value={lead.email ?? ''} className="w-full p-3 border border-gray-200 rounded-lg mt-1" readOnly />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Telefone 1</label>
              <input type="text" value={lead.phone ?? ''} className="w-full p-3 border border-gray-200 rounded-lg mt-1" readOnly />
            </div>
            <div>
              <label className="text-sm text-gray-600">Telefone 2</label>
              <input type="text" value="(11) 98765-4321" className="w-full p-3 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg mt-1" readOnly />
              <span className="text-xs text-blue-600">Preenchido pela IA</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Cônjuge</label>
              <input type="text" value="Maria Silva Pinheiro" className="w-full p-3 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg mt-1" readOnly />
              <span className="text-xs text-blue-600">Preenchido pela IA</span>
            </div>
            <div>
              <label className="text-sm text-gray-600">Profissão</label>
              <input type="text" value="Empresário" className="w-full p-3 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg mt-1" readOnly />
              <span className="text-xs text-blue-600">Preenchido pela IA</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Sexo</label>
              <input type="text" value="Masculino" className="w-full p-3 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg mt-1" readOnly />
              <span className="text-xs text-blue-600">Preenchido pela IA</span>
            </div>
            <div>
              <label className="text-sm text-gray-600">Data de nascimento</label>
              <input type="text" value="15/03/1985" className="w-full p-3 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg mt-1" readOnly />
              <span className="text-xs text-blue-600">Preenchido pela IA</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Campanha</label>
            <input type="text" value={lead.source ?? ''} className="w-full p-3 border border-gray-200 rounded-lg mt-1" readOnly />
          </div>
        </div>
      </div>

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

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-black mb-3 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-gray-600" />
          Localização e Faixas
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Cidades de interesse</label>
            <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Belo Horizonte</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Valor imóvel de</label>
              <input type="text" placeholder="R$ 0,00" className="w-full p-3 border border-gray-200 rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Valor imóvel até</label>
              <input type="text" placeholder="R$ 0,00" className="w-full p-3 border border-gray-200 rounded-lg mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Área interna de</label>
              <input type="text" placeholder="0 m²" className="w-full p-3 border border-gray-200 rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Área interna até</label>
              <input type="text" placeholder="0 m²" className="w-full p-3 border border-gray-200 rounded-lg mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Área de lote de</label>
              <input type="text" placeholder="0 m²" className="w-full p-3 border border-gray-200 rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Área de lote até</label>
              <input type="text" placeholder="0 m²" className="w-full p-3 border border-gray-200 rounded-lg mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Interested Properties */}
      <InterestedProperties leadId={lead.id} />

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-black mb-3 flex items-center">
          <Building className="w-5 h-5 mr-2 text-gray-600" />
          Detalhes construtivos
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Tipo de lançamento</label>
            <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
              <option>Lançamento</option>
              <option>Pronto para morar</option>
              <option>Em construção</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Nº</label>
              <input type="text" placeholder="Número" className="w-full p-3 border border-gray-200 rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Complemento</label>
              <input type="text" placeholder="Apto, casa..." className="w-full p-3 border border-gray-200 rounded-lg mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Tipo de complemento</label>
            <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
              <option>Apartamento</option>
              <option>Casa</option>
              <option>Sobrado</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Elevadores</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3+</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Avulso/Lançamento</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
                <option>Avulso</option>
                <option>Lançamento</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Status da obra</label>
            <select className="w-full p-3 border border-gray-200 rounded-lg mt-1">
              <option>Em construção</option>
              <option>Pronto</option>
              <option>Em projeto</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-black mb-3 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-gray-600" />
          Amenidades
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {amenities.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2 text-sm">
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

  // Se estamos mostrando uma página de ação, renderize apenas ela
  if (currentActionPage) {
    return renderActionPage();
  }

  if (isPage) {
    return (
      <div className="bg-white w-full h-full flex flex-col">
          <div className="flex-shrink-0 bg-white border-b border-gray-200">
            <div className="flex">
            {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 font-medium text-sm transition-all duration-200 border-b-2 ${
                      activeTab === tab.id
                        ? 'text-orange-600 border-orange-600 bg-white'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'visao-geral' && renderPerfilTab()}
            {activeTab === 'atividades' && renderInteracoesTab()}
            {activeTab === 'tarefas' && renderGestaoTab()}
            {activeTab === 'pos-venda' && <PostSaleTab lead={lead} />}
          </div>

        {activeTab === 'tarefas' && (
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <button 
              onClick={() => setShowFunnelAdvancement(true)}
              className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-all duration-200 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
              <span>Avançar Funil</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full md:max-w-2xl h-dvh flex flex-col overflow-y-auto">
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-orange-600 font-semibold text-lg truncate">{lead.name}</h3>
              <p className="text-orange-600/80 text-sm">Detalhes do Lead</p>
            </div>
            <div className="flex items-center space-x-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-orange-600 hover:bg-orange-600/20 rounded-lg p-2 transition-all duration-200"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="text-orange-600 hover:bg-orange-600/20 rounded-lg p-2 transition-all duration-200"
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="text-orange-600 hover:bg-orange-600/20 rounded-lg p-2 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

          <div className="flex-shrink-0 bg-white border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 font-medium text-sm transition-all duration-200 border-b-2 ${
                      activeTab === tab.id
                        ? 'text-orange-600 border-orange-600 bg-white'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'visao-geral' && renderPerfilTab()}
            {activeTab === 'atividades' && renderInteracoesTab()}
            {activeTab === 'tarefas' && renderGestaoTab()}
            {activeTab === 'pos-venda' && <PostSaleTab lead={lead} />}
          </div>

        {activeTab === 'tarefas' && (
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <button 
              onClick={() => setShowFunnelAdvancement(true)}
              className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-all duration-200 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
              <span>Avançar Funil</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
