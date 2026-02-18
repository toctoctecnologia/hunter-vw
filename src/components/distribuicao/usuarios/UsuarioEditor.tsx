import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import type { UsuarioFila } from '@/types/filas';
import { filasApi } from '@/api/filas';

interface UsuarioEditorProps {
  usuario: UsuarioFila | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (usuario: UsuarioFila) => void;
  onRemove: (id: string) => void;
  filaId: string;
}

export default function UsuarioEditor({ usuario, open, onOpenChange, onSave, onRemove, filaId }: UsuarioEditorProps) {
  const [local, setLocal] = useState<UsuarioFila | null>(usuario);

  useEffect(() => {
    setLocal(usuario);
  }, [usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!local) return;
    try {
      const updated = await filasApi.updateUsuarioNaFila(filaId, local.id, {
        ativo: local.ativo,
        ordemRotacao: local.ordemRotacao,
        limiteLeadsAbertos: local.limiteLeadsAbertos,
        observacao: local.observacao
      });
      onSave(updated);
    } catch (err) {
      console.error('Erro ao atualizar usuário da fila', err);
    }
  };

  const handleRemove = () => {
    if (usuario) onRemove(usuario.id);
  };

  if (!local) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Ativo</span>
            <Switch checked={local.ativo} onCheckedChange={(checked) => setLocal({ ...local, ativo: checked })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="ordemRotacao">Ordem na rotação</label>
            <Input id="ordemRotacao" type="number" value={local.ordemRotacao} onChange={(e) => setLocal({ ...local, ordemRotacao: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="limiteLeadsAbertos">Limite de leads abertos</label>
            <Input id="limiteLeadsAbertos" type="number" value={local.limiteLeadsAbertos ?? ''} onChange={(e) => setLocal({ ...local, limiteLeadsAbertos: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="observacao">Observação</label>
            <Textarea id="observacao" value={local.observacao ?? ''} onChange={(e) => setLocal({ ...local, observacao: e.target.value })} />
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Button type="button" variant="destructive" onClick={handleRemove}>
              Remover da fila
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
