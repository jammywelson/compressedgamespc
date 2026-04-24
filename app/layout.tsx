import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a1f3c',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://compressedgamespc.com'),
  title: {
    default: 'CompressedGamesPC - Free Highly Compressed PC Games',
    template: '%s | CompressedGamesPC',
  },
  description: 'Download highly compressed PC games for free. Direct download links, no surveys.',
  keywords: ['highly compressed pc games','compressed games download','free pc games'],
  openGraph: {
    type: 'website',
    siteName: 'CompressedGamesPC',
    url: 'https://compressedgamespc.com',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
