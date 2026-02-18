
import React from 'react';
import { MessageCircle, HelpCircle, Edit, Calendar, XCircle, ChevronRight } from 'lucide-react';

interface EventBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onCancelEvent: () => void;
}

export const EventBottomSheet = ({ isVisible, onClose, onCancelEvent }: EventBottomSheetProps) => {
  const actions = [
    {
      icon: MessageCircle,
      title: 'Falar com fotógrafo',
      description: 'Utilize nosso chat para entrar em contato com o fotógrafo',
      color: 'text-gray-800',
      onPress: () => onClose()
    },
    {
      icon: HelpCircle,
      title: 'Solicitar suporte',
      description: 'Fale sobre algum problema ou feedback com a nossa equipe',
      color: 'text-gray-800',
      onPress: () => onClose()
    },
    {
      icon: Edit,
      title: 'Editar evento',
      description: 'Edite informações do evento/serviço',
      color: 'text-gray-800',
      onPress: () => onClose()
    },
    {
      icon: Calendar,
      title: 'Reagendar serviço',
      description: 'Remarque o serviço para outra data',
      color: 'text-gray-800',
      onPress: () => onClose()
    },
    {
      icon: XCircle,
      title: 'Cancelar evento',
      description: 'Cancelamento sujeito a taxa após 4h antes do horário marcado',
      color: 'text-red-600',
      onPress: onCancelEvent
    }
  ];

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl max-h-[50vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-4" />

        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-800 px-4 mb-3">
          Gerenciar serviço
        </h3>

        {/* Actions */}
        <div>
          {actions.map((action, index) => (
            <button
              key={index}
              className="h-14 px-4 flex items-center w-full hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              onClick={action.onPress}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <action.icon size={20} className={action.color} />
              </div>

              <div className="flex-1 ml-3 text-left">
                <div className={`font-medium text-sm ${action.color}`}>
                  {action.title}
                </div>
                <div className="text-xs text-gray-600">
                  {action.description}
                </div>
              </div>

              <ChevronRight size={20} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
