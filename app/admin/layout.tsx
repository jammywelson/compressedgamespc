'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

// What each role can access
const ROLE_ACCESS: Record<string, string[]> = {
  superadmin: ['*'],
  admin:      ['dashboard','games','pages','appearance','stats','ads','seo','categories','permalinks','settings','users','backup','change-password'],
  manager:    ['dashboard','games','pages','categories','stats'],
  editor:     ['dashboard','games'],
  moderator:  ['dashboard','games','stats'],
  viewer:     ['dashboard'],
}

function canAccess(role: string, path: string): boolean {
  const access = ROLE_ACCESS[role] || ['dashboard']
  if (access.includes('*')) return true
  const section = path.replace('/admin/','').split('/')[0] || 'dashboard'
  return access.includes(section)
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [role, setRole]   = useState('')
  const [uname, setUname] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const auth = document.cookie.includes('cgpc_admin_auth=true')
    if (!auth && pathname !== '/admin/login') {
      router.replace('/admin/login'); return
    }
    const r = document.cookie.split(';').find(c=>c.trim().startsWith('cgpc_admin_role='))?.split('=')[1]?.trim() || 'editor'
    const u = document.cookie.split(';').find(c=>c.trim().startsWith('cgpc_admin_user='))?.split('=')[1]?.trim() || 'admin'
    setRole(r); setUname(u)

    // Block access to unauthorized sections
    if (pathname !== '/admin/login' && !canAccess(r, pathname)) {
      router.replace('/admin')
    }
    setReady(true)
  }, [pathname])

  if (pathname === '/admin/login') return <>{children}</>
  if (!ready) return null

  const logout = () => {
    document.cookie = 'cgpc_admin_auth=; path=/; max-age=0'
    document.cookie = 'cgpc_admin_user=; path=/; max-age=0'
    document.cookie = 'cgpc_admin_role=; path=/; max-age=0'
    router.replace('/admin/login')
  }

  const isSuperAdmin = role === 'superadmin'
  const isAdmin      = ['superadmin','admin'].includes(role)
  const canGames     = canAccess(role, '/admin/games')
  const canAppear    = canAccess(role, '/admin/appearance')
  const canUsers     = canAccess(role, '/admin/users')
  const canStats     = canAccess(role, '/admin/stats')
  const canSeo       = canAccess(role, '/admin/seo')
  const canAds       = canAccess(role, '/admin/ads')

  const link = (href: string, label: string, icon: string) => {
    const active = pathname === href || pathname.startsWith(href + '/')
    return (
      <Link href={href} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', borderRadius:'7px', fontSize:'13px', fontWeight:500, color: active?'#fff':'rgba(255,255,255,.55)', background: active?'rgba(255,255,255,.12)':'transparent', textDecoration:'none', transition:'all .15s' }}>
        <span style={{ fontSize:'14px' }}>{icon}</span>{label}
      </Link>
    )
  }

  const roleLabel: Record<string,string> = {
    superadmin:'Super Admin', admin:'Admin', manager:'Manager', editor:'Editor', moderator:'Moderator', viewer:'Viewer'
  }
  const roleColor: Record<string,string> = {
    superadmin:'#16a34a', admin:'#4f46e5', manager:'#ea580c', editor:'#0891b2', moderator:'#7c3aed', viewer:'#6b7280'
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'system-ui, sans-serif', background:'#f0f2f8' }}>
      {/* Sidebar */}
      <div style={{ width:'210px', background:'#1a1f3c', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, height:'100vh', zIndex:50, overflowY:'auto' }}>
        {/* Logo */}
        <div style={{ padding:'16px 14px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
            <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 5px', borderRadius:'4px' }}>CGP</div>
            <span style={{ fontSize:'14px', fontWeight:700, color:'#fff' }}>Admin Panel</span>
          </div>
          <div style={{ fontSize:'10px', color:'rgba(255,255,255,.3)' }}>compressedgamespc.com</div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:'2px' }}>
          <div style={{ fontSize:'9px', color:'rgba(255,255,255,.25)', textTransform:'uppercase', letterSpacing:'.6px', padding:'8px 8px 4px', fontWeight:600 }}>Content</div>
          {link('/admin','Dashboard','📊')}
          {canGames && link('/admin/games','All Games','🎮')}
          {canGames && link('/admin/games/add','Add Game','➕')}
          {isAdmin && link('/admin/pages','Pages Manager','📄')}

          {canAppear && <>
            <div style={{ fontSize:'9px', color:'rgba(255,255,255,.25)', textTransform:'uppercase', letterSpacing:'.6px', padding:'10px 8px 4px', fontWeight:600 }}>Customize</div>
            {link('/admin/appearance','Appearance','🎨')}
          </>}

          <div style={{ fontSize:'9px', color:'rgba(255,255,255,.25)', textTransform:'uppercase', letterSpacing:'.6px', padding:'10px 8px 4px', fontWeight:600 }}>Tools</div>
          {canStats && link('/admin/stats','Site Stats','📈')}
          {canAds && link('/admin/ads','Ad Inserter','💰')}

          {isAdmin && <>
            <div style={{ fontSize:'9px', color:'rgba(255,255,255,.25)', textTransform:'uppercase', letterSpacing:'.6px', padding:'10px 8px 4px', fontWeight:600 }}>Site</div>
            {canSeo && link('/admin/seo','SEO Settings','🔍')}
            {isAdmin && link('/admin/permalinks','Permalink Settings','🔗')}
            {isAdmin && link('/admin/settings','Site Settings','⚙️')}
            {isAdmin && link('/admin/categories','Categories','📂')}
            {canUsers && link('/admin/users','Users','👥')}
          </>}

          <div style={{ fontSize:'9px', color:'rgba(255,255,255,.25)', textTransform:'uppercase', letterSpacing:'.6px', padding:'10px 8px 4px', fontWeight:600 }}>Account</div>
          {isSuperAdmin && link('/admin/backup','Backup & Restore','💾')}
          {link('/admin/change-password','Change Password','🔒')}
        </nav>

        {/* User info */}
        <div style={{ padding:'12px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'13px', fontWeight:700, flexShrink:0 }}>
              {uname.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:'12px', fontWeight:600, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>@{uname}</div>
              <div style={{ fontSize:'10px', color: roleColor[role]||'#9ca3af', fontWeight:600 }}>{roleLabel[role]||role}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'6px' }}>
            <Link href="/" target="_blank" style={{ flex:1, background:'rgba(255,255,255,.06)', color:'rgba(255,255,255,.5)', borderRadius:'5px', padding:'5px', fontSize:'10px', textAlign:'center', textDecoration:'none' }}>View Site</Link>
            <button onClick={logout} style={{ flex:1, background:'rgba(229,57,53,.15)', color:'#fca5a5', border:'none', borderRadius:'5px', padding:'5px', fontSize:'10px', cursor:'pointer', fontFamily:'inherit' }}>Logout</button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft:'210px', flex:1, minHeight:'100vh' }}>
        {children}
      </div>
    </div>
  )
}
