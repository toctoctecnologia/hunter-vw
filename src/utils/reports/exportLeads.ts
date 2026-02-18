export type ExportLeadsFormat = 'csv' | 'xlsx';

export interface ExportLeadsOptions {
  format?: ExportLeadsFormat;
  context: string;
  fileBaseName?: string;
}

export async function exportLeads(rows: any[], opts: ExportLeadsOptions) {
  const { format = 'csv', context, fileBaseName } = opts;
  const pad = (n: number) => String(n).padStart(2, '0');
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
  const baseName = fileBaseName || 'relatorio_leads';

  if (format === 'xlsx') {
    try {
      const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
      const filename = `${baseName}_${context}_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, filename);
      return;
    } catch {
      // fall back to CSV if xlsx is not available
    }
  }

  const headers = Object.keys(rows[0] || {});
  const csvRows = [headers.join(';')];
  for (const row of rows) {
    const values = headers.map(key => {
      const value = row[key] ?? '';
      const str = String(value).replace(/"/g, '""');
      return /[;"\n]/.test(str) ? `"${str}"` : str;
    });
    csvRows.push(values.join(';'));
  }

  const csvContent = '\ufeff' + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `${baseName}_${context}_${timestamp}.csv`;
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
