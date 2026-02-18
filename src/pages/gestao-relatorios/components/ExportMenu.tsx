import { Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { exportReport, ExportFormat } from '@/utils/exportReport'

interface ExportMenuProps {
  data: any[]
  columns: { key: string; label: string }[]
  section: string
  selectedRows?: any[]
  availableFormats?: ExportFormat[]
}

function ExportMenu({
  data,
  columns,
  section,
  selectedRows,
  availableFormats = ['csv', 'xlsx', 'pdf'],
}: ExportMenuProps) {
  const handleExport = (format: ExportFormat) => {
    exportReport({ format, section, data, columns, selectedRows })
  }

  const isAvailable = (format: ExportFormat) =>
    availableFormats.includes(format)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-10 px-4 rounded-xl bg-orange-600 text-white hover:bg-orange-700 shadow-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
          aria-label="Exportar dados"
        >
          <Download className="h-5 w-5" />
          <span>Exportar</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          disabled={!isAvailable('csv')}
          className="cursor-pointer"
        >
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('xlsx')}
          disabled={!isAvailable('xlsx')}
          className="cursor-pointer"
        >
          XLSX
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          disabled={!isAvailable('pdf')}
          className="cursor-pointer"
        >
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportMenu

