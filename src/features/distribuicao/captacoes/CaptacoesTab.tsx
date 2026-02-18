import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  CaptacaoFonte,
  captacoesMock,
} from '@/lib/mock/captacoes';

const ITEMS_PER_PAGE = 6;

export default function CaptacoesTab() {
  const [data, setData] = useState<CaptacaoFonte[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selected, setSelected] = useState<CaptacaoFonte | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setData(captacoesMock);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.fonte
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        status === 'all' || (status === 'active' ? item.active : !item.active);
      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageData = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleStatusChange = (id: number, active: boolean) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active } : item)),
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Buscar fonte..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:w-64"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as 'all' | 'active' | 'inactive');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-5 w-1/2 mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Nenhuma fonte encontrada
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageData.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">
                    {item.fonte}
                  </CardTitle>
                  <Switch
                    checked={item.active}
                    onCheckedChange={(checked) =>
                      handleStatusChange(item.id, checked)
                    }
                  />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm flex justify-between">
                    <span>Leads 7d/30d</span>
                    <span>
                      {item.leads7d}/{item.leads30d}
                    </span>
                  </div>
                  <div className="text-sm flex justify-between">
                    <span>Conversão</span>
                    <span>{item.conversion.toFixed(1)}%</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setSelected(item)}
                  >
                    Ver detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={
                        page <= 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink className="cursor-default">
                      Página {page} de {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      className={
                        page >= totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.fonte}</DialogTitle>
          </DialogHeader>
          <div className="h-64">
            {selected && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selected.series}>
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
