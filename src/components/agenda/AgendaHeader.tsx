
import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

interface AgendaHeaderProps {
  onBack?: () => void;
  onAddEvent?: () => void;
}

export const AgendaHeader = ({ onBack, onAddEvent }: AgendaHeaderProps) => {
  return (
    <div className="h-14 bg-white flex items-center justify-between px-4 shadow-sm border-b border-gray-100">
      {/* Left side */}
      <div className="flex items-center">
        {onBack && (
          <button onClick={onBack} className="mr-3">
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
        )}
        
        <span className="font-medium text-xl text-gray-800">
          junho
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center">
        {onAddEvent && (
          <button 
            onClick={onAddEvent}
            className="w-8 h-8 bg-[hsl(var(--accent))] rounded-full flex items-center justify-center"
          >
            <Plus size={16} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};
