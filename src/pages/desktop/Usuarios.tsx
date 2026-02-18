import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Pill from '@/components/ui/pill';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SafeImage } from '@/components/ui/SafeImage';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus,
  MoreHorizontal,
  Download,
  TrendingUp,
  Users as UsersIcon,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useUsers } from '@/hooks/users/useUsers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RequirePermission } from '@/data/accessControl/guards';
import UsuariosFilterSheet, { UsuariosFilters } from '@/components/users/UsuariosFilterSheet';
import { AddUserButton } from '@/features/usuarios/components/AddUserButton';
import { useToast } from '@/hooks/use-toast';
import {
  bulkExportUsers,
  bulkUpdateRole,
  bulkResetPassword,
} from '@/services/users';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DesktopUsuarios = () => {
  const {
    items: users,
    loading,
    error,
    bulkUpdateStatus,
    bulkLink,
    setFilters,
    page,
    pageSize,
    setPage,
    setPageSize,
    load,
    setQuery,
    toggleRoletao,
  } = useUsers();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultFilters: UsuariosFilters = {
    role: [],
    status: [],
    empresa: [],
    cidade: [],
    state: [],
    period: '7',
    from: null,
    to: null,
    order: undefined,
  };
  const [q, setQ] = useState(() => searchParams.get('q') || '');
  const [filters, setLocalFilters] = useState<UsuariosFilters>(() => ({
    ...defaultFilters,
    role: searchParams.getAll('role'),
    status: searchParams.getAll('status'),
    empresa: searchParams.getAll('empresa'),
    cidade: searchParams.getAll('cidade'),
    state: searchParams.getAll('state'),
    period: searchParams.get('period') || '7',
    from: searchParams.get('from') ? new Date(searchParams.get('from')!) : null,
    to: searchParams.get('to') ? new Date(searchParams.get('to')!) : null,
    order: searchParams.get('order') || undefined,
  }));
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [roleTab, setRoleTab] = useState('todos');
  const { toast } = useToast();

  const [sort, setSort] = useState<{ column: 'name' | 'role' | 'status' | 'time'; direction: 'asc' | 'desc' }>({
    column: 'name',
    direction: 'asc',
  });

  const buildFilterParams = (f: UsuariosFilters) => {
    const params: Record<string, any> = {};
    if (f.role.length) params.role = f.role.join(',');
    if (f.status.length) params.status = f.status.join(',');
    if (f.empresa.length) params.imobiliariaId = f.empresa[0];
    if (f.cidade.length) params.city = f.cidade[0];
    if (f.state.length) params.state = f.state[0];
    if (f.period) params.period = f.period;
    if (f.period === 'custom') {
      if (f.from) params.from = f.from.toISOString().slice(0, 10);
      if (f.to) params.to = f.to.toISOString().slice(0, 10);
    }
    if (f.order) params.order = f.order;
    return params;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (q) params.set('query', q);
      const order = filters.order ?? `${sort.column}:${sort.direction}`;
      const built = buildFilterParams({ ...filters, order });
      Object.entries(built).forEach(([k, v]) => params.set(k, String(v)));
      setSearchParams(params);
      setQuery(q);
      setFilters({ ...built, order });
    }, 250);
    return () => clearTimeout(timer);
  }, [q, filters, sort, setFilters, setSearchParams, setQuery]);

  useEffect(() => {
    setSelectedUsers([]);
  }, [q, filters]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSort = (column: 'name' | 'role' | 'status' | 'time') => {
    const newSort =
      sort.column === column
        ? { column, direction: sort.direction === 'asc' ? 'desc' as const : 'asc' as const }
        : { column, direction: 'asc' as const };
    setSort(newSort);
    const newOrder = `${newSort.column}:${newSort.direction}`;
    setLocalFilters(prev => ({ ...prev, order: newOrder }));
    setFilters({ ...buildFilterParams({ ...filters, order: newOrder }), order: newOrder });
  };

  const renderSortIcon = (column: 'name' | 'role' | 'status' | 'time') => {
    if (sort.column !== column) {
      return <ArrowUpDown className="ml-1 h-3 w-3" />;
    }
    return sort.direction === 'asc' ? (
      <ChevronUp className="ml-1 h-3 w-3" />
    ) : (
      <ChevronDown className="ml-1 h-3 w-3" />
    );
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/usuarios/${userId}`);
  };

  const handleBulkActivate = async (active: boolean) => {
    await bulkUpdateStatus(selectedUsers, active);
    toast({ title: active ? 'Usuários ativados' : 'Usuários desativados' });
    setSelectedUsers([]);
  };

  const handleBulkLink = async () => {
    await bulkLink(selectedUsers, '1');
    toast({ title: 'Imobiliária vinculada' });
    setSelectedUsers([]);
  };

  const handleBulkUpdateRole = async () => {
    const role = window.prompt('Novo papel');
    if (!role) return;
    if (!window.confirm(`Alterar papel para ${role}?`)) return;
    try {
      await bulkUpdateRole(selectedUsers, role);
      toast({ title: 'Papel atualizado' });
      await load();
    } catch {
      toast({ title: 'Erro ao alterar papel', variant: 'destructive' });
    } finally {
      setSelectedUsers([]);
    }
  };

  const handleBulkResetPassword = async () => {
    if (!window.confirm('Resetar senha dos usuários selecionados?')) return;
    try {
      await bulkResetPassword(selectedUsers);
      toast({ title: 'Senhas resetadas' });
    } catch {
      toast({ title: 'Erro ao resetar senhas', variant: 'destructive' });
    } finally {
      setSelectedUsers([]);
    }
  };

  const handleBulkExport = async () => {
    try {
      const ids = selectedUsers.length > 0 ? selectedUsers : users.map(u => u.id);
      const blob = await bulkExportUsers(ids);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'CSV exportado' });
    } catch {
      toast({ title: 'Erro ao exportar CSV' });
    } finally {
      setSelectedUsers([]);
    }
  };

  const handlePageChange = (p: number) => {
    setPage(p);
  };

  const handlePageSizeChange = (s: number) => {
    setPageSize(s);
  };

  const activeFilterCount =
    (filters.role.length ? 1 : 0) +
    (filters.status.length ? 1 : 0) +
    (filters.empresa.length ? 1 : 0) +
    (filters.cidade.length ? 1 : 0) +
    (filters.state.length ? 1 : 0) +
    (filters.period && filters.period !== '7' ? 1 : 0) +
    (filters.from ? 1 : 0) +
    (filters.to ? 1 : 0) +
    (filters.order ? 1 : 0);

  const statsCards = [
    {
      title: 'Total de Usuários',
      value: users.length,
      icon: UsersIcon,
      description: 'últimos 30 dias',
    },
    {
      title: 'Usuários Ativos',
      value: users.filter(u => u.active).length,
      icon: TrendingUp,
      description: 'últimos 30 dias',
    },
    {
      title: 'Novos Usuários',
      value: users.filter((u) => u.active).length - 2 > 0 ? users.filter((u) => u.active).length - 2 : 0,
      icon: Plus,
      description: 'últimos 30 dias',
    }
  ];

  if (loading && users.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-4 text-center">
        <p className="text-gray-600">Falha ao carregar usuários.</p>
        <Button onClick={() => load()}>Tentar novamente</Button>
      </div>
    );
  }

  if (!loading && users.length === 0) {
    return (
      <div className="p-6 space-y-4 text-center">
        <p className="text-gray-600">Nenhum usuário encontrado.</p>
        <p className="text-sm text-gray-500">Ajuste os filtros para ver resultados.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-[1480px] mx-auto">
      <div>
        <h1 className="text-4xl font-semibold text-gray-900">Usuários</h1>
        <p className="text-[30px] leading-10 text-gray-500 mt-1">Gerencie os usuários internos da sua imobiliária, como corretores e membros da equipe</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="rounded-[30px] border border-gray-200 shadow-sm">
            <CardContent className="p-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-medium text-gray-900 mb-2">{stat.title}</p>
                  <p className="text-4xl text-gray-500">{stat.description}</p>
                  <p className="text-6xl font-bold text-gray-900 mt-6">{stat.value}</p>
                </div>
                <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <stat.icon className="h-7 w-7 text-[hsl(var(--accent))]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#ebebeb] border-0 rounded-[28px] shadow-none">
        <CardContent className="p-2">
          <Tabs
            value={roleTab}
            onValueChange={(value) => {
              setRoleTab(value);
              setLocalFilters((prev) => ({
                ...prev,
                role: value === 'todos' ? [] : [value],
              }));
              setFilters({ role: value === 'todos' ? undefined : value });
            }}
          >
            <TabsList className="w-full h-14 bg-transparent rounded-[20px] grid grid-cols-3 p-0">
              <TabsTrigger value="todos" className="h-full text-xl data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-[18px]">
                Usuários
              </TabsTrigger>
              <TabsTrigger value="gestor" className="h-full text-xl rounded-[18px]">
                Equipes
              </TabsTrigger>
              <TabsTrigger value="admin" className="h-full text-xl rounded-[18px]">
                Unidades
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 h-7 w-7" />
          <input
            type="text"
            aria-label="Buscar usuários"
            placeholder="Pesquisar..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full h-16 rounded-3xl border border-gray-200 bg-white pl-16 pr-5 text-2xl placeholder:text-gray-400"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpenFilter(true)}
          className="h-16 rounded-3xl px-5 border-gray-200"
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal className="h-5 w-5" />
          {activeFilterCount > 0 && <span className="text-sm">{activeFilterCount}</span>}
        </Button>
        <RequirePermission perm="users.create">
          <AddUserButton />
        </RequirePermission>
      </div>

      {selectedUsers.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 border rounded-md p-4">
          <span className="text-sm text-gray-600">
            {selectedUsers.length} selecionado(s)
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => handleBulkActivate(true)}>
              Ativar
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleBulkActivate(false)}>
              Desativar
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkUpdateRole}>
              Alterar papel
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkResetPassword}>
              Resetar senha
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkLink}>
              Vincular imobiliária
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <Card className="border border-gray-200 rounded-[26px] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] border-b-0">
                <RequirePermission perm="users.edit">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                </RequirePermission>
                <TableHead
                  className="font-medium text-white cursor-pointer uppercase text-sm tracking-wide"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Usuário {renderSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead className="font-medium text-white uppercase text-sm tracking-wide">E-mail</TableHead>
                <TableHead className="font-medium text-white uppercase text-sm tracking-wide">Telefone</TableHead>
                <TableHead
                  className="font-medium text-white cursor-pointer uppercase text-sm tracking-wide"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center">
                    Perfil {renderSortIcon('role')}
                  </div>
                </TableHead>
                <TableHead
                  className="font-medium text-white cursor-pointer uppercase text-sm tracking-wide"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status {renderSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead
                  className="font-medium text-white cursor-pointer uppercase text-sm tracking-wide"
                  onClick={() => handleSort('time')}
                >
                  <div className="flex items-center">
                    Criado em {renderSortIcon('time')}
                  </div>
                </TableHead>
                <TableHead className="font-medium text-white uppercase text-sm tracking-wide">Roletão</TableHead>
                <TableHead className="font-medium text-white uppercase text-sm tracking-wide">Último acesso</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="border-gray-50 hover:bg-gray-25 cursor-pointer"
                  onClick={() => handleViewProfile(user.id)}
                >
                  <RequirePermission perm="users.edit">
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                      />
                    </TableCell>
                  </RequirePermission>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <SafeImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accentHover))] text-white">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell className="text-gray-600">{user.phone || '11999990001'}</TableCell>
                  <TableCell>
                    <Pill variant={user.role === 'admin' ? 'danger' : user.role === 'gestor' ? 'default' : 'primary'}>
                      {user.role || 'corretor'}
                    </Pill>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Pill variant={user.active ? 'success' : 'danger'}>
                        {user.active ? 'Ativo' : 'Inativo'}
                      </Pill>
                      <RequirePermission perm="users.edit">
                        <Switch
                          checked={user.active}
                          onCheckedChange={async (checked) => {
                            await bulkUpdateStatus([user.id], checked);
                            toast({ title: checked ? 'Usuário ativado' : 'Usuário desativado' });
                          }}
                        />
                      </RequirePermission>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.timeOnPlatform ? `${user.timeOnPlatform}` : Math.floor(Math.random() * 365) + 1}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Pill variant={user.roletaoEnabled ? 'success' : 'default'}>
                        {user.roletaoEnabled ? 'Sim' : 'Não'}
                      </Pill>
                      <RequirePermission perm="users.edit">
                        <Switch
                          checked={user.roletaoEnabled ?? false}
                          onCheckedChange={async (checked) => {
                            await toggleRoletao(user.id, checked);
                            toast({ title: checked ? 'Roletão ativado' : 'Roletão desativado' });
                          }}
                        />
                      </RequirePermission>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">Há 2 horas</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          aria-label={`Abrir menu de ações para ${user.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(user.id)}>
                          Ver perfil
                        </DropdownMenuItem>
                        <RequirePermission perm="users.edit">
                          <>
                            <DropdownMenuItem>
                              {user.active ? 'Desativar' : 'Ativar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Resetar senha
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Vincular imobiliária
                            </DropdownMenuItem>
                          </>
                        </RequirePermission>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      </Card>

      <div className="flex items-center justify-between py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, page - 1))}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{page}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => handlePageSizeChange(Number(v))}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Itens" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <UsuariosFilterSheet
        open={openFilter}
        onOpenChange={setOpenFilter}
        value={filters}
        onApply={(vals) => {
          setLocalFilters(vals);
          setQuery(q);
          setFilters({ ...buildFilterParams(vals) });
          setOpenFilter(false);
        }}
        onClear={() => {
          setLocalFilters(defaultFilters);
          setQuery(q);
          setFilters({});
          setOpenFilter(false);
        }}
      />
    </div>
  );
};

export default DesktopUsuarios;
