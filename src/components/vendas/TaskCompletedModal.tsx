interface TaskCompletedModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function TaskCompletedModal({ open, onClose, onConfirm }: TaskCompletedModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Follow-up realizado</h3>
          <p className="text-gray-600">A tarefa foi marcada como concluída.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 p-3 bg-orange-600 text-white rounded-2xl font-semibold hover:bg-orange-700 transition-colors">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
