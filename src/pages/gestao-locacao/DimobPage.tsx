import { useState } from 'react';
import { LocacaoModuleLayout } from '@/layouts/LocacaoModuleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Plus,
  FileText,
  ChevronRight,
  Download,
  Calendar,
  Eye,
  FileDown,
  ExternalLink
} from 'lucide-react';
import { NovaDimobModal } from '@/components/gestao-locacao/NovaDimobModal';

interface DimobItem {
  id: string;
  anoBase: string;
  intermediador: string;
  responsavel: string;
  regime: string;
}

const dimobData: DimobItem[] = [
  {
    id: '1',
    anoBase: '2021',
    intermediador: '00.000.000/0001-00 (Imobiliária Demo Ltda)',
    responsavel: 'Usuário Demo',
    regime: 'Caixa'
  },
  {
    id: '2',
    anoBase: '2022',
    intermediador: '00.000.000/0001-00 (Imobiliária Demo Ltda)',
    responsavel: 'Equipe Hunter',
    regime: 'Caixa'
  },
  {
    id: '3',
    anoBase: '2023',
    intermediador: '00.000.000/0001-00 (Imobiliária Demo Ltda)',
    responsavel: 'Sistema',
    regime: 'Caixa'
  }
];

export const DimobPage = () => {
  const [novaDimobOpen, setNovaDimobOpen] = useState(false);
  const [selectedDimob, setSelectedDimob] = useState<DimobItem | null>(null);

  const latestDimob = dimobData[dimobData.length - 1];

  const downloadDimobPdf = (item: DimobItem) => {
    const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>DIMOB ${item.anoBase}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
    h1 { margin: 0 0 20px; }
    p { margin: 8px 0; }
  </style>
</head>
<body>
  <h1>DIMOB ${item.anoBase}</h1>
  <p><strong>Ano-base:</strong> ${item.anoBase}</p>
  <p><strong>Intermediador:</strong> ${item.intermediador}</p>
  <p><strong>Responsável:</strong> ${item.responsavel}</p>
  <p><strong>Regime:</strong> ${item.regime}</p>
  <p>Relatório gerado no ambiente Hunter (modo demonstração).</p>
</body>
</html>`;

    const previewWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!previewWindow) return;

    previewWindow.document.open();
    previewWindow.document.write(html);
    previewWindow.document.close();
    previewWindow.focus();
    previewWindow.print();
  };

  const downloadModelo = () => {
    const csvContent = [
      'ano_base,cnpj_intermediador,responsavel,regime',
      '2023,00.000.000/0001-00,Sistema,Caixa'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'modelo-dimob.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  const openInstructions = () => {
    window.open('https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dimob', '_blank', 'noopener,noreferrer');
  };

  return (
    <LocacaoModuleLayout
      title="DIMOB"
      subtitle="Declaração de Informações sobre Atividades Imobiliárias"
    >
      {/* Header Actions */}
      <div className="flex justify-end mb-6">
        <Button 
          className="rounded-xl h-11 px-5 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] shadow-lg shadow-[var(--brand-focus)]"
          onClick={() => setNovaDimobOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova DIMOB
        </Button>
      </div>

      {/* DIMOB Table */}
      <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
        <CardHeader className="pb-3 border-b border-[var(--ui-stroke)]">
          <CardTitle className="text-base flex items-center gap-2 text-[var(--ui-text)]">
            <FileText className="w-4 h-4" />
            DIMOB anteriores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-5 gap-4 px-6 py-3 bg-[var(--ui-stroke)]/30 text-xs font-medium text-[var(--ui-text-subtle)] uppercase tracking-wide">
            <div>Ano base</div>
            <div className="col-span-2">Intermediador</div>
            <div>Responsável</div>
            <div>Regime</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[var(--ui-stroke)]">
            {dimobData.map((item) => (
              <div 
                key={item.id}
                className="px-6 py-4 hover:bg-[var(--ui-stroke)]/20 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => setSelectedDimob(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    setSelectedDimob(item);
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="text-sm font-medium text-[var(--ui-text)]">{item.anoBase}</div>
                  <div className="col-span-2 text-sm text-[var(--ui-text)]">{item.intermediador}</div>
                  <div className="text-sm text-[var(--ui-text)]">{item.responsavel}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--ui-text)]">{item.regime}</span>
                    <ChevronRight className="w-4 h-4 text-[var(--ui-text-subtle)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 rounded-2xl border-[var(--ui-stroke)] bg-[var(--ui-stroke)]/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-[hsl(var(--accent))]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--ui-text)] mb-2">Sobre a DIMOB</h3>
              <p className="text-sm text-[var(--ui-text-subtle)]">
                A DIMOB é uma declaração obrigatória para pessoas jurídicas e equiparadas que comercializaram, 
                intermediaram aquisições/alienações ou alugaram imóveis. A declaração deve ser entregue até 
                o último dia útil de fevereiro de cada ano, referente às operações do ano-calendário anterior.
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="rounded-xl border-[var(--ui-stroke)]" onClick={downloadModelo}>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar modelo
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl border-[var(--ui-stroke)]" onClick={openInstructions}>
                  Ver instruções
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[var(--ui-stroke)]"
                  onClick={() => setSelectedDimob(latestDimob)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar DIMOB
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <NovaDimobModal open={novaDimobOpen} onOpenChange={setNovaDimobOpen} />

      <Dialog open={Boolean(selectedDimob)} onOpenChange={(open) => !open && setSelectedDimob(null)}>
        <DialogContent className="rounded-2xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>DIMOB ano-base {selectedDimob?.anoBase}</DialogTitle>
            <DialogDescription>
              Visualize os dados da declaração e faça o download do relatório em PDF.
            </DialogDescription>
          </DialogHeader>

          {selectedDimob && (
            <div className="space-y-3 text-sm text-[var(--ui-text)]">
              <div><strong>Ano-base:</strong> {selectedDimob.anoBase}</div>
              <div><strong>Intermediador:</strong> {selectedDimob.intermediador}</div>
              <div><strong>Responsável:</strong> {selectedDimob.responsavel}</div>
              <div><strong>Regime:</strong> {selectedDimob.regime}</div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedDimob(null)}>
              Fechar
            </Button>
            <Button
              className="bg-[hsl(var(--accent))] text-[hsl(var(--brandPrimaryText))] hover:bg-[hsl(var(--accent))]/90"
              onClick={() => selectedDimob && downloadDimobPdf(selectedDimob)}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LocacaoModuleLayout>
  );
};

export default DimobPage;
