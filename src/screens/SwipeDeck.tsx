import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { FreelancerCard } from '../components/FreelancerCard'
import { ScreenHeader } from '../components/ScreenHeader'
import { advance, back, canGoBack, initialDeck, skip } from '../lib/deck'
import type { Freelancer } from '../types'

type Props = {
  skill: string
  cards: Freelancer[]
  onChangeSkill: () => void
}

export function SwipeDeck({ skill, cards, onChangeSkill }: Props) {
  const [deck, setDeck] = useState(initialDeck)
  const current = cards[deck.index]

  return (
    <section className="flex animate-fade-in flex-col gap-4">
      <ScreenHeader
        title={skill}
        subtitle={`${cards.length} freelancer${cards.length === 1 ? '' : 's'} · card ${deck.index + 1} of ${cards.length}`}
        onBack={onChangeSkill}
      />

      <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
        {current && <FreelancerCard key={current.id} freelancer={current} />}
      </div>

      <div className="flex items-center justify-center gap-5">
        <button
          onClick={() => setDeck((d) => skip(d, cards.length))}
          aria-label="Skip"
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500 bg-black text-red-500 transition-transform hover:scale-105 active:scale-95"
        >
          <X className="h-8 w-8" />
        </button>
        <button
          onClick={() => setDeck(back)}
          disabled={!canGoBack(deck)}
          aria-label="Back to last skipped"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-card-border bg-card text-accent transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          onClick={() => setDeck((d) => advance(d, cards.length))}
          aria-label="Tick"
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500 bg-black text-emerald-500 transition-transform hover:scale-105 active:scale-95"
        >
          <Check className="h-8 w-8" />
        </button>
      </div>
    </section>
  )
}
