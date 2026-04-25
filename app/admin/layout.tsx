'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const MENU = [
  { group: 'MAIN', items: [
    { href: '/admin', label: 'Dashboard', icon: '\u{1F4CA}', exact: true },
  ]},
  { group: 'CONTENT', items: [
    { href: '/admin/games', label: 'All Games', icon: '\u{1F3AE}' },
    { href: '/admin/games/add', label: 'Add Game', icon: '\u2795' },
    { href: '/admin/games/edit', label: 'Edit Game', icon: '\u270F\uFE0F', hidden: true },
    { href: '/admin/categories', label: 'Categories', icon: '\u{1F4C1}' },
    { href: '/admin/comments', label: 'Comments', icon: '\u{1F4AC}' },
    { href: '/admin/media', label: 'Media Library', icon: '\u{1F5BC}\uFE0F' },
  ]},
  { group: 'CUSTOMIZE', items: [
    { href: '/admin/homepage', label: 'Homepage', icon: '\u{1F3E0}' },
    { href: '/admin/appearance', label: 'Appearance', icon: '\u{1F3A8}' },
    { href: '/admin/menus', label: 'Menus', icon: '\u{1F4CB}' },
  ]},
  { group: 'SITE', items: [
    { href: '/admin/seo', label: 'SEO Settings', icon: '\u{1F50D}' },
    { href: '/admin/ads', label: 'Ads Manager', icon: '\u{1F4B0}' },
    { href: '/admin/settings', label: 'Site Settings', icon: '\u2699\uFE0F' },
  ]},
  { group: 'USERS', items: [
    { href: '/admin/users', label: 'Users', icon: '\u{1F465}' },
    { href: '/admin/roles', label: 'Roles & Permissions', icon: '\u{1F512}' },
  ]},
  { group: 'TOOLS', items: [
    { href: '/admin/analytics', label: 'Analytics', icon: '\u{1F4C8}' },
    { href: '/admin/security', label: 'Security', icon: '\u{1F6E1}\uFE0F' },
    { href: '/admin/backup', label: 'Backup & Restore', icon: '\u{1F4BE}' },
  ]},
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [dark, setDark] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (pathname === '/admin/login') { setLoading(false); return }
    fetch('/api/admin/me').then(r => r.json()).then(d => {
      if (!d?.id) router.push('/admin/login')
      else { setUser(d); setLoading(false) }
    }).catch(() => router.push('/admin/login'))
    const savedDark = localStorage.getItem('admin_dark') === 'true'
    setDark(savedDark)
  }, [pathname])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }
  const toggleDark = () => {
    const n = !dark; setDark(n); localStorage.setItem('admin_dark', String(n))
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0f172a', color:'#94a3b8', fontSize:'16px' }}>Loading...</div>

  const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href)

  const bg = dark ? '#0f172a' : '#f8fafc'
  const sidebarBg = '#1e293b'
  const headerBg = dark ? '#1e293b' : '#ffffff'
  const textColor = dark ? '#f1f5f9' : '#1e293b'
  const borderColor = dark ? '#334155' : '#e2e8f0'

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', background:bg, color:textColor }}>
      {/* SIDEBAR */}
      <aside style={{ width:collapsed?'64px':'240px', background:sidebarBg, display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, height:'100vh', zIndex:50, transition:'width .25s ease', boxShadow:'2px 0 12px rgba(0,0,0,.2)', overflowX:'hidden', overflowY:'auto' }}>
        {/* Logo */}
        <div style={{ padding:'16px 12px', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', gap:'10px', flexShrink:0, minHeight:'64px' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'16px', flexShrink:0, boxShadow:'0 2px 8px rgba(99,102,241,.4)' }}>C</div>
          {!collapsed && <div style={{ overflow:'hidden' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:'15px', lineHeight:1.2, whiteSpace:'nowrap' }}>CGP Admin</div>
            <div style={{ color:'#64748b', fontSize:'11px', marginTop:'2px' }}>{user?.role?.replace('_',' ')||'Admin'}</div>
          </div>}
        </div>

        {/* Nav Items */}
        <nav style={{ flex:1, padding:'8px 0', overflowY:'auto' }}>
          {MENU.map(section => (
            <div key={section.group}>
              {!collapsed && <div style={{ padding:'12px 16px 4px', fontSize:'10px', fontWeight:700, color:'#475569', letterSpacing:'1.2px' }}>{section.group}</div>}
              {section.items.filter(i => !i.hidden).map(item => {
                const active = isActive(item.href, item.exact)
                return (
                  <Link key={item.href} href={item.href} style={{ display:'flex', alignItems:'center', gap:'10px', padding:collapsed?'10px 14px':'9px 12px 9px 16px', margin:'1px 8px', borderRadius:'8px', background:active?'rgba(99,102,241,.2)':'transparent', color:active?'#a5b4fc':'#94a3b8', textDecoration:'none', fontSize:'13px', fontWeight:active?600:400, transition:'all .15s', whiteSpace:'nowrap' }}>
                    <span style={{ fontSize:'17px', flexShrink:0 }}>{item.icon}</span>
                    {!collapsed && <span style={{ flex:1 }}>{item.label}</span>}
                    {active && !collapsed && <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#6366f1', flexShrink:0 }} />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Controls */}
        <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,.08)', flexShrink:0 }}>
          <button onClick={toggleDark} style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'8px 8px', borderRadius:'8px', background:'transparent', border:'none', color:'#64748b', cursor:'pointer', fontSize:'13px', marginBottom:'4px', transition:'background .15s' }}>
            <span style={{ fontSize:'16px', flexShrink:0 }}>{dark?'\u2600\uFE0F':'\u{1F319}'}</span>
            {!collapsed && <span>{dark?'Light Mode':'Dark Mode'}</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'8px 8px', borderRadius:'8px', background:'transparent', border:'none', color:'#475569', cursor:'pointer', fontSize:'13px', transition:'background .15s' }}>
            <span style={{ fontSize:'16px', flexShrink:0 }}>{collapsed?'\u00BB':'\u00AB'}</span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft:collapsed?'64px':'240px', flex:1, display:'flex', flexDirection:'column', transition:'margin .25s ease', minWidth:0 }}>
        {/* Header */}
        <header style={{ background:headerBg, borderBottom:'1px solid '+borderColor, padding:'0 24px', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:30, boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <Link href="/" target="_blank" style={{ display:'flex', alignItems:'center', gap:'6px', color:'#64748b', textDecoration:'none', fontSize:'13px', fontWeight:500 }}>
              <span>\u{1F310}</span> <span>View Site</span>
            </Link>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <span style={{ fontSize:'13px', color:'#64748b' }}>{user?.displayName||user?.username}</span>
            <div onClick={logout} style={{ width:'34px', height:'34px', borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer', title:'Logout', boxShadow:'0 2px 6px rgba(99,102,241,.4)' }}>
              {(user?.username||'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex:1, overflowY:'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}