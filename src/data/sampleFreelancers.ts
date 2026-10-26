import type { Freelancer } from '../types'

// SAMPLE DATA: fictional profiles so the deck is never empty on first use.
// public/samples/work-<n>.jpg is the work sample for each profile's first skill; <n>.jpg is the portrait,
// and names are matched to each portrait. Every starter skill has at least 2 profiles.
type SampleSeed = [id: string, name: string, location: string, skills: string[], photo: number, videoUrl?: string]

const seeds: SampleSeed[] = [
  ['s-01', 'Lucas Silva', 'São Paulo, Brazil', ['Voice-over', 'Music & sound effects'], 1, yt('rVLJrEeu0wE')],
  ['s-02', 'Marco Rossi', 'Milan, Italy', ['Logo design', 'Illustration'], 2, yt('DNvUqVxt54c')],
  ['s-03', 'Daniel Okafor', 'Lagos, Nigeria', ['Illustration', 'Landing page design'], 3, yt('E422ZDnk7oo')],
  ['s-04', 'Sofia Reyes', 'Mexico City, Mexico', ['Subtitles & translation', 'Social media content'], 4, yt('5Y3Em-IMSwM')],
  ['s-05', 'Emma Lindqvist', 'Stockholm, Sweden', ['Social media content', 'Short video editing'], 5, yt('CpVdN-gw-oc')],
  ['s-06', 'Alex Novak', 'Prague, Czechia', ['Short video editing', 'Music & sound effects'], 6, yt('RPn6hLMpa9E')],
  ['s-07', 'Tom Becker', 'Berlin, Germany', ['Game testing', 'Short video editing'], 7, yt('F9m20xu6q4s')],
  ['s-08', 'Henrik Larsen', 'Copenhagen, Denmark', ['Photo editing', 'Landing page design'], 8, yt('Vd_Gbcndo5E')],
  ['s-09', 'Mateo Alvarez', 'Buenos Aires, Argentina', ['Photo editing', 'Logo design'], 9, yt('-9QODH_7m7E')],
  ['s-10', 'Ana Popescu', 'Bucharest, Romania', ['Game testing', 'Subtitles & translation', 'Voice-over'], 10, yt('oBipFAVwTWs')],
]

function yt(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export const SAMPLE_FREELANCERS: Freelancer[] = seeds.map(([id, name, location, skills, photo, videoUrl]) => {
  const handle = name.toLowerCase().replace(/\s+/g, '.')
  return {
    id,
    name,
    location,
    skills,
    ...(videoUrl ? { videoUrl } : {}),
    imageUrl: `${import.meta.env.BASE_URL}samples/work-${photo}.jpg`,
    avatarUrl: `${import.meta.env.BASE_URL}samples/${photo}.jpg`,
    contact: `Email: ${handle}@example.com\nTelegram: @${handle.replace('.', '_')}`,
    isSample: true,
    createdAt: '2026-10-01T00:00:00.000Z',
  }
})
