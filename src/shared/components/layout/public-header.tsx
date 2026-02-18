'use client';

import { Logo } from './logo';

interface PublicHeaderProps {
  title?: string;
}
export function PublicHeader({ title }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo width={150} />

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{title || 'Cadastro de Imóvel'}</p>
        </div>
      </div>
    </header>
  );
}
