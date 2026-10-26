import { describe, expect, it } from 'vitest'
import { createFreelancer, emptyInput, isHttpUrl, isVideoUrl, looksLikeImageUrl, MAX_LENGTH, validateFreelancer } from './validate'

const valid = {
  ...emptyInput,
  name: ' Kim Lee ',
  skills: ['Drone filming'],
  imageUrl: 'https://example.com/best.jpg',
  contact: 'kim@example.com',
}

describe('link checks', () => {
  it('accepts real http(s) web addresses', () => {
    expect(isHttpUrl('https://www.tiktok.com/@me')).toBe(true)
    expect(isHttpUrl('http://my-site.co.uk/work?id=1')).toBe(true)
  })

  it('rejects things that only start with http', () => {
    for (const bad of ['http:foo', 'http://abc', 'https://exa mple.com', 'http://localhost:3000', 'https:example.com', 'http//x.com', 'javascript:alert(1)', 'my-photo.jpg']) {
      expect(isHttpUrl(bad), bad).toBe(false)
    }
  })

  it('accepts only YouTube and TikTok for video', () => {
    expect(isVideoUrl('https://www.youtube.com/watch?v=abc')).toBe(true)
    expect(isVideoUrl('https://youtu.be/abc')).toBe(true)
    expect(isVideoUrl('https://vm.tiktok.com/xyz')).toBe(true)
    expect(isVideoUrl('https://vimeo.com/123')).toBe(false)
    expect(isVideoUrl('https://notyoutube.com/watch')).toBe(false)
  })

  it('recognizes image links by extension', () => {
    expect(looksLikeImageUrl('https://example.com/a/b.PNG')).toBe(true)
    expect(looksLikeImageUrl('https://example.com/page')).toBe(false)
  })
})

describe('validateFreelancer', () => {
  it('flags every required field when empty', () => {
    const { ok, errors } = validateFreelancer(emptyInput)
    expect(ok).toBe(false)
    expect(Object.keys(errors).sort()).toEqual(['contact', 'imageUrl', 'name', 'skills'])
  })

  it('accepts a minimal valid profile (location, video and portfolio optional)', () => {
    expect(validateFreelancer(valid)).toEqual({ ok: true, errors: {} })
  })

  it('rejects malformed links in every link field', () => {
    expect(validateFreelancer({ ...valid, imageUrl: 'http:foo' }).errors.imageUrl).toBeDefined()
    expect(validateFreelancer({ ...valid, videoUrl: 'javascript:alert(1)' }).errors.videoUrl).toBeDefined()
    expect(validateFreelancer({ ...valid, portfolioUrl: 'http://abc' }).errors.portfolioUrl).toBeDefined()
  })

  it('requires a YouTube or TikTok video link', () => {
    expect(validateFreelancer({ ...valid, videoUrl: 'https://vimeo.com/1' }).errors.videoUrl).toBe('Use a YouTube or TikTok link.')
  })

  it('uses the live preview result for image links without an extension', () => {
    const page = { ...valid, imageUrl: 'https://example.com/photo/123' }
    expect(validateFreelancer(page).errors.imageUrl).toBeDefined()
    expect(validateFreelancer(page, { imageLoads: true }).ok).toBe(true)
    expect(validateFreelancer(valid, { imageLoads: false }).errors.imageUrl).toMatch(/couldn't load/)
  })

  it('caps field lengths', () => {
    const long = (n: number) => 'x'.repeat(n + 1)
    const { errors } = validateFreelancer({ ...valid, name: long(MAX_LENGTH.name), city: long(MAX_LENGTH.city), contact: long(MAX_LENGTH.contact) })
    expect(Object.keys(errors).sort()).toEqual(['city', 'contact', 'name'])
  })

  it('treats whitespace-only fields as missing', () => {
    expect(validateFreelancer({ ...valid, name: '   ', contact: '  ' }).errors).toHaveProperty('name')
  })
})

describe('createFreelancer', () => {
  it('trims fields, marks it as not a sample, and omits empty optional links', () => {
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

  it('joins city and country into one location', () => {
    expect(createFreelancer({ ...valid, city: ' Hanoi ', country: 'Vietnam' }).location).toBe('Hanoi, Vietnam')
    expect(createFreelancer({ ...valid, country: 'Vietnam' }).location).toBe('Vietnam')
  })
})
