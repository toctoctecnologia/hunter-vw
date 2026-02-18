import { ChevronDown } from 'lucide-react';

interface StatusDropdownProps {
  stages: string[];
  currentStage: number;
  show: boolean;
  onToggle: () => void;
  onSelect: (index: number) => void;
}

export function StatusDropdown({ stages, currentStage, show, onToggle, onSelect }: StatusDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`w-full p-3 rounded-xl border text-sm font-medium flex items-center justify-between bg-white`}
      >
        <span>{stages[currentStage]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${show ? 'rotate-180' : ''}`} />
      </button>
      {show && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
          {stages.map((stage, index) => (
            <button
              key={stage}
              onClick={() => onSelect(index)}
              className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl ${index === currentStage ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700'}`}
            >
              {stage}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
