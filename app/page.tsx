import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'CompressedGamesPC - Free Highly Compressed PC Games Download',
  description: 'Download highly compressed PC games for free. Direct links, no surveys.',
}

export const revalidate = 60

async function getData() {
  try {
    const games = await prisma.game.findMany({
      where: { status: { not: 'draft' } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    const total = await prisma.game.count()
    const dlSum = await prisma.game.aggregate({ _sum: { downloadCount: true } })
    return { games, total, downloads: dlSum._sum.downloadCount || 0 }
  } catch(e) { return { games: [], total: 0, downloads: 0 } }
}

const GRADS = [
  'linear-gradient(135deg,#450a0a,#7f1d1d)',
  'linear-gradient(135deg,#064e3b,#065f46)',
  'linear-gradient(135deg,#0c4a6e,#075985)',
]

export default async function HomePage() {
  const { games, total, downloads } = await getData()
  const featured = games.find(g => g.featured) || games[0]
  const top = [...games].sort((a,b) => b.downloadCount - a.downloadCount).slice(0,5)

  return (
    <>
      
      <main style={{ maxWidth:'1200px', margin:'0 auto', padding:'12px 16px' }}>
        {games.length === 0 ? (
          <>
            {/* Empty state hero */}
            <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius:'12px', padding:'40px 20px', textAlign:'center' as any, marginBottom:'16px' }}>
              <h1 style={{ fontSize:'clamp(22px,5vw,40px)', fontWeight:700, color:'#fff', marginBottom:'10px', lineHeight:1.2 }}>
                Free Highly Compressed<br/>
                <span style={{ color:'#818cf8' }}>PC Games Download</span>
              </h1>
              <p style={{ color:'rgba(255,255,255,.65)', fontSize:'clamp(13px,2vw,15px)', marginBottom:'20px' }}>
                Direct download links. No surveys. Maximum compression!
              </p>
              <Link href="/games" style={{ background:'#4f46e5', color:'#fff', borderRadius:'8px', padding:'12px 28px', fontSize:'14px', fontWeight:700, display:'inline-block' }}>
                Browse All Games â
              </Link>
            </div>
            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px', marginBottom:'16px' }}>
              {[
                {val:'1000+',label:'Games',color:'#4f46e5',bg:'#eef2ff'},
                {val:'75%',label:'Avg Compression',color:'#16a34a',bg:'#f0fdf4'},
                {val:'Free',label:'Always Free',color:'#ea580c',bg:'#fff7ed'},
                {val:'0',label:'Surveys',color:'#0891b2',bg:'#ecfeff'},
              ].map(s=>(
                <div key={s.label} style={{ background:s.bg, borderRadius:'10px', padding:'14px', textAlign:'center' as any }}>
                  <div style={{ fontSize:'clamp(18px,4vw,26px)', fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:'11px', color:'#6b7280', marginTop:'2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Categories */}
            <div style={{ background:'#fff', borderRadius:'12px', padding:'16px', border:'1px solid #e5e7eb' }}>
              <h2 style={{ fontSize:'16px', fontWeight:700, color:'#111827', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px' }}>
                <div style={{ width:'4px', height:'16px', background:'#4f46e5', borderRadius:'2px' }}/>
                Browse by Category
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))', gap:'8px' }}>
                {['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games','Action RPG'].map(cat=>(
                  <Link key={cat} href={`/games?category=${encodeURIComponent(cat)}`}
                    style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'9px 6px', textAlign:'center' as any, fontSize:'11px', fontWeight:500, color:'#374151' }}>
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* HERO */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'10px', marginBottom:'16px' }}>
              {featured && (
                <Link href={`/games/${featured.slug}`}
                  style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius:'12px', padding:'24px', display:'flex', flexDirection:'column', justifyContent:'flex-end', minHeight:'180px', position:'relative', overflow:'hidden', textDecoration:'none' }}>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.8),transparent)' }}/>
                  <div style={{ position:'relative', zIndex:1 }}>
                    <div style={{ display:'flex', gap:'6px', marginBottom:'8px', flexWrap:'wrap' as any }}>
                      <span style={{ background:'#e53935', color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'4px' }}>Featured</span>
                      <span style={{ background:'rgba(79,70,229,.8)', color:'#fff', fontSize:'10px', padding:'2px 8px', borderRadius:'4px' }}>â Compressed</span>
                    </div>
                    <h1 style={{ fontSize:'clamp(18px,4vw,28px)', fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:'6px' }}>{featured.title}</h1>
                    <p style={{ color:'rgba(255,255,255,.6)', fontSize:'13px', marginBottom:'12px' }}>
                      {featured.category} Â· <span style={{ color:'#86efac', fontWeight:600 }}>{featured.size}</span>
                    </p>
                    <span style={{ background:'#4f46e5', color:'#fff', borderRadius:'8px', padding:'8px 18px', fontSize:'13px', fontWeight:700, display:'inline-block' }}>
                      â¬ Download Now
                    </span>
                  </div>
                </Link>
              )}
              {/* Side games â show on desktop only via CSS */}
              <style>{`@media(min-width:640px){.hero-grid{display:grid!important;grid-template-columns:1fr 240px!important;}.hero-side{display:flex!important;}}`}</style>
            </div>

            {/* STATS */}
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', display:'flex', overflowX:'auto' as any, marginBottom:'16px' }}>
              {[
                {val:`${total}+`,label:'Total Games',color:'#4f46e5'},
                {val:'75%',label:'Avg Compression',color:'#16a34a'},
                {val:downloads>0?`${(downloads/1000).toFixed(0)}K+`:'Free',label:downloads>0?'Downloads':'Always Free',color:'#ea580c'},
                {val:'100%',label:'No Surveys',color:'#0891b2'},
              ].map((s,i,arr)=>(
                <div key={s.label} style={{ flex:'1 1 70px', textAlign:'center' as any, padding:'12px 6px', borderRight:i<arr.length-1?'1px solid #f3f4f6':'none', minWidth:'70px' }}>
                  <div style={{ fontSize:'clamp(16px,3vw,22px)', fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:'10px', color:'#6b7280', marginTop:'1px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* NEW GAMES SCROLL */}
            <div style={{ marginBottom:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                <div style={{ width:'4px', height:'16px', background:'#4f46e5', borderRadius:'2px' }}/>
                <h2 style={{ fontSize:'16px', fontWeight:700, color:'#111827' }}>New Games</h2>
                <Link href="/games" style={{ marginLeft:'auto', fontSize:'12px', color:'#4f46e5' }}>View All â</Link>
              </div>
              <div style={{ display:'flex', gap:'8px', overflowX:'auto' as any, paddingBottom:'6px' }}>
                <style>{`.new-scroll::-webkit-scrollbar{display:none}`}</style>
                {games.slice(0,10).map(g=>(
                  <Link key={g.id} href={`/games/${g.slug}`} className="new-scroll"
                    style={{ minWidth:'100px', flexShrink:0, background:'#fff', border:'1px solid #e5e7eb', borderRadius:'8px', overflow:'hidden', textDecoration:'none' }}>
                    <div style={{ height:'58px', background:'linear-gradient(135deg,#1a1f3c,#252b4a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', color:'rgba(255,255,255,.4)', textAlign:'center' as any, padding:'4px' }}>{g.title}</div>
                    <div style={{ padding:'5px 6px' }}>
                      <div style={{ fontSize:'10px', fontWeight:600, color:'#111827', whiteSpace:'nowrap' as any, overflow:'hidden', textOverflow:'ellipsis' }}>{g.title}</div>
                      <div style={{ fontSize:'9px', color:'#16a34a' }}>{g.size}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* TOP + LATEST - responsive grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'16px', marginBottom:'16px' }}>
              <style>{`@media(min-width:640px){.main-grid{grid-template-columns:240px 1fr!important;}}`}</style>
              <div className="main-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:'16px' }}>
                {/* Top */}
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                    <div style={{ width:'4px', height:'16px', background:'linear-gradient(#ea580c,#f59e0b)', borderRadius:'2px' }}/>
                    <h2 style={{ fontSize:'16px', fontWeight:700, color:'#111827' }}>Top Downloads</h2>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column' as any, gap:'6px' }}>
                    {top.map((g,i)=>(
                      <Link key={g.id} href={`/games/${g.slug}`}
                        style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
                        <span style={{ fontSize:'16px', fontWeight:700, color:['#f59e0b','#94a3b8','#b45310','#9ca3af'][i]||'#9ca3af', minWidth:'18px', textAlign:'center' as any }}>{i+1}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:'12px', fontWeight:600, color:'#111827', whiteSpace:'nowrap' as any, overflow:'hidden', textOverflow:'ellipsis' }}>{g.title}</div>
                          <div style={{ fontSize:'10px', color:'#6b7280' }}>{g.downloadCount} downloads</div>
                        </div>
                        <span style={{ fontSize:'10px', color:'#16a34a', fontWeight:600, flexShrink:0 }}>{g.size}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Latest */}
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                    <div style={{ width:'4px', height:'16px', background:'linear-gradient(#16a34a,#0891b2)', borderRadius:'2px' }}/>
                    <h2 style={{ fontSize:'16px', fontWeight:700, color:'#111827' }}>Latest Games</h2>
                    <Link href="/games" style={{ marginLeft:'auto', fontSize:'12px', color:'#4f46e5' }}>View All â</Link>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))', gap:'8px' }}>
                    {games.slice(0,8).map(g=>(
                      <Link key={g.id} href={`/games/${g.slug}`}
                        style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', overflow:'hidden', display:'block', textDecoration:'none' }}>
                        <div style={{ height:'72px', background:'linear-gradient(135deg,#1a1f3c,#252b4a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', color:'rgba(255,255,255,.4)', padding:'6px', textAlign:'center' as any, position:'relative' }}>
                          {g.title}
                          {g.status==='hot' && <span style={{ position:'absolute', top:'3px', right:'3px', background:'#e53935', color:'#fff', fontSize:'7px', fontWeight:700, padding:'1px 4px', borderRadius:'2px' }}>HOT</span>}
                        </div>
                        <div style={{ padding:'6px 7px 8px' }}>
                          <div style={{ fontSize:'11px', fontWeight:600, color:'#111827', whiteSpace:'nowrap' as any, overflow:'hidden', textOverflow:'ellipsis' }}>{g.title}</div>
                          <div style={{ fontSize:'10px', color:'#4f46e5' }}>{g.category}</div>
                          <div style={{ fontSize:'10px', color:'#16a34a', fontWeight:600 }}>{g.size}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      
    </>
  )
}
