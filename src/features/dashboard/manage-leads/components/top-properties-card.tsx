'use client';

import { useMemo, useState } from 'react';
import { Building2, Trophy, ChevronDown, ChevronUp } from 'lucide-react';

import { TopPropertiesItem } from '@/shared/types';
import { formatValue } from '@/shared/lib/utils';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { NoContentCard } from '@/shared/components/no-content-card';
import { Button } from '@/shared/components/ui/button';

const TROPHY_COLORS = ['text-yellow-500', 'text-gray-400', 'text-amber-700'] as const;

interface TopPropertiesCardProps {
  data: TopPropertiesItem[];
}

export function TopPropertiesCard({ data }: TopPropertiesCardProps) {
  const [showAll, setShowAll] = useState(false);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.leadsCount - a.leadsCount);
  }, [data]);

  const displayedData = showAll ? sortedData : sortedData.slice(0, 3);
  const hasMore = sortedData.length > 3;

  if (!data || data.length === 0) {
    return <NoContentCard title="Sem informações sobre imóveis com mais leads" icon={Building2} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imóveis com mais leads</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Imóvel</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span>Leads</span>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span>Visitas</span>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span>Propostas</span>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span>Vendas</span>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span>Ticket Médio</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.map((item, index) => (
              <TableRow key={item.propertyCode}>
                <TableCell className="w-10 text-center">
                  {index < 3 && <Trophy className={`size-5 mx-auto ${TROPHY_COLORS[index]}`} />}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium truncate max-w-[200px]" title={item.propertyName}>
                      {item.propertyName}
                    </span>
                    <span className="text-xs text-muted-foreground">Cód: {item.propertyCode}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{item.leadsCount}</TableCell>
                <TableCell className="text-center">{item.scheduledVisits}</TableCell>
                <TableCell className="text-center">{item.proposalsSent}</TableCell>
                <TableCell className="text-center">{item.salesMade}</TableCell>
                <TableCell className="text-center">{formatValue(item.averageTicket)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {hasMore && (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => setShowAll((prev) => !prev)} className="gap-1">
              {showAll ? (
                <>
                  Ver menos
                  <ChevronUp className="size-4" />
                </>
              ) : (
                <>
                  Ver todos ({sortedData.length})
                  <ChevronDown className="size-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
