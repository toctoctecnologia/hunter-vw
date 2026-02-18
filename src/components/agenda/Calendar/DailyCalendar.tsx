import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { debugLog } from '@/utils/debug';
import {
  endOfDay,
  format,
  isSameMonth,
  isSameWeek,
  isToday,
  isWithinInterval,
  startOfDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Settings, RefreshCw, ZoomIn, ZoomOut, CheckSquare, Plus, CalendarClock, Filter, Search } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAgendaSettings, useCalendarZoom } from '@/hooks/agenda';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { AgendaSettingsModal } from '@/components/agenda/AgendaSettingsModal';
import { CreateEventModal, EventViewModal, EditEventModal } from '@/components/agenda/Event';
import { TarefasTab } from '@/components/agenda/Task';
import { useEventModal } from '@/context/EventModalContext';
import type { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { cn } from '@/lib/utils';
import { DayGrid } from './DayGrid';
import { WeekGrid } from './WeekGrid';
import { MonthGrid } from './MonthGrid';
import {
  MIN_PX_PER_MIN,
  MAX_PX_PER_MIN,
  BASE_PX_PER_MIN
} from './constants';
import { TopSearchBar } from '@/components/common/TopSearchBar';
import type { AgendaView } from '@/services/agendaNavigation';
import { setAgendaUserPreference } from '@/services/agendaNavigation';

interface DailyCalendarProps {
  events: Event[];
  onEventPress: (event: Event) => void;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  initialTab?: 'agenda' | 'tasks';
  initialView?: AgendaView;
  deepLink?: {
    sourceType?: string;
    contractId?: string;
    invoiceId?: string;
    eventId?: string;
    startAt?: string;
    view?: AgendaView;
    userId?: string;
  };
  onTabChange?: (tab: 'agenda' | 'tasks') => void;
}

export interface DailyCalendarHandle {
  focusTab: (tab: 'agenda' | 'tasks') => void;
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const toDateSafe = (value: Date | string) =>
  value instanceof Date ? value : new Date(value);

export const DailyCalendar = forwardRef<DailyCalendarHandle, DailyCalendarProps>(({
  events,
  onEventPress,
  selectedDate = new Date(),
  onDateChange,
  initialTab,
  initialView,
  deepLink,
  onTabChange
}, ref) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clickedHour, setClickedHour] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventView, setShowEventView] = useState(false);
  const [showEventEdit, setShowEventEdit] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [eventDateRange, setEventDateRange] = useState<{ start: string; end: string } | null>(null);
  const [responsibleFilter, setResponsibleFilter] = useState<string[]>([]);
  const [teamFilter, setTeamFilter] = useState<string[]>([]);
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'all' | 'billing' | 'manual'>('all');
  const [contractFilter, setContractFilter] = useState('');
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(deepLink?.eventId ?? null);
  const [agendaView, setAgendaView] = useState<AgendaView>(initialView ?? 'week');
  const { settings } = useAgendaSettings();
  const { zoom, zoomIn, zoomOut, setZoom, MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL } = useCalendarZoom();
  const [activeTab, setActiveTab] = useState<'agenda' | 'tasks'>(initialTab ?? 'tasks');
  const { openEventModal } = useEventModal();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomLevelRef = useRef(zoom);
  const [responsibleSearch, setResponsibleSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [dateRangeDialogOpen, setDateRangeDialogOpen] = useState(false);
  const hasAppliedDeepLink = useRef(false);

  useImperativeHandle(ref, () => ({
    focusTab: (tab: 'agenda' | 'tasks') => setActiveTab(tab)
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(normalizeText(searchQuery));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (initialView) {
      setAgendaView(initialView);
    }
  }, [initialView]);

  useEffect(() => {
    if (!deepLink || hasAppliedDeepLink.current) return;
    hasAppliedDeepLink.current = true;
    if (deepLink.sourceType === 'BillingRule') {
      setSourceTypeFilter('billing');
    }
    if (deepLink.contractId) setContractFilter(deepLink.contractId);
    if (deepLink.invoiceId) setInvoiceFilter(deepLink.invoiceId);
    if (deepLink.startAt) {
      const date = new Date(deepLink.startAt);
      if (!Number.isNaN(date.getTime())) {
        onDateChange?.(date);
        const iso = date.toISOString().slice(0, 10);
        setEventDateRange({ start: iso, end: iso });
      }
    }
    if (deepLink.view) setAgendaView(deepLink.view);
    if (deepLink.eventId) setHighlightedEventId(deepLink.eventId);
  }, [deepLink, onDateChange]);

  useEffect(() => {
    if (!deepLink?.userId || activeTab !== 'agenda') return;
    setAgendaUserPreference(deepLink.userId, agendaView);
  }, [agendaView, deepLink?.userId, activeTab]);

  useEffect(() => {
    zoomLevelRef.current = zoom;
  }, [zoom]);

  const getDistance = (p1: Touch, p2: Touch) => {
    const dx = p1.clientX - p2.clientX;
    const dy = p1.clientY - p2.clientY;
    return Math.hypot(dx, dy);
  };

  const applyZoom = (factor: number) => {
    const delta = Math.log(factor) / Math.log(1.2);
    const newZoom = Math.min(
      MAX_ZOOM_LEVEL,
      Math.max(MIN_ZOOM_LEVEL, zoomLevelRef.current + delta)
    );
    zoomLevelRef.current = newZoom;
    setZoom(newZoom);
  };

  useEffect(() => {
    if (!isMobile || activeTab !== 'agenda' || !containerRef.current) return;

    let initialDistance: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const factor = currentDistance / initialDistance;
        applyZoom(factor);
        initialDistance = currentDistance;
        e.preventDefault();
      }
    };

    const el = containerRef.current;
    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile, activeTab]);
  

  const availableOwners = useMemo(
    () =>
      Array.from(
        new Set(
          events
            .map(event => event.ownerName || event.responsible)
            .filter(Boolean) as string[]
        )
      ),
    [events]
  );
  const availableTeams = useMemo(
    () =>
      Array.from(
        new Set(
          events
            .map(event => event.team)
            .filter(Boolean) as string[]
        )
      ),
    [events]
  );
  const toggleResponsible = (owner: string) => {
    setResponsibleFilter(prev =>
      prev.includes(owner) ? prev.filter(item => item !== owner) : [...prev, owner]
    );
  };
  const toggleTeam = (team: string) => {
    setTeamFilter(prev =>
      prev.includes(team) ? prev.filter(item => item !== team) : [...prev, team]
    );
  };

  const getFilteredEvents = () => {
    let filteredEvents = [...events];

    if (sourceTypeFilter !== 'all') {
      filteredEvents = filteredEvents.filter(event => {
        const isBilling = event.sourceType === 'BillingRule' || event.source === 'Cobrança automática';
        return sourceTypeFilter === 'billing' ? isBilling : !isBilling;
      });
    }

    if (contractFilter) {
      filteredEvents = filteredEvents.filter(event => event.contractId === contractFilter);
    }

    if (invoiceFilter) {
      filteredEvents = filteredEvents.filter(event => event.invoiceId === invoiceFilter);
    }

    if (statusFilter !== 'all') {
      filteredEvents = filteredEvents.filter(event => {
        if (statusFilter === 'pending') return event.status === 'pending';
        if (statusFilter === 'completed') return event.status === 'completed';
        if (statusFilter === 'cancelled') return event.status === 'cancelled';
        return true;
      });
    }

    if (eventDateRange?.start && eventDateRange?.end) {
      const start = startOfDay(new Date(eventDateRange.start));
      const end = endOfDay(new Date(eventDateRange.end));
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
        filteredEvents = filteredEvents.filter(event =>
          isWithinInterval(toDateSafe(event.start), { start, end })
        );
      }
    }

    if (responsibleFilter.length > 0) {
      filteredEvents = filteredEvents.filter(event => {
        const owner = event.ownerName || event.responsible;
        if (!owner) return false;
        return responsibleFilter.includes(owner);
      });
    }
    if (teamFilter.length > 0) {
      filteredEvents = filteredEvents.filter(event => event.team && teamFilter.includes(event.team));
    }

    if (debouncedSearch) {
      const normalizedQuery = debouncedSearch;
      const compactQuery = normalizedQuery.replace(/\s+/g, '');
      filteredEvents = filteredEvents.filter(event => {
        const leadName = event.leadName || (event as any).lead?.name || '';
        const clientName = event.client || (event as any).clientName || '';
        const propertyCode = (event as any).propertyCode || (event as any).property?.codigo || '';
        const notes = event.description || (event as any).notes || (event as any).observations || '';
        const tags = Array.isArray((event as any).tags) ? (event as any).tags.join(' ') : '';
        const phone = event.phone || (event as any).phone || '';
        const candidates = [
          event.title,
          leadName,
          clientName,
          propertyCode,
          notes,
          tags,
          phone,
          event.location,
          event.calendarName,
          event.leadSummary,
          event.leadSource,
          event.responsible,
          event.type,
          event.ownerName,
          event.responsible,
          event.negotiationId,
          event.contractId,
          event.invoiceId,
          event.source,
          event.sourceType
        ].filter(Boolean) as string[];

        return candidates.some(value => {
          const normalized = normalizeText(value);
          const compactValue = normalized.replace(/\s+/g, '');
          return normalized.includes(normalizedQuery) || compactValue.includes(compactQuery);
        });
      });
    }

    return filteredEvents;
  };
  const filteredEvents = getFilteredEvents();
  const todayEvents = filteredEvents.filter(event =>
    format(toDateSafe(event.start), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );
  const weekEvents = filteredEvents.filter(event =>
    isSameWeek(toDateSafe(event.start), selectedDate, { weekStartsOn: 1 })
  );
  const monthEvents = filteredEvents.filter(event =>
    isSameMonth(toDateSafe(event.start), selectedDate)
  );
  const filtersCount =
    (eventDateRange?.start && eventDateRange?.end ? 1 : 0) +
    (responsibleFilter.length ? 1 : 0) +
    (teamFilter.length ? 1 : 0) +
    (sourceTypeFilter !== 'all' ? 1 : 0) +
    (contractFilter ? 1 : 0) +
    (invoiceFilter ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0);

  const filteredOwners = useMemo(() => {
    if (!responsibleSearch) return availableOwners;
    const normalized = normalizeText(responsibleSearch);
    return availableOwners.filter(owner => normalizeText(owner).includes(normalized));
  }, [availableOwners, responsibleSearch]);
  const filteredTeams = useMemo(() => {
    if (!teamSearch) return availableTeams;
    const normalized = normalizeText(teamSearch);
    return availableTeams.filter(team => normalizeText(team).includes(normalized));
  }, [availableTeams, teamSearch]);

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onClear: () => void }[] = [];
    if (sourceTypeFilter !== 'all') {
      chips.push({
        key: 'sourceType',
        label: sourceTypeFilter === 'billing' ? 'Cobrança automática' : 'Manual',
        onClear: () => setSourceTypeFilter('all')
      });
    }
    if (contractFilter) {
      chips.push({
        key: 'contract',
        label: `Contrato ${contractFilter}`,
        onClear: () => setContractFilter('')
      });
    }
    if (invoiceFilter) {
      chips.push({
        key: 'invoice',
        label: `Fatura ${invoiceFilter}`,
        onClear: () => setInvoiceFilter('')
      });
    }
    if (statusFilter !== 'all') {
      const labelMap: Record<string, string> = {
        pending: 'Pendente',
        completed: 'Executado',
        cancelled: 'Cancelado'
      };
      chips.push({
        key: 'status',
        label: `Status ${labelMap[statusFilter] ?? statusFilter}`,
        onClear: () => setStatusFilter('all')
      });
    }
    if (responsibleFilter.length) {
      responsibleFilter.forEach(owner => {
        chips.push({
          key: `responsible-${owner}`,
          label: owner,
          onClear: () => toggleResponsible(owner)
        });
      });
    }
    if (teamFilter.length) {
      teamFilter.forEach(team => {
        chips.push({
          key: `team-${team}`,
          label: team,
          onClear: () => toggleTeam(team)
        });
      });
    }
    return chips;
  }, [sourceTypeFilter, contractFilter, invoiceFilter, statusFilter, responsibleFilter, teamFilter]);

  const rangeLabel = useMemo(() => {
    if (!eventDateRange?.start || !eventDateRange?.end) return 'Selecionar período';
    const start = new Date(eventDateRange.start);
    const end = new Date(eventDateRange.end);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Selecionar período';
    const sameMonth = start.getMonth() === end.getMonth();
    return `${format(start, "dd 'de' MMM", { locale: ptBR })} - ${format(end, sameMonth ? "dd" : "dd 'de' MMM", { locale: ptBR })}`;
  }, [eventDateRange]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onDateChange) {
      onDateChange(date);
      setShowDatePicker(false);
    }
  };

  const handleHourClick = (hour: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    setClickedHour(timeString);
    setShowCreateModal(true);
  };

  const handleEventCreated = (newEvent: any) => {
    debugLog('Novo evento criado:', newEvent);
    setShowCreateModal(false);
    setClickedHour(null);
  };

  const handleEventClick = (event: Event) => {
    openEventModal(event.id);
    onEventPress(event);
    setHighlightedEventId(event.id);
  };

  const handleEventEdit = () => {
    setShowEventView(false);
    setShowEventEdit(true);
  };

  const handleEventUpdated = (updatedEvent: Event) => {
    debugLog('Evento atualizado:', updatedEvent);
    setShowEventEdit(false);
    setSelectedEvent(null);
  };

  const handleCloseModals = () => {
    setShowEventView(false);
    setShowEventEdit(false);
    setSelectedEvent(null);
  };

  const pxPerMin = Math.min(
    Math.max(
      BASE_PX_PER_MIN * Math.pow(1.2, zoom),
      MIN_PX_PER_MIN
    ),
    MAX_PX_PER_MIN
  );
  const hourHeight = Math.max(60 * pxPerMin, 40);

  const scrollToCurrentHour = () => {
    if (!containerRef.current) return;
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const offset = Math.max(0, currentHour * hourHeight);
    containerRef.current.scrollTop = offset;
  };

  useEffect(() => {
    if (activeTab === 'agenda' && isToday(selectedDate)) {
      scrollToCurrentHour();
    }
  }, [activeTab, selectedDate]);

  return (
    <div className="min-h-full bg-surface px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface2 px-4 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (onDateChange) {
                    onDateChange(new Date());
                  }
                  scrollToCurrentHour();
                }}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface"
              >
                Hoje
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDateChange && onDateChange(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
                  className="rounded-full p-2 text-muted-foreground transition hover:bg-surface"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDateChange && onDateChange(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                  className="rounded-full p-2 text-muted-foreground transition hover:bg-surface"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <button className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-foreground">
                {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeTab === 'agenda' && (
                <div className="flex items-center rounded-full border border-border bg-surface p-1 shadow-inner">
                  {(['day', 'week', 'month'] as AgendaView[]).map(view => (
                    <button
                      key={view}
                      onClick={() => setAgendaView(view)}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                        agendaView === view ? 'bg-orange-500 text-white shadow' : 'text-foreground hover:bg-surface'
                      )}
                    >
                      {view === 'day' ? 'Dia' : view === 'week' ? 'Semana' : 'Mês'}
                    </button>
                  ))}
                </div>
              )}
              <button className="rounded-full p-2 text-muted-foreground transition hover:bg-surface">
                <Search className="h-5 w-5" />
              </button>
              <button className="rounded-full p-2 text-muted-foreground transition hover:bg-surface">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-xs font-semibold text-foreground">
                PF
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border bg-surface2 p-1 shadow-inner">
              <button
                onClick={() => {
                  setActiveTab('tasks');
                  onTabChange?.('tasks');
                }}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  activeTab === 'tasks'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-foreground hover:bg-surface'
                )}
              >
                <CheckSquare className="h-4 w-4" />
                Tarefas
              </button>
              <button
                onClick={() => {
                  setActiveTab('agenda');
                  setShowTaskForm(false);
                  onTabChange?.('agenda');
                }}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  activeTab === 'agenda'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-foreground hover:bg-surface'
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                Agenda
              </button>
            </div>
            {activeTab === 'agenda' && (
              <button
                onClick={() => {
                  setClickedHour(null);
                  setShowCreateModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-orange-500 bg-transparent px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50 dark:hover:bg-orange-500/10"
              >
                <CalendarClock className="h-4 w-4" />
                Nova agenda
              </button>
            )}
            {activeTab === 'tasks' && (
              <button
                onClick={() => {
                  setActiveTab('tasks');
                  setShowTaskForm(true);
                  onTabChange?.('tasks');
                }}
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Nova tarefa
              </button>
            )}
          </div>
        </div>

        {activeTab === 'agenda' ? (
          <div className="rounded-3xl border border-border bg-surface2 shadow-sm">
            <div className="rounded-t-3xl border-b border-border bg-surface2 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= MIN_ZOOM_LEVEL}
                  className="rounded-full p-2 text-muted-foreground transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <button
                  onClick={zoomIn}
                  disabled={zoom >= MAX_ZOOM_LEVEL}
                  className="rounded-full p-2 text-muted-foreground transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="rounded-full p-2 text-muted-foreground transition hover:bg-surface"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <button className="rounded-full p-2 text-muted-foreground transition hover:bg-surface">
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <TopSearchBar
                  placeholder="Buscar na agenda por lead, título, descrição, origem ou responsável"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  filtersCount={filtersCount}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="rounded-full border-border bg-surface px-4">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                        {filtersCount > 0 && (
                          <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                            {filtersCount}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] rounded-2xl border border-border bg-surface2 shadow-lg">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-foreground">Período</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs"
                              onClick={() => setEventDateRange(null)}
                            >
                              Limpar
                            </Button>
                          </div>
                          <div className="rounded-xl border border-border bg-surface p-3">
                            <Button
                              variant="outline"
                              className="flex w-full items-center justify-between rounded-xl border-border bg-surface text-left font-semibold"
                              onClick={() => setDateRangeDialogOpen(true)}
                            >
                              <span className="text-sm text-foreground">{rangeLabel}</span>
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <p className="mt-2 text-xs text-muted-foreground">Selecione um intervalo para filtrar a agenda.</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Origem</p>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'all', label: 'Todos' },
                              { value: 'billing', label: 'Cobrança automática' },
                              { value: 'manual', label: 'Manual' }
                            ].map(option => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setSourceTypeFilter(option.value as typeof sourceTypeFilter)}
                                className={cn(
                                  'rounded-xl border px-3 py-2 text-xs font-semibold transition',
                                  sourceTypeFilter === option.value
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-border bg-surface text-foreground hover:bg-surface2'
                                )}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Status</p>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'all', label: 'Todos' },
                              { value: 'pending', label: 'Pendente' },
                              { value: 'completed', label: 'Executado' },
                              { value: 'cancelled', label: 'Cancelado' }
                            ].map(option => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setStatusFilter(option.value as typeof statusFilter)}
                                className={cn(
                                  'rounded-xl border px-3 py-2 text-xs font-semibold transition',
                                  statusFilter === option.value
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-border bg-surface text-foreground hover:bg-surface2'
                                )}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Contrato</p>
                          <Input
                            placeholder="Buscar contrato"
                            value={contractFilter}
                            onChange={(event) => setContractFilter(event.target.value)}
                            className="h-9 rounded-xl border-border bg-surface"
                          />
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Fatura</p>
                          <Input
                            placeholder="Buscar fatura"
                            value={invoiceFilter}
                            onChange={(event) => setInvoiceFilter(event.target.value)}
                            className="h-9 rounded-xl border-border bg-surface"
                          />
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Responsável</p>
                          <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
                            <div className="flex items-center gap-2 rounded-lg bg-surface2 px-3 py-2">
                              <Search className="h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Buscar corretor"
                                value={responsibleSearch}
                                onChange={(e) => setResponsibleSearch(e.target.value)}
                                className="h-8 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                              />
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                              {filteredOwners.map(owner => (
                                <button
                                  key={owner}
                                  type="button"
                                  onClick={() => toggleResponsible(owner)}
                                  className={cn(
                                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                                    responsibleFilter.includes(owner)
                                      ? 'bg-orange-50 text-orange-700'
                                      : 'hover:bg-surface2 text-foreground'
                                  )}
                                >
                                  <span>{owner}</span>
                                  <span
                                    className={cn(
                                      'h-4 w-4 rounded-full border',
                                      responsibleFilter.includes(owner)
                                        ? 'border-orange-500 bg-orange-500'
                                        : 'border-border'
                                    )}
                                    aria-hidden
                                  />
                                </button>
                              ))}
                              {filteredOwners.length === 0 && (
                                <p className="text-xs text-muted-foreground">Nenhum corretor encontrado</p>
                              )}
                            </div>
                            {responsibleFilter.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {responsibleFilter.map(owner => (
                                  <Badge
                                    key={owner}
                                    variant="secondary"
                                    className="flex items-center gap-1 rounded-full bg-orange-50 text-orange-700"
                                  >
                                    {owner}
                                    <button
                                      type="button"
                                      className="text-xs text-orange-600 hover:text-orange-700"
                                      onClick={() => toggleResponsible(owner)}
                                      aria-label={`Remover ${owner}`}
                                    >
                                      ✕
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Equipe</p>
                          <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
                            <div className="flex items-center gap-2 rounded-lg bg-surface2 px-3 py-2">
                              <Search className="h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Buscar equipe"
                                value={teamSearch}
                                onChange={(e) => setTeamSearch(e.target.value)}
                                className="h-8 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                              />
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                              {filteredTeams.map(team => (
                                <button
                                  key={team}
                                  type="button"
                                  onClick={() => toggleTeam(team)}
                                  className={cn(
                                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                                    teamFilter.includes(team)
                                      ? 'bg-orange-50 text-orange-700'
                                      : 'hover:bg-surface2 text-foreground'
                                  )}
                                >
                                  <span>{team}</span>
                                  <span
                                    className={cn(
                                      'h-4 w-4 rounded-full border',
                                      teamFilter.includes(team)
                                        ? 'border-orange-500 bg-orange-500'
                                        : 'border-border'
                                    )}
                                    aria-hidden
                                  />
                                </button>
                              ))}
                              {filteredTeams.length === 0 && (
                                <p className="text-xs text-muted-foreground">Nenhuma equipe encontrada</p>
                              )}
                            </div>
                            {teamFilter.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {teamFilter.map(team => (
                                  <Badge
                                    key={team}
                                    variant="secondary"
                                    className="flex items-center gap-1 rounded-full bg-orange-50 text-orange-700"
                                  >
                                    {team}
                                    <button
                                      type="button"
                                      className="text-xs text-orange-600 hover:text-orange-700"
                                      onClick={() => toggleTeam(team)}
                                      aria-label={`Remover ${team}`}
                                    >
                                      ✕
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {activeFilterChips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeFilterChips.map(chip => (
                    <Badge
                      key={chip.key}
                      variant="secondary"
                      className="flex items-center gap-1 rounded-full bg-orange-50 text-orange-700"
                    >
                      {chip.label}
                      <button
                        type="button"
                        className="text-xs text-orange-600 hover:text-orange-700"
                        onClick={chip.onClear}
                        aria-label={`Remover ${chip.label}`}
                      >
                        ✕
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-col items-center gap-3">
                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                  <PopoverTrigger asChild>
                    <button className="flex flex-col items-center space-y-1 rounded-2xl px-6 py-2 text-center transition-colors hover:bg-surface">
                      <h2 className="text-lg font-semibold text-foreground">Agenda</h2>
                      <p className="text-sm text-muted-foreground capitalize">
                        {format(selectedDate, "dd 'de' MMMM - EEEE", { locale: ptBR })}
                      </p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto rounded-2xl border border-border bg-surface2 p-0 shadow-lg" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      locale={ptBR}
                      initialFocus
                      className="pointer-events-auto rounded-2xl border-0 bg-surface2"
                      classNames={{
                        months: "flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0",
                        month: "space-y-4 p-4",
                        caption: "relative flex items-center justify-center pt-1",
                        caption_label: "text-lg font-semibold text-foreground",
                        nav: "flex items-center space-x-1",
                        nav_button: "flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-0 opacity-70 transition hover:bg-orange-100 hover:opacity-100",
                        nav_button_previous: "absolute left-4",
                        nav_button_next: "absolute right-4",
                        table: "w-full border-collapse space-y-1",
                        head_row: "mb-3 flex",
                        head_cell: "flex w-10 items-center justify-center rounded-md text-sm font-medium uppercase text-muted-foreground",
                        row: "mt-2 flex w-full",
                        cell: "relative flex h-10 w-10 items-center justify-center p-0 text-center text-base focus-within:relative focus-within:z-20",
                        day: "flex h-10 w-10 items-center justify-center rounded-full p-0 text-foreground transition-colors hover:bg-orange-100",
                        day_selected: "rounded-full bg-orange-600 font-semibold text-white hover:bg-orange-700 focus:bg-orange-600 focus:text-white",
                        day_today: "rounded-full bg-orange-100 font-semibold text-orange-600",
                        day_outside: "opacity-50 text-muted-foreground",
                        day_disabled: "opacity-50 text-muted-foreground",
                        day_range_middle: "aria-selected:bg-orange-100 aria-selected:text-orange-600",
                        day_hidden: "invisible"
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div ref={containerRef} className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden rounded-b-3xl bg-surface2 pb-10">
              {agendaView === 'day' && (
                <DayGrid
                  dateISO={format(selectedDate, 'yyyy-MM-dd')}
                  events={todayEvents}
                  onHourClick={handleHourClick}
                  onEventClick={handleEventClick}
                  showHourLabels={settings.showHourLabels}
                  pxPerMin={pxPerMin}
                  highlightedEventId={highlightedEventId ?? undefined}
                />
              )}
              {agendaView === 'week' && (
                <WeekGrid
                  referenceDate={selectedDate}
                  events={weekEvents}
                  onEventClick={handleEventClick}
                  showHourLabels={settings.showHourLabels}
                  pxPerMin={pxPerMin}
                  highlightedEventId={highlightedEventId ?? undefined}
                />
              )}
              {agendaView === 'month' && (
                <MonthGrid
                  referenceDate={selectedDate}
                  events={monthEvents}
                  selectedDate={selectedDate}
                  onDateChange={onDateChange}
                  onEventClick={handleEventClick}
                  highlightedEventId={highlightedEventId ?? undefined}
                />
              )}
            </div>
          </div>
        ) : (
          <TarefasTab
            date={selectedDate}
            showForm={showTaskForm}
            onShowFormChange={setShowTaskForm}
          />
        )}

        {showSettings && (
          <AgendaSettingsModal onClose={() => setShowSettings(false)} />
        )}

        {showCreateModal && (
          <CreateEventModal
            onClose={() => {
              setShowCreateModal(false);
              setClickedHour(null);
            }}
            onEventCreated={handleEventCreated}
            selectedDate={selectedDate}
            selectedTime={clickedHour || undefined}
          />
        )}

        {showEventView && selectedEvent && (
          <EventViewModal
            event={selectedEvent}
            onClose={handleCloseModals}
            onEdit={handleEventEdit}
          />
        )}

        {showEventEdit && selectedEvent && (
          <EditEventModal
            event={selectedEvent}
            onClose={handleCloseModals}
            onEventUpdated={handleEventUpdated}
          />
        )}

        <DateRangePicker
          open={dateRangeDialogOpen}
          onOpenChange={setDateRangeDialogOpen}
          initialRange={eventDateRange}
          onSelect={(range) => {
            setEventDateRange(range);
            setDateRangeDialogOpen(false);
          }}
        />
      </div>
    </div>
  );
});
