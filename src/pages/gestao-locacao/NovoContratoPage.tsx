import { useState } from 'react';
import { StandardLayout } from '@/layouts/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Building2,
  User,
  Calendar,
  DollarSign,
  FileText,
  Check,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, label: 'Imóvel', icon: Building2 },
  { id: 2, label: 'Locador', icon: User },
  { id: 3, label: 'Locatário', icon: User },
  { id: 4, label: 'Valores', icon: DollarSign },
  { id: 5, label: 'Datas', icon: Calendar },
  { id: 6, label: 'Revisão', icon: FileText },
];

export const NovoContratoPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    imovel: '',
    tipoImovel: '',
    endereco: '',
    locadorNome: '',
    locadorCpf: '',
    locadorEmail: '',
    locatarioNome: '',
    locatarioCpf: '',
    locatarioEmail: '',
    valorAluguel: '',
    taxaAdm: '',
    diaVencimento: '',
    indiceReajuste: '',
    dataInicio: '',
    dataFim: '',
    observacoes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Contrato criado:', formData);
    navigate('/gestao-locacao/contratos');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">Código do Imóvel</Label>
                <Input 
                  value={formData.imovel}
                  onChange={(e) => handleInputChange('imovel', e.target.value)}
                  placeholder="Ex: APT-001"
                  className="h-11 rounded-xl border-[var(--ui-stroke)] focus:border-[hsl(var(--accent))] focus:ring-[var(--brand-focus)]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">Tipo de Imóvel</Label>
                <Select value={formData.tipoImovel} onValueChange={(v) => handleInputChange('tipoImovel', v)}>
                  <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="sala">Sala Comercial</SelectItem>
                    <SelectItem value="galpao">Galpão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Endereço Completo</Label>
              <Textarea 
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Rua, número, complemento, bairro, cidade - UF"
                className="rounded-xl border-[var(--ui-stroke)] focus:border-[hsl(var(--accent))] min-h-[100px]"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Nome do Locador</Label>
              <Input 
                value={formData.locadorNome}
                onChange={(e) => handleInputChange('locadorNome', e.target.value)}
                placeholder="Nome completo"
                className="h-11 rounded-xl border-[var(--ui-stroke)]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">CPF/CNPJ</Label>
                <Input 
                  value={formData.locadorCpf}
                  onChange={(e) => handleInputChange('locadorCpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">E-mail</Label>
                <Input 
                  type="email"
                  value={formData.locadorEmail}
                  onChange={(e) => handleInputChange('locadorEmail', e.target.value)}
                  placeholder="email@exemplo.com"
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Nome do Locatário</Label>
              <Input 
                value={formData.locatarioNome}
                onChange={(e) => handleInputChange('locatarioNome', e.target.value)}
                placeholder="Nome completo"
                className="h-11 rounded-xl border-[var(--ui-stroke)]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">CPF/CNPJ</Label>
                <Input 
                  value={formData.locatarioCpf}
                  onChange={(e) => handleInputChange('locatarioCpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">E-mail</Label>
                <Input 
                  type="email"
                  value={formData.locatarioEmail}
                  onChange={(e) => handleInputChange('locatarioEmail', e.target.value)}
                  placeholder="email@exemplo.com"
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">Valor do Aluguel</Label>
                <Input 
                  value={formData.valorAluguel}
                  onChange={(e) => handleInputChange('valorAluguel', e.target.value)}
                  placeholder="R$ 0,00"
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">Taxa de Administração (%)</Label>
                <Input 
                  value={formData.taxaAdm}
                  onChange={(e) => handleInputChange('taxaAdm', e.target.value)}
                  placeholder="10"
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">Dia de Vencimento</Label>
                <Select value={formData.diaVencimento} onValueChange={(v) => handleInputChange('diaVencimento', v)}>
                  <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25].map(dia => (
                      <SelectItem key={dia} value={String(dia)}>Dia {dia}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">Índice de Reajuste</Label>
                <Select value={formData.indiceReajuste} onValueChange={(v) => handleInputChange('indiceReajuste', v)}>
                  <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="igpm">IGP-M</SelectItem>
                    <SelectItem value="ipca">IPCA</SelectItem>
                    <SelectItem value="inpc">INPC</SelectItem>
                    <SelectItem value="ivar">IVAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">Data de Início</Label>
                <Input 
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">Data de Término</Label>
                <Input 
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) => handleInputChange('dataFim', e.target.value)}
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Observações</Label>
              <Textarea 
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Informações adicionais sobre o contrato..."
                className="rounded-xl border-[var(--ui-stroke)] min-h-[120px]"
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[hsl(var(--accent))]" />
                    Imóvel
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--ui-text-subtle)]">
                  <p>{formData.tipoImovel || '-'} | {formData.imovel || '-'}</p>
                  <p className="mt-1">{formData.endereco || '-'}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                    <User className="w-4 h-4 text-[hsl(var(--accent))]" />
                    Locador
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--ui-text-subtle)]">
                  <p>{formData.locadorNome || '-'}</p>
                  <p>{formData.locadorEmail || '-'}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                    <User className="w-4 h-4 text-[hsl(var(--accent))]" />
                    Locatário
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--ui-text-subtle)]">
                  <p>{formData.locatarioNome || '-'}</p>
                  <p>{formData.locatarioEmail || '-'}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[hsl(var(--accent))]" />
                    Valores
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--ui-text-subtle)]">
                  <p>Aluguel: {formData.valorAluguel || '-'}</p>
                  <p>Taxa Adm: {formData.taxaAdm || '-'}%</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <StandardLayout>
      <div className="gestao-locacao-theme p-6 bg-[var(--ui-surface)] min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[var(--ui-text-subtle)] mb-6">
            <Link to="/gestao-locacao" className="hover:text-[var(--ui-text)]">INÍCIO</Link>
            <span>›</span>
            <Link to="/gestao-locacao/contratos" className="hover:text-[var(--ui-text)]">CONTRATOS DE LOCAÇÃO</Link>
            <span>›</span>
            <span className="text-[var(--ui-text)] font-medium">NOVO CONTRATO</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/gestao-locacao/contratos">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-[var(--ui-stroke)]">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[var(--ui-text)]">Novo Contrato</h1>
              <p className="text-sm text-[hsl(var(--textSecondary))]">Preencha as informações do contrato de locação</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.id 
                        ? 'bg-[hsl(var(--accent))] text-[hsl(var(--brandPrimaryText))]' 
                        : currentStep === step.id 
                          ? 'bg-[hsl(var(--accent))] text-[hsl(var(--brandPrimaryText))] shadow-lg shadow-[var(--brand-focus)]' 
                          : 'bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)]'
                    }`}>
                      {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-2 ${currentStep >= step.id ? 'text-[var(--ui-text)] font-medium' : 'text-[var(--ui-text-subtle)]'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full h-0.5 mx-2 ${currentStep > step.id ? 'bg-[hsl(var(--accent))]' : 'bg-[var(--ui-stroke)]'}`} style={{ minWidth: '40px' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-md)]">
            <CardHeader className="border-b border-[var(--ui-stroke)]">
              <CardTitle className="text-lg font-semibold text-[var(--ui-text)]">
                {steps[currentStep - 1].label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="rounded-xl h-11 px-6 border-[var(--ui-stroke)] hover:bg-[var(--ui-stroke)]"
            >
              Voltar
            </Button>
            {currentStep === steps.length ? (
              <Button 
                onClick={handleSubmit}
                className="rounded-xl h-11 px-6 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] shadow-lg shadow-[var(--brand-focus)]"
              >
                Criar Contrato
              </Button>
            ) : (
              <Button 
                onClick={nextStep}
                className="rounded-xl h-11 px-6 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default NovoContratoPage;
