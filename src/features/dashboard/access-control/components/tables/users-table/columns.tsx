'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { formatDate, formatLongDateHour, getUserNameInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { normalizePhoneNumber } from '@/shared/lib/masks';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';

import { toggleRoletao } from '@/features/dashboard/access-control/api/user';

import { CellAction } from '@/features/dashboard/access-control/components/tables/users-table/cell-action';
import { User } from '@/features/dashboard/access-control/types';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'USUÁRIO',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarFallback>{getUserNameInitials(row.original.name)}</AvatarFallback>
          </Avatar>

          <span>{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'E-MAIL',
  },
  {
    accessorKey: 'phone',
    header: 'TELEFONE',
    cell: ({ row }) => normalizePhoneNumber(row.original.phone),
  },
  {
    accessorKey: 'role',
    header: 'PERFIL',
    cell: ({ row }) => <Badge className="text-white">{row.original.profileName}</Badge>,
  },
  {
    accessorKey: 'active',
    header: 'STATUS',
    cell: ({ row }) => {
      if (row.original.isActive) return <Badge className="bg-green-500 text-green-200">Ativo</Badge>;
      return <Badge className="bg-red-500 text-red-200">Inativo</Badge>;
    },
  },
  {
    accessorKey: 'createdOn',
    header: 'CRIADO EM',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: 'roletao',
    header: 'ROLETÃO',
    cell: function RoletaoCell({ row }) {
      const queryClient = useQueryClient();

      const { mutate, isPending } = useMutation({
        mutationFn: (checked: boolean) => toggleRoletao(String(row.original.uuid), checked),
        onSuccess: () => {
          toast.success('Status do roletão atualizado com sucesso!');
          queryClient.invalidateQueries({ queryKey: ['users'] });
        },
      });

      return <Switch checked={row.original.rouletteSigned} onCheckedChange={mutate} disabled={isPending} />;
    },
  },
  {
    accessorKey: 'lastAccessOn',
    header: 'ÚLTIMO ACESSO',
    cell: ({ row }) => formatLongDateHour(row.original.accessedAt),
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
