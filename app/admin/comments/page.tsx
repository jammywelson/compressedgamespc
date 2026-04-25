'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { load() }, [filter])
  const load = () => { setLoading(true); fetch('/api/admin/comments?status='+filter).then(r=>r.json()).then(d=>setComments(d.comments||[])).finally(()=>setLoading(false)) }

  const action = async (id:string, status:string) => {
    await fetch('/api/admin/comments/'+id, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status}) })
    load()
  }
  const del = async (id:string) => { if (!confirm('Delete?')) return; await fetch('/api/admin/comments/'+id, {method:'DELETE'}); load() }

  const statColors: any = { approved:'#dcfce7|#16a34a', pending:'#fef9c3|#a16207', spam:'#fee2e2|#dc2626' }
  const getColor = (s:string) => (statColors[s]||'#f1f5f9|#475569').split('|')

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <h1 style={{ margin:0, fontSize:'22px', fontWeight:700, color:'#0f172a' }}>Comments ({comments.length})</h1>
        <div style={{ display:'flex', gap:'8px' }}>
          {['all','pending','approved','spam'].map(s=>(<button key={s} onClick={()=>setFilter(s)} style={{ padding:'8px 16px', borderRadius:'8px', border:'none', cursor:'pointer', fontWeight:600, fontSize:'13px', background:filter===s?'#4f46e5':'#fff', color:filter===s?'#fff':'#374151', boxShadow:'0 1px 2px rgba(0,0,0,.06)', textTransform:'capitalize' as any }}>{s}</button>))}
        </div>
      </div>
      <div style={{ background:'#fff', borderRadius:'12px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', overflow:'hidden' }}>
        {loading?<div style={{ padding:'60px', textAlign:'center', color:'#94a3b8' }}>Loading...</div>
        :comments.length===0?<div style={{ padding:'60px', textAlign:'center', color:'#94a3b8' }}>No comments</div>
        :comments.map((c:any)=>(
          <div key={c.id} style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                  <span style={{ fontWeight:600, fontSize:'13px', color:'#0f172a' }}>{c.author}</span>
                  <span style={{ fontSize:'12px', color:'#94a3b8' }}>{c.email}</span>
                  <span style={{ padding:'2px 8px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:getColor(c.status)[0], color:getColor(c.status)[1] }}>{c.status}</span>
                  {c.game&&<Link href={'/games/'+c.game.slug} target='_blank' style={{ fontSize:'12px', color:'#4f46e5', textDecoration:'none' }}>on: {c.game.title}</Link>}
                </div>
                <div style={{ fontSize:'14px', color:'#374151', lineHeight:1.5 }}>{c.content}</div>
                <div style={{ fontSize:'12px', color:'#94a3b8', marginTop:'4px' }}>{new Date(c.createdAt).toLocaleString()} {c.ip&&'• IP: '+c.ip}</div>
              </div>
              <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                {c.status!=='approved'&&<button onClick={()=>action(c.id,'approved')} style={{ background:'#dcfce7', color:'#16a34a', border:'none', borderRadius:'6px', padding:'5px 10px', cursor:'pointer', fontSize:'12px', fontWeight:600 }}>Approve</button>}
                {c.status!=='spam'&&<button onClick={()=>action(c.id,'spam')} style={{ background:'#fef9c3', color:'#a16207', border:'none', borderRadius:'6px', padding:'5px 10px', cursor:'pointer', fontSize:'12px' }}>Spam</button>}
                <button onClick={()=>del(c.id)} style={{ background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'6px', padding:'5px 10px', cursor:'pointer', fontSize:'12px' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}