import { cn } from '@/lib/utils'

export interface HeroPanelProps {
  imageUrl?: string
  title?: string
  description?: string
  className?: string
}

const FALLBACK_HERO_URL =
  'https://images.unsplash.com/photo-1512914890250-353c27c3a9a6?auto=format&fit=crop&w=1600&q=80'

export function HeroPanel({ imageUrl, title, description, className }: HeroPanelProps) {
  const envImage = typeof import.meta.env.VITE_BRAND_HERO_URL === 'string' ? import.meta.env.VITE_BRAND_HERO_URL : undefined
  const resolvedImage = imageUrl?.trim() || envImage?.trim() || FALLBACK_HERO_URL

  return (
    <div
      className={cn(
        'relative flex h-full min-h-[280px] w-full items-end overflow-hidden bg-slate-900 text-white',
        'lg:min-h-[720px] lg:rounded-l-[48px] lg:shadow-2xl lg:shadow-slate-900/30',
        className,
      )}
    >
      <img
        src={resolvedImage}
        alt={title ?? 'Imóvel de alto padrão'}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/60 to-slate-900/20" />
      <div className="relative z-10 flex w-full flex-col gap-6 p-10 sm:p-14">
        <div className="max-w-xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200/90">Hunter CRM</p>
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            {title ?? 'Resultados reais para imobiliárias modernas'}
          </h2>
          <p className="text-base text-slate-200/90 sm:text-lg">
            {description ??
              'Automatize a sua operação comercial, transforme oportunidades em vendas e acompanhe sua carteira em tempo real com o Hunter.'}
          </p>
        </div>
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-3xl font-semibold text-white">+35%</p>
            <p className="text-sm text-slate-100/70">Aumento na conversão de leads qualificados</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-3xl font-semibold text-white">24h</p>
            <p className="text-sm text-slate-100/70">Integrações e relatórios em tempo real</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroPanel
