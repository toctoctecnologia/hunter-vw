import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Filter, SlidersHorizontal, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Lead } from '@/types/lead';
import { getLeadDetailPath } from '@/lib/routes/leads';
import { useNavigate } from 'react-router-dom';
interface RankingLead extends Lead {
  modality: 'roletao' | 'proximo_fila';
  medium: string;
}
interface RankingUser {
  id: number;
  nome: string;
  avatar?: string;
  leadsCapturados: number;
  leadsPerdidos: number;
  leads: RankingLead[];
}
export interface RankingFilters {
  dataInicio: string;
  dataFim: string;
  usuario: string;
  equipe: string;
  resultado: 'todos' | 'capturados' | 'perdidos';
}
interface RankingSectionProps {
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  filters: RankingFilters;
  onFiltersChange: (filters: RankingFilters) => void;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
}
export const RankingSection = ({
  selectedLead,
  setSelectedLead,
  filters,
  onFiltersChange,
  isFilterOpen,
  onFilterOpenChange
}: RankingSectionProps) => {
  const navigate = useNavigate();
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const usuariosCapturaram: RankingUser[] = [{
    id: 1,
    nome: 'Fabio Peglow Silveira',
    leadsCapturados: 95,
    leadsPerdidos: 0,
    leads: [{
      id: 101,
      name: 'Ana Paula Santos',
      phone: '(11) 9999-1111',
      stage: 'pré_atendimento',
      modality: 'roletao',
      medium: 'WhatsApp'
    }, {
      id: 102,
      name: 'Bruno Costa Silva',
      phone: '(11) 9888-2222',
      stage: 'em_atendimento',
      modality: 'proximo_fila',
      medium: 'Formulário'
    }]
  }, {
    id: 2,
    nome: 'Verônica Isis',
    leadsCapturados: 86,
    leadsPerdidos: 0,
    leads: [{
      id: 201,
      name: 'Carla Dias Lima',
      phone: '(11) 9777-3333',
      stage: 'agendamento',
      modality: 'roletao',
      medium: 'Ligação'
    }]
  }, {
    id: 3,
    nome: 'Sandra Cardoso',
    leadsCapturados: 75,
    leadsPerdidos: 0,
    leads: [{
      id: 301,
      name: 'Eduardo Gomes',
      phone: '(11) 9555-5555',
      stage: 'pré_atendimento',
      modality: 'proximo_fila',
      medium: 'Landing page'
    }, {
      id: 302,
      name: 'Fernanda Alves',
      phone: '(11) 9444-6666',
      stage: 'em_atendimento',
      modality: 'roletao',
      medium: 'Facebook Lead'
    }]
  }];
  const usuariosPerderam: RankingUser[] = [{
    id: 4,
    nome: 'Ivan José Dagnoni',
    leadsCapturados: 0,
    leadsPerdidos: 135,
    leads: [{
      id: 401,
      name: 'Maria Clara Santos',
      phone: '(11) 92222-0011',
      stage: 'pré_atendimento',
      modality: 'roletao',
      medium: 'WhatsApp'
    }]
  }, {
    id: 5,
    nome: 'João Ernesto Gross Reinke',
    leadsCapturados: 0,
    leadsPerdidos: 52,
    leads: [{
      id: 501,
      name: 'Juliana Ribeiro',
      phone: '(11) 93333-1122',
      stage: 'em_atendimento',
      modality: 'proximo_fila',
      medium: 'Formulário'
    }]
  }, {
    id: 6,
    nome: 'Elizabete Machado Estercio',
    leadsCapturados: 0,
    leadsPerdidos: 51,
    leads: [{
      id: 601,
      name: 'Rafael Martins',
      phone: '(21) 94444-7789',
      stage: 'agendamento',
      modality: 'roletao',
      medium: 'Ligação'
    }]
  }];
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const renderModality = (modality: RankingLead['modality']) => (
    <span
      className={
        modality === 'roletao'
          ? 'rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700'
          : 'rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700'
      }
    >
      {modality === 'roletao' ? 'Roletão' : 'Próximo da fila'}
    </span>
  );
  const handleViewLeads = (userId: number) => {
    setExpandedUser(prev => prev === userId ? null : userId);
  };
  const periodoSelecionado = useMemo(() => {
    const inicio = format(new Date(filters.dataInicio), 'dd/MM/yyyy', { locale: ptBR });
    const fim = format(new Date(filters.dataFim), 'dd/MM/yyyy', { locale: ptBR });
    return `${inicio} - ${fim}`;
  }, [filters.dataInicio, filters.dataFim]);
  const handleFilterChange = (key: keyof RankingFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };
  const handleResetFilters = () => {
    onFiltersChange({
      ...filters,
      usuario: '',
      equipe: '',
      resultado: 'todos'
    });
  };
  return <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ranking</h1>
          <p className="text-sm text-gray-500">Visualize quem assumiu ou perdeu leads através do roletão.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-2 bg-blue-50 text-blue-700">
            <Calendar className="h-4 w-4" />
            {periodoSelecionado}
          </Badge>
          {filters.usuario && <Badge variant="secondary" className="bg-gray-100 text-gray-700">Usuário: {filters.usuario}</Badge>}
          {filters.equipe && <Badge variant="secondary" className="bg-gray-100 text-gray-700">Equipe: {filters.equipe}</Badge>}
          {filters.resultado !== 'todos' && <Badge variant="secondary" className="bg-gray-100 text-gray-700 capitalize">{filters.resultado}</Badge>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Leads Capturados */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Leads assumidos pelo roletão ou próximo da fila</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {usuariosCapturaram.map(usuario => <div key={usuario.id} className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-600 text-white">
                          {getInitials(usuario.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{usuario.nome}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-green-200">
                            <div className="h-2 rounded-full bg-green-600" style={{
                          width: `${Math.min(usuario.leadsCapturados, 100)}%`
                        }} />
                          </div>
                          <Badge variant="secondary" className="bg-green-600 text-white">
                            {usuario.leadsCapturados}
                          </Badge>
                        </div>
                      </div>
                      {usuario.leads.length > 0 && <Button size="sm" variant="outline" onClick={() => handleViewLeads(usuario.id)} className="border-green-300 text-green-700 hover:bg-green-50">
                          Ver leads
                        </Button>}
                    </div>
                  </div>
                  
                  {expandedUser === usuario.id && usuario.leads.length > 0 && <div className="ml-4 space-y-2 rounded-lg bg-gray-50 p-4">
                      {usuario.leads.map(lead => <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-3">
                          <div className="space-y-1">
                            <button onClick={() => setSelectedLead(lead)} className="text-left text-sm font-semibold text-gray-900 hover:text-green-600">
                              {lead.name}
                            </button>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                              {renderModality(lead.modality)}
                              <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700">
                                {lead.medium}
                              </span>
                              <span>{lead.phone}</span>
                              <span className="text-gray-500">Etapa: {lead.stage.replace('_', ' ')}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => navigate(getLeadDetailPath(lead.id))} className="text-blue-600 hover:bg-blue-50">
                            <Eye className="mr-1 h-3 w-3" />
                            Abrir página
                          </Button>
                        </div>)}
                    </div>}
                </div>)}
            </div>
          </div>
        </div>

        {/* Leads Perdidos */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Leads pedidos para o roletão ou próximo da fila</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {usuariosPerderam.map(usuario => <div key={usuario.id} className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-red-600 text-white">
                          {getInitials(usuario.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{usuario.nome}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-red-200">
                            <div className="h-2 rounded-full bg-red-600" style={{
                          width: `${Math.min(usuario.leadsPerdidos, 100)}%`
                        }} />
                          </div>
                          <Badge variant="destructive" className="bg-red-600">
                            {usuario.leadsPerdidos}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => handleViewLeads(usuario.id)}>
                        {expandedUser === usuario.id ? 'Ocultar leads' : 'Ver leads'}
                      </Button>
                    </div>
                  </div>
                  {expandedUser === usuario.id && usuario.leads.length > 0 && <div className="mt-3 space-y-2 rounded-lg border border-red-100 bg-white p-4">
                      {usuario.leads.map(lead => <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                              {renderModality(lead.modality)}
                              <span className="rounded-full bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700">{lead.medium}</span>
                              <span>{lead.phone}</span>
                              <span className="text-gray-500">Etapa: {lead.stage.replace('_', ' ')}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => navigate(getLeadDetailPath(lead.id))} className="text-blue-600 hover:bg-blue-50">
                            <Eye className="mr-1 h-3 w-3" />
                            Abrir página
                          </Button>
                        </div>)}
                    </div>}
                </div>)}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={isFilterOpen} onOpenChange={onFilterOpenChange}>
        <SheetContent side="right" className="w-full space-y-6 sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
              <Filter className="h-5 w-5 text-orange-600" />
              Ajustar filtros do ranking
            </SheetTitle>
            <p className="text-sm text-gray-500">
              Selecione o período, usuário e resultado para refinar os cartões do ranking.
            </p>
          </SheetHeader>

          <div className="space-y-5">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span>Período</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-600">Data inicial</Label>
                  <Input type="date" value={filters.dataInicio} onChange={event => handleFilterChange('dataInicio', event.target.value)} className="rounded-lg border-gray-300 bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-600">Data final</Label>
                  <Input type="date" value={filters.dataFim} onChange={event => handleFilterChange('dataFim', event.target.value)} className="rounded-lg border-gray-300 bg-white" />
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">O período não pode ultrapassar 31 dias.</p>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <SlidersHorizontal className="h-4 w-4 text-orange-600" />
                <span>Filtros adicionais</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-600">Usuário</Label>
                  <Input placeholder="Digite o nome ou e-mail" value={filters.usuario} onChange={event => handleFilterChange('usuario', event.target.value)} className="rounded-lg border-gray-300 bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-600">Equipe</Label>
                  <Input placeholder="Filtre por equipe" value={filters.equipe} onChange={event => handleFilterChange('equipe', event.target.value)} className="rounded-lg border-gray-300 bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-600">Resultado do lead</Label>
                  <Select value={filters.resultado} onValueChange={value => handleFilterChange('resultado', value)}>
                    <SelectTrigger className="rounded-lg border-gray-300 bg-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="capturados">Leads assumidos</SelectItem>
                      <SelectItem value="perdidos">Leads perdidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="flex items-center justify-between gap-3 sm:justify-between">
            <Button variant="ghost" onClick={handleResetFilters} className="text-gray-700 hover:bg-gray-100">
              Limpar filtros
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onFilterOpenChange(false)}>
                Cancelar
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => onFilterOpenChange(false)}>
                Aplicar filtros
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>;
};