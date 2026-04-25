'use client'
import { useState, useEffect } from 'react'

const ROLES = ['super_admin','admin','moderator','editor','viewer']
const RC: Record<string,string[]> = {super_admin:['#fef3c7','#92400e'],admin:['#dbeafe','#1e40af'],moderator:['#d1fae5','#065f46'],editor:['#f5f3ff','#5b21b6'],viewer:['#f1f5f9','#475569']}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({username:'',email:'',password:'',role:'editor',displayName:''})

  const load = async () => { setLoading(true); const r = await fetch('/api/users'); setUsers(await r.json()); setLoading(false) }
  useEffect(()=>{load()},[])
  const set = (k:string,v:any) => setForm(p=>({...p,[k]:v}))

  const save = async () => {
    if (!form.username||!form.email||!form.password) return alert('Username, email, password required')
    setSaving(true)
    const r = await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    const d = await r.json()
    setSaving(false)
    if (d.id) { setForm({username:'',email:'',password:'',role:'editor',displayName:''}); setShow(false); load() }
    else alert('Error: '+(d.error||'Unknown'))
  }

  const toggle = async (id:string, suspended:boolean) => {
    await fetch('/api/users/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({suspended:!suspended})}); load()
  }

  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'5px'}

  return (
    <div style={{padding:'20px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>&#128101; Users</h1>
        <button onClick={()=>setShow(!show)} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 20px',fontWeight:600,cursor:'pointer'}}>{show?'Cancel':'+ Add User'}</button>
      </div>
      {show && (
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'20px',border:'2px solid #e2e8f0'}}>
          <h3 style={{margin:'0 0 16px',fontWeight:700}}>Create New User</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'14px'}}>
            <div><label style={lbl}>Username *</label><input style={inp} value={form.username} onChange={e=>set('username',e.target.value)} /></div>
            <div><label style={lbl}>Email *</label><input style={inp} type="email" value={form.email} onChange={e=>set('email',e.target.value)} /></div>
            <div><label style={lbl}>Password *</label><input style={inp} type="password" value={form.password} onChange={e=>set('password',e.target.value)} /></div>
            <div><label style={lbl}>Display Name</label><input style={inp} value={form.displayName} onChange={e=>set('displayName',e.target.value)} /></div>
            <div><label style={lbl}>Role</label><select style={inp} value={form.role} onChange={e=>set('role',e.target.value)}>{ROLES.map(r=><option key={r} value={r}>{r.replace(/_/g,' ')}</option>)}</select></div>
          </div>
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>{saving?'Creating...':'Create User'}</button>
        </div>
      )}
      <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
        {loading?<p style={{padding:'40px',textAlign:'center',color:'#94a3b8'}}>Loading...</p>:
        users.length===0?<p style={{padding:'40px',textAlign:'center',color:'#94a3b8'}}>No users yet.</p>:
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#f8fafc',borderBottom:'2px solid #e2e8f0'}}>
            {['USER','ROLE','STATUS','LAST LOGIN','ACTIONS'].map(h=><th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'12px',fontWeight:700,color:'#64748b'}}>{h}</th>)}
          </tr></thead>
          <tbody>{users.map((u:any)=>(
            <tr key={u.id} style={{borderBottom:'1px solid #f1f5f9'}}>
              <td style={{padding:'12px 16px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'14px',flexShrink:0}}>{u.username.charAt(0).toUpperCase()}</div>
                  <div><p style={{margin:0,fontWeight:600,fontSize:'13px'}}>{u.displayName||u.username}</p><p style={{margin:'2px 0 0',fontSize:'12px',color:'#94a3b8'}}>{u.email}</p></div>
                </div>
              </td>
              <td style={{padding:'12px 16px'}}><span style={{padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:RC[u.role]?.[0]||'#f1f5f9',color:RC[u.role]?.[1]||'#475569'}}>{u.role.replace(/_/g,' ')}</span></td>
              <td style={{padding:'12px 16px'}}><span style={{padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:u.suspended?'#fee2e2':u.active?'#d1fae5':'#f1f5f9',color:u.suspended?'#991b1b':u.active?'#065f46':'#475569'}}>{u.suspended?'Suspended':u.active?'Active':'Inactive'}</span></td>
              <td style={{padding:'12px 16px',fontSize:'12px',color:'#94a3b8'}}>{u.lastLoginAt?new Date(u.lastLoginAt).toLocaleDateString():'Never'}</td>
              <td style={{padding:'12px 16px'}}><button onClick={()=>toggle(u.id,u.suspended)} style={{padding:'5px 12px',borderRadius:'6px',background:u.suspended?'#d1fae5':'#fee2e2',color:u.suspended?'#065f46':'#991b1b',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600}}>{u.suspended?'Restore':'Suspend'}</button></td>
            </tr>
          ))}</tbody>
        </table>}
      </div>
    </div>
  )
}