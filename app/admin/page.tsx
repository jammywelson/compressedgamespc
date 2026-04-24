import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getCounts() {
  try {
    const [games, users] = await Promise.all([
      prisma.game.count(),
      prisma.user.count(),
    ])
    return { games, users }
  } catch(e) { return { games:0, users:0 } }
}

export default async function AdminDashboard() {
  const { games, users } = await getCounts()
  return (
    <div>
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', height:'54px', display:'flex', alignItems:'center', boxShadow:'0 1px 3px rgba(0,0,0,.06)' }}>
        <span style={{ fontFamily:'system-ui', fontSize:'18px', fontWeight:700, color:'#111827' }}>Dashboard</span>
        <Link href="/admin/games/add" style={{ marginLeft:'auto', background:'#4f46e5', color:'#fff', borderRadius:'7px', padding:'8px 16px', fontSize:'13px', fontWeight:600, textDecoration:'none' }}>+ Add New Game</Link>
      </div>
      <div style={{ padding:'24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'12px', marginBottom:'20px' }}>
          {[
            { label:'Total Games', val:games,  color:'#4f46e5', bg:'#eef2ff', href:'/admin/games'      },
            { label:'Users',       val:users,  color:'#16a34a', bg:'#f0fdf4', href:'/admin/users'      },
            { label:'Downloads',   val:0,      color:'#ea580c', bg:'#fff7ed', href:'/admin/stats'      },
            { label:'Categories',  val:14,     color:'#0891b2', bg:'#ecfeff', href:'/admin/categories' },
          ].map(s=>(
            <Link key={s.label} href={s.href} style={{ background:s.bg, border:`1px solid ${s.color}22`, borderRadius:'10px', padding:'16px', textDecoration:'none' }}>
              <div style={{ fontSize:'28px', fontWeight:700, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'4px' }}>{s.label}</div>
            </Link>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'10px' }}>
          {[
            {l:'Add Game',      href:'/admin/games/add',  c:'#4f46e5',bg:'#eef2ff'},
            {l:'Appearance',    href:'/admin/appearance', c:'#7c3aed',bg:'#f5f3ff'},
            {l:'Pages Manager', href:'/admin/pages',      c:'#0891b2',bg:'#ecfeff'},
            {l:'SEO Settings',  href:'/admin/seo',        c:'#16a34a',bg:'#f0fdf4'},
          ].map(a=>(
            <Link key={a.l} href={a.href} style={{ background:a.bg, border:`1px solid ${a.c}33`, borderRadius:'8px', padding:'14px', textAlign:'center' as any, color:a.c, fontWeight:600, fontSize:'13px', textDecoration:'none' }}>{a.l}</Link>
          ))}
        </div>
        {games === 0 && (
          <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'40px', textAlign:'center' as any, marginTop:'20px' }}>
            <div style={{ fontSize:'48px', marginBottom:'12px' }}>🎮</div>
            <div style={{ fontSize:'18px', fontWeight:700, color:'#111827', marginBottom:'8px' }}>Koi game nahi — Add karo!</div>
            <Link href="/admin/games/add" style={{ background:'#4f46e5', color:'#fff', borderRadius:'8px', padding:'10px 24px', fontSize:'13px', fontWeight:600, textDecoration:'none' }}>+ Add First Game</Link>
          </div>
        )}
      </div>
    </div>
  )
}
