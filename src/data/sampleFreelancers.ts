import type { Freelancer } from '../types'

// SAMPLE DATA: fictional profiles so the deck is never empty on first use.
// Images are seeded placeholder photos; video links are search pages, not real portfolios.
type SampleSeed = [id: string, name: string, location: string, skills: string[], video: 'yt' | 'tt']

const seeds: SampleSeed[] = [
  ['s-01', 'Linh Nguyen', 'Ho Chi Minh City, VN', ['Short video editing', 'Social media content'], 'tt'],
  ['s-02', 'Minh Tran', 'Hanoi, VN', ['Short video editing', 'Photo editing'], 'yt'],
  ['s-03', 'Arjun Mehta', 'Bangalore, IN', ['Game testing'], 'yt'],
  ['s-04', 'Sofia Reyes', 'Manila, PH', ['Game testing', 'Subtitles & translation'], 'yt'],
  ['s-05', 'Huy Pham', 'Da Nang, VN', ['Logo design', 'Illustration'], 'yt'],
  ['s-06', 'Emma Lindqvist', 'Stockholm, SE', ['Logo design', 'Landing page design'], 'yt'],
  ['s-07', 'Kenji Sato', 'Osaka, JP', ['Social media content', 'Short video editing'], 'tt'],
  ['s-08', 'Thao Le', 'Can Tho, VN', ['Voice-over', 'Subtitles & translation'], 'yt'],
  ['s-09', 'Lucas Silva', 'São Paulo, BR', ['Voice-over', 'Music & sound effects'], 'yt'],
  ['s-10', 'Mai Vo', 'Hue, VN', ['Subtitles & translation', 'Social media content'], 'tt'],
  ['s-11', 'Ana Popescu', 'Bucharest, RO', ['Illustration', 'Photo editing'], 'yt'],
  ['s-12', 'Tuan Do', 'Hai Phong, VN', ['Photo editing', 'Logo design'], 'yt'],
  ['s-13', 'Priya Nair', 'Kochi, IN', ['Landing page design', 'Illustration'], 'yt'],
  ['s-14', 'Daniel Okafor', 'Lagos, NG', ['Landing page design', 'Game testing'], 'yt'],
  ['s-15', 'Bao Hoang', 'Ho Chi Minh City, VN', ['Music & sound effects', 'Voice-over'], 'tt'],
]

function videoLink(kind: 'yt' | 'tt', skill: string): string {
  const q = encodeURIComponent(`${skill} portfolio`)
  return kind === 'tt'
    ? `https://www.tiktok.com/search?q=${q}`
    : `https://www.youtube.com/results?search_query=${q}`
}

export const SAMPLE_FREELANCERS: Freelancer[] = seeds.map(([id, name, location, skills, video]) => {
  const handle = name.toLowerCase().replace(/\s+/g, '.')
  return {
    id,
    name,
    location,
    skills,
    videoUrl: videoLink(video, skills[0]),
    imageUrl: `https://picsum.photos/seed/freelancer-${id}/800/1000`,
    contact: `Email: ${handle}@example.com\nTelegram: @${handle.replace('.', '_')}`,
    isSample: true,
    createdAt: '2026-10-01T00:00:00.000Z',
  }
})
