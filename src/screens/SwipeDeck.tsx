import { useCallback, useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { FreelancerCard } from '../components/FreelancerCard'
import { ScreenHeader } from '../components/ScreenHeader'
import { useSwipe } from '../hooks/useSwipe'
import type { SwipeDirection } from '../hooks/useSwipe'
import { advance, back, canGoBack, initialDeck, skip } from '../lib/deck'
import type { Freelancer } from '../types'

function Stamp({ label, className, show, intent }: { label: string; className: string; show: boolean; intent: number }) {
  return (
    <span
      className={`pointer-events-none absolute top-8 rounded-md border-4 px-3 py-1 text-2xl font-extrabold tracking-widest ${className}`}
      style={{ opacity: show ? intent : 0 }}
    >
      {label}
    </span>
  )
}

type Props = {
  skill: string
  cards: Freelancer[]
  onChangeSkill: () => void
}

export function SwipeDeck({ skill, cards, onChangeSkill }: Props) {
  const [deck, setDeck] = useState(initialDeck)
  const current = cards[deck.index]

  const onSwipe = useCallback(
    (dir: SwipeDirection) => {
      setDeck((d) => (dir === 'left' ? skip(d, cards.length) : advance(d, cards.length)))
    },
    [cards.length],
  )
  const { ref: cardRef, handlers, style, dx, intent, fly, busy } = useSwipe(onSwipe)

  return (
    <section className="flex animate-fade-in flex-col gap-4">
      <ScreenHeader
        title={skill}
        subtitle={`${cards.length} freelancer${cards.length === 1 ? '' : 's'} · card ${deck.index + 1} of ${cards.length}`}
        onBack={onChangeSkill}
      />

      <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
        {current && (
          <div
            key={current.id}
            ref={cardRef}
            {...handlers}
            style={style}
            className="absolute inset-0"
            data-testid="swipe-card"
          >
            <FreelancerCard freelancer={current} />
            <Stamp label="TICK" className="left-5 -rotate-12 border-emerald-500 text-emerald-500" show={dx > 0} intent={intent} />
            <Stamp label="SKIP" className="right-5 rotate-12 border-red-500 text-red-500" show={dx < 0} intent={intent} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-5">
        <button
          onClick={() => fly('left')}
          disabled={busy}
          aria-label="Skip"
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500 bg-black text-red-500 transition-transform hover:scale-105 active:scale-95"
        >
          <X className="h-8 w-8" />
        </button>
        <button
          onClick={() => setDeck(back)}
          disabled={!canGoBack(deck) || busy}
          aria-label="Back to last skipped"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-card-border bg-card text-accent transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          onClick={() => fly('right')}
          disabled={busy}
          aria-label="Tick"
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500 bg-black text-emerald-500 transition-transform hover:scale-105 active:scale-95"
        >
          <Check className="h-8 w-8" />
        </button>
      </div>
    </section>
  )
}
