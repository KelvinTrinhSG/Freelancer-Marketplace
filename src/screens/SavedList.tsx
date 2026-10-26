import { HeartOff } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import type { SavedEntry } from '../lib/storage'
import type { Freelancer } from '../types'

type Props = {
  saved: SavedEntry[]
  pool: Freelancer[]
  onBack: () => void
  onFindMore: () => void
}

export function SavedList({ saved, pool, onBack, onFindMore }: Props) {
  const byId = new Map(pool.map((f) => [f.id, f]))
  // Newest first; ids that no longer exist in the pool are skipped.
  const rows = [...saved]
    .reverse()
    .map((entry) => byId.get(entry.id))
    .filter((f): f is Freelancer => f !== undefined)

  return (
    <section className="animate-fade-in space-y-6">
      <ScreenHeader title="Saved" subtitle="Everyone you saved, with how to reach them." onBack={onBack} />

      {rows.length === 0 ? (
        <div className="space-y-4 rounded-2xl border border-card-border bg-card p-8 text-center">
          <HeartOff className="mx-auto h-8 w-8 text-muted" />
          <p className="text-sm">No one saved yet. Browse freelancers to start.</p>
          <button onClick={onFindMore} className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90">
            Pick a skill
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((f) => (
            <li key={f.id} className="flex gap-4 rounded-2xl border border-card-border bg-card p-4">
              <img src={f.avatarUrl ?? f.imageUrl} alt="" className="h-20 w-20 shrink-0 rounded-xl bg-accent/30 object-cover" />
              <div className="min-w-0 space-y-1">
                <p className="font-bold">{f.name}</p>
                <p className="text-[11px] text-muted">{f.skills.join(' · ')}</p>
                <p className="whitespace-pre-wrap break-words text-xs text-accent">{f.contact}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
