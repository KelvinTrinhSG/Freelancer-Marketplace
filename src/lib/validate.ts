import type { Freelancer } from '../types'

export type FreelancerInput = {
  name: string
  city: string
  country: string
  skills: string[]
  imageUrl: string
  videoUrl: string
  portfolioUrl: string
  contact: string
}

export type FieldErrors = Partial<Record<keyof FreelancerInput, string>>

export const emptyInput: FreelancerInput = {
  name: '',
  city: '',
  country: '',
  skills: [],
  imageUrl: '',
  videoUrl: '',
  portfolioUrl: '',
  contact: '',
}

export const MAX_LENGTH = { name: 60, city: 60, contact: 300, skill: 40, url: 500 } as const

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|avif)$/i
const VIDEO_HOSTS = ['youtube.com', 'youtu.be', 'tiktok.com']

function parseHttpUrl(value: string): URL | null {
  const raw = value.trim()
  if (!raw || /\s/.test(raw)) return null
  try {
    const url = new URL(raw)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    // Needs a real public host: "http:foo", "http://abc" and "http://localhost" are rejected.
    if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(url.hostname)) return null
    if (!raw.toLowerCase().startsWith(`${url.protocol}//`)) return null
    return url
  } catch {
    return null
  }
}

export function isHttpUrl(value: string): boolean {
  return parseHttpUrl(value) !== null
}

/** A YouTube or TikTok link, including subdomains like www., m. and vm. */
export function isVideoUrl(value: string): boolean {
  const url = parseHttpUrl(value)
  if (!url) return false
  const host = url.hostname.toLowerCase()
  return VIDEO_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
}

/** The link path ends in a common image extension. */
export function looksLikeImageUrl(value: string): boolean {
  const url = parseHttpUrl(value)
  return url !== null && IMAGE_EXTENSIONS.test(url.pathname)
}

const URL_ERROR = 'Use a full web link, like https://example.com/…'

/**
 * Required: name, at least one skill, image link, contact. Links must be real http(s) web addresses.
 * `imageLoads` comes from the form's live preview: an image link counts if it ends in an image
 * extension or the browser actually loaded it.
 */
export function validateFreelancer(
  input: FreelancerInput,
  { imageLoads }: { imageLoads?: boolean } = {},
): { ok: boolean; errors: FieldErrors } {
  const errors: FieldErrors = {}
  const name = input.name.trim()
  if (!name) errors.name = 'Add your display name.'
  else if (name.length > MAX_LENGTH.name) errors.name = `Keep it under ${MAX_LENGTH.name} characters.`

  if (input.city.trim().length > MAX_LENGTH.city) errors.city = `Keep it under ${MAX_LENGTH.city} characters.`

  if (input.skills.length === 0) errors.skills = 'Pick or type at least one skill.'

  const image = input.imageUrl.trim()
  if (!image) errors.imageUrl = 'Paste a link to your best project image.'
  else if (!isHttpUrl(image)) errors.imageUrl = URL_ERROR
  else if (imageLoads === false) errors.imageUrl = "We couldn't load this image. Check that the link opens the image itself."
  else if (imageLoads === undefined && !looksLikeImageUrl(image))
    errors.imageUrl = 'This doesn’t look like an image link. It should end in .jpg, .png, .webp or .gif.'

  const video = input.videoUrl.trim()
  if (video && !isVideoUrl(video)) errors.videoUrl = 'Use a YouTube or TikTok link.'

  const portfolio = input.portfolioUrl.trim()
  if (portfolio && !isHttpUrl(portfolio)) errors.portfolioUrl = URL_ERROR

  const contact = input.contact.trim()
  if (!contact) errors.contact = 'Tell clients how to reach you.'
  else if (contact.length > MAX_LENGTH.contact) errors.contact = `Keep it under ${MAX_LENGTH.contact} characters.`

  return { ok: Object.keys(errors).length === 0, errors }
}

export function formatLocation(city: string, country: string): string {
  return [city.trim(), country.trim()].filter(Boolean).join(', ')
}

export function createFreelancer(input: FreelancerInput, id: string = crypto.randomUUID(), now = new Date()): Freelancer {
  const video = input.videoUrl.trim()
  const portfolio = input.portfolioUrl.trim()
  return {
    id,
    name: input.name.trim(),
    location: formatLocation(input.city, input.country),
    skills: input.skills,
    ...(video ? { videoUrl: video } : {}),
    ...(portfolio ? { portfolioUrl: portfolio } : {}),
    imageUrl: input.imageUrl.trim(),
    contact: input.contact.trim(),
    isSample: false,
    createdAt: now.toISOString(),
  }
}
