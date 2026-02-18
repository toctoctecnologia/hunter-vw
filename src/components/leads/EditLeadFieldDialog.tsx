import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    setMatches(media.matches);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export interface EditLeadFieldDialogProps<T extends Record<string, any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  form: UseFormReturn<T>;
  onSubmit: (values: T) => Promise<void> | void;
  children: React.ReactNode;
}

export function EditLeadFieldDialog<T extends Record<string, any>>({
  open,
  onOpenChange,
  title,
  form,
  onSubmit,
  children,
}: EditLeadFieldDialogProps<T>) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const Body = (
    <div className="max-h-[78vh] overflow-y-auto px-6 pb-6 pt-2">{children}</div>
  );

  const Footer = (
    <div className="flex items-center justify-end gap-2 px-6 pb-4">
      <Button
        type="button"
        variant="outline"
        className="rounded-xl"
        onClick={() => onOpenChange(false)}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        className="bg-[hsl(var(--accent))] text-white hover:bg-[hsl(var(--accentHover))] rounded-xl"
      >
        Salvar
      </Button>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-[560px] lg:max-w-[720px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {Body}
              <DialogFooter className="border-t">{Footer}</DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85dvh] p-0">
        <DrawerHeader className="px-6 pt-6">
          <DrawerTitle className="text-lg font-semibold text-gray-900">{title}</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {Body}
            <DrawerFooter className="border-t">{Footer}</DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

export default EditLeadFieldDialog;
