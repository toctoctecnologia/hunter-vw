import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, Pencil, X, Check, Plus, Trash2, AlertTriangle } from 'lucide-react';

interface FaturaItem {
  id: string;
  categoria: string;
  valor: number;
}

interface FaturaValores {
  itens: FaturaItem[];
  multa: number;
  juros: number;
  desconto: number;
  total: number;
}

interface FaturaValoresCardProps {
  valores: FaturaValores;
  status: string;
  onSave: (valores: FaturaValores) => void;
}

const categoriaOptions = [
  { value: 'aluguel', label: 'Aluguel' },
  { value: 'condominio', label: 'Condomínio' },
  { value: 'iptu', label: 'IPTU' },
  { value: 'taxa_administracao', label: 'Taxa de administração' },
  { value: 'taxa_bancaria', label: 'Taxa bancária' },
  { value: 'seguro', label: 'Seguro' },
  { value: 'outros', label: 'Outros' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

export const FaturaValoresCard = ({ valores, status, onSave }: FaturaValoresCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editItens, setEditItens] = useState<FaturaItem[]>(valores.itens);
  const [editMulta, setEditMulta] = useState(valores.multa);
  const [editJuros, setEditJuros] = useState(valores.juros);
  const [editDesconto, setEditDesconto] = useState(valores.desconto);
  const [calculatedTotal, setCalculatedTotal] = useState(valores.total);

  const isBlocked = status === 'Paga' || status === 'Cancelada';
  // TODO: This flag should come from backend permissions
  const canEditBlocked = false;

  useEffect(() => {
    const itensTotal = editItens.reduce((sum, item) => sum + item.valor, 0);
    const total = itensTotal + editMulta + editJuros - editDesconto;
    setCalculatedTotal(total);
  }, [editItens, editMulta, editJuros, editDesconto]);

  const handleEdit = () => {
    if (isBlocked && !canEditBlocked) return;
    setEditItens([...valores.itens]);
    setEditMulta(valores.multa);
    setEditJuros(valores.juros);
    setEditDesconto(valores.desconto);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditItens(valores.itens);
    setEditMulta(valores.multa);
    setEditJuros(valores.juros);
    setEditDesconto(valores.desconto);
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave({
      itens: editItens,
      multa: editMulta,
      juros: editJuros,
      desconto: editDesconto,
      total: calculatedTotal,
    });
    setIsEditing(false);
  };

  const handleAddItem = () => {
    const newItem: FaturaItem = {
      id: `item-${Date.now()}`,
      categoria: 'outros',
      valor: 0,
    };
    setEditItens([...editItens, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setEditItens(editItens.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: 'categoria' | 'valor', value: string | number) => {
    setEditItens(editItens.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const getCategoriaLabel = (categoria: string) => {
    return categoriaOptions.find(opt => opt.value === categoria)?.label || categoria;
  };

  return (
    <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Valores
          </CardTitle>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              disabled={isBlocked && !canEditBlocked}
              className="text-[var(--ui-text-subtle)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-stroke)]/50 rounded-lg disabled:opacity-50"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Editar valores
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-[var(--ui-text-subtle)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-stroke)]/50 rounded-lg"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] rounded-lg"
              >
                <Check className="w-4 h-4 mr-1" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isBlocked && (
          <Alert className="mb-4 rounded-xl border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.12)]">
            <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />
            <AlertDescription className="text-[hsl(var(--textSecondary))] text-sm">
              Este boleto está {status.toLowerCase()}. Alterações de valores exigem perfil com permissão especial.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {/* Items list */}
          {isEditing ? (
            <>
              {editItens.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2">
                  <Select
                    value={item.categoria}
                    onValueChange={(value) => handleItemChange(item.id, 'categoria', value)}
                  >
                    <SelectTrigger className="w-[180px] rounded-xl border-[var(--ui-stroke)] h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {categoriaOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    value={formatCurrency(item.valor).replace('R$', '').trim()}
                    onChange={(e) => handleItemChange(item.id, 'valor', parseCurrency(e.target.value))}
                    className="flex-1 rounded-xl border-[var(--ui-stroke)] h-10 text-right"
                    placeholder="0,00"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-[hsl(var(--danger))] hover:text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger)/0.08)] rounded-lg h-10 w-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="mt-2 rounded-xl border-dashed border-[var(--ui-stroke)] text-[var(--ui-text-subtle)] hover:text-[var(--ui-text)]"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar item
              </Button>
            </>
          ) : (
            valores.itens.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <span className="text-sm text-[var(--ui-text-subtle)]">{getCategoriaLabel(item.categoria)}</span>
                <span className="text-sm font-medium text-[var(--ui-text)]">{formatCurrency(item.valor)}</span>
              </div>
            ))
          )}

          <Separator className="my-3" />

          {/* Multa, Juros, Desconto */}
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm text-[hsl(var(--danger))]">Multa de atraso</Label>
                <Input
                  type="text"
                  value={formatCurrency(editMulta).replace('R$', '').trim()}
                  onChange={(e) => setEditMulta(parseCurrency(e.target.value))}
                  className="w-[150px] rounded-xl border-[var(--ui-stroke)] h-10 text-right"
                  placeholder="0,00"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm text-[hsl(var(--danger))]">Juros de atraso</Label>
                <Input
                  type="text"
                  value={formatCurrency(editJuros).replace('R$', '').trim()}
                  onChange={(e) => setEditJuros(parseCurrency(e.target.value))}
                  className="w-[150px] rounded-xl border-[var(--ui-stroke)] h-10 text-right"
                  placeholder="0,00"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm text-[hsl(var(--success))]">Desconto concedido</Label>
                <Input
                  type="text"
                  value={formatCurrency(editDesconto).replace('R$', '').trim()}
                  onChange={(e) => setEditDesconto(parseCurrency(e.target.value))}
                  className="w-[150px] rounded-xl border-[var(--ui-stroke)] h-10 text-right"
                  placeholder="0,00"
                />
              </div>
            </div>
          ) : (
            <>
              {valores.multa > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-[hsl(var(--danger))]">Multa</span>
                  <span className="text-sm font-medium text-[hsl(var(--danger))]">{formatCurrency(valores.multa)}</span>
                </div>
              )}
              {valores.juros > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-[hsl(var(--danger))]">Juros</span>
                  <span className="text-sm font-medium text-[hsl(var(--danger))]">{formatCurrency(valores.juros)}</span>
                </div>
              )}
              {valores.desconto > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-[hsl(var(--success))]">Desconto</span>
                  <span className="text-sm font-medium text-[hsl(var(--success))]">-{formatCurrency(valores.desconto)}</span>
                </div>
              )}
            </>
          )}

          <Separator className="my-3" />

          {/* Total */}
          <div className="flex justify-between items-center py-2">
            <span className="text-base font-semibold text-[var(--ui-text)]">Total</span>
            <span className="text-lg font-bold text-[hsl(var(--accent))]">
              {formatCurrency(isEditing ? calculatedTotal : valores.total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaturaValoresCard;
