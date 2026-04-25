'use client'
import { useState, useEffect } from 'react'
export default function SecurityPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [blocked, setBlocked] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ip, setIp] = useState('')
  const [reason, setReason] = useState('')
  useEffect(()=>{
    Promise.all([fetch('/api/admin/login-logs').then(r=>r.json()).catch(()=>[]),fetch('/api/admin/blocked-ips').then(r=>r.json()).catch(()=>[])])
      .then(([l,b])=>{setLogs(l||[]);setBlocked(b||[]);setLoading(false)})
  },[])
  const blockIp=async()=>{if(!ip.trim())return alert('Enter IP');await fetch('/api/admin/blocked-ips',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ip:ip.trim(),reason:reason.trim()})});setIp('');setReason('');const r=await fetch('/api/admin/blocked-ips');setBlocked(await r.json())}
  const unblock=async(id:string)=>{await fetch('/api/admin/blocked-ips/'+id,{method:'DELETE'});const r=await fetch('/api/admin/blocked-ips');setBlocked(await r.json())}
  const inp:any={border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 12px',fontSize:'14px',outline:'none',background:'#fff'}
  return(
    <div style={{padding:'24px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <h1 style={{margin:'0 0 24px',fontSize:'22px',fontWeight:800}}>\u{1F6E1}\uFE0F Security</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #e2e8f0'}}>
          <h3 style={{margin:'0 0 16px',fontWeight:700}}>\u{1F6AB} IP Blocklist</h3>
          <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
            <input style={{...inp,flex:1,minWidth:'120px'}} value={ip} onChange={e=>setIp(e.target.value)} placeholder="IP address (e.g. 192.168.1.1)" />
            <input style={{...inp,flex:1,minWidth:'120px'}} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason (optional)" />
            <button onClick={blockIp} style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 16px',cursor:'pointer',fontWeight:700,fontSize:'13px',whiteSpace:'nowrap'}}>Block IP</button>
          </div>
          {blocked.length===0?<p style={{color:'#94a3b8',fontSize:'13px',textAlign:'center',padding:'16px'}}>No blocked IPs.</p>:
            blocked.map((b:any)=>(
              <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #f8fafc'}}>
                <div>
                  <p style={{margin:0,fontWeight:700,fontSize:'13px',fontFamily:'monospace',color:'#ef4444'}}>{b.ip}</p>
                  {b.reason&&<p style={{margin:'1px 0 0',fontSize:'11px',color:'#94a3b8'}}>{b.reason}</p>}
                </div>
                <button onClick={()=>unblock(b.id)} style={{background:'#f1f5f9',border:'none',borderRadius:'6px',padding:'4px 10px',cursor:'pointer',fontSize:'12px',color:'#475569',fontWeight:600}}>Unblock</button>
              </div>
            ))
          }
        </div>
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #e2e8f0'}}>
          <h3 style={{margin:'0 0 16px',fontWeight:700}}>\u{1F4CB} Login Activity</h3>
          {loading?<p style={{color:'#94a3b8',textAlign:'center',padding:'20px'}}>Loading...</p>:
            logs.length===0?<p style={{color:'#94a3b8',fontSize:'13px',textAlign:'center',padding:'16px'}}>No login history yet.</p>:
            logs.slice(0,10).map((l:any)=>(
              <div key={l.id} style={{padding:'8px 0',borderBottom:'1px solid #f8fafc',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <p style={{margin:0,fontSize:'13px',fontWeight:600}}>{l.user?.username||'Unknown'}</p>
                  <p style={{margin:'1px 0 0',fontSize:'11px',color:'#94a3b8',fontFamily:'monospace'}}>{l.ip} \u2022 {new Date(l.createdAt).toLocaleString()}</p>
                </div>
                <span style={{padding:'2px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:700,background:l.success?'#dcfce7':'#fee2e2',color:l.success?'#16a34a':'#dc2626'}}>{l.success?'\u2713 Success':'\u2717 Failed'}</span>
              </div>
            ))
          }
        </div>
      </div>
      <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #e2e8f0'}}>
        <h3 style={{margin:'0 0 12px',fontWeight:700}}>Security Settings</h3>
        <p style={{color:'#64748b',fontSize:'14px',margin:0}}>\u{1F6A7} Two-Factor Authentication (2FA) and advanced session management will be available in the next update.</p>
      </div>
    </div>
  )
}