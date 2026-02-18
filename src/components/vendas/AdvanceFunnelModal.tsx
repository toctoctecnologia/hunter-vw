
import React, { useState } from 'react';
import { debugLog } from '@/utils/debug';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface AdvanceFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: string;
  stages: string[];
}

export const AdvanceFunnelModal = ({ isOpen, onClose, currentStage, stages }: AdvanceFunnelModalProps) => {
  const [selectedStage, setSelectedStage] = useState('');
  const [showStageSelection, setShowStageSelection] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [proposalValue, setProposalValue] = useState('');
  const [propertyCode, setPropertyCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [observations, setObservations] = useState('');
  const [dealDate, setDealDate] = useState('02/07/2025');
  const [dealValue, setDealValue] = useState('');
  const [dealNature, setDealNature] = useState('');

  if (!isOpen) return null;

  const colorPalette = [
    'bg-orange-500',
    'bg-orange-600',
    'bg-orange-700',
    'bg-yellow-500',
    'bg-green-500',
    'bg-teal-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-gray-500'
  ];

  const getNextStages = () => {
    const currentIndex = stages.findIndex(s => s === currentStage);
    return stages.slice(currentIndex + 1);
  };

  const handleStageAdvance = () => {
    debugLog('Avançando para stage:', selectedStage);
    onClose();
  };

  const renderStageSelection = () => (
    <div className="space-y-4">
      <p className="text-gray-700 font-medium mb-4">Para qual etapa deseja avançar?</p>
      
      <div className="space-y-3">
        {getNextStages().map((stage, index) => (
          <button
            key={stage}
            onClick={() => setSelectedStage(stage)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedStage === stage
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-orange-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${colorPalette[index % colorPalette.length]}`}></div>
              <span className="font-medium text-gray-900">{stage}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (showStageSelection) {
      return renderStageSelection();
    }

    if (selectedAction === 'cadastrar-proposta') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">AB</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Altiberto Brandao</p>
              <p className="text-sm text-gray-600">Acionamento Manual Swiss</p>
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-2 block">
              Valor total da proposta *
            </Label>
            <Input
              placeholder="Insira o valor da proposta"
              value={proposalValue}
              onChange={(e) => setProposalValue(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-2 block">
              Código do imóvel
            </Label>
            <Input
              placeholder="Qual o código do imóvel"
              value={propertyCode}
              onChange={(e) => setPropertyCode(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-4 block">
              Forma de pagamento
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="recursos-proprios" className="w-4 h-4" />
                <Label htmlFor="recursos-proprios">Recursos próprios</Label>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="financiamento" className="w-4 h-4" />
                <Label htmlFor="financiamento">Financiamento</Label>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="outros" className="w-4 h-4" />
                <Label htmlFor="outros">Outros</Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-2 block">
              Observações
            </Label>
            <Input
              placeholder="Alguma observação?"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>
        </div>
      );
    }

    if (selectedAction === 'negocio-fechado') {
      return (
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-2 block">
              Selecione a data
            </Label>
            <div className="p-3 bg-gray-100 rounded-lg">
              <span className="text-gray-900">{dealDate}</span>
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-2 block">
              Valor real do negócio fechado
            </Label>
            <Input
              placeholder="Informe o valor real do negócio fechado"
              value={dealValue}
              onChange={(e) => setDealValue(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-4 block">
              Natureza de negociação *
            </Label>
            <RadioGroup value={dealNature} onValueChange={setDealNature}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="compra" id="compra" />
                <Label htmlFor="compra">Compra</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="aluguel" id="aluguel" />
                <Label htmlFor="aluguel">Aluguel</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="lancamento" id="lancamento" />
                <Label htmlFor="lancamento">Lançamento</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="captacao" id="captacao" />
                <Label htmlFor="captacao">Captação</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-2 block">
              Código do imóvel
            </Label>
            <Input
              placeholder="Insira aqui seu código do imóvel"
              value={propertyCode}
              onChange={(e) => setPropertyCode(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-2 block">
              Informações adicionais
            </Label>
            <Input
              placeholder="Insira aqui a nota fiscal, número do pedido ou qualquer outra informação que desejar"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>
        </div>
      );
    }

    // Default view - action selection
    return (
      <div className="space-y-4">
        <p className="text-gray-700 font-medium mb-4">Defina seu próximo passo</p>
        
        <button
          onClick={() => setShowStageSelection(true)}
          className="w-full p-4 border-2 border-orange-300 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors active:bg-orange-200"
        >
          Avançar etapa do funil
        </button>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedAction('cadastrar-proposta')}
            className="p-4 border-2 border-orange-300 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors active:bg-orange-200 text-sm"
          >
            Cadastrar Proposta
          </button>
          <button
            onClick={() => setSelectedAction('negocio-fechado')}
            className="p-4 border-2 border-green-300 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors active:bg-green-200 text-sm"
          >
            Negócio Fechado
          </button>
          <button
            onClick={onClose}
            className="p-4 border-2 border-gray-300 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200 text-sm"
          >
            Arquivar Lead
          </button>
        </div>
      </div>
    );
  };

  const getTitle = () => {
    if (showStageSelection) return 'Avançar no funil';
    switch (selectedAction) {
      case 'cadastrar-proposta':
        return 'Cadastrar nova proposta';
      case 'negocio-fechado':
        return 'Marcar negócio fechado';
      default:
        return 'Defina seu próximo passo';
    }
  };

  const getButtonText = () => {
    if (showStageSelection) return 'Avançar';
    switch (selectedAction) {
      case 'cadastrar-proposta':
        return 'Confirmar';
      case 'negocio-fechado':
        return 'Marcar negócio fechado';
      default:
        return 'Continuar';
    }
  };

  const handleAction = () => {
    if (showStageSelection) {
      handleStageAdvance();
      return;
    }
    
    if (!selectedAction) return;
    
    debugLog('Ação do funil:', selectedAction, {
      proposalValue,
      propertyCode,
      paymentMethod,
      observations,
      dealDate,
      dealValue,
      dealNature
    });
    
    onClose();
  };

  const handleBackAction = () => {
    if (showStageSelection) {
      setShowStageSelection(false);
      return;
    }
    if (selectedAction) {
      setSelectedAction('');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full md:max-w-2xl h-dvh bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <button 
            onClick={handleBackAction} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="flex-1 text-center text-lg font-semibold text-gray-900">
            {getTitle()}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex gap-3">
          {(selectedAction || showStageSelection) && (
            <Button 
              variant="outline" 
              onClick={handleBackAction}
              className="flex-1"
            >
              Cancelar
            </Button>
          )}
          <Button 
            onClick={handleAction}
            disabled={showStageSelection && !selectedStage}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};
