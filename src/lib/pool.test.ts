import { describe, expect, it } from 'vitest'
import { STARTER_SKILLS } from '../data/skills'
import type { Freelancer } from '../types'
import { allSkills, findBySkill, getPool, normalizeSkill } from './pool'

const custom: Freelancer = {
  id: 'u-1',
  name: 'Test Person',
  location: 'Hanoi',
  skills: ['Drone   filming'],
  imageUrl: 'https://example.com/a.jpg',
  contact: 'test@example.com',
  isSample: false,
  createdAt: '2026-10-20T00:00:00.000Z',
}

describe('normalizeSkill', () => {
  it('trims, collapses spaces and lowercases', () => {
    expect(normalizeSkill('  Logo   Design ')).toBe('logo design')
  })
})

describe('sample pool', () => {
  it('has 10 labeled sample profiles', () => {
    const pool = getPool()
    expect(pool).toHaveLength(10)
    expect(pool.every((f) => f.isSample)).toBe(true)
  })

  it('covers every starter skill with at least 2 profiles', () => {
    for (const skill of STARTER_SKILLS) {
      expect(findBySkill(getPool(), skill).length, skill).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('findBySkill', () => {
  it('matches ignoring case and extra spaces', () => {
    expect(findBySkill(getPool(), '  short VIDEO editing ').length).toBeGreaterThan(0)
  })

  it('returns nothing for unknown or empty skills', () => {
    expect(findBySkill(getPool(), 'underwater welding')).toEqual([])
    expect(findBySkill(getPool(), '   ')).toEqual([])
  })

  it('includes submitted profiles', () => {
    expect(findBySkill(getPool([custom]), 'drone filming').map((f) => f.id)).toEqual(['u-1'])
  })
})

describe('allSkills', () => {
  it('lists starter skills first and adds custom ones once', () => {
    const skills = allSkills(getPool([custom, { ...custom, id: 'u-2', skills: ['drone filming'] }]))
    expect(skills.slice(0, STARTER_SKILLS.length)).toEqual(STARTER_SKILLS)
    expect(skills.filter((s) => normalizeSkill(s) === 'drone filming')).toEqual(['Drone filming'])
  })
})
