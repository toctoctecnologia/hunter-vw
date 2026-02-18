'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Search,
  Building2,
  Users,
  Home,
  Calendar,
  Clock,
  HardHat,
  X,
  Loader2,
  ArrowRight,
  History,
  Trash2,
} from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { globalSearchAutoComplete } from '@/features/dashboard/api/global-search';

import { GlobalSearchResultItem } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

import { Dialog, DialogContent, DialogTitle } from '@/shared/components/ui/dialog';
import { VisuallyHidden } from '@/shared/components/ui/visually-hidden';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Button } from '@/shared/components/ui/button';

type SearchType = 'PROPERTY' | 'LEAD' | 'CONDOMINIUM' | 'TASK' | 'APPOINTMENT' | 'PROPERTY_BUILDER';

const typeConfig: Record<SearchType, { icon: React.ElementType; label: string; color: string; bgColor: string }> = {
  PROPERTY: {
    icon: Home,
    label: 'Imóvel',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  LEAD: {
    icon: Users,
    label: 'Lead',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  CONDOMINIUM: {
    icon: Building2,
    label: 'Condomínio',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  TASK: {
    icon: Calendar,
    label: 'Tarefa',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  APPOINTMENT: {
    icon: Clock,
    label: 'Compromisso',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  PROPERTY_BUILDER: {
    icon: HardHat,
    label: 'Construtora',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
};

function getNavigationPath(type: SearchType, uuid: string): string | null {
  switch (type) {
    case 'PROPERTY':
      return `/dashboard/properties/${uuid}/detail`;
    case 'LEAD':
      return `/dashboard/sales/${uuid}/details`;
    case 'CONDOMINIUM':
      return `/dashboard/manage-condominiums/condominium/${uuid}`;
    case 'TASK':
    case 'APPOINTMENT':
      return `/dashboard/calendar`;
    case 'PROPERTY_BUILDER':
      return `/dashboard/manage-condominiums`;
    default:
      return null;
  }
}

const SEARCH_HISTORY_KEY = 'hunter-search-history';
const MAX_HISTORY_ITEMS = 10;

interface SearchHistoryItem extends GlobalSearchResultItem {
  timestamp: number;
}

function useSearchHistory() {
  const [history, setHistory] = React.useState<SearchHistoryItem[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SearchHistoryItem[];
        setHistory(parsed);
      }
    } catch {}
  }, []);

  const addToHistory = React.useCallback((item: GlobalSearchResultItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => !(h.uuid === item.uuid && h.type === item.type));
      const newHistory = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch {}
      return newHistory;
    });
  }, []);

  const removeFromHistory = React.useCallback((uuid: string, type: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((h) => !(h.uuid === uuid && h.type === type));
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch {}
      return newHistory;
    });
  }, []);

  const clearHistory = React.useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch {}
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [debouncedQuery] = useDebounce(query, 300);
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['global-search-autocomplete', debouncedQuery],
    queryFn: () => globalSearchAutoComplete(debouncedQuery, 10),
    enabled: debouncedQuery.length >= 2,
  });

  const showHistory = query.length < 2 && history.length > 0;
  const displayItems = showHistory ? history : results;

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [results, showHistory]);

  const handleSelect = (item: GlobalSearchResultItem) => {
    const path = getNavigationPath(item.type as SearchType, item.uuid);
    if (path) {
      addToHistory(item);
      router.push(path);
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < displayItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && displayItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(displayItems[selectedIndex]);
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full sm:max-w-2xl p-0 gap-0" showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle>Busca Global</DialogTitle>
        </VisuallyHidden>

        <div className="flex items-center border-b px-3 sm:px-4">
          <Search className="size-4 sm:size-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar..."
            className="flex-1 h-12 sm:h-14 px-3 sm:px-4 bg-transparent outline-none text-sm sm:text-base placeholder:text-muted-foreground"
          />
          {query && (
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setQuery('')}>
              <X className="size-4" />
            </Button>
          )}
        </div>

        <div className="min-h-[250px] sm:min-h-[300px] max-h-[50vh] sm:max-h-[400px] sm:w-full sm:max-w-2xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-[250px] sm:h-[300px]">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : showHistory ? (
            <ScrollArea className="w-full h-[50vh] sm:h-[400px]">
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <History className="size-3" />
                    Pesquisas recentes
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-muted-foreground hover:text-destructive"
                    onClick={clearHistory}
                  >
                    <Trash2 className="size-3 mr-1" />
                    Limpar
                  </Button>
                </div>
                {history.map((item, index) => {
                  const config = typeConfig[item.type as SearchType];
                  const Icon = config?.icon || Search;

                  return (
                    <div
                      key={`history-${item.type}-${item.uuid}`}
                      className={cn(
                        'w-full flex items-center mb-2 gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg text-left transition-colors group',
                        selectedIndex === index ? 'bg-accent' : 'hover:bg-accent/50',
                      )}
                    >
                      <button
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
                      >
                        <div
                          className={cn(
                            'flex items-center justify-center size-8 sm:size-10 rounded-lg shrink-0',
                            config?.bgColor || 'bg-muted',
                          )}
                        >
                          <Icon className={cn('size-4 sm:size-5', config?.color || 'text-muted-foreground')} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className="font-medium truncate text-sm sm:text-base">{item.title}</span>
                            <span
                              className={cn(
                                'text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full shrink-0',
                                config?.bgColor || 'bg-muted',
                                config?.color || 'text-muted-foreground',
                              )}
                            >
                              {config?.label || item.type}
                            </span>
                          </div>
                          {item.subtitle && (
                            <p className="text-xs sm:text-sm text-muted-foreground truncate text-start mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>

                        <ArrowRight
                          className={cn(
                            'size-4 text-muted-foreground shrink-0 transition-opacity hidden sm:block',
                            selectedIndex === index ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 sm:size-8 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item.uuid, item.type);
                        }}
                      >
                        <X className="size-3.5 sm:size-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : query.length < 2 ? (
            <div className="flex flex-col items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground px-4 text-center">
              <Search className="size-10 sm:size-12 mb-3 sm:mb-4 opacity-50" />
              <p className="text-xs sm:text-sm">Digite pelo menos 2 caracteres para buscar</p>
              <p className="text-[10px] sm:text-xs mt-2 opacity-70">
                Pressione <kbd className="px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs bg-muted rounded border">⌘K</kbd>{' '}
                a qualquer momento para abrir a busca
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground px-4 text-center">
              <Search className="size-10 sm:size-12 mb-3 sm:mb-4 opacity-50" />
              <p className="text-xs sm:text-sm">Nenhum resultado encontrado para &quot;{query}&quot;</p>
              <p className="text-[10px] sm:text-xs mt-2 opacity-70">Tente buscar por outro termo</p>
            </div>
          ) : (
            <ScrollArea className="w-full h-[50vh] sm:h-[400px]">
              <div className="p-2">
                {results.map((item, index) => {
                  const config = typeConfig[item.type as SearchType];
                  const Icon = config?.icon || Search;

                  return (
                    <button
                      key={`${item.type}-${item.uuid}`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        'w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg text-left transition-colors',
                        selectedIndex === index ? 'bg-accent' : 'hover:bg-accent/50',
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center size-8 sm:size-10 rounded-lg shrink-0',
                          config?.bgColor || 'bg-muted',
                        )}
                      >
                        <Icon className={cn('size-4 sm:size-5', config?.color || 'text-muted-foreground')} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="font-medium text-sm sm:text-base">{item.title}</span>
                          <span
                            className={cn(
                              'text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full shrink-0',
                              config?.bgColor || 'bg-muted',
                              config?.color || 'text-muted-foreground',
                            )}
                          >
                            {config?.label || item.type}
                          </span>
                        </div>
                        {item.subtitle && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{item.subtitle}</p>
                        )}
                        {/* {item.metadata && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-0.5 hidden sm:block">
                            {item.metadata}
                          </p>
                        )} */}
                      </div>

                      <ArrowRight
                        className={cn(
                          'size-4 text-muted-foreground shrink-0 transition-opacity hidden sm:block',
                          selectedIndex === index ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex items-center justify-center sm:justify-between px-3 sm:px-4 py-2 sm:py-3 border-t bg-muted/30 text-[10px] sm:text-xs text-muted-foreground">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1 sm:px-1.5 py-0.5 bg-muted rounded border text-[10px]">↑</kbd>
              <kbd className="px-1 sm:px-1.5 py-0.5 bg-muted rounded border text-[10px]">↓</kbd>
              <span className="ml-1">navegar</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 sm:px-1.5 py-0.5 bg-muted rounded border text-[10px]">Enter</kbd>
              <span className="ml-1">selecionar</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 sm:px-1.5 py-0.5 bg-muted rounded border text-[10px]">Esc</kbd>
              <span className="ml-1">fechar</span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface GlobalSearchTriggerProps {
  onClick: () => void;
  className?: string;
}

export function GlobalSearchTrigger({ onClick, className }: GlobalSearchTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 h-9 w-full max-w-sm px-3 rounded-md border bg-background text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
        className,
      )}
    >
      <Search className="size-4" />
      <span className="flex-1 text-left">Buscar...</span>
      <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-muted rounded border">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}

export function useGlobalSearch() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, setOpen };
}
