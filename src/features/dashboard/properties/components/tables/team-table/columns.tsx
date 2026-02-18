import { ColumnDef } from '@tanstack/react-table';

import { TeamDetail } from '@/shared/types';
import { Badge } from '@/shared/components/ui/badge';

import { CellAction } from '@/features/dashboard/properties/components/tables/team-table/cell-action';

export const columns: ColumnDef<TeamDetail>[] = [
  {
    accessorKey: 'name',
    header: 'NOME',
  },
  {
    accessorKey: 'branch',
    header: 'FILIAL/UNIDADE',
  },
  {
    accessorKey: 'city',
    header: 'CIDADE',
    cell: ({ row }) => {
      const city = row.getValue('city') as string;
      const state = row.original.state;
      return city && state ? `${city} - ${state}` : city || '-';
    },
  },
  {
    accessorKey: 'neighborhood',
    header: 'BAIRRO',
  },
  {
    accessorKey: 'isActive',
    header: 'STATUS',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Ativo' : 'Inativo'}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
