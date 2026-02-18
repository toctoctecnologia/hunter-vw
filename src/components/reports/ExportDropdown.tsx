import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, FileSpreadsheet, FileX } from 'lucide-react'
import { exportReport, ExportFormat } from '@/utils/exportReport'
import { Column } from './ReportsTable'

interface ExportDropdownProps {
  data: any[]
  columns: Column[]
  section: string
  selectedRows?: any[]
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm'
  className?: string
}

export function ExportDropdown({ 
  data, 
  columns, 
  section, 
  selectedRows, 
  variant = 'default',
  size = 'default',
  className 
}: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false)
  
  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)
    try {
      exportReport({
        format,
        section,
        data,
        columns,
        selectedRows
      })
    } catch (error) {
      console.error('Erro ao exportar:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const getIcon = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return <FileText className="h-4 w-4" />
      case 'xlsx':
        return <FileSpreadsheet className="h-4 w-4" />
      case 'pdf':
        return <FileX className="h-4 w-4" />
    }
  }

  const selectedText = selectedRows && selectedRows.length > 0 
    ? `Exportar Selecionados (${selectedRows.length})`
    : 'Exportar Relatório'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          disabled={isExporting}
          className={className}
        >
          <Download className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{selectedText}</span>
          <span className="sm:hidden">Exportar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="cursor-pointer"
        >
          {getIcon('csv')}
          <span className="ml-2">CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('xlsx')}
          disabled={isExporting}
          className="cursor-pointer"
        >
          {getIcon('xlsx')}
          <span className="ml-2">Excel (XLSX)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="cursor-pointer"
        >
          {getIcon('pdf')}
          <span className="ml-2">PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportDropdown