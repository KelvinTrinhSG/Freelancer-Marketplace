import { Bookmark } from 'lucide-react'

export function SavedButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-card-border bg-card px-3 py-1.5 text-xs hover:border-accent"
    >
      <Bookmark className="h-3.5 w-3.5 text-accent" />
      Saved <span className="font-bold text-accent">{count}</span>
    </button>
  )
}
