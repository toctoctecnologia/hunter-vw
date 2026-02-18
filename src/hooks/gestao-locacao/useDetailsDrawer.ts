import { useCallback, useState } from 'react';

export interface DetailsDrawerContext<T> {
  title: string;
  description?: string;
  filters?: { label: string; value: string }[];
  rows: T[];
}

export const useDetailsDrawer = <T,>() => {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<DetailsDrawerContext<T> | null>(null);

  const openDrawer = useCallback((next: DetailsDrawerContext<T>) => {
    setContext(next);
    setOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setOpen(false), []);

  return {
    open,
    setOpen,
    context,
    openDrawer,
    closeDrawer,
  };
};

export default useDetailsDrawer;
