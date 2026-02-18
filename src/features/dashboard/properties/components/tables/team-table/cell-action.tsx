'use client';
import React, { useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TeamDetail } from '@/shared/types';

import { deleteTeam } from '@/features/dashboard/properties/api/teams';

import { SaveTeamModal } from '@/features/dashboard/properties/components/modal/save-team-modal';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface CellActionProps {
  data: TeamDetail;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Equipe deletada com sucesso!');
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

      <SaveTeamModal open={isModalOpen} onClose={() => setIsModalOpen(false)} team={data} />

      {hasFeature(user?.userInfo.profile.permissions, '1452') && (
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
