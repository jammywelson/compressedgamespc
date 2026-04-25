'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [stats, setStats] = useState({total:0,published:0,draft:0,users:0,downloads:0,views:0,comments:0,pending:0})
  const [recent, setRecent] = useState<any[]>([])
  const [recentComments, setRecentComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/games?limit=6').then(r=>r.json()),
      fetch('/api/games?status=published&limit=1').then(r=>r.json()),
      fetch('/api/games?status=draft&limit=1').then(r=>r.json()),
      fetch('/api/users').then(r=>r.json()),
      fetch('/api/admin/comments?limit=5').then(r=>r.json()),
      fetch('/api/admin/comments?status=pending&limit=1').then(r=>r.json()),
    ]).then(([all,pub,dft,users,comments,pending]) => {
      setStats({
        total:all.total||0, published:pub.total||0, draft:dft.total||0,
        users:users.length||0, downloads:all.games?.reduce((s:number,g:any)=>s+(g.downloadCount||0),0)||0,
        views:all.games?.reduce((s:number,g:any)=>s+(g.viewCount||0),0)||0,
        comments:comments.length||0, pending:pending.length||0,
      })
      setRecent(all.games||[])
      setRecentComments(comments||[])
      setLoading(false)
    }).catch(()=>setLoading(false))
  }, [])

  const Card = ({icon,label,value,color,href}:any) => (
    <Link href={href||'#'} style={{textDecoration:'none',display:'block',background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,.06)',border:'1px solid #e2e8f0',transition:'transform .2s,box-shadow .2s'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <p style={{margin:0,fontSize:'13px',color:'#64748b',fontWeight:500}}>{label}</p>
          <p style={{margin:'6px 0 0',fontSize:'28px',fontWeight:800,color:'#0f172a'}}>{loading?<span style={{color:'#e2e8f0'}}>...</span>:value}</p>
        </div>
        <div style={{width:'46px',height:'46px',borderRadius:'12px',background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>{icon}</div>
      </div>
    </Link>
  )

  const statusStyle = (s:string) => {
    const m: Record<string,string[]> = {published:['#dcfce7','#16a34a'],draft:['#fef9c3','#ca8a04'],scheduled:['#dbeafe','#2563eb'],archived:['#f1f5f9','#64748b']}
    return m[s]||m.archived
  }

  return (
    <div style={{padding:'24px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
        <div>
          <h1 style={{margin:0,fontSize:'22px',fontWeight:800,color:'#0f172a'}}>\u{1F4CA} Dashboard</h1>
          <p style={{margin:'4px 0 0',fontSize:'13px',color:'#64748b'}}>Welcome back! Here's what's happening.</p>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <Link href="/admin/games/add" style={{display:'flex',alignItems:'center',gap:'6px',background:'#6366f1',color:'#fff',padding:'9px 18px',borderRadius:'8px',textDecoration:'none',fontWeight:600,fontSize:'13px',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>\u2795 Add Game</Link>
          <Link href="/admin/settings" style={{display:'flex',alignItems:'center',gap:'6px',background:'#fff',color:'#374151',padding:'9px 18px',borderRadius:'8px',textDecoration:'none',fontWeight:600,fontSize:'13px',border:'1px solid #e2e8f0'}}>\u2699\uFE0F Settings</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:'16px',marginBottom:'24px'}}>
        <Card icon="\u{1F3AE}" label="Total Games" value={stats.total} color="#6366f1" href="/admin/games" />
        <Card icon="\u{1F7E2}" label="Published" value={stats.published} color="#16a34a" href="/admin/games?status=published" />
        <Card icon="\u{1F7E1}" label="Drafts" value={stats.draft} color="#ca8a04" href="/admin/games?status=draft" />
        <Card icon="\u{1F465}" label="Users" value={stats.users} color="#3b82f6" href="/admin/users" />
        <Card icon="\u{1F4E5}" label="Downloads" value={stats.downloads.toLocaleString()} color="#8b5cf6" href="/admin/analytics" />
        <Card icon="\u{1F441}\uFE0F" label="Page Views" value={stats.views.toLocaleString()} color="#ec4899" href="/admin/analytics" />
        <Card icon="\u{1F4AC}" label="Comments" value={stats.comments} color="#06b6d4" href="/admin/comments" />
        <Card icon="\u23F3" label="Pending Review" value={stats.pending} color="#f97316" href="/admin/comments?status=pending" />
      </div>

      {/* Tables */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'24px'}}>
        {/* Recent Games */}
        <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px',borderBottom:'1px solid #f1f5f9'}}>
            <h3 style={{margin:0,fontSize:'15px',fontWeight:700,color:'#0f172a'}}>Recent Games</h3>
            <Link href="/admin/games" style={{fontSize:'12px',color:'#6366f1',textDecoration:'none',fontWeight:600}}>View all \u2192</Link>
          </div>
          <div style={{padding:'0 4px'}}>
            {loading ? <p style={{padding:'20px',color:'#94a3b8',textAlign:'center'}}>Loading...</p> :
              recent.length===0 ? <div style={{padding:'32px',textAlign:'center'}}><p style={{color:'#94a3b8',margin:'0 0 8px'}}>No games yet</p><Link href="/admin/games/add" style={{color:'#6366f1',fontWeight:600,textDecoration:'none'}}>Add first game</Link></div> :
              recent.map((g:any)=>(
                <div key={g.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 16px',borderBottom:'1px solid #f8fafc'}}>
                  {g.coverImage ? <img src={g.coverImage} alt="" style={{width:'36px',height:'36px',borderRadius:'6px',objectFit:'cover',flexShrink:0}} /> : <div style={{width:'36px',height:'36px',borderRadius:'6px',background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',flexShrink:0}}>\u{1F3AE}</div>}
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:0,fontWeight:600,fontSize:'13px',color:'#0f172a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{g.title}</p>
                    <p style={{margin:'2px 0 0',fontSize:'11px',color:'#94a3b8'}}>{g.category} \u2022 {g.size}</p>
                  </div>
                  <span style={{padding:'2px 8px',borderRadius:'20px',fontSize:'10px',fontWeight:700,background:statusStyle(g.status)[0],color:statusStyle(g.status)[1],flexShrink:0}}>{g.status}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Recent Comments */}
        <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px',borderBottom:'1px solid #f1f5f9'}}>
            <h3 style={{margin:0,fontSize:'15px',fontWeight:700,color:'#0f172a'}}>Recent Comments</h3>
            <Link href="/admin/comments" style={{fontSize:'12px',color:'#6366f1',textDecoration:'none',fontWeight:600}}>View all \u2192</Link>
          </div>
          <div style={{padding:'0 4px'}}>
            {loading ? <p style={{padding:'20px',color:'#94a3b8',textAlign:'center'}}>Loading...</p> :
              recentComments.length===0 ? <p style={{padding:'32px',color:'#94a3b8',textAlign:'center',margin:0}}>No comments yet.</p> :
              recentComments.map((c:any)=>(
                <div key={c.id} style={{padding:'10px 16px',borderBottom:'1px solid #f8fafc'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <p style={{margin:0,fontWeight:600,fontSize:'13px',color:'#0f172a'}}>{c.name||c.user?.username||'Anonymous'}</p>
                    <span style={{padding:'2px 8px',borderRadius:'20px',fontSize:'10px',fontWeight:700,background:c.status==='approved'?'#dcfce7':c.status==='pending'?'#fef9c3':'#fee2e2',color:c.status==='approved'?'#16a34a':c.status==='pending'?'#ca8a04':'#dc2626'}}>{c.status}</span>
                  </div>
                  <p style={{margin:'3px 0 2px',fontSize:'12px',color:'#475569',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.content}</p>
                  <p style={{margin:0,fontSize:'11px',color:'#94a3b8'}}>on: {c.game?.title}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'20px'}}>
        <h3 style={{margin:'0 0 16px',fontSize:'15px',fontWeight:700,color:'#0f172a'}}>Quick Access</h3>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          {[
            {href:'/admin/games/add',icon:'\u2795',label:'Add Game',c:'#6366f1'},
            {href:'/admin/appearance',icon:'\u{1F3A8}',label:'Appearance',c:'#8b5cf6'},
            {href:'/admin/homepage',icon:'\u{1F3E0}',label:'Homepage',c:'#0ea5e9'},
            {href:'/admin/seo',icon:'\u{1F50D}',label:'SEO',c:'#10b981'},
            {href:'/admin/ads',icon:'\u{1F4B0}',label:'Ads Manager',c:'#f59e0b'},
            {href:'/admin/media',icon:'\u{1F5BC}\uFE0F',label:'Media Library',c:'#ec4899'},
            {href:'/admin/users',icon:'\u{1F465}',label:'Users',c:'#3b82f6'},
            {href:'/admin/analytics',icon:'\u{1F4C8}',label:'Analytics',c:'#06b6d4'},
            {href:'/admin/security',icon:'\u{1F6E1}\uFE0F',label:'Security',c:'#ef4444'},
            {href:'/admin/backup',icon:'\u{1F4BE}',label:'Backup',c:'#64748b'},
          ].map(item=>(
            <Link key={item.href} href={item.href} style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 14px',borderRadius:'8px',background:item.c+'12',color:item.c,textDecoration:'none',fontWeight:600,fontSize:'13px',border:'1px solid '+item.c+'25',transition:'all .15s'}}>
              <span>{item.icon}</span><span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}