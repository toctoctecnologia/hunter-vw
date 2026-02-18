'use client';
import React, { useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { PropertyFeature } from '@/shared/types';

import { deletePropertyFeature } from '@/features/dashboard/properties/api/property-feature';

import { SavePropertyFeatureModal } from '@/features/dashboard/properties/components/modal/save-property-feature-modal';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface CellActionProps {
  data: PropertyFeature;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePropertyFeature(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-feature'] });
      toast.success('Característica do imóvel deletada com sucesso!');
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

      <SavePropertyFeatureModal open={isModalOpen} onClose={() => setIsModalOpen(false)} propertyFeature={data} />

      {hasFeature(user?.userInfo.profile.permissions, '2201') && (
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
