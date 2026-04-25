'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATS = ['All','Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games']

const DEFAULTS: Record<string,any> = {
  navBg: '#1a1f3c', navbarHeight: '52', searchWidth: '360', searchPosition: 'left',
  showCatsBar: true, showSearchBar: true, showAnnouncement: true, showHotButton: true,
  announcementText: '\ud83c\udfae All games are highly compressed \u2014 Save your bandwidth!',
  announcementBg: '#4f46e5', hotLabel: 'HOT',
}

export default function NavbarClient({ initialSettings = {} }: { initialSettings?: Record<string,any> }) {
  const router = useRouter()
  const [cfg, setCfg] = useState<Record<string,any>>({ ...DEFAULTS, ...initialSettings })
  const [q, setQ] = useState('')
  const [activeCat, setActiveCat] = useState('All')

  useEffect(() => {
    fetch('/api/settings?key=appearance', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => { if (d && typeof d === 'object') setCfg({ ...DEFAULTS, ...d }) })
      .catch(() => {})
  }, [])

  const doSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) router.push('/games?search=' + encodeURIComponent(q.trim()))
  }

  return (
    <>
      {cfg.showAnnouncement && (
        <div style={{ background: cfg.announcementBg, color: '#fff', textAlign: 'center', padding: '6px 12px', fontSize: '13px', fontWeight: 500 }}>
          {cfg.announcementText}
        </div>
      )}
      <nav style={{ background: cfg.navBg, padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', height: cfg.navbarHeight + 'px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,.3)' }}>
        <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>CGP</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px', whiteSpace: 'nowrap' }}>
            <span>Compressed</span><span style={{ color: '#818cf8' }}>Games</span><span>PC</span>
          </span>
        </Link>
        {cfg.showSearchBar && (
          <form onSubmit={doSearch} style={{ flex: 1, position: 'relative', minWidth: 0 }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder='Search games...'
              style={{ width: '100%', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', borderRadius: '8px', height: '36px', padding: '0 32px 0 10px', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            <button type='submit' style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.6)', fontSize: '15px', padding: 0 }}>\u2315</button>
          </form>
        )}
        {cfg.showHotButton && (
          <Link href='/games?status=hot' style={{ background: '#e53935', color: '#fff', borderRadius: '6px', padding: '6px 10px', fontWeight: 700, fontSize: '12px', textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
            \ud83d\udd25 {cfg.hotLabel}
          </Link>
        )}
      </nav>
      {cfg.showCatsBar && (
        <div style={{ background: '#252b4a', padding: '0 8px' }}>
          <style>{'.cgpc-cats::-webkit-scrollbar{display:none}'}</style>
          <div className='cgpc-cats' style={{ display: 'flex', overflowX: 'auto' as any, scrollbarWidth: 'none' as any }}>
            {CATS.map(cat => (
              <Link key={cat} href={cat==='All'?'/games':'/games?category='+encodeURIComponent(cat)}
                onClick={() => setActiveCat(cat)}
                style={{ padding: '9px 11px', fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap', color: activeCat===cat?'#818cf8':'#94a3b8', textDecoration: 'none', borderBottom: activeCat===cat?'2px solid #818cf8':'2px solid transparent', flexShrink: 0 }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}