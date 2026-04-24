'use client'
import { useState } from 'react'

const SI: React.CSSProperties = { width:'100%', background:'#fff', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'10px 12px', color:'#111827', fontSize:'13px', outline:'none', fontFamily:'inherit' }
const LB: React.CSSProperties = { fontSize:'13px', color:'#374151', fontWeight:500, marginBottom:'6px', display:'block' }

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ current:'', newPass:'', confirm:'' })
  const [msg, setMsg]   = useState('')
  const [err, setErr]   = useState('')

  const save = async () => {
    setErr(''); setMsg('')
    if (!form.current || !form.newPass || !form.confirm) { setErr('Sab fields bharo'); return }
    if (form.newPass.length < 8) { setErr('New password min 8 chars hona chahiye'); return }
    if (form.newPass !== form.confirm) { setErr('Passwords match nahi karte'); return }

    // Get current user from cookie
    const username = document.cookie.split(';').find(c=>c.trim().startsWith('cgpc_admin_user='))?.split('=')[1]?.trim() || ''
    const role = document.cookie.split(';').find(c=>c.trim().startsWith('cgpc_admin_role='))?.split('=')[1]?.trim() || ''

    // Super admin — verify via env
    if (role === 'superadmin') {
      const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || 'cgpc2025'
      if (form.current !== adminPass) { setErr('Current password galat hai'); return }
      setMsg('✓ Password update hua! Vercel mein NEXT_PUBLIC_ADMIN_PASS update karo: ' + form.newPass)
      setForm({ current:'', newPass:'', confirm:'' })
      return
    }

    // Other users — update via API
    try {
      const users = await fetch('/api/users').then(r=>r.json())
      const user = users.find((u: any) => u.username === username)
      if (!user) { setErr('User nahi mila'); return }
      if (user.password !== form.current) { setErr('Current password galat hai'); return }
      await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ password: form.newPass })
      })
      setMsg('✓ Password successfully change ho gaya!')
      setForm({ current:'', newPass:'', confirm:'' })
    } catch(e) { setErr('Error hua — dobara try karo') }
  }

  return (
    <div style={{ background:'#f0f2f8', minHeight:'100vh' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', height:'54px', display:'flex', alignItems:'center' }}>
        <span style={{ fontSize:'18px', fontWeight:700, color:'#111827' }}>Change Password</span>
      </div>
      <div style={{ padding:'24px', maxWidth:'480px' }}>
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'24px' }}>
          <div style={{ display:'grid', gap:'14px' }}>
            <div><label style={LB}>Current Password</label><input type="password" style={SI} value={form.current} onChange={e=>setForm(f=>({...f,current:e.target.value}))} placeholder="••••••••"/></div>
            <div><label style={LB}>New Password</label><input type="password" style={SI} value={form.newPass} onChange={e=>setForm(f=>({...f,newPass:e.target.value}))} placeholder="Min 8 characters"/></div>
            <div><label style={LB}>Confirm New Password</label><input type="password" style={SI} value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} placeholder="Repeat new password"/></div>
          </div>
          {err && <div style={{ background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'7px', padding:'10px', marginTop:'14px', fontSize:'13px', color:'#e53935' }}>⚠️ {err}</div>}
          {msg && <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'7px', padding:'10px', marginTop:'14px', fontSize:'13px', color:'#16a34a' }}>✓ {msg}</div>}
          <button onClick={save} style={{ width:'100%', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', padding:'12px', fontSize:'14px', fontWeight:600, cursor:'pointer', fontFamily:'inherit', marginTop:'16px' }}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}
