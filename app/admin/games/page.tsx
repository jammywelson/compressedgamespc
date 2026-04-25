'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [deleting, setDeleting] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const p = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) p.set('search', search)
    if (status) p.set('status', status)
    const r = await fetch('/api/games?' + p)
    const d = await r.json()
    setGames(d.games||[]); setTotal(d.total||0); setPages(d.pages||1)
    setLoading(false)
  }, [page, search, status])

  useEffect(() => { load() }, [load])

  const del = async (id: string) => {
    if (!confirm('Delete this game?')) return
    setDeleting(id)
    await fetch('/api/games/' + id, { method: 'DELETE' })
    setDeleting(''); load()
  }

  const bulkAction = async (action: string) => {
    if (!selected.length || !confirm('Apply "' + action + '" to ' + selected.length + ' games?')) return
    await Promise.all(selected.map(id => action === 'delete'
      ? fetch('/api/games/' + id, { method: 'DELETE' })
      : fetch('/api/games/' + id, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: action }) })
    ))
    setSelected([]); load()
  }

  const sc = (s:string) => ({published:['#dcfce7','#16a34a'],draft:['#fef9c3','#ca8a04'],scheduled:['#dbeafe','#2563eb'],archived:['#f1f5f9','#64748b']})[s]||['#f1f5f9','#64748b']
  const inp: any = { border:'1px solid #e2e8f0', borderRadius:'8px', padding:'8px 12px', fontSize:'13px', outline:'none', background:'#fff' }

  return (
    <div style={{ padding:'24px', background:'#f8fafc', minHeight:'calc(100vh - 60px)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'22px', fontWeight:800, color:'#0f172a' }}>\u{1F3AE} Games Management</h1>
          <p style={{ margin:'4px 0 0', fontSize:'13px', color:'#64748b' }}>{total} total games</p>
        </div>
        <Link href="/admin/games/add" style={{ display:'flex', alignItems:'center', gap:'6px', background:'#6366f1', color:'#fff', padding:'10px 20px', borderRadius:'8px', textDecoration:'none', fontWeight:700, fontSize:'14px', boxShadow:'0 2px 8px rgba(99,102,241,.3)' }}>\u2795 Add New Game</Link>
      </div>

      <div style={{ background:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', padding:'16px', marginBottom:'16px', display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
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
            <span style={{ fontSize:'13px', color:'#6366f1', fontWeight:700 }}>{selected.length} selected</span>
            <select style={{ ...inp, color:'#ef4444' }} onChange={e=>{if(e.target.value){bulkAction(e.target.value);(e.target as any).value=''}}} defaultValue="">
              <option value="">Bulk Actions</option>
              <option value="published">Publish</option>
              <option value="draft">Set Draft</option>
              <option value="archived">Archive</option>
              <option value="delete">Delete</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ background:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e2e8f0' }}>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'#64748b', letterSpacing:'.5px' }}>
                <input type="checkbox" onChange={e=>setSelected(e.target.checked?games.map(g=>g.id):[])} checked={selected.length===games.length&&games.length>0} />
              </th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'#64748b', letterSpacing:'.5px' }}>GAME</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'#64748b' }}>CATEGORY</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'#64748b' }}>STATUS</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'#64748b' }}>DOWNLOADS</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'#64748b' }}>DATE</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'#64748b' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding:'48px', textAlign:'center', color:'#94a3b8' }}>Loading games...</td></tr>
            ) : games.length===0 ? (
              <tr><td colSpan={7} style={{ padding:'64px', textAlign:'center' }}>
                <div style={{ fontSize:'48px', marginBottom:'12px' }}>\u{1F3AE}</div>
                <p style={{ color:'#94a3b8', margin:'0 0 12px', fontSize:'15px' }}>No games found</p>
                <Link href="/admin/games/add" style={{ color:'#6366f1', fontWeight:700, textDecoration:'none' }}>Add your first game \u2192</Link>
              </td></tr>
            ) : games.map(g => (
              <tr key={g.id} style={{ borderBottom:'1px solid #f8fafc', background:selected.includes(g.id)?'#f5f3ff':'transparent' }}>
                <td style={{ padding:'12px 16px' }}><input type="checkbox" checked={selected.includes(g.id)} onChange={()=>setSelected(s=>s.includes(g.id)?s.filter(x=>x!==g.id):[...s,g.id])} /></td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    {g.coverImage ? <img src={g.coverImage} alt="" style={{ width:'38px', height:'38px', borderRadius:'8px', objectFit:'cover', flexShrink:0 }} /> : <div style={{ width:'38px', height:'38px', borderRadius:'8px', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>\u{1F3AE}</div>}
                    <div>
                      <p style={{ margin:0, fontWeight:600, fontSize:'13px', color:'#0f172a' }}>{g.title}</p>
                      <p style={{ margin:'2px 0 0', fontSize:'11px', color:'#94a3b8', fontFamily:'monospace' }}>{g.slug}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding:'12px 16px', fontSize:'13px', color:'#475569' }}>{g.category}</td>
                <td style={{ padding:'12px 16px' }}><span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:700, background:sc(g.status)[0], color:sc(g.status)[1] }}>{g.status}</span></td>
                <td style={{ padding:'12px 16px', fontSize:'13px', color:'#475569', fontWeight:600 }}>{(g.downloadCount||0).toLocaleString()}</td>
                <td style={{ padding:'12px 16px', fontSize:'12px', color:'#94a3b8' }}>{new Date(g.createdAt).toLocaleDateString()}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <Link href={'/admin/games/'+g.id+'/edit'} style={{ padding:'5px 12px', borderRadius:'6px', background:'#eff6ff', color:'#2563eb', textDecoration:'none', fontSize:'12px', fontWeight:700 }}>Edit</Link>
                    <a href={'/games/'+g.slug} target="_blank" style={{ padding:'5px 12px', borderRadius:'6px', background:'#f0fdf4', color:'#16a34a', textDecoration:'none', fontSize:'12px', fontWeight:700 }}>View</a>
                    <button onClick={()=>del(g.id)} disabled={deleting===g.id} style={{ padding:'5px 12px', borderRadius:'6px', background:'#fff1f2', color:'#e11d48', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:700 }}>{deleting===g.id?'...':'Delete'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:'6px', marginTop:'20px' }}>
          {Array.from({length:pages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)} style={{ width:'36px', height:'36px', borderRadius:'8px', border:'1px solid', borderColor:p===page?'#6366f1':'#e2e8f0', background:p===page?'#6366f1':'#fff', color:p===page?'#fff':'#475569', cursor:'pointer', fontWeight:700, fontSize:'13px' }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}