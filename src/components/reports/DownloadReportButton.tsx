import { useState } from 'react'
import { Button as IconButton } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { FileDown, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { exportLeads, ExportLeadsFormat } from '@/utils/reports/exportLeads'
import { STAGE_SLUG_TO_LABEL } from '@/data/stageMapping'
import { formatDate } from '@/utils/date'

interface DownloadReportButtonProps {
  getData: () => Promise<any[]>
  context: string
  format?: ExportLeadsFormat
  fileBaseName?: string
}

export function DownloadReportButton({
  getData,
  context,
  format = 'csv',
  fileBaseName = 'relatorio'
}: DownloadReportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setLoading(true)
      const rows = await getData()
      const normalized = rows.map(lead => ({
        ID: lead.id,
        Nome: lead.name,
        Origem: lead.source ?? '',
        Etapa: STAGE_SLUG_TO_LABEL[lead.stage] || lead.stage,
        'Responsável': lead.ownerName || lead.ownerId || '',
        Intensidade: lead.leadIntensity ?? '',
        Tags: Array.isArray(lead.tags) ? lead.tags.join(', ') : '',
        Telefone: lead.phone ?? '',
        Email: lead.email ?? '',
        'Criado em': formatDate(lead.createdAt),
        'Atualizado em': formatDate(lead.lastUpdate)
      }))
      await exportLeads(normalized, {
        format,
        context,
        fileBaseName
      })
      toast({
        title: 'Download iniciado',
        description: `Relatório de ${context} gerado com sucesso.`
      })
    } catch (error) {
      console.error('Erro ao baixar relatório:', error)
      toast({
        title: 'Erro ao baixar',
        description: 'Não foi possível gerar o relatório.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            disabled={loading}
            aria-label="Baixar relatório"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Baixar Relatório</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default DownloadReportButton

