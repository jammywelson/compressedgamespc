import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE = 'https://compressedgamespc.com'
const CATS = ['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games','Action RPG']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let games: any[] = []
  try {
    games = await prisma.game.findMany({
      where: { status: { not: 'draft' } },
      select: { slug: true, updatedAt: true },
    })
  } catch(e) {}

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                      lastModified: new Date(), changeFrequency:'daily',   priority:1.0 },
    { url: `${BASE}/games`,           lastModified: new Date(), changeFrequency:'daily',   priority:0.9 },
    { url: `${BASE}/games?status=hot`,lastModified: new Date(), changeFrequency:'daily',   priority:0.8 },
    { url: `${BASE}/about`,           lastModified: new Date(), changeFrequency:'monthly', priority:0.5 },
    { url: `${BASE}/contact`,         lastModified: new Date(), changeFrequency:'monthly', priority:0.4 },
    { url: `${BASE}/privacy-policy`,  lastModified: new Date(), changeFrequency:'yearly',  priority:0.3 },
    { url: `${BASE}/disclaimer`,      lastModified: new Date(), changeFrequency:'yearly',  priority:0.3 },
    { url: `${BASE}/dmca`,            lastModified: new Date(), changeFrequency:'yearly',  priority:0.3 },
    { url: `${BASE}/terms`,           lastModified: new Date(), changeFrequency:'yearly',  priority:0.3 },
  ]

  const catPages: MetadataRoute.Sitemap = CATS.map(cat => ({
    url: `${BASE}/games?category=${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const gamePages: MetadataRoute.Sitemap = games.map(g => ({
    url: `${BASE}/games/${g.slug}`,
    lastModified: g.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...catPages, ...gamePages]
}
