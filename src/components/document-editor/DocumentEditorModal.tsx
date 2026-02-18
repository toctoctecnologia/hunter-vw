import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { Link } from 'react-router-dom';

interface DocumentEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
  initialContent: string;
  onSave: (name: string, content: string) => void;
  breadcrumb?: { label: string; path?: string }[];
}

const defaultContractContent = `
<p style="text-align: center;"><strong>CONTRATO DE INTERMEDIAÇÃO IMOBILIÁRIA PARA FINS DE LOCAÇÃO</strong></p>

<p>Por este instrumento particular, as partes qualificadas na Cláusula 1ª têm entre si justa e acertada a presente relação contratual.</p>

<p><strong>CLÁUSULA 1ª - QUALIFICAÇÃO DAS PARTES</strong></p>

<p>2.1 Proprietário (s) – <strong>Maria Santos</strong>, <span style="background-color: #FEF3C7; color: #FF5506;">Nacionalidade</span>, Viúvo(a), portador(a) da cédula de identidade R.G. n.º <span style="background-color: #FEF3C7; color: #FF5506;">Número R.G.</span> e CPF nº 111.222.333-44 residente e domiciliado(a) na Rua Exemplo, nº 100, Centro, São Paulo/SP, CEP 01000-000, neste ato representado(a) por sua bastante procuradora Imobiliária Demo, doravante denominada simplesmente ADMINISTRADORA.</p>

<p>2.2 – Intermediador (es) - <strong>João Exemplo</strong>, Brasileiro, Solteiro(a), <span style="background-color: #FEF3C7; color: #FF5506;">Profissão</span>, inscrito no CRECI-UF sob n.º 00123, portador da cédula de identidade R.G. n.º 12345698 e CPF n.º 222.333.444-55 localizada na Rua Horizonte, nº 1000, Centro, São Paulo/SP, CEP 01000-000</p>

<p><strong>CLÁUSULA 2ª - OBJETO DO CONTRATO</strong></p>

<p>O presente contrato tem por finalidade a intermediação, por parte do CONTRATADO,<br/>
na venda do imóvel descrito a seguir, de propriedade do CONTRATANTE:<br/>
Endereço do Imóvel: Apartamento, Rua Exemplo, nº 100, Centro, São Paulo/SP, CEP 01000-000<br/>
Número de Matrícula no Cartório de Registro de Imóveis: <span style="background-color: #FEF3C7; color: #FF5506;">N.º da matrícula</span><br/>
Descrição: 2 DORM, 1 BANHEIRO, 1 GARAGEM<br/>
Parágrafo Único - O CONTRATO declara que o imóvel referido no "caput" desta Cláusula encontra-se totalmente desembaraçado de qualquer ônus ou gravame, inclusive de natureza tributária.</p>

<p><strong>CLÁUSULA 3ª - PRAZO</strong></p>

<p>O presente contrato tem prazo de vigência de 30 (trinta) meses, contados a partir da data de assinatura, podendo ser prorrogado mediante acordo entre as partes.</p>

<p><strong>CLÁUSULA 4ª - VALOR DO ALUGUEL</strong></p>

<p>O valor do aluguel mensal será de R$ 1.500,00 (mil e quinhentos reais), reajustado anualmente pelo índice IGP-M ou outro índice que venha a substituí-lo.</p>
`;

export const DocumentEditorModal = ({
  open,
  onOpenChange,
  documentName,
  initialContent,
  onSave,
  breadcrumb = []
}: DocumentEditorModalProps) => {
  const [name, setName] = useState(documentName);
  const [content, setContent] = useState(initialContent || defaultContractContent);

  const handleSave = () => {
    onSave(name, content);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col rounded-2xl p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Edição de documento</DialogTitle>
        </DialogHeader>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--ui-text-subtle)] px-6 pt-5 pb-3 border-b border-[var(--ui-stroke)]">
          <Link to="/gestao-locacao" className="hover:text-[var(--ui-text)]">INÍCIO</Link>
          <span>›</span>
          <Link to="/gestao-locacao/contratos" className="hover:text-[var(--ui-text)]">CONTRATOS</Link>
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              <span>›</span>
              {item.path ? (
                <Link to={item.path} className="hover:text-[var(--ui-text)]">{item.label}</Link>
              ) : (
                <span className="text-[var(--ui-text)] font-medium">{item.label}</span>
              )}
            </span>
          ))}
          <span>›</span>
          <span className="text-[var(--ui-text)] font-medium">GERAR DOCUMENTO</span>
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--ui-stroke)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[var(--brand-primary)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--ui-text)]">Edição de documento</h2>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[var(--brand-primary)]">
              Nome<span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl border-[var(--ui-stroke)] focus:border-[var(--brand-primary)] focus:ring-[var(--brand-focus)]"
              placeholder="Nome do documento"
            />
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <RichTextEditor 
            content={content} 
            onChange={setContent} 
            className="h-full"
          />
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-[var(--ui-stroke)] bg-gray-50">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-11 px-6 border-[var(--ui-stroke)]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="rounded-xl h-11 px-6 bg-[#1E3A5F] hover:bg-[#162D4A] text-white"
          >
            Gerar documento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentEditorModal;
