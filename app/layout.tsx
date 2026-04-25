import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 5, themeColor: '#1a1f3c',
}
export const metadata: Metadata = {
  metadataBase: new URL('https://compressedgamespc.com'),
  title: { default: 'CompressedGamesPC - Free Highly Compressed PC Games', template: '%s | CompressedGamesPC' },
  description: 'Download highly compressed PC games for free. Direct download links, no surveys.',
  keywords: ['highly compressed pc games','compressed games download','free pc games'],
  openGraph: { type:'website', siteName:'CompressedGamesPC', url:'https://compressedgamespc.com' },
  robots: { index:true, follow:true },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin:0, minHeight:'100vh', display:'flex', flexDirection:'column' }}>
        <Navbar />
        <main style={{ flex:1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}