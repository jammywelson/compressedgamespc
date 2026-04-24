'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const s = localStorage.getItem('cgpc_user_session')
    if (!s) { router.replace('/login'); return }
    try { setUser(JSON.parse(s)) } catch(e) { router.replace('/login') }
  }, [])

  const logout = () => {
    localStorage.removeItem('cgpc_user_session')
    router.replace('/')
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      <main style={{ maxWidth:'800px', margin:'0 auto', padding:'24px 16px' }}>
        {/* Profile header */}
        <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius:'12px', padding:'28px', display:'flex', alignItems:'center', gap:'20px', marginBottom:'20px', flexWrap:'wrap' as any }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', fontWeight:700, color:'#fff', flexShrink:0 }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'22px', fontWeight:700, color:'#fff' }}>{user.name}</div>
            <div style={{ fontSize:'13px', color:'rgba(255,255,255,.5)', marginTop:'2px' }}>@{user.username}</div>
            <div style={{ fontSize:'12px', color:'rgba(255,255,255,.4)', marginTop:'2px' }}>{user.email}</div>
          </div>
          <span style={{ background:'rgba(79,70,229,.4)', color:'#a5b4fc', fontSize:'12px', padding:'4px 12px', borderRadius:'20px', fontWeight:600 }}>
            {user.role === 'admin' ? 'Admin' : user.role === 'editor' ? 'Editor' : 'Member'}
          </span>
        </div>

        {/* Quick links */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'12px', marginBottom:'20px' }}>
          {[
            { icon:'🎮', label:'All Games',   href:'/games'              },
            { icon:'🔥', label:'Hot Games',   href:'/games?status=hot'   },
            { icon:'🔍', label:'Search',      href:'/games'              },
            { icon:'🏠', label:'Homepage',    href:'/'                   },
          ].map(item => (
            <Link key={item.label} href={item.href}
              style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px', textAlign:'center' as any, textDecoration:'none' }}>
              <div style={{ fontSize:'28px', marginBottom:'6px' }}>{item.icon}</div>
              <div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>{item.label}</div>
            </Link>
          ))}
        </div>

        {/* Account info */}
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', overflow:'hidden', marginBottom:'16px' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f3f4f6', fontSize:'15px', fontWeight:700, color:'#111827' }}>
            Account Details
          </div>
          <div style={{ padding:'16px 20px', display:'grid', gap:'12px' }}>
            {[
              { label:'Full Name', value: user.name },
              { label:'Username',  value: `@${user.username}` },
              { label:'Email',     value: user.email },
              { label:'Role',      value: user.role || 'Member' },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:'12px', borderBottom:'1px solid #f9fafb' }}>
                <span style={{ fontSize:'13px', color:'#6b7280' }}>{row.label}</span>
                <span style={{ fontSize:'13px', fontWeight:500, color:'#111827' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button onClick={logout}
          style={{ width:'100%', background:'#fef2f2', color:'#e53935', border:'1px solid #fca5a5', borderRadius:'8px', padding:'12px', fontSize:'14px', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
          Logout
        </button>
      </main>
      <Footer />
    </>
  )
}
