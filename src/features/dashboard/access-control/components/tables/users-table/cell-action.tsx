'use client';
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from '@/shims/next-navigation';

import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';

import { useAuth } from '@/shared/hooks/use-auth';

import { AlertModal } from '@/shared/components/modal/alert-modal';
import { User } from '@/features/dashboard/access-control/types';

import { changeUserStatus } from '@/features/dashboard/access-control/api/user';
import { hasFeature } from '@/shared/lib/permissions';

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { user } = useAuth();

  const [open, setOpen] = React.useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => changeUserStatus(String(data.uuid), !data.isActive),
    onSuccess: () => {
      toast.success('Status do usuário atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => mutate()}
        loading={isPending}
        description="O usuário não terá mais acesso ao sistema caso você desative ele."
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${data.uuid}`)}>Ver perfil</DropdownMenuItem>
          {hasFeature(user?.userInfo.profile.permissions, '1401') && (
            <DropdownMenuItem onClick={() => (data.isActive ? setOpen(true) : mutate())}>
              {data.isActive ? 'Desativar' : 'Ativar'}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
