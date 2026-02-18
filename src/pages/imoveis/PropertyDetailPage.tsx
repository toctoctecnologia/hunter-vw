import React, { useState } from 'react';
import { debugLog } from '@/utils/debug';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share, MapPin, DollarSign, Ruler, Key, BarChart3, Home, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import { PropertyGallery } from '@/components/imoveis/PropertyGallery';
import { WhatsAppShare } from '@/components/imoveis/WhatsAppShare';
import { Switch } from '@/components/ui/switch';

const mockProperty = {
  id: 2384,
  title: 'Apartamento à venda no Infinity Coast',
  address: 'Rua Julieta Lins, 271 / Apto 2502 – Pioneiros',
  city: 'Balneário Camboriú – SC',
  cep: 'CEP: 88331-010',
  lastUpdate: '29/05/2025 às 09:51',
  price: 'R$ 8.300.000,00',
  condominium: 'R$ 2.000,00',
  iptu: 'R$ 0,00',
  internalArea: '169,00 m²',
  externalArea: '0,00 m²',
  lotArea: '0,00 m²',
  keyLocation: 'No local',
  bedrooms: 3,
  suites: 3,
  bathrooms: 3,
  garages: 3,
  privateArea: '169 m² de área privativa',
  description: 'Com 169m² de área privativa, este imóvel prestigiado oferece uma combinação perfeita de luxo, conforto e modernidade, pronto para você viver uma experiência única.',
  features: [
    '3 suítes espaçosas (uma delas é master com banheira e vista mar)',
    '3 vagas de garagem',
    'Vista deslumbrante',
    'Sacada aberta',
    'Churrasqueira à gás',
    'Living com 3 ambientes',
    'Espaço gourmet',
    'Finamente mobiliado, decorado e equipado'
  ],
  fullDescription: 'Este empreendimento é sinônimo de sofisticação e conforto, oferecendo uma deslumbrante vista para o oceano e para a cidade. Sua sacada aberta é o local perfeito para relaxar...',
  responsible: '(Contato oculto por padrão; ao clicar, exibe nome, telefone e e-mail e registra quem visualizou.)',
  images: [
    '/uploads/a2ccab04-075d-468a-960a-95feac3902b7.png',
    '/uploads/809eebcc-900b-44a6-acbc-02a48a21fbe2.png',
    '/uploads/6f12cb48-e678-4bb3-9f5f-fc5e7252f802.png',
    '/uploads/c3175c8b-aefd-479a-9a58-f6109248a8f0.png',
    '/uploads/ec0a215b-c210-46ee-a291-15ae72ca4a6a.png'
  ],
  developmentFeatures: {
    external: {
      elevadores: 4,
      portaoEletronico: true,
      unidadesPorAndar: false,
      aquecedorEletrico: false,
      aquecedorSolar: false,
      boxDespejo: false,
      cftv: false,
      jardim: false,
      lavanderia: false,
      quintal: false,
      interfone: false,
      andares: false,
      aguaIndividual: true,
      aquecedorGas: false,
      alarme: true,
      cercaEletrica: false,
      gasCanalizdo: true,
      gramado: true,
      portaria24hrs: true
    },
    leisure: [
      'Piscina com borda infinita',
      'Academia equipada',
      'Salão de festas',
      'Playground externo',
      'Espaço gourmet',
      'Pista de caminhada'
    ],
    construction: {
      status: 'Obra em início (0%)',
      startDate: 'Julho/2024',
      deliveryDate: 'Dezembro/2028',
      incorporation: '18-31.005'
    }
  }
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'imovel' | 'empreendimento'>('imovel');
  const [showWhatsAppShare, setShowWhatsAppShare] = useState(false);

  const handleBack = () => {
    navigate('/imoveis');
  };

  const handleShare = () => {
    setShowWhatsAppShare(true);
  };

  const handleWhatsAppShare = () => {
    setShowWhatsAppShare(false);
    debugLog('Sharing via WhatsApp...');
  };

  const handleDownload = (selectedCount: number) => {
    debugLog(`Downloading ${selectedCount} images`);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-[375px] md:max-w-none mx-auto md:px-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          Cód. Imóvel: {mockProperty.id}
        </h1>
        <button 
          onClick={handleShare}
          className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <Share size={24} className="text-gray-700" />
        </button>
      </div>

      <div className="pb-24">
        {/* Property Images Gallery */}
        <PropertyGallery 
          images={mockProperty.images} 
          onDownload={handleDownload}
        />

        {/* Tabs - Updated Design */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
          <div className="flex px-4">
            <button
              onClick={() => setActiveTab('imovel')}
              className={`flex-1 py-4 text-center font-semibold text-base relative transition-all duration-300 ${
                activeTab === 'imovel'
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Imóvel
              {activeTab === 'imovel' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-sm"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('empreendimento')}
              className={`flex-1 py-4 text-center font-semibold text-base relative transition-all duration-300 ${
                activeTab === 'empreendimento'
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Empreendimento
              {activeTab === 'empreendimento' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-sm"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 space-y-6">
          {activeTab === 'imovel' && (
            <>
              {/* Location Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-50 rounded-xl">
                    <MapPin size={20} className="text-orange-600" />
                  </div>
                  <h3 className="text-orange-600 font-semibold text-lg">Localização</h3>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-gray-900 leading-tight">{mockProperty.title}</h4>
                  <p className="text-gray-600">{mockProperty.address}</p>
                  <p className="text-gray-600">{mockProperty.city} • {mockProperty.cep}</p>
                  <div className="flex items-center space-x-2 pt-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Última atualização: {mockProperty.lastUpdate}</span>
                  </div>
                </div>
              </div>

              {/* Values Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-50 rounded-xl">
                    <DollarSign size={20} className="text-orange-600" />
                  </div>
                  <h3 className="text-orange-600 font-semibold text-lg">Valores</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Valor do imóvel:</span>
                    <span className="font-semibold text-gray-900 text-right">{mockProperty.price}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Condomínio:</span>
                    <span className="font-semibold text-gray-900">{mockProperty.condominium}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">IPTU (mensal):</span>
                    <span className="font-semibold text-gray-900">{mockProperty.iptu}</span>
                  </div>
                </div>
              </div>

              {/* Dimensions Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-50 rounded-xl">
                    <Ruler size={20} className="text-orange-600" />
                  </div>
                  <h3 className="text-orange-600 font-semibold text-lg">Dimensões</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-700">Área interna: {mockProperty.internalArea}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-700">Área externa: {mockProperty.externalArea}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-700">Área do lote: {mockProperty.lotArea}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Key size={18} className="text-orange-500" />
                    <span className="text-gray-700">Local das chaves: {mockProperty.keyLocation}</span>
                  </div>
                </div>
              </div>

              {/* Main Data Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-50 rounded-xl">
                    <BarChart3 size={20} className="text-orange-600" />
                  </div>
                  <h3 className="text-orange-600 font-semibold text-lg">Dados Principais</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-700">{mockProperty.bedrooms} quartos</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-700">{mockProperty.suites} suítes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-700">{mockProperty.bathrooms} banheiros</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-700">{mockProperty.garages} vagas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-700">{mockProperty.privateArea}</span>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-50 rounded-xl">
                    <Home size={20} className="text-orange-600" />
                  </div>
                  <h3 className="text-orange-600 font-semibold text-lg">Descrição do Imóvel</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{mockProperty.description}</p>
                  <div className="space-y-2">
                    {mockProperty.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-2">{mockProperty.fullDescription}</p>
                </div>
              </div>

              {/* Responsible Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-50 rounded-xl">
                    <User size={20} className="text-orange-600" />
                  </div>
                  <h3 className="text-orange-600 font-semibold text-lg">Responsável pelo Imóvel</h3>
                </div>
                <p className="text-gray-600 mb-4">{mockProperty.responsible}</p>
                <button className="w-full bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors">
                  Ver dados do captador
                </button>
              </div>
            </>
          )}

          {activeTab === 'empreendimento' && (
            <>
              {/* External Features Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Características Externas</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle size={18} className="text-green-500" />
                      <span className="text-gray-700">Elevadores</span>
                    </div>
                    <span className="text-gray-900 font-medium">{mockProperty.developmentFeatures.external.elevadores}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <span className="text-orange-600 font-medium">Portão eletrônico</span>
                    <Switch checked={mockProperty.developmentFeatures.external.portaoEletronico} disabled />
                  </div>
                  <div className="flex items-center space-x-3 py-2">
                    <XCircle size={18} className="text-gray-300" />
                    <span className="text-gray-400">Interfone</span>
                  </div>
                  <div className="flex items-center space-x-3 py-2">
                    <XCircle size={18} className="text-gray-300" />
                    <span className="text-gray-400">Andares</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <span className="text-orange-600 font-medium">Água individual</span>
                    <Switch checked={mockProperty.developmentFeatures.external.aguaIndividual} disabled />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <span className="text-orange-600 font-medium">Alarme</span>
                    <Switch checked={mockProperty.developmentFeatures.external.alarme} disabled />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <span className="text-orange-600 font-medium">Gás canalizado</span>
                    <Switch checked={mockProperty.developmentFeatures.external.gasCanalizdo} disabled />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <span className="text-orange-600 font-medium">Portaria 24hrs</span>
                    <Switch checked={mockProperty.developmentFeatures.external.portaria24hrs} disabled />
                  </div>
                </div>
              </div>

              {/* Leisure Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Lazer</h3>
                <div className="space-y-3">
                  {mockProperty.developmentFeatures.leisure.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Construction Status Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-orange-50 rounded-xl">
                    <Home size={20} className="text-orange-600" />
                  </div>
                  <h3 className="text-orange-600 font-semibold text-lg">{mockProperty.developmentFeatures.construction.status}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar size={18} className="text-orange-500" />
                    <span className="text-gray-700">Início da obra: {mockProperty.developmentFeatures.construction.startDate}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar size={18} className="text-orange-500" />
                    <span className="text-gray-700">Entrega da obra: {mockProperty.developmentFeatures.construction.deliveryDate}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BarChart3 size={18} className="text-orange-500" />
                    <span className="text-gray-700">Incorporações: {mockProperty.developmentFeatures.construction.incorporation}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* WhatsApp Button - Updated with Icon */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-[375px] md:max-w-none mx-auto md:px-4">
          <button 
            onClick={() => setShowWhatsAppShare(true)}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3 shadow-lg hover:bg-orange-700 transition-all duration-300 active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
            </svg>
            <span>Enviar via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Share Modal */}
      {showWhatsAppShare && (
        <WhatsAppShare 
          property={{
            name: mockProperty.title,
            address: mockProperty.address,
            images: mockProperty.images
          }}
          onClose={() => setShowWhatsAppShare(false)}
          onShare={handleWhatsAppShare}
        />
      )}
    </div>
  );
}
