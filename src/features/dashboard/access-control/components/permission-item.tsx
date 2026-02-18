import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { Switch } from '@/shared/components/ui/switch';

import { Permission } from '@/shared/types';

interface PermissionItemProps {
  dataItem: Permission;
}

export function PermissionItem({ dataItem }: PermissionItemProps) {
  const { name, description } = dataItem;
  return (
    <div className="flex items-center justify-between">
      <div>
        <TypographySmall>{name}</TypographySmall>
        <TypographyMuted>{description}</TypographyMuted>
      </div>

      <Switch disabled checked />
    </div>
  );
}
