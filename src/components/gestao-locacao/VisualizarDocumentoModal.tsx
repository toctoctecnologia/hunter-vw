import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
}

interface VisualizarDocumentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documento: Documento | null;
}

export function VisualizarDocumentoModal({ 
  open, 
  onOpenChange, 
  documento 
}: VisualizarDocumentoModalProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: 'Download iniciado',
      description: `Baixando ${documento?.nome}...`,
    });
  };

  if (!documento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] rounded-2xl flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="w-5 h-5 text-[hsl(var(--accent))]" />
              {documento.nome}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          <p className="text-sm text-[var(--ui-text-subtle)]">
            Adicionado em {documento.data}
          </p>
        </DialogHeader>

        <div className="flex-1 bg-[var(--ui-stroke)]/20 rounded-xl flex items-center justify-center overflow-hidden">
          {/* Placeholder for document preview */}
          <div className="text-center p-8">
            <FileText className="w-16 h-16 text-[var(--ui-text-subtle)] mx-auto mb-4" />
            <p className="text-[var(--ui-text-subtle)]">
              Pré-visualização do documento
            </p>
            <p className="text-sm text-[var(--ui-text-subtle)] mt-2">
              {documento.nome}
            </p>
            {/* In a real implementation, you would render a PDF viewer or image here */}
            <div className="mt-6 p-8 bg-[var(--ui-card)] rounded-xl border border-[var(--ui-stroke)] max-w-md mx-auto">
              <div className="space-y-3">
                <div className="h-4 bg-[var(--ui-stroke)]/50 rounded w-3/4"></div>
                <div className="h-4 bg-[var(--ui-stroke)]/50 rounded w-full"></div>
                <div className="h-4 bg-[var(--ui-stroke)]/50 rounded w-5/6"></div>
                <div className="h-4 bg-[var(--ui-stroke)]/50 rounded w-2/3"></div>
                <div className="h-4 bg-[var(--ui-stroke)]/50 rounded w-full"></div>
                <div className="h-4 bg-[var(--ui-stroke)]/50 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
