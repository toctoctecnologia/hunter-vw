import { useState, useRef } from 'react';
import { ArrowLeft, Plus, Globe, ChevronDown, GripVertical, Upload, X, Tag } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface Property {
  id: number;
  name: string;
  address: string;
  value: string;
  area: string;
  rooms: string;
  parking: string;
  bathrooms: string;
  status: string;
  availability: string;
  images: string[];
  unitFeatures: string[];
  portals?: string[];
  publishedOnSite?: boolean;
  lastUpdatedAt?: string;
  condominio?: string;
  iptu?: string;
  description?: string;
  deactivateReason?: string;
  // Novas propriedades baseadas nos prints
  city?: string;
  cep?: string;
  internalArea?: string;
  externalArea?: string;
  lotArea?: string;
  keyLocation?: string;
  bedrooms?: number;
  suites?: number;
  garages?: number;
  privateArea?: string;
  features?: string[];
  fullDescription?: string;
  responsible?: string;
  // Características externas
  externalFeatures?: {
    elevadores?: number;
    portaoEletronico?: boolean;
    interfone?: boolean;
    andares?: boolean;
    aguaIndividual?: boolean;
    alarme?: boolean;
    gasCanalizdo?: boolean;
    gramado?: boolean;
    portaria24hrs?: boolean;
  };
  // Características de lazer
  leisureFeatures?: string[];
  // Status da obra
  constructionStatus?: {
    status?: string;
    startDate?: string;
    deliveryDate?: string;
    incorporation?: string;
  };
  // Categorização de fotos
  facadeImages?: string[];
  leisureImages?: string[];
}

interface PropertyEditModalProps {
  property: Property;
  onClose: () => void;
  onSave: (property: Property) => void;
}

export const PropertyEditModal = ({ property, onClose, onSave }: PropertyEditModalProps) => {
  const [editedProperty, setEditedProperty] = useState<Property>({
    ...property,
    city: property.city || 'Balneário Camboriú – SC',
    cep: property.cep || 'CEP: 88331-010',
    internalArea: property.internalArea || '169,00 m²',
    externalArea: property.externalArea || '0,00 m²',
    lotArea: property.lotArea || '0,00 m²',
    keyLocation: property.keyLocation || 'No local',
    bedrooms: property.bedrooms || 3,
    suites: property.suites || 3,
    garages: property.garages || 3,
    privateArea: property.privateArea || '169 m² de área privativa',
    features: property.features || [
      '3 suítes espaçosas (uma delas é master com banheira e vista mar)',
      '3 vagas de garagem',
      'Vista deslumbrante',
      'Sacada aberta',
      'Churrasqueira à gás'
    ],
    responsible: property.responsible || '(Contato oculto por padrão; ao clicar, exibe nome, telefone e e-mail e registra quem visualizou.)',
    externalFeatures: property.externalFeatures || {
      elevadores: 4,
      portaoEletronico: true,
      interfone: false,
      andares: false,
      aguaIndividual: true,
      alarme: true,
      gasCanalizdo: true,
      gramado: true,
      portaria24hrs: true
    },
    leisureFeatures: property.leisureFeatures || [
      'Piscina com borda infinita',
      'Academia equipada',
      'Salão de festas',
      'Playground externo',
      'Espaço gourmet',
      'Pista de caminhada'
    ],
    constructionStatus: property.constructionStatus || {
      status: 'Obra em início (0%)',
      startDate: 'Julho/2024',
      deliveryDate: 'Dezembro/2028',
      incorporation: '18-31.005'
    },
    facadeImages: property.facadeImages || property.images.slice(0, 3) || [],
    leisureImages: property.leisureImages || property.images.slice(3) || []
  });
  
  const [selectedDeactivateReason, setSelectedDeactivateReason] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const statusOptions = ['Disponível', 'Indisponível'];
  const availablePortals = ['ZapImóveis', 'OLX', 'VivaReal'];
  
  const deactivateReasons = [
    'Vendido por outro corretor ou direto com a construtora (só vale para imóveis de construtoras)',
    'Vendido por outra imobiliária ou direto com o proprietário (só vale para imóveis agenciados)',
    'Desistiu de vender',
    'Desativado por opção da imobiliária (preço fora do mercado, documentação, sem fotos etc)',
    'Outros',
    'Cliente alugou o imóvel',
    'Cliente vai usar ou emprestar o imóvel',
    'Dificuldade ou falta de acesso ao imóvel',
    'Corretor saiu',
    'Dificuldade ou falta de comunicação com o proprietário',
    'Cliente insatisfeito com a imobiliária/corretor',
    'O imóvel está fora do nosso nicho de atuação',
    'O imóvel ficou exclusivo com outra imobiliária',
    'O imóvel ficou com a construtora.',
    'Imóvel duplicado, criado para teste, avanço de funil ou criado errado',
    'Vendido pela Felicitá Imóveis',
    'Proprietário desrespeitoso/arrogante/antiético'
  ];

  // Combinar todas as imagens para exibição única
  const allImages = [
    ...(editedProperty.facadeImages || []).map(img => ({ url: img, category: 'facade' as const })),
    ...(editedProperty.leisureImages || []).map(img => ({ url: img, category: 'leisure' as const }))
  ];

  const handleFieldChange = (field: string, value: string | boolean | string[] | number | object) => {
    setEditedProperty(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedFieldChange = (parent: string, field: string, value: any) => {
    setEditedProperty(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof Property] as object || {}),
        [field]: value
      }
    }));
  };

  const handleStatusChange = (status: string) => {
    setEditedProperty(prev => ({ ...prev, status }));
    if (status === 'Disponível') {
      setSelectedDeactivateReason('');
      setEditedProperty(prev => ({ ...prev, deactivateReason: '' }));
    }
  };

  const handleDeactivateReasonSelect = (reason: string) => {
    setSelectedDeactivateReason(reason);
    setEditedProperty(prev => ({ ...prev, deactivateReason: reason }));
  };

  const handlePortalToggle = (portal: string) => {
    const currentPortals = editedProperty.portals || [];
    const newPortals = currentPortals.includes(portal)
      ? currentPortals.filter(p => p !== portal)
      : [...currentPortals, portal];
    
    handleFieldChange('portals', newPortals);
  };

  const handleValueChange = (field: string, value: string) => {
    const cleanValue = value.replace(/[^0-9.,]/g, '');
    handleFieldChange(field, cleanValue);
  };

  // Upload de imagens e vídeos
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string;
        // Por padrão, adiciona à fachada
        setEditedProperty(prev => ({
          ...prev,
          facadeImages: [...(prev.facadeImages || []), fileUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and Drop para reordenar
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newAllImages = [...allImages];
    const draggedImage = newAllImages[draggedIndex];
    newAllImages.splice(draggedIndex, 1);
    newAllImages.splice(dropIndex, 0, draggedImage);

    // Reorganizar as imagens por categoria
    const newFacadeImages: string[] = [];
    const newLeisureImages: string[] = [];

    newAllImages.forEach(img => {
      if (img.category === 'facade') {
        newFacadeImages.push(img.url);
      } else {
        newLeisureImages.push(img.url);
      }
    });

    setEditedProperty(prev => ({
      ...prev,
      facadeImages: newFacadeImages,
      leisureImages: newLeisureImages
    }));

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const removeImage = (index: number) => {
    const imageToRemove = allImages[index];
    
    if (imageToRemove.category === 'facade') {
      const facadeIndex = (editedProperty.facadeImages || []).indexOf(imageToRemove.url);
      if (facadeIndex > -1) {
        const newFacadeImages = [...(editedProperty.facadeImages || [])];
        newFacadeImages.splice(facadeIndex, 1);
        setEditedProperty(prev => ({ ...prev, facadeImages: newFacadeImages }));
      }
    } else {
      const leisureIndex = (editedProperty.leisureImages || []).indexOf(imageToRemove.url);
      if (leisureIndex > -1) {
        const newLeisureImages = [...(editedProperty.leisureImages || [])];
        newLeisureImages.splice(leisureIndex, 1);
        setEditedProperty(prev => ({ ...prev, leisureImages: newLeisureImages }));
      }
    }
  };

  const handleImageLongPress = (index: number) => {
    setSelectedImageIndex(index);
    setShowCategorySelector(true);
  };

  const changeCategoryForImage = (newCategory: 'facade' | 'leisure') => {
    if (selectedImageIndex === null) return;
    
    const selectedImage = allImages[selectedImageIndex];
    const imageUrl = selectedImage.url;
    
    // Remove da categoria atual
    if (selectedImage.category === 'facade') {
      const newFacadeImages = (editedProperty.facadeImages || []).filter(img => img !== imageUrl);
      setEditedProperty(prev => ({ ...prev, facadeImages: newFacadeImages }));
    } else {
      const newLeisureImages = (editedProperty.leisureImages || []).filter(img => img !== imageUrl);
      setEditedProperty(prev => ({ ...prev, leisureImages: newLeisureImages }));
    }
    
    // Adiciona à nova categoria
    if (newCategory === 'facade') {
      setEditedProperty(prev => ({
        ...prev,
        facadeImages: [...(prev.facadeImages || []), imageUrl]
      }));
    } else {
      setEditedProperty(prev => ({
        ...prev,
        leisureImages: [...(prev.leisureImages || []), imageUrl]
      }));
    }
    
    setShowCategorySelector(false);
    setSelectedImageIndex(null);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(editedProperty.features || [])];
    newFeatures[index] = value;
    handleFieldChange('features', newFeatures);
  };

  const addFeature = () => {
    const newFeatures = [...(editedProperty.features || []), ''];
    handleFieldChange('features', newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = editedProperty.features?.filter((_, i) => i !== index) || [];
    handleFieldChange('features', newFeatures);
  };

  const handleLeisureFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(editedProperty.leisureFeatures || [])];
    newFeatures[index] = value;
    handleFieldChange('leisureFeatures', newFeatures);
  };

  const addLeisureFeature = () => {
    const newFeatures = [...(editedProperty.leisureFeatures || []), ''];
    handleFieldChange('leisureFeatures', newFeatures);
  };

  const removeLeisureFeature = (index: number) => {
    const newFeatures = editedProperty.leisureFeatures?.filter((_, i) => i !== index) || [];
    handleFieldChange('leisureFeatures', newFeatures);
  };

  const handleSave = () => {
    const updatedProperty = {
      ...editedProperty,
      images: [...(editedProperty.facadeImages || []), ...(editedProperty.leisureImages || [])],
      lastUpdatedAt: new Date().toISOString()
    };
    onSave(updatedProperty);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col w-full max-w-[390px] md:max-w-none mx-auto">
      {/* Safe Area Top */}
      <div className="h-11 bg-white"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <h1 className="text-lg font-semibold text-gray-900">
          Editar Imóvel
        </h1>
        
        <div className="w-10" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 space-y-4">
          
          {/* Galeria de Fotos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Fotos</h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[hsl(var(--accent))] hover:bg-orange-700 text-white text-sm font-medium rounded-full transition-colors shadow-sm"
              >
                <Upload className="w-4 h-4" />
                Adicionar
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {allImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative group cursor-move transition-all duration-200 ${
                    dragOverIndex === index ? 'scale-105 z-10' : ''
                  } ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onTouchStart={() => handleImageLongPress(index)}
                >
                  <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full p-1">
                    <GripVertical className="w-3 h-3 text-white" />
                  </div>
                  
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 rounded-full p-1"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  
                  {image.url.includes('video') || image.url.includes('.mp4') || image.url.includes('.mov') ? (
                    <video 
                      src={image.url} 
                      className="w-full h-20 object-cover rounded-xl border border-gray-200"
                      muted
                    />
                  ) : (
                    <img 
                      src={image.url} 
                      alt={`${image.category === 'facade' ? 'Fachada' : 'Lazer'} ${index + 1}`} 
                      className="w-full h-20 object-cover rounded-xl border border-gray-200"
                    />
                  )}
                  
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {index + 1}
                  </div>
                  
                  {dragOverIndex === index && (
                    <div className="absolute inset-0 bg-[hsl(var(--accent))] bg-opacity-20 rounded-xl border-2 border-[hsl(var(--accent))] border-dashed"></div>
                  )}
                </div>
              ))}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Modal de Seleção de Categoria */}
          {showCategorySelector && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorizar Foto</h3>
                <p className="text-sm text-gray-600 mb-6">Selecione a categoria para esta foto:</p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => changeCategoryForImage('facade')}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-[hsl(var(--accent))] bg-orange-50 text-[hsl(var(--accent))] font-medium hover:bg-orange-100 transition-colors"
                  >
                    <Tag className="w-5 h-5" />
                    Fotos da Fachada
                  </button>
                  
                  <button
                    onClick={() => changeCategoryForImage('leisure')}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-blue-500 bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
                  >
                    <Tag className="w-5 h-5" />
                    Fotos do Lazer
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    setShowCategorySelector(false);
                    setSelectedImageIndex(null);
                  }}
                  className="w-full mt-4 p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="relative">
              <select
                value={editedProperty.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] appearance-none pr-12 shadow-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {editedProperty.status === 'Indisponível' && (
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Selecione o motivo</h4>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {deactivateReasons.map((reason, index) => (
                    <button
                      key={index}
                      onClick={() => handleDeactivateReasonSelect(reason)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 shadow-sm ${
                        selectedDeactivateReason === reason
                          ? 'border-[hsl(var(--accent))] bg-orange-50 text-orange-900 shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm leading-relaxed">{reason}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Localização */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Imóvel</label>
                <input
                  type="text"
                  value={editedProperty.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <input
                  type="text"
                  value={editedProperty.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    value={editedProperty.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                  <input
                    type="text"
                    value={editedProperty.cep}
                    onChange={(e) => handleFieldChange('cep', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Valores</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor de Venda
              </label>
              <input
                type="text"
                value={editedProperty.value}
                onChange={(e) => handleValueChange('value', e.target.value)}
                className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                placeholder="R$ 0,00"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condomínio
                </label>
                <input
                  type="text"
                  value={editedProperty.condominio || ''}
                  onChange={(e) => handleValueChange('condominio', e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IPTU
                </label>
                <input
                  type="text"
                  value={editedProperty.iptu || ''}
                  onChange={(e) => handleValueChange('iptu', e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Dimensões */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensões</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Área Interna</label>
                  <input
                    type="text"
                    value={editedProperty.internalArea}
                    onChange={(e) => handleFieldChange('internalArea', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Área Externa</label>
                  <input
                    type="text"
                    value={editedProperty.externalArea}
                    onChange={(e) => handleFieldChange('externalArea', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Área do Lote</label>
                  <input
                    type="text"
                    value={editedProperty.lotArea}
                    onChange={(e) => handleFieldChange('lotArea', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Local das Chaves</label>
                  <input
                    type="text"
                    value={editedProperty.keyLocation}
                    onChange={(e) => handleFieldChange('keyLocation', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dados Principais */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Principais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quartos</label>
                <input
                  type="number"
                  value={editedProperty.bedrooms}
                  onChange={(e) => handleFieldChange('bedrooms', parseInt(e.target.value))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Suítes</label>
                <input
                  type="number"
                  value={editedProperty.suites}
                  onChange={(e) => handleFieldChange('suites', parseInt(e.target.value))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banheiros</label>
                <input
                  type="text"
                  value={editedProperty.bathrooms}
                  onChange={(e) => handleFieldChange('bathrooms', e.target.value)}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vagas</label>
                <input
                  type="number"
                  value={editedProperty.garages}
                  onChange={(e) => handleFieldChange('garages', parseInt(e.target.value))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Área Privativa</label>
              <input
                type="text"
                value={editedProperty.privateArea}
                onChange={(e) => handleFieldChange('privateArea', e.target.value)}
                className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição do Imóvel</h3>
            <Textarea
              value={editedProperty.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Digite uma descrição detalhada do imóvel..."
              className="w-full min-h-[120px] p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] resize-none mb-4 shadow-sm"
              rows={5}
            />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-medium text-gray-900">Características</h4>
                <button
                  onClick={addFeature}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[hsl(var(--accent))] hover:text-orange-700 text-sm font-medium bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>
              
              {editedProperty.features?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Digite uma característica..."
                    className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Características Externas */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Características Externas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Elevadores</label>
                <input
                  type="number"
                  value={editedProperty.externalFeatures?.elevadores || 0}
                  onChange={(e) => handleNestedFieldChange('externalFeatures', 'elevadores', parseInt(e.target.value))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  editedProperty.externalFeatures?.portaoEletronico 
                    ? 'bg-orange-50 border-[hsl(var(--accent))]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-medium ${
                    editedProperty.externalFeatures?.portaoEletronico 
                      ? 'text-[hsl(var(--accent))]' 
                      : 'text-gray-700'
                  }`}>Portão eletrônico</span>
                  <Switch
                    checked={editedProperty.externalFeatures?.portaoEletronico || false}
                    onCheckedChange={(checked) => handleNestedFieldChange('externalFeatures', 'portaoEletronico', checked)}
                  />
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  editedProperty.externalFeatures?.interfone 
                    ? 'bg-orange-50 border-[hsl(var(--accent))]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-medium ${
                    editedProperty.externalFeatures?.interfone 
                      ? 'text-[hsl(var(--accent))]' 
                      : 'text-gray-700'
                  }`}>Interfone</span>
                  <Switch
                    checked={editedProperty.externalFeatures?.interfone || false}
                    onCheckedChange={(checked) => handleNestedFieldChange('externalFeatures', 'interfone', checked)}
                  />
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  editedProperty.externalFeatures?.aguaIndividual 
                    ? 'bg-orange-50 border-[hsl(var(--accent))]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-medium ${
                    editedProperty.externalFeatures?.aguaIndividual 
                      ? 'text-[hsl(var(--accent))]' 
                      : 'text-gray-700'
                  }`}>Água individual</span>
                  <Switch
                    checked={editedProperty.externalFeatures?.aguaIndividual || false}
                    onCheckedChange={(checked) => handleNestedFieldChange('externalFeatures', 'aguaIndividual', checked)}
                  />
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  editedProperty.externalFeatures?.alarme 
                    ? 'bg-orange-50 border-[hsl(var(--accent))]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-medium ${
                    editedProperty.externalFeatures?.alarme 
                      ? 'text-[hsl(var(--accent))]' 
                      : 'text-gray-700'
                  }`}>Alarme</span>
                  <Switch
                    checked={editedProperty.externalFeatures?.alarme || false}
                    onCheckedChange={(checked) => handleNestedFieldChange('externalFeatures', 'alarme', checked)}
                  />
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  editedProperty.externalFeatures?.gasCanalizdo 
                    ? 'bg-orange-50 border-[hsl(var(--accent))]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-medium ${
                    editedProperty.externalFeatures?.gasCanalizdo 
                      ? 'text-[hsl(var(--accent))]' 
                      : 'text-gray-700'
                  }`}>Gás canalizado</span>
                  <Switch
                    checked={editedProperty.externalFeatures?.gasCanalizdo || false}
                    onCheckedChange={(checked) => handleNestedFieldChange('externalFeatures', 'gasCanalizdo', checked)}
                  />
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  editedProperty.externalFeatures?.portaria24hrs 
                    ? 'bg-orange-50 border-[hsl(var(--accent))]' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-medium ${
                    editedProperty.externalFeatures?.portaria24hrs 
                      ? 'text-[hsl(var(--accent))]' 
                      : 'text-gray-700'
                  }`}>Portaria 24hrs</span>
                  <Switch
                    checked={editedProperty.externalFeatures?.portaria24hrs || false}
                    onCheckedChange={(checked) => handleNestedFieldChange('externalFeatures', 'portaria24hrs', checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lazer */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lazer</h3>
              <button
                onClick={addLeisureFeature}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[hsl(var(--accent))] hover:bg-orange-700 text-white text-sm font-medium rounded-full transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
            
            <div className="space-y-3">
              {editedProperty.leisureFeatures?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleLeisureFeatureChange(index, e.target.value)}
                    placeholder="Digite uma opção de lazer..."
                    className="flex-1 p-4 bg-white border border-gray-300 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm transition-all"
                  />
                  <button
                    onClick={() => removeLeisureFeature(index)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium rounded-2xl transition-colors border border-red-200"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Status da Obra */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Obra</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status da Obra</label>
                <input
                  type="text"
                  value={editedProperty.constructionStatus?.status || ''}
                  onChange={(e) => handleNestedFieldChange('constructionStatus', 'status', e.target.value)}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Início da Obra</label>
                  <input
                    type="text"
                    value={editedProperty.constructionStatus?.startDate || ''}
                    onChange={(e) => handleNestedFieldChange('constructionStatus', 'startDate', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entrega da Obra</label>
                  <input
                    type="text"
                    value={editedProperty.constructionStatus?.deliveryDate || ''}
                    onChange={(e) => handleNestedFieldChange('constructionStatus', 'deliveryDate', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Incorporações</label>
                <input
                  type="text"
                  value={editedProperty.constructionStatus?.incorporation || ''}
                  onChange={(e) => handleNestedFieldChange('constructionStatus', 'incorporation', e.target.value)}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Responsável */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsável pelo Imóvel</h3>
            <Textarea
              value={editedProperty.responsible || ''}
              onChange={(e) => handleFieldChange('responsible', e.target.value)}
              placeholder="Informações do responsável..."
              className="w-full min-h-[80px] p-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] resize-none shadow-sm"
              rows={3}
            />
          </div>

          {/* Portais */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portais</h3>
            <div className="space-y-3">
              {availablePortals.map((portal) => (
                <div key={portal} className={`flex items-center justify-between py-4 px-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  (editedProperty.portals || []).includes(portal)
                    ? 'bg-orange-50 border-[hsl(var(--accent))]'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Globe className={`w-5 h-5 ${
                      (editedProperty.portals || []).includes(portal) ? 'text-[hsl(var(--accent))]' : 'text-gray-500'
                    }`} />
                    <span className={`font-medium ${
                      (editedProperty.portals || []).includes(portal) ? 'text-[hsl(var(--accent))]' : 'text-gray-900'
                    }`}>{portal}</span>
                  </div>
                  <Switch 
                    checked={(editedProperty.portals || []).includes(portal)}
                    onCheckedChange={() => handlePortalToggle(portal)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Publicação no Site */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className={`flex items-center justify-between py-4 px-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
              editedProperty.publishedOnSite
                ? 'bg-orange-50 border-[hsl(var(--accent))]'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <Globe className={`w-5 h-5 ${
                  editedProperty.publishedOnSite ? 'text-[hsl(var(--accent))]' : 'text-gray-500'
                }`} />
                <div>
                  <span className={`font-medium ${
                    editedProperty.publishedOnSite ? 'text-[hsl(var(--accent))]' : 'text-gray-900'
                  }`}>Publicado no Site</span>
                  <p className="text-sm text-gray-500">Disponível para visualização</p>
                </div>
              </div>
              <Switch 
                checked={editedProperty.publishedOnSite || false}
                onCheckedChange={(checked) => handleFieldChange('publishedOnSite', checked)}
              />
            </div>
          </div>

          {/* Safe Area Bottom Spacer */}
          <div className="h-24"></div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <button
          onClick={handleSave}
          className="w-full bg-[hsl(var(--accent))] hover:bg-orange-700 text-white py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 active:scale-[0.98] shadow-sm"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};
