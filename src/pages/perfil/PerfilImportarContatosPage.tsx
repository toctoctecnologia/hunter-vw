import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, AlertCircle, Users, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function PerfilImportarContatosPage() {
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<{
    imported: number;
    skipped: number;
    errors: number;
  } | null>(null);
  const { toast } = useToast();

  const supportedFormats = [
    {
      name: 'Excel (.xlsx)',
      description: 'Arquivo Excel com colunas Nome, Email, Telefone',
      maxSize: '10 MB'
    },
    {
      name: 'CSV (.csv)',
      description: 'Arquivo CSV separado por vírgulas',
      maxSize: '10 MB'
    },
    {
      name: 'Google Contacts',
      description: 'Exportação do Google Contacts',
      maxSize: '10 MB'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/csv'
      ];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Formato não suportado",
          description: "Por favor, selecione um arquivo Excel (.xlsx) ou CSV (.csv).",
          variant: "destructive"
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10 MB.",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      setUploadStatus('idle');
      setImportResults(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setLoading(true);
    
    try {
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus('processing');
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const results = {
        imported: Math.floor(Math.random() * 150) + 50,
        skipped: Math.floor(Math.random() * 20),
        errors: Math.floor(Math.random() * 5)
      };
      
      setImportResults(results);
      setUploadStatus('success');
      
      toast({
        title: "Importação concluída",
        description: `${results.imported} contatos importados com sucesso.`,
      });
      
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Erro na importação",
        description: "Não foi possível importar os contatos. Verifique o formato do arquivo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Simular download do modelo
    toast({
      title: "Download iniciado",
      description: "O modelo de importação será baixado em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/perfil" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-500">Importe contatos do CRM ou planilha</p>
            </div>
          </div>
        </div>

        {/* Import Form Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Importar Contatos</h1>
          
          <div className="space-y-6">
            {/* Supported Formats */}
              <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Formatos Suportados</h3>
              
              <div className="space-y-3">
                {supportedFormats.map((format, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                    <FileText className="w-5 h-5 text-[hsl(var(--accent))]" />
                    <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium">{format.name}</p>
                      <p className="text-sm text-gray-400">{format.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{format.maxSize}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Download */}
              <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modelo de Importação</h3>
              
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-[hsl(var(--accent))]" />
                  <div>
                      <p className="text-gray-900 dark:text-white font-medium">Baixar Modelo Excel</p>
                    <p className="text-sm text-gray-400">Planilha com formato correto para importação</p>
                  </div>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="px-4 py-2 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Baixar
                </button>
              </div>
            </div>

            {/* File Upload */}
              <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Selecionar Arquivo</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    selectedFile
                      ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10'
                      : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
                  }`}>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-900 dark:text-white font-medium mb-2">
                      {selectedFile ? selectedFile.name : 'Clique ou arraste um arquivo aqui'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedFile 
                        ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                        : 'Excel (.xlsx) ou CSV (.csv) até 10 MB'
                      }
                    </p>
                  </div>
                </div>

                {selectedFile && uploadStatus === 'idle' && (
                  <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-700 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-300 font-medium">Arquivo selecionado</p>
                      <p className="text-sm text-green-400">Pronto para importação</p>
                    </div>
                  </div>
                )}

                {uploadStatus === 'uploading' && (
                  <div className="flex items-center gap-3 p-4 bg-blue-900/20 border border-blue-700 rounded-xl">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    <div>
                      <p className="text-blue-300 font-medium">Enviando arquivo...</p>
                      <p className="text-sm text-blue-400">Aguarde o upload completar</p>
                    </div>
                  </div>
                )}

                {uploadStatus === 'processing' && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-900/20 border border-yellow-700 rounded-xl">
                    <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                    <div>
                      <p className="text-yellow-300 font-medium">Processando contatos...</p>
                      <p className="text-sm text-yellow-400">Analisando e importando dados</p>
                    </div>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-700 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-red-300 font-medium">Erro na importação</p>
                      <p className="text-sm text-red-400">Verifique o formato do arquivo e tente novamente</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Import Results */}
              {uploadStatus === 'success' && importResults && (
                <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resultado da Importação</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-900/20 rounded-xl">
                    <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-300">{importResults.imported}</p>
                    <p className="text-sm text-green-400">Importados</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-900/20 rounded-xl">
                    <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-300">{importResults.skipped}</p>
                    <p className="text-sm text-yellow-400">Ignorados</p>
                  </div>
                  <div className="text-center p-4 bg-red-900/20 rounded-xl">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-300">{importResults.errors}</p>
                    <p className="text-sm text-red-400">Erros</p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-[hsl(var(--accent))]" />
                <p className="text-sm text-white font-medium">Instruções de Importação</p>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>• O arquivo deve conter as colunas: Nome, Email, Telefone</p>
                <p>• Contatos duplicados serão automaticamente ignorados</p>
                <p>• Emails inválidos não serão importados</p>
                <p>• Máximo de 1000 contatos por importação</p>
                <p>• Use o modelo fornecido para melhor compatibilidade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Import Button */}
        <button 
          onClick={handleImport}
          disabled={loading || !selectedFile || uploadStatus === 'success'}
          className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {uploadStatus === 'uploading' ? 'Enviando...' : 'Processando...'}
            </>
          ) : uploadStatus === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Importação Concluída
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {selectedFile ? 'Importar Contatos' : 'Selecione um arquivo'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}