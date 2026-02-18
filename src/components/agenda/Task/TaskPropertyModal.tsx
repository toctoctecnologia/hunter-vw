import { X } from 'lucide-react';
import type { TaskProperty } from '@/types/task';

interface TaskPropertyModalProps {
  property: TaskProperty;
  onClose: () => void;
}

export function TaskPropertyModal({ property, onClose }: TaskPropertyModalProps) {
  if (!property) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Imóvel da visita</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="space-y-2 mb-6">
          <div className="text-sm text-gray-700">
            <span className="font-medium">Código: </span>
            {property.codigo}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Título: </span>
            {property.titulo}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Endereço: </span>
            {property.endereco}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

export default TaskPropertyModal;

