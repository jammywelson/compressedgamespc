'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const StatCard = ({ icon, label, value, color, href }: any) => (
  <Link href={href || '#'} style={{ textDecoration:'none', display:'block', background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:'1px solid #e2e8f0', transition:'all .2s', cursor:'pointer' }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
      <div>
        <p style={{ margin:0, fontSize:'13px', color:'#64748b', fontWeight:500 }}>{label}</p>
        <p style={{ margin:'6px 0 0', fontSize:'28px', fontWeight:700, color:'#1e293b' }}>{value}</p>
      </div>
      <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>{icon}</div>
    </div>
  </Link>
)

const QuickBtn = ({ href, icon, label, color }: any) => (
  <Link href={href} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 16px', background:color, color:'#fff', borderRadius:'8px', textDecoration:'none', fontWeight:600, fontSize:'13px', flexShrink:0 }}>
    <span>{icon}</span><span>{label}</span>
  </Link>
)

export default function Dashboard() {
  const [stats, setStats] = useState({games:0, published:0, draft:0, users:0, comments:0, pending:0, downloads:0, views:0})
  const [recent, setRecent] = useState<any[]>([])
  const [recentComments, setRecentComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/games?limit=5').then(r=>r.json()),
      fetch('/api/games?status=published&limit=1').then(r=>r.json()),
      fetch('/api/games?status=draft&limit=1').then(r=>r.json()),
      fetch('/api/users').then(r=>r.json()),
      fetch('/api/admin/comments?limit=5').then(r=>r.json()),
      fetch('/api/admin/comments?status=pending&limit=1').then(r=>r.json()),
    ]).then(([all, pub, dft, users, comments, pending]) => {
      setStats({
        games: all.total || 0,
        published: pub.total || 0,
        draft: dft.total || 0,
        users: users.length || 0,
        comments: comments.length || 0,
        pending: pending.length || 0,
        downloads: all.games?.reduce((s:number,g:any) => s + (g.downloadCount||0), 0) || 0,
        views: all.games?.reduce((s:number,g:any) => s + (g.viewCount||0), 0) || 0,
      })
      setRecent(all.games || [])
      setRecentComments(comments || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const s = { padding:'20px', minHeight:'100vh', background:'#f8fafc' }
  const h1 = { margin:'0 0 24px', fontSize:'22px', fontWeight:700, color:'#1e293b' }

  return (
    <div style={s}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <h1 style={h1}>\u{1F4CA} Dashboard</h1>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <QuickBtn href="/admin/games/add" icon="\u2795" label="Add Game" color="#6366f1" />
          <QuickBtn href="/admin/categories" icon="\u{1F4C1}" label="Categories" color="#0ea5e9" />
          <QuickBtn href="/admin/settings" icon="\u2699\uFE0F" label="Settings" color="#64748b" />
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'16px', marginBottom:'28px' }}>
        <StatCard icon="\u{1F3AE}" label="Total Games" value={loading?'...':stats.games} color="#6366f1" href="/admin/games" />
        <StatCard icon="\u{1F7E2}" label="Published" value={loading?'...':stats.published} color="#10b981" href="/admin/games?status=published" />
        <StatCard icon="\u{1F7E1}" label="Drafts" value={loading?'...':stats.draft} color="#f59e0b" href="/admin/games?status=draft" />
        <StatCard icon="\u{1F465}" label="Users" value={loading?'...':stats.users} color="#3b82f6" href="/admin/users" />
        <StatCard icon="\u{1F4E5}" label="Downloads" value={loading?'...':stats.downloads.toLocaleString()} color="#8b5cf6" href="/admin/analytics" />
        <StatCard icon="\u{1F441}\uFE0F" label="Page Views" value={loading?'...':stats.views.toLocaleString()} color="#ec4899" href="/admin/analytics" />
        <StatCard icon="\u{1F4AC}" label="Comments" value={loading?'...':stats.comments} color="#06b6d4" href="/admin/comments" />
        <StatCard icon="\u23F3" label="Pending" value={loading?'...':stats.pending} color="#f97316" href="/admin/comments?status=pending" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
        {/* Recent Games */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:'1px solid #e2e8f0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <h3 style={{ margin:0, fontSize:'15px', fontWeight:700, color:'#1e293b' }}>Recent Games</h3>
            <Link href="/admin/games" style={{ fontSize:'13px', color:'#6366f1', textDecoration:'none' }}>View all</Link>
          </div>
          {loading ? <p style={{ color:'#94a3b8', fontSize:'14px' }}>Loading...</p> :
            recent.length === 0 ? <p style={{ color:'#94a3b8', fontSize:'14px' }}>No games yet. <Link href="/admin/games/add" style={{ color:'#6366f1' }}>Add first game</Link></p> :
            recent.map((g:any) => (
              <div key={g.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f1f5f9' }}>
                <div>
                  <p style={{ margin:0, fontWeight:600, fontSize:'13px', color:'#1e293b' }}>{g.title}</p>
                  <p style={{ margin:'2px 0 0', fontSize:'12px', color:'#64748b' }}>{g.category} \u2022 {g.size}</p>
                </div>
                <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background: g.status==='published'?'#d1fae5':g.status==='draft'?'#fef3c7':'#f1f5f9', color: g.status==='published'?'#065f46':g.status==='draft'?'#92400e':'#475569' }}>
                  {g.status}
                </span>
              </div>
            ))
          }
        </div>

        {/* Recent Comments */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:'1px solid #e2e8f0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <h3 style={{ margin:0, fontSize:'15px', fontWeight:700, color:'#1e293b' }}>Recent Comments</h3>
            <Link href="/admin/comments" style={{ fontSize:'13px', color:'#6366f1', textDecoration:'none' }}>View all</Link>
          </div>
          {loading ? <p style={{ color:'#94a3b8', fontSize:'14px' }}>Loading...</p> :
            recentComments.length === 0 ? <p style={{ color:'#94a3b8', fontSize:'14px' }}>No comments yet.</p> :
            recentComments.map((c:any) => (
              <div key={c.id} style={{ padding:'10px 0', borderBottom:'1px solid #f1f5f9' }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <p style={{ margin:0, fontWeight:600, fontSize:'13px', color:'#1e293b' }}>{c.name || c.user?.username || 'Anonymous'}</p>
                  <span style={{ padding:'2px 8px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background: c.status==='approved'?'#d1fae5':c.status==='pending'?'#fef3c7':'#fee2e2', color: c.status==='approved'?'#065f46':c.status==='pending'?'#92400e':'#991b1b' }}>{c.status}</span>
                </div>
                <p style={{ margin:'3px 0 0', fontSize:'12px', color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'300px' }}>{c.content}</p>
                <p style={{ margin:'2px 0 0', fontSize:'11px', color:'#94a3b8' }}>on: {c.game?.title}</p>
              </div>
            ))
          }
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ marginTop:'24px', background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:'1px solid #e2e8f0' }}>
        <h3 style={{ margin:'0 0 16px', fontSize:'15px', fontWeight:700, color:'#1e293b' }}>Quick Access</h3>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          {[
            {href:'/admin/games/add',icon:'\u2795',label:'Add Game',c:'#6366f1'},
            {href:'/admin/appearance',icon:'\u{1F3A8}',label:'Appearance',c:'#8b5cf6'},
            {href:'/admin/seo',icon:'\u{1F50D}',label:'SEO',c:'#0ea5e9'},
            {href:'/admin/ads',icon:'\u{1F4B0}',label:'Ads',c:'#f59e0b'},
            {href:'/admin/users',icon:'\u{1F465}',label:'Users',c:'#10b981'},
            {href:'/admin/analytics',icon:'\u{1F4C8}',label:'Analytics',c:'#ec4899'},
            {href:'/admin/security',icon:'\u{1F6E1}\uFE0F',label:'Security',c:'#ef4444'},
            {href:'/admin/backup',icon:'\u{1F4BE}',label:'Backup',c:'#64748b'},
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'8px', background:item.c+'15', color:item.c, textDecoration:'none', fontWeight:600, fontSize:'13px', border:'1px solid '+item.c+'30' }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}