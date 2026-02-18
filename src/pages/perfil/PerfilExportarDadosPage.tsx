import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, Loader2, CheckCircle, Database, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ymdLocal } from '@/lib/datetime';

export default function PerfilExportarDadosPage() {
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState({
    leads: true,
    properties: true,
    agenda: true,
    contacts: true,
    reports: false,
    settings: false
  });
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('excel');
  const { toast } = useToast();

  const dataTypes = [
    {
      key: 'leads' as keyof typeof selectedData,
      name: 'Leads e Vendas',
      description: 'Informações de leads, histórico de contatos e pipeline de vendas',
      icon: Users,
      size: '~2.3 MB'
    },
    {
      key: 'properties' as keyof typeof selectedData,
      name: 'Imóveis',
      description: 'Dados dos imóveis, fotos, características e valores',
      icon: Database,
      size: '~15.7 MB'
    },
    {
      key: 'agenda' as keyof typeof selectedData,
      name: 'Agenda e Eventos',
      description: 'Compromissos, tarefas e histórico de atividades',
      icon: Calendar,
      size: '~0.8 MB'
    },
    {
      key: 'contacts' as keyof typeof selectedData,
      name: 'Contatos',
      description: 'Lista de contatos e informações de comunicação',
      icon: Users,
      size: '~1.2 MB'
    },
    {
      key: 'reports' as keyof typeof selectedData,
      name: 'Relatórios',
      description: 'Relatórios gerados e métricas de desempenho',
      icon: FileText,
      size: '~5.1 MB'
    },
    {
      key: 'settings' as keyof typeof selectedData,
      name: 'Configurações',
      description: 'Preferências pessoais e configurações do sistema',
      icon: Database,
      size: '~0.1 MB'
    }
  ];

  const formats = [
    { id: 'excel', name: 'Excel (.xlsx)', description: 'Melhor para análise de dados' },
    { id: 'csv', name: 'CSV (.csv)', description: 'Compatível com qualquer sistema' },
    { id: 'pdf', name: 'PDF (.pdf)', description: 'Para visualização e arquivo' }
  ];

  const handleToggleData = (key: keyof typeof selectedData) => {
    setSelectedData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExport = async () => {
    setLoading(true);
    
    try {
      // Simular processo de exportação
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const selectedCount = Object.values(selectedData).filter(Boolean).length;
      const totalSize = dataTypes
        .filter(type => selectedData[type.key])
        .reduce((acc, type) => acc + parseFloat(type.size.replace('~', '').replace(' MB', '')), 0);
      
      toast({
        title: "Exportação concluída",
        description: `${selectedCount} categorias exportadas (${totalSize.toFixed(1)} MB). O download iniciará em breve.`,
      });

      // Simular download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '#';
        link.download = `dados-toctoc-${ymdLocal()}.${exportFormat}`;
        link.click();
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = Object.values(selectedData).filter(Boolean).length;
  const totalSize = dataTypes
    .filter(type => selectedData[type.key])
    .reduce((acc, type) => acc + parseFloat(type.size.replace('~', '').replace(' MB', '')), 0);

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
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-500">Baixe uma cópia dos seus dados</p>
            </div>
          </div>
        </div>

        {/* Export Form Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Exportar Dados</h1>
          
          <div className="space-y-6">
            {/* Data Selection */}
              <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Selecionar Dados</h3>
              
              <div className="space-y-3">
                {dataTypes.map((dataType) => {
                  const Icon = dataType.icon;
                  return (
                    <label
                      key={dataType.key}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                        selectedData[dataType.key]
                          ? 'bg-[hsl(var(--accent))]/20 border border-[hsl(var(--accent))]'
                          : 'bg-gray-800 hover:bg-gray-700 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedData[dataType.key]}
                        onChange={() => handleToggleData(dataType.key)}
                        className="sr-only"
                      />
                      <Icon className="w-6 h-6 text-[hsl(var(--accent))]" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-900 dark:text-white font-medium">{dataType.name}</p>
                          <span className="text-xs text-gray-400">{dataType.size}</span>
                        </div>
                        <p className="text-sm text-gray-400">{dataType.description}</p>
                      </div>
                      {selectedData[dataType.key] && (
                        <CheckCircle className="w-5 h-5 text-[hsl(var(--accent))]" />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Format Selection */}
              <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Formato de Exportação</h3>
              
              <div className="space-y-3">
                {formats.map((format) => (
                  <label
                    key={format.id}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                      exportFormat === format.id
                        ? 'bg-[hsl(var(--accent))]/20 border border-[hsl(var(--accent))]'
                        : 'bg-gray-800 hover:bg-gray-700 border border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={exportFormat === format.id}
                      onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                      className="sr-only"
                    />
                    <FileText className="w-5 h-5 text-[hsl(var(--accent))]" />
                    <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium">{format.name}</p>
                      <p className="text-sm text-gray-400">{format.description}</p>
                    </div>
                    {exportFormat === format.id && (
                      <CheckCircle className="w-5 h-5 text-[hsl(var(--accent))]" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Export Summary */}
            {selectedCount > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white font-medium">Resumo da Exportação</p>
                  <span className="text-xs text-[hsl(var(--accent))]">{totalSize.toFixed(1)} MB</span>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• {selectedCount} categorias selecionadas</p>
                  <p>• Formato: {formats.find(f => f.id === exportFormat)?.name}</p>
                  <p>• Tempo estimado: ~2 minutos</p>
                  <p>• Os dados serão compactados em um arquivo ZIP</p>
                </div>
              </div>
            )}

            {/* Privacy Notice */}
            <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-blue-300 font-medium">Aviso de Privacidade</p>
              </div>
              <div className="text-xs text-blue-200 space-y-1">
                <p>• Seus dados são processados de forma segura</p>
                <p>• O arquivo de exportação expira em 24 horas</p>
                <p>• Nenhuma informação é compartilhada com terceiros</p>
                <p>• O download é registrado para fins de auditoria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button 
          onClick={handleExport}
          disabled={loading || selectedCount === 0}
          className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Exportando dados...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              {selectedCount > 0 ? `Exportar ${selectedCount} categorias` : 'Selecione os dados'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}