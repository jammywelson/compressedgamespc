'use client'
import { useState, useEffect } from 'react'

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name:'', description:'', icon:'', color:'#4f46e5' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCats() }, [])
  const loadCats = () => { setLoading(true); fetch('/api/admin/categories').then(r=>r.json()).then(d=>setCats(d.categories||[])).finally(()=>setLoading(false)) }
  const set = (k:string,v:any) => setForm(p=>({...p,[k]:v}))

  const save = async () => {
    if (!form.name.trim()) return alert('Name required')
    setSaving(true)
    const url = editing ? '/api/admin/categories/'+editing.id : '/api/admin/categories'
    const method = editing ? 'PATCH' : 'POST'
    const r = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) })
    const d = await r.json()
    if (r.ok) { setShowAdd(false); setEditing(null); setForm({name:'',description:'',icon:'',color:'#4f46e5'}); loadCats() }
    else alert(d.error || 'Failed')
    setSaving(false)
  }

  const del = async (id:string) => { if (!confirm('Delete?')) return; await fetch('/api/admin/categories/'+id, {method:'DELETE'}); loadCats() }
  const edit = (c:any) => { setEditing(c); setForm({name:c.name,description:c.description||'',icon:c.icon||'',color:c.color||'#4f46e5'}); setShowAdd(true) }

  const inp: any = { border:'1px solid #e2e8f0', borderRadius:'8px', padding:'8px 12px', fontSize:'14px', outline:'none', width:'100%', boxSizing:'border-box' }
  const lbl: any = { display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <h1 style={{ margin:0, fontSize:'22px', fontWeight:700, color:'#0f172a' }}>Categories</h1>
        <button onClick={()=>{ setShowAdd(!showAdd); setEditing(null); setForm({name:'',description:'',icon:'',color:'#4f46e5'}) }} style={{ background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:600, cursor:'pointer', fontSize:'14px' }}>\u2795 Add Category</button>
      </div>
      {showAdd && (<div style={{ background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', marginBottom:'16px' }}>
        <h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>{editing ? 'Edit' : 'Add'} Category</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
          <div><label style={lbl}>Name *</label><input style={inp} value={form.name} onChange={e=>set('name',e.target.value)} /></div>
          <div><label style={lbl}>Icon (emoji)</label><input style={inp} value={form.icon} onChange={e=>set('icon',e.target.value)} placeholder='\u{1F3AE}' /></div>
          <div><label style={lbl}>Description</label><input style={inp} value={form.description} onChange={e=>set('description',e.target.value)} /></div>
          <div><label style={lbl}>Color</label><div style={{ display:'flex', gap:'8px', alignItems:'center' }}><input type='color' value={form.color} onChange={e=>set('color',e.target.value)} style={{ width:'40px', height:'38px', border:'1px solid #e2e8f0', borderRadius:'8px', cursor:'pointer', padding:'2px' }} /><input style={{ ...inp, flex:1 }} value={form.color} onChange={e=>set('color',e.target.value)} /></div></div>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={save} disabled={saving} style={{ background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:600, cursor:'pointer' }}>{saving?'Saving...':editing?'Update':'Create'}</button>
          <button onClick={()=>{setShowAdd(false);setEditing(null)}} style={{ background:'#f1f5f9', color:'#374151', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
        </div>
      </div>)}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'14px' }}>
        {loading?<div style={{ color:'#94a3b8' }}>Loading...</div>
        :cats.map((c:any)=>(
          <div key={c.id} style={{ background:'#fff', borderRadius:'12px', padding:'16px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', display:'flex', alignItems:'center', gap:'14px' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:c.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>{c.icon || '\u{1F4C2}'}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:'14px', color:'#0f172a' }}>{c.name}</div>
              <div style={{ fontSize:'12px', color:'#94a3b8' }}>{c.gameCount} games</div>
            </div>
            <div style={{ display:'flex', gap:'6px' }}>
              <button onClick={()=>edit(c)} style={{ background:'#f1f5f9', border:'none', borderRadius:'6px', padding:'5px 10px', cursor:'pointer', fontSize:'12px', color:'#374151' }}>Edit</button>
              <button onClick={()=>del(c.id)} style={{ background:'#fee2e2', border:'none', borderRadius:'6px', padding:'5px 10px', cursor:'pointer', fontSize:'12px', color:'#dc2626' }}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}