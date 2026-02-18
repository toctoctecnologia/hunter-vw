
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { useNovoImovel } from '@/hooks/imoveis';
import { debugLog } from '@/utils/debug';
import MobilePage from '@/components/shell/MobilePage';
import { ImageUploadSection } from '@/components/imoveis/add-imovel/ImageUploadSection';
import { PropertyDetailsForm } from '@/components/imoveis/add-imovel/PropertyDetailsForm';
import { CondominiumSearchModal } from '@/components/imoveis/add-imovel/CondominiumSearchModal';

const AddImovelPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    handleInputChange,
    uploadedFiles,
    addUploadedFiles,
    removeUploadedFile,
    condominiumFiles,
    addCondominiumFiles,
    removeCondominiumFile,
    condominiumModalOpen,
    setCondominiumModalOpen,
    setFormData,
  } = useNovoImovel();
  const [condominiumSearch, setCondominiumSearch] = useState('');
  const [searchedCondominiums] = useState([
    { 
      id: 1, 
      name: 'Residencial Sunset', 
      address: 'Av. Principal, 123',
      constructionCompany: 'Construtora ABC',
      companyYears: '15 anos no mercado',
      leisure: 'Piscina, Academia, Salão de festas, Quadra poliesportiva, Playground',
      totalUnits: 120,
      deliveryYear: 2020
    },
    { 
      id: 2, 
      name: 'Condomínio Vista Verde', 
      address: 'Rua das Flores, 456',
      constructionCompany: 'Construtora XYZ',
      companyYears: '25 anos no mercado',
      leisure: 'Piscina adulto e infantil, Academia completa, Espaço gourmet, Playground, Quadra de tênis',
      totalUnits: 80,
      deliveryYear: 2019
    }
  ]);
  const [filteredCondominiums, setFilteredCondominiums] = useState(searchedCondominiums);
  const isMobile = useIsMobile();

  const handleBack = () => {
      navigate('/imoveis');
    };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addUploadedFiles(event.target.files);
    }
  };

  const handleCondominiumFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addCondominiumFiles(event.target.files);
    }
  };

  const handleCondominiumSearch = (searchTerm: string) => {
    setCondominiumSearch(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredCondominiums(searchedCondominiums);
    } else {
      const filtered = searchedCondominiums.filter(condo =>
        condo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        condo.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCondominiums(filtered);
    }
  };

  const handleCondominiumSelect = (condominiumId: string) => {
    const selectedCond = searchedCondominiums.find(c => c.id.toString() === condominiumId);
    if (selectedCond) {
      setFormData(prev => ({ 
        ...prev, 
        selectedCondominium: selectedCond.name,
        condominiumLeisure: selectedCond.leisure,
        constructionCompany: selectedCond.constructionCompany,
        constructionCompanyYears: selectedCond.companyYears
      }));
      setCondominiumModalOpen(false);
    }
  };

  const generatePropertyCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TOC${timestamp}${random}`;
  };

  const handleSubmit = () => {
    const propertyCode = generatePropertyCode();
    const propertyData = {
      ...formData,
      code: propertyCode,
      createdAt: new Date().toISOString(),
    };
    
    debugLog('Saving property with code:', propertyCode);
    debugLog('Property data:', propertyData);
    debugLog('Files:', uploadedFiles);
    debugLog('Condominium files:', condominiumFiles);
    
    // Here you would typically save to backend
    alert(`Imóvel cadastrado com sucesso!\nCódigo: ${propertyCode}`);
    navigate('/imoveis');
  };

  const content = (
    <div className="flex flex-col overflow-y-auto h-full">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
            <h1 className="text-xl font-bold text-black">Adicionar Imóvel</h1>
          </div>

          <ImageUploadSection
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeUploadedFile}
          />

          <PropertyDetailsForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            openCondominiumModal={() => setCondominiumModalOpen(true)}
          />

          <CondominiumSearchModal
            open={condominiumModalOpen}
            onOpenChange={setCondominiumModalOpen}
            condominiumSearch={condominiumSearch}
            onSearchChange={handleCondominiumSearch}
            filteredCondominiums={filteredCondominiums}
            onSelectCondominium={handleCondominiumSelect}
            condominiumFiles={condominiumFiles}
            onCondominiumFileUpload={handleCondominiumFileUpload}
            onRemoveCondominiumFile={removeCondominiumFile}
          />
        </div>
      </div>
    </div>
  );

  return isMobile ? (
    <MobilePage className="bg-white">{content}</MobilePage>
  ) : (
    <div className="flex-1 p-6 overflow-auto">
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-5xl space-y-6">
          <ImageUploadSection
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeUploadedFile}
          />
          <PropertyDetailsForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            openCondominiumModal={() => setCondominiumModalOpen(true)}
          />
        </div>
      </div>
      <CondominiumSearchModal
        open={condominiumModalOpen}
        onOpenChange={setCondominiumModalOpen}
        condominiumSearch={condominiumSearch}
        onSearchChange={handleCondominiumSearch}
        filteredCondominiums={filteredCondominiums}
        onSelectCondominium={handleCondominiumSelect}
        condominiumFiles={condominiumFiles}
        onCondominiumFileUpload={handleCondominiumFileUpload}
        onRemoveCondominiumFile={removeCondominiumFile}
      />
    </div>
  );
};

export default AddImovelPage;
