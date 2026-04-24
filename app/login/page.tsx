'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserLoginPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ username:'', password:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('cgpc_user_session')
    if (u) router.replace('/profile')
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 400))

    if (!form.username || !form.password) {
      setError('Username aur password daalo'); setLoading(false); return
    }

    const users = JSON.parse(localStorage.getItem('cgpc_users_v2') || '[]')
    const user = users.find((u: any) =>
      (u.username === form.username || u.email === form.username) && u.password === form.password
    )

    if (user) {
      if (user.status === 'inactive') {
        setError('Account disabled hai. Admin se contact karo.'); setLoading(false); return
      }
      localStorage.setItem('cgpc_user_session', JSON.stringify({
        id: user.id, name: user.name, username: user.username, email: user.email, role: user.role
      }))
      router.replace('/profile')
    } else {
      setError('Username ya password galat hai'); setLoading(false)
    }
  }

  const SI: React.CSSProperties = { width:'100%', background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'11px 14px', color:'#111827', fontSize:'14px', outline:'none', fontFamily:'inherit' }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1a1f3c,#252b4a)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'system-ui, sans-serif', padding:'20px' }}>

      <Link href="/" style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'28px', textDecoration:'none' }}>
        <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontSize:'12px', fontWeight:700, padding:'3px 8px', borderRadius:'5px' }}>CGP</div>
        <span style={{ fontSize:'20px', fontWeight:700, color:'#fff' }}>CompressedGamesPC</span>
      </Link>

      <div style={{ background:'#fff', borderRadius:'14px', width:'100%', maxWidth:'400px', overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,.4)' }}>
        <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', padding:'20px 28px' }}>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'#fff', marginBottom:'4px' }}>Welcome Back!</h1>
          <p style={{ fontSize:'13px', color:'rgba(255,255,255,.7)' }}>Apne account mein login karo</p>
        </div>

        <div style={{ padding:'28px' }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:'14px' }}>
              <label style={{ fontSize:'13px', color:'#374151', fontWeight:500, marginBottom:'6px', display:'block' }}>Username ya Email</label>
              <input style={SI} value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} placeholder="username ya email daalo" autoFocus required/>
            </div>
            <div style={{ marginBottom:'18px' }}>
              <label style={{ fontSize:'13px', color:'#374151', fontWeight:500, marginBottom:'6px', display:'block' }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} style={{ ...SI, paddingRight:'42px' }} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Password daalo" required/>
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:'16px', padding:0 }}>
                  {showPass?'🙈':'👁'}
                </button>
              </div>
            </div>
            {error && (
              <div style={{ background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'7px', padding:'10px 12px', marginBottom:'14px', fontSize:'13px', color:'#e53935' }}>
                ⚠️ {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width:'100%', background:loading?'#9ca3af':'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', padding:'13px', fontSize:'14px', fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit' }}>
              {loading?'Logging in...':'Login →'}
            </button>
          </form>

          <div style={{ textAlign:'center' as any, marginTop:'16px', fontSize:'13px', color:'#9ca3af' }}>
            Account nahi hai? Admin se contact karo.
          </div>

          <div style={{ textAlign:'center' as any, marginTop:'8px' }}>
            <Link href="/" style={{ fontSize:'12px', color:'#6b7280' }}>← Back to Site</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
