import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import type { ToastMessage } from '../types'

const icons = {
  info: <Info className="h-4 w-4 text-accent" />,
  error: <AlertCircle className="h-4 w-4 text-red-500" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
}

type Props = { toast: ToastMessage | null; onClose: () => void }

export function Toast({ toast, onClose }: Props) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null
  return (
    <div className="fixed right-4 top-4 z-50 max-w-[calc(100vw-2rem)] animate-slide-in" role="status">
      {/* Sharp-corner card style from the ScratchCard reference */}
      <div className="relative flex items-start gap-3 border border-zinc-800 bg-black px-4 py-3 text-sm">
        <span className="absolute -left-px -top-px h-2 w-2 border-l border-t border-zinc-500" />
        <span className="absolute -right-px -top-px h-2 w-2 border-r border-t border-zinc-500" />
        <span className="absolute -bottom-px -left-px h-2 w-2 border-b border-l border-zinc-500" />
        <span className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-zinc-500" />
        <span className="mt-0.5">{icons[toast.tone]}</span>
        <p className="flex-1">{toast.text}</p>
        <button onClick={onClose} className="text-muted hover:text-white" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
