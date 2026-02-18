import React from 'react';
import { X } from 'lucide-react';
import { StageEditor } from '@/components/vendas/StageEditor';

interface FunnelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FunnelConfigModal = ({ isOpen, onClose }: FunnelConfigModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Configurar etapas</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <StageEditor />
      </div>
    </div>
  );
};
