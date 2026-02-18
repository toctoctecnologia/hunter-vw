import { ColumnDef } from '@tanstack/react-table';
import { Building2, User2 } from 'lucide-react';

import { Client } from '@/shared/types';

import { CellAction } from '@/features/sadm-dashboard/access-control/components/tables/clients-table/cell-action';
import { normalizePhoneNumber } from '@/shared/lib/masks';

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'fullName',
    header: 'NOME',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary">
            {row.original.accountType === 'PF' ? <User2 className="size-3" /> : <Building2 className="size-3" />}
          </div>
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
    cell: ({ row }) => {
      return <span>{normalizePhoneNumber(row.original.phone)}</span>;
    },
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
