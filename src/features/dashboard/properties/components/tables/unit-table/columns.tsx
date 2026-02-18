import { ColumnDef } from '@tanstack/react-table';

import { normalizeCnpjNumber } from '@/shared/lib/masks';
import { UnitDetail } from '@/shared/types';

import { CellAction } from '@/features/dashboard/properties/components/tables/unit-table/cell-action';

export const columns: ColumnDef<UnitDetail>[] = [
  {
    accessorKey: 'uuid',
    header: 'ID',
  },
  {
    accessorKey: 'socialReason',
    header: 'RAZÃO SOCIAL',
  },
  {
    accessorKey: 'federalDocument',
    header: 'CNPJ',
    cell: ({ row }) => normalizeCnpjNumber(row.original.federalDocument),
  },
  {
    accessorKey: 'stateRegistration',
    header: 'INSCRIÇÃO ESTADUAL',
  },
  {
    accessorKey: 'municipalRegistration',
    header: 'INSCRIÇÃO MUNICIPAL',
  },
  {
    accessorKey: 'website',
    header: 'SITE',
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
