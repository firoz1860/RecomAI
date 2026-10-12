import type { HistoryEntry } from './types'

const storageKey = 'recomai_history_v1'
const maxEntries = 8

export function normalizePreference(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== 'object') {
    return false
  }
  const entry = value as Record<string, unknown>
  return (
    typeof entry.preference === 'string' &&
    typeof entry.summary === 'string' &&
    Array.isArray(entry.items) &&
    typeof entry.timestamp === 'number'
  )
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isHistoryEntry).slice(0, maxEntries)
  } catch {
    return []
  }
}

export function persistHistory(entries: HistoryEntry[]): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(entries.slice(0, maxEntries)))
  } catch {
    return
  }
}

export function clearStoredHistory(): void {
  try {
    window.localStorage.removeItem(storageKey)
  } catch {
    return
  }
}
