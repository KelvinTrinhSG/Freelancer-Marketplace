import { describe, expect, it } from 'vitest'
import { SAVED_KEY, addSaved, loadSaved, persistSaved } from './storage'

function memoryStore(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    data,
  }
}

describe('saved list storage', () => {
  it('round-trips saved entries', () => {
    const store = memoryStore()
    const list = addSaved(addSaved([], 's-01'), 's-02')
    expect(persistSaved(list, store)).toBe(true)
    expect(loadSaved(store).map((e) => e.id)).toEqual(['s-01', 's-02'])
  })

  it('does not save the same freelancer twice', () => {
    const once = addSaved([], 's-01')
    expect(addSaved(once, 's-01')).toBe(once)
  })

  it('returns [] for missing, corrupted, or wrong-shaped data', () => {
    expect(loadSaved(memoryStore())).toEqual([])
    expect(loadSaved(memoryStore({ [SAVED_KEY]: '{not json' }))).toEqual([])
    expect(loadSaved(memoryStore({ [SAVED_KEY]: '{"id":"x"}' }))).toEqual([])
    expect(loadSaved(memoryStore({ [SAVED_KEY]: '[{"id":"ok","savedAt":"t"},{"id":3}]' })).map((e) => e.id)).toEqual(['ok'])
  })

  it('reports failure when storage is unavailable or refuses writes', () => {
    expect(persistSaved([], null)).toBe(false)
    const full = { getItem: () => null, setItem: () => { throw new Error('QuotaExceeded') } }
    expect(persistSaved([], full)).toBe(false)
    expect(loadSaved(null)).toEqual([])
  })
})
