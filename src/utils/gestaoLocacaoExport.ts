import { exportReport, type ExportFormat } from '@/utils/exportReport';

export type ExportColumn = { key: string; label: string };

const escapeCsvValue = (value: unknown) => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  if (stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue}"`;
  }
  return stringValue;
};

export const buildCsvContent = (data: Array<Record<string, unknown>>, columns: ExportColumn[]) => {
  const headers = columns.map((column) => escapeCsvValue(column.label)).join(',');
  const rows = data.map((row) =>
    columns.map((column) => escapeCsvValue(row[column.key])).join(',')
  );
  return [headers, ...rows].join('\n');
};

export const copyRowsToClipboard = async (data: Array<Record<string, unknown>>, columns: ExportColumn[]) => {
  if (typeof window === 'undefined' || !navigator?.clipboard) {
    console.warn('Clipboard não disponível no ambiente atual.');
    return;
  }

  const csvContent = buildCsvContent(data, columns);
  await navigator.clipboard.writeText(csvContent);
};

export const exportGestaoLocacaoData = ({
  format,
  section,
  data,
  columns,
  filename,
}: {
  format: ExportFormat;
  section: string;
  data: Array<Record<string, unknown>>;
  columns: ExportColumn[];
  filename?: string;
}) => {
  exportReport({
    format,
    section,
    data,
    columns,
    filename,
  });
};
