'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';

import { formatValue, formatDate } from '@/shared/lib/utils';

import { getPayments } from '@/features/dashboard/payments/api/subscription';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';

export function Payments() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const { data = { hasMore: false, payments: [], totalCount: 0 }, isLoading } = useQuery({
    queryKey: ['payments', pagination],
    queryFn: () => getPayments(pagination),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faturas</CardTitle>
        <CardDescription>Acompanhe cobranças recentes</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Loading />
        ) : !data || data.payments.length === 0 ? (
          <TypographyMuted>Nenhuma fatura encontrada.</TypographyMuted>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.payments.map((payment) => (
                  <TableRow key={payment.paymentId}>
                    <TableCell className="font-medium">
                      {payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'}
                    </TableCell>
                    <TableCell>{payment.description || 'N/A'}</TableCell>
                    <TableCell className="text-right">{formatValue(payment.value)}</TableCell>
                    <TableCell className="text-right">
                      {payment.invoiceUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer">
                            Ver fatura
                            <ExternalLink className="size-3" />
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {data.hasMore && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPagination((prev) => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
                      className={pagination.pageIndex === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive>{pagination.pageIndex + 1}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
