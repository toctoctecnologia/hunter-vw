import { Bell, LogOut, Settings, SlidersHorizontal, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLauncher from '@/components/header/AppLauncher';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface GlobalTopBarProps {
  className?: string;
}

export function GlobalTopBar({ className }: GlobalTopBarProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card px-6 ${
        className ?? ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Hunter · Dashboard</span>
          <h1 className="text-lg font-semibold text-foreground">Olá, Paulo</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end md:flex-nowrap">
        <ThemeSwitcher compact className="whitespace-nowrap shrink-0" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notificações"
          className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-muted flex-shrink-0"
          onClick={() => navigate('/notificacoes')}
        >
          <Bell className="h-5 w-5" />
        </Button>
        <AppLauncher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Abrir configurações"
              className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-muted flex-shrink-0"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Configurações</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => navigate('/perfil')}>Perfil e conta</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/configuracoes')}>Preferências</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/notificacoes')}>
              Central de notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Perfil"
              className="h-10 w-10 rounded-full border border-border bg-muted p-0 overflow-hidden hover:bg-accent flex-shrink-0"
            >
              <img
                src="/uploads/6af569d2-dc3a-4668-8d4f-843a7c62507d.png"
                alt="Paulo"
                className="h-full w-full object-cover"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Conta</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => navigate('/perfil')}>
              <UserCircle2 className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/configuracoes')}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Preferências
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => navigate('/sair')}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default GlobalTopBar;
