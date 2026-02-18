import { useState } from 'react';
import { LocacaoModuleLayout } from '@/layouts/LocacaoModuleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  RefreshCw,
  AlertTriangle,
  FileText,
  Calculator,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContratoReajuste {
  id: string;
  codigo: string;
  imovel: {
    tipo: string;
    codigo: string;
    endereco: string;
  };
  valorAtual: string;
  valorAtualizado: string;
  dataInicio: string;
  ultimoReajuste: string;
  status: 'Pendente' | 'Aplicado' | 'Simulado';
}

const contratosReajuste: ContratoReajuste[] = [
  {
    id: '1',
    codigo: 'casa123',
    imovel: {
      tipo: 'Apartamento',
      codigo: '1234664',
      endereco: 'Rua Gabriele D\'Annunzio, 330, 432423, Campo Belo, São Paulo - SP'
    },
    valorAtual: 'R$ 800,00',
    valorAtualizado: 'R$ 880,00',
    dataInicio: '20/10/2022',
    ultimoReajuste: '',
    status: 'Pendente'
  }
];

const indicesReajuste = [
  { value: 'igpm', label: 'IGP-M' },
  { value: 'cubrs16a', label: 'CUB/RS 16-A' },
  { value: 'cubrs16n', label: 'CUB/RS R 16-N' },
  { value: 'igpdi', label: 'IGP-DI' },
  { value: 'inccm', label: 'INCC-M' },
  { value: 'inpc', label: 'INPC' },
  { value: 'ipc', label: 'IPC' },
  { value: 'ipca', label: 'IPCA' },
  { value: 'ivar', label: 'IVAR' },
  { value: 'personalizado', label: 'Personalizado' },
];

export const ReajustesPage = () => {
  const [competencia, setCompetencia] = useState('10/2023');
  const [indice, setIndice] = useState('igpm');
  const [porcentagem, setPorcentagem] = useState('');
  const [selectedContratos, setSelectedContratos] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSimular = () => {
    if (porcentagem) {
      setShowResults(true);
    }
  };

  const handleReajustar = () => {
    console.log('Reajustando contratos:', selectedContratos);
  };

  const toggleContrato = (id: string) => {
    setSelectedContratos(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedContratos.length === contratosReajuste.length) {
      setSelectedContratos([]);
    } else {
      setSelectedContratos(contratosReajuste.map(c => c.id));
    }
  };

  const getStatusBadge = (status: ContratoReajuste['status']) => {
    const styles = {
      'Pendente': 'bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]',
      'Aplicado': 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
      'Simulado': 'bg-[hsl(var(--accent)/0.16)] text-[hsl(var(--accent))]'
    };
    return <Badge className={`${styles[status]} rounded-lg px-2.5 py-0.5 text-xs font-medium`}>{status}</Badge>;
  };

  return (
    <LocacaoModuleLayout
      title="Reajustes de Aluguel"
      subtitle="Simule e aplique reajustes nos contratos de locação"
    >
      {/* Reajuste Form Card */}
      <Card className="mb-6 rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-[var(--ui-text)]">
            <FileText className="w-4 h-4" />
            Reajuste de valores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Alert */}
          <div className="bg-[hsl(var(--warning)/0.12)] border border-[hsl(var(--warning)/0.4)] rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[hsl(var(--warning))] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[hsl(var(--textSecondary))]">
              Determine a porcentagem para realizar a simulação do reajuste de valores.
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-[var(--ui-text)] mb-2 block">
                Competência<span className="text-[hsl(var(--danger))]">*</span>
              </label>
              <div className="relative">
                <Input 
                  value={competencia}
                  onChange={(e) => setCompetencia(e.target.value)}
                  placeholder="MM/AAAA"
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setCompetencia('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--ui-text)] mb-2 block">
                Índice de reajuste<span className="text-[hsl(var(--danger))]">*</span>
              </label>
              <Select value={indice} onValueChange={setIndice}>
                <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {indicesReajuste.map((idx) => (
                    <SelectItem key={idx.value} value={idx.value}>
                      {idx.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--ui-text)] mb-2 block">
                Porcentagem<span className="text-[hsl(var(--danger))]">*</span>
              </label>
              <Input 
                value={porcentagem}
                onChange={(e) => setPorcentagem(e.target.value)}
                placeholder="0"
                type="number"
                className="h-11 rounded-xl border-[var(--ui-stroke)]"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-11 rounded-xl border-[var(--ui-stroke)]" onClick={handleSimular}>
                <Calculator className="w-4 h-4 mr-2" />
                Simular
              </Button>
              <Button 
                className="flex-1 h-11 rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]" 
                onClick={handleReajustar}
                disabled={selectedContratos.length === 0}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reajustar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
        <CardHeader className="pb-3 border-b border-[var(--ui-stroke)]">
          <CardTitle className="text-base flex items-center gap-2 text-[var(--ui-text)]">
            <FileText className="w-4 h-4" />
            Contratos de locação ({contratosReajuste.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {contratosReajuste.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-32 h-32 mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="20" y="60" width="20" height="25" fill="hsl(var(--primary))" rx="2" />
                  <rect x="45" y="45" width="20" height="40" fill="hsl(var(--primary)/0.7)" rx="2" />
                  <rect x="70" y="30" width="20" height="55" fill="hsl(var(--primary)/0.5)" rx="2" />
                  <circle cx="75" cy="20" r="8" fill="#fbbf24" />
                </svg>
              </div>
              <p className="text-[var(--ui-text-subtle)]">Nenhum reajuste encontrado.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 px-6 py-3 border-b border-[var(--ui-stroke)]">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedContratos.length === contratosReajuste.length}
                    onCheckedChange={toggleAll}
                    className="rounded"
                  />
                  <span className="text-sm text-[var(--ui-text-subtle)]">
                    Selecionar ({selectedContratos.length})
                  </span>
                </div>
              </div>

              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-3 bg-[var(--ui-stroke)]/30 text-xs font-medium text-[var(--ui-text-subtle)] uppercase tracking-wide">
                <div>Código</div>
                <div className="col-span-2">Imóvel</div>
                <div>Valor atual</div>
                <div>Valor atualizado</div>
                <div>Data início</div>
                <div>Status</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[var(--ui-stroke)]">
                {contratosReajuste.map((contrato) => (
                  <div 
                    key={contrato.id}
                    className="px-6 py-4 hover:bg-[var(--ui-stroke)]/20 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-start">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedContratos.includes(contrato.id)}
                          onCheckedChange={() => toggleContrato(contrato.id)}
                          className="rounded"
                        />
                        <Link to="#" className="text-sm text-[hsl(var(--link))] hover:underline">
                          {contrato.codigo}
                        </Link>
                      </div>
                      <div className="col-span-2">
                        <Link to="#" className="text-sm text-[hsl(var(--link))] hover:underline">
                          {contrato.imovel.tipo} | {contrato.imovel.codigo}
                        </Link>
                        <p className="text-xs text-[var(--ui-text-subtle)] mt-1">{contrato.imovel.endereco}</p>
                      </div>
                      <div className="text-sm text-[var(--ui-text)]">{contrato.valorAtual}</div>
                      <div className="text-sm text-[hsl(var(--success))] font-medium">{contrato.valorAtualizado}</div>
                      <div className="text-sm text-[var(--ui-text)]">{contrato.dataInicio}</div>
                      <div>
                        {getStatusBadge(contrato.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center py-4 text-sm text-[var(--ui-text-subtle)] border-t border-[var(--ui-stroke)]">
                Fim da lista
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </LocacaoModuleLayout>
  );
};

export default ReajustesPage;
