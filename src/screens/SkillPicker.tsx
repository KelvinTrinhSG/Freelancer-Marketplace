import type { ReactNode } from 'react'
import { SkillChips } from '../components/SkillChips'
import { ScreenHeader } from '../components/ScreenHeader'

type Props = {
  skills: string[]
  onPick: (skill: string) => void
  onBack: () => void
  right?: ReactNode
}

export function SkillPicker({ skills, onPick, onBack, right }: Props) {
  return (
    <section className="animate-fade-in space-y-6">
      <ScreenHeader
        title="What do you need?"
        subtitle="Pick one skill. We'll show you matching freelancers one at a time."
        onBack={onBack}
        right={right}
      />
      <div className="rounded-2xl border border-card-border bg-card p-5">
        <SkillChips
          skills={skills}
          selected={[]}
          onToggle={onPick}
          onCustom={onPick}
          customPlaceholder="Type a skill that isn't listed"
          customButtonLabel="Find"
        />
      </div>
    </section>
  )
}
