import { useCallback, useMemo, useState } from 'react'
import { MarqueeFooter } from './components/MarqueeFooter'
import { SavedButton } from './components/SavedButton'
import { Toast } from './components/Toast'
import { initialDeck } from './lib/deck'
import { allSkills, findBySkill, getPool } from './lib/pool'
import { addSaved, loadFreelancers, loadSaved, persistFreelancers, persistSaved } from './lib/storage'
import { createFreelancer } from './lib/validate'
import type { FreelancerInput } from './lib/validate'
import { FreelancerForm } from './screens/FreelancerForm'
import { RoleScreen } from './screens/RoleScreen'
import { SavedList } from './screens/SavedList'
import { SkillPicker } from './screens/SkillPicker'
import { SwipeDeck } from './screens/SwipeDeck'
import type { Freelancer, Screen, ToastMessage } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('role')
  const [skill, setSkill] = useState('')
  const [deck, setDeck] = useState(initialDeck)
  const [saved, setSaved] = useState(loadSaved)
  const [submitted, setSubmitted] = useState(loadFreelancers)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const pool = useMemo(() => getPool(submitted), [submitted])
  const matches = useMemo(() => findBySkill(pool, skill), [pool, skill])
  const savedIds = useMemo(() => new Set(saved.map((e) => e.id)), [saved])

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
    setDeck(initialDeck)
    setScreen('deck')
  }

  const tick = useCallback(
    (freelancer: Freelancer) => {
      const next = addSaved(saved, freelancer.id)
      setSaved(next)
      if (next !== saved && !persistSaved(next)) {
        notify("Can't save on this browser. Your saved list will be lost when you close the page.", 'error')
      }
    },
    [saved, notify],
  )

  function addFreelancer(input: FreelancerInput) {
    const next = [...submitted, createFreelancer(input)]
    setSubmitted(next)
    if (!persistFreelancers(next)) {
      notify("Can't save on this browser. Your profile will disappear when you close the page.", 'error')
    }
  }

  const savedButton =<SavedButton count={saved.length} onClick={() => setScreen('saved')} />

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
          <SkillPicker skills={allSkills(pool)} onPick={pickSkill} onBack={() => setScreen('role')} right={savedButton} />
        )}
        {screen === 'deck' && (
          <SwipeDeck
            skill={skill}
            cards={matches}
            deck={deck}
            setDeck={setDeck}
            savedIds={savedIds}
            onTick={tick}
            onChangeSkill={() => setScreen('picker')}
            onViewSaved={() => setScreen('saved')}
          />
        )}
        {screen === 'saved' && (
          <SavedList
            saved={saved}
            pool={pool}
            onBack={() => setScreen(skill ? 'deck' : 'picker')}
            onFindMore={() => setScreen('picker')}
          />
        )}
        {screen === 'form' && (
          <FreelancerForm
            skills={allSkills(pool)}
            onSubmit={addFreelancer}
            onBack={() => setScreen('role')}
            onClientView={() => setScreen('picker')}
          />
        )}
      </main>

      <Toast toast={toast} onClose={closeToast} />
      <MarqueeFooter />
    </div>
  )
}
