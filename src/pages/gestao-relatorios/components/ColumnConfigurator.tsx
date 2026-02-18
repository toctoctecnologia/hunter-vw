import { useEffect, useState } from 'react'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Column } from './ReportTable'
import type { ColumnPreferences } from './columnPreferences'

interface ColumnConfiguratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columns: Column[]
  preferences: ColumnPreferences
  onSave: (value: ColumnPreferences) => void
}

interface ConfigItem {
  key: string
  label: string
  visible: boolean
}

function SortableItem({ item, onToggle }: { item: ConfigItem; onToggle: (key: string, value: boolean) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.key })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm transition ${
        isDragging ? 'ring-2 ring-orange-500/60' : 'hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-500 transition hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
          aria-label={`Arrastar coluna ${item.label}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{item.label}</span>
          <span className="text-xs text-gray-500">Clique para arrastar e reordenar</span>
        </div>
      </div>
      <Checkbox
        checked={item.visible}
        onCheckedChange={checked => onToggle(item.key, Boolean(checked))}
        aria-label={`Alternar visibilidade da coluna ${item.label}`}
        className="focus-visible:ring-orange-600/20 data-[state=checked]:border-orange-600 data-[state=checked]:bg-orange-600"
      />
    </div>
  )
}

export default function ColumnConfigurator({
  open,
  onOpenChange,
  columns,
  preferences,
  onSave,
}: ColumnConfiguratorProps) {
  const [items, setItems] = useState<ConfigItem[]>([])

  useEffect(() => {
    if (!open) return

    const columnMap = new Map(columns.map(column => [column.key, column]))
    const hidden = new Set(preferences.hidden)
    const orderedKeys = [...preferences.order]

    for (const column of columns) {
      if (!orderedKeys.includes(column.key)) {
        orderedKeys.push(column.key)
      }
    }

    const nextItems = orderedKeys
      .map(key => {
        const column = columnMap.get(key)
        if (!column) return null
        return {
          key,
          label: column.label,
          visible: !hidden.has(key),
        }
      })
      .filter((value): value is ConfigItem => value !== null)

    setItems(nextItems)
  }, [open, columns, preferences])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }

    setItems(prev => {
      const oldIndex = prev.findIndex(item => item.key === active.id)
      const newIndex = prev.findIndex(item => item.key === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const handleToggle = (key: string, value: boolean) => {
    setItems(prev => prev.map(item => (item.key === key ? { ...item, visible: value } : item)))
  }

  const handleSave = () => {
    const order = items.map(item => item.key)
    const hidden = items.filter(item => !item.visible).map(item => item.key)
    onSave({ order, hidden })
  }

  const hasVisibleColumn = items.some(item => item.visible)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar colunas</DialogTitle>
          <DialogDescription>
            Selecione quais colunas deseja exibir e organize a ordem arrastando para cima ou para baixo.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[420px] pr-2">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(item => item.key)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {items.map(item => (
                  <SortableItem key={item.key} item={item} onToggle={handleToggle} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>
        <DialogFooter className="sm:justify-between">
          <span className={`text-sm ${hasVisibleColumn ? 'text-gray-600' : 'text-red-600'}`}>
            {hasVisibleColumn ? 'Arraste as colunas para reordenar.' : 'Selecione ao menos uma coluna para continuar.'}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!hasVisibleColumn}>
              Aplicar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
