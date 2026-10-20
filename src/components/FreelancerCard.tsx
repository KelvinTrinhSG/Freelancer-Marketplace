import { useState } from 'react'
import { MapPin, PlayCircle } from 'lucide-react'
import type { Freelancer } from '../types'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function videoLabel(url: string): string {
  return /tiktok\.com/i.test(url) ? 'Watch on TikTok' : 'Watch on YouTube'
}

type Props = { freelancer: Freelancer; saved?: boolean }

export function FreelancerCard({ freelancer, saved = false }: Props) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const imageFailed = failedUrl === freelancer.imageUrl

  return (
    <article className="relative h-full w-full select-none overflow-hidden rounded-2xl border border-card-border bg-card shadow-[0_10px_40px_rgba(135,109,255,0.18)]">
      {imageFailed ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent to-purple-900 text-6xl font-extrabold">
          {initials(freelancer.name)}
        </div>
      ) : (
        <img
          src={freelancer.imageUrl}
          alt={`${freelancer.name}'s best project`}
          draggable={false}
          onError={() => setFailedUrl(freelancer.imageUrl)}
          className="h-full w-full object-cover"
        />
      )}

      <div className="absolute left-3 top-3 flex gap-2">
        {freelancer.isSample && (
          <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted">Sample</span>
        )}
        {saved && (
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-black">Saved</span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black via-black/85 to-transparent p-4 pt-16">
        <h2 className="text-2xl font-extrabold leading-tight">{freelancer.name}</h2>
        {freelancer.location && (
          <p className="flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3 w-3" /> {freelancer.location}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {freelancer.skills.map((skill) => (
            <span key={skill} className="rounded-full border border-accent/50 px-2 py-0.5 text-[11px] text-accent">
              {skill}
            </span>
          ))}
        </div>
        {freelancer.videoUrl && (
          <a
            href={freelancer.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            // Keep taps on the link from starting a swipe drag.
            onPointerDown={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white underline decoration-accent underline-offset-4"
          >
            <PlayCircle className="h-4 w-4 text-accent" />
            {videoLabel(freelancer.videoUrl)}
          </a>
        )}
      </div>
    </article>
  )
}
