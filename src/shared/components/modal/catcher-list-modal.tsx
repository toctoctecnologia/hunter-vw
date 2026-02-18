import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Search, User, Users, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { cn, getUserNameInitials } from '@/shared/lib/utils';
import { ModalProps } from '@/shared/types';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { getUsers } from '@/features/dashboard/access-control/api/user';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export type SelectedItem = {
  uuid: string;
  name: string;
};

interface CatcherListModalProps extends Omit<ModalProps, 'title'> {
  onConfirm: (selected: SelectedItem[]) => void;
  initialSelected?: SelectedItem[];
  maxSelection?: number;
}

const PAGE_SIZE = 20;

export function CatcherListModal({ onConfirm, initialSelected = [], maxSelection, ...rest }: CatcherListModalProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 400);
  const [pageIndex, setPageIndex] = useState(0);

  const {
    data: usersData = { content: [], totalPages: 0, totalElements: 0 },
    isLoading: isLoadingUsers,
    isFetching,
  } = useQuery({
    queryKey: ['catcher-list-users', debouncedSearch, pageIndex],
    queryFn: () => getUsers({ pageIndex, pageSize: PAGE_SIZE }, debouncedSearch || undefined),
  });

  const isSelected = useCallback((uuid: string) => selectedItems.some((item) => item.uuid === uuid), [selectedItems]);
  const availableOptions = usersData.content.map((user) => ({ uuid: String(user.uuid), name: user.name }));
  const hasNextPage = pageIndex < usersData.totalPages - 1;
  const hasPrevPage = pageIndex > 0;

  const handleToggle = (option: SelectedItem) => {
    if (isSelected(option.uuid)) {
      setSelectedItems(selectedItems.filter((item) => item.uuid !== option.uuid));
    } else {
      if (maxSelection && selectedItems.length >= maxSelection) return;
      setSelectedItems([...selectedItems, option]);
    }
  };

  const handleSelectAll = () => {
    const notSelected = availableOptions.filter((opt) => !isSelected(opt.uuid));
    const canAdd = maxSelection ? maxSelection - selectedItems.length : notSelected.length;
    const toAdd = notSelected.slice(0, canAdd);
    setSelectedItems([...selectedItems, ...toAdd]);
  };

  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch]);

  return (
    <Modal {...rest} title="Selecionar Corretores" className="max-w-2xl">
      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          <div className="relative">
            <Input
              placeholder="Buscar corretor por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="pr-10"
            />
            {isFetching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{usersData.totalElements || availableOptions.length} corretor(es) encontrado(s)</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                disabled={availableOptions.every((opt) => isSelected(opt.uuid))}
                className="text-xs"
              >
                Selecionar página
              </Button>
              {selectedItems.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                  className="text-xs text-destructive hover:text-destructive"
                >
                  Limpar seleção
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border">
          {isLoadingUsers ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Carregando corretores...</span>
              </div>
            </div>
          ) : availableOptions.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
              <User className="size-8 opacity-50" />
              <span className="text-sm">Nenhum corretor encontrado</span>
              {searchTerm && (
                <Button type="button" variant="link" size="sm" onClick={() => setSearchTerm('')} className="text-xs">
                  Limpar busca
                </Button>
              )}
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {availableOptions.map((option, index) => {
                const selected = isSelected(option.uuid);
                const disabled = !selected && maxSelection !== undefined && selectedItems.length >= maxSelection;

                return (
                  <div
                    key={option.uuid}
                    onClick={() => !disabled && handleToggle(option)}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors',
                      'hover:bg-muted/50',
                      selected && 'bg-primary/5',
                      disabled && 'cursor-not-allowed opacity-50',
                      index !== availableOptions.length - 1 && 'border-b',
                    )}
                  >
                    <Checkbox
                      checked={selected}
                      disabled={disabled}
                      onCheckedChange={() => handleToggle(option)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {getUserNameInitials(option.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm">{option.name}</p>
                    </div>
                    {selected && (
                      <Badge variant="secondary" className="text-xs">
                        Selecionado
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {usersData.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <span className="text-sm text-muted-foreground">
                Página {pageIndex + 1} de {usersData.totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPageIndex((p) => p - 1)}
                  disabled={!hasPrevPage || isFetching}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPageIndex((p) => p + 1)}
                  disabled={!hasNextPage || isFetching}
                >
                  <span className="hidden sm:inline">Próximo</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {selectedItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Selecionados ({selectedItems.length}
                {maxSelection && ` / ${maxSelection}`})
              </Label>
            </div>
            <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-3">
              {selectedItems.map((item) => (
                <Badge key={item.uuid} variant="secondary" className="flex items-center gap-1 py-1.5 pl-2 pr-1">
                  <span className="max-w-32 truncate">{item.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.uuid !== item.uuid))
                    }
                    className="h-5 w-5 rounded-full hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">
            {selectedItems.length === 0
              ? 'Nenhum corretor selecionado'
              : `${selectedItems.length} corretor(es) selecionado(s)`}
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => rest.onClose?.()}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => onConfirm(selectedItems)} disabled={selectedItems.length === 0}>
              Confirmar seleção
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
