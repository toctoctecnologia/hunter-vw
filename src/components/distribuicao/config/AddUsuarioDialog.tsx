import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';
import type { UsuarioFila } from '@/types/filas';

interface AddUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (usuario: UsuarioFila) => void;
  existingUserIds: string[];
}

// Mock de usuários disponíveis para adicionar
const MOCK_USUARIOS = [
  { id: 'u1', nome: 'Ana Silva', email: 'ana@hunter.com' },
  { id: 'u2', nome: 'Bruno Costa', email: 'bruno@hunter.com' },
  { id: 'u3', nome: 'Carla Santos', email: 'carla@hunter.com' },
  { id: 'u4', nome: 'Daniel Oliveira', email: 'daniel@hunter.com' },
  { id: 'u5', nome: 'Eduarda Lima', email: 'eduarda@hunter.com' },
  { id: 'u6', nome: 'Fernando Alves', email: 'fernando@hunter.com' },
  { id: 'u7', nome: 'Gabriela Rocha', email: 'gabriela@hunter.com' },
  { id: 'u8', nome: 'Henrique Souza', email: 'henrique@hunter.com' },
];

export default function AddUsuarioDialog({ open, onOpenChange, onAdd, existingUserIds }: AddUsuarioDialogProps) {
  const [search, setSearch] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  const availableUsers = MOCK_USUARIOS.filter(
    (u) => !existingUserIds.includes(u.id) && 
           (u.nome.toLowerCase().includes(search.toLowerCase()) || 
            u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelection = (userId: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleAddSelected = () => {
    if (selectedUserIds.size === 0) return;

    let addedCount = 0;

    [...selectedUserIds].forEach((userId) => {
      const user = MOCK_USUARIOS.find((u) => u.id === userId);
      if (!user) return;

      const newUsuarioFila: UsuarioFila = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        ativo: true,
        disponivelAgora: true,
        ordemRotacao: existingUserIds.length + addedCount + 1,
      };

      onAdd(newUsuarioFila);
      addedCount += 1;
    });

    setSelectedUserIds(new Set());
    setSearch('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <UserPlus className="h-5 w-5 text-primary" />
            Adicionar usuário à fila
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuário por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl border-border h-11"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Nenhum usuário disponível para adicionar
              </p>
            ) : (
              availableUsers.map((user) => {
                const isSelected = selectedUserIds.has(user.id);

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleSelection(user.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 hover:border-primary/50 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {user.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/30 bg-background text-transparent'
                      }`}
                      aria-hidden
                    >
                      <span className="text-xs font-semibold">✓</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedUserIds(new Set());
              setSearch('');
              onOpenChange(false);
            }}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddSelected}
            disabled={selectedUserIds.size === 0}
            className="rounded-xl"
          >
            Adicionar selecionados
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
