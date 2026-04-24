'use client'
import { useState, useEffect } from 'react'

const ALL_PERMS = [
  { id:'view_games',    label:'Games Dekh Sakta',    group:'Games' },
  { id:'add_games',     label:'Games Add Kar Sakta', group:'Games' },
  { id:'edit_games',    label:'Games Edit Kar Sakta',group:'Games' },
  { id:'delete_games',  label:'Games Delete Kar Sakta',group:'Games' },
  { id:'publish_games', label:'Games Publish Kar Sakta',group:'Games' },
  { id:'view_comments', label:'Comments Dekh Sakta', group:'Comments' },
  { id:'delete_comments',label:'Comments Delete Kar Sakta',group:'Comments' },
  { id:'manage_cats',   label:'Categories Manage Kar Sakta',group:'Site' },
  { id:'view_stats',    label:'Stats Dekh Sakta',    group:'Site' },
  { id:'manage_ads',    label:'Ads Manage Kar Sakta',group:'Site' },
  { id:'manage_users',  label:'Users Manage Kar Sakta',group:'Users' },
]

const ROLE_PRESETS: Record<string,{ label:string; color:string; bg:string; permissions:string[] }> = {
  viewer:    { label:'Viewer',    color:'#6b7280', bg:'#f9fafb', permissions:['view_games'] },
  editor:    { label:'Editor',    color:'#0891b2', bg:'#ecfeff', permissions:['view_games','add_games','edit_games'] },
  moderator: { label:'Moderator', color:'#7c3aed', bg:'#f5f3ff', permissions:['view_games','view_comments','delete_comments','view_stats'] },
  manager:   { label:'Manager',   color:'#ea580c', bg:'#fff7ed', permissions:['view_games','add_games','edit_games','delete_games','publish_games','view_comments','delete_comments','manage_cats','view_stats'] },
  admin:     { label:'Admin',     color:'#4f46e5', bg:'#eef2ff', permissions:ALL_PERMS.map(p=>p.id) },
}

const SI: React.CSSProperties = { width:'100%', background:'#fff', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'9px 12px', color:'#111827', fontSize:'13px', outline:'none', fontFamily:'inherit' }
const LB: React.CSSProperties = { fontSize:'12px', color:'#374151', fontWeight:500, marginBottom:'5px', display:'block' }

const Toggle = ({val,onChange}:{val:boolean;onChange:(v:boolean)=>void}) => (
  <div style={{width:'44px',height:'24px',borderRadius:'12px',background:val?'#4f46e5':'#d1d5db',cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0}} onClick={()=>onChange(!val)}>
    <div style={{position:'absolute',top:'4px',left:val?'23px':'4px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left .2s'}}/>
  </div>
)

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [delId, setDelId] = useState<string|null>(null)
  const [editUser, setEditUser] = useState<any|null>(null)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [selRole, setSelRole] = useState('editor')
  const [selPerms, setSelPerms] = useState<string[]>(ROLE_PRESETS.editor.permissions)
  const [form, setForm] = useState({ name:'', username:'', email:'', password:'' })

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/users')
      const d = await r.json()
      setUsers(Array.isArray(d) ? d : [])
    } catch(e) { setUsers([]) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const showMsg = (m:string, t:'ok'|'err'='ok') => { setMsg(m); setMsgType(t); setTimeout(()=>setMsg(''),3000) }

  const addUser = async () => {
    if (!form.name||!form.username||!form.email||!form.password) { showMsg('Sab fields bharo','err'); return }
    if (form.password.length < 6) { showMsg('Password min 6 chars','err'); return }
    try {
      const r = await fetch('/api/users', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name:form.name, username:form.username, email:form.email, password:form.password, role:selRole, permissions:selPerms })
      })
      if (!r.ok) { const e=await r.json(); showMsg(e.error||'Error','err'); return }
      setForm({name:'',username:'',email:'',password:''})
      setShowAdd(false)
      showMsg('✓ User add ho gaya!')
      load()
    } catch(e:any) { showMsg(e.message,'err') }
  }

  const deleteUser = async (id:string) => {
    await fetch(`/api/users/${id}`, { method:'DELETE' })
    setDelId(null); showMsg('User delete ho gaya'); load()
  }

  const toggleStatus = async (u:any) => {
    await fetch(`/api/users/${u.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status:u.status==='active'?'inactive':'active'}) })
    load()
  }

  const saveEdit = async () => {
    if (!editUser) return
    await fetch(`/api/users/${editUser.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(editUser) })
    setEditUser(null); showMsg('✓ User updated!'); load()
  }

  const groups = [...new Set(ALL_PERMS.map(p=>p.group))]

  const PermGrid = ({ perms, toggle }: { perms:string[]; toggle:(id:string)=>void }) => (
    <div style={{display:'flex',flexDirection:'column' as any,gap:'10px'}}>
      {groups.map(grp=>(
        <div key={grp}>
          <div style={{fontSize:'11px',color:'#9ca3af',textTransform:'uppercase' as any,letterSpacing:'.5px',marginBottom:'6px',fontWeight:600}}>{grp}</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
            {ALL_PERMS.filter(p=>p.group===grp).map(p=>{
              const on=perms.includes(p.id)
              return (
                <div key={p.id} onClick={()=>toggle(p.id)} style={{background:on?'#eef2ff':'#f9fafb',border:`1px solid ${on?'#c7d2fe':'#e5e7eb'}`,borderRadius:'6px',padding:'7px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:'7px'}}>
                  <div style={{width:'16px',height:'16px',borderRadius:'3px',background:on?'#4f46e5':'#fff',border:`1.5px solid ${on?'#4f46e5':'#d1d5db'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {on&&<span style={{color:'#fff',fontSize:'10px',fontWeight:700}}>✓</span>}
                  </div>
                  <span style={{fontSize:'12px',color:on?'#3730a3':'#374151',fontWeight:on?600:400}}>{p.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div style={{background:'#f0f2f8',minHeight:'100vh'}}>
      {delId && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'12px',padding:'24px',width:'340px',textAlign:'center' as any}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>🗑</div>
            <div style={{fontSize:'17px',fontWeight:700,color:'#111827',marginBottom:'8px'}}>Delete User?</div>
            <div style={{fontSize:'13px',color:'#6b7280',marginBottom:'18px'}}>"{users.find(u=>u.id===delId)?.name}" delete hoga</div>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={()=>setDelId(null)} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:'8px',padding:'10px',cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
              <button onClick={()=>deleteUser(delId)} style={{flex:1,background:'#e53935',color:'#fff',border:'none',borderRadius:'8px',padding:'10px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {editUser && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
          <div style={{background:'#fff',borderRadius:'12px',width:'100%',maxWidth:'600px',maxHeight:'88vh',overflow:'auto',boxShadow:'0 25px 60px rgba(0,0,0,.25)'}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'#fff',zIndex:1}}>
              <div style={{fontSize:'16px',fontWeight:700,color:'#111827'}}>Edit — {editUser.name}</div>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setEditUser(null)} style={{background:'#f3f4f6',border:'none',borderRadius:'7px',padding:'7px 14px',cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
                <button onClick={saveEdit} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'7px 16px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Save</button>
              </div>
            </div>
            <div style={{padding:'20px',display:'grid',gap:'14px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div><label style={LB}>Name</label><input style={SI} value={editUser.name} onChange={e=>setEditUser({...editUser,name:e.target.value})}/></div>
                <div><label style={LB}>Email</label><input style={SI} value={editUser.email} onChange={e=>setEditUser({...editUser,email:e.target.value})}/></div>
              </div>
              <div><label style={LB}>Status</label>
                <select style={{...SI,cursor:'pointer',width:'200px'}} value={editUser.status} onChange={e=>setEditUser({...editUser,status:e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive (Disabled)</option>
                </select>
              </div>
              <div><label style={LB}>Role Preset</label>
                <div style={{display:'flex',gap:'6px',flexWrap:'wrap' as any}}>
                  {Object.entries(ROLE_PRESETS).map(([k,v])=>(
                    <button key={k} onClick={()=>setEditUser({...editUser,role:k,permissions:v.permissions})}
                      style={{background:editUser.role===k?v.bg:'#f9fafb',color:editUser.role===k?v.color:'#6b7280',border:`1.5px solid ${editUser.role===k?v.color:'#e5e7eb'}`,borderRadius:'6px',padding:'5px 12px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:editUser.role===k?600:400}}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div><label style={LB}>Permissions</label>
                <PermGrid perms={editUser.permissions||[]} toggle={id=>setEditUser({...editUser,permissions:editUser.permissions?.includes(id)?editUser.permissions.filter((x:string)=>x!==id):[...(editUser.permissions||[]),id]})}/>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:'54px',display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontSize:'18px',fontWeight:700,color:'#111827'}}>Users</span>
        {msg && <span style={{fontSize:'12px',color:msgType==='ok'?'#16a34a':'#e53935',fontWeight:500}}>{msg}</span>}
        <button onClick={()=>setShowAdd(!showAdd)} style={{marginLeft:'auto',background:'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'8px 16px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
          {showAdd?'✕ Cancel':'+ Add User'}
        </button>
      </div>

      <div style={{padding:'24px'}}>
        {showAdd && (
          <div style={{background:'#fff',border:'1px solid #c7d2fe',borderRadius:'10px',padding:'20px',marginBottom:'16px'}}>
            <div style={{fontSize:'15px',fontWeight:700,color:'#111827',marginBottom:'14px',paddingBottom:'10px',borderBottom:'1px solid #f3f4f6'}}>Add New User</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'14px'}}>
              <div><label style={LB}>Full Name *</label><input style={SI} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ali Hassan"/></div>
              <div><label style={LB}>Username *</label><input style={SI} value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value.toLowerCase().replace(/\s/g,'')}))} placeholder="ali_hassan"/></div>
              <div><label style={LB}>Email *</label><input type="email" style={SI} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="ali@example.com"/></div>
              <div><label style={LB}>Password *</label><input type="password" style={SI} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Min 6 chars"/></div>
            </div>
            <div style={{marginBottom:'14px'}}>
              <label style={LB}>Role</label>
              <div style={{display:'flex',gap:'6px',flexWrap:'wrap' as any,marginBottom:'8px'}}>
                {Object.entries(ROLE_PRESETS).map(([k,v])=>(
                  <button key={k} onClick={()=>{setSelRole(k);setSelPerms(v.permissions)}}
                    style={{background:selRole===k?v.bg:'#f9fafb',color:selRole===k?v.color:'#6b7280',border:`1.5px solid ${selRole===k?v.color:'#e5e7eb'}`,borderRadius:'6px',padding:'6px 14px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:selRole===k?600:400}}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:'14px'}}>
              <label style={LB}>Permissions</label>
              <PermGrid perms={selPerms} toggle={id=>setSelPerms(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])}/>
            </div>
            <button onClick={addUser} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'9px 20px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Add User</button>
          </div>
        )}

        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid #f3f4f6',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:'16px',fontWeight:700,color:'#111827'}}>All Users</span>
            <span style={{fontSize:'12px',color:'#6b7280',background:'#f9fafb',border:'1px solid #e5e7eb',padding:'3px 10px',borderRadius:'6px'}}>{users.length} users</span>
          </div>
          {loading ? (
            <div style={{padding:'40px',textAlign:'center' as any,color:'#6b7280'}}>Loading...</div>
          ) : users.length===0 ? (
            <div style={{padding:'50px',textAlign:'center' as any}}>
              <div style={{fontSize:'40px',marginBottom:'10px'}}>👤</div>
              <div style={{fontSize:'14px',fontWeight:600,color:'#374151',marginBottom:'4px'}}>Koi user nahi</div>
              <div style={{fontSize:'13px',color:'#9ca3af'}}>Add User button dabao</div>
            </div>
          ) : (
            <div style={{overflowX:'auto' as any}}>
              <table style={{width:'100%',borderCollapse:'collapse' as any}}>
                <thead>
                  <tr style={{background:'#f9fafb'}}>
                    {['User','Username','Email','Role','Status','Actions'].map(h=>(
                      <th key={h} style={{textAlign:'left' as any,fontSize:'11px',color:'#6b7280',textTransform:'uppercase' as any,letterSpacing:'.4px',padding:'10px 14px',borderBottom:'1px solid #f0f0f0',fontWeight:600}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u,i)=>{
                    const rp = ROLE_PRESETS[u.role]||ROLE_PRESETS.editor
                    return (
                      <tr key={u.id} style={{borderBottom:'1px solid #f9fafb',background:i%2===0?'#fff':'#fafafa'}}>
                        <td style={{padding:'12px 14px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                            <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#4f46e5,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'13px',fontWeight:700,flexShrink:0}}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{fontSize:'13px',fontWeight:600,color:'#111827'}}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{padding:'12px 14px',fontSize:'12px',color:'#4f46e5',fontFamily:'monospace'}}>@{u.username}</td>
                        <td style={{padding:'12px 14px',fontSize:'12px',color:'#6b7280'}}>{u.email}</td>
                        <td style={{padding:'12px 14px'}}><span style={{background:rp.bg,color:rp.color,fontSize:'11px',padding:'3px 8px',borderRadius:'4px',fontWeight:600}}>{rp.label}</span></td>
                        <td style={{padding:'12px 14px'}}><span style={{background:u.status==='active'?'#f0fdf4':'#fef2f2',color:u.status==='active'?'#16a34a':'#e53935',fontSize:'11px',padding:'3px 8px',borderRadius:'4px',fontWeight:600}}>{u.status==='active'?'Active':'Disabled'}</span></td>
                        <td style={{padding:'12px 14px'}}>
                          <div style={{display:'flex',gap:'5px'}}>
                            <button onClick={()=>setEditUser({...u})} style={{background:'#eef2ff',color:'#4f46e5',border:'1px solid #c7d2fe',borderRadius:'5px',padding:'5px 10px',fontSize:'11px',cursor:'pointer',fontFamily:'inherit'}}>Edit</button>
                            <button onClick={()=>toggleStatus(u)} style={{background:u.status==='active'?'#fff7ed':'#f0fdf4',color:u.status==='active'?'#ea580c':'#16a34a',border:`1px solid ${u.status==='active'?'#fed7aa':'#bbf7d0'}`,borderRadius:'5px',padding:'5px 10px',fontSize:'11px',cursor:'pointer',fontFamily:'inherit'}}>
                              {u.status==='active'?'Disable':'Enable'}
                            </button>
                            <button onClick={()=>setDelId(u.id)} style={{background:'#fef2f2',color:'#e53935',border:'1px solid #fca5a5',borderRadius:'5px',padding:'5px 10px',fontSize:'11px',cursor:'pointer',fontFamily:'inherit'}}>Del</button>
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
