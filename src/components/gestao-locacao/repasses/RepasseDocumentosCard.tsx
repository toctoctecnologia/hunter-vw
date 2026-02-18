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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Plus, Download, Eye, Trash2, Upload } from 'lucide-react';

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
  tamanho: string;
  url?: string;
}

interface RepasseDocumentosCardProps {
  documentos: Documento[];
  onAddDocumento: (documento: Omit<Documento, 'id'>) => void;
  onRemoveDocumento: (id: string) => void;
}

export function RepasseDocumentosCard({
  documentos,
  onAddDocumento,
  onRemoveDocumento,
}: RepasseDocumentosCardProps) {
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [novoDoc, setNovoDoc] = useState({
    nome: '',
    tipo: '',
  });

  const handleAdd = () => {
    // TODO: Integrate with file upload API
    onAddDocumento({
      nome: novoDoc.nome,
      tipo: novoDoc.tipo,
      data: new Date().toLocaleDateString('pt-BR'),
      tamanho: '0 KB',
    });
    setNovoDoc({ nome: '', tipo: '' });
    setIsAddingOpen(false);
  };

  const handleDownload = (doc: Documento) => {
    // TODO: Implement actual download
    console.log('Download:', doc);
  };

  const handleView = (doc: Documento) => {
    // TODO: Implement actual view
    console.log('View:', doc);
  };

  return (
    <>
      <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[var(--ui-text)] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documentos
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingOpen(true)}
              className="h-7 text-xs text-[hsl(var(--link))] hover:bg-[hsl(var(--accent))]/10 rounded-lg"
            >
              <Plus className="w-3 h-3 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <div className="text-center py-6">
              <FileText className="w-6 h-6 mx-auto text-[var(--ui-text-subtle)] opacity-50 mb-2" />
              <p className="text-xs text-[var(--ui-text-subtle)]">Nenhum documento anexado</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingOpen(true)}
                className="mt-3 h-8 text-xs rounded-lg border-dashed"
              >
                <Upload className="w-3 h-3 mr-1" />
                Enviar documento
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 bg-[var(--ui-stroke)]/10 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-[var(--ui-text-subtle)] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--ui-text)] truncate">
                        {doc.nome}
                      </p>
                      <p className="text-xs text-[var(--ui-text-subtle)]">
                        {doc.tipo} • {doc.data} • {doc.tamanho}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(doc)}
                      className="h-7 w-7 rounded-md hover:bg-[var(--ui-stroke)]"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(doc)}
                      className="h-7 w-7 rounded-md hover:bg-[var(--ui-stroke)]"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveDocumento(doc.id)}
                      className="h-7 w-7 rounded-md text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger)/0.08)]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Document Modal */}
      <Dialog open={isAddingOpen} onOpenChange={setIsAddingOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[var(--ui-text)]">Adicionar documento</DialogTitle>
            <DialogDescription className="text-[var(--ui-text-subtle)]">
              Anexe comprovantes, extratos ou outros documentos relacionados à transferência.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-[var(--ui-stroke)] rounded-xl p-6 text-center">
              <Upload className="w-8 h-8 mx-auto text-[var(--ui-text-subtle)] mb-2" />
              <p className="text-sm text-[var(--ui-text)]">Arraste arquivos aqui ou</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 h-8 text-xs rounded-lg"
              >
                Selecionar arquivo
              </Button>
              <p className="text-xs text-[var(--ui-text-subtle)] mt-2">
                PDF, JPG, PNG até 10MB
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Nome do documento</Label>
              <Input
                value={novoDoc.nome}
                onChange={(e) => setNovoDoc({ ...novoDoc, nome: e.target.value })}
                className="h-10 rounded-xl border-[var(--ui-stroke)]"
                placeholder="Ex: Comprovante de transferência"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Tipo de documento</Label>
              <Select
                value={novoDoc.tipo}
                onValueChange={(v) => setNovoDoc({ ...novoDoc, tipo: v })}
              >
                <SelectTrigger className="h-10 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="comprovante">Comprovante de pagamento</SelectItem>
                  <SelectItem value="extrato">Extrato bancário</SelectItem>
                  <SelectItem value="recibo">Recibo</SelectItem>
                  <SelectItem value="nota_fiscal">Nota fiscal</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddingOpen(false)}
              className="rounded-xl border-[var(--ui-stroke)]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!novoDoc.nome || !novoDoc.tipo}
              className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
            >
              Adicionar documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RepasseDocumentosCard;
