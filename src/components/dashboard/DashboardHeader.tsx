import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DashboardHeader() {
  const [scope, setScope] = useState('all');

  return (
    <div className="flex items-center justify-between gap-2">
      <Select value={scope} onValueChange={setScope}>
        <SelectTrigger className="w-48" aria-label="Selecionar escopo">
          <SelectValue placeholder="Todas – Organização" />
        </SelectTrigger>
        <SelectContent aria-label="Opções de escopo">
          <SelectItem value="all">Todas – Organização</SelectItem>
          <SelectItem value="me">Meu usuário</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Salvar Dashboard</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Em breve</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Button asChild>
          <Link to="/analises/nova">Nova análise</Link>
        </Button>
      </div>
    </div>
  );
}

