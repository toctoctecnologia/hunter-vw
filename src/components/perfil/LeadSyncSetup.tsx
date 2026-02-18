import { useState } from 'react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface LeadSyncSetupProps {
  provider: string
  onClose: () => void
  onSync: () => Promise<void>
}

export const LeadSyncSetup = ({ provider, onClose, onSync }: LeadSyncSetupProps) => {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'done'>('idle')
  const { toast } = useToast()

  const handleSync = async () => {
    setStatus('syncing')
    try {
      await onSync()
      setStatus('done')
      toast({
        title: `${provider} conectado!`,
        description: 'Leads sincronizados com sucesso.'
      })
    } catch (e) {
      toast({
        title: 'Erro na sincronização',
        description: 'Não foi possível obter leads.',
        variant: 'destructive'
      })
      setStatus('idle')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">{provider} Leads</h2>
          </div>
        </div>
        <div className="p-6 text-center space-y-6">
          {status !== 'done' ? (
            <>
              <p className="text-gray-600">Autorize o acesso para sincronizar seus leads.</p>
              <Button onClick={handleSync} disabled={status === 'syncing'} className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white rounded-full py-3">
                {status === 'syncing' ? 'Sincronizando...' : 'Autorizar'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-700">Leads sincronizados com sucesso!</p>
              <Button onClick={onClose} className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white rounded-full py-3">
                Concluir
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
