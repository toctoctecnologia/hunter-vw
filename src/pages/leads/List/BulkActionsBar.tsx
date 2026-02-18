import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { list } from '@/data/leads/leadsMockService';
import { toast } from '@/hooks/use-toast';

interface BulkActionsBarProps {
  selected: string[];
  onDone: () => void;
}

const STORAGE_KEY = 'leads.v1';

export function BulkActionsBar({ selected, onDone }: BulkActionsBarProps) {
  const updateLeads = (updater: (leads: any[]) => any[]) => {
    const leads = list();
    const updated = updater(leads);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleArchive = () => {
    updateLeads(leads => leads.filter(l => !selected.includes(l.id)));
    toast({ title: 'Arquivados', description: `${selected.length} leads arquivados` });
    onDone();
  };

  const handleDelete = () => {
    updateLeads(leads => leads.filter(l => !selected.includes(l.id)));
    toast({ title: 'Excluídos', description: `${selected.length} leads excluídos` });
    onDone();
  };

  const handleChangeStatus = (status: string) => {
    updateLeads(leads => leads.map(l => selected.includes(l.id) ? { ...l, status } : l));
    toast({ title: 'Status atualizado', description: `${selected.length} leads marcados como ${status}` });
    onDone();
  };

  const handleAssignSeller = (seller: string) => {
    toast({ title: 'Vendedor atribuído', description: `${selected.length} leads atribuídos a ${seller}` });
    onDone();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 bg-muted p-2 rounded border">
      <span className="text-sm mr-2">{selected.length} selecionados</span>
      <Button size="sm" variant="outline" onClick={handleArchive}>
        Arquivar
      </Button>
      <Button size="sm" variant="outline" onClick={handleDelete}>
        Excluir
      </Button>
      <Select onValueChange={handleChangeStatus}>
        <SelectTrigger className="w-[160px]" aria-label="Alterar status">
          <SelectValue placeholder="Alterar status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">Novo</SelectItem>
          <SelectItem value="contacted">Contactado</SelectItem>
          <SelectItem value="qualified">Qualificado</SelectItem>
          <SelectItem value="lost">Perdido</SelectItem>
          <SelectItem value="won">Ganho</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={handleAssignSeller}>
        <SelectTrigger className="w-[180px]" aria-label="Atribuir vendedor">
          <SelectValue placeholder="Atribuir vendedor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="alice">Alice</SelectItem>
          <SelectItem value="bob">Bob</SelectItem>
          <SelectItem value="carol">Carol</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default BulkActionsBar;
