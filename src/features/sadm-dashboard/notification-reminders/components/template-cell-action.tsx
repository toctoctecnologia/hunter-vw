'use client';

import { MoreHorizontal, Pencil, Trash2, Bell } from 'lucide-react';

import { NotificationTemplateItem } from '@/shared/types';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface TemplateCellActionProps {
  template: NotificationTemplateItem;
  onEdit: (t: NotificationTemplateItem) => void;
  onDelete: (t: NotificationTemplateItem) => void;
  onViewReminders: (t: NotificationTemplateItem) => void;
}

export function TemplateCellAction({ template, onEdit, onDelete, onViewReminders }: TemplateCellActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewReminders(template)}>
          <Bell className="size-4 mr-2" />
          Ver lembretes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(template)}>
          <Pencil className="size-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(template)} className="text-destructive">
          <Trash2 className="size-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
