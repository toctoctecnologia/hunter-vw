import { ChevronLeft } from 'lucide-react';
import { Lead } from '@/types/lead';

interface ProfileHeaderProps {
  lead: Lead;
  onBack?: () => void;
}

export function ProfileHeader({ lead, onBack }: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
      {onBack && (
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-orange-600">
            {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{lead.name}</h2>
          <p className="text-gray-600 text-sm">{lead.phone}</p>
        </div>
      </div>
      <div className="w-5" />
    </div>
  );
}
