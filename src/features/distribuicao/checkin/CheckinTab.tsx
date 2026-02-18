import { useEffect, useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

import { CheckinEvent, checkinEvents } from '@/lib/mock/checkin';

const ITEMS_PER_PAGE = 10;

export default function CheckinTab() {
  const [data, setData] = useState<CheckinEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState('all');
  const [action, setAction] = useState('all');

  useEffect(() => {
    const t = setTimeout(() => {
      setData(checkinEvents);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const users = useMemo(() => Array.from(new Set(data.map((d) => d.user))), [
    data,
  ]);
  const actions = useMemo(
    () => Array.from(new Set(data.map((d) => d.action))),
    [data],
  );

  const filtered = useMemo(
    () =>
      data.filter(
        (d) =>
          (user === 'all' || d.user === user) &&
          (action === 'all' || d.action === action),
      ),
    [data, user, action],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageData = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select
          value={user}
          onValueChange={(v) => {
            setUser(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Usuário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos usuários</SelectItem>
            {users.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={action}
          onValueChange={(v) => {
            setAction(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas ações</SelectItem>
            {actions.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Contexto</TableHead>
              <TableHead>IP/Local</TableHead>
              <TableHead>Obs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : filtered.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Nenhum evento encontrado
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Contexto</TableHead>
                <TableHead>IP/Local</TableHead>
                <TableHead>Obs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    {new Date(d.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{d.user}</TableCell>
                  <TableCell>{d.action}</TableCell>
                  <TableCell>{d.context}</TableCell>
                  <TableCell>{d.ip}</TableCell>
                  <TableCell>{d.obs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
    </div>
  );
}
