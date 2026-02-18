import React, { useMemo, useState } from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  faseFunil: string;
  corretor: string;
  midiaOrigem: string;
  dataInclusao: string;
  ultimaInteracao: string;
  situacao: string;
}

interface FunnelStep {
  id: string;
  label: string;
  value: number;
  percent: number;
  color: string;
}

const FUNNEL_STEPS: FunnelStep[] = [
  { id: 'atendimentos', label: 'Atendimentos', value: 11, percent: 100, color: '#22C55E' },
  { id: 'visitas', label: 'Visitas', value: 1, percent: 9, color: '#8B5CF6' },
  { id: 'propostas', label: 'Propostas', value: 0, percent: 0, color: '#EAB308' },
  { id: 'negocios', label: 'Negócios', value: 0, percent: 0, color: '#1D4ED8' },
];

const FUNNEL_TABLE_DATA = [
  { semana: 'Sem 1', atendimentos: 5, visitas: 1, propostas: 0, negocios: 0, descartes: 23 },
  { semana: 'Sem 2', atendimentos: 4, visitas: 0, propostas: 0, negocios: 0, descartes: 3 },
  { semana: 'Sem 3', atendimentos: 2, visitas: 0, propostas: 0, negocios: 0, descartes: 7 },
  { semana: 'Sem 4', atendimentos: 0, visitas: 0, propostas: 0, negocios: 0, descartes: 0 },
  { semana: 'Sem 5', atendimentos: 0, visitas: 0, propostas: 0, negocios: 0, descartes: 0 },
  { semana: 'Sem 6', atendimentos: 0, visitas: 0, propostas: 0, negocios: 0, descartes: 0 },
];

const MOCK_LEADS: Lead[] = [
  { id: '78190', nome: 'Cleide Claudio', telefone: '(13) 99604-5308', email: 'cleidealclaudio@msn.com', faseFunil: 'Atendimentos', corretor: 'Aline de Fatima Fernandes Martins', midiaOrigem: 'Instagram Leads', dataInclusao: '01/12/2025 00:57', ultimaInteracao: '10/12/2025 14:01', situacao: 'Descartado' },
  { id: '78191', nome: 'Cleide Claudio', telefone: '(13) 99604-5308', email: 'cleidealclaudio@msn.com', faseFunil: 'Atendimentos', corretor: 'Brayann Germano', midiaOrigem: 'Abordagem direta', dataInclusao: '01/12/2025 00:57', ultimaInteracao: '06/12/2025 06:21', situacao: 'Descartado' },
  { id: '78192', nome: 'Vhania Flor', telefone: '(48) 9977-7076', email: 'vhaniaflor2@gmail.com', faseFunil: 'Visitas', corretor: 'Amanda Aylon', midiaOrigem: 'Instagram Leads', dataInclusao: '01/12/2025 01:11', ultimaInteracao: '04/12/2025 14:58', situacao: 'Descartado' },
  { id: '78193', nome: 'Vhania Flor', telefone: '(48) 9977-7076', email: 'vhaniaflor2@gmail.com', faseFunil: 'Atendimentos', corretor: 'Brayann Germano', midiaOrigem: 'Abordagem direta', dataInclusao: '01/12/2025 01:11', ultimaInteracao: '01/12/2025 07:16', situacao: 'Descartado' },
  { id: '78194', nome: 'Erileny', telefone: '(92) 98533-7350', email: '', faseFunil: 'Atendimentos', corretor: 'Ana Zauer', midiaOrigem: 'Google Ads', dataInclusao: '01/12/2025 02:15', ultimaInteracao: '01/12/2025 02:15', situacao: 'Em atendimento' },
  { id: '78195', nome: 'Erileny', telefone: '5592985337350', email: '', faseFunil: 'Propostas', corretor: 'Brayann Germano', midiaOrigem: 'Abordagem direta', dataInclusao: '01/12/2025 02:15', ultimaInteracao: '01/12/2025 08:40', situacao: 'Descartado' },
  { id: '78196', nome: 'Fernando Pilz', telefone: '(47) 99973-4047', email: 'fernando@urbano.com.br', faseFunil: 'Visitas', corretor: 'Marcia Camargo', midiaOrigem: 'Instagram Leads', dataInclusao: '01/12/2025 03:26', ultimaInteracao: '03/12/2025 13:09', situacao: 'Em atendimento' },
  { id: '78197', nome: 'Carlos Silva', telefone: '(11) 99888-7766', email: 'carlos@email.com', faseFunil: 'Negocios', corretor: 'Pedro Santos', midiaOrigem: 'Google Ads', dataInclusao: '02/12/2025 10:30', ultimaInteracao: '05/12/2025 15:20', situacao: 'Em atendimento' },
];

export const LeadsFunnelSection: React.FC = () => {
  const navigate = useNavigate();

  const [modalContext, setModalContext] = useState<{ label: string; leads: Lead[] } | null>(null);
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);

  const totais = useMemo(() => {
    return FUNNEL_TABLE_DATA.reduce(
      (acc, row) => ({
        atendimentos: acc.atendimentos + row.atendimentos,
        visitas: acc.visitas + row.visitas,
        propostas: acc.propostas + row.propostas,
        negocios: acc.negocios + row.negocios,
        descartes: acc.descartes + row.descartes,
      }),
      { atendimentos: 0, visitas: 0, propostas: 0, negocios: 0, descartes: 0 }
    );
  }, []);

  const totalDescartes = totais.descartes;
  const conversaoPercent = totais.atendimentos > 0 
    ? Math.round((totais.negocios / totais.atendimentos) * 100) 
    : 0;

  const openModalWithLeads = (label: string, filter: (lead: Lead) => boolean) => {
    const leads = MOCK_LEADS.filter(filter);
    setModalContext({ label, leads });
    setIsLeadsModalOpen(true);
  };

  const handleStepClick = (step: FunnelStep) => {
    openModalWithLeads(step.label, (lead) => lead.faseFunil === step.label);
  };

  const modalLeads = modalContext?.leads ?? [];
  const modalLabel = modalContext?.label ?? 'Leads';

  const handleNavigateToLead = (leadId: string) => {
    setIsLeadsModalOpen(false);
    navigate(`/lead-vendas/${leadId}`);
  };

  const getSituacaoStyle = (situacao: string) => {
    if (situacao === 'Descartado') return 'text-red-600 font-medium';
    if (situacao === 'Em atendimento') return 'text-green-600 font-medium';
    return 'text-muted-foreground';
  };

  const getFunnelSegmentStyle = (index: number, total: number): React.CSSProperties => {
    const topWidth = 100 - (index * (50 / total));
    const bottomWidth = 100 - ((index + 1) * (50 / total));
    return {
      clipPath: `polygon(${(100 - topWidth) / 2}% 0, ${(100 + topWidth) / 2}% 0, ${(100 + bottomWidth) / 2}% 100%, ${(100 - bottomWidth) / 2}% 100%)`,
    };
  };

  return (
    <div className="space-y-6">
      {/* Funnel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Card */}
        <Card className="lg:col-span-2 border border-border rounded-xl shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Funil de vendas</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground font-medium"></TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Atendimentos</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Visitas</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Propostas</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Negócios</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Descartes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FUNNEL_TABLE_DATA.map((row, index) => (
                    <TableRow key={index} className="border-border hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">{row.semana}</TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          className={
                            row.atendimentos > 0
                              ? 'text-[#3B82F6] underline cursor-pointer'
                              : 'text-muted-foreground cursor-not-allowed'
                          }
                          onClick={() =>
                            row.atendimentos > 0
                              ? openModalWithLeads('Atendimentos', (lead) => lead.faseFunil === 'Atendimentos')
                              : undefined
                          }
                          disabled={row.atendimentos === 0}
                        >
                          {row.atendimentos}
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          className={
                            row.visitas > 0
                              ? 'text-[#3B82F6] underline cursor-pointer'
                              : 'text-muted-foreground cursor-not-allowed'
                          }
                          onClick={() =>
                            row.visitas > 0
                              ? openModalWithLeads('Visitas', (lead) => lead.faseFunil === 'Visitas')
                              : undefined
                          }
                          disabled={row.visitas === 0}
                        >
                          {row.visitas}
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          className={
                            row.propostas > 0
                              ? 'text-[#3B82F6] underline cursor-pointer'
                              : 'text-muted-foreground cursor-not-allowed'
                          }
                          onClick={() =>
                            row.propostas > 0
                              ? openModalWithLeads('Propostas', (lead) => lead.faseFunil === 'Propostas')
                              : undefined
                          }
                          disabled={row.propostas === 0}
                        >
                          {row.propostas}
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          className={
                            row.negocios > 0
                              ? 'text-[#3B82F6] underline cursor-pointer'
                              : 'text-muted-foreground cursor-not-allowed'
                          }
                          onClick={() =>
                            row.negocios > 0
                              ? openModalWithLeads('Negócios', (lead) => lead.faseFunil === 'Negocios')
                              : undefined
                          }
                          disabled={row.negocios === 0}
                        >
                          {row.negocios}
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          className={
                            row.descartes > 0
                              ? 'text-[#3B82F6] underline cursor-pointer'
                              : 'text-muted-foreground cursor-not-allowed'
                          }
                          onClick={() =>
                            row.descartes > 0
                              ? openModalWithLeads('Descartes', (lead) => lead.situacao === 'Descartado')
                              : undefined
                          }
                          disabled={row.descartes === 0}
                        >
                          {row.descartes}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 border-border bg-muted/30">
                    <TableCell className="font-bold text-foreground">Total</TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        className="text-[#3B82F6] underline cursor-pointer font-medium"
                        onClick={() => openModalWithLeads('Atendimentos', (lead) => lead.faseFunil === 'Atendimentos')}
                      >
                        {totais.atendimentos}
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        className="text-[#3B82F6] underline cursor-pointer font-medium"
                        onClick={() => openModalWithLeads('Visitas', (lead) => lead.faseFunil === 'Visitas')}
                      >
                        {totais.visitas}
                      </button>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground font-medium">
                      <button
                        type="button"
                        className="text-[#3B82F6] underline cursor-pointer font-medium"
                        onClick={() => openModalWithLeads('Propostas', (lead) => lead.faseFunil === 'Propostas')}
                      >
                        {totais.propostas}
                      </button>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground font-medium">
                      <button
                        type="button"
                        className="text-[#3B82F6] underline cursor-pointer font-medium"
                        onClick={() => openModalWithLeads('Negócios', (lead) => lead.faseFunil === 'Negocios')}
                      >
                        {totais.negocios}
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        className="text-[#3B82F6] underline cursor-pointer font-medium"
                        onClick={() => openModalWithLeads('Descartes', (lead) => lead.situacao === 'Descartado')}
                      >
                        {totais.descartes}
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Visual Funnel Card */}
        <Card className="border border-border rounded-xl shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Funil de Venda</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* Funnel Visualization */}
            <div className="w-full max-w-xs">
              {FUNNEL_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className="w-full relative flex items-center justify-center text-white text-center cursor-pointer transition-all duration-200 hover:brightness-110"
                  onClick={() => handleStepClick(step)}
                  style={{
                    height: '65px',
                    background: step.color,
                    marginBottom: '-8px',
                    ...getFunnelSegmentStyle(index, FUNNEL_STEPS.length),
                  }}
                >
                  <div className="z-10 flex items-center gap-2">
                    <span className="font-semibold text-sm drop-shadow-sm">{step.label}:</span>
                    <span className="text-sm font-bold drop-shadow-sm">{step.value}</span>
                  </div>
                  {/* Percentage badge */}
                  <div 
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[60%] bg-white text-foreground text-xs font-medium px-2 py-1 rounded-full border border-border shadow-sm"
                  >
                    {step.percent}%
                  </div>
                </div>
              ))}

              {/* Bottom badges */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <span className="bg-[#22C55E] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                  +{conversaoPercent}%
                </span>
                <span className="bg-[#EF4444] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                  -{totalDescartes}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Modal */}
      <Dialog
        open={isLeadsModalOpen}
        onOpenChange={(open) => {
          setIsLeadsModalOpen(open);
          if (!open) {
            setModalContext(null);
          }
        }}
      >
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              {modalLabel} - {modalLeads.length} Leads
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground font-medium">Cód.</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Lead</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Fase do funil</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Corretor</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Mídia de origem</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Data inclusão</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Última interação</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Situação</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modalLeads.map((lead) => (
                  <TableRow key={lead.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{lead.id}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground">{lead.nome}</p>
                        <p className="text-xs text-muted-foreground">{lead.telefone}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{lead.faseFunil}</TableCell>
                    <TableCell className="text-foreground max-w-[150px] truncate">{lead.corretor}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[130px] truncate">{lead.midiaOrigem}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{lead.dataInclusao}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{lead.ultimaInteracao}</TableCell>
                    <TableCell>
                      <span className={getSituacaoStyle(lead.situacao)}>{lead.situacao}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg">
                            Ações
                            <ChevronDown className="ml-1 h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleNavigateToLead(lead.id)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleNavigateToLead(lead.id)}>
                            Editar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
