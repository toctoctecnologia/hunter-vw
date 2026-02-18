
import { useState } from 'react';
import { X, Edit, Camera, Car, Bed, Bath, Square, MapPin, DollarSign, Calendar, Globe, ToggleLeft, ToggleRight, Building, CheckCircle, XCircle } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  garages: number;
  description: string;
  images: string[];
  lastContact: string;
  status: 'Disponível' | 'Indisponível' | 'Em Visita' | 'Vendido';
  condominiumFee?: string;
  iptu?: string;
  internalArea?: string;
  externalArea?: string;
  lotArea?: string;
  keyLocation?: string;
  suites?: number;
  portals?: {
    zapImoveis: boolean;
    olx: boolean;
    vivaReal: boolean;
  };
  publishedOnSite?: boolean;
  lastPublished?: string;
  lastUpdated?: string;
}

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onEdit?: () => void;
}

export const PropertyDetailModal = ({ property, onClose, onEdit }: PropertyDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<'detalhes' | 'atualizacao'>('detalhes');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return '#4CAF50';
      case 'Em Visita': return '#FFC107';
      case 'Indisponível':
      case 'Vendido': return '#F44336';
      default: return '#666666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Disponível': return CheckCircle;
      case 'Em Visita': return Calendar;
      case 'Indisponível':
      case 'Vendido': return XCircle;
      default: return Building;
    }
  };

  const StatusIcon = getStatusIcon(property.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-full max-h-[600px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#333333]">Imóvel #{property.id}</h2>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button 
                onClick={onEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit size={20} className="text-[hsl(var(--accent))]" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Image Slider */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden property-image">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera size={48} className="text-gray-400" />
                </div>
              )}
            </div>
            {property.images && property.images.length > 1 && (
              <div className="flex justify-center mt-2 space-x-1">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-[hsl(var(--accent))]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('detalhes')}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === 'detalhes'
                  ? 'text-[hsl(var(--accent))] border-b-2 border-[hsl(var(--accent))]'
                  : 'text-gray-500'
              }`}
            >
              Detalhes
            </button>
            <button
              onClick={() => setActiveTab('atualizacao')}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === 'atualizacao'
                  ? 'text-[hsl(var(--accent))] border-b-2 border-[hsl(var(--accent))]'
                  : 'text-gray-500'
              }`}
            >
              Atualização
            </button>
          </div>

          {activeTab === 'detalhes' && (
            <div className="space-y-4">
              {/* Valores & Dimensões */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-[#333333] mb-2">Valores</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Valor do imóvel</span>
                      <p className="text-sm font-semibold text-[hsl(var(--accent))]">{property.price}</p>
                    </div>
                    {property.condominiumFee && (
                      <div>
                        <span className="text-xs text-gray-500">Condomínio</span>
                        <p className="text-sm font-semibold text-[hsl(var(--accent))]">{property.condominiumFee}</p>
                      </div>
                    )}
                    {property.iptu && (
                      <div>
                        <span className="text-xs text-gray-500">IPTU (mensal)</span>
                        <p className="text-sm font-semibold text-[hsl(var(--accent))]">{property.iptu}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#333333] mb-2">Dimensões</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Área interna</span>
                      <p className="text-sm font-semibold text-[#4CAF50]">{property.internalArea || property.area}</p>
                    </div>
                    {property.externalArea && (
                      <div>
                        <span className="text-xs text-gray-500">Área externa</span>
                        <p className="text-sm font-semibold text-[#4CAF50]">{property.externalArea}</p>
                      </div>
                    )}
                    {property.lotArea && (
                      <div>
                        <span className="text-xs text-gray-500">Área do lote</span>
                        <p className="text-sm font-semibold text-[#4CAF50]">{property.lotArea}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dados Principais */}
              <div>
                <h4 className="text-sm font-medium text-[#333333] mb-2">Dados Principais</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Bed size={16} className="text-[#4CAF50]" />
                    <span className="text-sm text-[#333333]">{property.bedrooms} quartos</span>
                  </div>
                  {property.suites && (
                    <div className="flex items-center space-x-2">
                      <Bed size={16} className="text-[#4CAF50]" />
                      <span className="text-sm text-[#333333]">{property.suites} suítes</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Car size={16} className="text-[#4CAF50]" />
                    <span className="text-sm text-[#333333]">{property.garages} vagas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bath size={16} className="text-[#4CAF50]" />
                    <span className="text-sm text-[#333333]">{property.bathrooms} banheiros</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Square size={16} className="text-[#4CAF50]" />
                    <span className="text-sm text-[#333333]">{property.area} de área</span>
                  </div>
                  {property.keyLocation && (
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-[#4CAF50]" />
                      <span className="text-sm text-[#333333]">{property.keyLocation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <h4 className="text-sm font-medium text-[#333333] mb-2">Descrição do Imóvel</h4>
                <p className="text-sm text-gray-600">{property.description}</p>
              </div>
            </div>
          )}

          {activeTab === 'atualizacao' && (
            <div className="space-y-4">
              {/* Situação do Imóvel */}
              <div className="bg-white rounded-lg border border-gray-100 p-3">
                <h4 className="text-sm font-semibold text-[hsl(var(--accent))] mb-2">Situação do Imóvel</h4>
                <div className="flex items-center space-x-2">
                  <StatusIcon size={20} style={{ color: getStatusColor(property.status) }} />
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: getStatusColor(property.status) }}
                  >
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Portais de Anúncio */}
              <div className="bg-white rounded-lg border border-gray-100 p-3">
                <h4 className="text-sm font-semibold text-[hsl(var(--accent))] mb-3">Portais de Anúncio</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building size={20} className="text-[hsl(var(--accent))]" />
                      <span className="text-sm text-[#333333]">Zap Imóveis</span>
                    </div>
                    {property.portals?.zapImoveis ? (
                      <ToggleRight size={20} className="text-[#4CAF50]" />
                    ) : (
                      <ToggleLeft size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building size={20} className="text-[hsl(var(--accent))]" />
                      <span className="text-sm text-[#333333]">OLX</span>
                    </div>
                    {property.portals?.olx ? (
                      <ToggleRight size={20} className="text-[#4CAF50]" />
                    ) : (
                      <ToggleLeft size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building size={20} className="text-[hsl(var(--accent))]" />
                      <span className="text-sm text-[#333333]">VivaReal</span>
                    </div>
                    {property.portals?.vivaReal ? (
                      <ToggleRight size={20} className="text-[#4CAF50]" />
                    ) : (
                      <ToggleLeft size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Publicado no Site */}
              <div className="bg-white rounded-lg border border-gray-100 p-3">
                <h4 className="text-sm font-semibold text-[hsl(var(--accent))] mb-2">Publicado no Site</h4>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Globe size={16} className="text-gray-500" />
                    <span className="text-sm text-[#333333]">Status</span>
                  </div>
                  <span className={`text-sm font-semibold ${property.publishedOnSite ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>
                    {property.publishedOnSite ? 'Sim' : 'Não'}
                  </span>
                </div>
                {property.lastPublished && (
                  <p className="text-xs text-gray-500">
                    Última publicação: {property.lastPublished}
                  </p>
                )}
              </div>

              {/* Data da Última Atualização */}
              <div className="bg-white rounded-lg border border-gray-100 p-3">
                <h4 className="text-sm font-semibold text-[hsl(var(--accent))] mb-2">Última Atualização</h4>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {property.lastUpdated || property.lastContact}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
