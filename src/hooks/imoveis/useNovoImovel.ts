import { useState } from 'react';
import type { FormData } from '@/types/formData';

const initialData: FormData = {
  name: '',
  type: '',
  status: '',
  address: '',
  unit: '',
  city: '',
  state: '',
  cep: '',
  price: '',
  condominium: '',
  iptu: '',
  internalArea: '',
  externalArea: '',
  lotArea: '',
  bedrooms: '',
  suites: '',
  bathrooms: '',
  garages: '',
  garageType: '',
  garageLocation: '',
  garageNumber: '',
  garageLocationDetails: '',
  keyLocation: '',
  keyLocationOther: '',
  description: '',
  features: [],
  propertyStage: '',
  deliveryDate: '',
  furnished: '',
  typeFloor: '',
  unitDescription: '',
  condominiumLeisure: '',
  selectedCondominium: '',
  constructionCompany: '',
  constructionCompanyYears: '',
  ownerName: '',
  ownerPhone: '',
  capturer: '',
  paymentMethods: '',
  directWithOwner: '',
  acceptsFinancing: '',
  downPayment: '',
  installments: '',
  reinforcement: '',
  settlementValue: '',
};

export function useNovoImovel() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [condominiumFiles, setCondominiumFiles] = useState<File[]>([]);
  const [condominiumModalOpen, setCondominiumModalOpen] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addUploadedFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addCondominiumFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files);
    setCondominiumFiles(prev => [...prev, ...newFiles]);
  };

  const removeCondominiumFile = (index: number) => {
    setCondominiumFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    uploadedFiles,
    addUploadedFiles,
    removeUploadedFile,
    condominiumFiles,
    addCondominiumFiles,
    removeCondominiumFile,
    condominiumModalOpen,
    setCondominiumModalOpen,
  };
}

export type UseNovoImovelReturn = ReturnType<typeof useNovoImovel>;

