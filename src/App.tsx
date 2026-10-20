import { useCallback, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { MarqueeFooter } from './components/MarqueeFooter'
import { Toast } from './components/Toast'
import { allSkills, findBySkill, getPool } from './lib/pool'
import { RoleScreen } from './screens/RoleScreen'
import { SkillPicker } from './screens/SkillPicker'
import { SwipeDeck } from './screens/SwipeDeck'
import type { Screen, ToastMessage } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('role')
  const [skill, setSkill] = useState('')
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const pool = useMemo(() => getPool(), [])
  const matches = useMemo(() => findBySkill(pool, skill), [pool, skill])

  const notify = useCallback((text: string, tone: ToastMessage['tone'] = 'info') => {
    setToast({ id: Date.now(), text, tone })
  }, [])
  const closeToast = useCallback(() => setToast(null), [])

  function pickSkill(picked: string) {
    if (findBySkill(pool, picked).length === 0) {
      notify(`No freelancers have "${picked}" yet. Try another skill.`, 'error')
      return
    }
    setSkill(picked)
    setScreen('deck')
  }

  return (
    <div className="relative min-h-dvh">
      {/* Subtle ambient glow, as in the reference */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-full -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <main className="mx-auto w-full max-w-md px-4 pb-20 pt-8">
        {screen === 'role' && (
          <RoleScreen onClient={() => setScreen('picker')} onFreelancer={() => setScreen('form')} />
        )}
        {screen === 'picker' && (
          <SkillPicker skills={allSkills(pool)} onPick={pickSkill} onBack={() => setScreen('role')} />
        )}
        {screen === 'deck' && (
          <SwipeDeck key={skill} skill={skill} cards={matches} onChangeSkill={() => setScreen('picker')} />
        )}
        {screen === 'form' && (
          <section className="animate-fade-in space-y-4 rounded-2xl border border-card-border bg-card p-6 text-center">
            <p className="text-lg font-bold">Freelancer sign-up is coming soon.</p>
            <button onClick={() => setScreen('role')} className="inline-flex items-center gap-1 text-sm text-accent">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </section>
        )}
      </main>

      <Toast toast={toast} onClose={closeToast} />
      <MarqueeFooter />
    </div>
  )
}
