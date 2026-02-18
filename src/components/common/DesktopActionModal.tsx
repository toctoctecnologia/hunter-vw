import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ActionModalProps } from './ActionModal';
import { DESKTOP_ACTIONS } from './actionModalItems';

export const DesktopActionModal = ({ isOpen, onClose }: ActionModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Selecione uma ação</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-3">
            {DESKTOP_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.path)}
                  aria-label={action.title}
                  className="w-full flex items-center gap-4 p-4 text-left bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-colors"
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

export default DesktopActionModal;
