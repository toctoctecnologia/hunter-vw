import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import DesktopUsuarios from '@/pages/desktop/Usuarios';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import Pill from '@/components/ui/pill';
import { Switch } from '@/components/ui/switch';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SafeImage } from '@/components/ui/SafeImage';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  EllipsisVertical,
  Search,
  Filter,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { getCurrentUser, hasPermission } from '@/data/accessControl';
import { RequirePermission } from '@/data/accessControl/guards';
import useUsers from '@/hooks/users/useUsers';
import { AddUserButton } from '@/features/usuarios/components/AddUserButton';
import {
  type User,
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

interface SimpleLinkProps {
  href: string;
  children: React.ReactNode;
}

const Link = ({ href, children }: SimpleLinkProps) => (
  <RouterLink to={href}>{children}</RouterLink>
);

const MIN_APP_VERSION = '1.2.0';

const isOutdated = (version?: string) => {
  if (!version) return false;
  const parts = version.split('.').map(Number);
  const min = MIN_APP_VERSION.split('.').map(Number);
  for (let i = 0; i < Math.max(parts.length, min.length); i++) {
    const a = parts[i] || 0;
    const b = min[i] || 0;
    if (a < b) return true;
    if (a > b) return false;
  }
  return false;
};

const UsuariosPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const currentUser = getCurrentUser();
  const canManageUsers = hasPermission(currentUser, 'users.edit');
  const client = { name: 'Cliente Exemplo', active: true };

  const {
    items: users,
    load,
    loading,
    source,
    toggleStatus,
    bulkUpdateStatus,
    bulkLink,
    setFilters,
    page,
    pageSize,
    setPage,
    setPageSize,
    query,
    setQuery,
    toggleRoletao,
  } = useUsers();
  const [selected, setSelected] = useState<string[]>([]);
  const [toggleUser, setToggleUser] = useState<User | null>(null);
  const [linkUser, setLinkUser] = useState<User | null>(null);
  const [sort, setSort] = useState<{ column: 'name' | 'role' | 'status' | 'time'; direction: 'asc' | 'desc' }>({
    column: 'name',
    direction: 'asc',
  });
  const defaultFilters = {
    role: '',
    status: '',
    imobiliariaId: '',
    city: '',
    state: '',
    period: '7',
    from: null as Date | null,
    to: null as Date | null,
  };
  const [filters, setLocalFilters] = useState(defaultFilters);
  const [tempFilters, setTempFilters] = useState(defaultFilters);
  const [openFilters, setOpenFilters] = useState(false);
  const [roleTab, setRoleTab] = useState('todos');
  const visibleUsers =
    canManageUsers || !currentUser
      ? users
      : users.filter((u) => u.id === String(currentUser.id));

  const sortedUsers = React.useMemo(() => {
    const arr = [...visibleUsers];
    const dir = sort.direction === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      switch (sort.column) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'role':
          return (a.role || '').localeCompare(b.role || '') * dir;
        case 'status':
          return (Number(a.active) - Number(b.active)) * dir;
        case 'time':
          return ((a.timeOnPlatform ?? 0) - (b.timeOnPlatform ?? 0)) * dir;
        default:
          return 0;
      }
    });
    return arr;
  }, [visibleUsers, sort]);

  const handleSort = (column: 'name' | 'role' | 'status' | 'time') => {
    const newSort =
      sort.column === column
        ? { column, direction: sort.direction === 'asc' ? 'desc' as const : 'asc' as const }
        : { column, direction: 'asc' as const };
    setSort(newSort);
    setFilters({
      ...buildFilterParams(filters),
      order: `${newSort.column}:${newSort.direction}`,
    });
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

  const buildFilterParams = (f: typeof filters) => {
    const params: Record<string, any> = {};
    if (f.role) params.role = f.role;
    if (f.status) params.status = f.status;
    if (f.imobiliariaId) params.imobiliariaId = f.imobiliariaId;
    if (f.city) params.city = f.city;
    if (f.state) params.state = f.state;
    if (f.period) params.period = f.period;
    if (f.period === 'custom') {
      if (f.from) params.from = f.from.toISOString().slice(0, 10);
      if (f.to) params.to = f.to.toISOString().slice(0, 10);
    }
    return params;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
  };

  const handleApplyFilters = () => {
    setLocalFilters(tempFilters);
    setFilters({
      ...buildFilterParams(tempFilters),
      order: `${sort.column}:${sort.direction}`,
    });
    setOpenFilters(false);
  };

  const handleClearFilters = () => {
    setTempFilters(defaultFilters);
    setLocalFilters(defaultFilters);
    setFilters({ order: `${sort.column}:${sort.direction}` });
    setOpenFilters(false);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
  };

  const handlePageSizeChange = (s: number) => {
    setPageSize(s);
  };

  useEffect(() => {
    load();
  }, [load]);

  // Return desktop version for non-mobile
  if (!isMobile) {
    return <DesktopUsuarios />;
  }

  if (loading && users.length === 0) {
    return (
      <ResponsiveLayout activeTab="usuarios" setActiveTab={() => {}}>
        <div className="p-4 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (!loading && users.length === 0) {
    return (
      <ResponsiveLayout activeTab="usuarios" setActiveTab={() => {}}>
        <div className="p-4 space-y-2 text-center">
          <p className="text-gray-600">Nenhum usuário encontrado.</p>
          <p className="text-sm text-gray-500">Tente ajustar os filtros.</p>
        </div>
      </ResponsiveLayout>
    );
  }

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'servicos':
        navigate('/servicos');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'usuarios':
        navigate('/usuarios');
        break;
      default:
        break;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(visibleUsers.map((u) => u.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );
  };

  const handleSwitch = async (id: string, active: boolean) => {
    await toggleStatus(id, active);
    toast({
      title: active ? 'Usuário ativado' : 'Usuário desativado',
    });
  };

  const confirmToggle = async () => {
    if (!toggleUser) return;
    await handleSwitch(toggleUser.id, !toggleUser.active);
    setToggleUser(null);
  };

  const confirmLink = async () => {
    if (!linkUser) return;
    await bulkLink([linkUser.id], '1');
    toast({
      title: 'Imobiliária vinculada',
      description: linkUser.name,
    });
    setLinkUser(null);
  };

  const handleBulkActivate = async (active: boolean) => {
    await bulkUpdateStatus(selected, active);
    toast({
      title: active ? 'Usuários ativados' : 'Usuários desativados',
    });
    setSelected([]);
  };

  const handleBulkLink = async () => {
    await bulkLink(selected, '1');
    toast({
      title: 'Imobiliária vinculada para selecionados',
    });
    setSelected([]);
  };

  const handleBulkUpdateRole = async () => {
    const role = window.prompt('Novo papel');
    if (!role) return;
    if (!window.confirm(`Alterar papel para ${role}?`)) return;
    try {
      await bulkUpdateRole(selected, role);
      toast({ title: 'Papel atualizado' });
      await load();
    } catch {
      toast({ title: 'Erro ao alterar papel', variant: 'destructive' });
    } finally {
      setSelected([]);
    }
  };

  const handleBulkResetPassword = async () => {
    if (!window.confirm('Resetar senha dos usuários selecionados?')) return;
    try {
      await bulkResetPassword(selected);
      toast({ title: 'Senhas resetadas' });
    } catch {
      toast({ title: 'Erro ao resetar senhas', variant: 'destructive' });
    } finally {
      setSelected([]);
    }
  };

  const handleBulkExport = () => {
    toast({ title: 'CSV exportado' });
    setSelected([]);
  };

  return (
    <ResponsiveLayout
      activeTab="usuarios"
      setActiveTab={handleTabChange}
      onAddClick={hasPermission(currentUser, 'users.create') ? () => {} : undefined}
    >
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold flex items-center">
          Usuários
          {source === 'mock-fallback' && (
            <Pill
              variant="primary"
              className="ml-2"
              title="Serviço indisponível, exibindo dados de demonstração"
            >
              Demo
            </Pill>
          )}
        </h1>

        {/* PageHeader with SearchInput and FilterButton */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={handleSearch}
              placeholder="Buscar"
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setTempFilters(filters);
              setOpenFilters(true);
            }}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <RequirePermission perm="users.create">
            <AddUserButton />
          </RequirePermission>
        </div>
        <Tabs
          value={roleTab}
          onValueChange={(value) => {
            setRoleTab(value);
            setLocalFilters((prev) => ({
              ...prev,
              role: value === 'todos' ? '' : value,
            }));
            setFilters({ role: value === 'todos' ? undefined : value });
          }}
        >
          <TabsList className="mt-4 w-full overflow-x-auto">
            <TabsTrigger value="todos" className="flex-shrink-0">
              todos
            </TabsTrigger>
            <TabsTrigger value="corretor" className="flex-shrink-0">
              corretor
            </TabsTrigger>
            <TabsTrigger value="backoffice" className="flex-shrink-0">
              backoffice
            </TabsTrigger>
            <TabsTrigger value="gestor" className="flex-shrink-0">
              gestor
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex-shrink-0">
              admin
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters RightSheet */}
        <Sheet open={openFilters} onOpenChange={setOpenFilters}>
          <SheetContent side="right" className="flex flex-col">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-auto pr-2">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-2">Papel</p>
                  <Select
                    value={tempFilters.role}
                    onValueChange={(v) =>
                      setTempFilters((prev) => ({ ...prev, role: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corretor">Corretor</SelectItem>
                      <SelectItem value="gestor">Gestor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Status</p>
                  <Select
                    value={tempFilters.status}
                    onValueChange={(v) =>
                      setTempFilters((prev) => ({ ...prev, status: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Imobiliária</p>
                  <Select
                    value={tempFilters.imobiliariaId}
                    onValueChange={(v) =>
                      setTempFilters((prev) => ({ ...prev, imobiliariaId: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Imobiliária A</SelectItem>
                      <SelectItem value="b">Imobiliária B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Cidade</p>
                    <Select
                      value={tempFilters.city}
                      onValueChange={(v) =>
                        setTempFilters((prev) => ({ ...prev, city: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sao-paulo">São Paulo</SelectItem>
                        <SelectItem value="rio-de-janeiro">
                          Rio de Janeiro
                        </SelectItem>
                        <SelectItem value="belo-horizonte">
                          Belo Horizonte
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">UF</p>
                    <Select
                      value={tempFilters.state}
                      onValueChange={(v) =>
                        setTempFilters((prev) => ({ ...prev, state: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">SP</SelectItem>
                        <SelectItem value="RJ">RJ</SelectItem>
                        <SelectItem value="MG">MG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Período</p>
                  <RadioGroup
                    value={tempFilters.period}
                    onValueChange={(v) =>
                      setTempFilters((prev) => ({ ...prev, period: v }))
                    }
                    className="space-y-2"
                  >
                    {['7', '15', '30', '90', 'custom'].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`period-${opt}`} />
                        <Label htmlFor={`period-${opt}`} className="text-sm">
                          {opt === 'custom' ? 'Custom' : `${opt} dias`}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {tempFilters.period === 'custom' && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <DatePickerInput
                        value={tempFilters.from}
                        onChange={(date) =>
                          setTempFilters((prev) => ({ ...prev, from: date }))
                        }
                      />
                      <DatePickerInput
                        value={tempFilters.to}
                        onChange={(date) =>
                          setTempFilters((prev) => ({ ...prev, to: date }))
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <SheetFooter className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClearFilters}
              >
                Limpar
              </Button>
              <Button
                className="flex-1 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white"
                onClick={handleApplyFilters}
              >
                Aplicar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">{client.name}</span>
            <Pill variant={client.active ? 'success' : 'danger'}>
              {client.active ? 'Ativo' : 'Inativo'}
            </Pill>
            <Switch
              checked={client.active}
              disabled
              aria-label="Ativar ou desativar cliente"
            />
          </div>
          <RequirePermission perm="users.edit">
            <Button variant="danger">Desativar cliente</Button>
          </RequirePermission>
        </Card>

        {/* Bulk actions */}
        <RequirePermission perm="users.edit">
          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => handleBulkActivate(true)}>
                Ativar
              </Button>
              <Button variant="secondary" onClick={() => handleBulkActivate(false)}>
                Desativar
              </Button>
              <Button variant="outline" onClick={handleBulkUpdateRole}>
                Alterar papel
              </Button>
              <Button variant="outline" onClick={handleBulkResetPassword}>
                Resetar senha
              </Button>
              <Button variant="outline" onClick={handleBulkLink}>
                Vincular Imobiliária
              </Button>
              <RequirePermission perm="reports.export">
                <Button variant="outline" onClick={handleBulkExport}>
                  Exportar CSV
                </Button>
              </RequirePermission>
            </div>
          )}
        </RequirePermission>

        <h2 className="text-lg font-bold">Lista de corretores</h2>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
              <RequirePermission perm="users.edit">
                <TableHead>
                  <Checkbox
                    checked={selected.length === visibleUsers.length}
                    onCheckedChange={(v) => handleSelectAll(Boolean(v))}
                  />
                </TableHead>
              </RequirePermission>
              <TableHead>ID</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">Nome {renderSortIcon('name')}</div>
              </TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center">Papel {renderSortIcon('role')}</div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">Status {renderSortIcon('status')}</div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('time')}
              >
                <div className="flex items-center">
                  Tempo {renderSortIcon('time')}
                </div>
              </TableHead>
              <TableHead>Roletão</TableHead>
              <TableHead>Serviços</TableHead>
              <TableHead>NPS</TableHead>
              {(canManageUsers || hasPermission(currentUser, 'reports.export')) && (
                <TableHead>Ações</TableHead>
              )}
            </TableRow>
            </TableHeader>
            <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id}>
                <RequirePermission perm="users.edit">
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(user.id)}
                      onCheckedChange={(v) =>
                        handleSelect(user.id, Boolean(v))
                      }
                    />
                  </TableCell>
                </RequirePermission>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <SafeImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell className={isOutdated(user.appVersion) ? 'text-red-600' : 'text-gray-600'}>
                  {user.appVersion ? `v${user.appVersion}` : '-'}
                </TableCell>
                <TableCell>{user.role || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Pill variant={user.active ? 'success' : 'danger'}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </Pill>
                    <RequirePermission perm="users.edit">
                      <Switch
                        checked={user.active}
                        onCheckedChange={() => setToggleUser(user)}
                        aria-label={`Ativar ou desativar ${user.name}`}
                      />
                    </RequirePermission>
                  </div>
                </TableCell>
                <TableCell>{user.timeOnPlatform ?? '-'}</TableCell>
                <TableCell>
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
                        aria-label={`Ativar Roletão para ${user.name}`}
                      />
                    </RequirePermission>
                  </div>
                </TableCell>
                <TableCell>{user.services ?? 0}</TableCell>
                <TableCell>{user.nps ?? '-'}</TableCell>
                <RequirePermission perm="users.edit">
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Abrir menu de ações para ${user.name}`}
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/usuarios/${user.id}?tab=perfil`}>
                            Ver perfil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setToggleUser(user)}>
                          {user.active ? 'Desativar' : 'Ativar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: 'Senha resetada' })}>
                          Resetar senha
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLinkUser(user)}>
                          Vincular imobiliária
                        </DropdownMenuItem>
                        <RequirePermission perm="reports.export">
                          <DropdownMenuItem onClick={() => toast({ title: 'CSV exportado' })}>
                            Exportar CSV
                          </DropdownMenuItem>
                        </RequirePermission>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </RequirePermission>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-2 md:hidden">
          {sortedUsers.map((user) => (
            <Card key={user.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <SafeImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className={isOutdated(user.appVersion) ? 'text-xs text-red-600' : 'text-xs text-gray-500'}>
                    {user.appVersion ? `v${user.appVersion}` : '-'}
                  </p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-400">Roletão:</span>
                    <Pill variant={user.roletaoEnabled ? 'success' : 'default'} className="text-xs">
                      {user.roletaoEnabled ? 'Sim' : 'Não'}
                    </Pill>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Pill variant={user.active ? 'success' : 'danger'}>
                  {user.active ? 'Ativo' : 'Inativo'}
                </Pill>
                <RequirePermission perm="users.edit">
                  <div className="flex flex-col gap-1">
                    <Switch
                      checked={user.active}
                      onCheckedChange={() => setToggleUser(user)}
                      aria-label={`Status para ${user.name}`}
                    />
                    <Switch
                      checked={user.roletaoEnabled ?? false}
                      onCheckedChange={async (checked) => {
                        await toggleRoletao(user.id, checked);
                        toast({ title: checked ? 'Roletão ativado' : 'Roletão desativado' });
                      }}
                      aria-label={`Roletão para ${user.name}`}
                    />
                  </div>
                </RequirePermission>
                <RequirePermission perm="users.edit">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Abrir menu de ações para ${user.name}`}
                      >
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/usuarios/${user.id}?tab=perfil`}>
                          Ver perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setToggleUser(user)}>
                        {user.active ? 'Desativar' : 'Ativar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast({ title: 'Senha resetada' })}>
                        Resetar senha
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLinkUser(user)}>
                        Vincular imobiliária
                      </DropdownMenuItem>
                      <RequirePermission perm="reports.export">
                        <DropdownMenuItem onClick={() => toast({ title: 'CSV exportado' })}>
                          Exportar CSV
                        </DropdownMenuItem>
                      </RequirePermission>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </RequirePermission>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
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

        {/* Toggle Sheet */}
        <Sheet
          open={toggleUser !== null}
          onOpenChange={(o) => !o && setToggleUser(null)}
        >
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                {toggleUser?.active ? 'Desativar' : 'Ativar'} usuário
              </SheetTitle>
            </SheetHeader>
            <div className="p-4">
              Tem certeza que deseja{' '}
              {toggleUser?.active ? 'desativar' : 'ativar'}{' '}
              {toggleUser?.name}?
            </div>
            <SheetFooter className="flex gap-2 justify-end">
              <SheetClose asChild>
                <Button variant="outline">Cancelar</Button>
              </SheetClose>
              <Button
                onClick={confirmToggle}
                variant={toggleUser?.active ? 'danger' : 'success'}
              >
                Confirmar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Link Drawer */}
        <Drawer
          open={linkUser !== null}
          onOpenChange={(o) => !o && setLinkUser(null)}
        >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Vincular Imobiliária</DrawerTitle>
          </DrawerHeader>
            <div className="p-4 space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a imobiliária" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Imobiliária A</SelectItem>
                  <SelectItem value="b">Imobiliária B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DrawerFooter className="flex gap-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
              <Button onClick={confirmLink}>Vincular</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </ResponsiveLayout>
  );
};

export default UsuariosPage;

