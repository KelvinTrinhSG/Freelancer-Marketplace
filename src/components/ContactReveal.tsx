import { Bookmark, Heart } from 'lucide-react'
import type { Freelancer } from '../types'

type Props = {
  freelancer: Freelancer
  onKeepSwiping: () => void
  onViewSaved: () => void
}

export function ContactReveal({ freelancer, onKeepSwiping, onViewSaved }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-label="Contact info">
      <div className="w-full max-w-sm animate-fade-in space-y-5 rounded-2xl border border-accent/50 bg-card p-6 shadow-[0_10px_60px_rgba(135,109,255,0.35)]">
        <div className="flex items-center gap-4">
          <img
            src={freelancer.imageUrl}
            alt=""
            className="h-16 w-16 rounded-xl border border-card-border bg-accent/30 object-cover"
          />
          <div>
            <p className="flex items-center gap-1 text-xs uppercase tracking-widest text-emerald-500">
              <Heart className="h-3 w-3 fill-current" /> Saved
            </p>
            <h2 className="text-xl font-extrabold">{freelancer.name}</h2>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted">Contact</p>
          <p className="whitespace-pre-wrap break-words rounded-lg border border-card-border bg-black p-3 text-sm text-accent">
            {freelancer.contact}
          </p>
          <p className="text-[11px] text-muted">Reach out directly. Freelancer Swipe never messages for you.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onViewSaved}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-card-border px-4 py-3 text-sm font-semibold hover:border-accent"
          >
            <Bookmark className="h-4 w-4" /> View saved
          </button>
          <button
            onClick={onKeepSwiping}
            autoFocus
            className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent/90"
          >
            Keep swiping
          </button>
        </div>
      </div>
    </div>
  )
}
