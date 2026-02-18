'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Modal } from '@/shared/components/ui/modal';
import { ModalProps } from '@/shared/types';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { FileText, FileSpreadsheet, File } from 'lucide-react';
import { newJobExportReport } from '@/features/dashboard/manage-reports/api/report';

interface ExportModalProps<T> extends Omit<ModalProps, 'title' | 'description'> {
  columns: { label: string; value: string }[];
  reportType: 'PROPERTIES' | 'LEADS' | 'CATCHERS' | 'APPOINTMENTS' | 'DISTRIBUTION';
  filters: T;
}

type ExportFormat = 'PDF' | 'XLSX' | 'CSV';

export function ExportModal<T>({ open, onClose, columns, reportType, filters }: ExportModalProps<T>) {
  const [format, setFormat] = useState<ExportFormat>('XLSX');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map((col) => col.value));

  const { mutate: exportReport, isPending } = useMutation({
    mutationFn: () => newJobExportReport(reportType, selectedColumns, filters, format),
    onSuccess: () => {
      toast.success('Exportação iniciada com sucesso!');
      onClose();
    },
  });

  const handleToggleColumn = (columnValue: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnValue) ? prev.filter((c) => c !== columnValue) : [...prev, columnValue],
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(columns.map((col) => col.value));
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const handleExport = () => {
    exportReport();
  };

  const formatIcons = {
    PDF: FileText,
    XLSX: FileSpreadsheet,
    CSV: File,
  };

  return (
    <Modal open={open} onClose={onClose} title="Configurar exportação" description="Escolha as opções de exportação">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label className="text-base font-semibold">Formato do arquivo</Label>
          <RadioGroup value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
            <div className="grid grid-cols-3 gap-3">
              {(['PDF', 'XLSX', 'CSV'] as ExportFormat[]).map((fmt) => {
                const Icon = formatIcons[fmt];
                return (
                  <Label
                    key={fmt}
                    htmlFor={`format-${fmt}`}
                    className="border-input hover:border-primary data-[selected=true]:border-primary data-[selected=true]:bg-primary/5 flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 transition-colors"
                    data-selected={format === fmt}
                  >
                    <Icon className="text-muted-foreground size-6" />
                    <RadioGroupItem value={fmt} id={`format-${fmt}`} className="sr-only" />
                    <span className="text-sm font-medium">{fmt}</span>
                  </Label>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Seleção de colunas */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Colunas para exportar</Label>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                Selecionar todas
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
                Desmarcar todas
              </Button>
            </div>
          </div>
          <ScrollArea className="border-input h-75 rounded-lg border">
            <div className="flex flex-col gap-2 p-4">
              {columns.map((column) => (
                <Label
                  key={column.value}
                  htmlFor={`column-${column.value}`}
                  className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors"
                >
                  <Checkbox
                    id={`column-${column.value}`}
                    checked={selectedColumns.includes(column.value)}
                    onCheckedChange={() => handleToggleColumn(column.value)}
                  />
                  <span className="text-sm">{column.label}</span>
                </Label>
              ))}
            </div>
          </ScrollArea>
          <p className="text-muted-foreground text-xs">
            {selectedColumns.length} de {columns.length} colunas selecionadas
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={selectedColumns.length === 0 || isPending}>
            {isPending ? 'Exportando...' : 'Exportar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
