import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StandardLayout } from '@/layouts/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Check,
  ChevronRight,
  Search,
  Calendar as CalendarIcon,
  FileText,
  Plus,
  Trash2,
  Building2,
  User,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FaturaItem {
  id: string;
  descricao: string;
  valor: number;
}

interface ContratoOption {
  id: string;
  codigo: string;
  locatario: string;
  imovel: string;
  valorAluguel: number;
}

const contratosDisponiveis: ContratoOption[] = [
  { id: '1', codigo: '2093477/1', locatario: 'Luiz Victor Ferreira', imovel: 'Apartamento | Rua Exemplo, 100', valorAluguel: 2500 },
  { id: '2', codigo: '1477462/1', locatario: 'Carolina Lima', imovel: 'Casa | Rua das Flores, 250', valorAluguel: 3200 },
  { id: '3', codigo: '2004101/1', locatario: 'Felipe Rocha', imovel: 'Sala Comercial | Av. Horizonte, 450', valorAluguel: 6900 },
];

const steps = [
  { id: 1, title: 'Contrato', description: 'Selecione o contrato' },
  { id: 2, title: 'Dados', description: 'Informações do boleto' },
  { id: 3, title: 'Valores', description: 'Itens e valores' },
  { id: 4, title: 'Revisão', description: 'Confirmar e salvar' },
];

export const NovaFaturaPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchContrato, setSearchContrato] = useState('');
  
  // Step 1: Contract selection
  const [selectedContrato, setSelectedContrato] = useState<ContratoOption | null>(null);
  
  // Step 2: Invoice data
  const [competencia, setCompetencia] = useState('');
  const [dataEmissao, setDataEmissao] = useState<Date | undefined>(new Date());
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>();
  const [formaPagamento, setFormaPagamento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  // Step 3: Items
  const [itens, setItens] = useState<FaturaItem[]>([]);
  const [novoItemDescricao, setNovoItemDescricao] = useState('');
  const [novoItemValor, setNovoItemValor] = useState('');

  const filteredContratos = contratosDisponiveis.filter(c => 
    c.codigo.toLowerCase().includes(searchContrato.toLowerCase()) ||
    c.locatario.toLowerCase().includes(searchContrato.toLowerCase()) ||
    c.imovel.toLowerCase().includes(searchContrato.toLowerCase())
  );

  const handleSelectContrato = (contrato: ContratoOption) => {
    setSelectedContrato(contrato);
    // Pre-populate items with default values from contract
    setItens([
      { id: '1', descricao: 'Aluguel', valor: contrato.valorAluguel },
      { id: '2', descricao: 'Taxa de administração (10%)', valor: contrato.valorAluguel * 0.1 },
      { id: '3', descricao: 'Taxa bancária', valor: 3.50 },
    ]);
  };

  const addItem = () => {
    if (!novoItemDescricao || !novoItemValor) return;
    setItens([...itens, {
      id: Date.now().toString(),
      descricao: novoItemDescricao,
      valor: parseFloat(novoItemValor)
    }]);
    setNovoItemDescricao('');
    setNovoItemValor('');
  };

  const removeItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const updateItemValor = (id: string, valor: number) => {
    setItens(itens.map(item => item.id === id ? { ...item, valor } : item));
  };

  const totalFatura = itens.reduce((acc, item) => acc + item.valor, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedContrato !== null;
      case 2: return competencia && dataEmissao && dataVencimento && formaPagamento;
      case 3: return itens.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save and redirect
      toast({
        title: "Boleto criado com sucesso!",
        description: `Boleto para ${selectedContrato?.locatario} foi criado.`,
      });
      navigate('/gestao-locacao/faturas/1'); // Would redirect to the new invoice
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/gestao-locacao/faturas');
    }
  };

  return (
    <StandardLayout>
      <div className="gestao-locacao-theme p-6 bg-[var(--ui-surface)] min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[var(--ui-text-subtle)] mb-6">
            <Link to="/gestao-locacao" className="hover:text-[var(--ui-text)] transition-colors">INÍCIO</Link>
            <span>›</span>
            <Link to="/gestao-locacao/faturas" className="hover:text-[var(--ui-text)] transition-colors">BOLETOS</Link>
            <span>›</span>
            <span className="text-[var(--ui-text)] font-medium">NOVO BOLETO</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBack}
              className="rounded-xl hover:bg-[var(--ui-stroke)]/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[var(--ui-text)]">Novo boleto</h1>
              <p className="text-sm text-[hsl(var(--textSecondary))]">Crie um novo boleto para um contrato de locação</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                        currentStep > step.id 
                          ? "bg-[hsl(var(--success))] text-[hsl(var(--brandPrimaryText))]"
                          : currentStep === step.id 
                            ? "bg-[hsl(var(--accent))] text-[hsl(var(--brandPrimaryText))]"
                            : "bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)]"
                      )}
                    >
                      {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={cn(
                        "text-sm font-medium",
                        currentStep >= step.id ? "text-[var(--ui-text)]" : "text-[var(--ui-text-subtle)]"
                      )}>
                        {step.title}
                      </p>
                      <p className="text-xs text-[var(--ui-text-subtle)] hidden sm:block">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-4",
                      currentStep > step.id ? "bg-[hsl(var(--success))]" : "bg-[var(--ui-stroke)]"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <CardContent className="p-6">
              {/* Step 1: Contract Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--ui-text)] mb-2">Selecione o contrato</h2>
                    <p className="text-sm text-[var(--ui-text-subtle)]">Escolha o contrato de locação para este boleto</p>
                  </div>
                  
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ui-text-subtle)]" />
                    <Input 
                      placeholder="Buscar por código, locatário ou imóvel..."
                      className="pl-10 h-11 rounded-xl border-[var(--ui-stroke)]"
                      value={searchContrato}
                      onChange={(e) => setSearchContrato(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredContratos.map((contrato) => (
                      <div
                        key={contrato.id}
                        onClick={() => handleSelectContrato(contrato)}
                        className={cn(
                          "p-4 rounded-xl border-2 cursor-pointer transition-all",
                          selectedContrato?.id === contrato.id
                            ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5"
                            : "border-[var(--ui-stroke)] hover:border-[hsl(var(--accent))]/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-[hsl(var(--accent))]" />
                              <span className="font-medium text-[var(--ui-text)]">{contrato.codigo}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--ui-text-subtle)] mb-1">
                              <User className="w-4 h-4" />
                              {contrato.locatario}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--ui-text-subtle)]">
                              <Building2 className="w-4 h-4" />
                              {contrato.imovel}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[var(--ui-text-subtle)]">Aluguel</p>
                            <p className="font-semibold text-[var(--ui-text)]">{formatCurrency(contrato.valorAluguel)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Invoice Data */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--ui-text)] mb-2">Dados do boleto</h2>
                    <p className="text-sm text-[var(--ui-text-subtle)]">Informe os dados principais do boleto</p>
                  </div>

                  {selectedContrato && (
                    <div className="p-4 bg-[var(--ui-stroke)]/20 rounded-xl">
                      <p className="text-sm text-[var(--ui-text-subtle)] mb-1">Contrato selecionado</p>
                      <p className="font-medium text-[var(--ui-text)]">{selectedContrato.codigo} - {selectedContrato.locatario}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--ui-text)]">Competência</label>
                      <Select value={competencia} onValueChange={setCompetencia}>
                        <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                          <SelectValue placeholder="Selecione o mês de referência" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="12/2024">Dezembro/2024</SelectItem>
                          <SelectItem value="01/2025">Janeiro/2025</SelectItem>
                          <SelectItem value="02/2025">Fevereiro/2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--ui-text)]">Data de emissão</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 rounded-xl border-[var(--ui-stroke)] justify-start text-left font-normal",
                              !dataEmissao && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataEmissao ? format(dataEmissao, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={dataEmissao}
                            onSelect={setDataEmissao}
                            initialFocus
                            className="pointer-events-auto"
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--ui-text)]">Data de vencimento</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 rounded-xl border-[var(--ui-stroke)] justify-start text-left font-normal",
                              !dataVencimento && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataVencimento ? format(dataVencimento, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={dataVencimento}
                            onSelect={setDataVencimento}
                            initialFocus
                            className="pointer-events-auto"
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--ui-text)]">Forma de pagamento</label>
                      <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                        <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="boleto">Boleto bancário</SelectItem>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="ted">TED/DOC</SelectItem>
                          <SelectItem value="deposito">Depósito bancário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--ui-text)]">Observações internas (opcional)</label>
                    <Textarea 
                      placeholder="Adicione observações que ficarão visíveis apenas internamente..."
                      className="rounded-xl border-[var(--ui-stroke)] min-h-[100px] resize-none"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Items and Values */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--ui-text)] mb-2">Itens e valores</h2>
                    <p className="text-sm text-[var(--ui-text-subtle)]">Adicione ou ajuste os itens do boleto</p>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {itens.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-[var(--ui-stroke)]/20 rounded-xl">
                        <div className="flex-1">
                          <p className="font-medium text-[var(--ui-text)]">{item.descricao}</p>
                        </div>
                        <div className="w-40">
                          <Input
                            type="number"
                            value={item.valor}
                            onChange={(e) => updateItemValor(item.id, parseFloat(e.target.value) || 0)}
                            className="h-10 rounded-xl border-[var(--ui-stroke)] text-right"
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-[hsl(var(--danger))] hover:text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger)/0.08)] rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add Item Form */}
                  <div className="flex items-end gap-4 p-4 border-2 border-dashed border-[var(--ui-stroke)] rounded-xl">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium text-[var(--ui-text)]">Descrição</label>
                      <Input
                        placeholder="Ex: Condomínio, IPTU..."
                        className="h-10 rounded-xl border-[var(--ui-stroke)]"
                        value={novoItemDescricao}
                        onChange={(e) => setNovoItemDescricao(e.target.value)}
                      />
                    </div>
                    <div className="w-40 space-y-2">
                      <label className="text-sm font-medium text-[var(--ui-text)]">Valor</label>
                      <Input
                        type="number"
                        placeholder="0,00"
                        className="h-10 rounded-xl border-[var(--ui-stroke)] text-right"
                        value={novoItemValor}
                        onChange={(e) => setNovoItemValor(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={addItem}
                      variant="outline"
                      className="rounded-xl h-10 px-4 border-[hsl(var(--accent))] text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between p-4 bg-[hsl(var(--accent))]/5 rounded-xl border border-[hsl(var(--accent))]/20">
                    <span className="text-lg font-semibold text-[var(--ui-text)]">Total do boleto</span>
                    <span className="text-2xl font-bold text-[hsl(var(--accent))]">{formatCurrency(totalFatura)}</span>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--ui-text)] mb-2">Revisão</h2>
                    <p className="text-sm text-[var(--ui-text-subtle)]">Confira os dados antes de salvar</p>
                  </div>

                  {/* Contract Info */}
                  <div className="p-4 bg-[var(--ui-stroke)]/20 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[hsl(var(--accent))]" />
                      <span className="font-medium text-[var(--ui-text)]">Contrato {selectedContrato?.codigo}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[var(--ui-text-subtle)]">Locatário</p>
                        <p className="font-medium text-[var(--ui-text)]">{selectedContrato?.locatario}</p>
                      </div>
                      <div>
                        <p className="text-[var(--ui-text-subtle)]">Imóvel</p>
                        <p className="font-medium text-[var(--ui-text)]">{selectedContrato?.imovel}</p>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Data */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-[var(--ui-stroke)]/20 rounded-xl">
                      <p className="text-xs text-[var(--ui-text-subtle)]">Competência</p>
                      <p className="font-medium text-[var(--ui-text)]">{competencia}</p>
                    </div>
                    <div className="p-3 bg-[var(--ui-stroke)]/20 rounded-xl">
                      <p className="text-xs text-[var(--ui-text-subtle)]">Emissão</p>
                      <p className="font-medium text-[var(--ui-text)]">{dataEmissao ? format(dataEmissao, "dd/MM/yyyy") : '-'}</p>
                    </div>
                    <div className="p-3 bg-[var(--ui-stroke)]/20 rounded-xl">
                      <p className="text-xs text-[var(--ui-text-subtle)]">Vencimento</p>
                      <p className="font-medium text-[var(--ui-text)]">{dataVencimento ? format(dataVencimento, "dd/MM/yyyy") : '-'}</p>
                    </div>
                    <div className="p-3 bg-[var(--ui-stroke)]/20 rounded-xl">
                      <p className="text-xs text-[var(--ui-text-subtle)]">Pagamento</p>
                      <p className="font-medium text-[var(--ui-text)] capitalize">{formaPagamento || '-'}</p>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-[var(--ui-text)]">Itens do boleto</h3>
                    <div className="border border-[var(--ui-stroke)] rounded-xl overflow-hidden">
                      {itens.map((item, index) => (
                        <div key={item.id} className={cn(
                          "flex justify-between items-center p-3",
                          index !== itens.length - 1 && "border-b border-[var(--ui-stroke)]"
                        )}>
                          <span className="text-sm text-[var(--ui-text)]">{item.descricao}</span>
                          <span className="text-sm font-medium text-[var(--ui-text)]">{formatCurrency(item.valor)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between p-4 bg-[hsl(var(--accent))]/5 rounded-xl border border-[hsl(var(--accent))]/20">
                    <span className="text-lg font-semibold text-[var(--ui-text)]">Total do boleto</span>
                    <span className="text-2xl font-bold text-[hsl(var(--accent))]">{formatCurrency(totalFatura)}</span>
                  </div>

                  {observacoes && (
                    <div className="p-4 bg-[hsl(var(--warning)/0.12)] border border-[hsl(var(--warning)/0.4)] rounded-xl">
                      <p className="text-xs text-[hsl(var(--warning))] mb-1">Observações internas</p>
                      <p className="text-sm text-[hsl(var(--textPrimary))]">{observacoes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="rounded-xl h-11 px-5 border-[var(--ui-stroke)]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Cancelar' : 'Voltar'}
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] rounded-xl h-11 px-6 shadow-lg shadow-[var(--brand-focus)]"
            >
              {currentStep === 4 ? 'Salvar boleto' : 'Continuar'}
              {currentStep < 4 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default NovaFaturaPage;
