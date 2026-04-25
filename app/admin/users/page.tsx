'use client'
import { useState, useEffect } from 'react'

const ROLES = ['super_admin','admin','moderator','editor','viewer']
const ROLE_COLORS: any = { super_admin:'#7c3aed', admin:'#4f46e5', moderator:'#0891b2', editor:'#059669', viewer:'#64748b' }

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name:'',username:'',email:'',password:'',role:'editor' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadUsers() }, [])

  const loadUsers = () => {
    setLoading(true)
    fetch('/api/admin/users').then(r=>r.json()).then(d=>setUsers(d.users||[])).finally(()=>setLoading(false))
  }

  const set = (k:string,v:any) => setForm(p=>({...p,[k]:v}))

  const addUser = async () => {
    if (!form.name||!form.email||!form.password) return alert('Name, email and password required')
    setSaving(true)
    const r = await fetch('/api/admin/users', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    const d = await r.json()
    if (r.ok) { setShowAdd(false); setForm({name:'',username:'',email:'',password:'',role:'editor'}); loadUsers() }
    else alert(d.error || 'Failed')
    setSaving(false)
  }

  const changeRole = async (id:string, role:string) => {
    await fetch('/api/admin/users/'+id, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({role}) })
    loadUsers()
  }

  const toggleActive = async (id:string, active:boolean) => {
    await fetch('/api/admin/users/'+id, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({active:!active}) })
    loadUsers()
  }

  const deleteUser = async (id:string) => {
    if (!confirm('Delete this user?')) return
    await fetch('/api/admin/users/'+id, { method:'DELETE' })
    loadUsers()
  }

  const inp: any = { border:'1px solid #e2e8f0', borderRadius:'8px', padding:'8px 12px', fontSize:'14px', outline:'none', width:'100%', boxSizing:'border-box' }
  const lbl: any = { display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <h1 style={{ margin:0, fontSize:'22px', fontWeight:700, color:'#0f172a' }}>Users ({users.length})</h1>
        <button onClick={()=>setShowAdd(!showAdd)} style={{ background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:600, cursor:'pointer', fontSize:'14px' }}>\u2795 Add User</button>
      </div>

      {showAdd && (<div style={{ background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', marginBottom:'16px' }}>
        <h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>Add New User</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
          <div><label style={lbl}>Name *</label><input style={inp} value={form.name} onChange={e=>set('name',e.target.value)} /></div>
          <div><label style={lbl}>Username</label><input style={inp} value={form.username} onChange={e=>set('username',e.target.value)} /></div>
          <div><label style={lbl}>Email *</label><input style={inp} type='email' value={form.email} onChange={e=>set('email',e.target.value)} /></div>
          <div><label style={lbl}>Password *</label><input style={inp} type='password' value={form.password} onChange={e=>set('password',e.target.value)} /></div>
          <div><label style={lbl}>Role</label><select style={inp} value={form.role} onChange={e=>set('role',e.target.value)}>{ROLES.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={addUser} disabled={saving} style={{ background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:600, cursor:'pointer' }}>{saving?'Creating...':'Create User'}</button>
          <button onClick={()=>setShowAdd(false)} style={{ background:'#f1f5f9', color:'#374151', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
        </div>
      </div>)}

      <div style={{ background:'#fff', borderRadius:'12px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ background:'#f8fafc' }}>
            {['User','Email','Role','Status','Joined','Actions'].map(h=><th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:600, color:'#64748b' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={6} style={{ padding:'40px', textAlign:'center', color:'#94a3b8' }}>Loading...</td></tr>
            :users.map((u:any)=>(
              <tr key={u.id} style={{ borderTop:'1px solid #f1f5f9' }}>
                <td style={{ padding:'12px 16px' }}><div style={{ fontWeight:600, fontSize:'13px', color:'#0f172a' }}>{u.name}</div><div style={{ fontSize:'11px', color:'#94a3b8' }}>@{u.username}</div></td>
                <td style={{ padding:'12px 16px', fontSize:'13px', color:'#374151' }}>{u.email}</td>
                <td style={{ padding:'12px 16px' }}>
                  <select value={u.role} onChange={e=>changeRole(u.id,e.target.value)} style={{ border:'none', background:ROLE_COLORS[u.role]+'20', color:ROLE_COLORS[u.role], borderRadius:'20px', padding:'3px 8px', fontSize:'12px', fontWeight:600, cursor:'pointer', outline:'none' }}>
                    {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td style={{ padding:'12px 16px' }}><button onClick={()=>toggleActive(u.id,u.active)} style={{ background:u.active?'#dcfce7':'#fee2e2', color:u.active?'#16a34a':'#dc2626', border:'none', borderRadius:'20px', padding:'3px 10px', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>{u.active?'Active':'Suspended'}</button></td>
                <td style={{ padding:'12px 16px', fontSize:'12px', color:'#94a3b8' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding:'12px 16px' }}><button onClick={()=>deleteUser(u.id)} style={{ background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'6px', padding:'5px 10px', cursor:'pointer', fontSize:'12px' }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}