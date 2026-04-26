import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getGames(search: string, category: string, status: string) {
  const where: any = { status: 'published' }
  if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }]
  if (category) where.category = category
  if (status === 'hot') where.hot = true
  if (status === 'featured') where.featured = true
  if (status === 'trending') where.trending = true
  return prisma.game.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 })
}

const GRADS = ['linear-gradient(135deg,#6366f1,#8b5cf6)','linear-gradient(135deg,#3b82f6,#06b6d4)','linear-gradient(135deg,#10b981,#059669)','linear-gradient(135deg,#f59e0b,#ef4444)','linear-gradient(135deg,#ec4899,#8b5cf6)']
const CATS = ['All','Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games']

export default async function GamesPage({ searchParams }: { searchParams: Record<string,string> }) {
  const search = searchParams.search || ''
  const category = searchParams.category || ''
  const status = searchParams.status || ''
  const games = await getGames(search, category, status)

  const title = search ? `Search: "${search}"` : category ? `${category} Games` : status === 'hot' ? '🔥 Hot Games' : 'All Games'

  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'24px' }}>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ margin:'0 0 4px', fontSize:'26px', fontWeight:800, color:'#0f172a' }}>{title}</h1>
        <p style={{ margin:0, fontSize:'14px', color:'#64748b' }}>{games.length} games found</p>
      </div>

      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'24px' }}>
        {CATS.map(cat => (
          <Link key={cat} href={cat==='All'?'/games':`/games?category=${encodeURIComponent(cat)}`}
            style={{ padding:'6px 14px', borderRadius:'20px', textDecoration:'none', fontSize:'13px', fontWeight:600, background:category===cat||(cat==='All'&&!category)?'#6366f1':'#f1f5f9', color:category===cat||(cat==='All'&&!category)?'#fff':'#64748b' }}>
            {cat}
          </Link>
        ))}
      </div>

      {games.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px', background:'#fff', borderRadius:'16px' }}>
          <p style={{ fontSize:'48px', margin:'0 0 12px' }}>🎮</p>
          <p style={{ color:'#94a3b8', fontSize:'16px' }}>{search ? `No games found for "${search}"` : 'No games in this category yet.'}</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px' }}>
          {games.map((g: any, i: number) => (
            <Link key={g.id} href={`/games/${g.slug}`} style={{ display:'block', background:'#fff', borderRadius:'14px', overflow:'hidden', textDecoration:'none', boxShadow:'0 2px 8px rgba(0,0,0,.08)', border:'1px solid #e2e8f0' }}>
              <div style={{ height:'180px', overflow:'hidden', position:'relative' }}>
                {g.coverImage
                  ? <img src={g.coverImage} alt={g.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ width:'100%', height:'100%', background:GRADS[i%GRADS.length], display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px' }}>🎮</div>
                }
                {(g.hot||g.featured) && (
                  <div style={{ position:'absolute', top:'8px', left:'8px' }}>
                    {g.hot && <span style={{ background:'#ef4444', color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 7px', borderRadius:'20px' }}>🔥 HOT</span>}
                    {g.featured && !g.hot && <span style={{ background:'#6366f1', color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 7px', borderRadius:'20px' }}>⭐</span>}
                  </div>
                )}
                <div style={{ position:'absolute', bottom:'8px', right:'8px', background:'rgba(0,0,0,.7)', color:'#fff', fontSize:'11px', fontWeight:700, padding:'3px 8px', borderRadius:'6px' }}>{g.size}</div>
              </div>
              <div style={{ padding:'12px' }}>
                <p style={{ margin:'0 0 6px', fontWeight:700, fontSize:'13px', color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{g.title}</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:'11px', color:'#64748b', background:'#f1f5f9', padding:'2px 8px', borderRadius:'20px' }}>{g.category}</span>
                  <span style={{ fontSize:'11px', color:'#94a3b8' }}>⬇ {(g.downloadCount||0).toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}