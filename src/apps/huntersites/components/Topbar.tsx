import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { HunterSitesOutletContext } from '../data/demo';

interface TopbarProps {
  context: HunterSitesOutletContext;
}

const titles: Record<string, { title: string; subtitle: string }> = {
  '/apps/huntersites': {
    title: 'Visão geral',
    subtitle: 'Acompanhe a performance das suas experiências digitais.',
  },
  '/apps/huntersites/sites': {
    title: 'Meus sites',
    subtitle: 'Administre domínios, status e experiências publicadas.',
  },
  '/apps/huntersites/templates': {
    title: 'Templates',
    subtitle: 'Selecione modelos otimizados para cada jornada.',
  },
  '/apps/huntersites/landings': {
    title: 'Landing pages',
    subtitle: 'Coleções de campanhas com dados de performance em tempo real.',
  },
  '/apps/huntersites/analytics': {
    title: 'Analytics',
    subtitle: 'Resultados das principais origens de tráfego e conversão.',
  },
  '/apps/huntersites/settings': {
    title: 'Configurações',
    subtitle: 'Equipe, integrações e governança do HunterSites.',
  },
  '/apps/huntersites/billing': {
    title: 'Pagamentos',
    subtitle: 'Detalhes do plano, histórico e status de cobrança.',
  },
};

export function Topbar({ context }: TopbarProps) {
  const location = useLocation();
  const current = useMemo(() => {
    return titles[location.pathname] ?? titles['/apps/huntersites'];
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-between border-b border-border bg-card/80 px-6 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">HunterSites</p>
        <h1 className="text-xl font-semibold text-foreground">{current.title}</h1>
        <p className="text-sm text-muted-foreground">
          {current.subtitle}
          {context.usingMock && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Demo ativa
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <Plus className="mr-2 h-4 w-4" /> Novo site
        </Button>
      </div>
    </div>
  );
}
