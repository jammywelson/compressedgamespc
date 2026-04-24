'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const CATS = ['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Sci-Fi','Survival','Puzzle','Old Games']

const DEFAULTS = {
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
  const [cfg, setCfg] = useState(DEFAULTS)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cgpc_appearance')
      if (saved) setCfg({ ...DEFAULTS, ...JSON.parse(saved) })
    } catch(e) {}
  }, [])

  const pages = [
    { label:'About Us',       href:'/about',         show: cfg.showAbout      },
    { label:'Contact Us',     href:'/contact',        show: cfg.showContact    },
    { label:'Privacy Policy', href:'/privacy-policy', show: cfg.showPrivacy    },
    { label:'Disclaimer',     href:'/disclaimer',     show: cfg.showDisclaimer },
    { label:'DMCA',           href:'/dmca',           show: cfg.showDmca       },
    { label:'Terms of Use',   href:'/terms',          show: cfg.showTerms      },
  ].filter(p => p.show)

  const socials = [
    { label:'Facebook', href: cfg.socialFacebook },
    { label:'Telegram', href: cfg.socialTelegram },
    { label:'YouTube',  href: cfg.socialYoutube  },
    { label:'Discord',  href: cfg.socialDiscord  },
  ].filter(s => s.href)

  return (
    <div style={{ background: cfg.footerBg, color:'rgba(255,255,255,.8)', marginTop:'40px' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px 16px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'24px', marginBottom:'24px' }}>

          {/* Brand */}
          {cfg.footerShowBrand && (
            <div style={{ gridColumn:'span 2' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontSize:'11px', fontWeight:700, padding:'2px 6px', borderRadius:'4px' }}>CGP</div>
                <span style={{ fontSize:'16px', fontWeight:700, color:'#fff' }}>{cfg.siteName}</span>
              </div>
              <p style={{ fontSize:'12px', color:'rgba(255,255,255,.45)', lineHeight:1.7, marginBottom:'12px', maxWidth:'260px' }}>
                {cfg.footerAbout}
              </p>
              {cfg.footerShowSocial && (
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' as any }}>
                  {socials.length > 0 ? socials.map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      style={{ background:'rgba(255,255,255,.08)', borderRadius:'4px', padding:'4px 10px', fontSize:'11px', color:'rgba(255,255,255,.55)' }}>
                      {s.label}
                    </a>
                  )) : ['Facebook','Telegram','YouTube','Discord'].map(s => (
                    <span key={s} style={{ background:'rgba(255,255,255,.08)', borderRadius:'4px', padding:'4px 10px', fontSize:'11px', color:'rgba(255,255,255,.35)' }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Categories 1 */}
          {cfg.footerShowCats1 && (
            <div>
              <div style={{ fontSize:'12px', fontWeight:700, color:'#fff', marginBottom:'10px', textTransform:'uppercase' as any, letterSpacing:'.5px' }}>Categories</div>
              <div style={{ display:'flex', flexDirection:'column' as any, gap:'6px' }}>
                {CATS.slice(0,6).map(c => (
                  <Link key={c} href={`/games?category=${encodeURIComponent(c)}`} style={{ fontSize:'12px', color:'rgba(255,255,255,.4)' }}>{c}</Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories 2 */}
          {cfg.footerShowCats2 && (
            <div>
              <div style={{ fontSize:'12px', fontWeight:700, color:'#fff', marginBottom:'10px', textTransform:'uppercase' as any, letterSpacing:'.5px' }}>More</div>
              <div style={{ display:'flex', flexDirection:'column' as any, gap:'6px' }}>
                {CATS.slice(6).map(c => (
                  <Link key={c} href={`/games?category=${encodeURIComponent(c)}`} style={{ fontSize:'12px', color:'rgba(255,255,255,.4)' }}>{c}</Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          {cfg.footerShowLinks && (
            <div>
              <div style={{ fontSize:'12px', fontWeight:700, color:'#fff', marginBottom:'10px', textTransform:'uppercase' as any, letterSpacing:'.5px' }}>Quick Links</div>
              <div style={{ display:'flex', flexDirection:'column' as any, gap:'6px' }}>
                <Link href="/"                 style={{ fontSize:'12px', color:'rgba(255,255,255,.4)' }}>Home</Link>
                <Link href="/games"            style={{ fontSize:'12px', color:'rgba(255,255,255,.4)' }}>All Games</Link>
                <Link href="/games?status=hot" style={{ fontSize:'12px', color:'rgba(255,255,255,.4)' }}>Hot Games</Link>
                {pages.map(p => (
                  <Link key={p.href} href={p.href} style={{ fontSize:'12px', color:'rgba(255,255,255,.4)' }}>{p.label}</Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        {cfg.footerShowCopyright && (
          <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:'16px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap' as any, gap:'8px' }}>
            <span style={{ fontSize:'11px', color:'rgba(255,255,255,.25)' }}>{cfg.footerText}</span>
            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' as any }}>
              {pages.slice(0,4).map(p => (
                <Link key={p.href} href={p.href} style={{ fontSize:'11px', color:'rgba(255,255,255,.25)' }}>{p.label}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
