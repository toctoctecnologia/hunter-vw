import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/ui/useIsMobile'

interface UpdateItem {
  id: string
  texto: string
  createdAt: string
  author?: { id: string; name: string }
}

interface UpdatesPanelProps {
  title: string
  subject: { kind: 'lead' | 'property'; id: string }
}

export function UpdatesPanel({ title, subject }: UpdatesPanelProps) {
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [message, setMessage] = useState('')
  const isMobile = useIsMobile()

  const storageKey = `updates-${subject.kind}-${subject.id}`
  const endpoint = subject.kind === 'lead'
    ? `/api/leads/${subject.id}/updates`
    : `/api/imoveis/${subject.id}/updates`

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error('request failed')
        const data: UpdateItem[] = await res.json()
        if (active) setUpdates(data)
        localStorage.setItem(storageKey, JSON.stringify(data))
      } catch {
        const cached = localStorage.getItem(storageKey)
        if (cached && active) setUpdates(JSON.parse(cached))
      }
    }
    load()
    return () => { active = false }
  }, [endpoint, storageKey])

  const handleSubmit = async () => {
    const texto = message.trim()
    if (!texto) return
    const optimistic: UpdateItem = {
      id: `local-${Date.now()}`,
      texto,
      createdAt: new Date().toISOString(),
      author: { id: 'local', name: 'Você' }
    }
    const next = [...updates, optimistic]
    setUpdates(next)
    setMessage('')
    localStorage.setItem(storageKey, JSON.stringify(next))
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto })
      })
      if (!res.ok) throw new Error('request failed')
      const saved: UpdateItem = await res.json()
      const replaced = next.map(u => (u.id === optimistic.id ? saved : u))
      setUpdates(replaced)
      localStorage.setItem(storageKey, JSON.stringify(replaced))
    } catch {
      // keep optimistic locally if request fails
    }
  }

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })

  return (
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 w-full">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-2xl">
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Descreva a atualização..."
              className="border-gray-200 focus:border-orange-500 rounded-xl resize-none min-h-[120px]"
              rows={isMobile ? 3 : 6}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50"
                size="sm"
              >
                Salvar
              </Button>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {updates.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Nenhuma atualização registrada ainda
              </div>
            ) : (
              updates.map(update => (
                <div key={update.id} className="border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-900 mb-1">{update.texto}</p>
                  <p className="text-xs text-gray-500">{formatDate(update.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
  )
}

