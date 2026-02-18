import { useEffect, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  DragEndEvent,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UsuarioEditor from './UsuarioEditor';
import type { UsuarioFila } from '@/types/filas';
import { filasApi } from '@/api/filas';
import { useToast } from '@/hooks/use-toast';

interface UsuarioListProps {
  usuarios: UsuarioFila[];
  onChange: (usuarios: UsuarioFila[]) => void;
  filaId: string;
}

export default function UsuarioList({ usuarios, onChange, filaId }: UsuarioListProps) {
  const [editing, setEditing] = useState<UsuarioFila | null>(null);
  const [localUsuarios, setLocalUsuarios] = useState<UsuarioFila[]>(usuarios);
  const [orderChanged, setOrderChanged] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const { toast } = useToast();

  useEffect(() => {
    setLocalUsuarios(usuarios);
    setOrderChanged(false);
  }, [usuarios]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = localUsuarios.findIndex(u => u.id === active.id);
    const newIndex = localUsuarios.findIndex(u => u.id === over.id);
    const reordered = arrayMove(localUsuarios, oldIndex, newIndex).map((u, idx) => ({
      ...u,
      ordemRotacao: idx + 1
    }));
    setLocalUsuarios(reordered);
    setOrderChanged(true);
  };

  const handleToggle = (id: string, value: boolean) => {
    const updated = localUsuarios.map(u => u.id === id ? { ...u, ativo: value } : u);
    setLocalUsuarios(updated);
    onChange(updated);
  };

  const handleSave = (user: UsuarioFila) => {
    const updated = localUsuarios.map(u => u.id === user.id ? user : u);
    setLocalUsuarios(updated);
    onChange(updated);
    setEditing(null);
  };

  const handleRemove = (id: string) => {
    const updated = localUsuarios.filter(u => u.id !== id).map((u, idx) => ({
      ...u,
      ordemRotacao: idx + 1
    }));
    setLocalUsuarios(updated);
    onChange(updated);
    setEditing(null);
  };

  const handleSaveOrder = async () => {
    try {
      await Promise.all(
        localUsuarios.map((u, idx) =>
          filasApi.updateUsuarioNaFila(filaId, u.id, { ordemRotacao: idx + 1 })
        )
      );
      onChange(localUsuarios);
      setOrderChanged(false);
      toast({ description: 'Ordem salva com sucesso' });
    } catch (err) {
      console.error('Erro ao salvar ordem dos usuários', err);
      toast({ description: 'Erro ao salvar ordem', variant: 'destructive' });
    }
  };

  if (localUsuarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhum usuário na fila
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Clique no botão + acima para adicionar usuários
        </p>
      </div>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={localUsuarios.map(u => u.id)} strategy={verticalListSortingStrategy}>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="text-xs font-medium text-primary uppercase tracking-wider">Nome</TableHead>
                  <TableHead className="w-24 text-xs font-medium text-primary uppercase tracking-wider">Ativo</TableHead>
                  <TableHead className="w-32 text-xs font-medium text-primary uppercase tracking-wider">Disponível</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localUsuarios.map((usuario) => (
                  <UsuarioRow
                    key={usuario.id}
                    usuario={usuario}
                    onEdit={() => setEditing(usuario)}
                    onToggle={handleToggle}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </SortableContext>
      </DndContext>

      {orderChanged && (
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveOrder} className="rounded-xl">
            Salvar ordem
          </Button>
        </div>
      )}

      <UsuarioEditor
        usuario={editing}
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onSave={handleSave}
        onRemove={handleRemove}
        filaId={filaId}
      />
    </>
  );
}

interface UsuarioRowProps {
  usuario: UsuarioFila;
  onEdit: () => void;
  onToggle: (id: string, value: boolean) => void;
}

function UsuarioRow({ usuario, onEdit, onToggle }: UsuarioRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: usuario.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  } as React.CSSProperties;

  return (
    <TableRow ref={setNodeRef} style={style} className="hover:bg-muted/20">
      <TableCell>
        <button 
          {...attributes} 
          {...listeners} 
          className="cursor-grab text-muted-foreground hover:text-foreground transition-colors p-1 rounded" 
          aria-label="Reordenar"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="font-medium text-foreground">{usuario.nome}</TableCell>
      <TableCell>
        <Switch 
          checked={usuario.ativo} 
          onCheckedChange={(v) => onToggle(usuario.id, v)} 
        />
      </TableCell>
      <TableCell>
        {usuario.disponivelAgora ? (
          <Badge className="bg-success text-success-foreground rounded-full px-3 py-1 text-xs font-medium">
            Disponível agora
          </Badge>
        ) : (
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
            Indisponível
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={onEdit}
          className="rounded-full h-8 w-8 hover:bg-muted transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
