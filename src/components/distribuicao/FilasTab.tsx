import { useEffect, useState, type CSSProperties } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useFilasStore } from '@/hooks/distribuicao';
import type { Fila } from '@/types/distribuicao';

const RULE_OPTIONS = ['Regra A', 'Regra B', 'Regra C'];

interface FilaFormState {
  id?: number;
  nome: string;
  regras: string[];
  redistribuicao: boolean;
  preservarPosicao: boolean;
  ativo: boolean;
}

const defaultForm: FilaFormState = {
  nome: '',
  regras: [],
  redistribuicao: false,
  preservarPosicao: false,
  ativo: true
};

function FilaRow({ fila, onEdit }: { fila: Fila; onEdit: (f: Fila) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: fila.id });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400"
          aria-label="Reordenar"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </TableCell>
      <TableCell>{fila.nome}</TableCell>
      <TableCell>
        {fila.regras.map((r) => (
          <Badge key={r} variant="secondary" className="mr-1">
            {r}
          </Badge>
        ))}
      </TableCell>
      <TableCell>{fila.redistribuicao ? 'Sim' : 'Não'}</TableCell>
      <TableCell>{fila.preservarPosicao ? 'Sim' : 'Não'}</TableCell>
      <TableCell>{fila.ativo ? 'Ativo' : 'Inativo'}</TableCell>
      <TableCell className="space-x-2">
        <Button size="icon" variant="ghost" onClick={() => onEdit(fila)}>
          <Pencil className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function FilasTab() {
  const { filas, load, save, reorder } = useFilasStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FilaFormState>(defaultForm);

  useEffect(() => {
    if (!filas.length) {
      load();
    }
  }, [filas.length, load]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filas.findIndex((f) => f.id === active.id);
    const newIndex = filas.findIndex((f) => f.id === over.id);
    const newOrder = arrayMove(filas, oldIndex, newIndex).map((f, i) => ({
      ...f,
      ordem: i + 1
    }));
    reorder(newOrder);
  };

  const openNew = () => {
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (fila: Fila) => {
    setForm({
      id: fila.id,
      nome: fila.nome,
      regras: fila.regras,
      redistribuicao: fila.redistribuicao,
      preservarPosicao: fila.preservarPosicao,
      ativo: fila.ativo
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save({
      id: form.id,
      nome: form.nome,
      regras: form.regras,
      redistribuicao: form.redistribuicao,
      preservarPosicao: form.preservarPosicao,
      ativo: form.ativo
    });
    setOpen(false);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filas</h2>
        <Button onClick={openNew} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Nova fila
        </Button>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={filas.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Ordem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Regras</TableHead>
                <TableHead>Redistribuição</TableHead>
                <TableHead>Preservar posição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filas.map((fila) => (
                <FilaRow key={fila.id} fila={fila} onEdit={openEdit} />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? 'Editar fila' : 'Nova fila'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Regras</Label>
              <select
                multiple
                value={form.regras}
                onChange={(e) =>
                  setForm({
                    ...form,
                    regras: Array.from(e.target.selectedOptions, (o) => o.value)
                  })
                }
                className="w-full border rounded-md p-2 h-32"
              >
                {RULE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="redis">Redistribuição</Label>
              <Switch
                id="redis"
                checked={form.redistribuicao}
                onCheckedChange={(v) => setForm({ ...form, redistribuicao: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="preservar">Preservar posição</Label>
              <Switch
                id="preservar"
                checked={form.preservarPosicao}
                onCheckedChange={(v) => setForm({ ...form, preservarPosicao: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ativo">Ativo</Label>
              <Switch
                id="ativo"
                checked={form.ativo}
                onCheckedChange={(v) => setForm({ ...form, ativo: v })}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
