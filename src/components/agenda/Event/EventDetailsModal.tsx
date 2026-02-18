
import React from 'react';
import { ArrowLeft, MoreVertical, Phone, Camera, Check } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  property: {
    name: string;
    unit?: string;
    address: string;
    city: string;
    state: string;
  };
  start: Date;
  end: Date;
  responsible?: {
    name: string;
    phone: string;
    instruction: string;
  };
  value: {
    service: number;
    extras: Array<{
      name: string;
      value: number;
    }>;
  };
  stages: {
    current: number;
    steps: string[];
  };
  photos: string[];
  status: string;
  rating?: number;
}

interface EventDetailsModalProps {
  isVisible: boolean;
  event: Event | null;
  onClose: () => void;
  onMorePress: () => void;
  onRateService: () => void;
}

export const EventDetailsModal = ({ isVisible, event, onClose, onMorePress, onRateService }: EventDetailsModalProps) => {
  if (!isVisible || !event) return null;

  const totalValue = event.value.service + event.value.extras.reduce((sum, extra) => sum + extra.value, 0);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <div className="modal-content bg-white rounded-3xl w-full max-w-sm flex flex-col">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
        <button onClick={onClose}>
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        
        <h1 className="font-medium text-xl text-gray-800">
          Detalhes do evento
        </h1>
        
        <button onClick={onMorePress}>
          <MoreVertical size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Property Info */}
        <div className="mb-6">
          {event.property.unit && (
            <p className="text-xs text-gray-600 mb-1">
              {event.property.unit}
            </p>
          )}
          <h2 className="font-semibold text-2xl text-gray-800 mb-1">
            {event.property.name}
          </h2>
          <p className="text-sm text-gray-600">
            Foto Profissionais
          </p>
        </div>

        <div className="h-px bg-gray-200 mb-6" />

        {/* Scheduling */}
        <div className="mb-6">
          <h3 className="font-medium text-base text-gray-800 mb-2">
            Agendamento
          </h3>
          <div className="space-y-0.5">
            <div className="flex justify-between bg-white p-3 rounded-lg">
              <span className="text-sm text-gray-600">Data</span>
              <span className="text-sm text-gray-800">
                {format(event.start, 'dd/MM/yyyy')}
              </span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-600">Horário</span>
              <span className="text-sm text-gray-800">
                {format(event.start, 'HH:mm')} – {format(event.end, 'HH:mm')}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 mb-6" />

        {/* Location */}
        <div className="mb-6">
          <h3 className="font-medium text-base text-gray-800 mb-2">
            Localização
          </h3>
          <div className="space-y-0.5">
            <div className="flex justify-between bg-white p-3 rounded-lg">
              <span className="text-sm text-gray-600">Endereço</span>
              <span className="text-sm text-gray-800 text-right flex-1 ml-4">
                {event.property.address}
              </span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-600">Cidade/UF</span>
              <span className="text-sm text-gray-800">
                {event.property.city} – {event.property.state}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 mb-6" />

        {/* Responsible */}
        {event.responsible && (
          <>
            <div className="mb-6">
              <h3 className="font-medium text-base text-gray-800 mb-2">
                Acompanhamento
              </h3>
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="mb-3">
                  <h4 className="font-semibold text-base text-gray-800">
                    {event.responsible.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {event.responsible.instruction}
                  </p>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-600 ml-2">
                    {event.responsible.phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-px bg-gray-200 mb-6" />
          </>
        )}

        {/* Value */}
        <div className="mb-6">
          <h3 className="font-medium text-base text-gray-800 mb-2">
            Valor
          </h3>
          <div className="space-y-px">
            <div className="flex justify-between bg-white p-3 rounded-lg">
              <span className="text-sm text-gray-600">Avalie o serviço</span>
              <span className="text-sm text-gray-800">
                {event.value.service} crédito
              </span>
            </div>
            {event.value.extras.map((extra, index) => (
              <div key={index} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-600">{extra.name}</span>
                <span className="text-sm text-gray-800">
                  {extra.value} créditos
                </span>
              </div>
            ))}
            <div className="border-t border-dashed border-gray-300 my-2" />
            <div className="flex justify-between bg-white p-3 rounded-lg">
              <span className="font-semibold text-sm text-gray-800">Total</span>
              <span className="font-semibold text-sm text-gray-800">
                {totalValue} crédito
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 mb-6" />

        {/* Stages */}
        <div className="mb-6">
          <h3 className="font-medium text-base text-gray-800 mb-4">
            Etapas
          </h3>
          <div className="space-y-4">
            {event.stages.steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index + 1 <= event.stages.current ? 'bg-[hsl(var(--accent))]' : 'bg-gray-300'
                }`}>
                  <span className={`font-semibold text-sm ${
                    index + 1 <= event.stages.current ? 'text-white' : 'text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 ml-3">
                  <p className={`text-sm ${
                    index + 1 <= event.stages.current ? 'font-semibold text-gray-800' : 'text-gray-600'
                  }`}>
                    {step}
                  </p>
                </div>
                {index + 1 <= event.stages.current && (
                  <Check size={16} className="text-[hsl(var(--accent))]" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-200 mb-6" />

        {/* Photos */}
        <div className="mb-6">
          <h3 className="font-medium text-base text-gray-800 mb-3">
            Fotos do serviço
          </h3>
          {event.photos.length > 0 ? (
            <div className="flex overflow-x-auto gap-2">
              {event.photos.slice(0, 3).map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-20 h-14 rounded object-cover flex-shrink-0"
                />
              ))}
              {event.photos.length > 3 && (
                <div className="w-20 h-14 rounded bg-black bg-opacity-40 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white">
                    +{event.photos.length - 3}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-30 bg-gray-100 border border-gray-300 rounded-lg flex flex-col items-center justify-center">
              <Camera size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 text-center">
                Nenhuma foto disponível
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Aguarde a finalização do serviço para receber as fotos deste imóvel
              </p>
            </div>
          )}
        </div>

        {/* Rate Service Button */}
        <button
          className={`w-full h-12 rounded-lg flex items-center justify-center mb-8 transition-colors ${
            event.status === 'completed' && event.rating === undefined
              ? 'bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={event.status !== 'completed' || event.rating !== undefined}
          onClick={onRateService}
        >
          <span className="font-semibold text-base text-white">
            {event.rating !== undefined ? 'Serviço avaliado' : 'Avaliar serviço'}
          </span>
        </button>
      </div>
      </div>
    </div>
  );
};
