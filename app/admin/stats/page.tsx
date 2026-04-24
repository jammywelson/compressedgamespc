'use client'
import { useState, useEffect } from 'react'

export default function SiteStatsPage() {
  const [stats, setStats] = useState({
    totalGames: 0, totalDownloads: 0, hotGames: 0,
    activeGames: 0, draftGames: 0, featuredGames: 0,
    topGames: [] as any[],
    categories: [] as any[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/games')
      .then(r => r.json())
      .then((games: any[]) => {
        if (!Array.isArray(games)) { setLoading(false); return }
        const cats: Record<string,number> = {}
        games.forEach(g => { cats[g.category] = (cats[g.category]||0)+1 })
        setStats({
          totalGames:     games.length,
          totalDownloads: games.reduce((s,g)=>s+(g.downloadCount||0),0),
          hotGames:       games.filter(g=>g.status==='hot').length,
          activeGames:    games.filter(g=>g.status==='active').length,
          draftGames:     games.filter(g=>g.status==='draft').length,
          featuredGames:  games.filter(g=>g.featured).length,
          topGames:       [...games].sort((a,b)=>(b.downloadCount||0)-(a.downloadCount||0)).slice(0,10),
          categories:     Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([name,count])=>({name,count})),
        })
        setLoading(false)
      })
      .catch(()=>setLoading(false))
  }, [])

  const cards = [
    { label:'Total Games',    val:stats.totalGames,     color:'#4f46e5', bg:'#eef2ff', icon:'🎮' },
    { label:'Total Downloads',val:stats.totalDownloads, color:'#16a34a', bg:'#f0fdf4', icon:'⬇️' },
    { label:'Hot Games 🔥',   val:stats.hotGames,       color:'#e53935', bg:'#fef2f2', icon:'🔥' },
    { label:'Active Games',   val:stats.activeGames,    color:'#0891b2', bg:'#ecfeff', icon:'✅' },
    { label:'Featured',       val:stats.featuredGames,  color:'#f59e0b', bg:'#fffbeb', icon:'⭐' },
    { label:'Draft',          val:stats.draftGames,     color:'#6b7280', bg:'#f9fafb', icon:'📝' },
  ]

  return (
    <div style={{ background:'#f0f2f8', minHeight:'100vh' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', height:'54px', display:'flex', alignItems:'center', boxShadow:'0 1px 3px rgba(0,0,0,.06)' }}>
        <span style={{ fontFamily:'system-ui', fontSize:'18px', fontWeight:700, color:'#111827' }}>Site Stats</span>
        {!loading && <span style={{ marginLeft:'12px', fontSize:'12px', color:'#16a34a', fontWeight:500 }}>● Live Data</span>}
      </div>

      <div style={{ padding:'24px' }}>
        {loading ? (
          <div style={{ textAlign:'center' as any, padding:'60px', color:'#6b7280' }}>Loading stats...</div>
        ) : (<>
          {/* Stats cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'12px', marginBottom:'20px' }}>
            {cards.map(c => (
              <div key={c.label} style={{ background:c.bg, border:`1px solid ${c.color}22`, borderRadius:'10px', padding:'16px' }}>
                <div style={{ fontSize:'28px', marginBottom:'6px' }}>{c.icon}</div>
                <div style={{ fontSize:'26px', fontWeight:700, color:c.color }}>{c.val.toLocaleString()}</div>
                <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'2px' }}>{c.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            {/* Top Downloads */}
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #f3f4f6', fontFamily:'system-ui', fontSize:'15px', fontWeight:700, color:'#111827' }}>
                🏆 Top Downloads
              </div>
              {stats.topGames.length === 0 ? (
                <div style={{ padding:'30px', textAlign:'center' as any, color:'#9ca3af', fontSize:'13px' }}>Games add karo pehle</div>
              ) : (
                <div>
                  {stats.topGames.map((g,i) => (
                    <div key={g.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', borderBottom:'1px solid #f9fafb' }}>
                      <span style={{ fontSize:'16px', fontWeight:700, color:['#f59e0b','#94a3b8','#b45310'][i]||'#9ca3af', minWidth:'20px', textAlign:'center' as any }}>{i+1}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:'13px', fontWeight:600, color:'#111827', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as any }}>{g.title}</div>
                        <div style={{ fontSize:'11px', color:'#6b7280' }}>{g.category}</div>
                      </div>
                      <span style={{ fontSize:'12px', color:'#4f46e5', fontWeight:600 }}>{(g.downloadCount||0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Categories */}
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #f3f4f6', fontFamily:'system-ui', fontSize:'15px', fontWeight:700, color:'#111827' }}>
                📂 Games by Category
              </div>
              {stats.categories.length === 0 ? (
                <div style={{ padding:'30px', textAlign:'center' as any, color:'#9ca3af', fontSize:'13px' }}>Games add karo pehle</div>
              ) : (
                <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column' as any, gap:'8px' }}>
                  {stats.categories.map(c => {
                    const pct = Math.round((c.count / stats.totalGames) * 100)
                    return (
                      <div key={c.name}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                          <span style={{ fontSize:'12px', color:'#374151', fontWeight:500 }}>{c.name}</span>
                          <span style={{ fontSize:'12px', color:'#6b7280' }}>{c.count} ({pct}%)</span>
                        </div>
                        <div style={{ height:'6px', background:'#f3f4f6', borderRadius:'3px', overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${pct}%`, background:'#4f46e5', borderRadius:'3px' }}/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>)}
      </div>
    </div>
  )
}
