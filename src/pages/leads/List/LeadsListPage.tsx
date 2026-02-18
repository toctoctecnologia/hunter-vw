import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { Lead, LeadStatus } from '@/data/leads/leadTypes';
import { list, exportCsv, seedIfEmpty } from '@/data/leads/leadsMockService';
import { getCurrentUser, hasPermission } from '@/data/accessControl';
import ImportCsvModal from './ImportCsvModal';
import BulkActionsBar from './BulkActionsBar';
import TransferLeadModal from './TransferLeadModal';
import { ArrowRightLeft } from 'lucide-react';

export function LeadsListPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('');
  const [origin, setOrigin] = useState('');
  const [status, setStatus] = useState('');
  const [seller, setSeller] = useState('');
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [leadToTransfer, setLeadToTransfer] = useState<Lead | null>(null);

  useEffect(() => {
    seedIfEmpty();
    fetchLeads();
  }, []);

  const currentUser = useMemo(() => getCurrentUser(), []);
  const canTransferLead = useMemo(
    () => hasPermission(currentUser, 'leads:transfer'),
    [currentUser]
  );

  const fetchLeads = () => {
    const data = list({
      search: search || undefined,
      status: (status as LeadStatus) || undefined,
      from: from ? from.toISOString() : undefined,
      to: to ? to.toISOString() : undefined
    });
    setLeads(data);
  };

  const handleExport = () => {
    exportCsv({
      search: search || undefined,
      status: (status as LeadStatus) || undefined,
      from: from ? from.toISOString() : undefined,
      to: to ? to.toISOString() : undefined
    });
  };

  const toggleSelect = (id: string) => {
    setSelected(sel =>
      sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === leads.length) {
      setSelected([]);
    } else {
      setSelected(leads.map(l => l.id));
    }
  };

  const handleOpenTransfer = (lead: Lead) => {
    setLeadToTransfer(lead);
    setIsTransferModalOpen(true);
  };

  const handleCloseTransfer = () => {
    setIsTransferModalOpen(false);
    setLeadToTransfer(null);
  };

  const handleLeadTransferred = (leadId: string, owner: { id: string; name: string }) => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === leadId ? { ...lead, ownerId: owner.id, ownerName: owner.name } : lead
      )
    );
    setLeadToTransfer(prev =>
      prev && prev.id === leadId ? { ...prev, ownerId: owner.id, ownerName: owner.name } : prev
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <div className="flex gap-2">
          <ImportCsvModal onImported={fetchLeads} />
          <Button variant="outline" onClick={handleExport}>
            Exportar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <Input
          placeholder="Busca"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="md:col-span-2"
          aria-label="Buscar leads"
        />
        <Select value={channel || "todos"} onValueChange={(value) => setChannel(value === "todos" ? "" : value)}>
          <SelectTrigger aria-label="Filtrar por canal">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="web">Web</SelectItem>
            <SelectItem value="phone">Telefone</SelectItem>
          </SelectContent>
        </Select>
        <Select value={origin || "todas"} onValueChange={(value) => setOrigin(value === "todas" ? "" : value)}>
          <SelectTrigger aria-label="Filtrar por origem">
            <SelectValue placeholder="Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="ads">Ads</SelectItem>
            <SelectItem value="referral">Indicação</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status || "todos"} onValueChange={(value) => setStatus(value === "todos" ? "" : value)}>
          <SelectTrigger aria-label="Filtrar por status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="new">Novo</SelectItem>
            <SelectItem value="contacted">Contactado</SelectItem>
            <SelectItem value="qualified">Qualificado</SelectItem>
            <SelectItem value="lost">Perdido</SelectItem>
            <SelectItem value="won">Ganho</SelectItem>
          </SelectContent>
        </Select>
        <Select value={seller || "todos"} onValueChange={(value) => setSeller(value === "todos" ? "" : value)}>
          <SelectTrigger aria-label="Filtrar por vendedor">
            <SelectValue placeholder="Vendedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="alice">Alice</SelectItem>
            <SelectItem value="bob">Bob</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <DatePickerInput
            value={from}
            onChange={setFrom}
            aria-label="Data inicial"
          />
          <DatePickerInput
            value={to}
            onChange={setTo}
            aria-label="Data final"
          />
        </div>
        <Button onClick={fetchLeads}>Filtrar</Button>
      </div>
      {selected.length > 0 && (
        <BulkActionsBar
          selected={selected}
          onDone={() => {
            setSelected([]);
            fetchLeads();
          }}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={selected.length === leads.length && leads.length > 0}
                onCheckedChange={toggleSelectAll}
                aria-label="Selecionar todos os leads"
              />
            </TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map(lead => (
            <TableRow
              key={lead.id}
              data-state={selected.includes(lead.id) ? 'selected' : undefined}
            >
              <TableCell>
                <Checkbox
                  checked={selected.includes(lead.id)}
                  onCheckedChange={() => toggleSelect(lead.id)}
                  aria-label={`Selecionar lead ${lead.name}`}
                />
              </TableCell>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.source ?? '—'}</TableCell>
              <TableCell>{lead.source ?? '—'}</TableCell>
              <TableCell>{lead.ownerName ?? '—'}</TableCell>
              <TableCell className="capitalize">{lead.status}</TableCell>
              <TableCell>
                {new Date(lead.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {canTransferLead ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-[#FF5506] text-white hover:bg-[#e64d05]"
                    onClick={() => handleOpenTransfer(lead)}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Transferir</span>
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TransferLeadModal
        open={isTransferModalOpen}
        lead={leadToTransfer}
        currentUserId={currentUser?.id}
        onClose={handleCloseTransfer}
        onTransferred={handleLeadTransferred}
      />
    </div>
  );
}

export default LeadsListPage;
