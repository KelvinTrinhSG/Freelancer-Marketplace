// The only module that touches localStorage. When a real backend arrives, swap this file for API calls.

export const SAVED_KEY = 'fs.saved.v1'

export type SavedEntry = { id: string; savedAt: string }

type KeyValueStore = Pick<Storage, 'getItem' | 'setItem'>

function defaultStore(): KeyValueStore | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null // access itself can throw (e.g. blocked storage)
  }
}

/** Read a JSON array, keeping only items that pass `isItem`. Missing or corrupted data → []. */
function readList<T>(key: string, isItem: (x: unknown) => x is T, store: KeyValueStore | null): T[] {
  try {
    const raw = store?.getItem(key)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isItem) : []
  } catch {
    return []
  }
}

/** Returns false when the browser refuses to store (private mode, quota, blocked). */
function writeList(key: string, value: unknown[], store: KeyValueStore | null): boolean {
  try {
    if (!store) return false
    store.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function isSavedEntry(x: unknown): x is SavedEntry {
  const e = x as SavedEntry
  return typeof e === 'object' && e !== null && typeof e.id === 'string' && typeof e.savedAt === 'string'
}

export function loadSaved(store = defaultStore()): SavedEntry[] {
  return readList(SAVED_KEY, isSavedEntry, store)
}

/** Add a freelancer to the saved list once; ticking the same person again changes nothing. */
export function addSaved(list: SavedEntry[], id: string, now = new Date()): SavedEntry[] {
  if (list.some((e) => e.id === id)) return list
  return [...list, { id, savedAt: now.toISOString() }]
}

export function persistSaved(list: SavedEntry[], store = defaultStore()): boolean {
  return writeList(SAVED_KEY, list, store)
}
