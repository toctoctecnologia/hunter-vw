import { useMemo } from 'react';

import { SixWeekSalesFunnelItem } from '@/shared/types';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface FunnelByWeekCardProps {
  data: SixWeekSalesFunnelItem[];
}

const TOTAL_WEEKS = 6;

const createEmptyWeek = (weekNumber: number): SixWeekSalesFunnelItem => ({
  weekNumber,
  attendances: 0,
  visits: 0,
  proposals: 0,
  deals: 0,
  discards: 0,
});

export function FunnelByWeekCard({ data }: FunnelByWeekCardProps) {
  const headers = ['Atendimentos', 'Visitas', 'Propostas', 'Negócios', 'Descartes'];
  const normalizedData = useMemo(() => {
    const dataMap = new Map(data.map((item) => [item.weekNumber, item]));

    return Array.from({ length: TOTAL_WEEKS }, (_, index) => {
      const weekNumber = index + 1;
      return dataMap.get(weekNumber) ?? createEmptyWeek(weekNumber);
    });
  }, [data]);

  const totals = normalizedData.reduce(
    (acc, item) => ({
      attendances: acc.attendances + item.attendances,
      visits: acc.visits + item.visits,
      proposals: acc.proposals + item.proposals,
      deals: acc.deals + item.deals,
      discards: acc.discards + item.discards,
    }),
    { attendances: 0, visits: 0, proposals: 0, deals: 0, discards: 0 },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Semana</TableHead>
                {headers.map((header) => (
                  <TableHead key={header} className="font-semibold text-center">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {normalizedData.map((item) => (
                <TableRow key={item.weekNumber}>
                  <TableCell className="font-medium">Semana {item.weekNumber}</TableCell>
                  <TableCell className="text-center">{item.attendances}</TableCell>
                  <TableCell className="text-center">{item.visits}</TableCell>
                  <TableCell className="text-center">{item.proposals}</TableCell>
                  <TableCell className="text-center">{item.deals}</TableCell>
                  <TableCell className="text-center">{item.discards}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-center font-bold">{totals.attendances}</TableCell>
                <TableCell className="text-center font-bold">{totals.visits}</TableCell>
                <TableCell className="text-center font-bold">{totals.proposals}</TableCell>
                <TableCell className="text-center font-bold">{totals.deals}</TableCell>
                <TableCell className="text-center font-bold">{totals.discards}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
