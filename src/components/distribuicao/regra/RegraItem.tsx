import { Plus, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Regra } from '@/types/filas';
import { CAMPOS_REGRA, OPERADORES_REGRA } from '@/types/filas';

interface RegraItemProps {
  regra: Regra;
  onChange: (id: string, changes: Partial<Regra>) => void;
  onAdd: () => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  disableRemove?: boolean;
}

export default function RegraItem({
  regra,
  onChange,
  onAdd,
  onDuplicate,
  onRemove,
  disableRemove,
}: RegraItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border hover:border-border/80 transition-colors">
      <Select
        value={regra.campo}
        onValueChange={(v) => onChange(regra.id, { campo: v as Regra['campo'] })}
      >
        <SelectTrigger className="w-[180px] rounded-xl border-border h-10 bg-white">
          <SelectValue placeholder="Campo" />
        </SelectTrigger>
        <SelectContent className="rounded-xl bg-white border-border z-50">
          {CAMPOS_REGRA.map((c) => (
            <SelectItem key={c.value} value={c.value} className="rounded-lg">
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={regra.operador}
        onValueChange={(v) => onChange(regra.id, { operador: v as Regra['operador'] })}
      >
        <SelectTrigger className="w-[140px] rounded-xl border-border h-10 bg-white">
          <SelectValue placeholder="Operador" />
        </SelectTrigger>
        <SelectContent className="rounded-xl bg-white border-border z-50">
          {OPERADORES_REGRA.map((o) => (
            <SelectItem key={o.value} value={o.value} className="rounded-lg">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        className="flex-1 rounded-xl border-border h-10 bg-white"
        value={String(regra.valor ?? '')}
        onChange={(e) => onChange(regra.id, { valor: e.target.value })}
        placeholder="Valor"
      />

      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onAdd}
          className="rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDuplicate(regra.id)}
          className="rounded-full h-9 w-9 hover:bg-muted transition-colors"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(regra.id)}
          disabled={disableRemove}
          className="rounded-full h-9 w-9 hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-30"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
