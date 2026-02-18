import { useRef, useCallback, useState, useEffect } from 'react';
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Plus,
  SearchCheck,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getCamposDinamicosByTipo, type TipoContratoTemplate } from '@/types/contrato-padrao';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContractRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  onInsertPlaceholder?: (placeholder: string) => void;
  tipoContrato?: TipoContratoTemplate;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  command: string;
  value?: string;
  active?: boolean;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
  onMouseDown?: () => void;
}

const ToolbarButton = ({ icon, command, value, active, onClick, title, disabled, onMouseDown }: ToolbarButtonProps) => {
  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else {
      document.execCommand(command, false, value);
    }
  };

  return (
    <button
      type="button"
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown?.();
      }}
      onClick={handleClick}
      title={title}
      disabled={disabled}
      className={cn(
        'p-2 rounded-lg transition-colors',
        'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
        active && 'bg-orange-100 text-orange-600'
      )}
    >
      {icon}
    </button>
  );
};

const ToolbarDivider = () => (
  <div className="w-px h-6 bg-gray-200 mx-1" />
);

export const ContractRichTextEditor = ({ 
  content, 
  onChange, 
  className,
  tipoContrato = 'locacao',
}: ContractRichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [blockFormat, setBlockFormat] = useState('normal');
  const [isFieldsPopoverOpen, setIsFieldsPopoverOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [languageIssues, setLanguageIssues] = useState<Array<{ trecho: string; mensagem: string; sugestao: string }>>([]);
  const camposDinamicos = getCamposDinamicosByTipo(tipoContrato);

  // Store selection for inserting placeholders
  const selectionRef = useRef<{ range: Range | null }>({ range: null });

  useEffect(() => {
    // Add styles for placeholders
    const style = document.createElement('style');
    style.textContent = `
      .contract-editor .placeholder {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        margin: 0 2px;
        border-radius: 6px;
        background-color: rgb(255 237 213);
        color: rgb(194 65 12);
        border: 1px solid rgb(253 186 116);
        font-family: ui-monospace, monospace;
        font-size: 0.875em;
        cursor: default;
        user-select: all;
      }
      .contract-editor .placeholder:hover {
        background-color: rgb(254 215 170);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const checkPortugueseIssues = useCallback(() => {
    if (!editorRef.current) return;

    const text = editorRef.current.innerText.toLowerCase();
    const rules = [
      { regex: /\ba gente vamos\b/g, mensagem: 'Possível erro de concordância verbal.', sugestao: 'Use "a gente vai".' },
      { regex: /\bpara mim fazer\b/g, mensagem: 'Construção inadequada com "mim".', sugestao: 'Use "para eu fazer".' },
      { regex: /\bhouveram\b/g, mensagem: 'Verbo haver impessoal não vai ao plural.', sugestao: 'Use "houve".' },
      { regex: /\bmenas\b/g, mensagem: 'Forma não padrão.', sugestao: 'Use "menos".' },
      { regex: /\bseje\b/g, mensagem: 'Forma verbal não padrão.', sugestao: 'Use "seja".' },
    ];

    const issues = rules.flatMap((rule) => {
      const matches = [...text.matchAll(rule.regex)];
      return matches.map((match) => ({
        trecho: match[0],
        mensagem: rule.mensagem,
        sugestao: rule.sugestao,
      }));
    });

    setLanguageIssues(issues);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      checkPortugueseIssues();
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [content, checkPortugueseIssues]);

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
    handleInput();
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selectionRef.current.range = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const range = selectionRef.current.range;
    if (range) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const insertPlaceholder = (placeholder: string) => {
    // Focus editor and restore selection
    if (editorRef.current) {
      editorRef.current.focus();
      restoreSelection();
    }

    const selection = window.getSelection();
    
    // If no selection or not in editor, append to end
    if (!selection || selection.rangeCount === 0) {
      if (editorRef.current) {
        const span = document.createElement('span');
        span.className = 'placeholder';
        span.setAttribute('data-placeholder', placeholder);
        span.textContent = placeholder;
        span.contentEditable = 'false';
        editorRef.current.appendChild(span);
        editorRef.current.appendChild(document.createTextNode(' '));
      }
    } else {
      const range = selection.getRangeAt(0);
      
      // Check if selection is within editor
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        const span = document.createElement('span');
        span.className = 'placeholder';
        span.setAttribute('data-placeholder', placeholder);
        span.textContent = placeholder;
        span.contentEditable = 'false';

        range.deleteContents();
        range.insertNode(span);
        
        // Move cursor after the inserted placeholder
        range.setStartAfter(span);
        range.setEndAfter(span);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    handleInput();
    setIsFieldsPopoverOpen(false);
  };

  const handleUndo = () => {
    restoreSelection();
    document.execCommand('undo');
    handleInput();
  };

  const handleRedo = () => {
    restoreSelection();
    document.execCommand('redo');
    handleInput();
  };

  const runCommand = (command: string) => {
    restoreSelection();
    document.execCommand(command, false);
    handleInput();
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-3 bg-white border border-gray-200 rounded-t-xl">
        {/* Block Format */}
        <Select value={blockFormat} onValueChange={handleBlockFormat}>
          <SelectTrigger className="w-32 h-9 text-sm border-gray-200 rounded-lg">
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

        <ToolbarButton
          icon={<ZoomOut className="w-4 h-4" />}
          command=""
          onClick={() => setZoom((current) => Math.max(0.7, Number((current - 0.1).toFixed(1))))}
          title="Diminuir visualização"
        />
        <ToolbarButton
          icon={<ZoomIn className="w-4 h-4" />}
          command=""
          onClick={() => setZoom((current) => Math.min(1.4, Number((current + 0.1).toFixed(1))))}
          title="Aumentar visualização"
        />
        <span className="text-xs text-gray-500 min-w-12 text-center">{Math.round(zoom * 100)}%</span>

        <ToolbarDivider />

        {/* Text Formatting */}
        <ToolbarButton icon={<Bold className="w-4 h-4" />} command="bold" onClick={() => runCommand('bold')} onMouseDown={saveSelection} title="Negrito (Ctrl+B)" />
        <ToolbarButton icon={<Italic className="w-4 h-4" />} command="italic" onClick={() => runCommand('italic')} onMouseDown={saveSelection} title="Itálico (Ctrl+I)" />
        <ToolbarButton icon={<Underline className="w-4 h-4" />} command="underline" onClick={() => runCommand('underline')} onMouseDown={saveSelection} title="Sublinhado (Ctrl+U)" />

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton icon={<AlignLeft className="w-4 h-4" />} command="justifyLeft" onClick={() => runCommand('justifyLeft')} onMouseDown={saveSelection} title="Alinhar à esquerda" />
        <ToolbarButton icon={<AlignCenter className="w-4 h-4" />} command="justifyCenter" onClick={() => runCommand('justifyCenter')} onMouseDown={saveSelection} title="Centralizar" />
        <ToolbarButton icon={<AlignRight className="w-4 h-4" />} command="justifyRight" onClick={() => runCommand('justifyRight')} onMouseDown={saveSelection} title="Alinhar à direita" />
        <ToolbarButton icon={<AlignJustify className="w-4 h-4" />} command="justifyFull" onClick={() => runCommand('justifyFull')} onMouseDown={saveSelection} title="Justificar" />

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton icon={<List className="w-4 h-4" />} command="insertUnorderedList" onClick={() => runCommand('insertUnorderedList')} onMouseDown={saveSelection} title="Lista com marcadores" />
        <ToolbarButton icon={<ListOrdered className="w-4 h-4" />} command="insertOrderedList" onClick={() => runCommand('insertOrderedList')} onMouseDown={saveSelection} title="Lista numerada" />

        <ToolbarDivider />

        {/* Undo/Redo */}
        <ToolbarButton icon={<Undo className="w-4 h-4" />} command="" onClick={handleUndo} onMouseDown={saveSelection} title="Desfazer (Ctrl+Z)" />
        <ToolbarButton icon={<Redo className="w-4 h-4" />} command="" onClick={handleRedo} onMouseDown={saveSelection} title="Refazer (Ctrl+Y)" />

        <ToolbarDivider />

        {/* Insert Field Button */}
        <Popover open={isFieldsPopoverOpen} onOpenChange={setIsFieldsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-lg border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              onMouseDown={saveSelection}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Inserir campo
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-72 p-0 rounded-xl shadow-lg" 
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="p-3 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900">Campos dinâmicos</h4>
              <p className="text-xs text-gray-500 mt-1">Selecione um campo para inserir</p>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-2 space-y-1">
                {camposDinamicos.map((group) => (
                  <div key={group.id} className="mb-3">
                    <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {group.nome}
                    </div>
                    <div className="space-y-0.5">
                      {group.campos.map((campo) => (
                        <button
                          key={campo.id}
                          type="button"
                          onClick={() => insertPlaceholder(campo.placeholder)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left hover:bg-orange-50 transition-colors"
                        >
                          <span className="text-gray-700">{campo.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 px-2 text-gray-600"
          onClick={checkPortugueseIssues}
        >
          <SearchCheck className="w-4 h-4 mr-1.5" />
          Verificar português
        </Button>
      </div>

      {languageIssues.length > 0 ? (
        <div className="px-4 py-3 border-x border-b border-red-200 bg-red-50 text-sm rounded-b-xl -mt-px">
          <p className="font-medium text-red-700 mb-1">Erros de português encontrados: {languageIssues.length}</p>
          <ul className="space-y-1 text-red-700">
            {languageIssues.slice(0, 4).map((issue, index) => (
              <li key={`${issue.trecho}-${index}`}>
                <span className="font-semibold">"{issue.trecho}"</span>: {issue.mensagem} Sugestão: {issue.sugestao}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="px-4 py-2 border-x border-b border-green-200 bg-green-50 text-sm text-green-700 rounded-b-xl -mt-px">
          Nenhum erro comum encontrado na revisão automática.
        </div>
      )}

      {/* Editor Canvas - Styled like a document */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto rounded-b-xl">
        <div
          className="max-w-[816px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden min-h-[1056px]"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            width: `${100 / zoom}%`,
          }}
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onMouseUp={saveSelection}
            onKeyUp={saveSelection}
            spellCheck
            lang="pt-BR"
            className={cn(
              'contract-editor min-h-[1056px] p-12 focus:outline-none',
              'prose prose-sm max-w-none',
              'prose-headings:text-gray-900 prose-p:text-gray-700',
              'prose-strong:text-gray-900'
            )}
            style={{ 
              lineHeight: '1.8',
              fontSize: '14px'
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractRichTextEditor;
