export type Freelancer = {
  id: string
  name: string
  location: string
  skills: string[]
  videoUrl?: string
  /** Any public portfolio page (Behance, SoundCloud, GitHub, a website). */
  portfolioUrl?: string
  imageUrl: string
  /** Portrait photo; only sample profiles have one for now. */
  avatarUrl?: string
  contact: string
  isSample: boolean
  createdAt: string
}

export type Screen = 'role' | 'form' | 'picker' | 'deck' | 'saved'

export type ToastMessage = {
  id: number
  text: string
  tone: 'info' | 'error' | 'success'
  action?: { label: string; onClick: () => void }
}
