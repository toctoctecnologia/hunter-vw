import { useState } from 'react';
import { LocacaoModuleLayout } from '@/layouts/LocacaoModuleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Shield,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Calendar,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Seguro {
  id: string;
  contrato: string;
  imovel: string;
  locatario: string;
  seguradora: string;
  apolice: string;
  valor: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  status: 'Ativo' | 'Vencido' | 'A vencer' | 'Cancelado';
}

const segurosData: Seguro[] = [
  {
    id: '1',
    contrato: '2093477/1',
    imovel: 'Apartamento | Rua Exemplo, 100',
    locatario: 'Luiz Victor Ferreira',
    seguradora: 'Seguradora Atlântica',
    apolice: 'SAT-2024-001234',
    valor: 'R$ 89,90/mês',
    vigenciaInicio: '01/01/2024',
    vigenciaFim: '31/12/2024',
    status: 'Ativo'
  },
  {
    id: '2',
    contrato: '1477462/1',
    imovel: 'Casa | Rua das Flores, 250',
    locatario: 'Carolina Lima',
    seguradora: 'Protege Horizonte',
    apolice: 'PH-2024-005678',
    valor: 'R$ 120,00/mês',
    vigenciaInicio: '15/03/2024',
    vigenciaFim: '14/03/2025',
    status: 'Ativo'
  },
  {
    id: '3',
    contrato: '2004101/1',
    imovel: 'Sala Comercial | Av. Horizonte, 450',
    locatario: 'Felipe Rocha',
    seguradora: 'Aurora Seguros',
    apolice: 'AS-2023-009876',
    valor: 'R$ 75,00/mês',
    vigenciaInicio: '01/06/2023',
    vigenciaFim: '31/05/2024',
    status: 'Vencido'
  },
  {
    id: '4',
    contrato: '2093477/1',
    imovel: 'Apartamento | Rua Exemplo, 100',
    locatario: 'Luiz Victor Ferreira',
    seguradora: 'Seguradora Atlântica',
    apolice: 'SAT-2024-003456',
    valor: 'R$ 150,00/mês',
    vigenciaInicio: '01/11/2024',
    vigenciaFim: '31/10/2025',
    status: 'A vencer'
  }
];

const statsData = [
  { label: 'Seguros Ativos', value: '156', icon: Shield, color: 'text-[hsl(var(--success))]', bg: 'bg-[hsl(var(--success)/0.16)]' },
  { label: 'A Vencer (30 dias)', value: '12', icon: AlertTriangle, color: 'text-[hsl(var(--warning))]', bg: 'bg-[hsl(var(--warning)/0.16)]' },
  { label: 'Vencidos', value: '3', icon: Calendar, color: 'text-[hsl(var(--danger))]', bg: 'bg-[hsl(var(--danger)/0.16)]' },
  { label: 'Valor Mensal Total', value: 'R$ 14.250', icon: DollarSign, color: 'text-[hsl(var(--accent))]', bg: 'bg-[hsl(var(--accent)/0.12)]' },
];

export const SegurosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const getStatusBadge = (status: Seguro['status']) => {
    const styles = {
      'Ativo': 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
      'Vencido': 'bg-[hsl(var(--danger)/0.16)] text-[hsl(var(--danger))]',
      'A vencer': 'bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]',
      'Cancelado': 'bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)]'
    };
    return <Badge className={`${styles[status]} rounded-lg px-2.5 py-0.5 text-xs font-medium`}>{status}</Badge>;
  };

  return (
    <LocacaoModuleLayout
      title="Seguros"
      subtitle="Gerencie os seguros fiança dos contratos"
    >
      {/* Header Actions */}
      <div className="flex justify-end mb-6">
        <Button className="rounded-xl h-11 px-5 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] shadow-lg shadow-[var(--brand-focus)]">
          <Plus className="w-4 h-4 mr-2" />
          Novo Seguro
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--ui-text-subtle)]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--ui-text)] mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Card */}
      <Card className="mb-6 rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-lg"
            >
              {showFilters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--ui-text)]">Busca</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ui-text-subtle)]" />
                  <Input 
                    placeholder="Buscar por contrato ou locatário"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-[var(--ui-stroke)]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--ui-text)]">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                    <SelectItem value="a_vencer">A vencer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--ui-text)]">Seguradora</label>
                <Select>
                  <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="atlantica">Seguradora Atlântica</SelectItem>
                    <SelectItem value="horizonte">Protege Horizonte</SelectItem>
                    <SelectItem value="aurora">Aurora Seguros</SelectItem>
                    <SelectItem value="sol">Seguros Sol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Seguros Table */}
      <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
        <CardHeader className="pb-3 border-b border-[var(--ui-stroke)]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Seguros ({segurosData.length})
            </CardTitle>
            <Select defaultValue="vigencia">
              <SelectTrigger className="w-44 h-9 rounded-lg border-[var(--ui-stroke)] text-sm">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="vigencia">Vigência</SelectItem>
                <SelectItem value="valor">Valor</SelectItem>
                <SelectItem value="locatario">Locatário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-8 gap-4 px-6 py-3 bg-[var(--ui-stroke)]/30 text-xs font-medium text-[var(--ui-text-subtle)] uppercase tracking-wide">
            <div>Contrato</div>
            <div className="col-span-2">Imóvel</div>
            <div>Seguradora</div>
            <div>Apólice</div>
            <div>Valor</div>
            <div>Vigência</div>
            <div>Status</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[var(--ui-stroke)]">
            {segurosData.map((seguro) => (
              <div 
                key={seguro.id}
                className="px-6 py-4 hover:bg-[var(--ui-stroke)]/20 transition-colors cursor-pointer"
              >
                <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
                  <div>
                    <Link to="#" className="text-sm text-[hsl(var(--link))] hover:underline font-medium">
                      {seguro.contrato}
                    </Link>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-[var(--ui-text)]">{seguro.imovel}</p>
                    <p className="text-xs text-[var(--ui-text-subtle)] mt-0.5">{seguro.locatario}</p>
                  </div>
                  <div className="text-sm text-[var(--ui-text)]">{seguro.seguradora}</div>
                  <div className="text-sm text-[var(--ui-text-subtle)]">{seguro.apolice}</div>
                  <div className="text-sm font-medium text-[var(--ui-text)]">{seguro.valor}</div>
                  <div>
                    <p className="text-sm text-[var(--ui-text)]">{seguro.vigenciaInicio}</p>
                    <p className="text-xs text-[var(--ui-text-subtle)]">até {seguro.vigenciaFim}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(seguro.status)}
                    <ChevronRight className="w-4 h-4 text-[var(--ui-text-subtle)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </LocacaoModuleLayout>
  );
};

export default SegurosPage;
