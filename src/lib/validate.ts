import type { Freelancer } from '../types'

export type FreelancerInput = {
  name: string
  location: string
  skills: string[]
  videoUrl: string
  imageUrl: string
  contact: string
}

export type FieldErrors = Partial<Record<keyof FreelancerInput, string>>

export const emptyInput: FreelancerInput = { name: '', location: '', skills: [], videoUrl: '', imageUrl: '', contact: '' }

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/** Required: name, at least one skill, image link, contact. Links must be http(s). */
export function validateFreelancer(input: FreelancerInput): { ok: boolean; errors: FieldErrors } {
  const errors: FieldErrors = {}
  if (!input.name.trim()) errors.name = 'Add your name.'
  if (input.skills.length === 0) errors.skills = 'Pick or type at least one skill.'
  if (!input.imageUrl.trim()) errors.imageUrl = 'Paste a link to your best project image.'
  else if (!isHttpUrl(input.imageUrl)) errors.imageUrl = 'Use a full link starting with http:// or https://'
  if (input.videoUrl.trim() && !isHttpUrl(input.videoUrl)) errors.videoUrl = 'Use a full link starting with http:// or https://'
  if (!input.contact.trim()) errors.contact = 'Tell clients how to reach you.'
  return { ok: Object.keys(errors).length === 0, errors }
}

export function createFreelancer(input: FreelancerInput, id: string = crypto.randomUUID(), now = new Date()): Freelancer {
  const video = input.videoUrl.trim()
  return {
    id,
    name: input.name.trim(),
    location: input.location.trim(),
    skills: input.skills,
    ...(video ? { videoUrl: video } : {}),
    imageUrl: input.imageUrl.trim(),
    contact: input.contact.trim(),
    isSample: false,
    createdAt: now.toISOString(),
  }
}
