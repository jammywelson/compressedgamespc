'use client'
import { useState, useEffect } from 'react'

const STATUS_COLORS: Record<string,string[]> = {
  approved:['#d1fae5','#065f46'], pending:['#fef3c7','#92400e'], spam:['#fee2e2','#991b1b']
}

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const load = async () => {
    setLoading(true)
    const url = '/api/admin/comments' + (filter ? '?status=' + filter : '')
    const r = await fetch(url)
    setComments(await r.json())
    setLoading(false)
  }
  useEffect(()=>{load()},[filter])

  const action = async (id:string, status:string) => {
    await fetch('/api/admin/comments', {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})})
    load()
  }
  const del = async (id:string) => {
    if (!confirm('Delete this comment?')) return
    await fetch('/api/admin/comments', {method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})})
    load()
  }

  return (
    <div style={{padding:'20px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>\u{1F4AC} Comments</h1>
        <div style={{display:'flex',gap:'8px'}}>
          {['','pending','approved','spam'].map(s => (
            <button key={s} onClick={()=>setFilter(s)} style={{padding:'8px 16px',borderRadius:'8px',border:'1px solid',borderColor:filter===s?'#6366f1':'#e2e8f0',background:filter===s?'#6366f1':'#fff',color:filter===s?'#fff':'#64748b',cursor:'pointer',fontWeight:600,fontSize:'13px'}}>
              {s||'All'}
            </button>
          ))}
        </div>
      </div>

      <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
        {loading ? <p style={{padding:'40px',textAlign:'center',color:'#94a3b8'}}>Loading...</p> :
          comments.length === 0 ? <p style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>No comments found.</p> :
          comments.map(c => (
            <div key={c.id} style={{padding:'16px',borderBottom:'1px solid #f1f5f9'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'13px',color:'#475569'}}>{(c.name||'A').charAt(0)}</div>
                  <div>
                    <p style={{margin:0,fontWeight:600,fontSize:'13px'}}>{c.name||c.user?.username||'Anonymous'}</p>
                    <p style={{margin:'2px 0 0',fontSize:'11px',color:'#94a3b8'}}>{c.email} \u2022 {new Date(c.createdAt).toLocaleDateString()} \u2022 on: <b>{c.game?.title}</b></p>
                  </div>
                </div>
                <span style={{padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:STATUS_COLORS[c.status]?.[0]||'#f1f5f9',color:STATUS_COLORS[c.status]?.[1]||'#475569'}}>{c.status}</span>
              </div>
              <p style={{margin:'0 0 12px',fontSize:'14px',color:'#374151',padding:'12px',background:'#f8fafc',borderRadius:'8px'}}>{c.content}</p>
              <div style={{display:'flex',gap:'8px'}}>
                {c.status!=='approved'&&<button onClick={()=>action(c.id,'approved')} style={{padding:'5px 12px',borderRadius:'6px',background:'#d1fae5',color:'#065f46',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600}}>\u2713 Approve</button>}
                {c.status!=='spam'&&<button onClick={()=>action(c.id,'spam')} style={{padding:'5px 12px',borderRadius:'6px',background:'#fef3c7',color:'#92400e',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600}}>Spam</button>}
                <button onClick={()=>del(c.id)} style={{padding:'5px 12px',borderRadius:'6px',background:'#fee2e2',color:'#991b1b',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600}}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}