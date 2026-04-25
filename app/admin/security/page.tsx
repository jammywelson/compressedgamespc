'use client'
import { useState, useEffect } from 'react'
export default function SecurityPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [blocked, setBlocked] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ip, setIp] = useState('')
  const [reason, setReason] = useState('')

  const loadData = async () => {
    setLoading(true)
    const [l, b] = await Promise.all([
      fetch('/api/admin/login-logs').then(r=>r.json()).catch(()=>[]),
      fetch('/api/admin/blocked-ips').then(r=>r.json()).catch(()=>[])
    ])
    setLogs(l||[]); setBlocked(b||[]); setLoading(false)
  }
  useEffect(()=>{loadData()},[])

  const blockIp = async () => {
    if (!ip) return alert('Enter IP')
    await fetch('/api/admin/blocked-ips',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ip,reason})})
    setIp(''); setReason(''); loadData()
  }
  const unblock = async (id:string) => {
    await fetch('/api/admin/blocked-ips/'+id,{method:'DELETE'}); loadData()
  }

  const inp:any={border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 12px',fontSize:'14px',outline:'none'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #e2e8f0'}

  return (
    <div style={{padding:'20px'}}>
      <h1 style={{margin:'0 0 20px',fontSize:'22px',fontWeight:700}}>&#128737; Security</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
        <div style={card}>
          <h3 style={{margin:'0 0 14px',fontWeight:700}}>IP Blocklist</h3>
          <div style={{display:'flex',gap:'8px',marginBottom:'14px',flexWrap:'wrap'}}>
            <input style={{...inp,flex:1,minWidth:'100px'}} value={ip} onChange={e=>setIp(e.target.value)} placeholder="IP address" />
            <input style={{...inp,flex:1,minWidth:'100px'}} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason" />
            <button onClick={blockIp} style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 14px',cursor:'pointer',fontWeight:600}}>Block</button>
          </div>
          {blocked.length===0?<p style={{color:'#94a3b8',fontSize:'13px'}}>No blocked IPs.</p>:
            blocked.map((b:any)=>(
              <div key={b.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #f1f5f9'}}>
                <div><p style={{margin:0,fontWeight:600,fontSize:'13px',fontFamily:'monospace'}}>{b.ip}</p>{b.reason&&<p style={{margin:'2px 0 0',fontSize:'11px',color:'#94a3b8'}}>{b.reason}</p>}</div>
                <button onClick={()=>unblock(b.id)} style={{background:'#f1f5f9',border:'none',borderRadius:'6px',padding:'4px 10px',cursor:'pointer',fontSize:'12px'}}>Unblock</button>
              </div>
            ))
          }
        </div>
        <div style={card}>
          <h3 style={{margin:'0 0 14px',fontWeight:700}}>Recent Login Activity</h3>
          {loading?<p style={{color:'#94a3b8'}}>Loading...</p>:
            logs.length===0?<p style={{color:'#94a3b8',fontSize:'13px'}}>No login history yet.</p>:
            logs.slice(0,10).map((l:any)=>(
              <div key={l.id} style={{padding:'8px 0',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div><p style={{margin:0,fontSize:'13px',fontWeight:600}}>{l.user?.username||'Unknown'}</p><p style={{margin:'2px 0 0',fontSize:'11px',color:'#94a3b8',fontFamily:'monospace'}}>{l.ip} &#8226; {new Date(l.createdAt).toLocaleString()}</p></div>
                <span style={{padding:'2px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:l.success?'#d1fae5':'#fee2e2',color:l.success?'#065f46':'#991b1b'}}>{l.success?'OK':'Failed'}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}