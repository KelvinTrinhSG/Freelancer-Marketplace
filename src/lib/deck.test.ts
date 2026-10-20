import { describe, expect, it } from 'vitest'
import { advance, back, canGoBack, initialDeck, skip } from './deck'

describe('deck', () => {
  it('skip moves forward and remembers the skipped card', () => {
    const s = skip(initialDeck, 3)
    expect(s.index).toBe(1)
    expect(s.skippedHistory).toEqual([0])
  })

  it('wraps to the first card after the last one', () => {
    let s = initialDeck
    s = skip(s, 3)
    s = skip(s, 3)
    s = skip(s, 3)
    expect(s.index).toBe(0)
    expect(advance({ index: 2, skippedHistory: [] }, 3).index).toBe(0)
  })

  it('back returns to the most recently skipped card, in reverse order', () => {
    let s = skip(skip(initialDeck, 5), 5) // skipped 0 then 1, now on 2
    s = back(s)
    expect(s.index).toBe(1)
    s = back(s)
    expect(s.index).toBe(0)
    expect(canGoBack(s)).toBe(false)
    expect(back(s)).toBe(s)
  })

  it('back skips over ticked cards (ticks are not undone)', () => {
    let s = skip(initialDeck, 5) // skipped 0, on 1
    s = advance(s, 5) // ticked 1, on 2
    expect(back(s).index).toBe(0)
  })

  it('a one-card deck keeps showing that card', () => {
    expect(skip(initialDeck, 1).index).toBe(0)
    expect(advance(initialDeck, 1).index).toBe(0)
  })
})
