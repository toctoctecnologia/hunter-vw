import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { exportReports } from '@/services/reports'
import * as XLSX from 'xlsx'
import { Loader2 } from 'lucide-react'

interface ExportButtonProps {
  filters: Record<string, any>
  tab: string
}

export function ExportButton({ filters, tab }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    try {
      setLoading(true)
      const data = await exportReports(tab, filters)

      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatorio')
      const date = new Date().toISOString().split('T')[0]
      XLSX.writeFile(workbook, `relatorio-${tab}-${date}.xlsx`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleExport} disabled={loading} className="whitespace-nowrap">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exportando...
        </>
      ) : (
        'Exportar'
      )}
    </Button>
  )
}

export default ExportButton
