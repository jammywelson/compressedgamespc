'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username || !form.password) return setError('Enter username and password')
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const d = await r.json()
      if (d.ok) router.push('/admin')
      else setError(d.error || 'Login failed')
    } catch { setError('Connection error. Try again.') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ width:'100%', maxWidth:'400px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ width:'60px', height:'60px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'24px', margin:'0 auto 16px', boxShadow:'0 8px 32px rgba(99,102,241,.4)' }}>C</div>
          <h1 style={{ color:'#fff', fontSize:'24px', fontWeight:700, margin:'0 0 6px' }}>CGP Admin Panel</h1>
          <p style={{ color:'#64748b', fontSize:'14px', margin:0 }}>CompressedGamesPC CMS</p>
        </div>

        {/* Form Card */}
        <div style={{ background:'rgba(30,41,59,.8)', backdropFilter:'blur(20px)', borderRadius:'16px', padding:'32px', border:'1px solid rgba(99,102,241,.2)', boxShadow:'0 20px 60px rgba(0,0,0,.5)' }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.3)', borderRadius:'8px', padding:'10px 14px', marginBottom:'20px', color:'#fca5a5', fontSize:'13px', display:'flex', alignItems:'center', gap:'8px' }}>
              <span>\u26A0\uFE0F</span> {error}
            </div>
          )}

          <form onSubmit={login}>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'13px', fontWeight:500, marginBottom:'8px' }}>Username or Email</label>
              <input value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))}
                placeholder="admin" autoComplete="username"
                style={{ width:'100%', background:'rgba(15,23,42,.6)', border:'1px solid rgba(99,102,241,.3)', borderRadius:'8px', padding:'11px 14px', color:'#f1f5f9', fontSize:'14px', outline:'none', boxSizing:'border-box', transition:'border .15s' }}
                onFocus={e=>(e.target.style.borderColor='#6366f1')} onBlur={e=>(e.target.style.borderColor='rgba(99,102,241,.3)')} />
            </div>
            <div style={{ marginBottom:'24px' }}>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'13px', fontWeight:500, marginBottom:'8px' }}>Password</label>
              <div style={{ position:'relative' }}>
                <input value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                  type={showPw?'text':'password'} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" autoComplete="current-password"
                  style={{ width:'100%', background:'rgba(15,23,42,.6)', border:'1px solid rgba(99,102,241,.3)', borderRadius:'8px', padding:'11px 44px 11px 14px', color:'#f1f5f9', fontSize:'14px', outline:'none', boxSizing:'border-box' }}
                  onFocus={e=>(e.target.style.borderColor='#6366f1')} onBlur={e=>(e.target.style.borderColor='rgba(99,102,241,.3)')} />
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#64748b', fontSize:'16px' }}>
                  {showPw?'\u{1F441}\uFE0F':'\u{1F576}\uFE0F'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%', background:loading?'#4338ca':'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', borderRadius:'10px', padding:'13px', fontWeight:700, fontSize:'15px', cursor:loading?'not-allowed':'pointer', transition:'all .2s', boxShadow:'0 4px 16px rgba(99,102,241,.4)' }}>
              {loading ? 'Signing in...' : 'Sign In \u2192'}
            </button>
          </form>
        </div>
        <p style={{ textAlign:'center', color:'#334155', fontSize:'12px', marginTop:'20px' }}>CompressedGamesPC \u2022 CMS v2.0</p>
      </div>
    </div>
  )
}