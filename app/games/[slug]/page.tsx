import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function incrementView(slug: string) {
  try {
    await prisma.game.update({ where: { slug }, data: { viewCount: { increment: 1 } } })
  } catch {}
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await prisma.game.findUnique({ where: { slug: params.slug } }).catch(() => null)
  if (!game || game.status !== 'published') notFound()
  
  incrementView(params.slug)

  const related = await prisma.game.findMany({
    where: { category: game.category, status: 'published', slug: { not: game.slug } },
    take: 4
  }).catch(() => [])

  const downloads: string[] = typeof game.downloadLinks === 'string' 
    ? JSON.parse(game.downloadLinks) 
    : (game.downloadLinks as any) || []

  const gallery: string[] = game.gallery || []

  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'24px' }}>
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px', fontSize:'13px', color:'#94a3b8' }}>
        <Link href="/" style={{ color:'#6366f1', textDecoration:'none' }}>Home</Link>
        <span>/</span>
        <Link href="/games" style={{ color:'#6366f1', textDecoration:'none' }}>Games</Link>
        <span>/</span>
        <Link href={`/games?category=${encodeURIComponent(game.category)}`} style={{ color:'#6366f1', textDecoration:'none' }}>{game.category}</Link>
        <span>/</span>
        <span style={{ color:'#475569' }}>{game.title}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'24px' }}>
        {/* Main */}
        <div>
          {/* Cover */}
          <div style={{ borderRadius:'16px', overflow:'hidden', marginBottom:'24px', background:'#f1f5f9', aspectRatio:'16/7' }}>
            {game.coverImage
              ? <img src={game.coverImage} alt={game.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'64px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🎮</div>
            }
          </div>

          {/* Title */}
          <h1 style={{ margin:'0 0 12px', fontSize:'28px', fontWeight:900, color:'#0f172a', lineHeight:1.2 }}>{game.title}</h1>
          
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px' }}>
            <span style={{ padding:'4px 12px', borderRadius:'20px', background:'#ede9fe', color:'#6d28d9', fontWeight:700, fontSize:'12px' }}>{game.category}</span>
            {game.platform && <span style={{ padding:'4px 12px', borderRadius:'20px', background:'#dbeafe', color:'#1d4ed8', fontWeight:700, fontSize:'12px' }}>{game.platform}</span>}
            {game.hot && <span style={{ padding:'4px 12px', borderRadius:'20px', background:'#fee2e2', color:'#dc2626', fontWeight:700, fontSize:'12px' }}>🔥 HOT</span>}
            {game.featured && <span style={{ padding:'4px 12px', borderRadius:'20px', background:'#fef9c3', color:'#854d0e', fontWeight:700, fontSize:'12px' }}>⭐ FEATURED</span>}
          </div>

          {/* Description */}
          {game.description && (
            <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'20px', border:'1px solid #e2e8f0' }}>
              <h3 style={{ margin:'0 0 12px', fontWeight:700 }}>About This Game</h3>
              <p style={{ margin:0, color:'#475569', lineHeight:1.7, fontSize:'14px', whiteSpace:'pre-wrap' }}>{game.description}</p>
            </div>
          )}

          {/* System Requirements */}
          {game.systemReqs && (
            <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'20px', border:'1px solid #e2e8f0' }}>
              <h3 style={{ margin:'0 0 12px', fontWeight:700 }}>System Requirements</h3>
              <pre style={{ margin:0, color:'#475569', fontFamily:'monospace', fontSize:'13px', whiteSpace:'pre-wrap', lineHeight:1.6 }}>{game.systemReqs}</pre>
            </div>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'20px', border:'1px solid #e2e8f0' }}>
              <h3 style={{ margin:'0 0 12px', fontWeight:700 }}>Screenshots</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'10px' }}>
                {gallery.map((img: string, i: number) => (
                  <img key={i} src={img} alt={`Screenshot ${i+1}`} style={{ width:'100%', borderRadius:'8px', objectFit:'cover', aspectRatio:'16/9' }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Download Box */}
          <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius:'16px', padding:'24px', marginBottom:'20px', color:'#fff' }}>
            <h3 style={{ margin:'0 0 16px', fontWeight:800, fontSize:'18px' }}>📥 Download</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ opacity:.8, fontSize:'13px' }}>Compressed Size</span>
                <span style={{ fontWeight:800, fontSize:'16px' }}>{game.size}</span>
              </div>
              {game.originalSize && (
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ opacity:.8, fontSize:'13px' }}>Original Size</span>
                  <span style={{ fontWeight:600 }}>{game.originalSize}</span>
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ opacity:.8, fontSize:'13px' }}>Downloads</span>
                <span style={{ fontWeight:600 }}>{(game.downloadCount||0).toLocaleString()}</span>
              </div>
              {game.version && (
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ opacity:.8, fontSize:'13px' }}>Version</span>
                  <span style={{ fontWeight:600 }}>v{game.version}</span>
                </div>
              )}
            </div>
            {downloads.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {downloads.map((link: string, i: number) => (
                  <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', background:'#fff', color:'#4f46e5', padding:'12px', borderRadius:'10px', textDecoration:'none', fontWeight:800, fontSize:'14px' }}>
                    📥 Download Mirror {downloads.length > 1 ? i+1 : ''}
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ background:'rgba(255,255,255,.15)', borderRadius:'10px', padding:'16px', textAlign:'center', fontSize:'13px', opacity:.8 }}>No download links added yet.</div>
            )}
          </div>

          {/* Game Info */}
          <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'20px', border:'1px solid #e2e8f0' }}>
            <h3 style={{ margin:'0 0 14px', fontWeight:700 }}>Game Info</h3>
            {[
              ['Developer', game.developer],
              ['Publisher', game.publisher],
              ['Year', game.releaseYear],
              ['Platform', game.platform],
              ['Rating', game.rating ? '⭐ '+game.rating+'/5' : null],
            ].filter(([,v]) => v).map(([label, value]) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f8fafc', fontSize:'13px' }}>
                <span style={{ color:'#94a3b8' }}>{label}</span>
                <span style={{ fontWeight:600, color:'#374151' }}>{value}</span>
              </div>
            ))}
            {game.tags && game.tags.length > 0 && (
              <div style={{ marginTop:'12px' }}>
                <p style={{ margin:'0 0 8px', fontSize:'12px', color:'#94a3b8' }}>TAGS</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                  {game.tags.map((tag: string) => (
                    <span key={tag} style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'6px', background:'#f1f5f9', color:'#475569' }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #e2e8f0' }}>
              <h3 style={{ margin:'0 0 14px', fontWeight:700 }}>Related Games</h3>
              {related.map((g: any) => (
                <Link key={g.id} href={`/games/${g.slug}`} style={{ display:'flex', gap:'10px', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #f8fafc', textDecoration:'none' }}>
                  {g.coverImage
                    ? <img src={g.coverImage} alt="" style={{ width:'44px', height:'44px', borderRadius:'8px', objectFit:'cover', flexShrink:0 }} />
                    : <div style={{ width:'44px', height:'44px', borderRadius:'8px', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>🎮</div>
                  }
                  <div>
                    <p style={{ margin:0, fontWeight:600, fontSize:'13px', color:'#0f172a' }}>{g.title}</p>
                    <p style={{ margin:'2px 0 0', fontSize:'11px', color:'#94a3b8' }}>{g.size}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}