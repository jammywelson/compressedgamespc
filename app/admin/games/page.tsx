'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 20
  const router = useRouter()

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: String(limit), page: String(page) })
    if (search) params.set('search', search)
    if (status !== 'all') params.set('status', status)
    if (category !== 'all') params.set('category', category)
    const r = await fetch('/api/games?' + params)
    const d = await r.json()
    setGames(d.games || [])
    setTotal(d.total || 0)
    setLoading(false)
  }, [search, status, category, page])

  useEffect(() => { load() }, [load])

  const deleteGame = async (id: string) => {
    if (!confirm('Delete this game?')) return
    await fetch('/api/games/' + id, { method: 'DELETE' })
    load()
  }

  const bulkAction = async (action: string) => {
    if (!selected.length) return alert('Select games first')
    if (!confirm(action + ' ' + selected.length + ' games?')) return
    await Promise.all(selected.map(id => {
      if (action === 'delete') return fetch('/api/games/' + id, { method: 'DELETE' })
      return fetch('/api/games/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: action }) })
    }))
    setSelected([])
    load()
  }

  const toggleSelect = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const selectAll = () => setSelected(selected.length === games.length ? [] : games.map(g => g.id))
  const pages = Math.ceil(total / limit)

  const inp: any = { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none', background: '#fff' }
  const btn = (bg: string, color = '#fff') => ({ background: bg, color, border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' as any, gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Games</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{total} total games</p>
        </div>
        <Link href='/admin/games/add' style={btn('#4f46e5') as any}>\u2795 Add New Game</Link>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' as any, alignItems: 'center' }}>
        <input style={{ ...inp, flex: 1, minWidth: '200px' }} placeholder='Search games...' value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <select style={inp} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
          <option value='all'>All Status</option>
          <option value='published'>Published</option>
          <option value='draft'>Draft</option>
          <option value='scheduled'>Scheduled</option>
        </select>
        <select style={inp} value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}>
          <option value='all'>All Categories</option>
          {['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {selected.length > 0 && (<>
          <span style={{ fontSize: '13px', color: '#64748b' }}>{selected.length} selected</span>
          <select style={inp} onChange={e => { if (e.target.value) bulkAction(e.target.value); e.target.value = '' }} defaultValue=''>
            <option value=''>Bulk Actions</option>
            <option value='published'>Publish</option>
            <option value='draft'>Set Draft</option>
            <option value='delete'>Delete</option>
          </select>
        </>)}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', width: '40px' }}><input type='checkbox' checked={selected.length === games.length && games.length > 0} onChange={selectAll} /></th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Title</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Category</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Size</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Downloads</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
            : games.length === 0 ? <tr><td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>No games found</td></tr>
            : games.map((g: any) => (
              <tr key={g.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px' }}><input type='checkbox' checked={selected.includes(g.id)} onChange={() => toggleSelect(g.id)} /></td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>/{g.slug}</div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{g.category}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{g.size}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: g.status==='published'?'#dcfce7':g.status==='draft'?'#f1f5f9':'#fef9c3', color: g.status==='published'?'#16a34a':g.status==='draft'?'#475569':'#a16207' }}>{g.status}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{g.downloadCount}</td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#94a3b8' }}>{new Date(g.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link href={'/admin/games/edit/'+g.id} style={{ background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>Edit</Link>
                    <Link href={'/games/'+g.slug} target='_blank' style={{ background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', textDecoration: 'none' }}>View</Link>
                    <button onClick={() => deleteGame(g.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: page === p ? '#4f46e5' : '#fff', color: page === p ? '#fff' : '#374151', cursor: 'pointer', fontWeight: page === p ? 600 : 400, boxShadow: '0 1px 2px rgba(0,0,0,.06)' }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}