"use client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  Globe, 
  Megaphone, 
  BarChart3, 
  Home, 
  UserPlus,
  Users,
  DollarSign,
  Wallet,
  Palette, 
  TrendingUp, 
  FileText, 
  Settings 
} from "lucide-react";

type AppLink = { 
  name: string; 
  href: string; 
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
};

const APPS: AppLink[] = [
  { name: "Hunter CRM", href: "/", icon: Home, description: "Visão geral da operação" },
  { name: "Toc Toc Fotos", href: "/apps/toctoc", icon: MessageSquare, description: "Comunicação e fotos" },
  { name: "Hunter Sites", href: "/apps/huntersites", icon: Globe, description: "Gestão de sites" },
  { name: "Disparador", href: "/apps/disparador", icon: Megaphone, description: "Campanhas e marketing" },
  { name: "Hunter Pesquisas", href: "/apps/pesquisas", icon: BarChart3, description: "Pesquisas e análises" },
  { name: "Hunter Stay", href: "/apps/locacoes", icon: Home, description: "Gestão de locações" },
  { name: "Hunter Finanças", href: "/apps/financas", icon: Wallet, description: "ERP financeiro imobiliário" },
  { name: "Super Admin", href: "/gestao-acessos", icon: Users, description: "Permissões e acessos" },
  { name: "Marketplace", href: "/apps", icon: Palette, description: "Produtos e integrações" },
  { name: "Portal Proprietários", href: "/apps/portal-proprietarios", icon: Users, description: "Acesso dos proprietários" },
  { name: "Portal Locatários", href: "/apps/portal-locatarios", icon: Users, description: "Acesso dos locatários" },
  { name: "Indicação", href: "/apps/indicacao", icon: UserPlus, description: "Programa de indicação" },
  { name: "Comissões", href: "/vendas/comissoes", icon: DollarSign, description: "Rastreamento de comissões" },
  { name: "Templates", href: "/templates", icon: Palette, description: "Modelos e designs" },
  { name: "Analytics", href: "/analytics", icon: TrendingUp, description: "Métricas e relatórios" },
  { name: "Blog", href: "/blog", icon: FileText, description: "Conteúdo e artigos" },
  { name: "Configurações", href: "/configuracoes", icon: Settings, description: "Configurações do sistema" },
];

function NineDotsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      {Array.from({ length: 9 }).map((_, i) => {
        const row = Math.floor(i / 3), col = i % 3;
        return <circle key={i} cx={6 + col * 6} cy={6 + row * 6} r="1.5" />;
      })}
    </svg>
  );
}

export default function AppLauncher() {
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleAppClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lastVisitedApp", href);
    }
    navigate(href);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, []);

  useEffect(() => {
    if (open) popRef.current?.querySelector<HTMLAnchorElement>("a[data-app]")?.focus();
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-label="Abrir iniciador de aplicativos"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)]"
      >
        <NineDotsIcon className="fill-current text-gray-500" />
      </button>

      {open && (
        <div
          ref={popRef}
          role="menu"
          aria-label="Aplicativos Hunter"
          className="absolute right-0 z-50 mt-2 w-80 rounded-[var(--radius-xl)] border border-[var(--ui-stroke)] bg-[var(--ui-popover)] p-3 shadow-[var(--shadow-md)]"
        >
          <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
            {APPS.map(app => {
              const IconComponent = app.icon;
              return (
                <a
                  key={app.name}
                  href={app.href}
                  onClick={(e) => handleAppClick(e, app.href)}
                  data-app
                  role="menuitem"
                  className="group flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--ui-stroke)] bg-[var(--ui-card)] px-3 py-2 text-left outline-none transition hover:border-[var(--ui-stroke-strong)] hover:shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)]"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-[12px] border border-[var(--ui-stroke)] bg-white shadow-[var(--shadow-sm)]">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[var(--ui-text)]">{app.name}</span>
                    {app.description ? (
                      <span className="text-xs text-[var(--ui-text-subtle)]">{app.description}</span>
                    ) : null}
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-3 border-t border-[var(--ui-stroke)] pt-3 text-center">
            <a 
              href="/apps" 
              onClick={(e) => handleAppClick(e, "/apps")}
              className="text-xs text-[var(--ui-text-subtle)] underline-offset-2 hover:underline"
            >
              Ver todos os aplicativos
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
