import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { SkillChips } from '../components/SkillChips'
import { normalizeSkill } from '../lib/pool'
import { emptyInput, validateFreelancer } from '../lib/validate'
import type { FieldErrors, FreelancerInput } from '../lib/validate'

type Props = {
  skills: string[]
  onSubmit: (input: FreelancerInput) => void
  onBack: () => void
  onClientView: () => void
}

const inputClass = (error?: string) =>
  `w-full rounded-lg border bg-black px-3 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-accent ${
    error ? 'border-red-500' : 'border-card-border'
  }`

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-widest text-muted">{label}</span>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : hint && <p className="text-[11px] text-zinc-600">{hint}</p>}
    </label>
  )
}

export function FreelancerForm({ skills, onSubmit, onBack, onClientView }: Props) {
  const [input, setInput] = useState<FreelancerInput>(emptyInput)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [done, setDone] = useState(false)

  const set = (field: keyof FreelancerInput) => (e: { target: { value: string } }) =>
    setInput((prev) => ({ ...prev, [field]: e.target.value }))

  // Keep typed-in custom skills visible as chips alongside the known list.
  const chipList = [...skills, ...input.skills.filter((s) => !skills.some((k) => normalizeSkill(k) === normalizeSkill(s)))]

  function toggleSkill(skill: string) {
    const key = normalizeSkill(skill)
    setInput((prev) => ({
      ...prev,
      skills: prev.skills.some((s) => normalizeSkill(s) === key)
        ? prev.skills.filter((s) => normalizeSkill(s) !== key)
        : [...prev.skills, skill],
    }))
  }

  function addCustomSkill(skill: string) {
    const existing = chipList.find((s) => normalizeSkill(s) === normalizeSkill(skill))
    if (existing && input.skills.some((s) => normalizeSkill(s) === normalizeSkill(existing))) return
    toggleSkill(existing ?? skill)
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const result = validateFreelancer(input)
    setErrors(result.errors)
    if (!result.ok) return
    onSubmit(input)
    setDone(true)
  }

  if (done) {
    return (
      <section className="animate-fade-in space-y-5 rounded-2xl border border-accent/50 bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h1 className="text-2xl font-extrabold">You're in the deck!</h1>
        <p className="text-sm text-muted">
          Clients picking {input.skills.join(', ')} on this browser will now see your card.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={onClientView} className="rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent/90">
            Go to client view
          </button>
          <button
            onClick={() => {
              setInput(emptyInput)
              setErrors({})
              setDone(false)
            }}
            className="rounded-lg border border-card-border px-4 py-3 text-sm hover:border-accent"
          >
            Add another
          </button>
        </div>
      </section>
    )
  }

  const missing = Object.keys(errors).length

  return (
    <section className="animate-fade-in space-y-6">
      <ScreenHeader title="Add yourself" subtitle="One quick profile. Clients find you by skill and judge you by your best work." onBack={onBack} />

      <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border border-card-border bg-card p-5">
        {missing > 0 && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300" role="alert">
            Please fix the {missing} highlighted field{missing === 1 ? '' : 's'}. Nothing was saved yet.
          </p>
        )}

        <Field label="Name *" error={errors.name}>
          <input value={input.name} onChange={set('name')} className={inputClass(errors.name)} placeholder="Your name" />
        </Field>

        <Field label="Location" error={errors.location}>
          <input value={input.location} onChange={set('location')} className={inputClass()} placeholder="City, country" />
        </Field>

        <div className="space-y-1.5">
          <span className="text-xs uppercase tracking-widest text-muted">Skills *</span>
          <div className={`rounded-lg border p-3 ${errors.skills ? 'border-red-500' : 'border-card-border'}`}>
            <SkillChips
              skills={chipList}
              selected={input.skills}
              onToggle={toggleSkill}
              onCustom={addCustomSkill}
              customPlaceholder="Type a skill that isn't listed"
              customButtonLabel="Add"
            />
          </div>
          {errors.skills && <p className="text-xs text-red-500">{errors.skills}</p>}
        </div>

        <Field label="Best project image link *" hint="A direct link to one image of your best work." error={errors.imageUrl}>
          <input value={input.imageUrl} onChange={set('imageUrl')} className={inputClass(errors.imageUrl)} placeholder="https://…/my-best-project.jpg" inputMode="url" />
        </Field>

        <Field label="YouTube / TikTok link" hint="Optional. Clients can watch it before ticking." error={errors.videoUrl}>
          <input value={input.videoUrl} onChange={set('videoUrl')} className={inputClass(errors.videoUrl)} placeholder="https://youtube.com/…" inputMode="url" />
        </Field>

        <Field label="Contact info *" hint="Shown to clients who tick you. Email, phone, Zalo, Telegram…" error={errors.contact}>
          <textarea value={input.contact} onChange={set('contact')} rows={3} className={inputClass(errors.contact)} placeholder={'Email: you@example.com\nZalo: 09xx xxx xxx'} />
        </Field>

        <button type="submit" className="w-full rounded-full bg-accent px-6 py-3.5 font-bold text-white transition-transform hover:bg-accent/90 active:scale-[0.98]">
          Submit
        </button>
      </form>
    </section>
  )
}
