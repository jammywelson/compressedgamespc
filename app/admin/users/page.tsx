'use client'
import { useState, useEffect } from 'react'
const ROLES = ['super_admin','admin','moderator','editor','viewer']
const RC: Record<string,string[]> = {super_admin:['#fef9c3','#854d0e'],admin:['#dbeafe','#1d4ed8'],moderator:['#dcfce7','#15803d'],editor:['#f5f3ff','#6d28d9'],viewer:['#f1f5f9','#475569']}
export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({username:'',email:'',password:'',role:'editor',displayName:''})
  const load=async()=>{setLoading(true);const r=await fetch('/api/users');setUsers(await r.json());setLoading(false)}
  useEffect(()=>{load()},[])
  const set=(k:string,v:any)=>setForm(p=>({...p,[k]:v}))
  const save=async()=>{if(!form.username||!form.email||!form.password)return alert('Username, email, password required');setSaving(true);const r=await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});const d=await r.json();setSaving(false);if(d.id){setForm({username:'',email:'',password:'',role:'editor',displayName:''});setShowForm(false);load()}else alert('Error: '+(d.error||'Unknown'))}
  const toggleSuspend=async(id:string,suspended:boolean)=>{await fetch('/api/users/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({suspended:!suspended})});load()}
  const changeRole=async(id:string,role:string)=>{await fetch('/api/users/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({role})});load()}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'5px'}
  return(
    <div style={{padding:'24px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:800,color:'#0f172a'}}>\u{1F465} Users Management</h1>
        <button onClick={()=>setShowForm(!showForm)} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 20px',fontWeight:700,cursor:'pointer',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{showForm?'Cancel':'\u2795 Add User'}</button>
      </div>
      {showForm&&(
        <div style={{background:'#fff',borderRadius:'12px',padding:'24px',marginBottom:'20px',border:'2px solid #6366f1'}}>
          <h3 style={{margin:'0 0 16px',fontWeight:700}}>Create New User</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'14px'}}>
            <div><label style={lbl}>Username *</label><input style={inp} value={form.username} onChange={e=>set('username',e.target.value)} /></div>
            <div><label style={lbl}>Email *</label><input style={inp} type="email" value={form.email} onChange={e=>set('email',e.target.value)} /></div>
            <div><label style={lbl}>Password *</label><input style={inp} type="password" value={form.password} onChange={e=>set('password',e.target.value)} /></div>
            <div><label style={lbl}>Display Name</label><input style={inp} value={form.displayName} onChange={e=>set('displayName',e.target.value)} /></div>
            <div><label style={lbl}>Role</label><select style={inp} value={form.role} onChange={e=>set('role',e.target.value)}>{ROLES.map(r=><option key={r} value={r}>{r.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}</select></div>
          </div>
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>{saving?'Creating...':'Create User'}</button>
        </div>
      )}
      <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
        {loading?<p style={{padding:'40px',textAlign:'center',color:'#94a3b8'}}>Loading...</p>:
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{background:'#f8fafc',borderBottom:'2px solid #e2e8f0'}}>
              <th style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,color:'#64748b'}}>USER</th>
              <th style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,color:'#64748b'}}>ROLE</th>
              <th style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,color:'#64748b'}}>STATUS</th>
              <th style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,color:'#64748b'}}>LAST LOGIN</th>
              <th style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,color:'#64748b'}}>ACTIONS</th>
            </tr></thead>
            <tbody>{users.map((u:any)=>(
              <tr key={u.id} style={{borderBottom:'1px solid #f8fafc'}}>
                <td style={{padding:'12px 16px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'14px',flexShrink:0}}>{u.username.charAt(0).toUpperCase()}</div>
                    <div><p style={{margin:0,fontWeight:600,fontSize:'13px'}}>{u.displayName||u.username}</p><p style={{margin:'2px 0 0',fontSize:'12px',color:'#94a3b8'}}>{u.email}</p></div>
                  </div>
                </td>
                <td style={{padding:'12px 16px'}}>
                  <select value={u.role} onChange={e=>changeRole(u.id,e.target.value)} style={{border:'1px solid #e2e8f0',borderRadius:'6px',padding:'4px 8px',fontSize:'12px',cursor:'pointer',background:RC[u.role]?.[0]||'#f1f5f9',color:RC[u.role]?.[1]||'#475569',fontWeight:700}}>
                    {ROLES.map(r=><option key={r} value={r}>{r.replace(/_/g,' ')}</option>)}
                  </select>
                </td>
                <td style={{padding:'12px 16px'}}><span style={{padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:700,background:u.suspended?'#fee2e2':u.active?'#dcfce7':'#f1f5f9',color:u.suspended?'#dc2626':u.active?'#16a34a':'#475569'}}>{u.suspended?'Suspended':u.active?'Active':'Inactive'}</span></td>
                <td style={{padding:'12px 16px',fontSize:'12px',color:'#94a3b8'}}>{u.lastLoginAt?new Date(u.lastLoginAt).toLocaleDateString():'Never'}</td>
                <td style={{padding:'12px 16px'}}><button onClick={()=>toggleSuspend(u.id,u.suspended)} style={{padding:'5px 12px',borderRadius:'6px',background:u.suspended?'#f0fdf4':'#fff1f2',color:u.suspended?'#16a34a':'#e11d48',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:700}}>{u.suspended?'Restore':'Suspend'}</button></td>
              </tr>
            ))}</tbody>
          </table>
        }
      </div>
    </div>
  )
}