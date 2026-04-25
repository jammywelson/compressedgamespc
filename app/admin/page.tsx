'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [stats, setStats] = useState({ games:0,users:0,downloads:0,comments:0,pendingComments:0,draftGames:0 })
  const [recentGames, setRecentGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r=>r.json()),
      fetch('/api/games?limit=5').then(r=>r.json()),
    ]).then(([s,g]) => { setStats(s); setRecentGames(g.games||[]) }).finally(()=>setLoading(false))
  }, [])

  const card = (label:string,value:any,icon:string,color:string,href:string,sub?:string) => (
    <Link href={href} style={{ textDecoration:'none' }}>
      <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', display:'flex', alignItems:'center', gap:'16px' }}>
        <div style={{ width:'52px',height:'52px',borderRadius:'12px',background:color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px' }}>{icon}</div>
        <div>
          <div style={{ fontSize:'28px',fontWeight:700,color:'#0f172a',lineHeight:1 }}>{loading?'...':value.toLocaleString()}</div>
          <div style={{ fontSize:'13px',color:'#64748b',marginTop:'4px' }}>{label}</div>
          {sub && <div style={{ fontSize:'11px',color:color,marginTop:'2px' }}>{sub}</div>}
        </div>
      </div>
    </Link>
  )

  const qa = [
    {href:'/admin/games/add',icon:'\u2795',label:'Add Game'},
    {href:'/admin/categories',icon:'\u{1F4C2}',label:'Categories'},
    {href:'/admin/media',icon:'\u{1F5BC}',label:'Media'},
    {href:'/admin/comments',icon:'\u{1F4AC}',label:'Comments'},
    {href:'/admin/seo',icon:'\u{1F50D}',label:'SEO'},
    {href:'/admin/appearance',icon:'\u{1F3A8}',label:'Appearance'},
    {href:'/admin/ads',icon:'\u{1F4B0}',label:'Ads'},
    {href:'/admin/settings',icon:'\u2699\uFE0F',label:'Settings'},
  ]

  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ margin:'0 0 4px',fontSize:'24px',fontWeight:700,color:'#0f172a' }}>Dashboard</h1>
        <p style={{ margin:0,color:'#64748b',fontSize:'14px' }}>Welcome to CompressedGamesPC Admin Panel</p>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'24px' }}>
        {card('Total Games',stats.games,'\u{1F3AE}','#4f46e5','/admin/games',stats.draftGames+' drafts')}
        {card('Total Users',stats.users,'\u{1F465}','#059669','/admin/users')}
        {card('Downloads',stats.downloads,'\u{1F4E5}','#0891b2','/admin/downloads')}
        {card('Comments',stats.comments,'\u{1F4AC}','#d97706','/admin/comments',stats.pendingComments+' pending')}
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 320px',gap:'24px',flexWrap:'wrap' as any }}>
        <div style={{ background:'#fff',borderRadius:'12px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',overflow:'hidden' }}>
          <div style={{ padding:'16px 20px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <h3 style={{ margin:0,fontSize:'15px',fontWeight:600,color:'#0f172a' }}>Recent Games</h3>
            <Link href='/admin/games' style={{ color:'#4f46e5',fontSize:'13px',textDecoration:'none',fontWeight:500 }}>View all \u2192</Link>
          </div>
          <table style={{ width:'100%',borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'#f8fafc' }}>
              {['Title','Category','Status','Downloads','Added'].map(h=><th key={h} style={{ padding:'10px 16px',textAlign:'left',fontSize:'12px',fontWeight:600,color:'#64748b' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {loading?<tr><td colSpan={5} style={{ padding:'40px',textAlign:'center',color:'#94a3b8' }}>Loading...</td></tr>
              :recentGames.length===0?<tr><td colSpan={5} style={{ padding:'40px',textAlign:'center',color:'#94a3b8' }}>No games. <Link href='/admin/games/add' style={{ color:'#4f46e5' }}>Add first game</Link></td></tr>
              :recentGames.map((g:any)=>(
                <tr key={g.id} style={{ borderTop:'1px solid #f1f5f9' }}>
                  <td style={{ padding:'12px 16px',fontWeight:500,fontSize:'13px',color:'#0f172a',maxWidth:'180px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{g.title}</td>
                  <td style={{ padding:'12px 16px',fontSize:'12px',color:'#64748b' }}>{g.category}</td>
                  <td style={{ padding:'12px 16px' }}><span style={{ padding:'3px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:g.status==='published'?'#dcfce7':'#fef9c3',color:g.status==='published'?'#16a34a':'#a16207' }}>{g.status}</span></td>
                  <td style={{ padding:'12px 16px',fontSize:'13px',color:'#64748b' }}>{g.downloadCount}</td>
                  <td style={{ padding:'12px 16px',fontSize:'12px',color:'#94a3b8' }}>{new Date(g.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div style={{ background:'#fff',borderRadius:'12px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',padding:'16px 20px',marginBottom:'16px' }}>
            <h3 style={{ margin:'0 0 14px',fontSize:'15px',fontWeight:600,color:'#0f172a' }}>Quick Actions</h3>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px' }}>
              {qa.map(a=>(<Link key={a.href} href={a.href} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',padding:'12px 8px',borderRadius:'8px',border:'1px solid #e2e8f0',textDecoration:'none' }}>
                <span style={{ fontSize:'20px' }}>{a.icon}</span>
                <span style={{ fontSize:'11px',fontWeight:500,color:'#374151',textAlign:'center' }}>{a.label}</span>
              </Link>))}
            </div>
          </div>
          <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)',borderRadius:'12px',padding:'20px',color:'#fff' }}>
            <div style={{ fontWeight:700,fontSize:'15px',marginBottom:'4px' }}>\u{1F680} Site is Live</div>
            <div style={{ fontSize:'13px',opacity:.8,marginBottom:'14px' }}>Your site is running perfectly</div>
            <Link href='/' target='_blank' style={{ display:'inline-block',background:'rgba(255,255,255,.2)',color:'#fff',textDecoration:'none',padding:'8px 14px',borderRadius:'8px',fontSize:'13px',fontWeight:600 }}>Visit Site \u2197</Link>
          </div>
        </div>
      </div>
    </div>
  )
}