// The only module that touches localStorage. When a real backend arrives, swap this file for API calls.

import type { Freelancer } from '../types'
import { isHttpUrl } from './validate'

export const SAVED_KEY = 'fs.saved.v1'
export const FREELANCERS_KEY = 'fs.freelancers.v1'

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

/** Add a freelancer to the saved list once; saving the same person again changes nothing. */
export function addSaved(list: SavedEntry[], id: string, now = new Date()): SavedEntry[] {
  if (list.some((e) => e.id === id)) return list
  return [...list, { id, savedAt: now.toISOString() }]
}

export function persistSaved(list: SavedEntry[], store = defaultStore()): boolean {
  return writeList(SAVED_KEY, list, store)
}

function isFreelancer(x: unknown): x is Freelancer {
  const f = x as Freelancer
  return (
    typeof f === 'object' &&
    f !== null &&
    typeof f.id === 'string' &&
    typeof f.name === 'string' &&
    Array.isArray(f.skills) &&
    f.skills.every((s) => typeof s === 'string') &&
    typeof f.imageUrl === 'string' &&
    typeof f.contact === 'string'
  )
}

/** Profiles submitted through the form on this browser. */
export function loadFreelancers(store = defaultStore()): Freelancer[] {
  return readList(FREELANCERS_KEY, isFreelancer, store).map((f) => ({
    ...f,
    location: f.location ?? '',
    // Stored data can be edited by hand; never render a link that isn't a real web address.
    videoUrl: f.videoUrl && isHttpUrl(f.videoUrl) ? f.videoUrl : undefined,
    portfolioUrl: f.portfolioUrl && isHttpUrl(f.portfolioUrl) ? f.portfolioUrl : undefined,
    isSample: false,
  }))
}

export function persistFreelancers(list: Freelancer[], store = defaultStore()): boolean {
  return writeList(FREELANCERS_KEY, list, store)
}
