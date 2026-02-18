import { ColumnDef } from '@tanstack/react-table';

import { propertyStatusLabels, propertyTypeLabels } from '@/shared/lib/property-status';
import { PropertyReportData } from '@/shared/types';

export const columns: ColumnDef<PropertyReportData>[] = [
  {
    accessorKey: 'code',
    header: 'CÓDIGO',
  },
  {
    accessorKey: 'name',
    header: 'NOME',
  },
  {
    accessorKey: 'propertyType',
    header: 'TIPO DE IMÓVEL',
    cell: ({ row }) => <span>{propertyTypeLabels[row.original.propertyType]}</span>,
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => <span>{propertyStatusLabels[row.original.status]}</span>,
  },
  {
    accessorKey: 'interested',
    header: 'INTERESSADOS',
  },
  {
    accessorKey: 'scheduledVisits',
    header: 'VISITAS AGENDADAS',
  },
  {
    accessorKey: 'completedVisits',
    header: 'VISITAS CONCLUÍDAS',
  },
  {
    accessorKey: 'proposals',
    header: 'PROPOSTAS',
  },
  {
    accessorKey: 'deals',
    header: 'NEGÓCIOS',
  },
  {
    accessorKey: 'interestedLeads',
    header: 'LEADS INTERESSADOS',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.interestedLeads.map((lead) => (
          <div key={lead.uuid} className="text-sm">
            {lead.name} - {lead.phone1}
            {lead.phone2 ? ` / ${lead.phone2}` : ''}
          </div>
        ))}
      </div>
    ),
  },
];
