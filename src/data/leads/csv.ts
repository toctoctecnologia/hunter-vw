export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).filter(Boolean).map(line => {
    const values = line.split(',');
    const record: Record<string, string> = {};
    headers.forEach((h, i) => {
      const value = values[i]?.trim() ?? '';
      record[h] = value.replace(/^"|"$/g, '').replace(/""/g, '"');
    });
    return record;
  });
}

export function generateCsv(rows: Record<string, any>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const csvRows = rows.map(row =>
    headers.map(h => formatValue(row[h])).join(',')
  );
  return [headers.join(','), ...csvRows].join('\n');
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
