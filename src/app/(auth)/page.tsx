import { cn } from '@/shared/lib/utils';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LoginForm } from '@/features/dashboard/auth/components/form/login-form';
import { Logo } from '@/shared/components/layout/logo';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-primary-foreground dark:bg-zinc-900 lg:grid lg:grid-cols-[minmax(0,520px)_1fr]">
      <div className="flex w-full flex-col p-3 sm:p-4 lg:p-6">
        <div className="px-2 sm:px-4">
          <Logo width={120} height={100} />
        </div>

        <div className="flex-1 flex items-center">
          <Card className="w-full shadow-none border-none bg-primary-foreground dark:bg-zinc-900">
            <CardHeader className="px-2 sm:px-4">
              <CardTitle className="text-2xl sm:text-3xl">Bem-vindo de volta</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Acesse o Hunter CRM com suas credenciais corporativas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-4">
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>

      <div
        className={cn(
          'relative flex h-full min-h-[280px] w-full items-end overflow-hidden bg-slate-900 text-white',
          'lg:min-h-[720px] lg:rounded-l-[64px] lg:shadow-2xl lg:shadow-slate-900/30',
          'relative hidden overflow-hidden lg:block',
        )}
      >
        <img
          src="/login-hero.jpg"
          alt="Imóvel de alto padrão"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/60 to-slate-900/20" />
        <div className="relative z-10 flex w-full flex-col gap-6 p-10 sm:p-14">
          <div className="max-w-xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200/90">Hunter CRM</p>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Resultados reais para quem vive de vendas
            </h2>
            <p className="text-base text-slate-200/90 sm:text-lg">
              Aumente sua conversão, acelere sua operação e transforme cada lead em oportunidade real. O Hunter foi
              criado para corretores e imobiliárias que querem caçar resultados de verdade, com inteligência, velocidade
              e domínio total da carteira.
            </p>
          </div>
          <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-lg">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-3xl font-semibold text-white">+35%</p>
              <p className="text-sm text-slate-100/70">Mais conversão em leads qualificados</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-3xl font-semibold text-white">24h</p>
              <p className="text-sm text-slate-100/70">Integrações e relatórios em tempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
