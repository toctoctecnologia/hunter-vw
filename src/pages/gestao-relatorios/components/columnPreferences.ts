import type { Column } from './ReportTable'

export interface ColumnPreferences {
  order: string[]
  hidden: string[]
}

export function createDefaultColumnPreferences(columns: Column[]): ColumnPreferences {
  return {
    order: columns.map(column => column.key),
    hidden: [],
  }
}

export function normalizeColumnPreferences(
  value: ColumnPreferences | undefined,
  columns: Column[],
): ColumnPreferences {
  const defaults = createDefaultColumnPreferences(columns)
  if (!value) {
    return defaults
  }

  const columnKeys = new Set(columns.map(column => column.key))
  const sanitizedOrder = value.order.filter(key => columnKeys.has(key))

  for (const column of columns) {
    if (!sanitizedOrder.includes(column.key)) {
      sanitizedOrder.push(column.key)
    }
  }

  const sanitizedHidden = value.hidden.filter(key => columnKeys.has(key))

  return {
    order: sanitizedOrder,
    hidden: sanitizedHidden,
  }
}

export function columnPreferencesEqual(a: ColumnPreferences, b: ColumnPreferences) {
  if (a.order.length !== b.order.length || a.hidden.length !== b.hidden.length) {
    return false
  }

  for (let i = 0; i < a.order.length; i += 1) {
    if (a.order[i] !== b.order[i]) {
      return false
    }
  }

  for (let i = 0; i < a.hidden.length; i += 1) {
    if (a.hidden[i] !== b.hidden[i]) {
      return false
    }
  }

  return true
}
