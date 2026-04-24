'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATS = ['All','Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games']

const DEFAULTS = {
  navBg: '#1a1f3c',
  navbarHeight: '52',
  searchPosition: 'left',
  searchWidth: '360',
  showCatsBar: true,
  showSearchBar: true,
  showAnnouncement: true,
  showHotButton: true,
  announcementText: '🎮 All games are highly compressed — Save your bandwidth!',
  announcementBg: '#4f46e5',
}

export default function Navbar() {
  const router = useRouter()
  const [activeCat, setActiveCat] = useState('All')
  const [cfg, setCfg] = useState(DEFAULTS)
  const [query, setQuery] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cgpc_appearance')
      if (saved) setCfg({ ...DEFAULTS, ...JSON.parse(saved) })
    } catch(e) {}
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/games?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <>
      {cfg.showAnnouncement && (
        <div style={{ background: cfg.announcementBg, textAlign:'center' as any, padding:'6px 16px', fontSize:'12px', color:'#fff', fontWeight:500 }}>
          {cfg.announcementText}
        </div>
      )}

      <nav style={{ background: cfg.navBg, padding:'0 12px', display:'flex', alignItems:'center', gap:'8px', height:'52px', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 8px rgba(0,0,0,.3)' }}>
        
        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'5px', flexShrink:0, textDecoration:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 5px', borderRadius:'3px', flexShrink:0 }}>CGP</div>
          <span style={{ fontSize:'15px', fontWeight:700, color:'#fff', whiteSpace:'nowrap' as any }}>
            Compressed<span style={{ color:'#818cf8' }}>Games</span>PC
          </span>
        </Link>

        {/* Search - flex grow */}
        {cfg.showSearchBar && (
          <form onSubmit={handleSearch} style={{ flex:1, position:'relative', minWidth:0 }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search games..."
              style={{ width:'100%', background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', borderRadius:'8px', padding:'7px 32px 7px 10px', color:'#fff', fontSize:'13px', outline:'none', fontFamily:'inherit' }}
            />
            <button type="submit" style={{ position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.6)', fontSize:'15px', padding:0 }}>⌕</button>
          </form>
        )}

        {/* Hot button */}
        {cfg.showHotButton && (
          <Link href="/games?status=hot" style={{ background:'#e53935', color:'#fff', borderRadius:'6px', padding:'6px 10px', fontSize:'12px', fontWeight:600, whiteSpace:'nowrap' as any, flexShrink:0, textDecoration:'none' }}>🔥 Hot</Link>
        )}
      </nav>

      {/* Categories */}
      {cfg.showCatsBar && (
        <div style={{ background:'#252b4a', padding:'0 8px', display:'flex', overflowX:'auto' as any }}>
          <style>{`.cgpc-cats::-webkit-scrollbar{display:none}`}</style>
          <div className="cgpc-cats" style={{ display:'flex', overflowX:'auto' as any, scrollbarWidth:'none' as any }}>
            {CATS.map(cat => (
              <Link key={cat} href={cat==='All'?'/games':`/games?category=${encodeURIComponent(cat)}`}
                onClick={() => setActiveCat(cat)}
                style={{ padding:'9px 11px', fontSize:'12px', fontWeight:500, whiteSpace:'nowrap' as any, color:activeCat===cat?'#818cf8':'rgba(255,255,255,.55)', borderBottom:`2px solid ${activeCat===cat?'#818cf8':'transparent'}`, flexShrink:0, display:'block', textDecoration:'none' }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
