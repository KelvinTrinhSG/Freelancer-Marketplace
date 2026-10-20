import { describe, expect, it } from 'vitest'
import { createFreelancer, emptyInput, isHttpUrl, validateFreelancer } from './validate'

const valid = {
  ...emptyInput,
  name: ' Kim Lee ',
  skills: ['Drone filming'],
  imageUrl: 'https://example.com/best.jpg',
  contact: 'kim@example.com',
}

describe('validateFreelancer', () => {
  it('flags every required field when empty', () => {
    const { ok, errors } = validateFreelancer(emptyInput)
    expect(ok).toBe(false)
    expect(Object.keys(errors).sort()).toEqual(['contact', 'imageUrl', 'name', 'skills'])
  })

  it('accepts a minimal valid profile (location and video optional)', () => {
    expect(validateFreelancer(valid)).toEqual({ ok: true, errors: {} })
  })

  it('rejects links that are not http(s)', () => {
    expect(validateFreelancer({ ...valid, imageUrl: 'my-photo.jpg' }).errors.imageUrl).toBeDefined()
    expect(validateFreelancer({ ...valid, videoUrl: 'javascript:alert(1)' }).errors.videoUrl).toBeDefined()
    expect(isHttpUrl('https://www.tiktok.com/@me')).toBe(true)
  })

  it('treats whitespace-only fields as missing', () => {
    expect(validateFreelancer({ ...valid, name: '   ', contact: '  ' }).errors).toHaveProperty('name')
  })
})

describe('createFreelancer', () => {
  it('trims fields, marks it as not a sample, and omits an empty video link', () => {
    const f = createFreelancer(valid, 'u-1', new Date('2026-10-20T00:00:00Z'))
    expect(f).toEqual({
      id: 'u-1',
      name: 'Kim Lee',
      location: '',
      skills: ['Drone filming'],
      imageUrl: 'https://example.com/best.jpg',
      contact: 'kim@example.com',
      isSample: false,
      createdAt: '2026-10-20T00:00:00.000Z',
    })
  })
})
