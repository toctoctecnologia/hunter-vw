import * as XLSX from 'xlsx'

export type ExportFormat = 'csv' | 'xlsx' | 'pdf'

export interface ExportOptions {
  format: ExportFormat
  section: string
  data: any[]
  columns: { key: string; label: string }[]
  selectedRows?: any[]
  filename?: string
}

export function exportReport(options: ExportOptions) {
  const { format, section, data, columns, selectedRows, filename } = options
  const exportData = selectedRows && selectedRows.length > 0 ? selectedRows : data
  const timestamp = new Date().toISOString().split('T')[0]
  const defaultFilename = `${section}_${timestamp}.${format}`
  const finalFilename = filename || defaultFilename

  switch (format) {
    case 'csv':
      exportToCSV(exportData, columns, finalFilename)
      break
    case 'xlsx':
      exportToXLSX(exportData, columns, finalFilename)
      break
    case 'pdf':
      exportToPDF(exportData, columns, finalFilename, section)
      break
    default:
      throw new Error(`Formato não suportado: ${format}`)
  }
}

function exportToCSV(data: any[], columns: { key: string; label: string }[], filename: string) {
  const headers = columns.map(col => col.label).join(',')
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col.key]
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    }).join(',')
  )
  
  const csvContent = [headers, ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadFile(blob, filename)
}

function exportToXLSX(data: any[], columns: { key: string; label: string }[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(row => {
      const newRow: any = {}
      columns.forEach(col => {
        newRow[col.label] = row[col.key]
      })
      return newRow
    })
  )
  
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório')
  XLSX.writeFile(workbook, filename)
}

function exportToPDF(data: any[], columns: { key: string; label: string }[], filename: string, section: string) {
  const safeTitle = escapeHtml(section)
  const headers = columns.map(col => `<th>${escapeHtml(col.label)}</th>`).join('')
  const rows = data
    .map(row => {
      const cells = columns
        .map(col => `<td>${escapeHtml(String(row[col.key] ?? ''))}</td>`)
        .join('')
      return `<tr>${cells}</tr>`
    })
    .join('')

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${safeTitle}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
      h1 { margin-bottom: 8px; }
      p { margin: 0 0 16px; color: #4b5563; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
      th { background: #f3f4f6; }
    </style>
  </head>
  <body>
    <h1>Relatório - ${safeTitle}</h1>
    <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
    <table>
      <thead><tr>${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body>
</html>`

  const previewWindow = window.open('', '_blank', 'noopener,noreferrer')
  if (!previewWindow) {
    throw new Error('Não foi possível abrir a janela de impressão do relatório em PDF.')
  }

  previewWindow.document.open()
  previewWindow.document.write(html)
  previewWindow.document.close()
  previewWindow.document.title = filename
  previewWindow.focus()
  previewWindow.print()
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
