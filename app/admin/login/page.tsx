'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true); setErr('')
    const r = await fetch('/api/admin/login', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})})
    const d = await r.json()
    setLoading(false)
    if (d.ok) router.push('/admin')
    else setErr(d.error || 'Invalid credentials')
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{width:'100%',maxWidth:'400px',padding:'0 20px'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{width:'56px',height:'56px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:'14px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:'24px',fontWeight:800,color:'#fff'}}>C</div>
          <h1 style={{margin:0,color:'#fff',fontSize:'22px',fontWeight:700}}>CGP Admin Panel</h1>
          <p style={{color:'#94a3b8',margin:'6px 0 0',fontSize:'14px'}}>Sign in to your dashboard</p>
        </div>
        <form onSubmit={submit} style={{background:'#1e293b',borderRadius:'16px',padding:'32px',border:'1px solid rgba(255,255,255,.08)'}}>
          {err && <div style={{background:'#fee2e2',color:'#991b1b',padding:'10px 14px',borderRadius:'8px',fontSize:'13px',marginBottom:'16px',fontWeight:500}}>{err}</div>}
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#94a3b8',marginBottom:'6px'}}>Username or Email</label>
            <input value={u} onChange={e=>setU(e.target.value)} autoFocus style={{width:'100%',background:'#0f172a',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 14px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#94a3b8',marginBottom:'6px'}}>Password</label>
            <input type="password" value={p} onChange={e=>setP(e.target.value)} style={{width:'100%',background:'#0f172a',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',padding:'10px 14px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
          </div>
          <button type="submit" disabled={loading} style={{width:'100%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:'8px',padding:'12px',fontWeight:700,fontSize:'15px',cursor:'pointer',opacity:loading?0.7:1}}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}