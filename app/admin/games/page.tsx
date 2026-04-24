'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Game {
  id: string; title: string; slug: string; category: string
  size: string; originalSize?: string; status: string
  downloadCount: number; featured: boolean; createdAt: string
}

const SI: React.CSSProperties = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'8px 12px', color:'#111827', fontSize:'13px', outline:'none', fontFamily:'inherit' }

function badge(s: string) {
  return { hot:{bg:'#fef2f2',color:'#e53935',label:'Hot'}, active:{bg:'#f0fdf4',color:'#16a34a',label:'Active'}, draft:{bg:'#f9fafb',color:'#6b7280',label:'Draft'} }[s] || {bg:'#f9fafb',color:'#6b7280',label:s}
}

export default function AdminGamesPage() {
  const [games,  setGames]   = useState<Game[]>([])
  const [loading,setLoading] = useState(true)
  const [search, setSearch]  = useState('')
  const [catF,   setCatF]    = useState('')
  const [statF,  setStatF]   = useState('')
  const [sel,    setSel]     = useState<string[]>([])
  const [delId,  setDelId]   = useState<string|null>(null)
  const [bulkAct,setBulkAct] = useState('')
  const [bulkCfm,setBulkCfm] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/games')
      const data = await res.json()
      setGames(Array.isArray(data) ? data : [])
    } catch(e) { setGames([]) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const cats = [...new Set(games.map(g => g.category))]

  const filtered = games.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) &&
    (!catF || g.category === catF) &&
    (!statF || g.status === statF)
  )

  const toggleSel  = (id: string) => setSel(s => s.includes(id)?s.filter(x=>x!==id):[...s,id])
  const toggleAll  = () => setSel(s => s.length===filtered.length?[]:filtered.map(g=>g.id))

  const doDelete = async (id: string) => {
    await fetch(`/api/games/${id}`, { method:'DELETE' })
    setDelId(null); load()
  }

  const toggleFeat = async (g: Game) => {
    await fetch(`/api/games/${g.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ featured:!g.featured }) })
    load()
  }

  const applyBulk = async () => {
    if (bulkAct==='delete') {
      await Promise.all(sel.map(id => fetch(`/api/games/${id}`, { method:'DELETE' })))
    } else {
      await Promise.all(sel.map(id => fetch(`/api/games/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status:bulkAct }) })))
    }
    setSel([]); setBulkAct(''); setBulkCfm(false); load()
  }

  return (
    <div style={{ background:'#f0f2f8', minHeight:'100vh' }}>
      {delId && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <div style={{ background:'#fff',borderRadius:'12px',padding:'28px',width:'360px',textAlign:'center' as any }}>
            <div style={{ fontSize:'32px',marginBottom:'10px' }}>🗑</div>
            <div style={{ fontFamily:'system-ui',fontSize:'18px',fontWeight:700,color:'#111827',marginBottom:'8px' }}>Delete Game?</div>
            <div style={{ fontSize:'13px',color:'#6b7280',marginBottom:'20px' }}>"{games.find(g=>g.id===delId)?.title}" permanently delete hoga</div>
            <div style={{ display:'flex',gap:'10px' }}>
              <button onClick={()=>setDelId(null)} style={{ flex:1,background:'#f3f4f6',color:'#374151',border:'none',borderRadius:'8px',padding:'10px',cursor:'pointer',fontFamily:'inherit' }}>Cancel</button>
              <button onClick={()=>doDelete(delId)} style={{ flex:1,background:'#e53935',color:'#fff',border:'none',borderRadius:'8px',padding:'10px',fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {bulkCfm && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <div style={{ background:'#fff',borderRadius:'12px',padding:'28px',width:'360px',textAlign:'center' as any }}>
            <div style={{ fontSize:'32px',marginBottom:'10px' }}>{bulkAct==='delete'?'🗑':'✏️'}</div>
            <div style={{ fontFamily:'system-ui',fontSize:'18px',fontWeight:700,color:'#111827',marginBottom:'8px' }}>{sel.length} Games {bulkAct==='delete'?'Delete':'Update'}?</div>
            <div style={{ display:'flex',gap:'10px' }}>
              <button onClick={()=>setBulkCfm(false)} style={{ flex:1,background:'#f3f4f6',color:'#374151',border:'none',borderRadius:'8px',padding:'10px',cursor:'pointer',fontFamily:'inherit' }}>Cancel</button>
              <button onClick={applyBulk} style={{ flex:1,background:bulkAct==='delete'?'#e53935':'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'10px',fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:'54px',display:'flex',alignItems:'center',gap:'12px' }}>
        <span style={{ fontFamily:'system-ui',fontSize:'18px',fontWeight:700,color:'#111827' }}>All Games</span>
        <Link href="/admin/games/add" style={{ marginLeft:'auto',background:'#4f46e5',color:'#fff',borderRadius:'7px',padding:'8px 16px',fontSize:'13px',fontWeight:600,textDecoration:'none' }}>+ Add New Game</Link>
      </div>

      <div style={{ padding:'24px' }}>
        <div style={{ background:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',overflow:'hidden' }}>
          <div style={{ padding:'14px 20px',borderBottom:'1px solid #f3f4f6',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
            <span style={{ fontFamily:'system-ui',fontSize:'16px',fontWeight:700,color:'#111827' }}>Games List</span>
            <span style={{ fontSize:'12px',color:'#6b7280',background:'#f9fafb',border:'1px solid #e5e7eb',padding:'3px 10px',borderRadius:'6px' }}>{games.length} games</span>
          </div>

          <div style={{ padding:'12px 20px',borderBottom:'1px solid #f3f4f6',background:'#fafafa',display:'flex',gap:'8px',flexWrap:'wrap' as any }}>
            <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{ ...SI,flex:1,minWidth:'160px' }}/>
            <select value={catF} onChange={e=>setCatF(e.target.value)} style={{ ...SI,cursor:'pointer' }}>
              <option value="">All Categories</option>
              {cats.map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={statF} onChange={e=>setStatF(e.target.value)} style={{ ...SI,cursor:'pointer' }}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="hot">Hot</option>
              <option value="draft">Draft</option>
            </select>
            <button onClick={load} style={{ ...SI,cursor:'pointer',background:'#f3f4f6' }}>↻ Refresh</button>
          </div>

          {sel.length > 0 && (
            <div style={{ padding:'10px 20px',borderBottom:'1px solid #f3f4f6',background:'#eef2ff',display:'flex',alignItems:'center',gap:'8px' }}>
              <span style={{ fontSize:'13px',fontWeight:600,color:'#4f46e5' }}>{sel.length} selected</span>
              <button onClick={()=>{setBulkAct('active');setBulkCfm(true)}} style={{ background:'#f0fdf4',color:'#16a34a',border:'1px solid #bbf7d0',borderRadius:'6px',padding:'5px 10px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit' }}>Set Active</button>
              <button onClick={()=>{setBulkAct('hot');setBulkCfm(true)}} style={{ background:'#fef2f2',color:'#e53935',border:'1px solid #fca5a5',borderRadius:'6px',padding:'5px 10px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit' }}>Set Hot</button>
              <button onClick={()=>{setBulkAct('draft');setBulkCfm(true)}} style={{ background:'#f9fafb',color:'#6b7280',border:'1px solid #e5e7eb',borderRadius:'6px',padding:'5px 10px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit' }}>Set Draft</button>
              <button onClick={()=>{setBulkAct('delete');setBulkCfm(true)}} style={{ background:'#e53935',color:'#fff',border:'none',borderRadius:'6px',padding:'5px 10px',fontSize:'12px',fontWeight:600,cursor:'pointer',fontFamily:'inherit' }}>Delete</button>
              <button onClick={()=>setSel([])} style={{ marginLeft:'auto',background:'transparent',color:'#9ca3af',border:'none',cursor:'pointer',fontFamily:'inherit' }}>Deselect</button>
            </div>
          )}

          {loading ? (
            <div style={{ padding:'60px',textAlign:'center' as any,color:'#6b7280' }}>Loading...</div>
          ) : games.length === 0 ? (
            <div style={{ padding:'60px',textAlign:'center' as any }}>
              <div style={{ fontSize:'48px',marginBottom:'12px' }}>🎮</div>
              <div style={{ fontFamily:'system-ui',fontSize:'20px',fontWeight:700,color:'#111827',marginBottom:'8px' }}>Koi game nahi</div>
              <Link href="/admin/games/add" style={{ background:'#4f46e5',color:'#fff',borderRadius:'8px',padding:'10px 24px',fontSize:'13px',fontWeight:600,textDecoration:'none' }}>+ Add First Game</Link>
            </div>
          ) : (
            <div style={{ overflowX:'auto' as any }}>
              <table style={{ width:'100%',borderCollapse:'collapse' as any }}>
                <thead>
                  <tr style={{ background:'#f9fafb' }}>
                    <th style={{ padding:'10px 16px',borderBottom:'1px solid #f0f0f0',width:'36px' }}>
                      <input type="checkbox" checked={sel.length===filtered.length&&filtered.length>0} onChange={toggleAll} style={{ cursor:'pointer',accentColor:'#4f46e5' }}/>
                    </th>
                    {['Game','Category','Size','Status','⭐','Downloads','Actions'].map(h=>(
                      <th key={h} style={{ textAlign:'left' as any,fontSize:'11px',color:'#6b7280',textTransform:'uppercase' as any,letterSpacing:'.4px',padding:'10px 14px',borderBottom:'1px solid #f0f0f0',fontWeight:600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g,i)=>{
                    const b = badge(g.status)
                    return (
                      <tr key={g.id} style={{ borderBottom:'1px solid #f9fafb',background:sel.includes(g.id)?'#f0f4ff':i%2===0?'#fff':'#fafafa' }}>
                        <td style={{ padding:'10px 16px' }}><input type="checkbox" checked={sel.includes(g.id)} onChange={()=>toggleSel(g.id)} style={{ cursor:'pointer',accentColor:'#4f46e5' }}/></td>
                        <td style={{ padding:'10px 14px' }}>
                          <div style={{ display:'flex',alignItems:'center',gap:'8px' }}>
                            <div style={{ width:'38px',height:'38px',borderRadius:'7px',background:'linear-gradient(135deg,#1a1f3c,#252b4a)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,.5)',fontSize:'14px',fontWeight:700 }}>{g.title.charAt(0)}</div>
                            <div>
                              <div style={{ fontSize:'13px',fontWeight:600,color:'#111827' }}>{g.title}</div>
                              <div style={{ fontSize:'10px',color:'#9ca3af',fontFamily:'monospace' }}>/games/{g.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:'10px 14px' }}><span style={{ background:'#eef2ff',color:'#4f46e5',fontSize:'11px',padding:'2px 7px',borderRadius:'4px' }}>{g.category}</span></td>
                        <td style={{ padding:'10px 14px',fontSize:'13px',color:'#16a34a',fontWeight:700 }}>{g.size}</td>
                        <td style={{ padding:'10px 14px' }}><span style={{ background:b.bg,color:b.color,fontSize:'11px',padding:'3px 8px',borderRadius:'5px',fontWeight:600 }}>{b.label}</span></td>
                        <td style={{ padding:'10px 14px',textAlign:'center' as any }}>
                          <button onClick={()=>toggleFeat(g)} style={{ background:'transparent',border:'none',cursor:'pointer',fontSize:'18px',opacity:g.featured?1:.25 }}>⭐</button>
                        </td>
                        <td style={{ padding:'10px 14px',fontSize:'13px',color:'#374151' }}>{g.downloadCount||0}</td>
                        <td style={{ padding:'10px 14px' }}>
                          <div style={{ display:'flex',gap:'5px' }}>
                            <Link href={`/admin/games/${g.id}/edit`} style={{ background:'#eef2ff',color:'#4f46e5',border:'1px solid #c7d2fe',borderRadius:'5px',padding:'5px 10px',fontSize:'11px',fontWeight:500,textDecoration:'none' }}>Edit</Link>
                            <button onClick={()=>setDelId(g.id)} style={{ background:'#fef2f2',color:'#e53935',border:'1px solid #fca5a5',borderRadius:'5px',padding:'5px 10px',fontSize:'11px',cursor:'pointer',fontFamily:'inherit' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
