'use client';
import React, { useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { CondominiumFeature } from '@/shared/types';

import { SaveCondominiumFeatureModal } from '@/features/dashboard/properties/components/modal/save-condominium-feature-modal';
import { deleteCondominiumFeature } from '@/features/dashboard/properties/api/condominium-feature';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface CellActionProps {
  data: CondominiumFeature;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCondominiumFeature(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condominium-feature'] });
      toast.success('Característica do condomínio deletada com sucesso!');
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

      <SaveCondominiumFeatureModal open={isModalOpen} onClose={() => setIsModalOpen(false)} condominiumFeature={data} />

      {hasFeature(user?.userInfo.profile.permissions, '2301') && (
        <div className="space-x-2">
          <Button size="sm" variant="ghost" onClick={() => setIsModalOpen(true)}>
            <Edit3 className="size-4" />
          </Button>

          <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      )}
    </>
  );
};
