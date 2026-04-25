'use client'
import { useState, useEffect } from 'react'

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name:'', slug:'', description:'', icon:'', color:'#6366f1', order:'0' })
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/admin/categories')
    setCats(await r.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const set = (k:string, v:any) => {
    setForm(p => {
      const n = {...p,[k]:v}
      if (k==='name' && !editing) n.slug = v.toLowerCase().replace(/[^a-z0-9]+/g,'-')
      return n
    })
  }

  const save = async () => {
    if (!form.name) return alert('Name required')
    setSaving(true)
    const url = editing ? '/api/admin/categories/' + editing.id : '/api/admin/categories'
    const method = editing ? 'PATCH' : 'POST'
    await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form,order:parseInt(form.order)||0}) })
    setSaving(false)
    setForm({ name:'', slug:'', description:'', icon:'', color:'#6366f1', order:'0' })
    setEditing(null)
    setShowForm(false)
    load()
  }

  const del = async (id:string) => {
    if (!confirm('Delete this category?')) return
    await fetch('/api/admin/categories/' + id, { method:'DELETE' })
    load()
  }

  const startEdit = (cat:any) => {
    setEditing(cat)
    setForm({ name:cat.name, slug:cat.slug, description:cat.description||'', icon:cat.icon||'', color:cat.color||'#6366f1', order:String(cat.order||0) })
    setShowForm(true)
  }

  const inp: any = { width:'100%', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'8px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box' }
  const lbl: any = { display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'5px' }

  return (
    <div style={{ padding:'20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <h1 style={{ margin:0, fontSize:'22px', fontWeight:700 }}>\u{1F4C1} Categories</h1>
        <button onClick={()=>{setShowForm(!showForm);setEditing(null);setForm({name:'',slug:'',description:'',icon:'',color:'#6366f1',order:'0'})}} style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:600, cursor:'pointer' }}>
          {showForm ? 'Cancel' : '\u2795 Add Category'}
        </button>
      </div>

      {showForm && (
        <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'20px', border:'2px solid #e2e8f0' }}>
          <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>{editing ? 'Edit Category' : 'New Category'}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
            <div><label style={lbl}>Name *</label><input style={inp} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Category name" /></div>
            <div><label style={lbl}>Slug</label><input style={inp} value={form.slug} onChange={e=>set('slug',e.target.value)} /></div>
            <div><label style={lbl}>Icon (emoji)</label><input style={inp} value={form.icon} onChange={e=>set('icon',e.target.value)} placeholder="\u{1F3AE}" /></div>
            <div><label style={lbl}>Color</label>
              <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <input type="color" value={form.color} onChange={e=>set('color',e.target.value)} style={{ width:'44px', height:'38px', border:'1px solid #e2e8f0', borderRadius:'8px', cursor:'pointer', padding:'2px' }} />
                <input style={{ ...inp, flex:1 }} value={form.color} onChange={e=>set('color',e.target.value)} />
              </div>
            </div>
            <div><label style={lbl}>Description</label><input style={inp} value={form.description} onChange={e=>set('description',e.target.value)} /></div>
            <div><label style={lbl}>Display Order</label><input style={inp} type="number" value={form.order} onChange={e=>set('order',e.target.value)} /></div>
          </div>
          <button onClick={save} disabled={saving} style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 24px', fontWeight:700, cursor:'pointer' }}>{saving?'Saving...': editing?'Update Category':'Create Category'}</button>
        </div>
      )}

      <div style={{ background:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
        {loading ? <p style={{ padding:'40px', textAlign:'center', color:'#94a3b8' }}>Loading...</p> :
          cats.length === 0 ? <p style={{ padding:'60px', textAlign:'center', color:'#94a3b8' }}>No categories yet. Create your first one!</p> :
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'#f8fafc', borderBottom:'2px solid #e2e8f0' }}>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:700, color:'#64748b' }}>CATEGORY</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:700, color:'#64748b' }}>SLUG</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:700, color:'#64748b' }}>ORDER</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:700, color:'#64748b' }}>STATUS</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:700, color:'#64748b' }}>ACTIONS</th>
            </tr></thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:c.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>{c.icon || '\u{1F4C1}'}</div>
                      <div>
                        <p style={{ margin:0, fontWeight:600, fontSize:'14px' }}>{c.name}</p>
                        {c.description && <p style={{ margin:'2px 0 0', fontSize:'12px', color:'#94a3b8' }}>{c.description.substring(0,50)}</p>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:'13px', color:'#64748b', fontFamily:'monospace' }}>{c.slug}</td>
                  <td style={{ padding:'12px 16px', fontSize:'13px', color:'#64748b' }}>{c.order}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:c.active?'#d1fae5':'#f1f5f9', color:c.active?'#065f46':'#475569' }}>{c.active?'Active':'Inactive'}</span>
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button onClick={()=>startEdit(c)} style={{ padding:'5px 12px', borderRadius:'6px', background:'#f0f9ff', color:'#0284c7', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600 }}>Edit</button>
                      <button onClick={()=>del(c.id)} style={{ padding:'5px 12px', borderRadius:'6px', background:'#fff1f2', color:'#e11d48', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600 }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  )
}