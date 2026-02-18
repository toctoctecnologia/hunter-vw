
import React, { useState, useRef } from 'react';
import { ArrowLeft, Download, Upload, FileText, Users, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'export' | 'import';
}

const DataManagementModal = ({ isOpen, onClose, type }: DataManagementModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsProcessing(true);
    // Simular processo de exportação
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Criar e baixar arquivo simulado
      const data = "Nome,Email,Telefone,Status\nJoão Silva,joao@email.com,(11) 99999-9999,Ativo\nMaria Santos,maria@email.com,(11) 88888-8888,Lead";
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio_completo_toctoc.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      
      setTimeout(() => {
        setIsComplete(false);
        onClose();
      }, 2000);
    }, 3000);
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    // Simular processo de importação
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      setTimeout(() => {
        setIsComplete(false);
        setSelectedFile(null);
        onClose();
      }, 2000);
    }, 3000);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const isExport = type === 'export';
  const title = isExport ? 'Exportar Dados' : 'Importar Contatos';
  const subtitle = isExport ? 'Baixar relatório completo' : 'Do CRM ou planilha';
  const icon = isExport ? Download : Upload;
  const IconComponent = icon;

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
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto bg-white flex-1">
          <div className="text-center">
            <div className="w-20 h-20 bg-[hsl(var(--accent))] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-500">{subtitle}</p>
          </div>

          {isComplete ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isExport ? 'Download Concluído!' : 'Importação Concluída!'}
                </h3>
                <p className="text-gray-600">
                  {isExport 
                    ? 'Seu relatório foi baixado com sucesso' 
                    : 'Contatos importados com sucesso'
                  }
                </p>
              </div>
            </div>
          ) : isProcessing ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[hsl(var(--accent))] rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isExport ? 'Gerando Relatório...' : 'Processando Arquivo...'}
                </h3>
                <p className="text-gray-600">Aguarde um momento</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {isExport ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">O que será incluído:</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full"></div>
                        <span className="text-sm text-gray-700">Todos os leads e contatos</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full"></div>
                        <span className="text-sm text-gray-700">Histórico de vendas</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full"></div>
                        <span className="text-sm text-gray-700">Relatórios de desempenho</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full"></div>
                        <span className="text-sm text-gray-700">Dados dos imóveis</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Informação</p>
                        <p className="text-xs text-blue-700 mt-1">
                          O relatório será baixado em formato CSV compatível com Excel
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-6 border-2 border-dashed border-[hsl(var(--accent))] rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-[hsl(var(--accent))] mx-auto mb-3" />
                      <p className="text-[hsl(var(--accent))] font-semibold mb-1">Selecionar Arquivo</p>
                      <p className="text-sm text-gray-600">CSV, XLS, XLSX até 5MB</p>
                    </div>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {selectedFile && (
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-600">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-900">Formato Esperado</p>
                        <p className="text-xs text-yellow-800 mt-1">
                          Nome, Email, Telefone, Status (uma coluna por campo)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isComplete && !isProcessing && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <Button
              onClick={isExport ? handleExport : handleImport}
              disabled={(type === 'import' && !selectedFile)}
              className="w-full h-14 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconComponent className="w-5 h-5 mr-2" />
              {isExport ? 'Baixar Relatório' : 'Importar Contatos'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagementModal;
