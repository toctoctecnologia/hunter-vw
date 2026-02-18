import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Plus, User } from 'lucide-react';

export interface NotaInterna {
  id: string;
  texto: string;
  autor: string;
  data: string;
  hora: string;
}

interface RepasseNotasCardProps {
  notas: NotaInterna[];
  onAddNota: (texto: string) => void;
}

export function RepasseNotasCard({ notas, onAddNota }: RepasseNotasCardProps) {
  const [novaNota, setNovaNota] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNota = () => {
    if (novaNota.trim()) {
      onAddNota(novaNota.trim());
      setNovaNota('');
      setIsAdding(false);
    }
  };

  return (
    <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
            <StickyNote className="w-4 h-4" />
            Notas internas
          </CardTitle>
          {!isAdding && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="h-7 text-xs text-[hsl(var(--link))] hover:bg-[hsl(var(--accent))]/10 rounded-lg"
            >
              <Plus className="w-3 h-3 mr-1" />
              Nova
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add Note Form */}
        {isAdding && (
          <div className="space-y-2 p-3 bg-[var(--ui-stroke)]/10 rounded-xl">
            <Textarea
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              placeholder="Digite sua nota aqui..."
              className="min-h-[80px] rounded-lg border-[var(--ui-stroke)] text-sm resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNovaNota('');
                  setIsAdding(false);
                }}
                className="h-8 text-xs rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleAddNota}
                disabled={!novaNota.trim()}
                className="h-8 text-xs rounded-lg bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
              >
                Adicionar
              </Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {notas.length === 0 && !isAdding ? (
          <div className="text-center py-6">
            <StickyNote className="w-6 h-6 mx-auto text-[var(--ui-text-subtle)] opacity-50 mb-2" />
            <p className="text-xs text-[var(--ui-text-subtle)]">Nenhuma nota registrada</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {notas.map((nota) => (
              <div
                key={nota.id}
                className="p-3 bg-[var(--ui-stroke)]/10 rounded-xl space-y-2"
              >
                <p className="text-sm text-[var(--ui-text)] whitespace-pre-wrap">{nota.texto}</p>
                <div className="flex items-center gap-1 text-xs text-[var(--ui-text-subtle)]">
                  <User className="w-3 h-3" />
                  <span>{nota.autor}</span>
                  <span>•</span>
                  <span>{nota.data} às {nota.hora}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RepasseNotasCard;
