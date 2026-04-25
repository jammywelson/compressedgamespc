import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'All PC Games - Free Highly Compressed Download',
  description: 'Browse all free highly compressed PC games.',
}

export const revalidate = 60

const CATS = ['All','Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games','Action RPG']

async function getGames(category?: string, q?: string, status?: string) {
  try {
    const where: any = { NOT: { status: 'draft' } }
    if (category && category !== 'All') where.category = category
    if (status) where.status = status
    if (q) where.title = { contains: q, mode: 'insensitive' }
    return await prisma.game.findMany({ where, orderBy: { createdAt: 'desc' } })
  } catch(e) { return [] }
}

export default async function GamesPage({ searchParams }: { searchParams: { category?: string; q?: string; status?: string } }) {
  const cat    = searchParams.category || 'All'
  const q      = searchParams.q || ''
  const status = searchParams.status || ''
  const games  = await getGames(cat === 'All' ? undefined : cat, q, status)

  return (
    <>
      
      <main style={{ maxWidth:'1200px', margin:'0 auto', padding:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px', flexWrap:'wrap' as any }}>
          <div style={{ width:'4px', height:'18px', background:'#4f46e5', borderRadius:'2px' }}/>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'#111827' }}>
            {q ? `Search: "${q}"` : status === 'hot' ? 'ð¥ Hot Games' : cat === 'All' ? 'All Games' : cat}
          </h1>
          <span style={{ fontSize:'13px', color:'#6b7280' }}>{games.length} games</span>
        </div>

        {/* Category filter */}
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' as any, marginBottom:'20px' }}>
          {CATS.map(c => (
            <Link key={c} href={c==='All'?'/games':`/games?category=${encodeURIComponent(c)}`}
              style={{ background:cat===c?'#4f46e5':'#fff', color:cat===c?'#fff':'#374151', border:`1px solid ${cat===c?'#4f46e5':'#e5e7eb'}`, borderRadius:'6px', padding:'5px 12px', fontSize:'12px', fontWeight:500 }}>
              {c}
            </Link>
          ))}
        </div>

        {games.length === 0 ? (
          <div style={{ textAlign:'center' as any, padding:'60px 20px', background:'#fff', borderRadius:'12px', border:'1px solid #e5e7eb' }}>
            <div style={{ fontSize:'48px', marginBottom:'12px' }}>ð®</div>
            <div style={{ fontSize:'18px', fontWeight:700, color:'#111827', marginBottom:'8px' }}>
              {q ? `"${q}" nahi mila` : 'Koi game nahi hai abhi'}
            </div>
            <div style={{ fontSize:'13px', color:'#6b7280' }}>
              {q ? 'Dusra search karo' : 'Admin panel se games add karo'}
            </div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:'12px' }}>
            {games.map(g => (
              <Link key={g.id} href={`/games/${g.slug}`}
                style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', overflow:'hidden', textDecoration:'none', display:'block' }}>
                <div style={{ height:'90px', background:'linear-gradient(135deg,#1a1f3c,#252b4a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'rgba(255,255,255,.4)', padding:'6px', textAlign:'center' as any, position:'relative' }}>
                  {g.title}
                  {g.status==='hot' && <span style={{ position:'absolute', top:'4px', right:'4px', background:'#e53935', color:'#fff', fontSize:'8px', fontWeight:700, padding:'1px 5px', borderRadius:'3px' }}>HOT</span>}
                </div>
                <div style={{ padding:'8px' }}>
                  <div style={{ fontSize:'12px', fontWeight:600, color:'#111827', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as any }}>{g.title}</div>
                  <div style={{ fontSize:'11px', color:'#4f46e5', marginTop:'2px' }}>{g.category}</div>
                  <div style={{ fontSize:'11px', color:'#16a34a', fontWeight:600 }}>{g.size}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      
    </>
  )
}
