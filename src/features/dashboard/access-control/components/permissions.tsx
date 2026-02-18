import { useMemo } from 'react';

import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Badge } from '@/shared/components/ui/badge';

import { Permission } from '@/shared/types';

import { PermissionItem } from '@/features/dashboard/access-control/components/permission-item';

interface PermissionsProps {
  data: Permission[];
}

export function Permissions({ data }: PermissionsProps) {
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    data.forEach((permission) => {
      const groupName = permission.groupName || 'Outras';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(permission);
    });
    return groups;
  }, [data]);

  return (
    <ScrollArea className="h-[75vh] px-2 sm:px-4 pt-6">
      <Accordion type="multiple" className="w-full">
        {Object.entries(groupedPermissions).map(([groupName, permissions]) => (
          <AccordionItem key={groupName} value={groupName}>
            <AccordionTrigger>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium">{groupName}</span>
                <Badge variant="secondary">
                  {permissions.length} {permissions.length === 1 ? 'permissão' : 'permissões'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {permissions.map((dataItem) => (
                  <PermissionItem key={dataItem.name} dataItem={dataItem} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
}
