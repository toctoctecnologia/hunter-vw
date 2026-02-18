'use client';
import React, { useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { PropertyBuilder } from '@/shared/types';

import { SaveBuilderModal } from '@/features/dashboard/properties/components/modal/save-builder-modal';
import { deleteBuilder } from '@/features/dashboard/properties/api/builders';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Button } from '@/shared/components/ui/button';

interface CellActionProps {
  data: PropertyBuilder;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBuilder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builders'] });
      toast.success('Construtora deletada com sucesso!');
      setOpen(false);
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteMutation.mutate(data.uuid)}
        loading={deleteMutation.isPending}
      />

      <SaveBuilderModal open={isModalOpen} onClose={() => setIsModalOpen(false)} builder={data} />

      <div className="space-x-2">
        <Button size="sm" variant="ghost" onClick={() => setIsModalOpen(true)}>
          <Edit3 className="size-4" />
        </Button>

        <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </>
  );
};
