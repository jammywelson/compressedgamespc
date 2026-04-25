import type { Metadata, Viewport } from 'next'
import './globals.css'
import { prisma } from '@/lib/prisma'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a1f3c',
}

async function getSeoSettings() {
  try {
    const s = await prisma.setting.findUnique({ where: { key: 'seo' } })
    return s ? JSON.parse(s.value) : {}
  } catch { return {} }
}

async function getAppearanceSettings() {
  try {
    const s = await prisma.setting.findUnique({ where: { key: 'appearance' } })
    return s ? JSON.parse(s.value) : {}
  } catch { return {} }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings()
  const app = await getAppearanceSettings()
  const siteName = app.siteName || 'CompressedGamesPC'
  const title = seo.seoTitle || siteName + ' - Free Highly Compressed PC Games'
  const desc = seo.seoDesc || 'Download highly compressed PC games for free. Direct download links, no surveys.'
  const keywords = seo.seoKeywords ? seo.seoKeywords.split(',').map((k: string) => k.trim()) : ['highly compressed pc games','compressed games download','free pc games']
  return {
    metadataBase: new URL('https://compressedgamespc.com'),
    title: { default: title, template: '%s | ' + siteName },
    description: desc,
    keywords,
    verification: seo.googleVerify ? { google: seo.googleVerify } : undefined,
    openGraph: { type: 'website', siteName, url: 'https://compressedgamespc.com', images: seo.ogImage ? [seo.ogImage] : [] },
    robots: { index: true, follow: true },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}