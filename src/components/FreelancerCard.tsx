import { useState } from 'react'
import { ExternalLink, MapPin, PlayCircle } from 'lucide-react'
import type { Freelancer } from '../types'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

const AUDIO_SKILLS = ['voice-over', 'music & sound effects']

/** "Listen" for audio-first freelancers, "Watch" for everyone else. */
function videoLabel(url: string, firstSkill = ''): string {
  const verb = AUDIO_SKILLS.includes(firstSkill.toLowerCase()) ? 'Listen' : 'Watch'
  return `${verb} on ${/tiktok\.com/i.test(url) ? 'TikTok' : 'YouTube'}`
}

const linkClass =
  'inline-flex items-center gap-1.5 text-xs font-semibold text-white underline decoration-accent underline-offset-4'

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
        <>
          {/* Blurred fill behind, the whole image uncropped on top: work samples are often wide screenshots. */}
          <img src={freelancer.imageUrl} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-xl" />
          <div className="absolute inset-x-0 top-0 bottom-[38%] flex items-center justify-center p-3 pt-10">
            <img
              src={freelancer.imageUrl}
              alt={`${freelancer.name}'s best project`}
              draggable={false}
              onError={() => setFailedUrl(freelancer.imageUrl)}
              className="max-h-full max-w-full rounded-lg object-contain shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            />
          </div>
        </>
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
        <div className="flex items-center gap-3">
          {freelancer.avatarUrl && (
            <img
              src={freelancer.avatarUrl}
              alt=""
              draggable={false}
              className="h-11 w-11 shrink-0 rounded-full border-2 border-accent object-cover"
            />
          )}
          <h2 className="text-2xl font-extrabold leading-tight">{freelancer.name}</h2>
        </div>
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
        {(freelancer.videoUrl || freelancer.portfolioUrl) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {freelancer.videoUrl && (
              <a
                href={freelancer.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                // Keep taps on the link from starting a swipe drag.
                onPointerDown={(e) => e.stopPropagation()}
                className={linkClass}
              >
                <PlayCircle className="h-4 w-4 text-accent" />
                {videoLabel(freelancer.videoUrl, freelancer.skills[0])}
              </a>
            )}
            {freelancer.portfolioUrl && (
              <a
                href={freelancer.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => e.stopPropagation()}
                className={linkClass}
              >
                <ExternalLink className="h-4 w-4 text-accent" />
                Portfolio
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
