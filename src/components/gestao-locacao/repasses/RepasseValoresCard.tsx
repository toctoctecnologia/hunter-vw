import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DollarSign, Pencil, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface ItemValor {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'deducao';
}

export interface RepasseValores {
  itens: ItemValor[];
  totalBruto: number;
  totalDeducoes: number;
  totalLiquido: number;
}

interface RepasseValoresCardProps {
  valores: RepasseValores;
  onSave: (valores: RepasseValores) => void;
  status: string;
}

export function RepasseValoresCard({ valores, onSave, status }: RepasseValoresCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editItens, setEditItens] = useState<ItemValor[]>(valores.itens);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const calculateTotals = (itens: ItemValor[]) => {
    const totalBruto = itens
      .filter((i) => i.tipo === 'receita')
      .reduce((acc, i) => acc + i.valor, 0);
    const totalDeducoes = itens
      .filter((i) => i.tipo === 'deducao')
      .reduce((acc, i) => acc + i.valor, 0);
    const totalLiquido = totalBruto - totalDeducoes;
    return { totalBruto, totalDeducoes, totalLiquido };
  };

  const { totalBruto, totalDeducoes, totalLiquido } = calculateTotals(editItens);

  const handleAddItem = () => {
    const newItem: ItemValor = {
      id: Date.now().toString(),
      descricao: '',
      valor: 0,
      tipo: 'receita',
    };
    setEditItens([...editItens, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setEditItens(editItens.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof ItemValor, value: any) => {
    setEditItens(
      editItens.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = () => {
    const totals = calculateTotals(editItens);
    onSave({
      itens: editItens,
      ...totals,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditItens(valores.itens);
    setIsEditing(false);
  };

  const isPagoOuCancelado = status === 'Pago' || status === 'Cancelado' || status === 'Estornado';

  const receitas = valores.itens.filter((i) => i.tipo === 'receita');
  const deducoes = valores.itens.filter((i) => i.tipo === 'deducao');

  return (
    <>
      <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Valores
            </CardTitle>
            {!isPagoOuCancelado && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-[hsl(var(--link))] hover:bg-[hsl(var(--accent))]/10 rounded-lg"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Editar valores
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPagoOuCancelado && (
            <Alert className="rounded-xl border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.12)] mb-4">
              <AlertCircle className="h-4 w-4 text-[hsl(var(--warning))]" />
              <AlertDescription className="text-[hsl(var(--textSecondary))] text-sm">
                Transferência {status.toLowerCase()}. Alterações de valores exigem perfil adequado.
              </AlertDescription>
            </Alert>
          )}

          {/* Receitas */}
          <div className="space-y-2">
            {receitas.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b border-[var(--ui-stroke)]/50"
              >
                <span className="text-sm text-[var(--ui-text)]">{item.descricao}</span>
                <span className="text-sm font-medium text-[var(--ui-text)]">
                  {formatCurrency(item.valor)}
                </span>
              </div>
            ))}
          </div>

          {/* Deduções */}
          {deducoes.length > 0 && (
            <div className="space-y-2">
              {deducoes.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-[var(--ui-stroke)]/50"
                >
                  <span className="text-sm text-[var(--ui-text)]">{item.descricao}</span>
                  <span className="text-sm font-medium text-[hsl(var(--danger))]">
                    - {formatCurrency(item.valor)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Totais */}
          <div className="pt-4 space-y-2 border-t border-[var(--ui-stroke)]">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--ui-text-subtle)]">Total bruto</span>
              <span className="text-sm font-medium text-[var(--ui-text)]">
                {formatCurrency(valores.totalBruto)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--ui-text-subtle)]">Total deduções</span>
              <span className="text-sm font-medium text-[hsl(var(--danger))]">
                - {formatCurrency(valores.totalDeducoes)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[var(--ui-stroke)]">
              <span className="text-base font-semibold text-[var(--ui-text)]">Total líquido</span>
              <span className="text-lg font-bold text-[hsl(var(--success))]">
                {formatCurrency(valores.totalLiquido)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[var(--ui-text)]">Editar valores da transferência</DialogTitle>
            <DialogDescription className="text-[var(--ui-text-subtle)]">
              Adicione, edite ou remova itens da transferência.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Items List */}
            <div className="space-y-3">
              {editItens.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-[var(--ui-stroke)]/10 rounded-xl"
                >
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <Label className="text-xs text-[var(--ui-text-subtle)]">Descrição</Label>
                      <Input
                        value={item.descricao}
                        onChange={(e) => handleUpdateItem(item.id, 'descricao', e.target.value)}
                        className="h-9 rounded-lg border-[var(--ui-stroke)] text-sm"
                        placeholder="Ex: Aluguel"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-[var(--ui-text-subtle)]">Valor</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.valor}
                        onChange={(e) =>
                          handleUpdateItem(item.id, 'valor', parseFloat(e.target.value) || 0)
                        }
                        className="h-9 rounded-lg border-[var(--ui-stroke)] text-sm"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={item.tipo}
                      onChange={(e) =>
                        handleUpdateItem(item.id, 'tipo', e.target.value as 'receita' | 'deducao')
                      }
                      className="h-9 px-2 rounded-lg border border-[var(--ui-stroke)] text-sm bg-background"
                    >
                      <option value="receita">Receita</option>
                      <option value="deducao">Dedução</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-8 w-8 text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger)/0.08)] rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={handleAddItem}
              className="w-full rounded-xl border-dashed border-[var(--ui-stroke)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar item
            </Button>

            {/* Calculated Totals */}
            <div className="bg-[var(--ui-stroke)]/20 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--ui-text-subtle)]">Total bruto</span>
                <span className="font-medium text-[var(--ui-text)]">{formatCurrency(totalBruto)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--ui-text-subtle)]">Total deduções</span>
                <span className="font-medium text-[hsl(var(--danger))]">- {formatCurrency(totalDeducoes)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--ui-stroke)]">
                <span className="font-semibold text-[var(--ui-text)]">Total líquido</span>
                <span className="text-lg font-bold text-[hsl(var(--success))]">{formatCurrency(totalLiquido)}</span>
              </div>
            </div>

            {totalLiquido < 0 && (
              <Alert className="rounded-xl border-[hsl(var(--danger)/0.4)] bg-[hsl(var(--danger)/0.12)]">
                <AlertCircle className="h-4 w-4 text-[hsl(var(--danger))]" />
                <AlertDescription className="text-[hsl(var(--textSecondary))] text-sm">
                  O valor líquido não pode ser negativo. Revise os valores inseridos.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-xl border-[var(--ui-stroke)]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
              disabled={totalLiquido < 0}
            >
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RepasseValoresCard;
