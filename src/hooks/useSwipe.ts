import { useCallback, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'

export type SwipeDirection = 'left' | 'right'

const FLY_MS = 200

/** Released past 30% of the card width (at least 100px) counts as a swipe. */
export function swipeThreshold(cardWidth: number): number {
  return Math.max(100, cardWidth * 0.3)
}

export function releaseDecision(dx: number, cardWidth: number): SwipeDirection | null {
  const threshold = swipeThreshold(cardWidth)
  if (dx > threshold) return 'right'
  if (dx < -threshold) return 'left'
  return null
}

type Phase = 'idle' | 'drag' | 'return' | 'fly'

/**
 * Hand-written drag-to-swipe with pointer events (mouse, touch, pen).
 * The card follows the pointer and tilts; past the threshold it flies off and
 * `onSwipe` fires, otherwise it snaps back. `fly` lets buttons play the same animation.
 */
export function useSwipe(onSwipe: (dir: SwipeDirection) => void) {
  const ref = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const dxRef = useRef(0)
  const [dx, setDx] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [cardWidth, setCardWidth] = useState(0)

  const moveTo = (value: number) => {
    dxRef.current = value
    setDx(value)
  }

  const fly = useCallback(
    (dir: SwipeDirection) => {
      if (phase === 'fly') return
      setPhase('fly')
      const distance = window.innerWidth + (ref.current?.offsetWidth ?? 400)
      moveTo(dir === 'right' ? distance : -distance)
      window.setTimeout(() => {
        onSwipe(dir)
        // Reset without a transition so the next card appears in place.
        moveTo(0)
        setPhase('idle')
      }, FLY_MS)
    },
    [onSwipe, phase],
  )

  const handlers = {
    onPointerDown(e: PointerEvent<HTMLDivElement>) {
      if (phase === 'fly' || e.button > 0) return
      e.currentTarget.setPointerCapture(e.pointerId)
      startX.current = e.clientX
      setCardWidth(e.currentTarget.offsetWidth)
      setPhase('drag')
    },
    onPointerMove(e: PointerEvent<HTMLDivElement>) {
      if (phase !== 'drag') return
      moveTo(e.clientX - startX.current)
    },
    onPointerUp() {
      if (phase !== 'drag') return
      const dir = releaseDecision(dxRef.current, cardWidth)
      if (dir) {
        fly(dir)
      } else {
        setPhase('return')
        moveTo(0)
      }
    },
    onPointerCancel() {
      if (phase !== 'drag') return
      setPhase('return')
      moveTo(0)
    },
  }

  const style: CSSProperties = {
    transform: `translateX(${dx}px) rotate(${dx / 20}deg)`,
    transition: phase === 'return' || phase === 'fly' ? `transform ${FLY_MS}ms ease-out` : 'none',
    touchAction: 'pan-y',
    cursor: phase === 'drag' ? 'grabbing' : 'grab',
  }

  // 0..1 strength of the current drag toward a decision, for the SKIP / SAVE stamps.
  const intent = Math.min(1, Math.abs(dx) / swipeThreshold(cardWidth))

  return { ref, handlers, style, dx, intent, fly, busy: phase === 'fly' }
}
