import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, User, Info, DollarSign, Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  createDeal,
  createDealParticipants,
  type DealParticipantInput,
  type DealStatus,
  type LeadDealDraft,
} from '@/api/deals'

const PROPOSAL_STATUS_OPTIONS: { label: string; value: DealStatus }[] = [
  { label: 'Rascunho', value: 'draft' },
  { label: 'Enviada', value: 'sent' },
  { label: 'Em negociação', value: 'negotiating' },
  { label: 'Aprovada', value: 'approved' },
  { label: 'Recusada', value: 'rejected' },
]

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const createEmptyParticipant = (): DealParticipantInput => {
  const id = `participant-${crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)}`
  return {
    id,
    memberId: id,
    name: '',
    percent: 100,
  }
}

interface NextStepDialogProps {
  open: boolean
  onClose: () => void
  leadId: number | string
  leadName?: string
  leadSource?: string
}

export function NextStepDialog({ open, onClose, leadId, leadName = "Luciano Machado", leadSource = "DALL ATMOSPHERE - SUPERFILTRO V2 - LANÇAMENTO" }: NextStepDialogProps) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [view, setView] = useState<'main' | 'proposta' | 'negocio'>('main')
  const [proposalValue, setProposalValue] = useState('')
  const [proposalValidUntil, setProposalValidUntil] = useState('')
  const [proposalStatus, setProposalStatus] = useState<DealStatus>('draft')
  const [propertyCode, setPropertyCode] = useState('')
  const [paymentMethods, setPaymentMethods] = useState<string[]>([])
  const [observations, setObservations] = useState('')
  const [dealDate, setDealDate] = useState('21/08/2025')
  const [dealValue, setDealValue] = useState('')
  const [dealNature, setDealNature] = useState('')
  const [dealInfo, setDealInfo] = useState('')
  const [proposalLoading, setProposalLoading] = useState(false)
  const [dealLoading, setDealLoading] = useState(false)
  const [participants, setParticipants] = useState<DealParticipantInput[]>(() => [createEmptyParticipant()])

  const normalizedParticipants = useMemo(
    () =>
      participants.map(participant => ({
        ...participant,
        memberId: participant.memberId || participant.id,
        percent: Number.isFinite(participant.percent)
          ? Math.max(0, Number(participant.percent))
          : 0,
      })),
    [participants],
  )

  if (!open) return null

  const handlePaymentMethodToggle = (method: string) => {
    setPaymentMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    )
  }

  const navigateToDeals = () => {
    navigate(`/lead-vendas/${leadId}?tab=deals`)
  }

  const parseCurrency = (value: string) => {
    const numericValue = Number(value.replace(/\D/g, ''))
    return Number.isFinite(numericValue) ? numericValue : 0
  }

  const parseDateInput = (value: string) => {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (!match) {
      return null
    }

    const [, day, month, year] = match
    const parsed = new Date(Number(year), Number(month) - 1, Number(day))
    if (Number.isNaN(parsed.getTime())) {
      return null
    }

    return parsed.toISOString()
  }

  const parseDateOrNow = (value: string) => parseDateInput(value) ?? new Date().toISOString()

  const parsedProposalAmount = useMemo(() => parseCurrency(proposalValue), [proposalValue])
  const parsedDealAmount = useMemo(() => parseCurrency(dealValue), [dealValue])

  const sanitizeText = (value: string) => (value.trim().length ? value.trim() : undefined)

  const handleAddParticipant = () => {
    const participant = createEmptyParticipant()
    setParticipants(prev => [...prev, { ...participant, percent: 0 }])
  }

  const handleParticipantInputChange = (id: string, field: 'name' | 'role', value: string) => {
    setParticipants(prev =>
      prev.map(participant =>
        participant.id === id
          ? {
              ...participant,
              [field]: value,
            }
          : participant,
      ),
    )
  }

  const handleParticipantPercentChange = (id: string, value: string) => {
    const numericValue = Number(value)
    setParticipants(prev =>
      prev.map(participant =>
        participant.id === id
          ? {
              ...participant,
              percent: Number.isFinite(numericValue) ? Math.max(0, numericValue) : 0,
            }
          : participant,
      ),
    )
  }

  const handleRemoveParticipant = (id: string) => {
    setParticipants(prev => {
      if (prev.length <= 1) return prev
      return prev.filter(participant => participant.id !== id)
    })
  }

  const renderParticipantsEditor = (amount: number) => {
    const participantsWithAmount = createDealParticipants(normalizedParticipants, amount)
    const totalPercent = normalizedParticipants.reduce((total, participant) => total + participant.percent, 0)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Participantes do negócio</h3>
          <button
            type="button"
            onClick={handleAddParticipant}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[var(--tt-orange)] hover:text-[var(--tt-orange)]"
          >
            <Plus className="h-4 w-4" />
            Adicionar participante
          </button>
        </div>

        <div className="space-y-4">
          {participants.map((participant, index) => {
            const amountValue = participantsWithAmount[index]?.amount ?? 0
            return (
              <div key={participant.id} className="space-y-3 rounded-xl border border-gray-200 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Papel
                    </label>
                    <input
                      type="text"
                      value={participant.role ?? ''}
                      onChange={(event) => handleParticipantInputChange(participant.id, 'role', event.target.value)}
                      placeholder="Ex.: Corretor"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--tt-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--tt-orange)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={participant.name}
                      onChange={(event) => handleParticipantInputChange(participant.id, 'name', event.target.value)}
                      placeholder="Quem participa deste negócio?"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--tt-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--tt-orange)]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      % do negócio
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={participant.percent}
                      onChange={(event) => handleParticipantPercentChange(participant.id, event.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--tt-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--tt-orange)]"
                    />
                  </div>
                  <div className="flex flex-col justify-end gap-1 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                    <span className="text-xs uppercase tracking-wide text-gray-500">Montante estimado</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(amountValue)}</span>
                  </div>
                </div>

                {participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(participant.id)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover participante
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-600">
          <span>Total distribuído</span>
          <span className="font-semibold text-gray-900">{totalPercent}%</span>
        </div>
      </div>
    )
  }

  const handleSuccess = (message: string) => {
    toast({ title: message })
    navigateToDeals()
    setView('main')
    setProposalValue('')
    setProposalValidUntil('')
    setProposalStatus('draft')
    setPropertyCode('')
    setPaymentMethods([])
    setObservations('')
    setDealValue('')
    setDealNature('')
    setDealInfo('')
    setParticipants([createEmptyParticipant()])
    onClose()
  }

  const handleProposalSubmit = async () => {
    if (proposalLoading) return

    const value = parsedProposalAmount
    if (!value) {
      toast({ title: 'Informe o valor da proposta' })
      return
    }

    if (!proposalValidUntil.trim()) {
      toast({ title: 'Informe a validade da proposta' })
      return
    }

    const proposalValidUntilISO = parseDateInput(proposalValidUntil)
    if (!proposalValidUntilISO) {
      toast({ title: 'Use uma data válida no formato dd/mm/aaaa' })
      return
    }

    if (!PROPOSAL_STATUS_OPTIONS.some(option => option.value === proposalStatus)) {
      toast({ title: 'Selecione um status inicial para a proposta' })
      return
    }

    const participantsPayload = normalizedParticipants.map(participant => ({
      ...participant,
      name: participant.name.trim(),
      role: (participant.role?.trim() || undefined) as 'corretor' | 'captador' | 'coordenador' | 'assistente' | undefined,
    }))

    if (!participantsPayload.some(participant => participant.percent > 0)) {
      toast({ title: 'Defina ao menos um participante com percentual maior que zero' })
      return
    }

    setProposalLoading(true)
    try {
      const payload: LeadDealDraft = {
        leadId: String(leadId),
        kind: 'proposal_sale',
        status: proposalStatus,
        title: propertyCode ? `Proposta - ${propertyCode}` : `Proposta - ${leadName}`,
        amount: value,
        notes: sanitizeText(observations),
        paymentMethod: paymentMethods.length ? paymentMethods.join(', ') : undefined,
        proposalSentAt: new Date().toISOString(),
        proposalValidUntil: proposalValidUntilISO,
        participants: participantsPayload,
      }

      await createDeal(String(leadId), payload)
      handleSuccess('Proposta registrada em Negócios')
    } catch {
      toast({ title: 'Erro ao cadastrar proposta' })
    } finally {
      setProposalLoading(false)
    }
  }

  const handleDealSubmit = async () => {
    if (dealLoading) return

    const value = parsedDealAmount
    if (!value) {
      toast({ title: 'Informe o valor do negócio' })
      return
    }

    const participantsPayload = normalizedParticipants.map(participant => ({
      ...participant,
      name: participant.name.trim(),
      role: (participant.role?.trim() || undefined) as 'corretor' | 'captador' | 'coordenador' | 'assistente' | undefined,
    }))

    if (!participantsPayload.some(participant => participant.percent > 0)) {
      toast({ title: 'Defina ao menos um participante com percentual maior que zero' })
      return
    }

    setDealLoading(true)
    try {
      const payload: LeadDealDraft = {
        leadId: String(leadId),
        kind: 'won',
        status: 'won',
        title: propertyCode ? `Negócio - ${propertyCode}` : `Negócio fechado - ${leadName}`,
        amount: value,
        notes: sanitizeText(dealInfo),
        paymentMethod: paymentMethods.length ? paymentMethods.join(', ') : undefined,
        closedAt: parseDateOrNow(dealDate),
        participants: participantsPayload,
      }

      await createDeal(String(leadId), payload)
      handleSuccess('Negócio registrado em Negócios')
    } catch {
      toast({ title: 'Erro ao marcar negócio como fechado' })
    } finally {
      setDealLoading(false)
    }
  }

  if (view === 'proposta') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <button
              onClick={() => setView('main')}
              className="text-sm font-medium text-[var(--tt-orange)] hover:text-[var(--tt-orange-dark)] transition-colors"
            >
              ← Voltar
            </button>
            <h2 className="flex-1 text-center text-xl font-semibold text-gray-900">
              Cadastrar nova proposta
            </h2>
            <button onClick={onClose} className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{leadName}</p>
                <p className="text-sm text-gray-600">{leadSource}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Internet / Facebook Leads</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                * Valor da proposta
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="R$"
                  value={proposalValue}
                  onChange={(e) => setProposalValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                * Validade da proposta
              </label>
              <input
                type="text"
                placeholder="dd/mm/aaaa"
                value={proposalValidUntil}
                onChange={(event) => setProposalValidUntil(event.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                * Status inicial
              </label>
              <select
                value={proposalStatus}
                onChange={(event) => setProposalStatus(event.target.value as DealStatus)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-[var(--tt-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--tt-orange)]"
              >
                {PROPOSAL_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Código do imóvel
                </label>
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              <input
                type="text"
                value={propertyCode}
                onChange={(e) => setPropertyCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                * Forma de pagamento
              </label>
              <div className="space-y-2">
                {['Recursos próprios', 'Financiamento', 'Outros'].map((method) => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentMethods.includes(method)}
                      onChange={() => handlePaymentMethodToggle(method)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {renderParticipantsEditor(parsedProposalAmount)}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Observações
              </label>
              <textarea
                placeholder="Alguma observação?"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={3}
                maxLength={250}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
              />
              <div className="text-right text-xs text-gray-400">{observations.length}/250</div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => setView('main')}
              className="btn-ghost flex-1 px-6 py-3 text-gray-700 font-medium transition-colors hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              onClick={handleProposalSubmit}
              disabled={proposalLoading}
              className="flex-1 px-6 py-3 rounded-xl bg-[var(--tt-orange)] text-white font-medium transition-colors hover:bg-[var(--tt-orange-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-orange-dark)] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {proposalLoading ? 'Salvando…' : 'Salvar proposta'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'negocio') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <button
              onClick={() => setView('main')}
              className="text-sm font-medium text-[var(--tt-orange)] hover:text-[var(--tt-orange-dark)] transition-colors"
            >
              ← Voltar
            </button>
            <h2 className="flex-1 text-center text-xl font-semibold text-gray-900">
              Marcar lead como negócio fechado
            </h2>
            <button onClick={onClose} className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                * Informe a data de fechamento do lead
              </label>
              <input
                type="text"
                value={dealDate}
                onChange={(e) => setDealDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                * Valor real do negócio fechado
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">R$</span>
                <input
                  type="text"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Código do imóvel (opcional)
              </label>
              <input
                type="text"
                value={propertyCode}
                onChange={(e) => setPropertyCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                * Natureza
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'compra', label: 'Compra' },
                  { id: 'aluguel', label: 'Aluguel' },
                  { id: 'lancamento', label: 'Lançamento' },
                  { id: 'captacao', label: 'Captação' }
                ].map((nature) => (
                  <label key={nature.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dealNature"
                      value={nature.id}
                      checked={dealNature === nature.id}
                      onChange={(e) => setDealNature(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{nature.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {renderParticipantsEditor(parsedDealAmount)}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Informações sobre a venda (opcional):
              </label>
              <textarea
                value={dealInfo}
                onChange={(e) => setDealInfo(e.target.value)}
                rows={3}
                maxLength={255}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
              />
              <div className="text-right text-xs text-gray-400">{dealInfo.length}/255</div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => setView('main')}
              className="btn-ghost flex-1 px-6 py-3 text-gray-700 font-medium transition-colors hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              onClick={handleDealSubmit}
              disabled={dealLoading}
              className="flex-1 px-6 py-3 rounded-xl bg-[var(--tt-orange)] text-white font-medium transition-colors hover:bg-[var(--tt-orange-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-orange-dark)] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {dealLoading ? 'Salvando…' : 'Registrar negócio'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">Defina seu próximo passo</h3>
          <div className="w-9 h-9" />
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => setView('proposta')}
            className="w-full p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl font-medium hover:bg-orange-100 transition-colors"
          >
            Fazer Proposta
          </button>
          
          <button
            onClick={() => setView('negocio')}
            className="w-full p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl font-medium hover:bg-orange-100 transition-colors"
          >
            Negócio Fechado
          </button>
        </div>
      </div>
    </div>
  )
}

export default NextStepDialog
