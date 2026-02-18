import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, LogIn } from 'lucide-react';

interface PortalLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const PortalLayout = ({ title, subtitle, children }: PortalLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/branding/hunter-full-logo.svg" alt="Hunter" className="h-7" />
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-orange-300">Portal Hunter</p>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
            <Building2 className="mr-2 h-4 w-4" />
            Ajuda
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-400 text-white">
            <LogIn className="mr-2 h-4 w-4" />
            Acessar
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-sm text-white/60">{subtitle}</p>
        {children}
      </div>
    </div>
  );
};

export default PortalLayout;
