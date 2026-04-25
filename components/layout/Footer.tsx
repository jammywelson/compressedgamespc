'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const FCATS = ['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Sci-Fi','Survival','Puzzle','Old Games']

const FDEFS: Record<string,any> = {
  footerBg: '#1a1f3c', footerText: '\u00a9 2026 CompressedGamesPC.com',
  footerAbout: 'Your #1 source for highly compressed PC games. Free direct download links, no surveys.',
  siteName: 'CompressedGamesPC', accentColor: '#4f46e5',
  socialFacebook: '', socialTelegram: '', socialYoutube: '', socialDiscord: '',
  showAbout: true, showContact: true, showPrivacy: true,
  showDisclaimer: true, showDmca: true, showTerms: true,
  footerShowBrand: true, footerShowCats1: true, footerShowCats2: true,
  footerShowLinks: true, footerShowCopyright: true, footerShowSocial: true,
}

export default function Footer() {
  const [fcfg, setFcfg] = useState<Record<string,any>>(FDEFS)

  useEffect(() => {
    fetch('/api/settings?key=appearance&t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => { if (d && typeof d === 'object') setFcfg(p => ({ ...p, ...d })) })
      .catch(() => {})
  }, [])

  const pages: [string, string, boolean][] = [
    ['/about', 'About Us', !!fcfg.showAbout],
    ['/contact', 'Contact', !!fcfg.showContact],
    ['/privacy', 'Privacy Policy', !!fcfg.showPrivacy],
    ['/disclaimer', 'Disclaimer', !!fcfg.showDisclaimer],
    ['/dmca', 'DMCA', !!fcfg.showDmca],
    ['/terms', 'Terms of Service', !!fcfg.showTerms],
  ]

  const lnk: any = { color: '#94a3b8', textDecoration: 'none', fontSize: '13px', display: 'block', marginBottom: '8px', transition: 'color .2s' }
  const colHead: any = { color: '#e2e8f0', fontWeight: 700, fontSize: '14px', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,.1)' }

  return (
    <footer style={{ background: fcfg.footerBg || '#1a1f3c', padding: '48px 24px 24px', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '40px' }}>

          {fcfg.footerShowBrand && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px' }}>CGP</div>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{fcfg.siteName}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7, margin: '0 0 16px' }}>{fcfg.footerAbout}</p>
              {fcfg.footerShowSocial && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as any }}>
                  {fcfg.socialFacebook && <a href={fcfg.socialFacebook} target='_blank' rel='noopener' style={{ color: '#94a3b8', fontSize: '12px', background: 'rgba(255,255,255,.08)', padding: '5px 10px', borderRadius: '6px', textDecoration: 'none' }}>Facebook</a>}
                  {fcfg.socialTelegram && <a href={fcfg.socialTelegram} target='_blank' rel='noopener' style={{ color: '#94a3b8', fontSize: '12px', background: 'rgba(255,255,255,.08)', padding: '5px 10px', borderRadius: '6px', textDecoration: 'none' }}>Telegram</a>}
                  {fcfg.socialYoutube && <a href={fcfg.socialYoutube} target='_blank' rel='noopener' style={{ color: '#94a3b8', fontSize: '12px', background: 'rgba(255,255,255,.08)', padding: '5px 10px', borderRadius: '6px', textDecoration: 'none' }}>YouTube</a>}
                  {fcfg.socialDiscord && <a href={fcfg.socialDiscord} target='_blank' rel='noopener' style={{ color: '#94a3b8', fontSize: '12px', background: 'rgba(255,255,255,.08)', padding: '5px 10px', borderRadius: '6px', textDecoration: 'none' }}>Discord</a>}
                </div>
              )}
            </div>
          )}

          {fcfg.footerShowCats1 && (
            <div>
              <div style={colHead}>Games</div>
              {FCATS.slice(0,6).map(c => <Link key={c} href={'/games?category='+encodeURIComponent(c)} style={lnk}>{c}</Link>)}
            </div>
          )}

          {fcfg.footerShowCats2 && (
            <div>
              <div style={colHead}>More Games</div>
              {FCATS.slice(6).map(c => <Link key={c} href={'/games?category='+encodeURIComponent(c)} style={lnk}>{c}</Link>)}
            </div>
          )}

          {fcfg.footerShowLinks && (
            <div>
              <div style={colHead}>Quick Links</div>
              <Link href='/games' style={lnk}>All Games</Link>
              <Link href='/games?status=hot' style={lnk}>Hot Games</Link>
              <Link href='/games?sort=new' style={lnk}>New Games</Link>
              {pages.filter(([,,show]) => show).map(([href,label]) => (
                <Link key={href} href={href} style={lnk}>{label}</Link>
              ))}
            </div>
          )}

        </div>

        {fcfg.footerShowCopyright && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
            {fcfg.footerText}
          </div>
        )}
      </div>
    </footer>
  )
}