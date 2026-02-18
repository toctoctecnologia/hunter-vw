import { useEffect, useMemo, useState } from 'react';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';
import { GripVertical, EyeOff, Eye, Trash2, Copy, Settings2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { DashboardContext, DashboardWidgetInstance } from '@/types/dashboard';
import type { DashboardWidgetDefinitionWithComponent } from './widgets';
import { getDashboardLayout, getDashboardVisibility, saveDashboardLayout, saveDashboardVisibility } from '@/services/dashboardLayoutService';
import { cn } from '@/lib/utils';

interface DashboardModularProps {
  context: DashboardContext;
  title: string;
  widgets: DashboardWidgetDefinitionWithComponent[];
}

interface SortableWidgetProps {
  instance: DashboardWidgetInstance;
  definition: DashboardWidgetDefinitionWithComponent;
  isHidden: boolean;
  editMode: boolean;
  context: DashboardContext;
  onToggleVisibility: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onResize: (cols: number) => void;
}

const buildDefaultLayout = (widgets: DashboardWidgetDefinitionWithComponent[]) =>
  widgets.map((widget) => ({
    id: nanoid(),
    widgetId: widget.id,
    cols: widget.defaultCols,
    height: widget.defaultHeight,
  }));

const buildDefaultVisibility = (layout: DashboardWidgetInstance[]) =>
  layout.reduce<Record<string, boolean>>((acc, item) => {
    acc[item.id] = true;
    return acc;
  }, {});

const SortableWidget = ({
  instance,
  definition,
  isHidden,
  editMode,
  context,
  onToggleVisibility,
  onRemove,
  onDuplicate,
  onResize,
}: SortableWidgetProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: instance.id,
    disabled: !editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const resizeOptions = useMemo(() => {
    const options = [] as number[];
    for (let i = definition.minCols; i <= definition.maxCols; i += 1) {
      options.push(i);
    }
    return options;
  }, [definition.maxCols, definition.minCols]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative rounded-2xl border border-border bg-background shadow-sm transition',
        editMode && 'ring-1 ring-transparent hover:ring-primary/40',
        isHidden && 'opacity-50',
        isDragging && 'opacity-70'
      )}
    >
      {editMode && (
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-border bg-background/90 px-2 py-1 shadow-sm">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab text-muted-foreground hover:text-foreground"
            aria-label="Mover widget"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          {definition.allowResize && (
            <Select
              value={String(instance.cols)}
              onValueChange={(value) => onResize(Number(value))}
            >
              <SelectTrigger className="h-7 w-16 rounded-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} col
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {editMode && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onDuplicate} aria-label="Duplicar widget">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleVisibility} aria-label="Ocultar widget">
            {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remover widget">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )}

      <div
        className={cn('h-full w-full p-4', editMode && 'pt-14')}
        style={{ minHeight: `${instance.height}px` }}
      >
        <definition.Component context={context} widgetId={definition.id} />
      </div>
    </div>
  );
};

export const DashboardModular = ({ context, title, widgets }: DashboardModularProps) => {
  const user = useCurrentUser();
  const userId = user?.id ?? 'guest';
  const unitId = user?.filial;
  const role = user?.role;

  const widgetMap = useMemo(
    () =>
      widgets.reduce<Record<string, DashboardWidgetDefinitionWithComponent>>((acc, widget) => {
        acc[widget.id] = widget;
        return acc;
      }, {}),
    [widgets]
  );

  const [layout, setLayout] = useState<DashboardWidgetInstance[]>(() => buildDefaultLayout(widgets));
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [savedLayout, setSavedLayout] = useState<DashboardWidgetInstance[]>(layout);
  const [savedVisibility, setSavedVisibility] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);
  const [widgetSearch, setWidgetSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const defaultLayout = buildDefaultLayout(widgets);
      const storedLayout = await getDashboardLayout({
        context,
        userId,
        unitId,
        role,
        layout: defaultLayout,
      });
      const initialLayout = storedLayout ?? defaultLayout;
      const storedVisibility = await getDashboardVisibility({
        context,
        userId,
        unitId,
        role,
        visibility: buildDefaultVisibility(initialLayout),
      });
      const initialVisibility = {
        ...buildDefaultVisibility(initialLayout),
        ...(storedVisibility ?? {}),
      };
      if (isMounted) {
        setLayout(initialLayout);
        setSavedLayout(initialLayout);
        setVisibility(initialVisibility);
        setSavedVisibility(initialVisibility);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [context, role, unitId, userId, widgets]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    if (!editMode || !event.over) return;
    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    if (activeId === overId) return;
    const oldIndex = layout.findIndex((item) => item.id === activeId);
    const newIndex = layout.findIndex((item) => item.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;
    setLayout((items) => arrayMove(items, oldIndex, newIndex));
  };

  const handleSave = async () => {
    await saveDashboardLayout({
      context,
      userId,
      unitId,
      role,
      layout,
    });
    await saveDashboardVisibility({
      context,
      userId,
      unitId,
      role,
      visibility,
    });
    setSavedLayout(layout);
    setSavedVisibility(visibility);
    setEditMode(false);
  };

  const handleCancel = () => {
    setLayout(savedLayout);
    setVisibility(savedVisibility);
    setEditMode(false);
  };

  const handleReset = () => {
    const defaultLayout = buildDefaultLayout(widgets);
    const defaultVisibility = buildDefaultVisibility(defaultLayout);
    setLayout(defaultLayout);
    setVisibility(defaultVisibility);
  };

  const handleAddWidget = (widgetId: string) => {
    const definition = widgetMap[widgetId];
    if (!definition) return;
    const newItem: DashboardWidgetInstance = {
      id: nanoid(),
      widgetId,
      cols: definition.defaultCols,
      height: definition.defaultHeight,
    };
    setLayout((prev) => [...prev, newItem]);
    setVisibility((prev) => ({ ...prev, [newItem.id]: true }));
  };

  const handleToggleVisibility = (id: string) => {
    setVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRemove = (id: string) => {
    setLayout((prev) => prev.filter((item) => item.id !== id));
    setVisibility((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDuplicate = (item: DashboardWidgetInstance) => {
    const clone: DashboardWidgetInstance = {
      ...item,
      id: nanoid(),
    };
    setLayout((prev) => [...prev, clone]);
    setVisibility((prev) => ({ ...prev, [clone.id]: true }));
  };

  const handleResize = (id: string, cols: number) => {
    setLayout((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cols } : item))
    );
  };

  const availableWidgets = widgets.filter(
    (widget) => !layout.some((item) => item.widgetId === widget.id)
  );

  const filteredAvailableWidgets = availableWidgets.filter((widget) =>
    widget.title.toLowerCase().includes(widgetSearch.trim().toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title} / Personalizar os blocos do dashboard
          </p>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">Personalize os blocos do seu dashboard.</p>
        </div>
        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button variant="outline" onClick={handleReset}>Restaurar padrão</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <Settings2 className="mr-2 h-4 w-4" />
              Personalizar
            </Button>
          )}
        </div>
      </div>

      <div className={cn('flex flex-col gap-6', editMode && 'lg:flex-row')}>
        <div className="flex-1">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={layout.map((item) => item.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-12">
                {layout.map((item) => {
                  const definition = widgetMap[item.widgetId];
                  if (!definition) return null;
                  const isHidden = visibility[item.id] === false;
                  if (!editMode && isHidden) return null;
                  return (
                    <div
                      key={item.id}
                      className={cn(editMode && 'transition-all')}
                      style={{ gridColumn: `span ${item.cols} / span ${item.cols}` }}
                    >
                      <SortableWidget
                        instance={item}
                        definition={definition}
                        isHidden={isHidden}
                        editMode={editMode}
                        context={context}
                        onToggleVisibility={() => handleToggleVisibility(item.id)}
                        onRemove={() => handleRemove(item.id)}
                        onDuplicate={() => handleDuplicate(item)}
                        onResize={(cols) => handleResize(item.id, cols)}
                      />
                    </div>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {editMode && (
          <aside className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Widgets disponíveis</h3>
                <p className="text-xs text-muted-foreground">Adicione novos blocos ao grid.</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={widgetSearch}
                onChange={(event) => setWidgetSearch(event.target.value)}
                placeholder="Pesquisar widgets"
                className="pl-9"
              />
            </div>
            <div className="space-y-3">
              {filteredAvailableWidgets.map((widget) => (
                <div key={widget.id} className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{widget.title}</p>
                    <p className="text-xs text-muted-foreground">{widget.defaultCols} colunas</p>
                  </div>
                  <Button size="sm" onClick={() => handleAddWidget(widget.id)}>
                    Adicionar
                  </Button>
                </div>
              ))}
              {!availableWidgets.length && (
                <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                  Todos os widgets já estão no seu dashboard.
                </div>
              )}
              {!!availableWidgets.length && !filteredAvailableWidgets.length && (
                <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                  Nenhum widget encontrado para essa busca.
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default DashboardModular;
