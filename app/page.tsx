import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 0
export const dynamic = 'force-dynamic'

async function getSettings(key: string) {
  try {
    const s = await prisma.setting.findUnique({ where: { key } })
    return s ? JSON.parse(s.value) : {}
  } catch { return {} }
}

async function getData() {
  try {
    const [games, total, dlSum] = await Promise.all([
      prisma.game.findMany({ where: { status: 'published' }, orderBy: { createdAt: 'desc' }, take: 20 }),
      prisma.game.count({ where: { status: 'published' } }),
      prisma.game.aggregate({ _sum: { downloadCount: true } }),
    ])
    return { games, total, downloads: dlSum._sum.downloadCount || 0 }
  } catch { return { games: [], total: 0, downloads: 0 } }
}

const GRADS = ['linear-gradient(135deg,#6366f1,#8b5cf6)','linear-gradient(135deg,#3b82f6,#06b6d4)','linear-gradient(135deg,#10b981,#059669)','linear-gradient(135deg,#f59e0b,#ef4444)','linear-gradient(135deg,#ec4899,#8b5cf6)','linear-gradient(135deg,#06b6d4,#3b82f6)']

export default async function HomePage() {
  const [{ games, total, downloads }, homeCfg, appCfg] = await Promise.all([
    getData(), getSettings('homepage'), getSettings('appearance')
  ])

  const featured = games.filter((g: any) => g.featured).slice(0, 6)
  const trending = games.filter((g: any) => g.trending || g.hot).slice(0, 6)
  const latest = games.slice(0, 8)

  const heroTitle = homeCfg.heroTitle || 'Free Highly Compressed\nPC Games Download'
  const heroSubtitle = homeCfg.heroSubtitle || 'Direct download links. No surveys. Maximum compression!'
  const heroBtnText = homeCfg.heroBtnText || 'Browse All Games'
  const statsGames = homeCfg.statsGames || (total + '+')
  const statsCompression = homeCfg.statsCompression || '75%'
  const statsSurveys = homeCfg.statsSurveys || '0'
  const showHero = homeCfg.showHero !== false
  const showStats = homeCfg.showStats !== false
  const showFeatured = homeCfg.showFeatured !== false
  const showTrending = homeCfg.showTrending !== false
  const showLatest = homeCfg.showLatest !== false
  const showCategories = homeCfg.showCategories !== false
  const featuredTitle = homeCfg.featuredTitle || 'Featured Games'
  const trendingTitle = homeCfg.trendingTitle || 'Trending Now'
  const latestTitle = homeCfg.latestTitle || 'Latest Releases'
  const accentColor = appCfg.accentColor || '#4f46e5'
  const bodyBg = appCfg.bodyBg || '#f0f2f8'

  const CATS = ['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games']

  const GameCard = ({ game, index }: any) => (
    <Link href={`/games/${game.slug}`} style={{ display:'block', background:'#fff', borderRadius:'14px', overflow:'hidden', textDecoration:'none', boxShadow:'0 2px 8px rgba(0,0,0,.08)', transition:'transform .2s, box-shadow .2s', border:'1px solid #e2e8f0' }}>
      <div style={{ position:'relative', height:'180px', overflow:'hidden' }}>
        {game.coverImage
          ? <img src={game.coverImage} alt={game.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <div style={{ width:'100%', height:'100%', background: GRADS[index % GRADS.length], display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px' }}>🎮</div>
        }
        {(game.hot || game.trending || game.featured) && (
          <div style={{ position:'absolute', top:'8px', left:'8px', display:'flex', gap:'4px', flexWrap:'wrap' }}>
            {game.hot && <span style={{ background:'#ef4444', color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 7px', borderRadius:'20px' }}>🔥 HOT</span>}
            {game.trending && !game.hot && <span style={{ background:'#f59e0b', color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 7px', borderRadius:'20px' }}>📈 TRENDING</span>}
            {game.featured && !game.hot && !game.trending && <span style={{ background:accentColor, color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 7px', borderRadius:'20px' }}>⭐ FEATURED</span>}
          </div>
        )}
        <div style={{ position:'absolute', bottom:'8px', right:'8px', background:'rgba(0,0,0,.7)', color:'#fff', fontSize:'11px', fontWeight:700, padding:'3px 8px', borderRadius:'6px' }}>{game.size}</div>
      </div>
      <div style={{ padding:'12px' }}>
        <p style={{ margin:'0 0 4px', fontWeight:700, fontSize:'14px', color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{game.title}</p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'11px', color:'#64748b', background:'#f1f5f9', padding:'2px 8px', borderRadius:'20px' }}>{game.category}</span>
          <span style={{ fontSize:'11px', color:'#94a3b8' }}>⬇ {(game.downloadCount||0).toLocaleString()}</span>
        </div>
      </div>
    </Link>
  )

  const Section = ({ title, games: gs, viewHref }: any) => gs.length === 0 ? null : (
    <section style={{ marginBottom:'40px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h2 style={{ margin:0, fontSize:'20px', fontWeight:800, color:'#0f172a' }}>{title}</h2>
        <Link href={viewHref} style={{ color:accentColor, textDecoration:'none', fontWeight:600, fontSize:'14px' }}>View all →</Link>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px' }}>
        {gs.map((g: any, i: number) => <GameCard key={g.id} game={g} index={i} />)}
      </div>
    </section>
  )

  return (
    <div style={{ background: bodyBg, minHeight:'100vh' }}>

      {/* HERO */}
      {showHero && (
        <section style={{ background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)', padding:'60px 24px', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, opacity:.05, backgroundImage:'radial-gradient(circle at 20% 50%,#fff 1px,transparent 1px),radial-gradient(circle at 80% 20%,#fff 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
          <div style={{ maxWidth:'700px', margin:'0 auto', position:'relative' }}>
            <h1 style={{ margin:'0 0 16px', fontSize:'clamp(28px,5vw,52px)', fontWeight:900, color:'#fff', lineHeight:1.15 }}>
              {heroTitle.split('\n').map((line: string, i: number) => (
                <span key={i} style={{ display:'block', color: i === 1 ? '#a5b4fc' : '#fff' }}>{line}</span>
              ))}
            </h1>
            <p style={{ margin:'0 0 28px', fontSize:'16px', color:'rgba(255,255,255,.7)', lineHeight:1.6 }}>{heroSubtitle}</p>
            <Link href="/games" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:accentColor, color:'#fff', padding:'14px 32px', borderRadius:'12px', textDecoration:'none', fontWeight:700, fontSize:'16px', boxShadow:'0 4px 20px rgba(99,102,241,.5)' }}>
              {heroBtnText} →
            </Link>
          </div>
        </section>
      )}

      {/* STATS */}
      {showStats && (
        <section style={{ background:'#fff', borderBottom:'1px solid #e2e8f0' }}>
          <div style={{ maxWidth:'1200px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))' }}>
            {[
              { label:'Games Available', value: statsGames, icon:'🎮', color:'#6366f1' },
              { label:'Avg Compression', value: statsCompression, icon:'🗜', color:'#10b981' },
              { label:'Always Free', value:'Free', icon:'💚', color:'#3b82f6' },
              { label:'Surveys', value: statsSurveys, icon:'🚫', color:'#ef4444' },
            ].map(s => (
              <div key={s.label} style={{ padding:'24px 20px', textAlign:'center', borderRight:'1px solid #f1f5f9' }}>
                <div style={{ fontSize:'32px', marginBottom:'6px' }}>{s.icon}</div>
                <div style={{ fontSize:'26px', fontWeight:900, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:'13px', color:'#94a3b8', marginTop:'4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MAIN CONTENT */}
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px 24px' }}>

        {/* FEATURED */}
        {showFeatured && featured.length > 0 && <Section title={'⭐ ' + featuredTitle} games={featured} viewHref="/games?featured=true" />}

        {/* TRENDING */}
        {showTrending && trending.length > 0 && <Section title={'🔥 ' + trendingTitle} games={trending} viewHref="/games?trending=true" />}

        {/* LATEST */}
        {showLatest && <Section title={'🆕 ' + latestTitle} games={latest} viewHref="/games" />}

        {/* CATEGORIES */}
        {showCategories && (
          <section style={{ marginBottom:'40px' }}>
            <h2 style={{ margin:'0 0 16px', fontSize:'20px', fontWeight:800, color:'#0f172a' }}>📁 Browse by Category</h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
              {CATS.map((cat, i) => (
                <Link key={cat} href={`/games?category=${encodeURIComponent(cat)}`}
                  style={{ padding:'10px 18px', borderRadius:'10px', background:'#fff', color:'#374151', textDecoration:'none', fontWeight:600, fontSize:'14px', border:'2px solid #e2e8f0', boxShadow:'0 1px 3px rgba(0,0,0,.05)', transition:'all .15s', display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ fontSize:'16px' }}>🎮</span> {cat}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {games.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 20px' }}>
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>🎮</div>
            <h2 style={{ color:'#94a3b8', fontWeight:600 }}>No games published yet</h2>
            <p style={{ color:'#94a3b8' }}>Games will appear here once published from the admin panel.</p>
            <Link href="/admin/games/add" style={{ color:accentColor, textDecoration:'none', fontWeight:700 }}>Add your first game →</Link>
          </div>
        )}

      </div>
    </div>
  )
}