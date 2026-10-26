import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { SkillChips } from '../components/SkillChips'
import { COUNTRIES } from '../data/countries'
import { normalizeSkill } from '../lib/pool'
import { emptyInput, isHttpUrl, MAX_LENGTH, validateFreelancer } from '../lib/validate'
import type { FieldErrors, FreelancerInput } from '../lib/validate'

type Props = {
  skills: string[]
  onSubmit: (input: FreelancerInput) => void
  onBack: () => void
  onClientView: () => void
}

type PreviewState = { url: string; status: 'ok' | 'error' }

const inputClass = (error?: string) =>
  `w-full rounded-lg border bg-black px-3 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-accent ${
    error ? 'border-red-500' : 'border-card-border'
  }`

function Field({ label, hint, error, children }: { label: string; hint?: ReactNode; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-widest text-muted">{label}</span>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : hint && <p className="text-[11px] text-zinc-500">{hint}</p>}
    </label>
  )
}

export function FreelancerForm({ skills, onSubmit, onBack, onClientView }: Props) {
  const [input, setInput] = useState<FreelancerInput>(emptyInput)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [triedSubmit, setTriedSubmit] = useState(false)
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [done, setDone] = useState(false)

  const imageUrl = input.imageUrl.trim()
  const previewStatus = preview?.url === imageUrl ? preview.status : undefined
  const imageLoads = previewStatus === 'ok' ? true : previewStatus === 'error' ? false : undefined

  const set = (field: keyof FreelancerInput) => (e: { target: { value: string } }) => {
    setInput((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear a field's error as soon as the user edits it; it is re-checked on blur.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  // Check one field when the user leaves it, so mistakes show up before Submit.
  const check = (field: keyof FreelancerInput) => () => {
    const value = input[field]
    if (typeof value === 'string' && !value.trim() && !triedSubmit) return
    setErrors((prev) => ({ ...prev, [field]: validateFreelancer(input, { imageLoads }).errors[field] }))
  }

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
    if (errors.skills) setErrors((prev) => ({ ...prev, skills: undefined }))
  }

  function addCustomSkill(skill: string) {
    const existing = chipList.find((s) => normalizeSkill(s) === normalizeSkill(skill))
    if (existing && input.skills.some((s) => normalizeSkill(s) === normalizeSkill(existing))) return
    toggleSkill(existing ?? skill)
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    setTriedSubmit(true)
    const result = validateFreelancer(input, { imageLoads })
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
              setTriedSubmit(false)
              setPreview(null)
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

  const missing = Object.values(errors).filter(Boolean).length

  return (
    <section className="animate-fade-in space-y-6">
      <ScreenHeader title="Add yourself" subtitle="One quick profile. Clients find you by skill and judge you by your best work." onBack={onBack} />

      <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border border-card-border bg-card p-5">
        {triedSubmit && missing > 0 && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300" role="alert">
            Please fix the {missing} highlighted field{missing === 1 ? '' : 's'}. Nothing was saved yet.
          </p>
        )}

        <Field label="Display name *" hint="How clients will see you, e.g. Linh Nguyen." error={errors.name}>
          <input
            value={input.name}
            onChange={set('name')}
            onBlur={check('name')}
            maxLength={MAX_LENGTH.name}
            autoComplete="name"
            className={inputClass(errors.name)}
            placeholder="Your name"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="City" error={errors.city}>
            <input
              value={input.city}
              onChange={set('city')}
              onBlur={check('city')}
              maxLength={MAX_LENGTH.city}
              autoComplete="address-level2"
              className={inputClass(errors.city)}
              placeholder="e.g. Hanoi"
            />
          </Field>
          <Field label="Country">
            <select value={input.country} onChange={set('country')} className={inputClass()} autoComplete="country-name">
              <option value="">Choose…</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

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
              maxLength={MAX_LENGTH.skill}
            />
          </div>
          {errors.skills ? (
            <p className="text-xs text-red-500">{errors.skills}</p>
          ) : (
            <p className="text-[11px] text-zinc-500">Pick as many as you offer.</p>
          )}
        </div>

        <Field
          label="Best project image link *"
          hint="A direct link to one image of your best work. No public link? Upload it to Imgur or Google Drive (shared publicly) and paste the image link. For audio work, use a cover image or a screenshot of your track."
          error={errors.imageUrl}
        >
          <input
            value={input.imageUrl}
            onChange={set('imageUrl')}
            onBlur={check('imageUrl')}
            maxLength={MAX_LENGTH.url}
            className={inputClass(errors.imageUrl)}
            placeholder="https://…/my-best-project.jpg"
            inputMode="url"
          />
        </Field>
        {isHttpUrl(imageUrl) && (
          <div className="flex items-center gap-3 rounded-lg border border-card-border bg-black p-2">
            <img
              key={imageUrl}
              src={imageUrl}
              alt="Preview of your best project"
              onLoad={() => {
                setPreview({ url: imageUrl, status: 'ok' })
                setErrors((prev) => ({ ...prev, imageUrl: undefined }))
              }}
              // Not flagged here (the user may still be typing); blur and Submit pick up the failed preview.
              onError={() => setPreview({ url: imageUrl, status: 'error' })}
              className={`h-16 w-16 shrink-0 rounded-md object-cover ${previewStatus === 'ok' ? '' : 'hidden'}`}
            />
            <p className="text-[11px] text-muted">
              {previewStatus === 'ok' ? 'Preview: this is what clients will see on your card.' : previewStatus === 'error' ? 'No preview: this link did not open an image.' : 'Loading preview…'}
            </p>
          </div>
        )}

        <Field label="YouTube / TikTok link" hint="Optional. A short clip of your work clients can watch before deciding." error={errors.videoUrl}>
          <input
            value={input.videoUrl}
            onChange={set('videoUrl')}
            onBlur={check('videoUrl')}
            maxLength={MAX_LENGTH.url}
            className={inputClass(errors.videoUrl)}
            placeholder="https://youtube.com/…"
            inputMode="url"
          />
        </Field>

        <Field label="Portfolio link" hint="Optional. Behance, SoundCloud, GitHub, your website…" error={errors.portfolioUrl}>
          <input
            value={input.portfolioUrl}
            onChange={set('portfolioUrl')}
            onBlur={check('portfolioUrl')}
            maxLength={MAX_LENGTH.url}
            className={inputClass(errors.portfolioUrl)}
            placeholder="https://…"
            inputMode="url"
          />
        </Field>

        <Field label="Contact info *" hint="Shown only to clients who save you. Email, phone, Zalo, Telegram…" error={errors.contact}>
          <textarea
            value={input.contact}
            onChange={set('contact')}
            onBlur={check('contact')}
            maxLength={MAX_LENGTH.contact}
            rows={3}
            className={inputClass(errors.contact)}
            placeholder={'Email: you@example.com\nZalo: 09xx xxx xxx'}
          />
        </Field>

        <button type="submit" className="w-full rounded-full bg-accent px-6 py-3.5 font-bold text-white transition-transform hover:bg-accent/90 active:scale-[0.98]">
          Submit
        </button>
      </form>
    </section>
  )
}
