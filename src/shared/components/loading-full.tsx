import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingFullProps {
  title: string;
  description?: string;
}

export function LoadingFull({ title, description = 'Isso pode levar alguns segundos' }: LoadingFullProps) {
  React.useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div className="fixed inset-0 h-screen bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </div>
    </div>
  );
}
