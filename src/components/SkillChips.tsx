import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { normalizeSkill } from '../lib/pool'

type Props = {
  skills: string[]
  selected: string[]
  onToggle: (skill: string) => void
  /** Called with a trimmed custom skill typed by the user. */
  onCustom: (skill: string) => void
  customPlaceholder: string
  customButtonLabel: string
  maxLength?: number
  /** Single-choice mode: chips look like radio buttons and are labelled as a group. */
  single?: boolean
  disabled?: boolean
}

export function SkillChips({ skills, selected, onToggle, onCustom, customPlaceholder, customButtonLabel, maxLength, single = false, disabled = false }: Props) {
  const [custom, setCustom] = useState('')
  const selectedKeys = new Set(selected.map(normalizeSkill))

  function submitCustom() {
    const value = custom.trim().replace(/\s+/g, ' ')
    if (!value || disabled) return
    onCustom(value)
    setCustom('')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role={single ? 'radiogroup' : 'group'}>
        {skills.map((skill) => {
          const active = selectedKeys.has(normalizeSkill(skill))
          return (
            <button
              key={skill}
              type="button"
              role={single ? 'radio' : undefined}
              aria-checked={single ? active : undefined}
              aria-pressed={single ? undefined : active}
              disabled={disabled}
              onClick={() => onToggle(skill)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors disabled:cursor-default ${
                active
                  ? 'border-accent bg-accent text-white'
                  : 'border-card-border bg-card text-zinc-200 hover:border-accent/60'
              }`}
            >
              {single ? (
                <span className={`h-3 w-3 shrink-0 rounded-full border ${active ? 'border-white bg-white' : 'border-zinc-500'}`} aria-hidden />
              ) : (
                active && <Check className="h-3 w-3" />
              )}
              {skill}
            </button>
          )
        })}
      </div>
      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submitCustom()
            }
          }}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={customPlaceholder}
          className="min-w-0 flex-1 rounded-lg border border-card-border bg-card px-3 py-2 text-sm outline-none placeholder:text-zinc-600 focus:border-accent"
        />
        <button
          type="button"
          onClick={submitCustom}
          disabled={disabled}
          className="flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          {customButtonLabel}
        </button>
      </div>
    </div>
  )
}
