import { useState, useEffect, useCallback, type ChangeEvent } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { StandardLayout } from '@/layouts/StandardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ContractRichTextEditor, 
  DynamicFieldsPanel,
  PreviewModal 
} from '@/components/contract-template-editor';
import { 
  ArrowLeft, 
  Eye, 
  Save,
  FileText,
  Clock,
  CheckCircle2,
  Upload,
  Palette,
  ImageIcon,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { TEMPLATE_PADRAO_LOCACAO, TEMPLATE_PADRAO_VENDA } from '@/types/contrato-padrao';
import { toast } from 'sonner';
import {
  type ContractPattern,
  getContractPatternById,
  listContractPatterns,
  saveContractPatterns,
} from '@/services/gestao-locacao/contractPatternsStorage';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  if (value.length !== 6) return { r: 249, g: 115, b: 22 };

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((channel) => clamp(channel, 0, 255).toString(16).padStart(2, '0')).join('')}`;

const rgbToCmyk = (r: number, g: number, b: number) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);

  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
};

const cmykToRgb = (c: number, m: number, y: number, k: number) => {
  const cn = clamp(c, 0, 100) / 100;
  const mn = clamp(m, 0, 100) / 100;
  const yn = clamp(y, 0, 100) / 100;
  const kn = clamp(k, 0, 100) / 100;

  return {
    r: Math.round(255 * (1 - cn) * (1 - kn)),
    g: Math.round(255 * (1 - mn) * (1 - kn)),
    b: Math.round(255 * (1 - yn) * (1 - kn)),
  };
};

const rgbToHue = (r: number, g: number, b: number) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  if (delta === 0) return 0;
  if (max === rn) return Math.round((60 * ((gn - bn) / delta) + 360) % 360);
  if (max === gn) return Math.round(60 * ((bn - rn) / delta + 2));
  return Math.round(60 * ((rn - gn) / delta + 4));
};

export const EditarPadraoContratoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isSalesContext = location.pathname.startsWith('/gestao-vendas');
  const moduleBasePath = isSalesContext ? '/gestao-vendas' : '/gestao-locacao';
  const patternsBasePath = `${moduleBasePath}/padroes-contrato`;
  const contractsPath = `${moduleBasePath}/contratos`;
  const breadcrumbContractsLabel = isSalesContext ? 'CONTRATOS DE VENDA' : 'CONTRATOS DE LOCAÇÃO';
  const isNew = id === 'novo';

  const [padrao, setPadrao] = useState<ContractPattern | null>(null);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [accentColor, setAccentColor] = useState('#f97316');
  const [savedAccentColors, setSavedAccentColors] = useState<string[]>(['#f97316', '#7c3aed', '#0891b2', '#16a34a', '#db2777', '#4b5563']);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [tipoContrato, setTipoContrato] = useState<'locacao' | 'venda'>('locacao');
  const [duracao, setDuracao] = useState('30 meses');
  const [indiceReajuste, setIndiceReajuste] = useState('IGP-M');
  const [taxaAdm, setTaxaAdm] = useState('10%');
  const [garantia, setGarantia] = useState('Fiador');
  const [indiceCorrecao, setIndiceCorrecao] = useState('IPCA');
  const [isVisualSectionOpen, setIsVisualSectionOpen] = useState(true);

  // Load padrao data
  useEffect(() => {
    if (id) {
      const isNovo = id === 'novo';
      const data = isNovo
        ? {
            id: String(Date.now()),
            nome: 'Novo Padrão',
            tipoContrato: isSalesContext ? ('venda' as const) : ('locacao' as const),
            duracao: '30 meses',
            indiceReajuste: 'IGP-M',
            taxaAdm: '10%',
            garantia: 'Fiador',
            indiceCorrecao: 'IPCA',
            ativo: true,
            corpoTemplate: isSalesContext ? TEMPLATE_PADRAO_VENDA : TEMPLATE_PADRAO_LOCACAO,
          }
        : getContractPatternById(id);

      if (data) {
        setPadrao(data);
        const templatePadrao = data.tipoContrato === 'venda' ? TEMPLATE_PADRAO_VENDA : TEMPLATE_PADRAO_LOCACAO;
        setContent(data.corpoTemplate || templatePadrao);
        setTipoContrato(data.tipoContrato);
        setDuracao(data.duracao ?? '30 meses');
        setIndiceReajuste(data.indiceReajuste ?? 'IGP-M');
        setTaxaAdm(data.taxaAdm ?? '10%');
        setGarantia(data.garantia ?? 'Fiador');
        setIndiceCorrecao(data.indiceCorrecao ?? 'IPCA');
        if (data.atualizadoEm) setLastSaved(new Date(data.atualizadoEm));
      } else {
        toast.error('Padrão não encontrado');
        navigate(patternsBasePath);
      }
    }
  }, [id, isSalesContext, navigate, patternsBasePath]);

  useEffect(() => {
    if (padrao?.nome && !documentTitle) {
      setDocumentTitle(padrao.nome);
    }
  }, [padrao?.nome, documentTitle]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!padrao) return;

    const nextPattern: ContractPattern = {
      ...padrao,
      nome: documentTitle.trim() || padrao.nome,
      tipoContrato,
      duracao: tipoContrato === 'locacao' ? duracao : undefined,
      indiceReajuste: tipoContrato === 'locacao' ? indiceReajuste : undefined,
      taxaAdm: tipoContrato === 'locacao' ? taxaAdm : undefined,
      garantia: tipoContrato === 'locacao' ? garantia : undefined,
      indiceCorrecao: tipoContrato === 'venda' ? indiceCorrecao : undefined,
      corpoTemplate: content,
      atualizadoEm: new Date().toISOString(),
    };

    const existing = listContractPatterns();
    const index = existing.findIndex((item) => item.id === nextPattern.id);
    if (index >= 0) {
      existing[index] = nextPattern;
    } else {
      existing.unshift(nextPattern);
    }
    saveContractPatterns(existing);
    setPadrao(nextPattern);
    
    setLastSaved(new Date());
    setHasChanges(false);
    setIsSaving(false);
    
    toast.success(isNew ? 'Novo padrão criado com sucesso!' : 'Modelo salvo com sucesso!');
  };

  const handleInsertField = () => {
    // Inserção tratada diretamente no editor
  };

  const rgb = hexToRgb(accentColor);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const updateAccentFromRgb = (nextRgb: { r: number; g: number; b: number }) => {
    setAccentColor(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b));
    setHasChanges(true);
  };

  const handlePinAccentColor = () => {
    setSavedAccentColors((current) => {
      if (current.includes(accentColor)) return current;
      return [accentColor, ...current].slice(0, 12);
    });
    toast.success('Cor fixada com sucesso.');
    setHasChanges(true);
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(typeof reader.result === 'string' ? reader.result : null);
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Salvo agora';
    if (diffMins === 1) return 'Salvo há 1 minuto';
    if (diffMins < 60) return `Salvo há ${diffMins} minutos`;
    
    return `Salvo às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (!padrao) {
    return (
      <StandardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--accent))]"></div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className={`${isSalesContext ? 'gestao-vendas-theme' : 'gestao-locacao-theme'} h-screen flex flex-col bg-[var(--ui-surface)] overflow-hidden`}>
        {/* Header */}
        <header className="bg-[var(--ui-card)] border-b border-[var(--ui-stroke)] px-6 py-4 flex-shrink-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[var(--ui-text-subtle)] mb-3">
            <Link to={moduleBasePath} className="hover:text-[var(--ui-text)] transition-colors">
              INÍCIO
            </Link>
            <span>›</span>
            <Link to={contractsPath} className="hover:text-[var(--ui-text)] transition-colors">
              {breadcrumbContractsLabel}
            </Link>
            <span>›</span>
            <Link to={patternsBasePath} className="hover:text-[var(--ui-text)] transition-colors">
              PADRÕES DE CONTRATO
            </Link>
            <span>›</span>
            <span className="text-[var(--ui-text)] font-medium">{padrao.nome}</span>
          </nav>

          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent)/0.16)] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[var(--ui-text)]">
                    {isNew ? 'Criar modelo de contrato' : 'Editar modelo de contrato'}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-[var(--ui-text-subtle)]">{documentTitle || padrao.nome}</span>
                    <Badge 
                      className={padrao.ativo 
                        ? 'bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))] border-0' 
                        : 'bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)] border-0'
                      }
                    >
                      {padrao.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Save Status */}
              {lastSaved && (
                <div className="flex items-center gap-1.5 text-sm text-[var(--ui-text-subtle)]">
                  {hasChanges ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Alterações não salvas</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[hsl(var(--success))]" />
                      <span>{formatLastSaved(lastSaved)}</span>
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <Button
                variant="ghost"
                onClick={() => navigate(patternsBasePath)}
                className="h-10 px-4 rounded-xl text-[var(--ui-text-subtle)] hover:text-[var(--ui-text)]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(true)}
                className="h-10 px-4 rounded-xl border-[var(--ui-stroke)]"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar exemplo
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="h-10 px-5 rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] shadow-sm"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar modelo
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content - Two Columns */}
        <div className="flex-1 flex overflow-y-auto">
          {/* Editor Column - 70% */}
          <div className="flex-1 p-6 overflow-y-auto" style={{ flex: '0 0 70%' }}>
            <div className="mb-4 bg-white border border-[var(--ui-stroke)] rounded-xl p-4">
              <button
                type="button"
                onClick={() => setIsVisualSectionOpen((prev) => !prev)}
                className="w-full flex items-center gap-2 mb-3 text-left"
              >
                <Palette className="w-4 h-4 text-[var(--ui-text-subtle)]" />
                <h3 className="text-sm font-semibold text-[var(--ui-text)] flex-1">Padrão visual do contrato</h3>
                {isVisualSectionOpen ? (
                  <ChevronDown className="w-4 h-4 text-[var(--ui-text-subtle)]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[var(--ui-text-subtle)]" />
                )}
              </button>

              {isVisualSectionOpen && <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--ui-text-subtle)] mb-2 block">Título do instrumento</label>
                  <input
                    value={documentTitle}
                    onChange={(event) => {
                      setDocumentTitle(event.target.value);
                      setHasChanges(true);
                    }}
                    className="w-full h-10 rounded-lg border border-[var(--ui-stroke)] px-3 text-sm"
                    placeholder="Ex: Contrato de Locação Residencial"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--ui-text-subtle)] mb-2 block">Cor para geração/baixar</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={359}
                        value={rgbToHue(rgb.r, rgb.g, rgb.b)}
                        onChange={(event) => {
                          const hue = Number(event.target.value);
                          const h = hue / 60;
                          const x = 1 - Math.abs((h % 2) - 1);
                          const [r, g, b] = h < 1
                            ? [1, x, 0]
                            : h < 2
                              ? [x, 1, 0]
                              : h < 3
                                ? [0, 1, x]
                                : h < 4
                                  ? [0, x, 1]
                                  : h < 5
                                    ? [x, 0, 1]
                                    : [1, 0, x];

                          updateAccentFromRgb({
                            r: Math.round(r * 255),
                            g: Math.round(g * 255),
                            b: Math.round(b * 255),
                          });
                        }}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: 'linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                        }}
                      />
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(event) => {
                          setAccentColor(event.target.value);
                          setHasChanges(true);
                        }}
                        className="h-10 w-12 rounded-md border border-[var(--ui-stroke)] cursor-pointer bg-transparent"
                        aria-label="Seletor de cor"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {(['r', 'g', 'b'] as const).map((channel) => (
                        <input
                          key={channel}
                          type="number"
                          min={0}
                          max={255}
                          value={rgb[channel]}
                          onChange={(event) => {
                            const nextValue = clamp(Number(event.target.value), 0, 255);
                            updateAccentFromRgb({ ...rgb, [channel]: nextValue });
                          }}
                          className="h-9 rounded-lg border border-[var(--ui-stroke)] px-2 text-xs"
                          placeholder={channel.toUpperCase()}
                          title={`Canal ${channel.toUpperCase()} (RGB)`}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={handlePinAccentColor}
                        className="h-9 rounded-lg border border-[var(--ui-stroke)] text-xs font-medium hover:bg-gray-50"
                      >
                        Fixar cor
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {(['c', 'm', 'y', 'k'] as const).map((channel) => (
                        <input
                          key={channel}
                          type="number"
                          min={0}
                          max={100}
                          value={cmyk[channel]}
                          onChange={(event) => {
                            const nextValue = clamp(Number(event.target.value), 0, 100);
                            const nextCmyk = { ...cmyk, [channel]: nextValue };
                            updateAccentFromRgb(cmykToRgb(nextCmyk.c, nextCmyk.m, nextCmyk.y, nextCmyk.k));
                          }}
                          className="h-9 rounded-lg border border-[var(--ui-stroke)] px-2 text-xs"
                          placeholder={channel.toUpperCase()}
                          title={`Canal ${channel.toUpperCase()} (CMYK)`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {savedAccentColors.map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => {
                          setAccentColor(color);
                          setHasChanges(true);
                        }}
                        aria-label={`Selecionar cor ${color}`}
                        className="w-7 h-7 rounded-full border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: accentColor === color ? '#111827' : '#e5e7eb',
                        }}
                      />
                    ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--ui-text-subtle)] mb-2 block">Logo no contrato</label>
                  <div className="flex items-center gap-3">
                    <label className="h-10 px-3 rounded-lg border border-[var(--ui-stroke)] text-sm inline-flex items-center cursor-pointer hover:bg-gray-50">
                      <Upload className="w-4 h-4 mr-1.5" />
                      Enviar logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </label>
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo selecionado" className="h-10 w-10 rounded-md object-cover border border-[var(--ui-stroke)]" />
                    ) : (
                      <div className="h-10 w-10 rounded-md border border-dashed border-[var(--ui-stroke)] flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-[var(--ui-text-subtle)]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              }

              {isVisualSectionOpen && (
                <div className="mt-4 rounded-lg border border-[var(--ui-stroke)] bg-[var(--ui-surface)] p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[var(--ui-text-subtle)] mb-1 block">Tipo de contrato</label>
                    <select
                      value={tipoContrato}
                      onChange={(event) => {
                        const novoTipo = event.target.value as 'locacao' | 'venda';
                        setTipoContrato(novoTipo);

                        const templateAtual = novoTipo === 'venda' ? TEMPLATE_PADRAO_VENDA : TEMPLATE_PADRAO_LOCACAO;
                        const templateAnterior = novoTipo === 'venda' ? TEMPLATE_PADRAO_LOCACAO : TEMPLATE_PADRAO_VENDA;

                        if (!content.trim() || content === templateAnterior || content === templateAtual) {
                          setContent(templateAtual);
                        }

                        setHasChanges(true);
                      }}
                      className="w-full h-9 rounded-lg border border-[var(--ui-stroke)] px-2 text-sm"
                    >
                      <option value="locacao">Contrato de locação</option>
                      <option value="venda">Contrato de venda</option>
                    </select>
                  </div>

                  {tipoContrato === 'locacao' ? (
                    <>
                      <div>
                        <label className="text-xs font-medium text-[var(--ui-text-subtle)] mb-1 block">Duração</label>
                        <input value={duracao} onChange={(e) => { setDuracao(e.target.value); setHasChanges(true); }} className="w-full h-9 rounded-lg border border-[var(--ui-stroke)] px-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[var(--ui-text-subtle)] mb-1 block">IN / Índice</label>
                        <input value={indiceReajuste} onChange={(e) => { setIndiceReajuste(e.target.value); setHasChanges(true); }} className="w-full h-9 rounded-lg border border-[var(--ui-stroke)] px-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[var(--ui-text-subtle)] mb-1 block">Taxa administrativa</label>
                        <input value={taxaAdm} onChange={(e) => { setTaxaAdm(e.target.value); setHasChanges(true); }} className="w-full h-9 rounded-lg border border-[var(--ui-stroke)] px-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[var(--ui-text-subtle)] mb-1 block">Garantia</label>
                        <input value={garantia} onChange={(e) => { setGarantia(e.target.value); setHasChanges(true); }} className="w-full h-9 rounded-lg border border-[var(--ui-stroke)] px-2 text-sm" />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="text-xs font-medium text-[var(--ui-text-subtle)] mb-1 block">Índice de correção</label>
                      <input value={indiceCorrecao} onChange={(e) => { setIndiceCorrecao(e.target.value); setHasChanges(true); }} className="w-full h-9 rounded-lg border border-[var(--ui-stroke)] px-2 text-sm" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <ContractRichTextEditor
              content={content}
              onChange={handleContentChange}
              className="h-full"
              tipoContrato={tipoContrato}
            />
          </div>

          {/* Sidebar Column - 30% */}
          <div className="w-80 flex-shrink-0 overflow-hidden">
            <DynamicFieldsPanel onInsertField={handleInsertField} tipoContrato={tipoContrato} />
          </div>
        </div>

        {/* Preview Modal */}
        <PreviewModal
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          templateContent={content}
          templateName={documentTitle || padrao.nome}
          accentColor={accentColor}
          logoUrl={logoUrl}
          documentTitle={documentTitle}
          tipoContrato={tipoContrato}
        />
      </div>
    </StandardLayout>
  );
};

export default EditarPadraoContratoPage;
