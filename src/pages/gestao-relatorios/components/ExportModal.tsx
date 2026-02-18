import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Download, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePickerInput } from '@/components/ui/DatePickerInput'
import { useToast } from '@/hooks/use-toast'
import { HttpError } from '@/lib/http'
import { getCurrentUser, hasPermission } from '@/data/accessControl'
import type { ReportFilters } from '@/components/reports/ReportsFilters'
import type { BaseFilters } from '@/types/reports'
import { exportReport } from '@/utils/exportReport'

interface ExportModalTabMetadata {
  value: string
  label: string
  columns: { key: string; label: string }[]
}

interface ExportModalProviderProps {
  dataset: string
  tab: ExportModalTabMetadata
  appliedFilters: ReportFilters
  serviceFilters: BaseFilters & Record<string, any>
  selectedRows: any[]
  rows: any[]
  columns: { key: string; label: string }[]
  totalRows: number
  dateRange: { from: Date; to: Date } | null
  children: React.ReactNode
}

interface ExportModalContextValue extends ExportModalProviderProps {
  open: boolean
  setOpen: (open: boolean) => void
  canExport: boolean
  canExportPII: boolean
}

interface ExportResponse {
  url?: string
  fileName?: string
  content?: string
  contentType?: string
  jobId?: string
  centerUrl?: string
  message?: string
}

const ExportModalContext = createContext<ExportModalContextValue | null>(null)

function useExportModalContext() {
  const ctx = useContext(ExportModalContext)
  if (!ctx) {
    throw new Error('ExportModal components must be used within ExportModalProvider')
  }
  return ctx
}

const TIMEZONES = [
  { value: 'America/Sao_Paulo', label: 'GMT-3 Brasília' },
  { value: 'America/Manaus', label: 'GMT-4 Manaus' },
  { value: 'America/Fortaleza', label: 'GMT-3 Fortaleza' },
  { value: 'America/Recife', label: 'GMT-3 Recife' },
  { value: 'UTC', label: 'UTC' },
]

export function ExportModalProvider({
  dataset,
  tab,
  appliedFilters,
  serviceFilters,
  selectedRows,
  rows,
  columns,
  totalRows,
  dateRange,
  children,
}: ExportModalProviderProps) {
  const [open, setOpen] = useState(false)
  const currentUser = getCurrentUser()
  const canExport = hasPermission(currentUser, 'reports:export')
  const canExportPII = hasPermission(currentUser, 'reports:export_pii')

  const value = useMemo<ExportModalContextValue>(
    () => ({
      dataset,
      tab,
      appliedFilters,
      serviceFilters,
      selectedRows,
      rows,
      columns,
      totalRows,
      dateRange,
      open,
      setOpen,
      canExport,
      canExportPII,
      children: null,
    }),
    [
      dataset,
      tab,
      appliedFilters,
      serviceFilters,
      selectedRows,
      rows,
      columns,
      totalRows,
      dateRange,
      open,
      canExport,
      canExportPII,
    ],
  )

  return (
    <ExportModalContext.Provider value={value}>
      {children}
      <ExportModalDialog />
    </ExportModalContext.Provider>
  )
}

function formatDate(date: Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function ExportModalDialog() {
  const {
    dataset,
    tab,
    appliedFilters,
    serviceFilters,
    selectedRows,
    totalRows,
    dateRange,
    open,
    setOpen,
    canExport,
    canExportPII,
    rows,
    columns,
  } = useExportModalContext()
  const { toast } = useToast()
  const defaultTimezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
    [],
  )

  const [scope, setScope] = useState<'filters' | 'selection'>(selectedRows.length > 0 ? 'selection' : 'filters')
  const [format, setFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv')
  const [timezone, setTimezone] = useState(defaultTimezone)
  const [includeAdvanced, setIncludeAdvanced] = useState(false)
  const [anonymize, setAnonymize] = useState(false)
  const [zip, setZip] = useState(true)
  const [includeAttachments, setIncludeAttachments] = useState(false)
  const [intervalStart, setIntervalStart] = useState<Date | null>(dateRange?.from ?? null)
  const [intervalEnd, setIntervalEnd] = useState<Date | null>(dateRange?.to ?? null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setScope(selectedRows.length > 0 ? 'selection' : 'filters')
      setFormat('csv')
      setTimezone(defaultTimezone)
      setIncludeAdvanced(false)
      setAnonymize(false)
      setZip(true)
      setIncludeAttachments(false)
      setIntervalStart(dateRange?.from ?? null)
      setIntervalEnd(dateRange?.to ?? null)
      setIsSubmitting(false)
    }
  }, [
    open,
    selectedRows.length,
    defaultTimezone,
    dateRange?.from,
    dateRange?.to,
  ])

  const selectionDisabled = selectedRows.length === 0
  const piiOptionDisabled = !canExportPII

  const handleSubmit = async () => {
    if (!canExport) {
      toast({
        variant: 'destructive',
        title: 'Permissão necessária',
        description: 'Você não tem permissão para exportar relatórios.',
      })
      return
    }

    if (scope === 'selection' && selectionDisabled) {
      toast({
        variant: 'destructive',
        title: 'Seleção inválida',
        description: 'Selecione pelo menos um registro para exportar.',
      })
      return
    }

    if (intervalStart && intervalEnd && intervalStart > intervalEnd) {
      toast({
        variant: 'destructive',
        title: 'Intervalo inválido',
        description: 'A data inicial não pode ser maior que a data final.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const selection = scope === 'selection' ? selectedRows : undefined
      const exportRows = scope === 'selection' && selectionDisabled ? [] : selection ?? rows

      if (!exportRows || exportRows.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Nada para exportar',
          description: 'Aplique filtros diferentes ou selecione ao menos um item.',
        })
        setIsSubmitting(false)
        return
      }

      exportReport({
        format,
        section: tab.label,
        data: exportRows,
        columns,
        selectedRows: selection,
        filename: `${dataset}-${new Date().toISOString().slice(0, 10)}.${format}`,
      })

      toast({
        title: 'Exportação concluída',
        description: `Arquivo ${format.toUpperCase()} gerado com sucesso.`,
      })
      setOpen(false)
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : 'Não foi possível concluir a exportação. Tente novamente mais tarde.'
      toast({
        variant: 'destructive',
        title: 'Erro ao exportar',
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exportar relatórios</DialogTitle>
          <DialogDescription>
            Configure a exportação para o conjunto <span className="font-medium text-foreground">{tab.label}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Escopo</Label>
            <RadioGroup value={scope} onValueChange={value => setScope(value as 'filters' | 'selection')}>
              <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                <RadioGroupItem value="filters" id="export-scope-filters" />
                <Label htmlFor="export-scope-filters" className="text-sm font-medium leading-6 text-foreground">
                  Tudo que corresponde aos filtros atuais
                  <p className="text-xs font-normal text-muted-foreground">{totalRows} registros encontrados</p>
                </Label>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                <RadioGroupItem
                  value="selection"
                  id="export-scope-selection"
                  disabled={selectionDisabled}
                />
                <Label
                  htmlFor="export-scope-selection"
                  className={`text-sm font-medium leading-6 ${selectionDisabled ? 'text-muted-foreground' : 'text-foreground'}`}
                >
                  Apenas os itens selecionados
                  <p className="text-xs font-normal text-muted-foreground">{selectedRows.length} selecionados</p>
                </Label>
              </div>
            </RadioGroup>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Formato</Label>
              <RadioGroup value={format} onValueChange={value => setFormat(value as typeof format)} className="grid grid-cols-3 gap-2">
                <Label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 p-3 text-sm font-medium text-foreground">
                  <RadioGroupItem value="csv" className="mr-2" /> CSV
                </Label>
                <Label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 p-3 text-sm font-medium text-foreground">
                  <RadioGroupItem value="xlsx" className="mr-2" /> XLSX
                </Label>
                <Label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 p-3 text-sm font-medium text-foreground">
                  <RadioGroupItem value="pdf" className="mr-2" /> PDF
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Fuso horário</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o fuso" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Início</Label>
              <DatePickerInput value={intervalStart} onChange={setIntervalStart} className="h-10" />
              <p className="text-xs text-muted-foreground">Data mínima baseada nos filtros aplicados.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Fim</Label>
              <DatePickerInput value={intervalEnd} onChange={setIntervalEnd} className="h-10" />
              <p className="text-xs text-muted-foreground">Ajuste se precisar restringir o período.</p>
            </div>
          </section>

          <section className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Opções adicionais</Label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm">
                <Checkbox
                  checked={includeAdvanced}
                  onCheckedChange={value => setIncludeAdvanced(Boolean(value))}
                  disabled={piiOptionDisabled}
                  className="mt-0.5"
                />
                <div>
                  <span className="font-medium text-foreground">Incluir campos avançados</span>
                  <p className="text-xs text-muted-foreground">
                    Exporta campos sensíveis e dados adicionais relacionados ao relatório.
                  </p>
                  {piiOptionDisabled && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-yellow-600">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Requer permissão de dados sensíveis.
                    </p>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm">
                <Checkbox
                  checked={anonymize}
                  onCheckedChange={value => setAnonymize(Boolean(value))}
                  disabled={piiOptionDisabled}
                  className="mt-0.5"
                />
                <div>
                  <span className="font-medium text-foreground">Anonimizar dados pessoais</span>
                  <p className="text-xs text-muted-foreground">
                    Remove informações identificáveis antes de gerar o arquivo.
                  </p>
                  {piiOptionDisabled && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-yellow-600">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Requer permissão de dados sensíveis.
                    </p>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm">
                <Checkbox
                  checked={zip}
                  onCheckedChange={value => setZip(Boolean(value))}
                  className="mt-0.5"
                />
                <div>
                  <span className="font-medium text-foreground">Compactar em ZIP</span>
                  <p className="text-xs text-muted-foreground">
                    Gera o arquivo em um pacote .zip para facilitar o download.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm">
                <Checkbox
                  checked={includeAttachments}
                  onCheckedChange={value => setIncludeAttachments(Boolean(value))}
                  className="mt-0.5"
                />
                <div>
                  <span className="font-medium text-foreground">Incluir anexos relacionados</span>
                  <p className="text-xs text-muted-foreground">
                    Adiciona anexos e documentos vinculados a cada registro quando disponível.
                  </p>
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Resumo dos filtros:</span>{' '}
              {appliedFilters.search ? `Busca por "${appliedFilters.search}" • ` : ''}
              {appliedFilters.status && appliedFilters.status !== 'todos' ? `Status: ${appliedFilters.status} • ` : ''}
              {appliedFilters.tipo && appliedFilters.tipo !== 'todos' ? `Tipo: ${appliedFilters.tipo} • ` : ''}
              Período: {formatDate(intervalStart)} - {formatDate(intervalEnd)}
            </p>
          </section>
        </div>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !canExport}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            {isSubmitting ? 'Gerando...' : 'Exportar agora'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ExportModalTrigger() {
  const { setOpen, canExport, selectedRows } = useExportModalContext()
  const label = selectedRows.length > 0 ? `Exportar (${selectedRows.length})` : 'Exportar'

  return (
    <Button
      type="button"
      onClick={() => setOpen(true)}
      disabled={!canExport}
      className="h-10 rounded-xl bg-orange-600 px-4 text-white shadow-sm hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
    >
      <Download className="mr-2 h-5 w-5" />
      {label}
    </Button>
  )
}

export default ExportModalTrigger
