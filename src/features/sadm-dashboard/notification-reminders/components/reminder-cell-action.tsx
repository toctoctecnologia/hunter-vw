'use client';

import { MoreHorizontal, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

import { NotificationReminderItem } from '@/shared/types';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface ReminderCellActionProps {
  reminder: NotificationReminderItem;
  onDelete: (r: NotificationReminderItem) => void;
  onToggle: (r: NotificationReminderItem) => void;
}

export function ReminderCellAction({ reminder, onDelete, onToggle }: ReminderCellActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onToggle(reminder)}>
          {reminder.isEnabled ? (
            <>
              <ToggleLeft className="size-4 mr-2" />
              Desativar
            </>
          ) : (
            <>
              <ToggleRight className="size-4 mr-2" />
              Ativar
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(reminder)} className="text-destructive">
          <Trash2 className="size-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
