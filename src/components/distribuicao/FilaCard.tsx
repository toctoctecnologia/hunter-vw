import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, RotateCcw, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import type { Fila } from '@/types/filas';

// Color options for the queue color bar
const FILA_COLORS = [
  { name: 'orange', value: 'hsl(var(--accentSoft))' },
  { name: 'red', value: '#EF4444' },
  { name: 'green', value: '#22C55E' },
  { name: 'blue', value: '#3B82F6' },
  { name: 'purple', value: '#8B5CF6' },
  { name: 'pink', value: '#EC4899' },
  { name: 'teal', value: '#14B8A6' },
  { name: 'amber', value: '#F59E0B' },
  { name: 'indigo', value: '#6366F1' },
  { name: 'gray', value: '#64748B' },
];

interface FilaCardProps {
  fila: Fila;
  onToggle: (id: string, habilitada: boolean) => void;
  onDelete: (id: string) => Promise<void>;
  onRedistribute: (id: string) => void;
}

export default function FilaCard({ fila, onToggle, onDelete, onRedistribute }: FilaCardProps) {
  const navigate = useNavigate();
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  
  // Get color from configAvancadas or fallback to priority-based assignment
  const getColorValue = () => {
    if (fila.configAvancadas?.corFila) {
      return fila.configAvancadas.corFila;
    }
    const colorIndex = (fila.prioridade - 1) % FILA_COLORS.length;
    return FILA_COLORS[colorIndex].value;
  };
  
  const colorValue = getColorValue();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fila.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const proximoUsuario = fila.usuarios.find(u => u.id === fila.proximoUsuarioId);
  const regrasVisiveis = fila.regras.slice(0, 2);
  const regrasExtras = fila.regras.length - 2;

  const handleEdit = () => {
    navigate(`/distribuicao/${fila.id}`);
  };

  const handleDeleteConfirm = async (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    if (deleteConfirmName !== fila.nome) {
      e.preventDefault();
      toast.error('Nome da fila incorreto');
      return;
    }

    try {
      await onDelete(fila.id);
      toast.success('Fila excluída com sucesso');
    } catch {
      toast.error('Erro ao excluir fila');
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`
        group relative rounded-2xl border border-border bg-card overflow-hidden
        transition-all duration-200 
        ${isDragging ? 'shadow-2xl ring-2 ring-primary/20' : 'shadow-sm hover:shadow-md hover:border-primary/20'}
      `}
    >
      <div className="flex items-stretch">
        {/* Color Bar - displays configured color */}
        <div
          className="w-1.5 min-h-full shrink-0"
          style={{ backgroundColor: colorValue }}
          title="Cor da fila"
        />

        <div className="flex items-start gap-4 p-5 flex-1">
          {/* Drag Handle */}
          <div 
            className="flex items-center justify-center w-8 h-8 mt-0.5 text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing rounded-xl hover:bg-muted/50 transition-colors"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Priority Badge */}
          <div 
            className="flex items-center justify-center min-w-[32px] h-8 mt-0.5 font-semibold rounded-xl text-sm text-white"
            style={{ backgroundColor: colorValue }}
          >
            {fila.prioridade}
          </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="font-semibold text-base text-foreground truncate leading-tight">
                {fila.nome}
              </h3>
              
              {/* Rules */}
              {fila.regras.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {regrasVisiveis.map((regra) => (
                    <Badge 
                      key={regra.id} 
                      variant="secondary" 
                      className="text-xs font-normal rounded-lg px-2.5 py-0.5 bg-muted/80 text-muted-foreground border-0"
                    >
                      {regra.campo}: {String(regra.valor)}
                    </Badge>
                  ))}
                  {regrasExtras > 0 && (
                    <Badge variant="outline" className="text-xs font-normal rounded-lg px-2 py-0.5 border-dashed">
                      +{regrasExtras}
                    </Badge>
                  )}
                </div>
              )}

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {proximoUsuario && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Próximo:</span>
                    <Badge className="text-xs font-medium rounded-lg px-2.5 py-0.5 bg-success/10 text-success border-0 hover:bg-success/10">
                      {proximoUsuario.nome}
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{fila.ativosNaFila || 0} ativos</span>
                </div>

                {fila.leadsRecebidos !== undefined && fila.leadsRecebidos > 0 && (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{fila.leadsRecebidos} leads</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEdit}
                      className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="rounded-lg">
                    <p className="text-xs">Editar fila</p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex items-center gap-2 px-2">
                  <Switch
                    checked={fila.habilitada}
                    onCheckedChange={(checked) => onToggle(fila.id, checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRedistribute(fila.id)}
                      className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="rounded-lg">
                    <p className="text-xs">Redistribuir leads</p>
                  </TooltipContent>
                </Tooltip>

                <AlertDialog
                  onOpenChange={(open) => {
                    if (!open) setDeleteConfirmName('');
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-lg">
                      <p className="text-xs">Excluir fila</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg font-semibold">Excluir fila?</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm">
                        Esta ação não pode ser desfeita. Para confirmar a exclusão da fila "{fila.nome}", 
                        digite o nome da fila abaixo:
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-3">
                      <input
                        type="text"
                        placeholder="Digite o nome da fila"
                        value={deleteConfirmName}
                        onChange={(e) => setDeleteConfirmName(e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir fila
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipProvider>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}