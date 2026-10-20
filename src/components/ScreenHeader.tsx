import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

type Props = { title: string; subtitle?: string; onBack: () => void; right?: ReactNode }

export function ScreenHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <header className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {right}
      </div>
      <h1 className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-3xl font-extrabold text-transparent">{title}</h1>
      {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
    </header>
  )
}
