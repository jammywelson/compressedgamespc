'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const STATUS_COLORS: Record<string,string[]> = {
  published: ['#d1fae5','#065f46'],
  draft: ['#fef3c7','#92400e'],
  scheduled: ['#dbeafe','#1e40af'],
  archived: ['#f1f5f9','#475569'],
}

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [deleting, setDeleting] = useState<string|null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    const r = await fetch('/api/games?' + params)
    const d = await r.json()
    setGames(d.games || [])
    setTotal(d.total || 0)
    setPages(d.pages || 1)
    setLoading(false)
  }, [page, search, status])

  useEffect(() => { load() }, [load])

  const deleteGame = async (id: string) => {
    if (!confirm('Delete this game?')) return
    setDeleting(id)
    await fetch('/api/games/' + id, { method: 'DELETE' })
    load()
    setDeleting(null)
  }

  const bulkAction = async (action: string) => {
    if (!selected.length) return
    if (!confirm('Apply "' + action + '" to ' + selected.length + ' games?')) return
    await Promise.all(selected.map(id => {
      if (action === 'delete') return fetch('/api/games/' + id, { method: 'DELETE' })
      return fetch('/api/games/' + id, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: action }) })
    }))
    setSelected([])
    load()
  }

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id])
  const selectAll = () => setSelected(games.map(g=>g.id))
  const clearSelect = () => setSelected([])

  const inp: any = { border:'1px solid #e2e8f0', borderRadius:'8px', padding:'8px 12px', fontSize:'13px', outline:'none', background:'#fff' }

  return (
    <div style={{ padding:'20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'22px', fontWeight:700, color:'#1e293b' }}>\u{1F3AE} Games Management</h1>
          <p style={{ margin:'4px 0 0', fontSize:'13px', color:'#64748b' }}>{total} total games</p>
        </div>
        <Link href="/admin/games/add" style={{ display:'flex', alignItems:'center', gap:'8px', background:'#6366f1', color:'#fff', padding:'10px 20px', borderRadius:'8px', textDecoration:'none', fontWeight:600, fontSize:'14px' }}>
          \u2795 Add New Game
        </Link>
      </div>

      {/* Filters */}
      <div style={{ background:'#fff', borderRadius:'12px', padding:'16px', marginBottom:'16px', border:'1px solid #e2e8f0', display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
        <input style={{ ...inp, flex:1, minWidth:'200px' }} placeholder="\u{1F50D} Search games..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} />
        <select style={inp} value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </select>
        {selected.length > 0 && (
          <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
            <span style={{ fontSize:'13px', color:'#6366f1', fontWeight:600 }}>{selected.length} selected</span>
            <select style={{ ...inp, color:'#ef4444' }} onChange={e=>{if(e.target.value)bulkAction(e.target.value);e.target.value=''}} defaultValue="">
              <option value="">Bulk Actions</option>
              <option value="published">Publish</option>
              <option value="draft">Draft</option>
              <option value="archived">Archive</option>
              <option value="delete">Delete</option>
            </select>
            <button onClick={clearSelect} style={{ border:'none', background:'transparent', cursor:'pointer', color:'#64748b', fontSize:'13px' }}>Clear</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'2px solid #e2e8f0', background:'#f8fafc' }}>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:600, color:'#64748b' }}>
                <input type="checkbox" onChange={e=>e.target.checked?selectAll():clearSelect()} checked={selected.length===games.length&&games.length>0} />
              </th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:600, color:'#64748b' }}>GAME</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:600, color:'#64748b' }}>CATEGORY</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:600, color:'#64748b' }}>STATUS</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:600, color:'#64748b' }}>DOWNLOADS</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:600, color:'#64748b' }}>DATE</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:600, color:'#64748b' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding:'40px', textAlign:'center', color:'#94a3b8' }}>Loading...</td></tr>
            ) : games.length === 0 ? (
              <tr><td colSpan={7} style={{ padding:'60px', textAlign:'center' }}>
                <div style={{ fontSize:'40px', marginBottom:'12px' }}>\u{1F3AE}</div>
                <p style={{ color:'#94a3b8', margin:'0 0 12px' }}>No games found</p>
                <Link href="/admin/games/add" style={{ color:'#6366f1', fontWeight:600, textDecoration:'none' }}>Add your first game</Link>
              </td></tr>
            ) : games.map(g => (
              <tr key={g.id} style={{ borderBottom:'1px solid #f1f5f9', background:selected.includes(g.id)?'#f5f3ff':'transparent' }}>
                <td style={{ padding:'12px 16px' }}>
                  <input type="checkbox" checked={selected.includes(g.id)} onChange={()=>toggleSelect(g.id)} />
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    {g.coverImage ? <img src={g.coverImage} alt="" style={{ width:'36px', height:'36px', borderRadius:'6px', objectFit:'cover' }} /> : <div style={{ width:'36px', height:'36px', borderRadius:'6px', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>\u{1F3AE}</div>}
                    <div>
                      <p style={{ margin:0, fontWeight:600, fontSize:'13px', color:'#1e293b' }}>{g.title}</p>
                      <p style={{ margin:'2px 0 0', fontSize:'11px', color:'#94a3b8' }}>{g.slug}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding:'12px 16px', fontSize:'13px', color:'#475569' }}>{g.category}</td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:STATUS_COLORS[g.status]?.[0]||'#f1f5f9', color:STATUS_COLORS[g.status]?.[1]||'#475569' }}>{g.status}</span>
                </td>
                <td style={{ padding:'12px 16px', fontSize:'13px', color:'#475569' }}>{(g.downloadCount||0).toLocaleString()}</td>
                <td style={{ padding:'12px 16px', fontSize:'12px', color:'#94a3b8' }}>{new Date(g.createdAt).toLocaleDateString()}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <Link href={'/admin/games/' + g.id + '/edit'} style={{ padding:'5px 10px', borderRadius:'6px', background:'#f0f9ff', color:'#0284c7', textDecoration:'none', fontSize:'12px', fontWeight:600 }}>Edit</Link>
                    <a href={'/games/' + g.slug} target="_blank" style={{ padding:'5px 10px', borderRadius:'6px', background:'#f0fdf4', color:'#16a34a', textDecoration:'none', fontSize:'12px', fontWeight:600 }}>View</a>
                    <button onClick={()=>deleteGame(g.id)} disabled={deleting===g.id} style={{ padding:'5px 10px', borderRadius:'6px', background:'#fff1f2', color:'#e11d48', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600 }}>{deleting===g.id?'...':'Delete'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'20px' }}>
          {Array.from({length:pages},(_,i)=>i+1).map(p => (
            <button key={p} onClick={()=>setPage(p)} style={{ width:'36px', height:'36px', borderRadius:'8px', border:'1px solid', borderColor:p===page?'#6366f1':'#e2e8f0', background:p===page?'#6366f1':'#fff', color:p===page?'#fff':'#475569', cursor:'pointer', fontWeight:600, fontSize:'13px' }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}