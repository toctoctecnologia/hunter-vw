import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { safeGetJSON, safeSetJSON } from '@/utils/storage';

interface SaveDashboardButtonProps {
  layout?: unknown;
  onLoad?: (layout: unknown) => void;
}

const LAYOUT_KEY = 'leads.dashboard.layout';

export default function SaveDashboardButton({ layout, onLoad }: SaveDashboardButtonProps) {
  useEffect(() => {
    const stored = safeGetJSON<unknown>(LAYOUT_KEY);
    if (stored && onLoad) {
      onLoad(stored);
    }
  }, [onLoad]);

  const handleClick = () => {
    try {
      safeSetJSON(LAYOUT_KEY, layout ?? {});
      toast({ title: 'Dashboard salva' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button variant="outline" onClick={handleClick} aria-label="Salvar dashboard">
      Salvar
    </Button>
  );
}

