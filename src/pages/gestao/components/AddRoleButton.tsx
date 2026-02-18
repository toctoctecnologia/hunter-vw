import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoleFormModal from './RoleFormModal';
import type { Role } from '@/data/accessControl';

interface AddRoleButtonProps {
  onSave?: (roles: Role[]) => void;
}

export default function AddRoleButton({ onSave }: AddRoleButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="default"
        className="w-full justify-start h-auto p-4"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar perfil
      </Button>
      <RoleFormModal
        open={open}
        onOpenChange={setOpen}
        onSave={onSave}
      />
    </>
  );
}