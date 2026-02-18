import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

import { getNoteTypeLabel, getNoteTypeVariant } from '@/shared/lib/utils';
import { PropertyNoteType } from '@/shared/types';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function UpdatesCard({ form }: DataCardProps) {
  const { user } = useAuth();
  const [newNoteType, setNewNoteType] = useState<PropertyNoteType>(PropertyNoteType.INFO);
  const [newNoteDescription, setNewNoteDescription] = useState('');

  return (
    <Card>
      <CardHeader title="Atualizações" />

      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => {
            const handleAddNote = () => {
              if (!newNoteDescription.trim()) {
                toast.error('Por favor, adicione uma descrição para a atualização');
                return;
              }

              const newNote = {
                id: `note-${Date.now()}-new-note`,
                noteType: newNoteType,
                description: newNoteDescription,
              };
              field.onChange([...field.value, newNote]);

              // Limpar formulário
              setNewNoteType(PropertyNoteType.INFO);
              setNewNoteDescription('');
              toast.success('Atualização adicionada! Salve o formulário para enviar.');
            };

            const handleRemoveNote = (noteId: string) => {
              field.onChange(field.value.filter((note) => note.id !== noteId));
            };

            const existingNotes = field.value?.filter((note) => !note.id?.endsWith('-new-note')) || [];
            const newNotes = field.value?.filter((note) => note.id?.endsWith('-new-note')) || [];

            return (
              <FormItem>
                <div className="space-y-4">
                  {/* Lista de Atualizações Existentes */}
                  {existingNotes.length > 0 && (
                    <div className="space-y-3">
                      <FormLabel>Atualizações Anteriores</FormLabel>
                      <div className="space-y-2">
                        {existingNotes.map((note) => (
                          <div key={note.id} className="p-3 rounded-lg border bg-muted/30 space-y-2">
                            <Badge variant={getNoteTypeVariant(note.noteType)}>{getNoteTypeLabel(note.noteType)}</Badge>
                            <p className="text-sm whitespace-pre-wrap">{note.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lista de Novas Atualizações Pendentes */}
                  {newNotes.length > 0 && (
                    <div className="space-y-3">
                      <FormLabel>Novas Atualizações (Pendentes de Envio)</FormLabel>
                      <div className="space-y-2">
                        {newNotes.map((note) => (
                          <div key={note.id} className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-2 flex-1">
                                <Badge variant={getNoteTypeVariant(note.noteType)}>{getNoteTypeLabel(note.noteType)}</Badge>
                                <p className="text-sm whitespace-pre-wrap">{note.description}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveNote(note.id!)}
                                className="hover:text-destructive shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Formulário para Nova Atualização */}
                  <div className="space-y-3">
                    <FormLabel>Adicionar Nova Atualização</FormLabel>
                    <div className="p-4 rounded-lg border-2 border-dashed space-y-3">
                      <Select value={newNoteType} onValueChange={(value) => setNewNoteType(value as PropertyNoteType)}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PropertyNoteType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {getNoteTypeLabel(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Textarea
                        placeholder="Descreva a atualização..."
                        value={newNoteDescription}
                        onChange={(e) => setNewNoteDescription(e.target.value)}
                        rows={3}
                      />

                      {hasFeature(user?.userInfo.profile.permissions, '2507') && (
                        <Button type="button" onClick={handleAddNote} className="w-full">
                          Adicionar à Lista
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
