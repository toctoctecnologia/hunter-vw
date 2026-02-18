import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  filters?: { label: string; value: string }[];
  onClearFilters?: () => void;
  onExportCsv?: () => void;
  onExportPdf?: () => void;
  onCopyList?: () => void;
  filterContent?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const DetailsDrawer = ({
  open,
  onOpenChange,
  title,
  description,
  filters = [],
  onClearFilters,
  onExportCsv,
  onExportPdf,
  onCopyList,
  filterContent,
  children,
  className,
}: DetailsDrawerProps) => (
  <Drawer open={open} onOpenChange={onOpenChange}>
    <DrawerContent className={cn('max-h-[92dvh] p-0', className)}>
      <DrawerHeader className="border-b border-[var(--ui-stroke)] px-6 py-4 text-left">
        <div className="flex items-start justify-between gap-4">
          <div>
            <DrawerTitle className="text-xl font-semibold text-[var(--ui-text)]">{title}</DrawerTitle>
            {description && (
              <DrawerDescription className="text-sm text-[var(--ui-text-subtle)] mt-1">
                {description}
              </DrawerDescription>
            )}
          </div>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-[var(--ui-stroke)]/50"
              aria-label="Fechar detalhes"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {filters.map((filter) => (
            <Badge
              key={`${filter.label}-${filter.value}`}
              variant="outline"
              className="rounded-full border-[var(--ui-stroke)] text-[var(--ui-text)]"
            >
              {filter.label}: {filter.value}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex flex-wrap items-center gap-2">
            {onExportCsv && (
              <Button
                variant="outline"
                className="rounded-xl border-[var(--ui-stroke)]"
                onClick={onExportCsv}
                type="button"
              >
                Exportar CSV
              </Button>
            )}
            {onExportPdf && (
              <Button
                variant="outline"
                className="rounded-xl border-[var(--ui-stroke)]"
                onClick={onExportPdf}
                type="button"
              >
                Exportar PDF
              </Button>
            )}
            {onCopyList && (
              <Button
                variant="outline"
                className="rounded-xl border-[var(--ui-stroke)]"
                onClick={onCopyList}
                type="button"
              >
                Copiar lista
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            className="rounded-xl text-[hsl(var(--link))] hover:bg-[var(--ui-stroke)]/50"
            onClick={onClearFilters}
            type="button"
          >
            Limpar filtros
          </Button>
        </div>
        {filterContent && <div className="mt-4">{filterContent}</div>}
      </DrawerHeader>
      <div className="overflow-y-auto px-6 py-5">{children}</div>
    </DrawerContent>
  </Drawer>
);

export default DetailsDrawer;
