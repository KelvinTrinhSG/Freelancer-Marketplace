import { Briefcase, Sparkles } from 'lucide-react'

type Props = { onClient: () => void; onFreelancer: () => void }

export function RoleScreen({ onClient, onFreelancer }: Props) {
  return (
    <section className="flex min-h-[80dvh] animate-fade-in flex-col items-center justify-center gap-10 text-center">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-6xl">
          Freelancer
          <br />
          Swipe
        </h1>
        <p className="mx-auto max-w-sm text-sm text-muted">
          Hire freelancers for small, fast jobs. Pick a skill, browse portfolios one at a time, and save the people you like to get
          their contact.
        </p>
        <p className="mx-auto max-w-sm text-xs text-zinc-500">Freelancers: add your profile in a minute and get found by skill.</p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-4">
        <button
          onClick={onClient}
          className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-bold text-white transition-transform hover:scale-[1.02] hover:bg-accent/90 active:scale-[0.98]"
        >
          <Briefcase className="h-5 w-5" /> I'm a Client
        </button>
        <button
          onClick={onFreelancer}
          className="flex items-center justify-center gap-2 rounded-full border-2 border-accent bg-black px-6 py-4 text-base font-bold text-white transition-transform hover:scale-[1.02] hover:bg-accent/10 active:scale-[0.98]"
        >
          <Sparkles className="h-5 w-5 text-accent" /> I'm a Freelancer
        </button>
      </div>
    </section>
  )
}
