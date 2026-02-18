'use client';
import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/shims/next-navigation';
import { toast } from 'sonner';

import { CondominiumDetail } from '@/shared/types';

import { deleteCondominium } from '@/features/dashboard/properties/api/condominiums';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface CellActionProps {
  data: CondominiumDetail;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuth();

  const [open, setOpen] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCondominium(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condominiums'] });
      toast.success('Condomínio deletado com sucesso!');
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

      {hasFeature(user?.userInfo.profile.permissions, '2301') && (
        <div className="space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/dashboard/manage-condominiums/condominium/${data.uuid}`)}
          >
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
