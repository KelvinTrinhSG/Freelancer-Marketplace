import { SAMPLE_FREELANCERS } from '../data/sampleFreelancers'
import { STARTER_SKILLS } from '../data/skills'
import type { Freelancer } from '../types'

/** Trim, collapse inner spaces, lowercase — so "  Logo   Design" matches "logo design". */
export function normalizeSkill(skill: string): string {
  return skill.trim().replace(/\s+/g, ' ').toLowerCase()
}

/** Everyone a client can swipe through: sample profiles plus any submitted ones. */
export function getPool(submitted: Freelancer[] = []): Freelancer[] {
  return [...SAMPLE_FREELANCERS, ...submitted]
}

export function findBySkill(pool: Freelancer[], skill: string): Freelancer[] {
  const wanted = normalizeSkill(skill)
  if (!wanted) return []
  return pool.filter((f) => f.skills.some((s) => normalizeSkill(s) === wanted))
}

/** Starter skills first, then any extra skills found in the pool, deduped by normalized form. */
export function allSkills(pool: Freelancer[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const skill of [...STARTER_SKILLS, ...pool.flatMap((f) => f.skills)]) {
    const key = normalizeSkill(skill)
    if (key && !seen.has(key)) {
      seen.add(key)
      result.push(skill.trim().replace(/\s+/g, ' '))
    }
  }
  return result
}
