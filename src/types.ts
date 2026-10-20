export type Freelancer = {
  id: string
  name: string
  location: string
  skills: string[]
  videoUrl?: string
  imageUrl: string
  contact: string
  isSample: boolean
  createdAt: string
}

export type Screen = 'role' | 'form' | 'picker' | 'deck' | 'saved'

export type ToastMessage = {
  id: number
  text: string
  tone: 'info' | 'error' | 'success'
}
