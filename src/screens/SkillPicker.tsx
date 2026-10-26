import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { SkillChips } from '../components/SkillChips'
import { ScreenHeader } from '../components/ScreenHeader'
import { MAX_LENGTH } from '../lib/validate'

const TRANSITION_MS = 450

type Props = {
  skills: string[]
  countFor: (skill: string) => number
  onPick: (skill: string) => void
  onNoMatch: (skill: string) => void
  onBack: () => void
  right?: ReactNode
}

export function SkillPicker({ skills, countFor, onPick, onNoMatch, onBack, right }: Props) {
  const [pending, setPending] = useState<{ skill: string; count: number } | null>(null)

  // Show the chosen skill for a moment before switching screens, so the jump isn't abrupt.
  useEffect(() => {
    if (!pending) return
    const timer = setTimeout(() => onPick(pending.skill), TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [pending, onPick])

  function choose(skill: string) {
    if (pending) return
    const count = countFor(skill)
    if (count === 0) onNoMatch(skill)
    else setPending({ skill, count })
  }

  return (
    <section className="animate-fade-in space-y-6">
      <ScreenHeader
        title="What do you need?"
        subtitle="Choose one skill. We'll show you matching freelancers one at a time."
        onBack={onBack}
        right={right}
      />
      <div className="rounded-2xl border border-card-border bg-card p-5">
        <SkillChips
          skills={skills}
          selected={pending ? [pending.skill] : []}
          onToggle={choose}
          onCustom={choose}
          customPlaceholder="Type a skill that isn't listed"
          customButtonLabel="Find"
          maxLength={MAX_LENGTH.skill}
          single
          disabled={pending !== null}
        />
      </div>
      {pending && (
        <p className="flex animate-fade-in items-center justify-center gap-2 text-sm text-accent" role="status">
          <Loader2 className="h-4 w-4 animate-spin" />
          Showing {pending.count} freelancer{pending.count === 1 ? '' : 's'} for {pending.skill}…
        </p>
      )}
    </section>
  )
}
