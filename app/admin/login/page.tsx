'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm]     = useState({ username:'', password:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      if (res.ok) {
        router.replace('/admin')
        router.refresh()
      } else {
        const d = await res.json()
        setError(d.error || 'Username ya password galat hai')
      }
    } catch(e) { setError('Network error') }
    setLoading(false)
  }

  const SI: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:'8px', padding:'12px 14px', color:'#fff', fontSize:'14px', outline:'none', fontFamily:'inherit' }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f0c29,#302b63)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui', padding:'20px' }}>
      <div style={{ width:'100%', maxWidth:'380px' }}>
        <div style={{ textAlign:'center' as any, marginBottom:'28px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px' }}>
            <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontSize:'12px', fontWeight:700, padding:'4px 8px', borderRadius:'6px' }}>CGP</div>
            <span style={{ fontSize:'18px', fontWeight:700, color:'#fff' }}>Admin Panel</span>
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'14px', padding:'28px' }}>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'#fff', marginBottom:'20px' }}>Login</h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:'14px' }}>
              <label style={{ fontSize:'12px', color:'rgba(255,255,255,.5)', marginBottom:'6px', display:'block' }}>Username</label>
              <input style={SI} value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} placeholder="admin" autoFocus required/>
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={{ fontSize:'12px', color:'rgba(255,255,255,.5)', marginBottom:'6px', display:'block' }}>Password</label>
              <input type="password" style={SI} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" required/>
            </div>
            {error && <div style={{ background:'rgba(229,57,53,.15)', border:'1px solid rgba(229,57,53,.3)', borderRadius:'7px', padding:'10px', marginBottom:'14px', fontSize:'13px', color:'#fca5a5' }}>⚠️ {error}</div>}
            <button type="submit" disabled={loading}
              style={{ width:'100%', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', border:'none', borderRadius:'8px', padding:'13px', fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              {loading?'...':'Login →'}
            </button>
          </form>
          <div style={{ textAlign:'center' as any, marginTop:'16px' }}>
            <a href="/" style={{ fontSize:'12px', color:'rgba(255,255,255,.25)', textDecoration:'none' }}>← Back to Site</a>
          </div>
        </div>
      </div>
    </div>
  )
}
