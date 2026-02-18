
import React, { useState, useRef } from 'react';
import { debugLog } from '@/utils/debug';
import { ArrowLeft, Database, FileText, MessageCircle, Settings, Save, Upload, File, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface AITrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AITrainingModal = ({ isOpen, onClose }: AITrainingModalProps) => {
  const [leadsTraining, setLeadsTraining] = useState(true);
  const [propertiesTraining, setPropertiesTraining] = useState(true);
  const [whatsappTraining, setWhatsappTraining] = useState(true);
  const [marketDataTraining, setMarketDataTraining] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    debugLog('Salvando configurações de IA...');
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden h-dvh">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Treinamento de IA</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto bg-white flex-1">
          <div className="text-center">
            <div className="w-16 h-16 bg-[hsl(var(--accent))] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <div className="text-white text-lg font-bold">AI</div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Treinamento de IA</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Catálogo de Imóveis</p>
                  <p className="text-sm text-gray-600">Conhecer propriedades disponíveis</p>
                </div>
              </div>
              <Switch checked={propertiesTraining} onCheckedChange={setPropertiesTraining} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Conversas WhatsApp</p>
                  <p className="text-sm text-gray-600">Aprender com interações</p>
                </div>
              </div>
              <Switch checked={whatsappTraining} onCheckedChange={setWhatsappTraining} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Dados de Mercado</p>
                  <p className="text-sm text-gray-600">Informações do mercado imobiliário</p>
                </div>
              </div>
              <Switch checked={marketDataTraining} onCheckedChange={setMarketDataTraining} />
            </div>
          </div>

          {/* Upload de Arquivos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Upload de Arquivos</h3>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-[hsl(var(--accent))] rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-[hsl(var(--accent))] mx-auto mb-2" />
                <p className="text-[hsl(var(--accent))] font-semibold">Fazer Upload de Arquivos</p>
                <p className="text-sm text-gray-600">PDF, DOC, TXT até 10MB</p>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">Arquivos Carregados:</p>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <File className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-900 truncate">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2">Status do Treinamento</h4>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-800">IA treinada e ativa</span>
            </div>
            <p className="text-xs text-blue-700 mt-2">Última atualização: hoje às 14:30</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <Button
            onClick={handleSave}
            className="w-full h-14 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AITrainingModal;
