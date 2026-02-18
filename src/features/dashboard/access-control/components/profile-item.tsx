import { Users } from 'lucide-react';

import { Profile } from '@/features/dashboard/access-control/types';

import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';

interface ProfileItemProps {
  dataItem: Profile;
  onEdit: (profile: Profile) => void;
}

export function ProfileItem({ dataItem, onEdit }: ProfileItemProps) {
  const { name, description } = dataItem;

  return (
    <div className="flex items-center my-2">
      <button
        className="flex-1 text-left p-3 rounded-lg flex items-center gap-3 transition-colors hover:bg-accent"
        onClick={() => onEdit(dataItem)}
      >
        <div>
          <Users size={20} className="text-toctoc-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <TypographySmall className="truncate">{name}</TypographySmall>
          <TypographyMuted className="truncate text-xs">{description}</TypographyMuted>
        </div>
      </button>
    </div>
  );
}
