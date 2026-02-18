import { type FormEvent, type ReactNode, useState } from 'react'

import { cn } from '@/lib/utils'

import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { HunterLogo } from '../branding/HunterLogo'

export interface AuthCardProps {
  title: string
  subtitle?: string
  description?: string
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export function AuthCard({
  title,
  subtitle,
  description,
  footer,
  children,
  className,
}: AuthCardProps) {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const { toast } = useToast()

  const handleForgotPasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsForgotPasswordOpen(false)
    setForgotPasswordEmail('')
    toast({
      description: 'Se existisse, você receberia um email 😉',
    })
  }

  return (
    <>
      <div
        className={cn(
          'w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-900/10 backdrop-blur',
          'sm:p-10',
          className,
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <HunterLogo className="h-10 w-auto text-slate-900" />
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
              {subtitle ? <p className="text-base text-slate-600">{subtitle}</p> : null}
              {description ? <p className="text-sm text-slate-500">{description}</p> : null}
            </div>
          </div>

          <div className="space-y-6">{children}</div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-sm font-medium text-orange-500 transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
              >
                Esqueci minha senha
              </button>
              {footer ? <div className="text-right sm:text-left">{footer}</div> : null}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isForgotPasswordOpen}
        onOpenChange={(open) => {
          setIsForgotPasswordOpen(open)
          if (!open) {
            setForgotPasswordEmail('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>
              Informe o e-mail cadastrado para enviarmos as instruções de recuperação.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
            <div className="space-y-2">
              <Label htmlFor="forgot-password-email">E-mail</Label>
              <Input
                id="forgot-password-email"
                type="email"
                value={forgotPasswordEmail}
                onChange={(event) => setForgotPasswordEmail(event.target.value)}
                placeholder="voce@empresa.com"
                required
              />
            </div>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Fechar
                </Button>
              </DialogClose>
              <Button type="submit" variant="orange">
                Enviar instruções (mock)
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AuthCard
