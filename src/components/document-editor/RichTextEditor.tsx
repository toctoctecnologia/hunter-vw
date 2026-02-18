import { useRef, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Code,
  List,
  ListOrdered,
  IndentDecrease,
  IndentIncrease,
  Highlighter,
  Link2,
  Image,
  Save,
  Printer,
  Type,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  command: string;
  value?: string;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}

const ToolbarButton = ({ icon, command, value, active, onClick, title }: ToolbarButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      document.execCommand(command, false, value);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      className={cn(
        'p-2 rounded-lg hover:bg-gray-100 transition-colors',
        active && 'bg-gray-100 text-[var(--brand-primary)]'
      )}
    >
      {icon}
    </button>
  );
};

const ToolbarDivider = () => (
  <div className="w-px h-6 bg-[var(--ui-stroke)] mx-1" />
);

export const RichTextEditor = ({ content, onChange, className }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [blockFormat, setBlockFormat] = useState('normal');

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleBlockFormat = (value: string) => {
    setBlockFormat(value);
    switch (value) {
      case 'h1':
        document.execCommand('formatBlock', false, 'h1');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, 'h2');
        break;
      case 'h3':
        document.execCommand('formatBlock', false, 'h3');
        break;
      case 'normal':
        document.execCommand('formatBlock', false, 'p');
        break;
    }
  };

  const insertLink = () => {
    const url = prompt('Digite a URL do link:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  const insertImage = () => {
    const url = prompt('Digite a URL da imagem:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const setTextColor = (color: string) => {
    document.execCommand('foreColor', false, color);
  };

  const setHighlightColor = (color: string) => {
    document.execCommand('hiliteColor', false, color);
  };

  return (
    <div className={cn('border border-[var(--ui-stroke)] rounded-xl overflow-hidden bg-white', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-[var(--ui-stroke)] bg-gray-50">
        {/* Block Format */}
        <Select value={blockFormat} onValueChange={handleBlockFormat}>
          <SelectTrigger className="w-28 h-8 text-sm border-[var(--ui-stroke)] rounded-lg">
            <SelectValue placeholder="Normal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="h1">Título 1</SelectItem>
            <SelectItem value="h2">Título 2</SelectItem>
            <SelectItem value="h3">Título 3</SelectItem>
          </SelectContent>
        </Select>

        <ToolbarDivider />

        {/* Text Formatting */}
        <ToolbarButton icon={<Bold className="w-4 h-4" />} command="bold" title="Negrito (Ctrl+B)" />
        <ToolbarButton icon={<Italic className="w-4 h-4" />} command="italic" title="Itálico (Ctrl+I)" />
        <ToolbarButton icon={<Underline className="w-4 h-4" />} command="underline" title="Sublinhado (Ctrl+U)" />
        <ToolbarButton icon={<Strikethrough className="w-4 h-4" />} command="strikeThrough" title="Tachado" />

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton icon={<AlignLeft className="w-4 h-4" />} command="justifyLeft" title="Alinhar à esquerda" />
        <ToolbarButton icon={<AlignCenter className="w-4 h-4" />} command="justifyCenter" title="Centralizar" />
        <ToolbarButton icon={<AlignRight className="w-4 h-4" />} command="justifyRight" title="Alinhar à direita" />
        <ToolbarButton icon={<AlignJustify className="w-4 h-4" />} command="justifyFull" title="Justificar" />

        <ToolbarDivider />

        {/* Quote & Code */}
        <ToolbarButton 
          icon={<Quote className="w-4 h-4" />} 
          command="formatBlock" 
          value="blockquote" 
          title="Citação" 
        />
        <ToolbarButton icon={<Code className="w-4 h-4" />} command="formatBlock" value="pre" title="Código" />

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton icon={<List className="w-4 h-4" />} command="insertUnorderedList" title="Lista com marcadores" />
        <ToolbarButton icon={<ListOrdered className="w-4 h-4" />} command="insertOrderedList" title="Lista numerada" />
        <ToolbarButton icon={<IndentDecrease className="w-4 h-4" />} command="outdent" title="Diminuir recuo" />
        <ToolbarButton icon={<IndentIncrease className="w-4 h-4" />} command="indent" title="Aumentar recuo" />

        <ToolbarDivider />

        {/* Colors */}
        <div className="relative group">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
            title="Cor do texto"
          >
            <Type className="w-4 h-4" />
            <div className="w-3 h-1 bg-[var(--ui-text)]" />
          </button>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:flex flex-wrap gap-1 p-2 bg-white border border-[var(--ui-stroke)] rounded-lg shadow-lg z-10 w-32">
            {['#000000', '#FF5506', '#EF4444', '#22C55E', '#3B82F6', '#A855F7', '#6B7280'].map(color => (
              <button
                key={color}
                onClick={() => setTextColor(color)}
                className="w-6 h-6 rounded border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="relative group">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Destacar"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:flex flex-wrap gap-1 p-2 bg-white border border-[var(--ui-stroke)] rounded-lg shadow-lg z-10 w-32">
            {['#FEF3C7', '#DCFCE7', '#DBEAFE', '#F3E8FF', '#FFE4E6', '#E5E7EB'].map(color => (
              <button
                key={color}
                onClick={() => setHighlightColor(color)}
                className="w-6 h-6 rounded border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <ToolbarDivider />

        {/* Insert */}
        <ToolbarButton 
          icon={<Link2 className="w-4 h-4" />} 
          command="" 
          onClick={insertLink} 
          title="Inserir link" 
        />
        <ToolbarButton 
          icon={<Image className="w-4 h-4" />} 
          command="" 
          onClick={insertImage} 
          title="Inserir imagem" 
        />

        <ToolbarDivider />

        {/* Actions */}
        <ToolbarButton 
          icon={<Save className="w-4 h-4" />} 
          command="" 
          onClick={handleSave} 
          title="Salvar" 
        />
        <ToolbarButton 
          icon={<Type className="w-4 h-4 line-through" />} 
          command="removeFormat" 
          title="Limpar formatação" 
        />
        <ToolbarButton 
          icon={<Printer className="w-4 h-4" />} 
          command="" 
          onClick={handlePrint} 
          title="Imprimir" 
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[400px] p-6 focus:outline-none prose prose-sm max-w-none"
        style={{ 
          lineHeight: '1.8',
          fontSize: '14px'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default RichTextEditor;
