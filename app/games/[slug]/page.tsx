import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const revalidate = 60

async function getGame(slug: string) {
  try {
    return await prisma.game.findUnique({ where: { slug } })
  } catch(e) { return null }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const game = await getGame(params.slug)
  if (!game) return { title: 'Game Not Found' }
  return {
    title: game.seoTitle || `${game.title} PC Game Download Free Highly Compressed`,
    description: game.seoDesc || `Download ${game.title} highly compressed for PC. Size: ${game.size}. Direct link, no surveys.`,
    keywords: game.seoKeywords || undefined,
  }
}

function Stars({ r }: { r: number }) {
  return <span>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=Math.round(r)?'#fbbf24':'#d1d5db',fontSize:'14px'}}>{i<=Math.round(r)?'â':'â'}</span>)}</span>
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await getGame(params.slug)
  if (!game) notFound()

  // Increment download count
  try { await prisma.game.update({ where:{ id:game.id }, data:{ downloadCount:{ increment:1 } } }) } catch(e) {}

  const links = game.downloadLinks as string[] || []

  return (
    <>
      
      <main style={{ maxWidth:'1000px', margin:'0 auto', padding:'16px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize:'12px', color:'#6b7280', marginBottom:'16px', display:'flex', gap:'6px', alignItems:'center' }}>
          <Link href="/" style={{ color:'#4f46e5' }}>Home</Link> /
          <Link href="/games" style={{ color:'#4f46e5' }}>Games</Link> /
          <Link href={`/games?category=${encodeURIComponent(game.category)}`} style={{ color:'#4f46e5' }}>{game.category}</Link> /
          <span>{game.title}</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'20px', marginBottom:'20px' }}>
          {/* Main content */}
          <div>
            {/* Game banner */}
            <div style={{ background:'linear-gradient(135deg,#1a1f3c,#252b4a)', borderRadius:'12px', height:'220px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', position:'relative', overflow:'hidden' }}>
              <div style={{ fontSize:'16px', color:'rgba(255,255,255,.3)', textAlign:'center' as any, padding:'20px' }}>{game.title}</div>
              {game.status === 'hot' && <span style={{ position:'absolute', top:'12px', left:'12px', background:'#e53935', color:'#fff', fontSize:'11px', fontWeight:700, padding:'3px 10px', borderRadius:'5px' }}>ð¥ HOT</span>}
              <span style={{ position:'absolute', top:'12px', right:'12px', background:'rgba(79,70,229,.8)', color:'#fff', fontSize:'11px', padding:'3px 10px', borderRadius:'5px' }}>â Compressed</span>
            </div>

            <h1 style={{ fontSize:'clamp(20px,4vw,28px)', fontWeight:700, color:'#111827', marginBottom:'8px' }}>{game.title}</h1>

            <div style={{ display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap' as any, marginBottom:'16px' }}>
              <span style={{ background:'#eef2ff', color:'#4f46e5', fontSize:'12px', padding:'3px 10px', borderRadius:'4px', fontWeight:500 }}>{game.category}</span>
              {game.rating && <Stars r={game.rating}/>}
              <span style={{ fontSize:'13px', color:'#6b7280' }}>{game.downloadCount} downloads</span>
            </div>

            {game.description && (
              <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px', marginBottom:'16px' }}>
                <h2 style={{ fontSize:'15px', fontWeight:700, color:'#111827', marginBottom:'8px' }}>About This Game</h2>
                <p style={{ fontSize:'13px', color:'#374151', lineHeight:1.7 }}>{game.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Size info */}
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px', marginBottom:'12px' }}>
              <h3 style={{ fontSize:'14px', fontWeight:700, color:'#111827', marginBottom:'12px' }}>Game Info</h3>
              <div style={{ display:'flex', flexDirection:'column' as any, gap:'8px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f9fafb' }}>
                  <span style={{ fontSize:'12px', color:'#6b7280' }}>Compressed</span>
                  <span style={{ fontSize:'13px', fontWeight:700, color:'#16a34a' }}>{game.size}</span>
                </div>
                {game.originalSize && (
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f9fafb' }}>
                    <span style={{ fontSize:'12px', color:'#6b7280' }}>Original</span>
                    <span style={{ fontSize:'13px', color:'#6b7280', textDecoration:'line-through' as any }}>{game.originalSize}</span>
                  </div>
                )}
                <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f9fafb' }}>
                  <span style={{ fontSize:'12px', color:'#6b7280' }}>Category</span>
                  <span style={{ fontSize:'13px', color:'#111827' }}>{game.category}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span style={{ fontSize:'12px', color:'#6b7280' }}>Downloads</span>
                  <span style={{ fontSize:'13px', color:'#111827' }}>{game.downloadCount}</span>
                </div>
              </div>
            </div>

            {/* Download buttons */}
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px' }}>
              <h3 style={{ fontSize:'14px', fontWeight:700, color:'#111827', marginBottom:'12px' }}>Download Links</h3>
              {links.length === 0 ? (
                <div style={{ fontSize:'13px', color:'#9ca3af', textAlign:'center' as any, padding:'12px' }}>
                  Links coming soon...
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column' as any, gap:'8px' }}>
                  {links.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                      style={{ display:'block', background:i===0?'#4f46e5':'#f3f4f6', color:i===0?'#fff':'#374151', borderRadius:'8px', padding:'11px 16px', fontSize:'13px', fontWeight:600, textAlign:'center' as any, textDecoration:'none' }}>
                      â¬ {i===0?'Direct Download':`Mirror ${i}`}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
    </>
  )
}
