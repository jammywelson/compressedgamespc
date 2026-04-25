'use client'
import Link from 'next/link'
export default function RolesPage() {
  const roles = [
    {name:'Super Admin',key:'super_admin',color:'#854d0e',bg:'#fef9c3',desc:'Full access to everything. Can manage all users, settings, and content.',perms:['All permissions']},
    {name:'Admin',key:'admin',color:'#1d4ed8',bg:'#dbeafe',desc:'Full content management, can manage users except super admins.',perms:['Manage games','Manage categories','Manage users','Manage settings','View analytics']},
    {name:'Moderator',key:'moderator',color:'#15803d',bg:'#dcfce7',desc:'Can manage content and moderate comments. Cannot change site settings.',perms:['Manage games','Approve comments','Manage categories']},
    {name:'Editor',key:'editor',color:'#6d28d9',bg:'#f5f3ff',desc:'Can create and edit games, but cannot publish without approval.',perms:['Create games','Edit own games','View comments']},
    {name:'Viewer',key:'viewer',color:'#475569',bg:'#f1f5f9',desc:'Read-only access to admin panel. Cannot make any changes.',perms:['View dashboard','View content']},
  ]
  return(
    <div style={{padding:'24px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:800}}>\u{1F512} Roles & Permissions</h1>
        <Link href="/admin/users" style={{background:'#6366f1',color:'#fff',padding:'10px 20px',borderRadius:'8px',textDecoration:'none',fontWeight:700,fontSize:'13px',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>Manage Users \u2192</Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:'16px'}}>
        {roles.map(role=>(
          <div key={role.key} style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
              <span style={{padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:700,background:role.bg,color:role.color}}>{role.name}</span>
              <code style={{fontSize:'11px',color:'#94a3b8',background:'#f1f5f9',padding:'2px 8px',borderRadius:'4px'}}>{role.key}</code>
            </div>
            <p style={{margin:'0 0 12px',fontSize:'13px',color:'#64748b',lineHeight:1.5}}>{role.desc}</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
              {role.perms.map(p=><span key={p} style={{fontSize:'11px',padding:'3px 8px',borderRadius:'6px',background:'#f8fafc',color:'#475569',border:'1px solid #e2e8f0'}}>{p}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:'20px',background:'#eff6ff',borderRadius:'10px',padding:'14px 18px',color:'#1d4ed8',fontSize:'13px'}}>
        \u2139\uFE0F Custom role permissions editor is coming in the next update. For now, assign roles to users from the Users page.
      </div>
    </div>
  )
}