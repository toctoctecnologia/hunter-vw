import React from 'react';
import { useFunnelConfig } from '@/context/FunnelConfigContext';
import { X, ChevronUp, ChevronDown, Plus } from 'lucide-react';

export const StageEditor = () => {
  const { stages, addStage, renameStage, removeStage, moveStage } = useFunnelConfig();

  return (
    <div className="space-y-2">
      {stages.map((stage, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={stage}
            onChange={(e) => renameStage(index, e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
          />
          <button
            onClick={() => moveStage(index, index - 1)}
            disabled={index === 0}
            className="p-1 disabled:opacity-50"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => moveStage(index, index + 1)}
            disabled={index === stages.length - 1}
            className="p-1 disabled:opacity-50"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button onClick={() => removeStage(index)} className="p-1 text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button onClick={addStage} className="flex items-center gap-1 text-sm text-orange-600 mt-2">
        <Plus className="w-4 h-4" />
        Adicionar etapa
      </button>
    </div>
  );
};
