
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOBILE_ACTIONS } from './actionModalItems';

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActionModal = ({ isOpen, onClose }: ActionModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAction = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-end justify-center md:hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-white w-full max-w-sm rounded-t-3xl shadow-2xl transform transition-transform animate-scale-in">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Selecione uma ação</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Actions List */}
          <div className="px-6 pb-8 space-y-2">
            {MOBILE_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.path)}
                  aria-label={action.title}
                  className="w-full flex items-center gap-4 p-4 text-left bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 active:bg-gray-100 transition-all duration-150 shadow-sm"
                >
                  <div className={`flex-shrink-0 p-3 rounded-xl ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-gray-900 font-medium">{action.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
