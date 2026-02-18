import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Link2, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HunterSite } from '../data/demo';

interface SiteCardProps {
  site: HunterSite;
}

const statusMap: Record<HunterSite['status'], { label: string; tone: string }> = {
  online: { label: 'Publicado', tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200' },
  draft: { label: 'Rascunho', tone: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200' },
  paused: { label: 'Pausado', tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200' },
};

export function SiteCard({ site }: SiteCardProps) {
  const [open, setOpen] = useState(false);
  const editorBase = `/editor?site=${encodeURIComponent(site.id)}`;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--hs-border-subtle)] bg-[var(--hs-card)] p-6 shadow-[var(--hs-shadow-sm)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-[var(--hs-text-primary)]">{site.name}</h3>
            <Badge className={`${statusMap[site.status].tone} border-none`}>{statusMap[site.status].label}</Badge>
          </div>
          <p className="mt-1 text-sm text-[var(--hs-text-muted)]">{site.description}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="bg-[var(--hs-accent-soft)] text-[var(--hs-accent)] hover:bg-[var(--hs-accent-soft)]/80">
              <PlayCircle className="mr-2 h-4 w-4" /> Pré-visualizar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl overflow-hidden border-none bg-[var(--hs-popover)] p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-lg font-semibold text-[var(--hs-text-primary)]">{site.name}</DialogTitle>
              <DialogDescription className="text-sm text-[var(--hs-text-muted)]">
                Preview responsivo gerado automaticamente.
              </DialogDescription>
            </DialogHeader>
            <div className="h-[560px]">
              <iframe title={site.name} src={site.previewUrl} className="h-full w-full border-0" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--hs-text-muted)]">
        <Link2 className="h-4 w-4" />
        <a href={`https://${site.domain}`} target="_blank" rel="noreferrer" className="hover:text-[var(--hs-accent)]">
          {site.domain}
        </a>
        <span aria-hidden className="text-[var(--hs-border-strong)]">•</span>
        <span>{site.updatedAt}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {site.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-[var(--hs-accent-soft)] text-[var(--hs-accent)]">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline" className="border-[var(--hs-accent)] text-[var(--hs-accent)] hover:bg-[var(--hs-accent-soft)]">
          <Link to={`${editorBase}&mode=edit`}>
            <ExternalLink className="mr-2 h-4 w-4" /> Editar
          </Link>
        </Button>
        <Button asChild variant="ghost" className="text-[var(--hs-text-muted)] hover:text-[var(--hs-accent)]">
          <Link to={`${editorBase}&tab=settings`}>
            <SettingsIcon className="mr-2 h-4 w-4" /> Configurações
          </Link>
        </Button>
      </div>
    </div>
  );
}

function SettingsIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}
