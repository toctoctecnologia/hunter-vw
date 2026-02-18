import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileText, Info, X } from 'lucide-react';
import { toast } from 'sonner';
import { mergePlaceholders, getDadosPreviewByTipo, type TipoContratoTemplate } from '@/types/contrato-padrao';

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateContent: string;
  templateName: string;
  accentColor?: string;
  logoUrl?: string | null;
  documentTitle?: string;
  tipoContrato?: TipoContratoTemplate;
}

export const PreviewModal = ({
  open,
  onOpenChange,
  templateContent,
  templateName,
  accentColor = '#f97316',
  logoUrl,
  documentTitle,
  tipoContrato = 'locacao',
}: PreviewModalProps) => {
  const previewContent = mergePlaceholders(templateContent, getDadosPreviewByTipo(tipoContrato));

  const createDownloadHtml = () => {
    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${documentTitle || templateName}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f5; margin: 0; padding: 24px; }
    .page { max-width: 816px; margin: 0 auto; background: #fff; border-top: 6px solid ${accentColor}; padding: 48px; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .title { color: ${accentColor}; font-size: 22px; font-weight: 700; margin: 0; }
    .logo { max-height: 72px; max-width: 120px; object-fit: contain; }
    p { color: #374151; line-height: 1.8; font-size: 14px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1 class="title">${documentTitle || templateName}</h1>
      ${logoUrl ? `<img class="logo" src="${logoUrl}" alt="Logo" />` : ''}
    </div>
    <div>${previewContent}</div>
  </div>
</body>
</html>`;

  };

  const getFileBaseName = () => (documentTitle || templateName).replace(/\s+/g, '-').toLowerCase();

  const handleDownloadWord = () => {
    const html = createDownloadHtml();
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${getFileBaseName()}.doc`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const html = createDownloadHtml();
    const previewWindow = window.open('', '_blank', 'noopener,noreferrer');

    if (!previewWindow) {
      toast.error('Não foi possível abrir a janela para gerar o PDF.');
      return;
    }

    previewWindow.document.open();
    previewWindow.document.write(html);
    previewWindow.document.close();
    previewWindow.focus();
    previewWindow.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col rounded-2xl p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Visualização de exemplo
              </DialogTitle>
              <Badge className="bg-blue-100 text-blue-700 border-0 font-medium">
                Simulação
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">{templateName}</p>
        </DialogHeader>

        {/* Info Banner */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Esta é uma visualização com dados fictícios. Os campos dinâmicos serão substituídos por dados reais ao gerar o documento final.
          </p>
        </div>

        {/* Preview Content */}
        <ScrollArea className="flex-1 bg-gray-100 p-6">
          <div className="max-w-[816px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-12 py-6 border-b border-gray-100 flex items-center justify-between" style={{ borderTop: `6px solid ${accentColor}` }}>
              <h2 className="text-lg font-semibold" style={{ color: accentColor }}>
                {documentTitle || templateName}
              </h2>
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo do contrato"
                  className="h-14 max-w-[120px] object-contain"
                />
              ) : null}
            </div>
            <div
              className="p-12 prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
              style={{ 
                lineHeight: '1.8',
                fontSize: '14px'
              }}
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            className="rounded-xl h-11 px-6 border-gray-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>

          <Button
            variant="outline"
            onClick={handleDownloadWord}
            className="rounded-xl h-11 px-6 border-gray-200"
          >
            <FileText className="w-4 h-4 mr-2" />
            Baixar Word
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-11 px-6 border-gray-200"
          >
            Fechar
          </Button>
          {/* TODO: Adicionar botão "Copiar como texto" se necessário */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
