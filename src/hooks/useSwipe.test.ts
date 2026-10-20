import { describe, expect, it } from 'vitest'
import { releaseDecision, swipeThreshold } from './useSwipe'

describe('swipe threshold', () => {
  it('is 30% of the card width, at least 100px', () => {
    expect(swipeThreshold(400)).toBe(120)
    expect(swipeThreshold(200)).toBe(100)
  })

  it('decides left, right, or snap back on release', () => {
    expect(releaseDecision(150, 400)).toBe('right')
    expect(releaseDecision(-150, 400)).toBe('left')
    expect(releaseDecision(80, 400)).toBeNull()
    expect(releaseDecision(-119, 400)).toBeNull()
  })
})
