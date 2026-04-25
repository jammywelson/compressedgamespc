'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const CATS = ['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Sci-Fi','Survival','Puzzle','Old Games']

const DEFAULTS: Record<string,any> = {
  footerBg: '#1a1f3c',
  footerText: '© 2026 CompressedGamesPC.com',
  footerAbout: 'Your #1 source for highly compressed PC games. Free direct download links, no surveys.',
  siteName: 'CompressedGamesPC',
  socialFacebook: '', socialTelegram: '', socialYoutube: '', socialDiscord: '',
  showAbout: true, showContact: true, showPrivacy: true,
  showDisclaimer: true, showDmca: true, showTerms: true,
  footerShowBrand: true, footerShowCats1: true, footerShowCats2: true,
  footerShowLinks: true, footerShowCopyright: true, footerShowSocial: true,
}

export default function Footer() {
  const [cfg, setCfg] = useState<Record<string,any>>(DEFAULTS)

  useEffect(() => {
    fetch('/api/settings?key=appearance', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => { if (d && typeof d === 'object') setCfg(p => ({ ...p, ...d })) })
      .catch(() => {})
  }, [])

  const pages: [string, string, boolean][] = [
    ['/about', 'About Us', cfg.showAbout],
    ['/contact', 'Contact', cfg.showContact],
    ['/privacy', 'Privacy Policy', cfg.showPrivacy],
    ['/disclaimer', 'Disclaimer', cfg.showDisclaimer],
    ['/dmca', 'DMCA', cfg.showDmca],
    ['/terms', 'Terms of Service', cfg.showTerms],
  ]

  const cats1 = CATS.slice(0, 6)
  const cats2 = CATS.slice(6)

  const colStyle: any = { minWidth: '150px' }
  const headStyle: any = { color: '#fff', fontWeight: 700, fontSize: '15px', marginBottom: '14px' }
  const linkStyle: any = { color: '#94a3b8', textDecoration: 'none', fontSize: '13px', display: 'block', marginBottom: '8px', transition: 'color .2s' }

  return (
    <footer style={{ background: cfg.footerBg, padding: '40px 20px 20px', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' as any, marginBottom: '32px' }}>

          {cfg.footerShowBrand && (
            <div style={{ ...colStyle, flex: '1.5', minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>CGP</div>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>{cfg.siteName}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 16px' }}>{cfg.footerAbout}</p>
              {cfg.footerShowSocial && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as any }}>
                  {cfg.socialFacebook && <a href={cfg.socialFacebook} target="_blank" rel="noopener" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', background: 'rgba(255,255,255,.1)', padding: '6px 10px', borderRadius: '6px' }}>Facebook</a>}
                  {cfg.socialTelegram && <a href={cfg.socialTelegram} target="_blank" rel="noopener" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', background: 'rgba(255,255,255,.1)', padding: '6px 10px', borderRadius: '6px' }}>Telegram</a>}
                  {cfg.socialYoutube && <a href={cfg.socialYoutube} target="_blank" rel="noopener" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', background: 'rgba(255,255,255,.1)', padding: '6px 10px', borderRadius: '6px' }}>YouTube</a>}
                  {cfg.socialDiscord && <a href={cfg.socialDiscord} target="_blank" rel="noopener" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', background: 'rgba(255,255,255,.1)', padding: '6px 10px', borderRadius: '6px' }}>Discord</a>}
                </div>
              )}
            </div>
          )}

          {cfg.footerShowCats1 && (
            <div style={colStyle}>
              <div style={headStyle}>Games</div>
              {cats1.map(c => (
                <Link key={c} href={'/games?category=' + encodeURIComponent(c)} style={linkStyle}>{c}</Link>
              ))}
            </div>
          )}

          {cfg.footerShowCats2 && (
            <div style={colStyle}>
              <div style={headStyle}>More Games</div>
              {cats2.map(c => (
                <Link key={c} href={'/games?category=' + encodeURIComponent(c)} style={linkStyle}>{c}</Link>
              ))}
            </div>
          )}

          {cfg.footerShowLinks && (
            <div style={colStyle}>
              <div style={headStyle}>Quick Links</div>
              <Link href="/games" style={linkStyle}>All Games</Link>
              <Link href="/games?status=hot" style={linkStyle}>Hot Games</Link>
              <Link href="/games?status=new" style={linkStyle}>New Games</Link>
              {pages.filter(([,, show]) => show).map(([href, label]) => (
                <Link key={href} href={href} style={linkStyle}>{label}</Link>
              ))}
            </div>
          )}

        </div>

        {cfg.footerShowCopyright && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
            {cfg.footerText}
          </div>
        )}
      </div>
    </footer>
  )
}