import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Save, Loader2, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Fila } from '@/types/filas';
import { useFilasStore } from '@/state/distribuicao/filas.store';
import FilaCard from './FilaCard';

interface FilasListTabProps {
  searchValue?: string;
}

export default function FilasListTab({ searchValue = '' }: FilasListTabProps) {
  const navigate = useNavigate();
  const {
    filas,
    carregarFilas,
    reordenar,
    salvarOrdem,
    atualizarFila,
    excluirFila,
    redistribuirFila,
  } = useFilasStore();
  
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previousOrder, setPreviousOrder] = useState<Fila[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFilaData, setNewFilaData] = useState<{
    tipo: 'Personalizada' | 'Padrão';
    nome: string;
  }>({
    tipo: 'Personalizada',
    nome: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter filas based on search value
  const filteredFilas = useMemo(() => {
    if (!searchValue.trim()) {
      return filas;
    }

    const query = searchValue.toLowerCase();
    return filas.filter(fila => {
      if (fila.nome.toLowerCase().includes(query)) return true;
      
      if (fila.regras.some(regra => 
        regra.campo.toLowerCase().includes(query) ||
        String(regra.valor).toLowerCase().includes(query)
      )) return true;
      
      if (fila.usuarios.some(usuario => 
        usuario.nome.toLowerCase().includes(query) ||
        usuario.email?.toLowerCase().includes(query)
      )) return true;
      
      return false;
    });
  }, [searchValue, filas]);

  useEffect(() => {
    const loadFilas = async () => {
      try {
        setLoading(true);
        await carregarFilas();
      } catch (error) {
        console.error('Erro ao carregar filas:', error);
        toast.error('Erro ao carregar filas');
      } finally {
        setLoading(false);
      }
    };

    loadFilas();
  }, [carregarFilas]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const current = useFilasStore.getState().filas;

      if (!hasChanges) {
        setPreviousOrder(current);
      }

      const oldIndex = current.findIndex(item => item.id === active.id);
      const newIndex = current.findIndex(item => item.id === over.id);
      const newOrder = arrayMove(current, oldIndex, newIndex).map((item, index) => ({
        ...item,
        prioridade: index + 1,
      }));
      reordenar(newOrder);
      setHasChanges(true);
    }
  };

  const handleSaveOrder = async () => {
    try {
      setIsSaving(true);
      await salvarOrdem();
      setHasChanges(false);
      setPreviousOrder([]);
      toast.success('Ordem das filas salva com sucesso');
    } catch (error) {
      console.error('Erro ao salvar ordem:', error);
      reordenar(previousOrder);
      setHasChanges(false);
      setPreviousOrder([]);
      toast.error('Erro ao salvar ordem das filas');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateFila = async () => {
    if (!newFilaData.nome.trim()) {
      toast.error('Nome da fila é obrigatório');
      return;
    }

    try {
      const newFila: Omit<Fila, 'id' | 'createdAt' | 'updatedAt'> = {
        tipo: newFilaData.tipo,
        nome: newFilaData.nome.trim(),
        prioridade: filas.length + 1,
        regras: [],
        usuarios: [],
        leadsRecebidos: 0,
        ativosNaFila: 0,
        configHorarioCheckin: {
          habilitarJanela: false,
          diasSemana: ['seg', 'ter', 'qua', 'qui', 'sex'],
          horaInicio: '08:00',
          horaFim: '18:00',
          exigeCheckin: false,
          habilitarQrCode: false
        },
        configAvancadas: {
          redistribuicaoAtiva: false,
          preservarPosicaoIndisponivel: false
        },
        habilitada: true
      };

      const createdFila = await atualizarFila(newFila);
      setIsCreateDialogOpen(false);
      setNewFilaData({ tipo: 'Personalizada', nome: '' });
      toast.success('Fila criada com sucesso');
      
      navigate(`/distribuicao/${createdFila.id}`);
    } catch (error) {
      console.error('Erro ao criar fila:', error);
      toast.error('Erro ao criar fila');
    }
  };

  const handleToggleFila = async (filaId: string, habilitada: boolean) => {
    try {
      await atualizarFila({ id: filaId, habilitada });
      toast.success(`Fila ${habilitada ? 'ativada' : 'desativada'} com sucesso`);
    } catch (error) {
      console.error('Erro ao alterar status da fila:', error);
      toast.error('Erro ao alterar status da fila');
    }
  };

  const handleDeleteFila = async (filaId: string) => {
    await excluirFila(filaId);
  };

  const handleRedistribuir = async (filaId: string) => {
    try {
      await redistribuirFila(filaId);
      toast.success('Redistribuição executada com sucesso');
    } catch (error) {
      console.error('Erro ao redistribuir:', error);
      toast.error('Erro ao executar redistribuição');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-3 text-sm text-muted-foreground">Carregando filas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Filas de distribuição</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie as regras de distribuição automática de leads
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar fila
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Nova fila de distribuição</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm font-medium">Tipo de fila</Label>
                <Select 
                  value={newFilaData.tipo}
                  onValueChange={(value: 'Personalizada' | 'Padrão') => 
                    setNewFilaData(prev => ({ ...prev, tipo: value }))
                  }
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-popover">
                    <SelectItem value="Personalizada">Personalizada</SelectItem>
                    <SelectItem value="Padrão">Padrão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">Nome da fila</Label>
                <Input
                  id="nome"
                  value={newFilaData.nome}
                  onChange={(e) => setNewFilaData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Captação de corretor"
                  className="rounded-xl h-11"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl">
                  Cancelar
                </Button>
                <Button onClick={handleCreateFila} className="rounded-xl">
                  Criar fila
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Save Order Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button onClick={handleSaveOrder} size="lg" className="shadow-xl rounded-xl" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar ordem
              </>
            )}
          </Button>
        </div>
      )}

      {/* Filas List */}
      {filteredFilas.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
            <ListFilter className="h-6 w-6 text-muted-foreground" />
          </div>
          {searchValue ? (
            <>
              <p className="text-foreground font-medium">Nenhuma fila encontrada</p>
              <p className="text-sm text-muted-foreground mt-1">Não encontramos resultados para "{searchValue}"</p>
            </>
          ) : (
            <>
              <p className="text-foreground font-medium">Nenhuma fila criada</p>
              <p className="text-sm text-muted-foreground mt-1">Comece criando sua primeira fila de distribuição</p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="mt-4 rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira fila
              </Button>
            </>
          )}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredFilas.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {filteredFilas.map((fila) => (
                <FilaCard
                  key={fila.id}
                  fila={fila}
                  onToggle={handleToggleFila}
                  onDelete={handleDeleteFila}
                  onRedistribute={handleRedistribuir}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}